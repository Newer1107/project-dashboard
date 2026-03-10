"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, FileUp, MessageSquare, Target, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "task_completed" | "file_uploaded" | "comment_added" | "milestone_completed" | "member_added";
  message: string;
  timestamp: Date;
  user: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const activityIcons = {
  task_completed: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  file_uploaded: { icon: FileUp, color: "text-blue-500", bg: "bg-blue-500/10" },
  comment_added: { icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
  milestone_completed: { icon: Target, color: "text-violet-500", bg: "bg-violet-500/10" },
  member_added: { icon: PlusCircle, color: "text-indigo-500", bg: "bg-indigo-500/10" },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const config = activityIcons[activity.type];
        const Icon = config.icon;
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                config.bg
              )}
            >
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.message}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
