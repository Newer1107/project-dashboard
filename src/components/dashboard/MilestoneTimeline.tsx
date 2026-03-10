"use client";

import React from "react";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { CheckCircle2, Circle, AlertCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Milestone {
  id: string;
  title: string;
  description?: string | null;
  dueDate: Date;
  isCompleted: boolean;
  completedAt?: Date | null;
  weight: number;
}

interface MilestoneTimelineProps {
  milestones: Milestone[];
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MilestoneTimeline({ milestones, onToggle, onDelete }: MilestoneTimelineProps) {
  return (
    <div className="space-y-0">
      {milestones.map((milestone, index) => {
        const isOverdue = !milestone.isCompleted && new Date(milestone.dueDate) < new Date();
        const icon = milestone.isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : isOverdue ? (
          <AlertCircle className="h-5 w-5 text-rose-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        );

        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {/* Timeline line */}
            {index < milestones.length - 1 && (
              <div className="absolute left-[10px] top-8 h-full w-px bg-border" />
            )}

            {/* Icon — clickable if onToggle provided */}
            <button
              className={cn(
                "relative z-10 shrink-0",
                onToggle && "cursor-pointer hover:scale-110 transition-transform"
              )}
              onClick={() => onToggle?.(milestone.id)}
              type="button"
              title={milestone.isCompleted ? "Mark incomplete" : "Mark complete"}
            >
              {icon}
            </button>

            {/* Content */}
            <div
              className={cn(
                "flex-1 rounded-lg border p-4 transition-colors",
                milestone.isCompleted && "border-emerald-500/20 bg-emerald-500/5",
                isOverdue && "border-rose-500/20 bg-rose-500/5"
              )}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{milestone.title}</h4>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      milestone.isCompleted
                        ? "bg-emerald-500/10 text-emerald-500"
                        : isOverdue
                          ? "bg-rose-500/10 text-rose-500"
                          : "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    {milestone.isCompleted
                      ? "Completed"
                      : isOverdue
                        ? "Overdue"
                        : `Due ${formatDistanceToNow(new Date(milestone.dueDate), { addSuffix: true })}`}
                  </span>
                  {onToggle && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => onToggle(milestone.id)}
                    >
                      {milestone.isCompleted ? "Undo" : "Complete"}
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => onDelete(milestone.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              {milestone.description && (
                <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
              )}
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span>Due: {format(new Date(milestone.dueDate), "MMM d, yyyy")}</span>
                <span>Weight: {milestone.weight}%</span>
                {milestone.completedAt && (
                  <span>Completed: {format(new Date(milestone.completedAt), "MMM d, yyyy")}</span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
