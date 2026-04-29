import { NextRequest, NextResponse } from "next/server";
import { resolveUserFromHeaders } from "@/lib/resolve-user";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET, buildS3Key, s3Client } from "@/lib/s3";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const user = await resolveUserFromHeaders(req.headers);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "STUDENT" && user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = (formData.get("projectId") as string | null)?.trim();
    const kind = ((formData.get("kind") as string | null) ?? "OTHER").trim();

    if (!file || !projectId) {
      return NextResponse.json({ error: "Missing file or projectId" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });
    }

    const normalizedKind = kind === "SCREENSHOT" ? "screenshot" : "documentation";
    const fileType = file.type || "application/octet-stream";
    const s3Key = buildS3Key(projectId, `showcase-${normalizedKind}`, file.name);
    const body = Buffer.from(await file.arrayBuffer());

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: body,
        ContentType: fileType,
      })
    );

    return NextResponse.json({
      fileUrl: s3Key,
      fileName: file.name,
      fileType,
      kind,
    });
  } catch (error) {
    console.error("[/api/showcase/upload]", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
