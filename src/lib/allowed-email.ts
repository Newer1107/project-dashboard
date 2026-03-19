import { prisma } from "@/lib/prisma";

export async function isEmailAllowed(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();

  if (normalizedEmail.endsWith("@tcetmumbai.in")) {
    return true;
  }

  const allowed = await prisma.allowedEmail.findUnique({
    where: { email: normalizedEmail },
  });

  if (!allowed) {
    return false;
  }

  if (allowed.expiresAt && allowed.expiresAt < new Date()) {
    return false;
  }

  return true;
}
