"use server";

import { prisma } from "@/lib/prisma";
import { requireCoeUser } from "@/lib/coe-guard";
import { generatePresignedUploadUrl, deleteS3Object, buildS3Key, buildStorageProxyUrl } from "@/lib/s3";
import { revalidatePath } from "next/cache";

export async function requestUploadUrl(
  projectId: string,
  fileName: string,
  fileType: string,
  category: string,
  taskId?: string
) {
  await requireCoeUser();

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
  const user = await requireCoeUser();
  const userId = user.id;

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
  await requireCoeUser();

  const file = await prisma.projectFile.findUnique({ where: { id: fileId } });
  if (!file) throw new Error("File not found");

  return buildStorageProxyUrl(file.s3Key);
}

export async function deleteFile(fileId: string) {
  const user = await requireCoeUser();

  const file = await prisma.projectFile.findUnique({ where: { id: fileId } });
  if (!file) throw new Error("File not found");

  const role = user.role;
  if (role === "STUDENT" && file.uploadedBy !== user.id) {
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
