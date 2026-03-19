"use server";

import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isEmailAllowed } from "@/lib/allowed-email";
import { sendRegistrationEmail } from "@/lib/email";

const registrationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "TEACHER"]).default("STUDENT"),
});

export async function registerUser(data: z.infer<typeof registrationSchema>) {
  const validated = registrationSchema.parse(data);
  const email = validated.email.toLowerCase().trim();

  if (!(await isEmailAllowed(email))) {
    throw new Error("Unauthorized email domain");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hash(validated.password, 12);

  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email,
      passwordHash,
      role: validated.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  await sendRegistrationEmail(email, validated.name);
  return user;
}
