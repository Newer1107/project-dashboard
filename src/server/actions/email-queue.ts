"use server";

import { requireRole } from "@/lib/coe-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { processEmailQueue } from "@/lib/email-queue";

export async function getEmailQueueLogs(limit = 200) {
  await requireRole("ADMIN");

  return prisma.emailQueue.findMany({
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(limit, 1), 500),
    select: {
      id: true,
      to: true,
      subject: true,
      status: true,
      attempts: true,
      errorLog: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function retryFailedEmails() {
  await requireRole("ADMIN");

  const result = await prisma.emailQueue.updateMany({
    where: { status: "FAILED" },
    data: {
      status: "PENDING",
      attempts: 0,
      errorLog: null,
    },
  });

  revalidatePath("/admin/email-logs");
  return { updated: result.count };
}

export async function runEmailQueueNow(batchSize = 50) {
  await requireRole("ADMIN");

  const result = await processEmailQueue(Math.min(Math.max(batchSize, 1), 200));
  revalidatePath("/admin/email-logs");
  return result;
}
