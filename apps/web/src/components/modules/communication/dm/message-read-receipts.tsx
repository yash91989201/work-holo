import { IconChecks } from "@tabler/icons-react";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import { dmMessageReadsCollection } from "@/db/collections";
import { cn } from "@/lib/utils";

/**
 * Simple WhatsApp-style read receipt for DM messages.
 * Shows double-tick icon that changes color based on read status:
 * - Grey (muted): Message sent but not read
 * - Primary color: Message has been read by the other participant
 *
 * Only displays for the sender's own messages in 2-participant conversations.
 */
export function DmMessageReadReceipts({
  messageId,
  isOwnMessage,
  userId,
}: {
  messageId: string;
  isOwnMessage: boolean;
  userId: string;
  conversationId: string; // Keep for compatibility but not used
}) {
  // Only show read receipts for own messages
  if (!isOwnMessage) {
    return null;
  }

  // Get read receipts for this specific message from Electric SQL
  const { data: readReceipts = [] } = useLiveQuery(
    (q) =>
      q
        .from({ read: dmMessageReadsCollection })
        .where(({ read }) => eq(read.messageId, messageId))
        .select(({ read }) => ({
          userId: read.userId,
        })),
    [messageId]
  );

  // Check if the other participant (not the sender) has read the message
  const isReadByOther = useMemo(
    () => readReceipts.some((receipt) => receipt.userId !== userId),
    [readReceipts, userId]
  );

  return (
    <div className="flex items-center">
      <IconChecks
        className={cn(
          "size-4",
          isReadByOther ? "text-primary" : "text-muted-foreground"
        )}
      />
    </div>
  );
}
