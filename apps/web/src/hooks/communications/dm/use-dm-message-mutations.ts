import { createOptimisticAction } from "@tanstack/react-db";
import {
  dmAttachmentsCollection,
  dmConversationReadsCollection,
  dmConversationsCollection,
  dmMessagesCollection,
  dmReactionsCollection,
  notificationsCollection,
} from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient } from "@/utils/orpc";

interface SendDmMessageInput {
  attachments?: Array<{
    fileName: string;
    fileSize: number;
    mimeType: string;
    originalName: string;
    type: "image" | "document" | "video" | "audio" | "archive";
    url: string;
  }>;
  content?: string;
  conversationId: string;
  id?: string;
  parentMessageId?: string;
  replyToMessageId?: string;
  type: "text" | "attachment" | "audio";
}

interface UpdateDmMessageInput {
  content: string;
  messageId: string;
}

export function useDmMessageMutations() {
  const { user } = useAuthedSession();

  const createMessage = createOptimisticAction({
    onMutate: ({ message }: { message: SendDmMessageInput }) => {
      const messageId = message.id ?? crypto.randomUUID().toString();
      const now = new Date();

      dmMessagesCollection.insert({
        id: messageId,
        conversationId: message.conversationId,
        content: message.content ?? null,
        type: message.type ?? "text",
        parentMessageId: message.parentMessageId ?? null,
        replyToMessageId: message.replyToMessageId ?? null,
        isEdited: false,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        editedAt: null,
        isPinned: false,
        pinnedAt: null,
        pinnedBy: null,
        senderId: user.id,
        threadCount: 0,
      });

      if (message.attachments) {
        for (const attachment of message.attachments) {
          dmAttachmentsCollection.insert({
            id: crypto.randomUUID().toString(),
            fileName: attachment.fileName,
            fileSize: attachment.fileSize,
            mimeType: attachment.mimeType,
            originalName: attachment.originalName,
            type: attachment.type,
            url: attachment.url,
            messageId,
            thumbnailUrl: null,
            uploadedBy: user.id,
            createdAt: now,
            updatedAt: now,
          });
        }
      }

      if (message.parentMessageId) {
        dmMessagesCollection.update(message.parentMessageId, (draft) => {
          draft.threadCount += 1;
        });
      }

      // Update conversation lastMessageAt optimistically
      dmConversationsCollection.update(message.conversationId, (draft) => {
        draft.lastMessageAt = now;
      });

      // Mark as read for sender
      const readKey = `${message.conversationId}-${user.id}`;
      const existingRead = dmConversationReadsCollection.get(readKey);

      if (existingRead) {
        dmConversationReadsCollection.update(readKey, (draft) => {
          draft.lastReadMessageId = messageId;
          draft.lastReadAt = now;
        });
      } else {
        dmConversationReadsCollection.insert({
          id: crypto.randomUUID().toString(),
          conversationId: message.conversationId,
          userId: user.id,
          lastReadMessageId: messageId,
          lastReadAt: now,
        });
      }
    },
    mutationFn: async ({ message }: { message: SendDmMessageInput }) => {
      const { txid } = await orpcClient.communication.dm.sendMessage(message);

      await dmMessagesCollection.utils.awaitTxId(txid);

      if (message.attachments?.length) {
        await dmAttachmentsCollection.utils.awaitTxId(txid);
      }
    },
  });

  const updateMessage = createOptimisticAction({
    onMutate: ({ message }: { message: UpdateDmMessageInput }) => {
      dmMessagesCollection.update(message.messageId, (draft) => {
        draft.content = message.content;
        draft.isEdited = true;
        draft.editedAt = new Date();
        draft.updatedAt = new Date();
      });
    },
    mutationFn: async ({ message }: { message: UpdateDmMessageInput }) => {
      const { txid } = await orpcClient.communication.dm.editMessage({
        messageId: message.messageId,
        content: message.content,
      });

      await dmMessagesCollection.utils.awaitTxId(txid);
    },
  });

  const deleteMessage = createOptimisticAction({
    onMutate: ({ messageId }: { messageId: string }) => {
      const message = dmMessagesCollection.get(messageId);

      if (message?.parentMessageId) {
        dmMessagesCollection.update(message.parentMessageId, (draft) => {
          draft.threadCount = Math.max(0, draft.threadCount - 1);
        });
      }

      const attachmentsToDelete: string[] = [];
      dmAttachmentsCollection.forEach((attachment) => {
        if (attachment.messageId === messageId) {
          attachmentsToDelete.push(attachment.id);
        }
      });

      const childMessagesToDelete: string[] = [];
      dmMessagesCollection.forEach((msg) => {
        if (msg.parentMessageId === messageId) {
          childMessagesToDelete.push(msg.id);
        }
      });

      dmMessagesCollection.update(messageId, (draft) => {
        draft.isDeleted = true;
        draft.deletedAt = new Date();
        draft.content = null;
      });

      if (childMessagesToDelete.length > 0) {
        for (const childId of childMessagesToDelete) {
          dmMessagesCollection.update(childId, (draft) => {
            draft.isDeleted = true;
            draft.deletedAt = new Date();
            draft.content = null;
          });
        }
      }

      if (attachmentsToDelete.length > 0) {
        dmAttachmentsCollection.delete(attachmentsToDelete);
      }
    },
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const { txid } = await orpcClient.communication.dm.deleteMessage({
        messageId,
      });

      await dmMessagesCollection.utils.awaitTxId(txid);
      await dmAttachmentsCollection.utils.awaitTxId(txid);
    },
  });

  const pinMessage = createOptimisticAction({
    onMutate: ({ messageId }: { messageId: string }) => {
      dmMessagesCollection.update(messageId, (draft) => {
        draft.isPinned = true;
        draft.pinnedAt = new Date();
        draft.pinnedBy = user.id;
      });
    },
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const { txid } = await orpcClient.communication.dm.togglePin({
        messageId,
      });

      await dmMessagesCollection.utils.awaitTxId(txid);
    },
  });

  const unPinMessage = createOptimisticAction({
    onMutate: ({ messageId }: { messageId: string }) => {
      dmMessagesCollection.update(messageId, (draft) => {
        draft.isPinned = false;
        draft.pinnedAt = null;
        draft.pinnedBy = null;
      });
    },
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const { txid } = await orpcClient.communication.dm.togglePin({
        messageId,
      });

      await dmMessagesCollection.utils.awaitTxId(txid);
    },
  });

  const addReaction = createOptimisticAction({
    onMutate: ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      const existingReaction = Array.from(dmReactionsCollection.values()).find(
        (r) =>
          r.messageId === messageId && r.userId === user.id && r.emoji === emoji
      );

      if (existingReaction) return;

      dmReactionsCollection.insert({
        id: crypto.randomUUID().toString(),
        messageId,
        userId: user.id,
        emoji,
        createdAt: new Date(),
      });
    },
    mutationFn: async ({
      messageId,
      emoji,
    }: {
      messageId: string;
      emoji: string;
    }) => {
      const { txid } = await orpcClient.communication.dm.toggleReaction({
        messageId,
        emoji,
      });

      await dmReactionsCollection.utils.awaitTxId(txid);
    },
  });

  const removeReaction = createOptimisticAction({
    onMutate: ({ reactionId }: { reactionId: string }) => {
      dmReactionsCollection.delete(reactionId);
    },
    mutationFn: async ({ reactionId }: { reactionId: string }) => {
      // The toggleReaction endpoint handles both add/remove
      // We need to find the reaction to get the emoji
      const reaction = dmReactionsCollection.get(reactionId);
      if (!reaction) return;

      const { txid } = await orpcClient.communication.dm.toggleReaction({
        messageId: reaction.messageId,
        emoji: reaction.emoji,
      });

      await dmReactionsCollection.utils.awaitTxId(txid);
    },
  });

  const markMessagesAsRead = createOptimisticAction({
    onMutate: ({
      conversationId,
      messageIds,
    }: {
      conversationId: string;
      messageIds: string[];
      userId: string;
    }) => {
      const now = new Date();

      // Mark notifications as read optimistically
      notificationsCollection.forEach((notification) => {
        if (
          notification.type === "dm_message" &&
          notification.entityId &&
          messageIds.includes(notification.entityId) &&
          notification.userId === user.id &&
          notification.status === "unread"
        ) {
          notificationsCollection.update(notification.id, (draft) => {
            draft.status = "read";
            draft.readAt = now;
          });
        }
      });

      // Get the latest message from the provided messageIds
      const messages = messageIds
        .map((id) => dmMessagesCollection.get(id))
        .filter(
          (msg): msg is NonNullable<typeof msg> =>
            msg !== null && msg !== undefined
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      if (messages.length === 0) return;

      const latestMessage = messages[0];
      if (!latestMessage) return;

      // Update conversation read watermark optimistically
      const readKey = `${conversationId}-${user.id}`;
      const existingRead = dmConversationReadsCollection.get(readKey);

      if (existingRead) {
        dmConversationReadsCollection.update(readKey, (draft) => {
          draft.lastReadMessageId = latestMessage.id;
          draft.lastReadAt = now;
        });
      } else {
        dmConversationReadsCollection.insert({
          id: crypto.randomUUID().toString(),
          conversationId,
          userId: user.id,
          lastReadMessageId: latestMessage.id,
          lastReadAt: now,
        });
      }

      // Insert individual message read records
      for (const message of messages) {
        const alreadyRead = Array.from(
          dmConversationReadsCollection.values()
        ).some(
          (read) =>
            read.conversationId === conversationId &&
            read.lastReadMessageId === message.id &&
            read.userId === user.id
        );

        if (!alreadyRead) {
          const msgReadKey = `${conversationId}-${user.id}`;
          const existingMsgRead = dmConversationReadsCollection.get(msgReadKey);

          if (existingMsgRead) {
            dmConversationReadsCollection.update(msgReadKey, (draft) => {
              draft.lastReadMessageId = message.id;
              draft.lastReadAt = now;
            });
          } else {
            dmConversationReadsCollection.insert({
              id: crypto.randomUUID().toString(),
              conversationId,
              userId: user.id,
              lastReadMessageId: message.id,
              lastReadAt: now,
            });
          }
        }
      }
    },
    mutationFn: async ({
      conversationId,
      messageIds,
    }: {
      conversationId: string;
      messageIds: string[];
      userId: string;
    }) => {
      const messageId = messageIds.at(-1);
      if (!messageId) return;

      const { txid } = await orpcClient.communication.dm.markRead({
        conversationId,
        messageId,
      });

      await dmConversationReadsCollection.utils.awaitTxId(txid);
      await notificationsCollection.utils.awaitTxId(txid);
    },
  });

  return {
    createMessage,
    updateMessage,
    deleteMessage,
    pinMessage,
    unPinMessage,
    addReaction,
    removeReaction,
    markMessagesAsRead,
  };
}
