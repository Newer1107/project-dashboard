"use server";

import { hash } from "bcryptjs";
import { createHash, randomInt, timingSafeEqual } from "crypto";
import { Role } from "@prisma/client";
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

type RequestOtpResult =
  | { ok: true; message: string; resendAfterSeconds: number }
  | { ok: false; message: string; resendAfterSeconds?: number };

type VerifyOtpActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

type CompleteRegistrationResult =
  | {
      ok: true;
      user: {
        id: string;
        name: string | null;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
      };
    }
  | { ok: false; message: string };

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

export async function requestOTP(data: z.infer<typeof requestOTPSchema>): Promise<RequestOtpResult> {
  const parsed = requestOTPSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  const validated = parsed.data;
  const email = normalizeEmail(validated.email);

  const existingOtp = await prisma.emailVerificationOTP.findUnique({ where: { email } });
  if (existingOtp) {
    const elapsed = Date.now() - existingOtp.createdAt.getTime();
    if (elapsed < OTP_COOLDOWN_MS) {
      const retryAfterSec = Math.ceil((OTP_COOLDOWN_MS - elapsed) / 1000);
      return {
        ok: false,
        message: `Please wait ${retryAfterSec}s before requesting another OTP.`,
        resendAfterSeconds: retryAfterSec,
      };
    }
  }

  const [alreadyRegistered, allowed] = await Promise.all([
    prisma.user.findUnique({ where: { email }, select: { id: true } }),
    isEmailAllowed(email),
  ]);

  if (!allowed) {
    return { ok: false, message: "This email is not authorized for registration., please use an allowed institutional email." };
  }

  if (alreadyRegistered) {
    return { ok: false, message: "Email already registered. Please sign in." };
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
    return {
      ok: false,
      message: error?.message || "Could not send OTP email. Please try again.",
    };
  }

  return {
    ok: true,
    message: "OTP sent successfully.",
    resendAfterSeconds: 60,
  };
}

export async function verifyOTP(data: z.infer<typeof verifyOTPSchema>) {
  const parsed = verifyOTPSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: "Invalid OTP format." } as VerifyOtpActionResult;
  }
  const validated = parsed.data;
  const email = normalizeEmail(validated.email);

  const result = await verifyOtpInternal(email, validated.otp);
  if (!result.ok) {
    return { ok: false, message: result.message } as VerifyOtpActionResult;
  }

  return { ok: true, message: result.message } as VerifyOtpActionResult;
}

export async function completeRegistration(
  data: z.infer<typeof completeRegistrationSchema>
): Promise<CompleteRegistrationResult> {
  const parsed = completeRegistrationSchema.safeParse(data);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Invalid registration details.";
    return { ok: false, message };
  }
  const validated = parsed.data;
  const email = normalizeEmail(validated.email);

  if (!(await isEmailAllowed(email))) {
    return { ok: false, message: "This email is not authorized for registration, please use an allowed institutional email." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, message: "Email already registered. Please sign in." };
  }

  const otpResult = await verifyOtpInternal(email, validated.otp, { consumeOnSuccess: true });
  if (!otpResult.ok) {
    return { ok: false, message: otpResult.message };
  }

  const passwordHash = await hash(validated.password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
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

    const pendingAssignments = await tx.pendingProjectAssignment.findMany({
      where: {
        email,
        status: "PENDING",
      },
      select: {
        projectId: true,
        memberRole: true,
      },
    });

    if (pendingAssignments.length > 0) {
      await tx.projectMember.createMany({
        data: pendingAssignments.map((assignment) => ({
          projectId: assignment.projectId,
          studentId: createdUser.id,
          role: assignment.memberRole,
        })),
        skipDuplicates: true,
      });

      await tx.pendingProjectAssignment.updateMany({
        where: {
          email,
          status: "PENDING",
        },
        data: {
          status: "ASSIGNED",
        },
      });
    }

    return createdUser;
  });

  try {
    await sendRegistrationEmail(email, validated.name);
  } catch {
    // Registration has already succeeded; email failure should not block login.
  }

  return { ok: true, user };
}

export async function registerUser(data: z.infer<typeof registrationSchema>) {
  void registrationSchema.parse(data);
  throw new Error("Registration now requires OTP verification. Use requestOTP and completeRegistration.");
}
