import type {
  DmAttachmentType,
  DmMessageType,
  UserType,
} from "@work-holo/db/lib/types";

export function buildDmMessageWithAttachments(
  message: DmMessageType,
  sender: UserType
) {
  return {
    ...message,
    sender,
    attachments: [] as DmAttachmentType[],
  };
}

export function buildOrderedDmMessages(
  pages: Array<
    Array<{
      message: DmMessageType;
      sender: UserType;
      attachment: DmAttachmentType | null;
    }>
  >
) {
  if (!pages || pages.length === 0) {
    return [];
  }

  const map = new Map<
    string,
    ReturnType<typeof buildDmMessageWithAttachments>
  >();

  for (const page of pages) {
    for (const { message, sender, attachment } of page) {
      if (!map.has(message.id)) {
        map.set(message.id, buildDmMessageWithAttachments(message, sender));
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

export type DmMessageWithSender = ReturnType<
  typeof buildDmMessageWithAttachments
>;

export type DmMessageListItem<
  T extends DmMessageWithSender = DmMessageWithSender,
> = T | DateSeparator | NewMessagesSeparator;

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

export function insertDateSeparators<T extends DmMessageWithSender>(
  messages: T[]
): DmMessageListItem<T>[] {
  if (messages.length === 0) {
    return [];
  }

  const result: DmMessageListItem<T>[] = [];
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

export function insertNewMessagesSeparator<T extends DmMessageWithSender>(
  items: DmMessageListItem<T>[],
  lastReadMessageId: string | null | undefined
): DmMessageListItem<T>[] {
  if (!lastReadMessageId) {
    return items;
  }

  let lastReadIndex = -1;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (
      "type" in item &&
      (item.type === "date-separator" || item.type === "new-messages-separator")
    ) {
      continue;
    }

    if (item.id === lastReadMessageId) {
      lastReadIndex = i;
      break;
    }
  }

  if (lastReadIndex === -1 || lastReadIndex === items.length - 1) {
    return items;
  }

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

  if (insertIndex >= items.length) {
    return items;
  }

  const result = [...items];
  result.splice(insertIndex, 0, {
    type: "new-messages-separator",
    id: "new-messages-separator",
  });

  return result;
}
