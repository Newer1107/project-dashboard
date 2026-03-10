"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectFiles } from "@/server/actions/files";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Trash2 } from "lucide-react";
import { getDownloadUrl, deleteFile } from "@/server/actions/files";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface FilesTabProps {
  projectId: string;
}

const categoryColors: Record<string, string> = {
  REPORT: "bg-indigo-500/20 text-indigo-400",
  PRESENTATION: "bg-violet-500/20 text-violet-400",
  CODE: "bg-emerald-500/20 text-emerald-400",
  DATASET: "bg-blue-500/20 text-blue-400",
  OTHER: "bg-zinc-500/20 text-zinc-400",
};

export function FilesTab({ projectId }: FilesTabProps) {
  const queryClient = useQueryClient();
  const { data: files, isLoading } = useQuery({
    queryKey: ["files", projectId],
    queryFn: () => getProjectFiles(projectId),
  });

  async function handleDownload(fileId: string, filename: string) {
    try {
      const url = await getDownloadUrl(fileId);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    } catch {
      toast.error("Failed to get download link");
    }
  }

  async function handleDelete(fileId: string) {
    try {
      await deleteFile(fileId);
      queryClient.invalidateQueries({ queryKey: ["files", projectId] });
      toast.success("File deleted");
    } catch {
      toast.error("Failed to delete file");
    }
  }

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="space-y-6">
      <FileUploader
        projectId={projectId}
        onUploadComplete={() =>
          queryClient.invalidateQueries({ queryKey: ["files", projectId] })
        }
      />

      <div className="space-y-2">
        {(files ?? []).length === 0 && (
          <p className="text-center text-muted-foreground py-8">No files uploaded yet</p>
        )}
        {(files ?? []).map((file: any) => (
          <div
            key={file.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{file.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.fileSize / 1024).toFixed(1)} KB •{" "}
                  {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                  {file.uploader && ` • ${file.uploader.name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={categoryColors[file.category] ?? ""}>
                {file.category}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(file.id, file.fileName)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(file.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
