import {
  deleteFile,
  deleteFiles,
  fileExists,
  getPresignedDownloadUrl,
  getPublicUrl,
  getUploadUrl,
} from "../../lib/storage";
import type {
  BucketName,
  DeleteFileRequest,
  DeleteFileResponse,
  UploadUrlResponse,
} from "../../lib/storage/types";

type StorageServiceConstructor = {
  userId: string;
};

export class StorageService {
  readonly userId: string;

  constructor({ userId }: StorageServiceConstructor) {
    this.userId = userId;
  }

  getUploadUrl(input: {
    bucket: BucketName;
    fileName: string;
    contentType: string;
    fileSize: number;
  }): Promise<UploadUrlResponse> {
    return getUploadUrl({ ...input, userId: this.userId });
  }

  deleteFile(request: DeleteFileRequest): Promise<DeleteFileResponse> {
    return deleteFile(request);
  }

  deleteFiles(bucket: BucketName, filePaths: string[]): Promise<void> {
    return deleteFiles(bucket, filePaths);
  }

  fileExists(bucket: BucketName, filePath: string): Promise<boolean> {
    return fileExists(bucket, filePath);
  }

  getPresignedDownloadUrl(
    bucket: BucketName,
    filePath: string,
    expirySeconds?: number
  ): Promise<string> {
    return getPresignedDownloadUrl(bucket, filePath, expirySeconds);
  }

  getPublicUrl(bucket: BucketName, filePath: string): string {
    return getPublicUrl(bucket, filePath);
  }
}
