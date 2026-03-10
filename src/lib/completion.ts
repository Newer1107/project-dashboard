import { prisma } from "@/lib/prisma";

export async function computeProjectCompletion(
  projectId: string
): Promise<number> {
  const [tasks, milestones, reviews] = await Promise.all([
    prisma.task.findMany({
      where: { projectId },
      select: { status: true },
    }),
    prisma.milestone.findMany({
      where: { projectId },
      select: { isCompleted: true, weight: true },
    }),
    prisma.review.findMany({
      where: { projectId, status: "COMPLETED" },
      select: { overallScore: true },
    }),
  ]);

  // Task score: 50% weight
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;
  const taskScore = totalTasks > 0 ? (doneTasks / totalTasks) * 50 : 0;

  // Milestone score: 30% weight
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.isCompleted).length;
  const milestoneScore =
    totalMilestones > 0 ? (completedMilestones / totalMilestones) * 30 : 0;

  // Review score: 20% weight
  const completedReviews = reviews.filter((r) => r.overallScore != null);
  const avgReviewScore =
    completedReviews.length > 0
      ? completedReviews.reduce((sum, r) => sum + (r.overallScore ?? 0), 0) /
        completedReviews.length
      : 0;
  const reviewScore = completedReviews.length > 0 ? (avgReviewScore / 10) * 20 : 0;

  const total = Math.min(100, Math.round((taskScore + milestoneScore + reviewScore) * 100) / 100);
  return total;
}

export async function updateProjectCompletion(
  projectId: string
): Promise<number> {
  const completion = await computeProjectCompletion(projectId);
  await prisma.project.update({
    where: { id: projectId },
    data: { completionPercentage: completion },
  });
  return completion;
}
