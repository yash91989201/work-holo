import type { DmMessageWithSender } from "@/lib/communications/dm-message";
import { cn } from "@/lib/utils";
import { DmAttachmentList } from "./attachment-list";

interface DmMessageContentProps {
  isOwnMessage: boolean;
  message: DmMessageWithSender;
}

export function DmMessageContent({
  isOwnMessage,
  message,
}: DmMessageContentProps) {
  const hasContent = message.content && message.content.trim().length > 0;
  const hasAttachments = message.attachments.length > 0;

  if (message.isDeleted) {
    return (
      <div
        className={cn(
          "rounded-2xl px-4 py-2",
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <span className="text-muted-foreground italic">
          This message was deleted
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        isOwnMessage ? "items-end" : "items-start"
      )}
    >
      {hasContent && (
        <div
          className={cn(
            "prose prose-sm max-w-none overflow-hidden rounded-2xl px-4 py-2",
            isOwnMessage
              ? "bg-primary prose-a:text-primary-foreground prose-headings:text-primary-foreground text-primary-foreground"
              : "bg-muted text-foreground"
          )}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Message content is sanitized
          dangerouslySetInnerHTML={{ __html: message.content || "" }}
        />
      )}

      {hasAttachments && (
        <DmAttachmentList
          attachments={message.attachments}
          isOwnMessage={isOwnMessage}
        />
      )}
    </div>
  );
}
