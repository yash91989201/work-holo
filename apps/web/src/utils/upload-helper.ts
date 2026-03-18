import { orpcClient } from "./orpc";

export type StorageBucket =
  | "message-attachment"
  | "message-audio"
  | "message-image"
  | "user-profile"
  | "org-logo"
  | "notification-sound";

export interface UploadResult {
  bucket: StorageBucket;
  fileName: string;
  fileSize: number;
  mimeType: string;
  originalName: string;
  url: string;
}

async function uploadFileWithPresignedUrl(
  uploadUrl: string,
  file: File
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status: ${response.status}`);
  }
}

export async function uploadToStorage(
  file: File,
  bucket: StorageBucket
): Promise<UploadResult> {
  const { uploadUrl, publicUrl, filePath } =
    await orpcClient.storage.getUploadUrl({
      bucket,
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
    });

  await uploadFileWithPresignedUrl(uploadUrl, file);

  return {
    fileName: filePath,
    originalName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    url: publicUrl,
    bucket,
  };
}

export async function uploadProfileImage(
  file: File,
  _userId: string
): Promise<string> {
  const result = await uploadToStorage(file, "user-profile");
  return result.url;
}

export async function uploadMessageImage(file: File): Promise<string> {
  const result = await uploadToStorage(file, "message-image");
  return result.url;
}

export async function uploadOrgLogo(file: File): Promise<string> {
  const result = await uploadToStorage(file, "org-logo");
  return result.url;
}

export async function uploadNotificationSound(
  file: File
): Promise<UploadResult> {
  return await uploadToStorage(file, "notification-sound");
}
