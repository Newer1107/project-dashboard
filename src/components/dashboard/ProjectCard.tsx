"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users } from "lucide-react";
import { format } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    domain: string;
    status: string;
    completionPercentage: number;
    endDate: Date | string;
    groupNo?: string | null;
    isRblProject?: boolean;
    members?: Array<{
      student?: { name: string; avatarUrl?: string | null };
      name?: string;
    }>;
    tags?: Array<{
      tag?: { name: string; color: string };
      name?: string;
      color?: string;
    }>;
  };
  href: string;
}

const statusColors: Record<string, string> = {
  DRAFT: "secondary",
  ACTIVE: "success",
  UNDER_REVIEW: "warning",
  COMPLETED: "default",
  ARCHIVED: "outline",
};

export function ProjectCard({ project, href }: ProjectCardProps) {
  const {
    title,
    domain,
    status = "DRAFT",
    completionPercentage = 0,
    endDate,
    groupNo,
    isRblProject,
  } = project;

  const members = (project.members ?? []).map((m: any) => ({
    name: m.student?.name ?? m.name ?? "?",
  }));

  const tags = (project.tags ?? []).map((t: any) => ({
    name: t.tag?.name ?? t.name ?? "",
    color: t.tag?.color ?? t.color ?? "#6366f1",
  }));
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  return (
    <Link href={href}>
      <motion.div
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 30px rgba(99, 102, 241, 0.08)",
        }}
        whileTap={{ scale: 0.98 }}
        className="group cursor-pointer rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/20"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={statusColors[status] as any}>
                {status.replace("_", " ")}
              </Badge>
              {isRblProject && (
                <Badge
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none dark:bg-indigo-900/30 dark:text-indigo-300"
                >
                  RBL Project
                </Badge>
              )}
              {groupNo && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {groupNo}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {domain}
            </p>
          </div>

          {/* Completion Ring */}
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="5"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center">
              <span className="text-sm font-bold">
                {Math.round(completionPercentage)}%
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag.name}
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `${tag.color}15`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(endDate), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((m, i) => (
                <Avatar key={i} className="h-6 w-6 border-2 border-card">
                  <AvatarFallback className="text-[10px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                    {m.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {members.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium border-2 border-card">
                  +{members.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
