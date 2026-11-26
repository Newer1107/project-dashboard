"use server";

import { prisma } from "@/lib/prisma";
import { requireCoeUser, requireRole } from "@/lib/coe-guard";
import { CreateMilestoneSchema } from "@/lib/validations/weekly-task";
import { WeeklyTaskStatus } from "@prisma/client";
import { z } from "zod";

const UpdateMilestoneSchema = CreateMilestoneSchema.extend({
  id: z.string().cuid(),
});

/**
 * Calculates project completion metrics across all assigned weekly milestones.
 */
export async function getProjectWeeklyMetrics(projectId: string) {
  const user = await requireCoeUser();
  if (!(await verifyGuideAccess(user.id, projectId))) {
    throw new Error("Unauthorized");
  }

  const submissions = await prisma.weeklyTaskSubmission.findMany({
    where: { projectId },
    select: { status: true },
  });

  const total = submissions.length;
  const approved = submissions.filter(
    (s) => s.status === WeeklyTaskStatus.APPROVED
  ).length;
  const underReview = submissions.filter(
    (s) => s.status === WeeklyTaskStatus.UNDER_REVIEW
  ).length;
  const pending = submissions.filter(
    (s) => s.status === WeeklyTaskStatus.PENDING
  ).length;

  return {
    totalWeeks: total,
    approvedWeeks: approved,
    underReviewWeeks: underReview,
    pendingWeeks: pending,
    completionPercentage: total > 0 ? Math.round((approved / total) * 100) : 0,
  };
}

/**
 * Utility to verify if a user has access to a project (as guide or member).
 */
export async function verifyGuideAccess(
  userId: string,
  projectId: string
): Promise<boolean> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { teacherId: userId },
        {
          members: {
            some: {
              studentId: userId,
            },
          },
        },
      ],
    },
    select: { id: true },
  });
  return Boolean(project);
}

/**
 * Fetches weekly task submissions for a project with milestone, evidence links, and sync meetings.
 */
export async function getProjectWeeklySubmissions(projectId: string) {
  const user = await requireCoeUser();
  if (!(await verifyGuideAccess(user.id, projectId))) {
    throw new Error("Unauthorized");
  }

  return await prisma.weeklyTaskSubmission.findMany({
    where: { projectId },
    include: {
      milestone: {
        select: {
          weekNumber: true,
          title: true,
          description: true,
          startDate: true,
          dueDate: true,
          checklists: {
            select: {
              text: true,
            },
          },
        },
      },
      evidenceLinks: true,
      syncMeetings: true,
    },
    orderBy: {
      milestone: {
        weekNumber: "asc",
      },
    },
  });
}

/**
 * Updates the status of a weekly task submission.
 * Only teachers (guides) of the project can change the status.
 */
export async function updateWeeklyTaskStatus(
  submissionId: string,
  status: WeeklyTaskStatus
) {
  const user = await requireRole("TEACHER");

  const submission = await prisma.weeklyTaskSubmission.findUnique({
    where: { id: submissionId },
    include: {
      project: {
        select: {
          id: true,
          teacherId: true,
        },
      },
    },
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  if (submission.project.teacherId !== user.id) {
    throw new Error("Unauthorized: not the teacher of this project");
  }

  await prisma.weeklyTaskSubmission.update({
    where: { id: submissionId },
    data: { status },
  });

  return { success: true };
}

/**
 * Assigns a single weekly milestone to all projects (Admin only).
 */
export async function assignWeeklyMilestoneToAllProjects(
  data: z.infer<typeof CreateMilestoneSchema>
) {
  await requireRole("ADMIN");

  const validatedData = CreateMilestoneSchema.parse(data);

  const milestone = await prisma.weeklyMilestone.upsert({
    where: { weekNumber: validatedData.weekNumber },
    update: {
      title: validatedData.title,
      description: validatedData.description,
      startDate: validatedData.startDate,
      dueDate: validatedData.dueDate,
      isBackdated: validatedData.isBackdated ?? false,
    },
    create: {
      weekNumber: validatedData.weekNumber,
      title: validatedData.title,
      description: validatedData.description,
      startDate: validatedData.startDate,
      dueDate: validatedData.dueDate,
      isBackdated: validatedData.isBackdated ?? false,
    },
  });

  await prisma.milestoneChecklistItem.deleteMany({
    where: { weeklyMilestoneId: milestone.id },
  });

  if (validatedData.checklists.length > 0) {
    await prisma.milestoneChecklistItem.createMany({
      data: validatedData.checklists.map((text) => ({
        text,
        weeklyMilestoneId: milestone.id,
      })),
    });
  }

  const projects = await prisma.project.findMany({
    select: { id: true },
  });

  const existingSubmissions = await prisma.weeklyTaskSubmission.findMany({
    where: { milestoneId: milestone.id },
    select: { projectId: true },
  });
  const existingProjectIds = new Set(
    existingSubmissions.map((sub) => sub.projectId)
  );

  const projectsToCreate = projects
    .filter((p) => !existingProjectIds.has(p.id))
    .map((p) => ({
      projectId: p.id,
      milestoneId: milestone.id,
      status: WeeklyTaskStatus.PENDING,
      workLog: null,
      feedback: null,
      submittedAt: null,
      reviewedAt: null,
    }));

  let createdSubmissionsCount = 0;
  if (projectsToCreate.length > 0) {
    const result = await prisma.weeklyTaskSubmission.createMany({
      data: projectsToCreate,
    });
    createdSubmissionsCount = result.count;
  }

  return {
    milestone,
    createdSubmissionsCount,
    totalProjects: projects.length,
    skippedProjects: existingSubmissions.length,
  };
}

/**
 * Batch create all 15 milestones from PDF schedule data (Admin only).
 */
export async function batchCreateMilestonesFromPDF() {
  await requireRole("ADMIN");

  const milestones = [
    {
      weekNumber: 1,
      title: "Project Orientation & Research Portal Dossier",
      description:
        "Complete project orientation and finalize the creation and submission of the project dossier on the Research Portal.",
      startDate: new Date("2026-06-15T00:00:00.000Z"),
      dueDate: new Date("2026-06-20T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Attend Project Orientation session",
        "Complete and submit Dossier on Research Portal",
      ],
    },
    {
      weekNumber: 2,
      title: "Refinement of Project Title",
      description:
        "Finalize and refine the project title, including necessary approvals for outhouse projects.",
      startDate: new Date("2026-06-22T00:00:00.000Z"),
      dueDate: new Date("2026-06-27T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Refine and finalize project title",
        "Obtain approval for Outhouse Project (if applicable)",
      ],
    },
    {
      weekNumber: 3,
      title: "Literature Survey, Gap Identification & System Definition",
      description:
        "Refine literature survey using AI tools by reviewing a minimum of 10 recent quality sources. Identify gap analysis, refine problem statement, objectives, scope, system architecture, flowchart, and expected results.",
      startDate: new Date("2026-06-29T00:00:00.000Z"),
      dueDate: new Date("2026-07-04T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Review minimum 10 recent quality papers/web articles/books using AI tools",
        "Identify research gaps (Current vs. Existing systems)",
        "Refine Problem Statement, Objectives, and System Scope",
        "Draft System Architecture Design and Algorithms Flowchart",
        "Define Expected Results",
      ],
    },
    {
      weekNumber: 4,
      title: "Project Planning & Feasibility Studies",
      description:
        "Prepare comprehensive project planning documentations including Gantt chart, RAD, and multiple feasibility/survey studies.",
      startDate: new Date("2026-07-06T00:00:00.000Z"),
      dueDate: new Date("2026-07-11T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Create Gantt Chart for project timeline",
        "Refine Requirements Analysis Document (RAD)",
        "Complete Technical and Financial Feasibility studies",
        "Conduct Market, Legal, and Societal Surveys",
      ],
    },
    {
      weekNumber: 5,
      title: "Presentation I, Evaluation & System Analysis Document (SAD)",
      description:
        "Complete Presentation I evaluation covering planning, literature survey, architecture, algorithms, and setup. Construct System Analysis Document (SAD) with functional, structural, and behavioral models.",
      startDate: new Date("2026-07-13T00:00:00.000Z"),
      dueDate: new Date("2026-07-18T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Complete Presentation I evaluation",
        "Present methodology, performance parameters, and software/hardware setup",
        "Form Functional Model (DFD) for SAD",
        "Form Structural and Behavioral Models for SAD",
      ],
    },
    {
      weekNumber: 6,
      title: "Design Document (DD) & Modular Breakdown",
      description:
        "Prepare Design Document detailing database, data structures, software architecture, and 6 well-defined implementation modules.",
      startDate: new Date("2026-07-20T00:00:00.000Z"),
      dueDate: new Date("2026-07-25T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Design Database and Data Structures",
        "Complete Software Architecture design",
        "Divide implementation into six well-defined functional modules",
      ],
    },
    {
      weekNumber: 7,
      title: "Platforms Finalization & Initial Implementation Progress",
      description:
        "Finalize programming languages, frameworks, databases, hardware, and tools. Begin implementation and present progress to guide.",
      startDate: new Date("2026-07-27T00:00:00.000Z"),
      dueDate: new Date("2026-08-01T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Finalize programming languages, frameworks, databases, and hardware/software tools",
        "Begin project development & implementation",
        "Present initial development progress to the project guide",
      ],
    },
    {
      weekNumber: 8,
      title: "Presentation II (60-70% Implementation)",
      description:
        "Conduct Presentation II evaluation focusing on 60-70% completed project implementation.",
      startDate: new Date("2026-08-03T00:00:00.000Z"),
      dueDate: new Date("2026-08-08T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Complete 60-70% of core system implementation",
        "Deliver Presentation II to evaluation committee",
      ],
    },
    {
      weekNumber: 9,
      title: "Blue Book & Research Paper First Draft",
      description:
        "Prepare first drafts of the project Blue Book and research paper intended for quality publication.",
      startDate: new Date("2026-08-10T00:00:00.000Z"),
      dueDate: new Date("2026-08-14T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Complete first draft of Blue Book",
        "Complete first draft of research paper",
      ],
    },
    {
      weekNumber: 10,
      title: "Research Paper Submission",
      description:
        "Submit research paper to target quality indexed journals (Scopus/SCIE/SCI/WoS).",
      startDate: new Date("2026-08-17T00:00:00.000Z"),
      dueDate: new Date("2026-08-22T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Target and format paper for Scopus/SCIE/SCI/WoS journal",
        "Submit research paper and obtain submission confirmation",
      ],
    },
    {
      weekNumber: 11,
      title: "Project Competition Identification",
      description:
        "Identify and shortlist project groups for participation in project competitions (Avishkar, Dipex, etc.).",
      startDate: new Date("2026-08-24T00:00:00.000Z"),
      dueDate: new Date("2026-08-29T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Identify relevant project competitions (Avishkar, Dipex, etc.)",
        "Nominate project group and submit required entries",
      ],
    },
    {
      weekNumber: 12,
      title: "Full Implementation Demonstration",
      description:
        "Demonstrate 100% complete technical implementation of the project to respective guides.",
      startDate: new Date("2026-08-31T00:00:00.000Z"),
      dueDate: new Date("2026-09-05T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Complete 100% software and hardware implementation",
        "Demonstrate fully working project to the guide",
      ],
    },
    {
      weekNumber: 13,
      title: "Presentation III (100% Implementation)",
      description:
        "Present final evaluation (Presentation III) based on 100% project completion.",
      startDate: new Date("2026-09-07T00:00:00.000Z"),
      dueDate: new Date("2026-09-12T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Deliver Presentation III to evaluation committee",
        "Obtain evaluation feedback on full system execution",
      ],
    },
    {
      weekNumber: 14,
      title: "Research Paper Refinement & Publication",
      description:
        "Address reviewer/editor feedback on submitted research paper and finalize publication.",
      startDate: new Date("2026-09-15T00:00:00.000Z"),
      dueDate: new Date("2026-09-19T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Revise paper based on reviewer/editor comments",
        "Complete publication process",
      ],
    },
    {
      weekNumber: 15,
      title: "Blue Book Submission (Part 1)",
      description:
        "Submit final Blue Book (Part 1) signed by Project Guide and HOP.",
      startDate: new Date("2026-09-21T00:00:00.000Z"),
      dueDate: new Date("2026-09-25T23:59:59.000Z"),
      isBackdated: false,
      checklists: [
        "Finalize Blue Book Part 1 document",
        "Obtain signature from Project Guide",
        "Obtain signature from HOP and submit report",
      ],
    },
  ];

  const createdMilestones: Array<{
    id: string;
    weekNumber: number;
    title: string;
    totalProjects: number;
  }> = [];

  const projects = await prisma.project.findMany({
    select: { id: true },
  });
  const totalProjects = projects.length;

  for (const m of milestones) {
    const milestone = await prisma.weeklyMilestone.upsert({
      where: { weekNumber: m.weekNumber },
      update: {
        title: m.title,
        description: m.description,
        startDate: m.startDate,
        dueDate: m.dueDate,
        isBackdated: m.isBackdated,
      },
      create: {
        weekNumber: m.weekNumber,
        title: m.title,
        description: m.description,
        startDate: m.startDate,
        dueDate: m.dueDate,
        isBackdated: m.isBackdated,
      },
    });

    await prisma.milestoneChecklistItem.deleteMany({
      where: { weeklyMilestoneId: milestone.id },
    });

    if (m.checklists.length > 0) {
      await prisma.milestoneChecklistItem.createMany({
        data: m.checklists.map((text) => ({
          text,
          weeklyMilestoneId: milestone.id,
        })),
      });
    }

    const existingSubmissions = await prisma.weeklyTaskSubmission.findMany({
      where: { milestoneId: milestone.id },
      select: { projectId: true },
    });
    const existingProjectIds = new Set(
      existingSubmissions.map((sub) => sub.projectId)
    );

    const submissions = projects
      .filter((p) => !existingProjectIds.has(p.id))
      .map((p) => ({
        projectId: p.id,
        milestoneId: milestone.id,
        status: WeeklyTaskStatus.PENDING,
        workLog: null,
        feedback: null,
        submittedAt: null,
        reviewedAt: null,
      }));

    if (submissions.length > 0) {
      await prisma.weeklyTaskSubmission.createMany({
        data: submissions,
      });
    }

    createdMilestones.push({
      id: milestone.id,
      weekNumber: milestone.weekNumber,
      title: milestone.title,
      totalProjects,
    });
  }

  return { success: true, createdMilestones, totalProjects };
}

/**
 * Fetches all weekly milestones with ordered checklists (Admin only).
 */
export async function getAllWeeklyMilestones() {
  await requireRole("ADMIN");

  return await prisma.weeklyMilestone.findMany({
    include: {
      checklists: {
        select: {
          text: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      weekNumber: "asc",
    },
  });
}

/**
 * Updates an existing weekly milestone and replaces its checklist items (Admin only).
 */
export async function updateWeeklyMilestone(
  data: z.infer<typeof UpdateMilestoneSchema>
) {
  await requireRole("ADMIN");
  const validated = UpdateMilestoneSchema.parse(data);

  const milestone = await prisma.weeklyMilestone.update({
    where: { id: validated.id },
    data: {
      weekNumber: validated.weekNumber,
      title: validated.title,
      description: validated.description ?? undefined,
      startDate: validated.startDate,
      dueDate: validated.dueDate,
      isBackdated: validated.isBackdated ?? false,
    },
  });

  await prisma.milestoneChecklistItem.deleteMany({
    where: { weeklyMilestoneId: milestone.id },
  });

  if (validated.checklists.length > 0) {
    await prisma.milestoneChecklistItem.createMany({
      data: validated.checklists.map((text) => ({
        text,
        weeklyMilestoneId: milestone.id,
      })),
    });
  }

  return milestone;
}

/**
 * Deletes a global weekly milestone by ID (Admin only).
 * Cascades to MilestoneChecklistItem and WeeklyTaskSubmission records.
 */
export async function deleteMilestone(milestoneId: string) {
  await requireRole("ADMIN");

  const milestone = await prisma.weeklyMilestone.findUnique({
    where: { id: milestoneId },
    select: { id: true },
  });

  if (!milestone) {
    throw new Error("Milestone not found");
  }

  await prisma.weeklyMilestone.delete({
    where: { id: milestoneId },
  });

  return { success: true };
}