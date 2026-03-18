import { env } from "../../env";
import { getStorageClient } from "./client";
import {
  ALLOWED_MIME_TYPES,
  BUCKETS,
  FILE_SIZE_LIMITS,
  URL_EXPIRY,
} from "./constants";
import type {
  BucketName,
  DeleteFileRequest,
  DeleteFileResponse,
  UploadUrlRequest,
  UploadUrlResponse,
} from "./types";

function generateFilePath(
  bucket: BucketName,
  userId: string,
  fileName: string
): string {
  const fileExt = fileName.split(".").pop() ?? "";
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 9);

  if (bucket === BUCKETS.USER_PROFILE) {
    return `${userId}/avatar.${fileExt}`;
  }

  if (bucket === BUCKETS.ORG_LOGO) {
    return `${userId}/${fileName}`;
  }

  return `${userId}/${timestamp}-${randomSuffix}.${fileExt}`;
}

function getPublicUrl(bucket: BucketName, filePath: string): string {
  return `${env.S3_ENDPOINT}/${bucket}/${filePath}`;
}

function validateFileType(bucket: BucketName, contentType: string): boolean {
  const allowedTypes = ALLOWED_MIME_TYPES[bucket];
  if (!allowedTypes || allowedTypes.length === 0) {
    return true;
  }
  return allowedTypes.includes(contentType);
}

function getFileSizeLimit(bucket: BucketName): number {
  switch (bucket) {
    case BUCKETS.MESSAGE_IMAGE:
    case BUCKETS.USER_PROFILE:
    case BUCKETS.ORG_LOGO:
      return FILE_SIZE_LIMITS.IMAGE;
    case BUCKETS.MESSAGE_AUDIO:
      return FILE_SIZE_LIMITS.AUDIO;
    case BUCKETS.NOTIFICATION_SOUND:
      return FILE_SIZE_LIMITS.NOTIFICATION_SOUND;
    default:
      return FILE_SIZE_LIMITS.DEFAULT;
  }
}

export async function getUploadUrl(
  request: UploadUrlRequest
): Promise<UploadUrlResponse> {
  const { bucket, fileName, contentType, fileSize, userId } = request;

  if (!validateFileType(bucket, contentType)) {
    throw new Error(
      `File type ${contentType} is not allowed for bucket ${bucket}`
    );
  }

  const sizeLimit = getFileSizeLimit(bucket);
  if (fileSize > sizeLimit) {
    throw new Error(
      `File size ${fileSize} exceeds limit of ${sizeLimit} bytes for bucket ${bucket}`
    );
  }

  const client = await getStorageClient();
  const filePath = generateFilePath(bucket, userId, fileName);

  const uploadUrl = await client.presignedPutObject(
    bucket,
    filePath,
    URL_EXPIRY.UPLOAD
  );

  const publicUrl = getPublicUrl(bucket, filePath);
  const expiresAt = new Date(Date.now() + URL_EXPIRY.UPLOAD * 1000);

  return {
    uploadUrl,
    publicUrl,
    filePath,
    bucket,
    expiresAt,
  };
}

export async function deleteFile(
  request: DeleteFileRequest
): Promise<DeleteFileResponse> {
  const { bucket, filePath } = request;
  const client = await getStorageClient();

  await client.removeObject(bucket, filePath);

  return {
    success: true,
    filePath,
    bucket,
  };
}

export async function deleteFiles(
  bucket: BucketName,
  filePaths: string[]
): Promise<void> {
  if (filePaths.length === 0) return;

  const client = await getStorageClient();
  const objectsList = filePaths.map((name) => ({ name }));
  await client.removeObjects(bucket, objectsList);
}

export async function fileExists(
  bucket: BucketName,
  filePath: string
): Promise<boolean> {
  const client = await getStorageClient();
  try {
    await client.statObject(bucket, filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getPresignedDownloadUrl(
  bucket: BucketName,
  filePath: string,
  expirySeconds = URL_EXPIRY.DOWNLOAD
): Promise<string> {
  const client = await getStorageClient();
  return client.presignedGetObject(bucket, filePath, expirySeconds);
}

export { getPublicUrl };
