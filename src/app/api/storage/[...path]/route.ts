import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "node:stream";
import { BUCKET, s3Client } from "@/lib/s3";

export const runtime = "nodejs";

function decodeObjectKey(segments: string[]): string {
  return segments.map((segment) => decodeURIComponent(segment)).join("/").trim();
}

function bodyToWebStream(body: unknown): ReadableStream<Uint8Array> | null {
  if (!body) return null;

  if (body instanceof Readable) {
    return Readable.toWeb(body) as ReadableStream<Uint8Array>;
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "transformToWebStream" in body &&
    typeof (body as { transformToWebStream?: () => ReadableStream<Uint8Array> }).transformToWebStream ===
      "function"
  ) {
    return (body as { transformToWebStream: () => ReadableStream<Uint8Array> }).transformToWebStream();
  }

  return null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    if (!path || path.length === 0) {
      return new Response("Not found", { status: 404 });
    }

    const objectKey = decodeObjectKey(path);
    if (!objectKey) {
      return new Response("Not found", { status: 404 });
    }

    const result = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: objectKey,
      })
    );

    const stream = bodyToWebStream(result.Body);
    if (!stream) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", result.ContentType ?? "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=3600");

    if (result.ContentLength != null) {
      headers.set("Content-Length", String(result.ContentLength));
    }

    return new Response(stream, {
      status: 200,
      headers,
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
