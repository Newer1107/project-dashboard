"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileIcon, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const MIME_MAP: Record<string, string> = {
  webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg",
  png: "image/png", gif: "image/gif", svg: "image/svg+xml",
  pdf: "application/pdf", doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip", txt: "text/plain", csv: "text/csv",
  mp4: "video/mp4", mp3: "audio/mpeg",
};

function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return MIME_MAP[ext] ?? "application/octet-stream";
}

interface FileUploaderProps {
  projectId: string;
  taskId?: string;
  onUploadComplete?: () => void;
}

export function FileUploader({ projectId, taskId, onUploadComplete }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("OTHER");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, "pending" | "uploading" | "done" | "error">>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleUpload() {
    if (files.length === 0) return;
    setUploading(true);
    let anyError = false;

    for (const file of files) {
      try {
        setUploadProgress((prev) => ({ ...prev, [file.name]: "uploading" }));

        const fd = new FormData();
        fd.append("file", file);
        fd.append("projectId", projectId);
        fd.append("category", category);
        if (taskId) fd.append("taskId", taskId);

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error ?? `Upload failed (${res.status})`);
        }

        setUploadProgress((prev) => ({ ...prev, [file.name]: "done" }));
      } catch (err) {
        anyError = true;
        console.error(`Upload error for ${file.name}:`, err);
        setUploadProgress((prev) => ({ ...prev, [file.name]: "error" }));
        const message = err instanceof Error ? err.message : String(err);
        toast.error(`Failed to upload ${file.name}`, { description: message });
      }
    }

    setUploading(false);
    if (!anyError) {
      toast.success("Files uploaded successfully");
      setFiles([]);
      setUploadProgress({});
      onUploadComplete?.();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="REPORT">Report</SelectItem>
            <SelectItem value="PRESENTATION">Presentation</SelectItem>
            <SelectItem value="CODE">Code</SelectItem>
            <SelectItem value="DATASET">Dataset</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium">
          {isDragActive ? "Drop files here" : "Drag & drop files, or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Max file size: 50MB</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const status = uploadProgress[file.name];
            return (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                {status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                {status === "done" && <Check className="h-4 w-4 text-emerald-500" />}
                {!status && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button onClick={handleUpload} disabled={uploading} className="w-full">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {files.length} file{files.length > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
