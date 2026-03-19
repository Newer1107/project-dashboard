"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllSubmissions, startReview, approveProject, publishProject, rejectProject, requestChanges } from "@/server/actions/showcase";
import { ShowcaseProjectStatus } from "@prisma/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, Search } from "lucide-react";

const statusOptions: Array<ShowcaseProjectStatus | "ALL"> = [
  "ALL",
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "CHANGES_REQUESTED",
  "RESUBMITTED",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
];

export default function AdminShowcasePage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ShowcaseProjectStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "showcase", status],
    queryFn: () => getAllSubmissions(status),
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.toLowerCase().trim();
    if (!q) return list;
    return list.filter((project) => {
      const title = project.title.toLowerCase();
      const owner = project.owner.name.toLowerCase();
      const email = project.owner.email.toLowerCase();
      return title.includes(q) || owner.includes(q) || email.includes(q);
    });
  }, [data, search]);

  async function runAction(action: () => Promise<any>, message: string) {
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey: ["admin", "showcase"] });
      toast.success(message);
    } catch (error: any) {
      toast.error(error?.message || "Action failed");
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Showcase Submissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and publish decoupled showcase submissions.
        </p>
      </motion.div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, owner or email"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(value) => setStatus(value as ShowcaseProjectStatus | "ALL")}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading submissions...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          No showcase submissions found for selected filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/20">
                <th className="p-3 text-left font-medium">Title</th>
                <th className="p-3 text-left font-medium">Owner</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Versions</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((project) => (
                <tr key={project.id}>
                  <td className="p-3">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-xs text-muted-foreground">Updated {new Date(project.updatedAt).toLocaleString()}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{project.owner.name}</p>
                    <p className="text-xs text-muted-foreground">{project.owner.email}</p>
                  </td>
                  <td className="p-3">
                    <span className="rounded-full border px-2 py-1 text-xs">{project.status}</span>
                  </td>
                  <td className="p-3">{project._count.versions}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link href={`/admin/showcase/${project.id}`}>
                        <Button size="sm" variant="outline">
                          Review <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      {project.status === "SUBMITTED" || project.status === "RESUBMITTED" ? (
                        <Button size="sm" onClick={() => runAction(() => startReview(project.id), "Moved to under review")}>Start Review</Button>
                      ) : null}
                      {project.status === "UNDER_REVIEW" ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => runAction(() => requestChanges(project.id), "Changes requested")}>Request Changes</Button>
                          <Button size="sm" onClick={() => runAction(() => approveProject(project.id), "Project approved")}>Approve</Button>
                        </>
                      ) : null}
                      {project.status === "APPROVED" ? (
                        <Button size="sm" onClick={() => runAction(() => publishProject(project.id), "Project published")}>Publish</Button>
                      ) : null}
                      {project.status !== "PUBLISHED" && project.status !== "REJECTED" ? (
                        <Button size="sm" variant="destructive" onClick={() => runAction(() => rejectProject(project.id), "Project rejected")}>Reject</Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
