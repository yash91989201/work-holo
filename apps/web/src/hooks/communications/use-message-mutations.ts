import { createOptimisticAction } from "@tanstack/react-db";
import type {
  CreateMessageInputType,
  MarkMentionSeenInputType,
  UpdateMessageInputType,
} from "@work-holo/api/lib/types";
import {
  attachmentsCollection,
  messageMentionsCollection,
  messageReactionsCollection,
  messagesCollection,
} from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient } from "@/utils/orpc";

export function useMessageMutations() {
  const { user } = useAuthedSession();

  const createMessage = createOptimisticAction({
    onMutate: ({ message }: { message: CreateMessageInputType }) => {
      const messageId = crypto.randomUUID().toString();

      messagesCollection.insert({
        id: messageId,
        channelId: message.channelId,
        content: message.content ?? null,
        type: message.type,
        parentMessageId: message.parentMessageId ?? null,
        isEdited: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
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
            createdAt: new Date(),
            updatedAt: new Date(),
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
            createdAt: new Date(),
          });
        }
      }

      if (message.parentMessageId) {
        messagesCollection.update(message.parentMessageId, (draft) => {
          draft.threadCount += 1;
        });
      }
    },
    mutationFn: async ({ message }: { message: CreateMessageInputType }) => {
      const { txid } = await orpcClient.communication.message.create(message);

      await messagesCollection.utils.awaitTxId(txid);
      await attachmentsCollection.utils.awaitTxId(txid);
      await messageMentionsCollection.utils.awaitTxId(txid);
    },
  });

  const updateMessage = createOptimisticAction({
    onMutate: ({ message }: { message: UpdateMessageInputType }) => {
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

  return {
    createMessage,
    updateMessage,
    deleteMessage,
    pinMessage,
    unPinMessage,
    addReaction,
    removeReaction,
    markMentionSeen,
  };
}
