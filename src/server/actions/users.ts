"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hash } from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
  department: z.string().optional(),
  rollNumber: z.string().optional(),
});

export async function createUser(data: z.infer<typeof createUserSchema>) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = createUserSchema.parse(data);
  const existing = await prisma.user.findUnique({ where: { email: validated.email } });
  if (existing) throw new Error("Email already exists");

  const passwordHash = await hash(validated.password, 12);
  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      passwordHash,
      role: validated.role,
      department: validated.department,
      rollNumber: validated.rollNumber,
    },
  });

  revalidatePath("/admin/users");
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function toggleUserActive(userId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  revalidatePath("/admin/users");
}

export async function getUsers(role?: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.user.findMany({
    where: role ? { role: role as any } : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      rollNumber: true,
      isActive: true,
      createdAt: true,
      _count: { select: { memberships: true, managedProjects: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStudents() {
  return prisma.user.findMany({
    where: { role: "STUDENT", isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      rollNumber: true,
      department: true,
      avatarUrl: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getTeachers() {
  return prisma.user.findMany({
    where: { role: "TEACHER", isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
    },
    orderBy: { name: "asc" },
  });
}
