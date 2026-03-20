"use client";

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveTeacherRegistration,
  getPendingTeacherRegistrations,
  rejectTeacherRegistration,
} from "@/server/actions/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminTeacherApprovalsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "teacher-approvals"],
    queryFn: () => getPendingTeacherRegistrations(),
  });

  async function runAction(action: () => Promise<any>, successMessage: string) {
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey: ["admin", "teacher-approvals"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success(successMessage);
    } catch (error: any) {
      toast.error(error?.message || "Action failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teacher Approvals</h1>
        <p className="text-sm text-muted-foreground">
          Approve or reject teacher self-registrations before account activation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : (data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending teacher approvals.</p>
          ) : (
            <div className="space-y-3">
              {(data ?? []).map((teacher: any) => (
                <div key={teacher.id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{teacher.name}</p>
                      <Badge variant="outline">TEACHER</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Requested on {new Date(teacher.createdAt).toLocaleString()}
                      {teacher.department ? ` • ${teacher.department}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => runAction(() => rejectTeacherRegistration(teacher.id), "Teacher request rejected")}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => runAction(() => approveTeacherRegistration(teacher.id), "Teacher approved successfully")}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
