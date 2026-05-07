"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useProject } from "@/hooks/useProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Users,
  FileText,
  ClipboardCheck,
  ListTodo,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { OverviewTab } from "./_tabs/OverviewTab";
import { TasksTab } from "./_tabs/TasksTab";
import { MilestonesTab } from "./_tabs/MilestonesTab";
import { ReviewsTab } from "./_tabs/ReviewsTab";
import { PublicationsTab } from "./_tabs/PublicationsTab";
import { FilesTab } from "./_tabs/FilesTab";
import { MembersTab } from "./_tabs/MembersTab";

const statusColors: Record<string, string> = {
  DRAFT: "bg-zinc-500/20 text-zinc-400",
  ACTIVE: "bg-emerald-500/20 text-emerald-400",
  UNDER_REVIEW: "bg-amber-500/20 text-amber-400",
  COMPLETED: "bg-indigo-500/20 text-indigo-400",
  ARCHIVED: "bg-zinc-500/20 text-zinc-400",
};

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const { data: project, isLoading } = useProject(projectId);
  const [activeTab, setActiveTab] = React.useState("overview");

  React.useEffect(() => {
    const allowedTabs = new Set([
      "overview",
      "tasks",
      "milestones",
      "reviews",
      "publications",
      "files",
      "members",
    ]);
    setActiveTab(allowedTabs.has(tabParam || "") ? (tabParam as string) : "overview");
  }, [tabParam]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const p = project as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{p.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground text-sm">{p.domain}</p>
              {p.department && (
                <>
                  <span className="text-muted-foreground text-xs">•</span>
                  <p className="text-muted-foreground text-sm font-medium">
                    {p.department}
                  </p>
                </>
              )}
            </div>
          </div>
          <Badge className={statusColors[p.status] ?? ""}>
            {p.status.replace("_", " ")}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(p.startDate).toLocaleDateString()} -{" "}
            {new Date(p.endDate).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {p.members?.length ?? 0} / {p.maxGroupSize} members
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start gap-1 bg-transparent border-b rounded-none px-0 pb-0">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <ListTodo className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger
            value="milestones"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Milestones
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="publications"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Publications
          </TabsTrigger>
          <TabsTrigger
            value="files"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <FileText className="mr-2 h-4 w-4" />
            Files
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <Users className="mr-2 h-4 w-4" />
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab project={p} />
        </TabsContent>
        <TabsContent value="tasks" className="mt-6">
          <TasksTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="milestones" className="mt-6">
          <MilestonesTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <ReviewsTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="publications" className="mt-6">
          <PublicationsTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="files" className="mt-6">
          <FilesTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="members" className="mt-6">
          <MembersTab project={p} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
