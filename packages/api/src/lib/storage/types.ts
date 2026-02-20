import type { BUCKETS } from "./constants";

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

export interface UploadUrlRequest {
  bucket: BucketName;
  contentType: string;
  fileName: string;
  fileSize: number;
  userId: string;
}

export interface UploadUrlResponse {
  bucket: BucketName;
  expiresAt: Date;
  filePath: string;
  publicUrl: string;
  uploadUrl: string;
}

export interface DeleteFileRequest {
  bucket: BucketName;
  filePath: string;
}

export interface DeleteFileResponse {
  bucket: BucketName;
  filePath: string;
  success: boolean;
}

export interface GetPublicUrlRequest {
  bucket: BucketName;
  filePath: string;
}

export interface FileMetadata {
  bucket: BucketName;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  originalName: string;
  publicUrl: string;
}

export interface StorageError {
  bucket?: BucketName;
  code: string;
  filePath?: string;
  message: string;
}
