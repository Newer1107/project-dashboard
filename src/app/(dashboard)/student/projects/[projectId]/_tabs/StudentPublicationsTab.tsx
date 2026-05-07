"use client";

import React from "react";
import { useProjectPublicationSummary } from "@/hooks/usePublications";
import { PublicationList } from "@/components/dashboard/PublicationList";
import { PublicationForm } from "@/components/dashboard/PublicationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrophyIcon, FileTextIcon, PlusIcon } from "lucide-react";

interface StudentPublicationsTabProps {
  projectId: string;
  userRole?: string;
  userId?: string;
}

export function StudentPublicationsTab({
  projectId,
  userRole = "STUDENT",
  userId,
}: StudentPublicationsTabProps) {
  const { data: summary } = useProjectPublicationSummary(projectId);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Publications
            </CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalPublications || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.approvedPublications || 0} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Score</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalScore || 0}</div>
            <p className="text-xs text-muted-foreground">From publications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Share</CardTitle>
            <TrophyIcon className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.studentScore?.toFixed(1) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Points per student</p>
          </CardContent>
        </Card>
      </div>

      {/* Publications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Publications</CardTitle>
            <PublicationForm
              projectId={projectId}
              trigger={
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Publication
                </Badge>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          <PublicationList
            projectId={projectId}
            userRole={userRole}
            userId={userId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
