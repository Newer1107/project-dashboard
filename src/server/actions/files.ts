"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generatePresignedUploadUrl, generatePresignedDownloadUrl, deleteS3Object, buildS3Key } from "@/lib/s3";
import { revalidatePath } from "next/cache";

export async function requestUploadUrl(
  projectId: string,
  fileName: string,
  fileType: string,
  category: string,
  taskId?: string
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const s3Key = buildS3Key(projectId, category, fileName);
  const uploadUrl = await generatePresignedUploadUrl(s3Key, fileType);

  return { uploadUrl, s3Key };
}

export async function confirmUpload(data: {
  projectId: string;
  taskId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  category: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const file = await prisma.projectFile.create({
    data: {
      projectId: data.projectId,
      taskId: data.taskId,
      uploadedBy: userId,
      fileName: data.fileName,
      fileType: data.fileType,
      fileSize: data.fileSize,
      s3Key: data.s3Key,
      s3Url: data.s3Key, // Will be generated on access
      category: data.category as any,
    },
  });

  revalidatePath(`/teacher/projects/${data.projectId}/files`);
  revalidatePath(`/student/projects/${data.projectId}/files`);
  return file;
}

export async function getDownloadUrl(fileId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const file = await prisma.projectFile.findUnique({ where: { id: fileId } });
  if (!file) throw new Error("File not found");

  return generatePresignedDownloadUrl(file.s3Key);
}

export async function deleteFile(fileId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const file = await prisma.projectFile.findUnique({ where: { id: fileId } });
  if (!file) throw new Error("File not found");

  const role = (session.user as any).role;
  if (role === "STUDENT" && file.uploadedBy !== session.user.id) {
    throw new Error("Cannot delete other members' files");
  }

  await deleteS3Object(file.s3Key);
  await prisma.projectFile.delete({ where: { id: fileId } });

  revalidatePath(`/teacher/projects/${file.projectId}/files`);
  revalidatePath(`/student/projects/${file.projectId}/files`);
}

export async function getProjectFiles(projectId: string) {
  return prisma.projectFile.findMany({
    where: { projectId },
    include: {
      uploader: { select: { id: true, name: true } },
    },
    orderBy: { uploadedAt: "desc" },
  });
}
