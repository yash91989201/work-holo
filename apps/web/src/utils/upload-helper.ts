import { supabase } from "@/lib/supabase";

export interface UploadResult {
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  bucket: string;
}

export async function uploadToSupabase(
  file: File,
  bucket: "message-attachment" | "message-audio" | "user-profile",
  userId: string
): Promise<UploadResult> {
  const fileExt = file.name.split(".").pop();

  // For user-profile, use a simpler path structure that overwrites
  const fileName =
    bucket === "user-profile"
      ? `${userId}/avatar.${fileExt}`
      : `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: "3600",
    upsert: bucket === "user-profile", // Allow overwriting for profile images
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return {
    fileName,
    originalName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    url: publicUrl,
    bucket,
  };
}

// Helper for profile image upload specifically
export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<string> {
  const result = await uploadToSupabase(file, "user-profile", userId);
  return result.url;
}
