"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { updateProjectCompletion } from "@/lib/completion";

const createMilestoneSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string(),
  weight: z.number().min(1).max(100).default(10),
});

export async function createMilestone(data: z.infer<typeof createMilestoneSchema>) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  const validated = createMilestoneSchema.parse(data);
  const milestone = await prisma.milestone.create({
    data: {
      projectId: validated.projectId,
      title: validated.title,
      description: validated.description,
      dueDate: new Date(validated.dueDate),
      weight: validated.weight,
    },
  });

  revalidatePath(`/teacher/projects/${validated.projectId}/milestones`);
  return milestone;
}

export async function toggleMilestoneComplete(milestoneId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } });
  if (!milestone) throw new Error("Milestone not found");

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      isCompleted: !milestone.isCompleted,
      completedAt: !milestone.isCompleted ? new Date() : null,
    },
  });

  await updateProjectCompletion(milestone.projectId);
  revalidatePath(`/teacher/projects/${milestone.projectId}/milestones`);
}

export async function deleteMilestone(milestoneId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } });
  if (!milestone) throw new Error("Milestone not found");

  await prisma.milestone.delete({ where: { id: milestoneId } });
  revalidatePath(`/teacher/projects/${milestone.projectId}/milestones`);
}

export async function getProjectMilestones(projectId: string) {
  return prisma.milestone.findMany({
    where: { projectId },
    orderBy: { dueDate: "asc" },
  });
}
