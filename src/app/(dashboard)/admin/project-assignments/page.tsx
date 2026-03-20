"use client";

import { useState } from "react";
import { adminUploadProjectAssignments } from "@/server/actions/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type UploadSummary = {
  totalRows: number;
  matchedRows: number;
  unresolvedRows: number;
  createdProjects: number;
  existingUsersAssigned: number;
  invitedUsersQueued: number;
  emailsQueued: number;
};

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read CSV file"));
    reader.readAsText(file);
  });
}

export default function AdminProjectAssignmentsPage() {
  const [csvContent, setCsvContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState<UploadSummary | null>(null);

  async function onCsvFilePicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a .csv file");
      return;
    }

    try {
      const text = await readFileAsText(file);
      setCsvContent(text);
      toast.success("CSV loaded successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not parse CSV";
      toast.error(message);
    }
  }

  async function onSubmit() {
    if (!csvContent.trim()) {
      toast.error("Upload or paste CSV content first");
      return;
    }

    setIsSubmitting(true);
    setSummary(null);
    try {
      const result = await adminUploadProjectAssignments({
        csvContent,
      });

      setSummary({
        totalRows: result.totalRows,
        matchedRows: result.matchedRows,
        unresolvedRows: result.unresolvedRows,
        createdProjects: result.createdProjects,
        existingUsersAssigned: result.existingUsersAssigned,
        invitedUsersQueued: result.invitedUsersQueued,
        emailsQueued: result.emailsQueued,
      });

      toast.success("Assignments processed and emails queued");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Assignment CSV Upload</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a CSV to assign users to a project. Notifications are queued asynchronously.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Dataset</CardTitle>
          <CardDescription>
            Required CSV columns: email, projectName.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Upload CSV file</Label>
            <Input type="file" accept=".csv,text/csv" onChange={onCsvFilePicked} />
          </div>

          <div className="space-y-2">
            <Label>CSV content</Label>
            <Textarea
              value={csvContent}
              onChange={(event) => setCsvContent(event.target.value)}
              className="min-h-[220px] font-mono text-xs"
              placeholder={"email,projectName\nstudent1@tcetmumbai.in,AI Attendance System\nnew.user@example.com,IoT Smart Campus"}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Process CSV and Queue Emails"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCsvContent("email,projectName\nstudent1@tcetmumbai.in,AI Attendance System\nnew.user@example.com,IoT Smart Campus")
              }
            >
              Insert Sample CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary ? (
        <Card>
          <CardHeader>
            <CardTitle>Result Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <SummaryItem label="Rows processed" value={summary.totalRows} />
            <SummaryItem label="Rows matched" value={summary.matchedRows} />
            <SummaryItem label="Rows skipped" value={summary.unresolvedRows} />
            <SummaryItem label="Projects auto-created" value={summary.createdProjects} />
            <SummaryItem label="Existing users assigned" value={summary.existingUsersAssigned} />
            <SummaryItem label="Invites created" value={summary.invitedUsersQueued} />
            <SummaryItem label="Emails queued" value={summary.emailsQueued} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
