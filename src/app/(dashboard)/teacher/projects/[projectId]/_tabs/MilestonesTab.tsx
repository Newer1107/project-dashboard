"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjectMilestones, createMilestone, toggleMilestoneComplete, deleteMilestone } from "@/server/actions/milestones";
import { MilestoneTimeline } from "@/components/dashboard/MilestoneTimeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface MilestonesTabProps {
  projectId: string;
}

export function MilestonesTab({ projectId }: MilestonesTabProps) {
  const queryClient = useQueryClient();
  const { data: milestones, isLoading } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => getProjectMilestones(projectId),
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createMilestone({
        projectId,
        title: fd.get("title") as string,
        description: (fd.get("description") as string) || undefined,
        dueDate: fd.get("dueDate") as string,
        weight: Number(fd.get("weight")) || 1,
      });
      toast.success("Milestone created");
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      setDialogOpen(false);
    } catch {
      toast.error("Failed to create milestone");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(milestoneId: string) {
    try {
      await toggleMilestoneComplete(milestoneId);
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      toast.success("Milestone updated");
    } catch {
      toast.error("Failed to update milestone");
    }
  }

  async function handleDelete(milestoneId: string) {
    try {
      await deleteMilestone(milestoneId);
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      toast.success("Milestone deleted");
    } catch {
      toast.error("Failed to delete milestone");
    }
  }

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Milestone</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input name="title" required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input name="description" />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input name="dueDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label>Weight</Label>
                  <Input name="weight" type="number" min={1} max={10} defaultValue={1} />
                </div>
              </div>
              <Button type="submit" disabled={creating} className="w-full">
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Milestone
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <MilestoneTimeline
          milestones={milestones ?? []}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
