"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFeedback,
  approveProject,
  getSubmissionById,
  publishProject,
  rejectProject,
  requestChanges,
  resolveFeedback,
} from "@/server/actions/showcase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Snapshot = Record<string, any>;

function changedKeys(a?: Snapshot | null, b?: Snapshot | null): string[] {
  if (!a || !b) return [];
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].filter((key) => JSON.stringify(a[key]) !== JSON.stringify(b[key]));
}

export default function AdminShowcaseReviewPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [compareVersionA, setCompareVersionA] = useState<string>("");
  const [compareVersionB, setCompareVersionB] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "showcase", projectId],
    queryFn: () => getSubmissionById(projectId),
    enabled: !!projectId,
  });

  const latestVersion = useMemo(() => data?.versions?.[0], [data]);
  const selectedVersionData = useMemo(
    () => data?.versions.find((version) => version.id === (selectedVersion || latestVersion?.id)),
    [data?.versions, selectedVersion, latestVersion?.id]
  );

  const compareA = useMemo(
    () => data?.versions.find((version) => version.id === compareVersionA),
    [data?.versions, compareVersionA]
  );
  const compareB = useMemo(
    () => data?.versions.find((version) => version.id === compareVersionB),
    [data?.versions, compareVersionB]
  );
  const differences = useMemo(
    () => changedKeys(compareA?.snapshot as Snapshot, compareB?.snapshot as Snapshot),
    [compareA?.snapshot, compareB?.snapshot]
  );

  async function onAddFeedback() {
    if (!data) return;
    if (!message.trim()) return;

    const versionId = selectedVersion || latestVersion?.id;
    if (!versionId) {
      toast.error("No version available for feedback");
      return;
    }

    try {
      await addFeedback(data.id, versionId, { message });
      setMessage("");
      await queryClient.invalidateQueries({ queryKey: ["admin", "showcase", projectId] });
      toast.success("Feedback added");
    } catch (error: any) {
      toast.error(error?.message || "Failed to add feedback");
    }
  }

  async function run(action: () => Promise<any>, successMessage: string) {
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey: ["admin", "showcase", projectId] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "showcase"] });
      toast.success(successMessage);
    } catch (error: any) {
      toast.error(error?.message || "Action failed");
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading review data...</p>;
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">Submission not found.</p>;
  }

  const docAssets = (data.assets ?? []).filter((asset) => asset.kind === "DOCUMENTATION");
  const screenshotAssets = (data.assets ?? []).filter((asset) => asset.kind === "SCREENSHOT");

  return (
    <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{data.title}</CardTitle>
              <Badge variant="outline">{data.status}</Badge>
              <Badge variant="outline">{data.projectDomain.replace("_", " ")}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{data.shortDescription}</p>
            <p className="text-xs text-muted-foreground">Owner: {data.owner.name} ({data.owner.email})</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <Section title="Overview" content={data.fullDescription} />
            <Section title="Problem Statement" content={data.problemStatement} />
            <Section title="Objectives" content={data.objectives} />
            <Section title="Methodology / Approach" content={data.methodology} />
            <TagSection title="Key Features" tags={(data.keyFeatures as string[]) ?? []} />
            <TagSection title="Tech Stack" tags={(data.techStack as string[]) ?? []} />
            <Section title="Architecture Description" content={data.architectureDescription} />
            <Section title="Database Used" content={data.databaseUsed} />
            <TagSection title="APIs / Integrations" tags={(data.apiIntegrations as string[]) ?? []} />
            <TagSection title="Categories" tags={(data.categories as string[]) ?? []} />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Links</h3>
              <div className="grid gap-1 text-sm">
                {data.githubUrl ? <a href={data.githubUrl} target="_blank" className="text-primary hover:underline">GitHub Repository</a> : <span className="text-muted-foreground">GitHub: Not provided</span>}
                {data.liveDemoUrl ? <a href={data.liveDemoUrl} target="_blank" className="text-primary hover:underline">Live Demo</a> : <span className="text-muted-foreground">Demo: Not provided</span>}
                {data.documentationUrl ? <a href={data.documentationUrl} target="_blank" className="text-primary hover:underline">Documentation Link</a> : <span className="text-muted-foreground">Documentation link: Not provided</span>}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Team Information</h3>
              <div className="space-y-1 text-sm">
                {data.teamMembers.length === 0 ? (
                  <p className="text-muted-foreground">No team members provided.</p>
                ) : (
                  data.teamMembers.map((member) => (
                    <p key={member.id}><span className="font-medium">{member.name}</span> - {member.role}</p>
                  ))
                )}
                {data.mentorName ? <p className="text-muted-foreground">Mentor: {data.mentorName}{data.mentorEmail ? ` (${data.mentorEmail})` : ""}</p> : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ResourceList title="Documentation Files" items={docAssets.map((asset) => asset.accessUrl || asset.fileUrl)} />
              <ResourceList title="Screenshots" items={screenshotAssets.map((asset) => asset.accessUrl || asset.fileUrl)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Version Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Select value={compareVersionA} onValueChange={setCompareVersionA}>
                <SelectTrigger><SelectValue placeholder="Select version A" /></SelectTrigger>
                <SelectContent>
                  {data.versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>Version {version.version}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={compareVersionB} onValueChange={setCompareVersionB}>
                <SelectTrigger><SelectValue placeholder="Select version B" /></SelectTrigger>
                <SelectContent>
                  {data.versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>Version {version.version}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {compareA && compareB ? (
              <div className="rounded-md border p-3">
                <p className="text-sm font-medium">Changed fields ({differences.length})</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {differences.length === 0 ? (
                    <span className="text-sm text-muted-foreground">No field changes detected.</span>
                  ) : (
                    differences.map((key) => <Badge key={key} variant="outline">{key}</Badge>)
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select two versions to compare field-level differences.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          {data.status === "UNDER_REVIEW" ? (
            <>
              <Button variant="outline" onClick={() => run(() => requestChanges(data.id), "Changes requested")}>Request Changes</Button>
              <Button onClick={() => run(() => approveProject(data.id), "Project approved")}>Approve</Button>
            </>
          ) : null}
          {data.status === "APPROVED" ? (
            <Button onClick={() => run(() => publishProject(data.id), "Project published")}>Publish</Button>
          ) : null}
          {data.status !== "PUBLISHED" && data.status !== "REJECTED" ? (
            <Button variant="destructive" onClick={() => run(() => rejectProject(data.id), "Project rejected")}>Reject</Button>
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Add feedback</Label>
            <Select value={selectedVersion || latestVersion?.id || ""} onValueChange={setSelectedVersion}>
              <SelectTrigger><SelectValue placeholder="Attach feedback to version" /></SelectTrigger>
              <SelectContent>
                {data.versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>Version {version.version}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write actionable review comments"
            />
            <Button onClick={onAddFeedback}>Add Feedback</Button>
          </div>

          <div className="space-y-2">
            {data.feedbacks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No feedback yet.</p>
            ) : (
              data.feedbacks.map((feedback) => (
                <div key={feedback.id} className="rounded-md border p-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{feedback.author.name}</span>
                    <span>{new Date(feedback.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{feedback.message}</p>
                  {!feedback.isResolved ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => run(() => resolveFeedback(feedback.id), "Feedback marked resolved")}
                    >
                      Resolve
                    </Button>
                  ) : (
                    <p className="mt-2 text-xs font-medium text-emerald-500">Resolved</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, content }: { title: string; content?: string | null }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content?.trim() || "Not provided"}</p>
    </div>
  );
}

function TagSection({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      {tags.length === 0 ? (
        <p className="text-sm text-muted-foreground">Not provided</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">None provided</p>
      ) : (
        <div className="space-y-1">
          {items.map((item) => (
            <a key={item} href={item} target="_blank" className="block truncate text-xs text-primary hover:underline">
              {item}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
