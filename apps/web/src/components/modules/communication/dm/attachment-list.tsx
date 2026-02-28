import {
  IconFile,
  IconFileMusic,
  IconFileTypePdf,
  IconFileZip,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import type { DmAttachmentType } from "@work-holo/db/lib/types";
import { cn } from "@/lib/utils";

interface DmAttachmentListProps {
  attachments: DmAttachmentType[];
  isOwnMessage: boolean;
}

function getAttachmentIcon(type: string) {
  switch (type) {
    case "image":
      return IconPhoto;
    case "video":
      return IconVideo;
    case "audio":
      return IconFileMusic;
    case "archive":
      return IconFileZip;
    case "pdf":
      return IconFileTypePdf;
    default:
      return IconFile;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

export function DmAttachmentList({
  attachments,
  isOwnMessage,
}: DmAttachmentListProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        isOwnMessage ? "items-end" : "items-start"
      )}
    >
      {attachments.map((attachment) => {
        const Icon = getAttachmentIcon(attachment.type);

        if (attachment.type === "image" && attachment.url) {
          return (
            <a
              className="block overflow-hidden rounded-lg"
              href={attachment.url}
              key={attachment.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt={attachment.originalName}
                className="max-h-60 max-w-full object-cover"
                src={attachment.url}
              />
            </a>
          );
        }

        return (
          <a
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent",
              isOwnMessage ? "bg-primary/10" : "bg-background"
            )}
            href={attachment.url || undefined}
            key={attachment.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-sm">
                {attachment.originalName}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatFileSize(attachment.fileSize)}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
