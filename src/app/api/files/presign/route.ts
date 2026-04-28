import { NextRequest, NextResponse } from "next/server";
import { resolveUserFromHeaders } from "@/lib/resolve-user";
import { generatePresignedUploadUrl, buildS3Key } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const user = await resolveUserFromHeaders(req.headers);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, fileName, fileType, category } = body;

    if (!projectId || !fileName || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const s3Key = buildS3Key(projectId, category || "other", fileName);
    const uploadUrl = await generatePresignedUploadUrl(s3Key, fileType);

    return NextResponse.json({ uploadUrl, s3Key });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
