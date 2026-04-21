import { IconX } from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";

interface Attachment {
  file: File;
  id: string;
}

interface DmAttachmentPreviewListProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

export function DmAttachmentPreviewList({
  attachments,
  onRemove,
}: DmAttachmentPreviewListProps) {
  return (
    <div className="flex flex-wrap gap-2 p-3">
      {attachments.map((attachment) => (
        <div
          className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2"
          key={attachment.id}
        >
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-sm">
              {attachment.file.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatFileSize(attachment.file.size)}
            </span>
          </div>
          <Button
            className="h-6 w-6 shrink-0"
            onClick={() => onRemove(attachment.id)}
            size="icon"
            variant="ghost"
          >
            <IconX className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
