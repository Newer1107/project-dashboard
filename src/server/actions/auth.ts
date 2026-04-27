"use server";

import { hash } from "bcryptjs";
import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isEmailAllowed } from "@/lib/allowed-email";
import {
  sendEmailVerificationOTP,
  sendPasswordResetEmail,
  sendRegistrationEmail,
} from "@/lib/email";

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

const requestPasswordResetSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
const RESET_TOKEN_COOLDOWN_MS = 60 * 1000;

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

function resetTokenSecret(): string {
  return (
    process.env.PASSWORD_RESET_TOKEN_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "password-reset-default-secret"
  );
}

function hashResetToken(token: string): string {
  return createHash("sha256").update(`${token}:${resetTokenSecret()}`).digest("hex");
}

function getAppBaseUrl(): string {
  const raw =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
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

type PasswordResetRequestResult = {
  ok: true;
  message: string;
};

type ResetPasswordResult =
  | { ok: true; message: string }
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
    return { ok: false, message: "This email is not authorized for registration, please use an allowed institutional email." };
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

export async function requestPasswordReset(
  data: z.infer<typeof requestPasswordResetSchema>
): Promise<PasswordResetRequestResult> {
  const genericSuccessMessage =
    "If an account exists for this email, a password reset link has been sent.";

  const parsed = requestPasswordResetSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: true, message: genericSuccessMessage };
  }

  const email = normalizeEmail(parsed.data.email);
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return { ok: true, message: genericSuccessMessage };
  }

  const latestToken = await prisma.passwordResetToken.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  if (latestToken) {
    const elapsed = Date.now() - latestToken.createdAt.getTime();
    if (elapsed < RESET_TOKEN_COOLDOWN_MS) {
      return { ok: true, message: genericSuccessMessage };
    }
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(token);
  const now = new Date();

  await prisma.passwordResetToken.updateMany({
    where: {
      email,
      consumedAt: null,
    },
    data: { consumedAt: now },
  });

  const record = await prisma.passwordResetToken.create({
    data: {
      email,
      tokenHash,
      expiresAt: new Date(now.getTime() + RESET_TOKEN_TTL_MS),
    },
    select: { id: true },
  });

  const resetUrl = `${getAppBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;

  try {
    await sendPasswordResetEmail(email, resetUrl);
  } catch (error) {
    console.error("[auth] Failed to send password reset email", error);
    await prisma.passwordResetToken.delete({ where: { id: record.id } }).catch(() => {});
  }

  return { ok: true, message: genericSuccessMessage };
}

export async function resetPassword(
  data: z.infer<typeof resetPasswordSchema>
): Promise<ResetPasswordResult> {
  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Invalid reset payload.",
    };
  }

  const tokenHash = hashResetToken(parsed.data.token);

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      email: true,
      expiresAt: true,
      consumedAt: true,
    },
  });

  if (!resetRecord || resetRecord.consumedAt || resetRecord.expiresAt < new Date()) {
    return { ok: false, message: "Reset link is invalid or expired." };
  }

  const user = await prisma.user.findUnique({
    where: { email: resetRecord.email },
    select: { id: true },
  });

  if (!user) {
    await prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { consumedAt: new Date() },
    });
    return { ok: false, message: "Reset link is invalid or expired." };
  }

  const passwordHash = await hash(parsed.data.password, 12);
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await tx.passwordResetToken.updateMany({
      where: {
        email: resetRecord.email,
        consumedAt: null,
      },
      data: { consumedAt: now },
    });
  });

  return { ok: true, message: "Password reset successful. Please sign in." };
}

export async function registerUser(data: z.infer<typeof registrationSchema>) {
  void registrationSchema.parse(data);
  throw new Error("Registration now requires OTP verification. Use requestOTP and completeRegistration.");
}
