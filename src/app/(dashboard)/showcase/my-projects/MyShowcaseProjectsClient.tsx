"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  getMyProjects,
  resubmitProject,
  submitProject,
  updateProject,
} from "@/server/actions/showcase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const domains = [
  "AI",
  "WEB",
  "IOT",
  "DATA_SCIENCE",
  "MOBILE",
  "CLOUD",
  "CYBERSECURITY",
  "OTHER",
] as const;

type Domain = (typeof domains)[number];

type TeamMember = { name: string; role: string };
type AssetRef = { fileUrl: string; fileName: string; fileType: string };

type AiImportShape = {
  title?: unknown;
  shortDescription?: unknown;
  fullDescription?: unknown;
  problemStatement?: unknown;
  objectives?: unknown;
  methodology?: unknown;
  keyFeatures?: unknown;
  techStack?: unknown;
  architectureDescription?: unknown;
  databaseUsed?: unknown;
  apiIntegrations?: unknown;
  githubUrl?: unknown;
  liveDemoUrl?: unknown;
  mentorName?: unknown;
  mentorEmail?: unknown;
  mentor?: { name?: unknown; email?: unknown };
  categories?: unknown;
  projectDomain?: unknown;
  isPublic?: unknown;
  teamMembers?: unknown;
};

type FormState = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  problemStatement: string;
  objectives: string;
  methodology: string;
  keyFeaturesText: string;
  techStackText: string;
  architectureDescription: string;
  databaseUsed: string;
  apiIntegrationsText: string;
  githubUrl: string;
  liveDemoUrl: string;
  documentationFiles: AssetRef[];
  screenshots: AssetRef[];
  mentorName: string;
  mentorEmail: string;
  categoriesText: string;
  projectDomain: Domain;
  isPublic: boolean;
  teamMembers: TeamMember[];
};

const initialForm: FormState = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  problemStatement: "",
  objectives: "",
  methodology: "",
  keyFeaturesText: "",
  techStackText: "",
  architectureDescription: "",
  databaseUsed: "",
  apiIntegrationsText: "",
  githubUrl: "",
  liveDemoUrl: "",
  documentationFiles: [],
  screenshots: [],
  mentorName: "",
  mentorEmail: "",
  categoriesText: "",
  projectDomain: "OTHER",
  isPublic: false,
  teamMembers: [{ name: "", role: "" }],
};

const steps = [
  "Basic",
  "Project Details",
  "Technical",
  "Resources",
  "Team",
  "Additional",
] as const;

function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toStringValue(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function toCommaSeparated(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => toStringValue(item)).filter(Boolean).join(", ");
  }
  return toStringValue(value);
}

function toLineSeparated(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => toStringValue(item)).filter(Boolean).join("\n");
  }
  return toStringValue(value);
}

function toBooleanValue(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "1"].includes(normalized)) return true;
    if (["false", "no", "0"].includes(normalized)) return false;
  }
  return null;
}

type MyShowcaseProjectsClientProps = {
  role: "STUDENT" | "TEACHER" | "ADMIN";
};

export default function MyShowcaseProjectsClient({ role }: MyShowcaseProjectsClientProps) {
  const canCreate = role === "STUDENT" || role === "TEACHER";

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [aiJsonInput, setAiJsonInput] = useState("");

  const aiTemplateJson = useMemo(
    () =>
      JSON.stringify(
        {
          title: "Your project title",
          shortDescription: "2-3 line summary",
          fullDescription: "Detailed description",
          problemStatement: "Problem solved by the project",
          objectives: "Main goals and outcomes",
          methodology: "Approach and implementation process",
          keyFeatures: ["Feature 1", "Feature 2"],
          techStack: ["Next.js", "Prisma", "MySQL"],
          architectureDescription: "System architecture overview",
          databaseUsed: "MySQL",
          apiIntegrations: ["OpenAI API", "Google Maps API"],
          githubUrl: "https://github.com/username/repo",
          liveDemoUrl: "https://demo.example.com",
          teamMembers: [
            { name: "Member One", role: "Frontend" },
            { name: "Member Two", role: "Backend" },
          ],
          mentorName: "Guide name",
          mentorEmail: "guide@college.edu",
          categories: ["AI", "Healthcare"],
          projectDomain: "AI",
          isPublic: true,
        },
        null,
        2
      ),
    []
  );

  const { data, isLoading } = useQuery({
    queryKey: ["showcase", "mine"],
    queryFn: () => getMyProjects(),
  });

  const projects = useMemo(() => data ?? [], [data]);

  function hydrateTeam(project: any): TeamMember[] {
    if (!project.teamMembers || project.teamMembers.length === 0) {
      return [{ name: "", role: "" }];
    }
    return project.teamMembers.map((member: any) => ({ name: member.name, role: member.role }));
  }

  function parseAssets(project: any, kind: "DOCUMENTATION" | "SCREENSHOT"): AssetRef[] {
    return (project.assets ?? [])
      .filter((asset: any) => asset.kind === kind)
      .map((asset: any) => ({
        fileUrl: asset.fileUrl,
        fileName: asset.fileName || "file",
        fileType: asset.fileType || "application/octet-stream",
      }));
  }

  function openCreate() {
    setEditingId(null);
    setForm(initialForm);
    setAiJsonInput("");
    setStep(0);
    setDialogOpen(true);
  }

  function openEdit(project: any) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription,
      problemStatement: project.problemStatement ?? "",
      objectives: project.objectives ?? "",
      methodology: project.methodology ?? "",
      keyFeaturesText: ((project.keyFeatures as string[]) ?? []).join("\n"),
      techStackText: ((project.techStack as string[]) ?? []).join(", "),
      architectureDescription: project.architectureDescription ?? "",
      databaseUsed: project.databaseUsed ?? "",
      apiIntegrationsText: ((project.apiIntegrations as string[]) ?? []).join(", "),
      githubUrl: project.githubUrl ?? "",
      liveDemoUrl: project.liveDemoUrl ?? "",
      documentationFiles: parseAssets(project, "DOCUMENTATION"),
      screenshots: parseAssets(project, "SCREENSHOT"),
      mentorName: project.mentorName ?? "",
      mentorEmail: project.mentorEmail ?? "",
      categoriesText: ((project.categories as string[]) ?? []).join(", "),
      projectDomain: (project.projectDomain as Domain) ?? "OTHER",
      isPublic: !!project.isPublic,
      teamMembers: hydrateTeam(project),
    });
    setAiJsonInput("");
    setStep(0);
    setDialogOpen(true);
  }

  async function copyAiTemplate() {
    try {
      await navigator.clipboard.writeText(aiTemplateJson);
      toast.success("AI JSON template copied");
    } catch {
      toast.error("Could not copy template. Please copy it manually from the box.");
    }
  }

  function importFromAiJson() {
    if (!aiJsonInput.trim()) {
      toast.error("Paste AI-generated JSON first");
      return;
    }

    try {
      const parsed = JSON.parse(aiJsonInput) as AiImportShape;

      const importedTeamMembers = Array.isArray(parsed.teamMembers)
        ? parsed.teamMembers
            .map((member) => {
              if (!member || typeof member !== "object") {
                return { name: "", role: "" };
              }
              const record = member as { name?: unknown; role?: unknown };
              return {
                name: toStringValue(record.name),
                role: toStringValue(record.role),
              };
            })
            .filter((member) => member.name || member.role)
        : [];

      const domainCandidate = toStringValue(parsed.projectDomain).toUpperCase();
      const normalizedDomain = domains.includes(domainCandidate as Domain)
        ? (domainCandidate as Domain)
        : undefined;

      const boolValue = toBooleanValue(parsed.isPublic);

      setForm((prev) => ({
        ...prev,
        title: toStringValue(parsed.title) || prev.title,
        shortDescription: toStringValue(parsed.shortDescription) || prev.shortDescription,
        fullDescription: toStringValue(parsed.fullDescription) || prev.fullDescription,
        problemStatement: toStringValue(parsed.problemStatement) || prev.problemStatement,
        objectives: toStringValue(parsed.objectives) || prev.objectives,
        methodology: toStringValue(parsed.methodology) || prev.methodology,
        keyFeaturesText: toLineSeparated(parsed.keyFeatures) || prev.keyFeaturesText,
        techStackText: toCommaSeparated(parsed.techStack) || prev.techStackText,
        architectureDescription:
          toStringValue(parsed.architectureDescription) || prev.architectureDescription,
        databaseUsed: toStringValue(parsed.databaseUsed) || prev.databaseUsed,
        apiIntegrationsText:
          toCommaSeparated(parsed.apiIntegrations) || prev.apiIntegrationsText,
        githubUrl: toStringValue(parsed.githubUrl) || prev.githubUrl,
        liveDemoUrl: toStringValue(parsed.liveDemoUrl) || prev.liveDemoUrl,
        mentorName:
          toStringValue(parsed.mentorName) ||
          toStringValue(parsed.mentor?.name) ||
          prev.mentorName,
        mentorEmail:
          toStringValue(parsed.mentorEmail) ||
          toStringValue(parsed.mentor?.email) ||
          prev.mentorEmail,
        categoriesText: toCommaSeparated(parsed.categories) || prev.categoriesText,
        projectDomain: normalizedDomain || prev.projectDomain,
        isPublic: boolValue === null ? prev.isPublic : boolValue,
        teamMembers:
          importedTeamMembers.length > 0 ? importedTeamMembers : prev.teamMembers,
      }));

      toast.success("AI JSON imported. Review and edit before saving.");
    } catch {
      toast.error("Invalid JSON. Please paste a valid JSON object.");
    }
  }

  function updateTeamMember(index: number, key: keyof TeamMember, value: string) {
    setForm((prev) => {
      const updated = [...prev.teamMembers];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, teamMembers: updated };
    });
  }

  function addTeamMember() {
    setForm((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "", role: "" }],
    }));
  }

  function removeTeamMember(index: number) {
    setForm((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.length === 1
        ? prev.teamMembers
        : prev.teamMembers.filter((_, i) => i !== index),
    }));
  }

  async function uploadAssets(files: FileList | null, kind: "DOCUMENTATION" | "SCREENSHOT") {
    if (!files || files.length === 0) return;

    if (!editingId) {
      toast.error("Create draft first", {
        description: "Save this draft once, then upload documentation and screenshots.",
      });
      return;
    }

    if (kind === "DOCUMENTATION") {
      setUploadingDocs(true);
    } else {
      setUploadingScreenshots(true);
    }

    try {
      const uploaded: AssetRef[] = [];

      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("projectId", editingId);
        fd.append("kind", kind);

        const res = await fetch("/api/showcase/upload", {
          method: "POST",
          body: fd,
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || `Upload failed (${res.status})`);
        }

        uploaded.push({
          fileUrl: json.fileUrl,
          fileName: json.fileName,
          fileType: json.fileType,
        });
      }

      setForm((prev) => ({
        ...prev,
        documentationFiles: kind === "DOCUMENTATION" ? [...prev.documentationFiles, ...uploaded] : prev.documentationFiles,
        screenshots: kind === "SCREENSHOT" ? [...prev.screenshots, ...uploaded] : prev.screenshots,
      }));

      toast.success(`${uploaded.length} file${uploaded.length > 1 ? "s" : ""} uploaded`);
    } catch (error: any) {
      toast.error(error?.message || "Upload failed");
    } finally {
      if (kind === "DOCUMENTATION") {
        setUploadingDocs(false);
      } else {
        setUploadingScreenshots(false);
      }
    }
  }

  function removeAsset(kind: "DOCUMENTATION" | "SCREENSHOT", index: number) {
    setForm((prev) => ({
      ...prev,
      documentationFiles:
        kind === "DOCUMENTATION"
          ? prev.documentationFiles.filter((_, i) => i !== index)
          : prev.documentationFiles,
      screenshots:
        kind === "SCREENSHOT"
          ? prev.screenshots.filter((_, i) => i !== index)
          : prev.screenshots,
    }));
  }

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription,
      problemStatement: form.problemStatement,
      objectives: form.objectives,
      methodology: form.methodology,
      keyFeatures: form.keyFeaturesText.split("\n").map((item) => item.trim()).filter(Boolean),
      techStack: parseCommaList(form.techStackText),
      architectureDescription: form.architectureDescription,
      databaseUsed: form.databaseUsed,
      apiIntegrations: parseCommaList(form.apiIntegrationsText),
      githubUrl: form.githubUrl,
      liveDemoUrl: form.liveDemoUrl,
      documentationUrl: "",
      documentationFiles: form.documentationFiles,
      screenshots: form.screenshots,
      teamMembers: form.teamMembers.filter((member) => member.name.trim() && member.role.trim()),
      mentorName: form.mentorName,
      mentorEmail: form.mentorEmail,
      categories: parseCommaList(form.categoriesText),
      projectDomain: form.projectDomain,
      isPublic: form.isPublic,
    };

    try {
      if (editingId) {
        await updateProject(editingId, payload);
        toast.success("Project draft updated");
      } else {
        await createProject(payload);
        toast.success("Project draft created");
      }

      setDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["showcase", "mine"] });
    } catch (error: any) {
      toast.error(error?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  async function runAction(action: () => Promise<any>, successMessage: string) {
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey: ["showcase", "mine"] });
      toast.success(successMessage);
    } catch (error: any) {
      toast.error(error?.message || "Action failed");
    }
  }

  if (!canCreate) {
    return (
      <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
        Showcase authoring is available for students and teachers only.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Showcase Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Structured submissions with version snapshots, resources, and team details.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>Create Structured Submission</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Showcase Submission" : "Create Showcase Submission"}</DialogTitle>
            </DialogHeader>

            <Card>
              <CardHeader>
                <CardTitle>AI Assist Import</CardTitle>
                <CardDescription>
                  Copy the template, share it with AI along with your document, then paste AI JSON below to auto-fill this form.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={copyAiTemplate}>
                    Copy JSON Template
                  </Button>
                  <Button type="button" onClick={importFromAiJson}>
                    Import AI JSON
                  </Button>
                </div>
                <Textarea
                  value={aiJsonInput}
                  onChange={(e) => setAiJsonInput(e.target.value)}
                  placeholder="Paste AI-generated JSON here"
                  className="min-h-[160px] font-mono text-xs"
                />
                <details className="rounded-md border p-2 text-xs text-muted-foreground">
                  <summary className="cursor-pointer font-medium">View JSON template</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words">{aiTemplateJson}</pre>
                </details>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 pb-2">
              {steps.map((stepName, index) => (
                <button
                  type="button"
                  key={stepName}
                  onClick={() => setStep(index)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    step === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {index + 1}. {stepName}
                </button>
              ))}
            </div>

            <form onSubmit={onSave} className="space-y-4">
              {step === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Project Title *</Label>
                      <Input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Short Description *</Label>
                      <Textarea
                        value={form.shortDescription}
                        onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                        placeholder="2-3 line project summary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Full Description *</Label>
                      <Textarea
                        value={form.fullDescription}
                        onChange={(e) => setForm((prev) => ({ ...prev, fullDescription: e.target.value }))}
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {step === 1 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Problem Statement</Label>
                      <Textarea value={form.problemStatement} onChange={(e) => setForm((prev) => ({ ...prev, problemStatement: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Objectives</Label>
                      <Textarea value={form.objectives} onChange={(e) => setForm((prev) => ({ ...prev, objectives: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Methodology / Approach</Label>
                      <Textarea value={form.methodology} onChange={(e) => setForm((prev) => ({ ...prev, methodology: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Key Features (one per line)</Label>
                      <Textarea
                        value={form.keyFeaturesText}
                        onChange={(e) => setForm((prev) => ({ ...prev, keyFeaturesText: e.target.value }))}
                        placeholder="Real-time dashboard\nRole-based permissions\nAutomated reporting"
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {step === 2 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Tech Stack (comma separated)</Label>
                      <Input value={form.techStackText} onChange={(e) => setForm((prev) => ({ ...prev, techStackText: e.target.value }))} placeholder="Next.js, Prisma, MySQL" />
                    </div>
                    <div className="space-y-2">
                      <Label>Architecture Description</Label>
                      <Textarea value={form.architectureDescription} onChange={(e) => setForm((prev) => ({ ...prev, architectureDescription: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Database Used</Label>
                      <Input value={form.databaseUsed} onChange={(e) => setForm((prev) => ({ ...prev, databaseUsed: e.target.value }))} placeholder="MySQL, PostgreSQL, MongoDB" />
                    </div>
                    <div className="space-y-2">
                      <Label>APIs / Integrations (comma separated)</Label>
                      <Input value={form.apiIntegrationsText} onChange={(e) => setForm((prev) => ({ ...prev, apiIntegrationsText: e.target.value }))} placeholder="OpenAI API, Google Maps API" />
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {step === 3 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Resources</CardTitle>
                    <CardDescription>
                      Upload documentation and screenshots directly to S3. URL text inputs are disabled by design.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>GitHub Repository URL</Label>
                      <Input value={form.githubUrl} onChange={(e) => setForm((prev) => ({ ...prev, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Live Demo URL</Label>
                      <Input value={form.liveDemoUrl} onChange={(e) => setForm((prev) => ({ ...prev, liveDemoUrl: e.target.value }))} placeholder="https://demo.example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Documentation / Report Files</Label>
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => uploadAssets(e.target.files, "DOCUMENTATION")}
                        disabled={!editingId || uploadingDocs}
                      />
                      {!editingId ? (
                        <p className="text-xs text-muted-foreground">Create draft first, then upload documentation files.</p>
                      ) : null}
                      {form.documentationFiles.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No documentation files uploaded.</p>
                      ) : (
                        <div className="space-y-1 rounded-md border p-2">
                          {form.documentationFiles.map((asset, index) => (
                            <div key={`${asset.fileUrl}-${index}`} className="flex items-center justify-between gap-2 text-xs">
                              <span className="truncate">{asset.fileName}</span>
                              <Button type="button" variant="outline" size="sm" onClick={() => removeAsset("DOCUMENTATION", index)}>
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Screenshots / Images</Label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => uploadAssets(e.target.files, "SCREENSHOT")}
                        disabled={!editingId || uploadingScreenshots}
                      />
                      {!editingId ? (
                        <p className="text-xs text-muted-foreground">Create draft first, then upload screenshots.</p>
                      ) : null}
                      {form.screenshots.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No screenshots uploaded.</p>
                      ) : (
                        <div className="space-y-1 rounded-md border p-2">
                          {form.screenshots.map((asset, index) => (
                            <div key={`${asset.fileUrl}-${index}`} className="flex items-center justify-between gap-2 text-xs">
                              <span className="truncate">{asset.fileName}</span>
                              <Button type="button" variant="outline" size="sm" onClick={() => removeAsset("SCREENSHOT", index)}>
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {step === 4 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Team Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {form.teamMembers.map((member, index) => (
                      <div key={`member-${index}`} className="grid gap-2 rounded-md border p-3 md:grid-cols-[1fr_1fr_auto]">
                        <Input
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                          placeholder="Team member name"
                        />
                        <Input
                          value={member.role}
                          onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                          placeholder="Role (Backend, UI, Lead, etc.)"
                        />
                        <Button type="button" variant="outline" onClick={() => removeTeamMember(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addTeamMember}>Add Team Member</Button>
                    <div className="space-y-2">
                      <Label>Guide / Mentor Name (optional)</Label>
                      <Input value={form.mentorName} onChange={(e) => setForm((prev) => ({ ...prev, mentorName: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Guide / Mentor Email (optional)</Label>
                      <Input value={form.mentorEmail} onChange={(e) => setForm((prev) => ({ ...prev, mentorEmail: e.target.value }))} type="email" />
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {step === 5 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Tags / Categories (comma separated)</Label>
                      <Input value={form.categoriesText} onChange={(e) => setForm((prev) => ({ ...prev, categoriesText: e.target.value }))} placeholder="University, Final Year, Portfolio" />
                    </div>
                    <div className="space-y-2">
                      <Label>Project Domain</Label>
                      <Select value={form.projectDomain} onValueChange={(value) => setForm((prev) => ({ ...prev, projectDomain: value as Domain }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {domains.map((domain) => (
                            <SelectItem key={domain} value={domain}>{domain.replace("_", " ")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm((prev) => ({ ...prev, isPublic: e.target.checked }))} />
                      Make public once published
                    </label>
                  </CardContent>
                </Card>
              ) : null}

              <div className="flex items-center justify-between">
                <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((prev) => prev - 1)}>
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {step < steps.length - 1 ? (
                    <Button type="button" onClick={() => setStep((prev) => prev + 1)}>Next</Button>
                  ) : null}
                  <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Save Draft" : "Create Draft"}</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading your projects...</p>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No submissions yet. Start with a structured draft.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{project.status}</Badge>
                  <Badge variant="outline">{project.projectDomain.replace("_", " ")}</Badge>
                  <Badge variant="outline">Versions {project.versions.length}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {((project.techStack as string[]) ?? []).slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full border px-2 py-1 text-xs">{tag}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Team members: {project.teamMembers.length} | Resources: {project.assets.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(project)}>Edit Draft</Button>
                  {project.status === "DRAFT" ? (
                    <Button size="sm" onClick={() => runAction(() => submitProject(project.id), "Submission sent for review")}>Submit for Review</Button>
                  ) : null}
                  {project.status === "CHANGES_REQUESTED" ? (
                    <Button size="sm" onClick={() => runAction(() => resubmitProject(project.id), "Project resubmitted")}>Resubmit</Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
