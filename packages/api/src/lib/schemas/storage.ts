import { z } from "zod";
import { BUCKETS } from "../storage";

export const BucketSchema = z.enum([
  BUCKETS.MESSAGE_ATTACHMENT,
  BUCKETS.MESSAGE_AUDIO,
  BUCKETS.MESSAGE_IMAGE,
  BUCKETS.USER_PROFILE,
  BUCKETS.ORG_LOGO,
  BUCKETS.NOTIFICATION_SOUND,
]);

export const GetUploadUrlInput = z.object({
  bucket: BucketSchema,
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1).max(255),
  fileSize: z.number().min(1),
});

export const GetUploadUrlOutput = z.object({
  uploadUrl: z.string(),
  publicUrl: z.string(),
  filePath: z.string(),
  bucket: BucketSchema,
  expiresAt: z.date(),
});

export const DeleteFileInput = z.object({
  bucket: BucketSchema,
  filePath: z.string().min(1),
});

export const DeleteFileOutput = z.object({
  success: z.boolean(),
  filePath: z.string(),
  bucket: BucketSchema,
});

export const DeleteFilesInput = z.object({
  bucket: BucketSchema,
  filePaths: z.array(z.string().min(1)),
});

export const DeleteFilesOutput = z.object({
  success: z.boolean(),
  count: z.number(),
});
