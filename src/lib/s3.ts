import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function readEnvTrimmed(value: string | undefined): string | undefined {
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value.trim() === "") return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function normalizeEndpoint(endpoint: string | undefined): string | undefined {
  const trimmed = readEnvTrimmed(endpoint);
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const useSsl = parseBoolean(process.env.MINIO_USE_SSL, true);
  return `${useSsl ? "https" : "http"}://${trimmed}`;
}

const STORAGE_REGION =
  readEnvTrimmed(process.env.MINIO_REGION) ??
  readEnvTrimmed(process.env.AWS_REGION) ??
  readEnvTrimmed(process.env.AWS_DEFAULT_REGION) ??
  "us-east-1";
const STORAGE_ACCESS_KEY = readEnvTrimmed(process.env.MINIO_ACCESS_KEY);
const STORAGE_SECRET_KEY = readEnvTrimmed(process.env.MINIO_SECRET_KEY);
const STORAGE_ENDPOINT = normalizeEndpoint(process.env.MINIO_ENDPOINT);
const STORAGE_FORCE_PATH_STYLE = parseBoolean(
  process.env.S3_FORCE_PATH_STYLE,
  Boolean(STORAGE_ENDPOINT),
);

if (!STORAGE_ACCESS_KEY || !STORAGE_SECRET_KEY || !STORAGE_ENDPOINT || !STORAGE_REGION) {
  throw new Error(
    "Missing MinIO config: set MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, and MINIO_REGION (or AWS_REGION).",
  );
}

export const s3Client = new S3Client({
  region: STORAGE_REGION,
  credentials: {
    accessKeyId: STORAGE_ACCESS_KEY!,
    secretAccessKey: STORAGE_SECRET_KEY!,
  },
  endpoint: STORAGE_ENDPOINT,
  forcePathStyle: STORAGE_FORCE_PATH_STYLE,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export const BUCKET = readEnvTrimmed(process.env.S3_BUCKET_NAME)!;

if (!BUCKET) {
  throw new Error("Missing MinIO config: set S3_BUCKET_NAME.");
}

export function buildS3Key(
  projectId: string,
  category: string,
  filename: string
): string {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `uploads/${projectId}/${category.toLowerCase()}/${timestamp}-${sanitized}`;
}

export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 300
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 900
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteS3Object(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  await s3Client.send(command);
}
