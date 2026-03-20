"use server";

import { hash } from "bcryptjs";
import { createHash, randomInt, timingSafeEqual } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isEmailAllowed } from "@/lib/allowed-email";
import { sendEmailVerificationOTP, sendRegistrationEmail } from "@/lib/email";

const registrationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "TEACHER"]).default("STUDENT"),
});

const requestOTPSchema = z.object({
  email: z.string().email(),
});

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/),
});

const completeRegistrationSchema = registrationSchema.extend({
  otp: z.string().regex(/^\d{6}$/),
});

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

function hashOtp(email: string, otp: string): string {
  const pepper = process.env.OTP_HASH_SECRET || process.env.NEXTAUTH_SECRET || "otp-default-pepper";
  return createHash("sha256")
    .update(`${normalizeEmail(email)}:${otp}:${pepper}`)
    .digest("hex");
}

function otpMatches(email: string, otp: string, expectedHash: string): boolean {
  const actualHash = hashOtp(email, otp);
  const actual = Buffer.from(actualHash, "utf8");
  const expected = Buffer.from(expectedHash, "utf8");
  if (actual.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(actual, expected);
}

type VerifyResult = {
  ok: boolean;
  message: string;
};

async function verifyOtpInternal(
  email: string,
  otp: string,
  options?: { consumeOnSuccess?: boolean }
): Promise<VerifyResult> {
  const normalizedEmail = normalizeEmail(email);
  const record = await prisma.emailVerificationOTP.findUnique({
    where: { email: normalizedEmail },
  });

  if (!record) {
    return { ok: false, message: "Invalid or expired OTP" };
  }

  if (record.expiresAt < new Date()) {
    await prisma.emailVerificationOTP.delete({ where: { email: normalizedEmail } }).catch(() => {});
    return { ok: false, message: "OTP expired. Request a new code." };
  }

  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    return { ok: false, message: "Too many failed attempts. Request a new OTP." };
  }

  if (!otpMatches(normalizedEmail, otp, record.otpHash)) {
    await prisma.emailVerificationOTP.update({
      where: { email: normalizedEmail },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, message: "Invalid OTP" };
  }

  if (options?.consumeOnSuccess) {
    await prisma.emailVerificationOTP.delete({ where: { email: normalizedEmail } });
  }
  return { ok: true, message: "OTP verified" };
}

export async function requestOTP(data: z.infer<typeof requestOTPSchema>) {
  const validated = requestOTPSchema.parse(data);
  const email = normalizeEmail(validated.email);

  const existingOtp = await prisma.emailVerificationOTP.findUnique({ where: { email } });
  if (existingOtp) {
    const elapsed = Date.now() - existingOtp.createdAt.getTime();
    if (elapsed < OTP_COOLDOWN_MS) {
      const retryAfterSec = Math.ceil((OTP_COOLDOWN_MS - elapsed) / 1000);
      throw new Error(`Please wait ${retryAfterSec}s before requesting another OTP.`);
    }
  }

  const [alreadyRegistered, allowed] = await Promise.all([
    prisma.user.findUnique({ where: { email }, select: { id: true } }),
    isEmailAllowed(email),
  ]);

  if (!allowed) {
    throw new Error("This email is not authorized for registration.");
  }

  if (alreadyRegistered) {
    throw new Error("Email already registered. Please sign in.");
  }

  const otp = generateOtp();
  const otpHash = hashOtp(email, otp);
  const now = new Date();

  await prisma.emailVerificationOTP.upsert({
    where: { email },
    create: {
      email,
      otpHash,
      expiresAt: new Date(now.getTime() + OTP_TTL_MS),
      attempts: 0,
      createdAt: now,
    },
    update: {
      otpHash,
      expiresAt: new Date(now.getTime() + OTP_TTL_MS),
      attempts: 0,
      createdAt: now,
    },
  });

  try {
    await sendEmailVerificationOTP(email, otp);
  } catch (error: any) {
    await prisma.emailVerificationOTP.delete({ where: { email } }).catch(() => {});
    throw new Error(error?.message || "Could not send OTP email. Please try again.");
  }

  return {
    ok: true,
    message: "OTP sent successfully.",
    resendAfterSeconds: 60,
  };
}

export async function verifyOTP(data: z.infer<typeof verifyOTPSchema>) {
  const validated = verifyOTPSchema.parse(data);
  const email = normalizeEmail(validated.email);

  const result = await verifyOtpInternal(email, validated.otp);
  if (!result.ok) {
    throw new Error(result.message);
  }

  return { ok: true, message: result.message };
}

export async function completeRegistration(data: z.infer<typeof completeRegistrationSchema>) {
  const validated = completeRegistrationSchema.parse(data);
  const email = normalizeEmail(validated.email);

  if (!(await isEmailAllowed(email))) {
    throw new Error("This email is not authorized for registration.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already registered. Please sign in.");
  }

  const otpResult = await verifyOtpInternal(email, validated.otp, { consumeOnSuccess: true });
  if (!otpResult.ok) {
    throw new Error(otpResult.message);
  }

  const passwordHash = await hash(validated.password, 12);

  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email,
      passwordHash,
      role: validated.role,
      isActive: validated.role === "TEACHER" ? false : true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  await sendRegistrationEmail(email, validated.name);
  return user;
}

export async function registerUser(data: z.infer<typeof registrationSchema>) {
  void registrationSchema.parse(data);
  throw new Error("Registration now requires OTP verification. Use requestOTP and completeRegistration.");
}
