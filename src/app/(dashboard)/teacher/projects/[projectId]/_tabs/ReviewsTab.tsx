"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjectReviews, scheduleReview, conductReview } from "@/server/actions/reviews";
import { ReviewForm } from "@/components/dashboard/ReviewForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, CalendarClock, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-500/20 text-blue-400",
  IN_PROGRESS: "bg-amber-500/20 text-amber-400",
  COMPLETED: "bg-emerald-500/20 text-emerald-400",
  CANCELLED: "bg-zinc-500/20 text-zinc-400",
};

interface ReviewsTabProps {
  projectId: string;
}

export function ReviewsTab({ projectId }: ReviewsTabProps) {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", projectId],
    queryFn: () => getProjectReviews(projectId),
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [conductId, setConductId] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);

  async function handleSchedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setScheduling(true);
    const fd = new FormData(e.currentTarget);
    try {
      await scheduleReview({
        projectId,
        reviewType: fd.get("reviewType") as any,
        scheduledAt: fd.get("scheduledAt") as string,
      });
      toast.success("Review scheduled");
      queryClient.invalidateQueries({ queryKey: ["reviews", projectId] });
      setDialogOpen(false);
    } catch {
      toast.error("Failed to schedule review");
    } finally {
      setScheduling(false);
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
              Schedule Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Input name="reviewType" placeholder="e.g. Review 1, Mid-term..." required />
              </div>
              <div className="space-y-2">
                <Label>Scheduled Date</Label>
                <Input name="scheduledAt" type="datetime-local" required />
              </div>
              <Button type="submit" disabled={scheduling} className="w-full">
                {scheduling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Schedule
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Review list */}
      <div className="space-y-3">
        {(reviews ?? []).length === 0 && (
          <p className="text-center text-muted-foreground py-8">No reviews scheduled yet</p>
        )}
        {(reviews ?? []).map((review: any) => (
          <div key={review.id} className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarClock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-semibold text-sm">
                    {review.reviewType}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.scheduledAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {review.overallScore !== null && (
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    {review.overallScore}/10
                  </span>
                )}
                <Badge className={statusColors[review.status] ?? ""}>
                  {review.status}
                </Badge>
              </div>
            </div>
            {review.feedback && (
              <p className="text-sm text-muted-foreground">{review.feedback}</p>
            )}
            {review.criteriaScores?.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {review.criteriaScores.map((cs: any) => (
                  <div key={cs.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-secondary/50">
                    <span>{cs.criteriaName}</span>
                    <span className="font-medium">{cs.score}/10</span>
                  </div>
                ))}
              </div>
            )}
            {review.status === "SCHEDULED" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConductId(conductId === review.id ? null : review.id)}
              >
                Conduct Review
              </Button>
            )}
            {conductId === review.id && (
              <ReviewForm
                reviewId={review.id}
                onSubmit={async (data) => {
                  await conductReview(data);
                  setConductId(null);
                  queryClient.invalidateQueries({ queryKey: ["reviews", projectId] });
                }}
                onCancel={() => setConductId(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
