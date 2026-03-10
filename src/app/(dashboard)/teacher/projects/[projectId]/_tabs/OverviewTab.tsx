"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { TaskDistributionDonut } from "@/components/charts/TaskDistributionDonut";
import { MilestoneTimeline } from "@/components/dashboard/MilestoneTimeline";
import { getProjectTasks } from "@/server/actions/tasks";
import { getProjectMilestones } from "@/server/actions/milestones";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewTabProps {
  project: any;
}

export function OverviewTab({ project }: OverviewTabProps) {
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", project.id],
    queryFn: () => getProjectTasks(project.id),
  });

  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ["milestones", project.id],
    queryFn: () => getProjectMilestones(project.id),
  });

  const taskCounts = getTaskCounts(tasks ?? []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Description</h3>
        <p className="text-sm leading-relaxed">{project.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-4">Task Breakdown</h3>
          {tasksLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : (
            <TaskDistributionDonut data={taskCounts} />
          )}
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-4">Milestones</h3>
          {milestonesLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : (milestones ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No milestones yet</p>
          ) : (
            <MilestoneTimeline milestones={milestones ?? []} />
          )}
        </div>
      </div>

      {project.tags?.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((pt: any) => (
              <span
                key={pt.tag.id}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: pt.tag.color + "20",
                  color: pt.tag.color,
                }}
              >
                {pt.tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getTaskCounts(tasks: any[]) {
  const counts = { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, DONE: 0, BLOCKED: 0 };

  for (const t of tasks) {
    if (t.status in counts) counts[t.status as keyof typeof counts]++;
  }

  return {
    todo: counts.TODO,
    inProgress: counts.IN_PROGRESS,
    inReview: counts.IN_REVIEW,
    done: counts.DONE,
    blocked: counts.BLOCKED,
  };
}