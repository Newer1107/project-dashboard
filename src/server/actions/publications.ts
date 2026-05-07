"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createBulkNotifications, createNotification } from "@/lib/notifications";
import { requireRole } from "@/lib/coe-guard";
import { revalidatePath } from "next/cache";
import { PublicationType, PublicationStatus, IndexingType } from "@prisma/client";

// Enums
const PublicationTypeEnum = z.enum(["PAPER", "PATENT", "BOOK_CHAPTER", "COPYRIGHT", "REVIEW"]);
const IndexingTypeEnum = z.enum(["SCOPUS", "SCI", "WEB_OF_SCIENCE", "UGC_CARE", "NONE"]);

// Schemas
const createPublicationSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  authors: z.array(z.string()).min(1, "At least one author is required"),
  publicationType: PublicationTypeEnum,
  subType: z.string().optional(),
  journalName: z.string().optional(),
  conferenceName: z.string().optional(),
  bookTitle: z.string().optional(),
  publisher: z.string().optional(),
  doi: z.string().optional(),
  indexingType: IndexingTypeEnum.optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  publicationDate: z.string().transform((str) => new Date(str)),
  proofUrl: z.string().optional(),
  remarks: z.string().optional(),
});

const updatePublicationSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  authors: z.array(z.string()).optional(),
  publicationType: PublicationTypeEnum.optional(),
  subType: z.string().optional(),
  journalName: z.string().optional(),
  conferenceName: z.string().optional(),
  bookTitle: z.string().optional(),
  publisher: z.string().optional(),
  doi: z.string().optional(),
  indexingType: IndexingTypeEnum.optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  publicationDate: z.string().transform((str) => new Date(str)).optional(),
  proofUrl: z.string().optional(),
  remarks: z.string().optional(),
});

const approveRejectSchema = z.object({
  publicationId: z.string().min(1),
});

// Actions
export async function createPublication(data: z.infer<typeof createPublicationSchema>) {

  const user = await requireRole(["TEACHER"]); 

  // 2. Check if the teacher owns the project instead of checking student membership
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
    select: { teacherId: true, title: true }
  });

  if (!project || project.teacherId !== user.id) {
    throw new Error("You are not the teacher for this project");
  }

  const publication = await prisma.publication.create({
    data: {
      projectId: data.projectId,
      title: data.title,
      authors: data.authors.join(", "), 
      publicationType: data.publicationType,
      subType: data.subType,
      indexingType: data.indexingType || "NONE",
      uniqueIdentifier: data.doi, 
      detailsJson: {              
        journalName: data.journalName,
        conferenceName: data.conferenceName,
        bookTitle: data.bookTitle,
        publisher: data.publisher,
        volume: data.volume,
        issue: data.issue,
        pages: data.pages,
        proofUrl: data.proofUrl,
        remarks: data.remarks,
      },
      publicationDate: data.publicationDate,
      enteredById: user.id,       
      status: PublicationStatus.PENDING,
    },
  });

  const adminIds = await prisma.user.findMany({
    where: { role: "ADMIN", isActive: true },
    select: { id: true },
  });

  if (adminIds.length > 0) {
    await createBulkNotifications(
      adminIds.map((admin) => admin.id),
      {
        type: "PROJECT_UPDATED",
        title: "Publication draft added",
        message: `A new publication draft was added to ${project.title}`,
        link: "/admin/projects?publications=all",
      }
    );
  }

  revalidatePath(`/teacher/projects/${data.projectId}`);
  return publication;
}

export async function updatePublication(data: z.infer<typeof updatePublicationSchema>) {
  const user = await requireRole(["STUDENT"]);

  const publication = await prisma.publication.findUnique({
    where: { id: data.id },
  });

  if (!publication) {
    throw new Error("Publication not found");
  }

  if (publication.enteredById !== user.id || publication.status !== PublicationStatus.PENDING) {
    throw new Error("Cannot update this publication");
  }

  const updated = await prisma.publication.update({
    where: { id: data.id },
    data: {
      title: data.title,
      authors: data.authors ? data.authors.join(", ") : undefined,
      publicationType: data.publicationType,
      subType: data.subType,
      indexingType: data.indexingType,
      uniqueIdentifier: data.doi,
      detailsJson: {
        journalName: data.journalName,
        conferenceName: data.conferenceName,
        bookTitle: data.bookTitle,
        publisher: data.publisher,
        volume: data.volume,
        issue: data.issue,
        pages: data.pages,
        proofUrl: data.proofUrl,
        remarks: data.remarks,
      },
      publicationDate: data.publicationDate,
    },
  });

  revalidatePath(`/teacher/projects/${publication.projectId}`);
  revalidatePath(`/student/projects/${publication.projectId}`);

  return updated;
}

export async function submitPublication(publicationId: string) {
  const user = await requireRole(["STUDENT"]);

  const publication = await prisma.publication.findUnique({
    where: { id: publicationId },
  });

  if (!publication || publication.enteredById !== user.id) {
    throw new Error("Publication not found or access denied");
  }

  if (publication.status !== PublicationStatus.PENDING) {
    return publication;
  }

  return publication;
}
export async function approvePublication(data: z.infer<typeof approveRejectSchema>) {

  const user = await requireRole(["ADMIN"]); 

  const publication = await prisma.publication.findUnique({
    where: { id: data.publicationId }
  });

  if (!publication) {
    throw new Error("Publication not found");
  }

  // 2. Removed the teacherId check since Admins have global approval rights

  const score = await calculatePublicationScore(publication.publicationType, publication.subType ?? undefined);

  const updated = await prisma.publication.update({
    where: { id: data.publicationId },
    data: {
      status: PublicationStatus.APPROVED,
      approvedById: user.id,
      approvedAt: new Date(),
      score, 
    },
  });

  const project = await prisma.project.findUnique({
    where: { id: publication.projectId },
    select: {
      id: true,
      title: true,
      teacherId: true,
      members: { select: { studentId: true } },
    },
  });

  if (project) {
    await createNotification({
      userId: project.teacherId,
      type: "PROJECT_UPDATED",
      title: "Publication approved",
      message: `A publication draft for ${project.title} was approved`,
      link: `/teacher/projects/${project.id}?tab=publications`,
    });

    const studentIds = project.members.map((member) => member.studentId);
    if (studentIds.length > 0) {
      await createBulkNotifications(studentIds, {
        type: "PROJECT_UPDATED",
        title: "Publication approved",
        message: `A publication draft for ${project.title} was approved`,
        link: `/student/projects/${project.id}?tab=publications`,
      });
    }

    revalidatePath(`/student/projects/${project.id}`);
  }

  revalidatePath(`/teacher/projects/${publication.projectId}`);
  revalidatePath(`/publications`);

  return updated;
}

export async function rejectPublication(data: z.infer<typeof approveRejectSchema>) {
  // 1. Change role to ADMIN
  const user = await requireRole(["ADMIN"]);

  const publication = await prisma.publication.findUnique({
    where: { id: data.publicationId }
  });

  if (!publication) {
    throw new Error("Publication not found");
  }

  // 2. Removed the teacherId check

  const updated = await prisma.publication.update({
    where: { id: data.publicationId },
    data: {
      status: PublicationStatus.REJECTED,
      approvedById: user.id,
      approvedAt: new Date(),
    },
  });

  revalidatePath(`/teacher/projects/${publication.projectId}`);

  return updated;
}

export async function getProjectPublications(projectId: string) {
  const user = await requireRole(["ADMIN", "TEACHER", "STUDENT"]);

  if (user.role === "STUDENT") {
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_studentId: {
          projectId,
          studentId: user.id,
        },
      },
    });
    if (!membership) {
      throw new Error("Access denied");
    }
  }

  if (user.role === "TEACHER") {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { teacherId: true },
    });
    if (!project || project.teacherId !== user.id) {
      throw new Error("Access denied");
    }
  }

  return prisma.publication.findMany({
    where: { projectId },
    include: {
      enteredBy: { select: { id: true, name: true } }, // Fixed: submittedBy -> enteredBy
      approvedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllPublications(status?: "APPROVED" | "ALL") {
  await requireRole(["ADMIN", "TEACHER", "STUDENT"]);

  // Fixed: strict typing for status
  const where = status === "APPROVED" ? { status: PublicationStatus.APPROVED } : {};

  return prisma.publication.findMany({
    where,
    include: {
      project: {
        select: {
          id: true,
          title: true,
          teacher: { select: { name: true } },
          members: {
            select: {
              student: { select: { name: true } },
            },
          },
        },
      },
      enteredBy: { select: { id: true, name: true } }, // Fixed: submittedBy -> enteredBy
    },
    orderBy: { publicationDate: "desc" },
  });
}

export async function getPendingPublicationsCount() {
  await requireRole(["ADMIN"]);

  return prisma.publication.count({
    where: { status: PublicationStatus.PENDING },
  });
}

export async function getUserPublications(userId: string) {
  const user = await requireRole(["ADMIN", "TEACHER", "STUDENT"]);

  if (user.role !== "ADMIN" && user.id !== userId) {
    throw new Error("Access denied");
  }

  return prisma.publication.findMany({
    where: { enteredById: userId }, // Fixed: submittedById -> enteredById
    include: {
      project: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectPublicationSummary(projectId: string) {
  const user = await requireRole(["ADMIN", "TEACHER", "STUDENT"]);

  if (user.role === "STUDENT") {
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_studentId: {
          projectId,
          studentId: user.id,
        },
      },
    });
    if (!membership) throw new Error("Access denied");
  } else if (user.role === "TEACHER") {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { teacherId: true },
    });
    if (!project || project.teacherId !== user.id) throw new Error("Access denied");
  }

  const publications = await prisma.publication.findMany({
    where: { projectId, status: PublicationStatus.APPROVED },
    select: { score: true },
  });

  const totalScore = publications.reduce((sum, pub) => sum + (pub.score || 0), 0);

  const memberCount = await prisma.projectMember.count({
    where: { projectId },
  });

  return {
    totalPublications: publications.length,
    approvedPublications: publications.length, // Added this field to fix ts(2339) in UI
    totalScore,
    studentScore: memberCount > 0 ? totalScore / memberCount : 0,
  };
}

export async function calculatePublicationScore(publicationType: string, subType?: string): Promise<number> {
  const config = await prisma.publicationScoreConfig.findUnique({
    where: {
      publicationType_subType: {
        publicationType: publicationType as PublicationType,
        subType: subType || "",
      },
    },
  });

  return config?.score || 0;
}

export async function seedPublicationScoreConfigs() {
  const configs = [
    { publicationType: PublicationType.PAPER, subType: "Indexed", score: 10 },
    { publicationType: PublicationType.PAPER, subType: "Non-Indexed", score: 6 },
    { publicationType: PublicationType.REVIEW, subType: "", score: 5 },
    { publicationType: PublicationType.BOOK_CHAPTER, subType: "", score: 8 },
    { publicationType: PublicationType.PATENT, subType: "Filed", score: 10 },
    { publicationType: PublicationType.PATENT, subType: "Published", score: 15 },
    { publicationType: PublicationType.PATENT, subType: "Granted", score: 25 },
    { publicationType: PublicationType.COPYRIGHT, subType: "", score: 4 },
  ];

  for (const config of configs) {
    await prisma.publicationScoreConfig.upsert({
      where: {
        publicationType_subType: {
          publicationType: config.publicationType,
          subType: config.subType,
        },
      },
      update: { score: config.score },
      create: config,
    });
  }
}