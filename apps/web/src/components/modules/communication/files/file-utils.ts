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
    image:
      "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-200",
    document: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200",
    video: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
    audio:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    archive:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    other:
      "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200",
  };
  return colors[type] || colors.other;
}

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function getAttachmentTypeFromMime(
  mimeType: string
): "image" | "document" | "video" | "audio" | "archive" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z")
  ) {
    return "archive";
  }

  return "document";
}
