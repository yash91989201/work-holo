import type {
  MessageSearchDocument,
  OpenSearchClient,
  SearchIndexQueueMessage,
} from "@work-holo/infrastructure";
import { deleteMessage, indexMessage, stripHtmlToPlainText } from "./indexer";

type Client = ReturnType<(typeof OpenSearchClient)["getClient"]>;

function toIsoDateString(value: string | undefined): string {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function buildSearchDocument(
  message: SearchIndexQueueMessage
): MessageSearchDocument {
  // Validate required fields
  if (
    !(
      message.messageId &&
      message.organizationId &&
      message.scopeType &&
      message.scopeId
    )
  ) {
    throw new Error(
      `[buildSearchDocument] Missing required fields: ${JSON.stringify({
        messageId: message.messageId,
        organizationId: message.organizationId,
        scopeType: message.scopeType,
        scopeId: message.scopeId,
      })}`
    );
  }

  const contentHtml =
    typeof message.contentHtml === "string" ? message.contentHtml : "";

  return {
    messageId: message.messageId,
    organizationId: message.organizationId,
    scopeType: message.scopeType,
    scopeId: message.scopeId,
    senderId: message.senderId ?? "",
    senderName: message.senderName ?? "",
    contentPlain: stripHtmlToPlainText(contentHtml),
    messageType: message.messageType ?? "text",
    parentMessageId: message.parentMessageId ?? undefined,
    isPinned: message.isPinned ?? false,
    hasAttachments: message.hasAttachments ?? false,
    mentionedUserIds: message.mentionedUserIds ?? [],
    createdAt: toIsoDateString(message.createdAt),
    updatedAt: toIsoDateString(message.updatedAt),
  };
}

export async function handleSearchIndexMessage(
  client: Client,
  message: SearchIndexQueueMessage
): Promise<void> {
  if (message.action === "delete") {
    await deleteMessage(client, message.messageId);
    return;
  }

  const document = buildSearchDocument(message);
  await indexMessage(client, document);
}
