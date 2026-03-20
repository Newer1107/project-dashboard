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

const adminUploadAssignmentsSchema = z.object({
  csvContent: z.string().min(1),
});

const adminUpdateProjectSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  domain: z.string().min(2),
  status: z.enum(["DRAFT", "ACTIVE", "UNDER_REVIEW", "COMPLETED", "ARCHIVED"]),
  maxGroupSize: z.number().min(1).max(10),
  startDate: z.string(),
  endDate: z.string(),
});

const adminUpdateMentorSchema = z.object({
  projectId: z.string().min(1),
  teacherId: z.string().min(1),
});

const adminUpsertMemberSchema = z.object({
  projectId: z.string().min(1),
  studentIdentifier: z.string().min(1),
  role: z.enum(["LEAD", "MEMBER"]).default("MEMBER"),
});

const adminUpdateMemberRoleSchema = z.object({
  projectId: z.string().min(1),
  studentId: z.string().min(1),
  role: z.enum(["LEAD", "MEMBER"]),
});

const adminRemoveMemberSchema = z.object({
  projectId: z.string().min(1),
  studentId: z.string().min(1),
});

async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

type CsvAssignmentRow = {
  email: string;
  projectName: string;
};

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  out.push(current.trim());
  return out;
}

function parseAssignmentCsv(csvContent: string): CsvAssignmentRow[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one data row.");
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const emailIndex = headers.findIndex((h) => h === "email");
  const projectNameIndex = headers.findIndex(
    (h) => h === "projectname" || h === "project_name" || h === "project name"
  );

  if (emailIndex === -1) {
    throw new Error("CSV must include an 'email' column.");
  }
  if (projectNameIndex === -1) {
    throw new Error("CSV must include a 'projectName' column.");
  }

  const rows: CsvAssignmentRow[] = [];
  for (const rawLine of lines.slice(1)) {
    const cols = parseCsvLine(rawLine);
    const rawEmail = cols[emailIndex]?.toLowerCase().trim();
    const projectName = cols[projectNameIndex]?.trim();
    if (!rawEmail) continue;
    if (!projectName) continue;

    const parsedEmail = z.string().email().safeParse(rawEmail);
    if (!parsedEmail.success) continue;

    rows.push({
      email: parsedEmail.data,
      projectName,
    });
  }

  if (rows.length === 0) {
    throw new Error("No valid rows found in CSV.");
  }

  const deduped = new Map<string, CsvAssignmentRow>();
  for (const row of rows) {
    deduped.set(`${row.email}::${row.projectName.toLowerCase()}`, row);
  }
  return Array.from(deduped.values());
}

function buildAssignmentEmailBody(projectTitle: string, loginOrRegisterUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
      <h2 style="color: #2563eb; margin-bottom: 12px;">Project Assignment Notification</h2>
      <p style="margin: 0 0 12px;">You have been assigned to <strong>${projectTitle}</strong>.</p>
      <p style="margin: 0 0 12px;">Please continue using the link below:</p>
      <p style="margin: 0 0 12px;"><a href="${loginOrRegisterUrl}" style="color: #2563eb;">${loginOrRegisterUrl}</a></p>
      <p style="margin: 0; color: #6b7280; font-size: 13px;">If this assignment is unexpected, contact your administrator.</p>
    </div>
  `;
}

export async function adminUploadProjectAssignments(data: z.infer<typeof adminUploadAssignmentsSchema>) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const adminId = session.user.id;

  const validated = adminUploadAssignmentsSchema.parse(data);
  const rows = parseAssignmentCsv(validated.csvContent);

  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
    take: 5000,
  });

  const projectsByLowerTitle = new Map<string, { id: string; title: string }>();
  for (const project of projects) {
    const key = project.title.toLowerCase().trim();
    // Prefer most recently updated project when duplicate titles exist.
    if (!projectsByLowerTitle.has(key)) {
      projectsByLowerTitle.set(key, project);
    }
  }

  const uniqueProjectNames = Array.from(
    new Set(rows.map((row) => row.projectName.trim()).filter(Boolean))
  );

  const missingProjectNames = uniqueProjectNames.filter(
    (name) => !projectsByLowerTitle.has(name.toLowerCase())
  );

  let createdProjects = 0;
  if (missingProjectNames.length > 0) {
    const now = new Date();
    const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const created = await Promise.all(
      missingProjectNames.map((projectName) =>
        prisma.project.create({
          data: {
            title: projectName,
            description: `Auto-created from CSV import on ${now.toISOString().slice(0, 10)}.`,
            domain: "GENERAL",
            startDate: now,
            endDate,
            teacherId: adminId,
            maxGroupSize: 4,
          },
          select: { id: true, title: true },
        })
      )
    );

    createdProjects = created.length;
    for (const project of created) {
      projectsByLowerTitle.set(project.title.toLowerCase().trim(), project);
    }
  }

  const resolvedRows = rows.filter((row) => projectsByLowerTitle.has(row.projectName.toLowerCase().trim()));

  if (resolvedRows.length === 0) {
    throw new Error("No valid assignment rows found in CSV.");
  }

  const unresolvedRows = rows.length - resolvedRows.length;

  const emails = resolvedRows.map((row) => row.email);
  const users = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { id: true, email: true },
  });
  const existingByEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));

  const existingRows = resolvedRows.filter((row) => existingByEmail.has(row.email));
  const newRows = resolvedRows.filter((row) => !existingByEmail.has(row.email));

  if (existingRows.length > 0) {
    await prisma.projectMember.createMany({
      data: existingRows.map((row) => ({
        projectId: projectsByLowerTitle.get(row.projectName.toLowerCase().trim())!.id,
        studentId: existingByEmail.get(row.email)!.id,
        role: "MEMBER",
      })),
      skipDuplicates: true,
    });
  }

  if (newRows.length > 0) {
    await prisma.pendingProjectAssignment.createMany({
      data: newRows.map((row) => ({
        projectId: projectsByLowerTitle.get(row.projectName.toLowerCase().trim())!.id,
        email: row.email,
        name: null,
        memberRole: "MEMBER",
        invitedById: adminId,
      })),
      skipDuplicates: true,
    });
  }

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const emailJobs = resolvedRows.map((row) => {
    const project = projectsByLowerTitle.get(row.projectName.toLowerCase().trim())!;
    const existingUser = existingByEmail.has(row.email);
    const actionUrl = existingUser
      ? `${appUrl}/login`
      : `${appUrl}/register?email=${encodeURIComponent(row.email)}`;

    return {
      to: row.email,
      subject: `Project Assignment: ${project.title}`,
      body: buildAssignmentEmailBody(project.title, actionUrl),
      status: "PENDING" as const,
    };
  });

  await prisma.emailQueue.createMany({ data: emailJobs });

  revalidatePath("/admin");
  revalidatePath("/admin/project-assignments");
  revalidatePath("/admin/email-logs");

  return {
    ok: true,
    totalRows: rows.length,
    matchedRows: resolvedRows.length,
    unresolvedRows,
    createdProjects,
    existingUsersAssigned: existingRows.length,
    invitedUsersQueued: newRows.length,
    emailsQueued: emailJobs.length,
  };
}

export async function getAdminAssignableProjects() {
  await requireAdminSession();

  return prisma.project.findMany({
    select: {
      id: true,
      title: true,
      domain: true,
      teacher: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });
}

export async function getAdminProjectsManagementData() {
  await requireAdminSession();

  const [projects, teachers, students] = await Promise.all([
    prisma.project.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        domain: true,
        status: true,
        maxGroupSize: true,
        startDate: true,
        endDate: true,
        updatedAt: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            studentId: true,
            role: true,
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                rollNumber: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 500,
    }),
    prisma.user.findMany({
      where: { role: "TEACHER", isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT", isActive: true },
      select: { id: true, name: true, email: true, rollNumber: true },
      orderBy: { name: "asc" },
      take: 2000,
    }),
  ]);

  return {
    projects,
    teachers,
    students,
  };
}

export async function adminUpdateProject(data: z.infer<typeof adminUpdateProjectSchema>) {
  await requireAdminSession();
  const validated = adminUpdateProjectSchema.parse(data);

  const project = await prisma.project.findUnique({ where: { id: validated.projectId } });
  if (!project) {
    throw new Error("Project not found");
  }

  await prisma.project.update({
    where: { id: validated.projectId },
    data: {
      title: validated.title,
      description: validated.description,
      domain: validated.domain,
      status: validated.status,
      maxGroupSize: validated.maxGroupSize,
      startDate: new Date(validated.startDate),
      endDate: new Date(validated.endDate),
    },
  });

  await updateProjectCompletion(validated.projectId);

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath(`/teacher/projects/${validated.projectId}`);
  revalidatePath(`/student/projects/${validated.projectId}`);

  return { ok: true };
}

export async function adminUpdateProjectMentor(data: z.infer<typeof adminUpdateMentorSchema>) {
  await requireAdminSession();
  const validated = adminUpdateMentorSchema.parse(data);

  const [project, teacher] = await Promise.all([
    prisma.project.findUnique({ where: { id: validated.projectId }, select: { id: true } }),
    prisma.user.findFirst({
      where: { id: validated.teacherId, role: "TEACHER", isActive: true },
      select: { id: true },
    }),
  ]);

  if (!project) {
    throw new Error("Project not found");
  }
  if (!teacher) {
    throw new Error("Teacher not found or inactive");
  }

  await prisma.project.update({
    where: { id: validated.projectId },
    data: { teacherId: validated.teacherId },
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/teacher/projects/${validated.projectId}`);
  return { ok: true };
}

export async function adminAddProjectMember(data: z.infer<typeof adminUpsertMemberSchema>) {
  await requireAdminSession();
  const validated = adminUpsertMemberSchema.parse(data);

  const project = await prisma.project.findUnique({
    where: { id: validated.projectId },
    include: { members: true },
  });
  if (!project) {
    throw new Error("Project not found");
  }

  if (project.members.length >= project.maxGroupSize) {
    throw new Error("Maximum group size reached");
  }

  const student = await prisma.user.findFirst({
    where: {
      role: "STUDENT",
      OR: [
        { id: validated.studentIdentifier },
        { email: validated.studentIdentifier },
        { rollNumber: validated.studentIdentifier },
      ],
    },
  });

  if (!student) {
    throw new Error("Student not found. Use student email, ID, or roll number.");
  }

  if (project.members.some((member) => member.studentId === student.id)) {
    throw new Error("Student is already a member of this project");
  }

  if (validated.role === "LEAD") {
    await prisma.projectMember.updateMany({
      where: { projectId: validated.projectId, role: "LEAD" },
      data: { role: "MEMBER" },
    });
  }

  await prisma.projectMember.create({
    data: {
      projectId: validated.projectId,
      studentId: student.id,
      role: validated.role,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/student/projects/${validated.projectId}`);
  return { ok: true };
}

export async function adminUpdateProjectMemberRole(data: z.infer<typeof adminUpdateMemberRoleSchema>) {
  await requireAdminSession();
  const validated = adminUpdateMemberRoleSchema.parse(data);

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_studentId: {
        projectId: validated.projectId,
        studentId: validated.studentId,
      },
    },
    select: { projectId: true, studentId: true },
  });

  if (!member) {
    throw new Error("Project member not found");
  }

  if (validated.role === "LEAD") {
    await prisma.projectMember.updateMany({
      where: { projectId: validated.projectId, role: "LEAD" },
      data: { role: "MEMBER" },
    });
  }

  await prisma.projectMember.update({
    where: {
      projectId_studentId: {
        projectId: validated.projectId,
        studentId: validated.studentId,
      },
    },
    data: { role: validated.role },
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/student/projects/${validated.projectId}`);
  return { ok: true };
}

export async function adminRemoveProjectMember(data: z.infer<typeof adminRemoveMemberSchema>) {
  await requireAdminSession();
  const validated = adminRemoveMemberSchema.parse(data);

  await prisma.projectMember.deleteMany({
    where: {
      projectId: validated.projectId,
      studentId: validated.studentId,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/student/projects/${validated.projectId}`);
  return { ok: true };
}

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
