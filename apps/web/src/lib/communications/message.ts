import type {
  AttachmentType,
  ChannelType,
  MessageType,
  UserType,
} from "@work-holo/db/lib/types";

export function buildMessageWithAttachments(
  message: MessageType,
  sender: UserType,
  channel: ChannelType
) {
  return {
    ...message,
    sender,
    channel,
    attachments: [] as AttachmentType[],
  };
}

export function buildOrderedMessages(
  pages: Array<
    Array<{
      message: MessageType;
      sender: UserType;
      channel: ChannelType;
      attachment: AttachmentType | undefined;
    }>
  >
) {
  if (!pages || pages.length === 0) {
    return [];
  }

  const map = new Map<string, ReturnType<typeof buildMessageWithAttachments>>();

  for (const page of pages) {
    for (const { message, sender, attachment, channel } of page) {
      if (!map.has(message.id)) {
        map.set(
          message.id,
          buildMessageWithAttachments(message, sender, channel)
        );
      }

      if (attachment) {
        map.get(message.id)?.attachments.push(attachment);
      }
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export type DateSeparator = {
  type: "date-separator";
  id: string;
  date: string;
  displayDate: string;
};

export type NewMessagesSeparator = {
  type: "new-messages-separator";
  id: string;
};

export type MessageWithSender = ReturnType<typeof buildMessageWithAttachments>;

export type MessageListItem<T extends MessageWithSender = MessageWithSender> =
  | T
  | DateSeparator
  | NewMessagesSeparator;

function formatDateSeparator(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) {
    return "Today";
  }

  if (isSameDay(date, yesterday)) {
    return "Yesterday";
  }

  const isThisYear = date.getFullYear() === today.getFullYear();

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: isThisYear ? undefined : "numeric",
  });
}

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function insertDateSeparators<T extends MessageWithSender>(
  messages: T[]
): MessageListItem<T>[] {
  if (messages.length === 0) {
    return [];
  }

  const result: MessageListItem<T>[] = [];
  let lastDateKey: string | null = null;

  for (const message of messages) {
    const messageDate = new Date(message.createdAt);
    const currentDateKey = getDateKey(messageDate);

    if (currentDateKey !== lastDateKey) {
      result.push({
        type: "date-separator",
        id: `separator-${currentDateKey}`,
        date: currentDateKey,
        displayDate: formatDateSeparator(messageDate),
      });
      lastDateKey = currentDateKey;
    }

    result.push(message);
  }

  return result;
}

/**
 * Insert a "new messages" separator before the first unread message
 * Uses lastReadMessageId to find the position in the list
 * Should be called after insertDateSeparators
 */
export function insertNewMessagesSeparator<T extends MessageWithSender>(
  items: MessageListItem<T>[],
  lastReadMessageId: string | null | undefined
): MessageListItem<T>[] {
  if (!lastReadMessageId) {
    return items;
  }

  // Find the index of the last read message
  let lastReadIndex = -1;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Skip separators
    if (
      "type" in item &&
      (item.type === "date-separator" || item.type === "new-messages-separator")
    ) {
      continue;
    }

    // Check if this is the last read message
    if (item.id === lastReadMessageId) {
      lastReadIndex = i;
      break;
    }
  }

  // If last read message not found or it's the last item, no separator needed
  if (lastReadIndex === -1 || lastReadIndex === items.length - 1) {
    return items;
  }

  // Find the next actual message after the last read one (skip date separators)
  let insertIndex = lastReadIndex + 1;
  while (insertIndex < items.length) {
    const item = items[insertIndex];
    if (
      !("type" in item) ||
      (item.type !== "date-separator" && item.type !== "new-messages-separator")
    ) {
      break;
    }
    insertIndex++;
  }

  // If we've reached the end, don't add separator
  if (insertIndex >= items.length) {
    return items;
  }

  // Insert the separator before the first unread message
  const result = [...items];
  result.splice(insertIndex, 0, {
    type: "new-messages-separator",
    id: "new-messages-separator",
  });

  return result;
}
