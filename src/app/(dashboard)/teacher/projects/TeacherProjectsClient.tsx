"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search, Filter, BookOpen } from "lucide-react";
import { useTeacherProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type TeacherProjectsClientProps = {
  userId: string;
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function TeacherProjectsClient({ userId }: TeacherProjectsClientProps) {
  const { data: projects, isLoading } = useTeacherProjects(userId);

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [rblFilter, setRblFilter] = React.useState("ALL");

  const filtered = React.useMemo(() => {
    let list = projects ?? [];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p: any) =>
          p.title.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q) ||
          (p.department && p.department.toLowerCase().includes(q)) ||
          (p.groupNo && p.groupNo.toLowerCase().includes(q)),
      );
    }

    if (statusFilter !== "ALL") {
      list = list.filter((p: any) => p.status === statusFilter);
    }

    if (rblFilter === "RBL") {
      list = list.filter((p: any) => p.isRblProject === true);
    } else if (rblFilter === "STANDARD") {
      list = list.filter(
        (p: any) => p.isRblProject === false || p.isRblProject === null,
      );
    }

    return list;
  }, [projects, search, statusFilter, rblFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm">
            Manage and monitor all your academic projects
          </p>
        </div>
        <Link href="/teacher/projects/new">
          <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search title, domain, dept, or group no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex w-full sm:w-auto gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={rblFilter} onValueChange={setRblFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="RBL">RBL Projects</SelectItem>
              <SelectItem value="STANDARD">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">No projects found</p>
          <Link href="/teacher/projects/new" className="mt-4">
            <Button variant="outline">Create your first project</Button>
          </Link>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project: any) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard
                project={project}
                href={`/teacher/projects/${project.id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
