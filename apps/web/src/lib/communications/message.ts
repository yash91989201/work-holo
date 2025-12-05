import type {
  AttachmentType,
  MessageType,
  UserType,
} from "@work-holo/db/lib/types";

export function buildMessageWithAttachments(
  message: MessageType,
  sender: UserType
) {
  return {
    ...message,
    sender,
    attachments: [] as AttachmentType[],
  };
}

export function buildOrderedMessages(
  pages: Array<
    Array<{
      message: MessageType;
      sender: UserType;
      attachment: AttachmentType | undefined;
    }>
  >
) {
  if (!pages || pages.length === 0) {
    return [];
  }

  const map = new Map<string, ReturnType<typeof buildMessageWithAttachments>>();

  for (const page of pages) {
    for (const { message, sender, attachment } of page) {
      if (!map.has(message.id)) {
        map.set(message.id, buildMessageWithAttachments(message, sender));
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

export type MessageWithSender = ReturnType<typeof buildMessageWithAttachments>;

export type MessageListItem = MessageWithSender | DateSeparator;

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

export function insertDateSeparators(
  messages: MessageWithSender[]
): MessageListItem[] {
  if (messages.length === 0) {
    return [];
  }

  const result: MessageListItem[] = [];
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
