"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTeacherProjects, useTeacherDashboardStats } from "@/hooks/useProjects";
import { ProjectCompletionChart } from "@/components/charts/ProjectCompletionChart";
import { TaskDistributionDonut } from "@/components/charts/TaskDistributionDonut";
import { MilestoneGanttBar } from "@/components/charts/MilestoneGanttBar";
import { Skeleton } from "@/components/ui/skeleton";

type TeacherAnalyticsClientProps = {
  userId: string;
};

export default function TeacherAnalyticsClient({ userId }: TeacherAnalyticsClientProps) {
  const { data: projects, isLoading } = useTeacherProjects(userId);
  const { data: stats } = useTeacherDashboardStats(userId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    );
  }

  const completionData = (projects ?? []).map((p: any) => ({
    name: p.title.length > 25 ? p.title.slice(0, 25) + "…" : p.title,
    completion: p.completionPercentage,
  }));

  const taskData = aggregateTaskDistribution(projects ?? []);

  const milestoneData = (projects ?? []).flatMap((p: any) =>
    (p.milestones ?? []).map((m: any) => ({
      name: m.title,
      progress: m.isCompleted ? 100 : 0,
      total: 100,
    }))
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Insights across all your projects
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-5"
        >
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-3xl font-bold mt-1">{stats?.totalProjects ?? 0}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-card p-5"
        >
          <p className="text-sm text-muted-foreground">Average Completion</p>
          <p className="text-3xl font-bold mt-1">{stats?.averageCompletion ?? 0}%</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-card p-5"
        >
          <p className="text-sm text-muted-foreground">Pending Reviews</p>
          <p className="text-3xl font-bold mt-1">{stats?.reviewsDue ?? 0}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border bg-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Project Completion</h3>
          <ProjectCompletionChart data={completionData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Task Status Overview</h3>
          <TaskDistributionDonut data={taskData} />
        </motion.div>
      </div>

      {milestoneData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border bg-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Milestone Progress</h3>
          <MilestoneGanttBar data={milestoneData} />
        </motion.div>
      )}
    </div>
  );
}

function aggregateTaskDistribution(projects: any[]) {
  const counts: Record<string, number> = {
    TODO: 0,
    IN_PROGRESS: 0,
    IN_REVIEW: 0,
    DONE: 0,
    BLOCKED: 0,
  };
  for (const p of projects) {
    if (p.tasks) {
      for (const t of p.tasks) {
        counts[t.status] = (counts[t.status] || 0) + 1;
      }
    }
  }
  return {
    todo: counts.TODO,
    inProgress: counts.IN_PROGRESS,
    inReview: counts.IN_REVIEW,
    done: counts.DONE,
    blocked: counts.BLOCKED,
  };
}
