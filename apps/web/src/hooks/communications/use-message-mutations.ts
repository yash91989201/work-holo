import { createOptimisticAction } from "@tanstack/react-db";
import type {
  CreateMessageInputType,
  MarkMentionSeenInputType,
  UpdateMessageInputType,
} from "@work-holo/api/lib/types";
import {
  attachmentsCollection,
  channelMembersCollection,
  channelReadCollection,
  messageMentionsCollection,
  messageReactionsCollection,
  messageReadCollection,
  messagesCollection,
  notificationsCollection,
} from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient } from "@/utils/orpc";

export function useMessageMutations() {
  const { user } = useAuthedSession();

  const createMessage = createOptimisticAction({
    onMutate: ({ message }: { message: CreateMessageInputType }) => {
      const messageId = message.id ?? crypto.randomUUID().toString();
      const now = new Date();

      messagesCollection.insert({
        id: messageId,
        channelId: message.channelId,
        content: message.content ?? null,
        type: message.type,
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
        receiverId: null,
        senderId: user.id,
        threadCount: 0,
      });

      if (message.attachments) {
        for (const attachment of message.attachments) {
          attachmentsCollection.insert({
            id: crypto.randomUUID().toString(),
            fileName: attachment.fileName,
            fileSize: attachment.fileSize,
            mimeType: attachment.mimeType,
            originalName: attachment.originalName,
            type: attachment.type,
            url: attachment.url,
            isPublic: true,
            messageId,
            thumbnailUrl: null,
            uploadedBy: user.id,
            createdAt: now,
            updatedAt: now,
          });
        }
      }

      if (message.mentions?.length) {
        for (const mentionedUserId of message.mentions) {
          messageMentionsCollection.insert({
            id: crypto.randomUUID().toString(),
            messageId,
            mentionedById: user.id,
            mentionedUserId,
            isSeen: false,
            createdAt: now,
          });
        }
      }

      if (message.parentMessageId) {
        messagesCollection.update(message.parentMessageId, (draft) => {
          draft.threadCount += 1;
        });
      }

      // Mark message as read for sender
      // Count members to determine tracking strategy
      const memberCount = Array.from(channelMembersCollection.values()).filter(
        (member) => member.channelId === message.channelId
      ).length;

      // Only insert messageRead for small channels (<=25 members)
      if (memberCount <= 25) {
        messageReadCollection.insert({
          id: crypto.randomUUID(),
          messageId,
          userId: user.id,
          readAt: now,
        });
      }

      const existingChannelRead = Array.from(
        channelReadCollection.values()
      ).find(
        (read) =>
          read.channelId === message.channelId && read.userId === user.id
      );

      if (existingChannelRead) {
        const compositeKey = `${message.channelId}-${user.id}`;
        channelReadCollection.update(compositeKey, (draft) => {
          draft.lastReadMessageId = messageId;
          draft.lastReadAt = now;
        });
      } else {
        channelReadCollection.insert({
          channelId: message.channelId,
          userId: user.id,
          lastReadMessageId: messageId,
          lastReadAt: now,
        });
      }
    },
    mutationFn: async ({ message }: { message: CreateMessageInputType }) => {
      const { txid } = await orpcClient.communication.message.create(message);

      await messagesCollection.utils.awaitTxId(txid);

      if (message.attachments?.length) {
        await attachmentsCollection.utils.awaitTxId(txid);
      }
    },
  });

  const updateMessage = createOptimisticAction({
    onMutate: ({ message }: { message: UpdateMessageInputType }) => {
      messagesCollection.update(message.messageId, (draft) => {
        if (message.content !== undefined) {
          draft.content = message.content;
        }
        draft.isEdited = true;
        draft.editedAt = new Date();
      });

      if (message.mentions !== undefined) {
        const mentionsToRemove: string[] = [];
        messageMentionsCollection.forEach((mention) => {
          if (mention.messageId === message.messageId) {
            mentionsToRemove.push(mention.id);
          }
        });

        if (mentionsToRemove.length) {
          messageMentionsCollection.delete(mentionsToRemove);
        }

        if (message.mentions?.length) {
          for (const mentionedUserId of message.mentions) {
            messageMentionsCollection.insert({
              id: crypto.randomUUID().toString(),
              messageId: message.messageId,
              mentionedById: user.id,
              mentionedUserId,
              isSeen: false,
              createdAt: new Date(),
            });
          }
        }
      }
    },
    mutationFn: async ({ message }: { message: UpdateMessageInputType }) => {
      const { txid } = await orpcClient.communication.message.update(message);

      await messagesCollection.utils.awaitTxId(txid);
      await attachmentsCollection.utils.awaitTxId(txid);
      await messageMentionsCollection.utils.awaitTxId(txid);
    },
  });

  const deleteMessage = createOptimisticAction({
    onMutate: ({ messageId }: { messageId: string }) => {
      const message = messagesCollection.get(messageId);

      if (message?.parentMessageId) {
        messagesCollection.update(message.parentMessageId, (draft) => {
          draft.threadCount = Math.max(0, draft.threadCount - 1);
        });
      }

      const attachmentsToDelete: string[] = [];
      attachmentsCollection.forEach((attachment) => {
        if (attachment.messageId === messageId) {
          attachmentsToDelete.push(attachment.id);
        }
      });

      const childMessagesToDelete: string[] = [];
      messagesCollection.forEach((msg) => {
        if (msg.parentMessageId === messageId) {
          childMessagesToDelete.push(msg.id);
        }
      });

      const mentionIdsToDelete: string[] = [];
      messageMentionsCollection.forEach((mention) => {
        if (
          mention.messageId === messageId ||
          childMessagesToDelete.includes(mention.messageId)
        ) {
          mentionIdsToDelete.push(mention.id);
        }
      });

      messagesCollection.delete(messageId);

      if (childMessagesToDelete.length > 0) {
        messagesCollection.delete(childMessagesToDelete);
      }

      if (attachmentsToDelete.length > 0) {
        attachmentsCollection.delete(attachmentsToDelete);
      }

      if (mentionIdsToDelete.length > 0) {
        messageMentionsCollection.delete(mentionIdsToDelete);
      }
    },
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const { txid } = await orpcClient.communication.message.delete({
        messageId,
      });

      await messagesCollection.utils.awaitTxId(txid);
      await attachmentsCollection.utils.awaitTxId(txid);
    },
  });

  const pinMessage = createOptimisticAction({
    onMutate: ({ messageId }: { messageId: string }) => {
      messagesCollection.update(messageId, (draft) => {
        draft.isPinned = true;
        draft.pinnedAt = new Date();
        draft.pinnedBy = user.id;
      });
    },
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const { txid } = await orpcClient.communication.message.pin({
        messageId,
      });

      await messagesCollection.utils.awaitTxId(txid);
    },
  });

  const unPinMessage = createOptimisticAction({
    onMutate: ({ messageId }: { messageId: string }) => {
      messagesCollection.update(messageId, (draft) => {
        draft.isPinned = false;
        draft.pinnedAt = null;
        draft.pinnedBy = null;
      });
    },
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const { txid } = await orpcClient.communication.message.unPin({
        messageId,
      });

      await messagesCollection.utils.awaitTxId(txid);
    },
  });

  const addReaction = createOptimisticAction({
    onMutate: ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      const existingReaction = Array.from(
        messageReactionsCollection.values()
      ).find(
        (r) =>
          r.messageId === messageId &&
          r.userId === user.id &&
          r.reaction === emoji
      );

      if (existingReaction) return;

      messageReactionsCollection.insert({
        id: crypto.randomUUID().toString(),
        messageId,
        userId: user.id,
        reaction: emoji,
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
      const { txid } = await orpcClient.communication.message.addReaction({
        messageId,
        emoji,
      });

      await messageReactionsCollection.utils.awaitTxId(txid);
    },
  });

  const removeReaction = createOptimisticAction({
    onMutate: ({ reactionId }: { reactionId: string }) => {
      messageReactionsCollection.delete(reactionId);
    },
    mutationFn: async ({ reactionId }: { reactionId: string }) => {
      const { txid } = await orpcClient.communication.message.removeReaction({
        reactionId,
      });

      await messageReactionsCollection.utils.awaitTxId(txid);
    },
  });

  const markMentionSeen = createOptimisticAction({
    onMutate: ({ mentionId }: MarkMentionSeenInputType) => {
      messageMentionsCollection.update(mentionId, (draft) => {
        draft.isSeen = true;
      });
    },
    mutationFn: async ({ mentionId }: MarkMentionSeenInputType) => {
      const { txid } = await orpcClient.communication.message.markMentionSeen({
        mentionId,
      });

      await messageMentionsCollection.utils.awaitTxId(txid);
    },
  });

  const markMessagesAsRead = createOptimisticAction({
    onMutate: ({
      channelId,
      messageIds,
      userId,
    }: {
      channelId: string;
      messageIds: string[];
      userId: string;
    }) => {
      const now = new Date();

      // Mark mentions as seen optimistically
      messageMentionsCollection.forEach((mention) => {
        if (
          messageIds.includes(mention.messageId) &&
          mention.mentionedUserId === userId &&
          !mention.isSeen
        ) {
          messageMentionsCollection.update(mention.id, (draft) => {
            draft.isSeen = true;
          });
        }
      });

      // Mark mention notifications as read optimistically
      notificationsCollection.forEach((notification) => {
        if (
          notification.type === "channel_mention" &&
          notification.entityId &&
          messageIds.includes(notification.entityId) &&
          notification.userId === userId &&
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
        .map((id) => messagesCollection.get(id))
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

      // Update channelRead watermark optimistically
      const existingChannelRead = Array.from(
        channelReadCollection.values()
      ).find((read) => read.channelId === channelId && read.userId === userId);

      if (existingChannelRead) {
        // Only update if the new message is newer
        const currentMessage = existingChannelRead.lastReadMessageId
          ? messagesCollection.get(existingChannelRead.lastReadMessageId)
          : null;

        const shouldUpdate =
          !currentMessage ||
          new Date(latestMessage.createdAt) >
            new Date(currentMessage.createdAt);

        if (shouldUpdate) {
          const compositeKey = `${channelId}-${userId}`;
          channelReadCollection.update(compositeKey, (draft) => {
            draft.lastReadMessageId = latestMessage.id;
            draft.lastReadAt = new Date();
          });
        }
      } else {
        channelReadCollection.insert({
          channelId,
          userId,
          lastReadMessageId: latestMessage.id,
          lastReadAt: new Date(),
        });
      }

      // For small channels, also insert messageRead records
      for (const message of messages) {
        const alreadyRead = Array.from(messageReadCollection.values()).some(
          (read) => read.messageId === message.id && read.userId === userId
        );

        if (!alreadyRead) {
          messageReadCollection.insert({
            id: crypto.randomUUID().toString(),
            messageId: message.id,
            userId,
            readAt: now,
          });
        }
      }
    },
    mutationFn: async ({
      channelId,
      messageIds,
    }: {
      channelId: string;
      messageIds: string[];
      userId: string;
    }) => {
      const { txid } = await orpcClient.communication.message.markAsRead({
        channelId,
        messageIds,
      });

      // Wait for Electric Shape sync
      await messageMentionsCollection.utils.awaitTxId(txid);
      await notificationsCollection.utils.awaitTxId(txid);
      await channelReadCollection.utils.awaitTxId(txid);
      await messageReadCollection.utils.awaitTxId(txid);
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
    markMentionSeen,
    markMessagesAsRead,
  };
}
