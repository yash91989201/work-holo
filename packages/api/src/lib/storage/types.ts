import type { BUCKETS } from "./constants";

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

export interface UploadUrlRequest {
  bucket: BucketName;
  fileName: string;
  contentType: string;
  fileSize: number;
  userId: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  filePath: string;
  bucket: BucketName;
  expiresAt: Date;
}

export interface DeleteFileRequest {
  bucket: BucketName;
  filePath: string;
}

export interface DeleteFileResponse {
  success: boolean;
  filePath: string;
  bucket: BucketName;
}

export interface GetPublicUrlRequest {
  bucket: BucketName;
  filePath: string;
}

export interface FileMetadata {
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  bucket: BucketName;
  filePath: string;
  publicUrl: string;
}

export interface StorageError {
  code: string;
  message: string;
  bucket?: BucketName;
  filePath?: string;
}
