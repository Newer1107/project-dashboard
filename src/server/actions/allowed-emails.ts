"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isEmailAllowed } from "@/lib/allowed-email";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const allowedEmailSchema = z.object({
  email: z.string().email(),
  expiresAt: z.string().datetime().optional(),
});

function assertAdmin(role: unknown) {
  if (role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function addAllowedEmail(data: z.infer<typeof allowedEmailSchema>) {
  const session = await auth();
  assertAdmin((session?.user as any)?.role);
  const adminId = session?.user?.id;
  if (!adminId) {
    throw new Error("Unauthorized");
  }

  const validated = allowedEmailSchema.parse(data);
  const normalizedEmail = validated.email.toLowerCase().trim();

  if (normalizedEmail.endsWith("@tcetmumbai.in")) {
    throw new Error("Institution domain is already globally allowed");
  }

  const result = await prisma.allowedEmail.upsert({
    where: { email: normalizedEmail },
    update: {
      expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
      addedBy: adminId,
    },
    create: {
      email: normalizedEmail,
      addedBy: adminId,
      expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
    },
  });

  revalidatePath("/admin/allowed-emails");
  return result;
}

export async function removeAllowedEmail(id: string) {
  const session = await auth();
  assertAdmin((session?.user as any)?.role);

  await prisma.allowedEmail.delete({ where: { id } });
  revalidatePath("/admin/allowed-emails");
}

export async function getAllowedEmails() {
  const session = await auth();
  assertAdmin((session?.user as any)?.role);

  return prisma.allowedEmail.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function checkAllowedEmail(email: string): Promise<boolean> {
  return isEmailAllowed(email);
}
