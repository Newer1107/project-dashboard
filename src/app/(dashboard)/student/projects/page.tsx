"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useStudentProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function StudentProjectsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";
  const { data: projects, isLoading } = useStudentProjects(userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Projects</h1>
        <p className="text-muted-foreground text-sm">
          View all projects you&apos;re assigned to
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : (projects ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">No projects assigned yet</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {(projects ?? []).map((project: any) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard
                project={project}
                href={`/student/projects/${project.id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
