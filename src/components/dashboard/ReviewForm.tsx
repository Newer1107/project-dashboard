"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const reviewSchema = z.object({
  overallScore: z.number().min(0).max(10),
  feedback: z.string().min(1, "Feedback is required"),
  criteria: z.array(
    z.object({
      criteriaName: z.string(),
      score: z.number().min(0).max(10),
      remarks: z.string().optional(),
    })
  ),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const defaultCriteria = [
  "Code Quality",
  "Documentation",
  "Presentation",
  "Innovation",
  "Teamwork",
];

interface ReviewFormProps {
  reviewId: string;
  onSubmit: (data: ReviewFormData & { reviewId: string }) => Promise<void>;
  onCancel: () => void;
}

export function ReviewForm({ reviewId, onSubmit, onCancel }: ReviewFormProps) {
  const [criteriaScores, setCriteriaScores] = useState(
    defaultCriteria.map((name) => ({ criteriaName: name, score: 5, remarks: "" }))
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overallScore: 5,
      feedback: "",
      criteria: criteriaScores,
    },
  });

  const overallScore = watch("overallScore");

  async function onFormSubmit(data: ReviewFormData) {
    try {
      await onSubmit({ ...data, reviewId, criteria: criteriaScores });
      toast.success("Review submitted successfully");
    } catch {
      toast.error("Failed to submit review");
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Criteria Scores</h3>
        {criteriaScores.map((criteria, index) => (
          <div key={criteria.criteriaName} className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium">{criteria.criteriaName}</Label>
              <span className="text-sm font-bold text-primary">
                {criteria.score}/10
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={criteria.score}
              onChange={(e) => {
                const newScores = [...criteriaScores];
                newScores[index].score = parseFloat(e.target.value);
                setCriteriaScores(newScores);
              }}
              className="w-full accent-primary"
            />
            <Input
              placeholder="Remarks (optional)"
              value={criteria.remarks}
              onChange={(e) => {
                const newScores = [...criteriaScores];
                newScores[index].remarks = e.target.value;
                setCriteriaScores(newScores);
              }}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Overall Score</Label>
          <span className="text-lg font-bold text-primary">{overallScore}/10</span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={overallScore}
          onChange={(e) => setValue("overallScore", parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div className="space-y-2">
        <Label>Feedback</Label>
        <Textarea
          {...register("feedback")}
          placeholder="Provide detailed feedback..."
          rows={4}
        />
        {errors.feedback && (
          <p className="text-sm text-destructive">{errors.feedback.message}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
