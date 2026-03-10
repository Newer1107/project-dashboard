"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createBulkNotifications } from "@/lib/notifications";
import { updateProjectCompletion } from "@/lib/completion";

const createProjectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  domain: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  maxGroupSize: z.number().min(1).max(10).default(4),
  tagIds: z.array(z.string()).optional(),
});

export async function createProject(data: z.infer<typeof createProjectSchema>) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  const validated = createProjectSchema.parse(data);
  const project = await prisma.project.create({
    data: {
      title: validated.title,
      description: validated.description,
      domain: validated.domain,
      startDate: new Date(validated.startDate),
      endDate: new Date(validated.endDate),
      maxGroupSize: validated.maxGroupSize,
      teacherId: session.user.id,
      tags: validated.tagIds?.length
        ? { create: validated.tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
  });

  revalidatePath("/teacher/projects");
  return project;
}

export async function updateProject(
  projectId: string,
  data: Partial<z.infer<typeof createProjectSchema>> & { status?: string }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.teacherId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.domain && { domain: data.domain }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.maxGroupSize && { maxGroupSize: data.maxGroupSize }),
      ...(data.status && { status: data.status as any }),
    },
  });

  // Notify members about project update
  const members = await prisma.projectMember.findMany({
    where: { projectId },
    select: { studentId: true },
  });
  if (members.length > 0) {
    await createBulkNotifications(
      members.map((m) => m.studentId),
      {
        type: "PROJECT_UPDATED",
        title: "Project Updated",
        message: `${updated.title} has been updated`,
        link: `/student/projects/${projectId}`,
      }
    );
  }

  revalidatePath(`/teacher/projects/${projectId}`);
  revalidatePath("/teacher/projects");
  return updated;
}

export async function deleteProject(projectId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.teacherId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/teacher/projects");
}

export async function duplicateProject(projectId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  const original = await prisma.project.findUnique({
    where: { id: projectId },
    include: { tags: true, milestones: true },
  });

  if (!original || original.teacherId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  const clone = await prisma.project.create({
    data: {
      title: `${original.title} (Copy)`,
      description: original.description,
      domain: original.domain,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 86400000),
      maxGroupSize: original.maxGroupSize,
      teacherId: session.user.id,
      tags: {
        create: original.tags.map((t) => ({ tagId: t.tagId })),
      },
    },
  });

  revalidatePath("/teacher/projects");
  return clone;
}

export async function addProjectMember(
  projectId: string,
  studentIdentifier: string,
  role: "LEAD" | "MEMBER" = "MEMBER"
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  if (!project || project.teacherId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  if (project.members.length >= project.maxGroupSize) {
    throw new Error("Maximum group size reached");
  }

  const student = await prisma.user.findFirst({
    where: {
      role: "STUDENT",
      OR: [
        { id: studentIdentifier },
        { email: studentIdentifier },
        { rollNumber: studentIdentifier }
      ]
    }
  });

  if (!student) {
    throw new Error("Student not found. Please provide a valid email, ID, or Roll Number.");
  }

  if (project.members.some(m => m.studentId === student.id)) {
    throw new Error("Student is already a member of this project");
  }

  await prisma.projectMember.create({
    data: { projectId, studentId: student.id, role },
  });

  revalidatePath(`/teacher/projects/${projectId}/members`);
}

export async function removeProjectMember(projectId: string, studentId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  await prisma.projectMember.deleteMany({
    where: { projectId, studentId },
  });

  revalidatePath(`/teacher/projects/${projectId}/members`);
}

export async function setProjectLead(projectId: string, studentId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction([
    prisma.projectMember.updateMany({
      where: { projectId, role: "LEAD" },
      data: { role: "MEMBER" },
    }),
    prisma.projectMember.update({
      where: { projectId_studentId: { projectId, studentId } },
      data: { role: "LEAD" },
    }),
  ]);

  revalidatePath(`/teacher/projects/${projectId}/members`);
}

export async function getTeacherProjects(teacherId: string) {
  return prisma.project.findMany({
    where: { teacherId },
    include: {
      members: {
        include: {
          student: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      },
      tags: { include: { tag: true } },
      _count: {
        select: { tasks: true, milestones: true, reviews: true, files: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectById(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      teacher: {
        select: { id: true, name: true, email: true, department: true },
      },
      members: {
        include: {
          student: {
            select: { id: true, name: true, email: true, rollNumber: true, avatarUrl: true },
          },
        },
      },
      tags: { include: { tag: true } },
      _count: {
        select: { tasks: true, milestones: true, reviews: true, files: true },
      },
    },
  });
}

export async function getStudentProjects(studentId: string) {
  return prisma.project.findMany({
    where: {
      members: { some: { studentId } },
    },
    include: {
      teacher: {
        select: { id: true, name: true, department: true },
      },
      members: {
        include: {
          student: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      },
      tags: { include: { tag: true } },
      _count: {
        select: { tasks: true, milestones: true, reviews: true, files: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getTeacherDashboardStats(teacherId: string) {
  const projects = await prisma.project.findMany({
    where: { teacherId },
    select: {
      status: true,
      completionPercentage: true,
    },
  });

  const reviewsDue = await prisma.review.count({
    where: {
      project: { teacherId },
      status: "SCHEDULED",
      scheduledAt: { lte: new Date(Date.now() + 7 * 86400000) },
    },
  });

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
  const avgCompletion =
    totalProjects > 0
      ? Math.round(
          projects.reduce((sum, p) => sum + p.completionPercentage, 0) / totalProjects
        )
      : 0;

  return { totalProjects, activeProjects, averageCompletion: avgCompletion, reviewsDue };
}

export async function getStudentDashboardStats(studentId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [projects, tasksDueToday, completedTasks, allTasks] = await Promise.all([
    prisma.projectMember.count({ where: { studentId } }),
    prisma.task.count({
      where: {
        assignedToId: studentId,
        dueDate: { gte: today, lt: tomorrow },
        status: { not: "DONE" },
      },
    }),
    prisma.task.count({ where: { assignedToId: studentId, status: "DONE" } }),
    prisma.task.count({ where: { assignedToId: studentId } }),
  ]);

  const overallProgress = allTasks > 0 ? Math.round((completedTasks / allTasks) * 100) : 0;

  return { totalProjects: projects, tasksDueToday, completedTasks, overallProgress };
}

export async function getAllTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function createTag(name: string, color: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "TEACHER"].includes((session.user as any).role)) {
    throw new Error("Unauthorized");
  }

  return prisma.tag.create({ data: { name, color } });
}
