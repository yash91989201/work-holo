import {
  IconFileText,
  IconFileZip,
  IconMicrophone,
  IconPhoto,
  IconVideo,
  type TablerIcon,
} from "@tabler/icons-react";
import type { AttachmentTypeSchema } from "@work-holo/api/lib/schemas/attachment";
import type { z } from "zod";

type AttachmentType = z.infer<typeof AttachmentTypeSchema>;

export function getFileIcon(type: AttachmentType): TablerIcon {
  switch (type) {
    case "image":
      return IconPhoto;
    case "document":
      return IconFileText;
    case "video":
      return IconVideo;
    case "audio":
      return IconMicrophone;
    case "archive":
      return IconFileZip;
    default:
      return IconFileText;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

export function getFileTypeLabel(type: AttachmentType): string {
  const labels: Record<AttachmentType, string> = {
    image: "Image",
    document: "Document",
    video: "Video",
    audio: "Audio",
    archive: "Archive",
    other: "File",
  };
  return labels[type] || "File";
}

export function getFileTypeColor(type: AttachmentType): string {
  const colors: Record<AttachmentType, string> = {
    image: "bg-purple-100 text-purple-700",
    document: "bg-blue-100 text-blue-700",
    video: "bg-red-100 text-red-700",
    audio: "bg-green-100 text-green-700",
    archive: "bg-gray-100 text-gray-700",
    other: "bg-gray-100 text-gray-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
}

export function isPreviewable(mimeType: string): boolean {
  return (
    mimeType.startsWith("image/") ||
    mimeType.startsWith("video/") ||
    mimeType.startsWith("audio/")
  );
}

export function getPreviewType(
  mimeType: string
): "image" | "video" | "audio" | "other" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "other";
}
