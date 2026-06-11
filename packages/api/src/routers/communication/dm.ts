import { ORPCError } from "@orpc/server";
import type { db as _dbType } from "@work-holo/db";
import {
  dmAttachmentTable,
  dmConversationMuteTable,
  dmConversationReadTable,
  dmConversationTable,
  dmMessageReactionTable,
  dmMessageReadTable,
  dmMessageTable,
  member as memberTable,
  user as userTable,
} from "@work-holo/db/schema/index";
import {
  OpenSearchClient,
  PusherClient,
  Queue,
  type SearchIndexQueueMessage,
} from "@work-holo/infrastructure";
import { and, count, desc, eq, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";
import { dmProcedure } from "../../index";
import { generateTxId } from "../../lib/electric-proxy";
import {
  CreateDmConversationInput,
  DeleteDmMessageInput,
  DmAttachmentInput,
  EditDmMessageInput,
  GetDmConversationInput,
  GetDmConversationsInput,
  GetDmMessagesInput,
  MarkDmReadInput,
  MuteDmConversationInput,
  SearchDmMessagesInput,
  SearchDmMessagesOutput,
  SendDmMessageInput,
  ToggleDmPinInput,
  ToggleDmReactionInput,
  UnmuteDmConversationInput,
} from "../../lib/schemas/dm";

async function verifyParticipant(
  db: typeof _dbType,
  conversationId: string,
  userId: string
) {
  const conversation = await db.query.dmConversationTable.findFirst({
    where: eq(dmConversationTable.id, conversationId),
  });

  if (!conversation) {
    throw new ORPCError("NOT_FOUND", {
      message: "Conversation not found.",
    });
  }

  const isParticipant =
    conversation.participantOneId === userId ||
    conversation.participantTwoId === userId;

  if (!isParticipant) {
    throw new ORPCError("FORBIDDEN", {
      message: "You are not a participant of this conversation.",
    });
  }

  return conversation;
}

const DM_EVENTS = {
  DELETE_MESSAGE: "delete-message",
  EDIT_MESSAGE: "edit-message",
  NEW_MESSAGE: "new-message",
  PIN_TOGGLE: "pin-toggle",
  REACTION: "reaction",
  READ_RECEIPT: "read-receipt",
} as const;

const emitDmEvent = async (
  conversationId: string,
  eventName: (typeof DM_EVENTS)[keyof typeof DM_EVENTS],
  payload: Record<string, unknown>
) => {
  try {
    await PusherClient.getClient().trigger(
      `presence-dm-${conversationId}`,
      eventName,
      payload
    );
  } catch (error) {
    console.error("Failed to emit DM event:", error);
  }
};

export const dmRouter = {
  createOrGetConversation: dmProcedure
    .input(CreateDmConversationInput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const callerId = session.user.id;

      if (callerId === input.participantId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Cannot create a DM conversation with yourself.",
        });
      }

      const participantMembership = await db
        .select({ id: memberTable.id })
        .from(memberTable)
        .where(
          and(
            eq(memberTable.organizationId, orgId),
            eq(memberTable.userId, input.participantId)
          )
        )
        .limit(1);

      if (participantMembership.length === 0) {
        throw new ORPCError("FORBIDDEN", {
          message: "Target user is not a member of this organization.",
        });
      }

      const [participantOneId, participantTwoId] =
        callerId < input.participantId
          ? [callerId, input.participantId]
          : [input.participantId, callerId];

      const existing = await db.query.dmConversationTable.findFirst({
        where: and(
          eq(dmConversationTable.organizationId, orgId),
          eq(dmConversationTable.participantOneId, participantOneId),
          eq(dmConversationTable.participantTwoId, participantTwoId)
        ),
        with: {
          participantOne: true,
          participantTwo: true,
        },
      });

      if (existing) {
        return existing;
      }

      const [conversation] = await db
        .insert(dmConversationTable)
        .values({
          organizationId: orgId,
          participantOneId,
          participantTwoId,
        })
        .returning();

      if (!conversation) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create DM conversation.",
        });
      }

      const result = await db.query.dmConversationTable.findFirst({
        where: eq(dmConversationTable.id, conversation.id),
        with: {
          participantOne: true,
          participantTwo: true,
        },
      });

      return result;
    }),

  getConversations: dmProcedure
    .input(GetDmConversationsInput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const callerId = session.user.id;
      const { limit, cursor } = input;
      const conversationActivityAt = sql<Date>`coalesce(${dmConversationTable.lastMessageAt}, ${dmConversationTable.createdAt})`;

      const conditions = [
        eq(dmConversationTable.organizationId, orgId),
        or(
          eq(dmConversationTable.participantOneId, callerId),
          eq(dmConversationTable.participantTwoId, callerId)
        ),
      ];

      if (cursor) {
        const cursorConversation = await db.query.dmConversationTable.findFirst(
          {
            where: eq(dmConversationTable.id, cursor),
            columns: { id: true, createdAt: true, lastMessageAt: true },
          }
        );

        if (cursorConversation) {
          const cursorActivityValue =
            cursorConversation.lastMessageAt ?? cursorConversation.createdAt;
          conditions.push(
            sql`(
              ${conversationActivityAt} < ${cursorActivityValue}
              OR (
                ${conversationActivityAt} = ${cursorActivityValue}
                AND ${dmConversationTable.id} < ${cursorConversation.id}
              )
            )`
          );
        }
      }

      const conversations = await db.query.dmConversationTable.findMany({
        where: and(...conditions),
        orderBy: [desc(conversationActivityAt), desc(dmConversationTable.id)],
        limit: limit + 1,
        with: {
          participantOne: true,
          participantTwo: true,
        },
      });

      const hasMore = conversations.length > limit;
      const items = hasMore ? conversations.slice(0, limit) : conversations;
      const nextCursor = hasMore ? items.at(-1)?.id : undefined;

      const enriched = await Promise.all(
        items.map(async (conversation) => {
          const lastMessage = await db.query.dmMessageTable.findFirst({
            where: and(
              eq(dmMessageTable.conversationId, conversation.id),
              eq(dmMessageTable.isDeleted, false)
            ),
            orderBy: [desc(dmMessageTable.createdAt)],
            with: {
              sender: true,
            },
          });

          const readRecord = await db.query.dmConversationReadTable.findFirst({
            where: and(
              eq(dmConversationReadTable.conversationId, conversation.id),
              eq(dmConversationReadTable.userId, callerId)
            ),
          });

          let unreadCount = 0;

          if (readRecord?.lastReadAt) {
            const unreadResult = await db
              .select({ count: count() })
              .from(dmMessageTable)
              .where(
                and(
                  eq(dmMessageTable.conversationId, conversation.id),
                  eq(dmMessageTable.isDeleted, false),
                  sql`${dmMessageTable.createdAt} > ${readRecord.lastReadAt}`
                )
              );
            unreadCount = Number(unreadResult[0]?.count ?? 0);
          } else {
            const totalResult = await db
              .select({ count: count() })
              .from(dmMessageTable)
              .where(
                and(
                  eq(dmMessageTable.conversationId, conversation.id),
                  eq(dmMessageTable.isDeleted, false)
                )
              );
            unreadCount = Number(totalResult[0]?.count ?? 0);
          }

          const muteRecord = await db.query.dmConversationMuteTable.findFirst({
            where: and(
              eq(dmConversationMuteTable.conversationId, conversation.id),
              eq(dmConversationMuteTable.userId, callerId)
            ),
          });

          const otherParticipant =
            conversation.participantOneId === callerId
              ? conversation.participantTwo
              : conversation.participantOne;

          return {
            ...conversation,
            lastMessage: lastMessage ?? null,
            unreadCount,
            isMuted: !!muteRecord,
            otherParticipant,
          };
        })
      );

      return {
        conversations: enriched,
        nextCursor,
      };
    }),

  getConversation: dmProcedure
    .input(GetDmConversationInput)
    .handler(async ({ input, context: { db, session } }) => {
      const callerId = session.user.id;

      await verifyParticipant(db, input.conversationId, callerId);

      const conversation = await db.query.dmConversationTable.findFirst({
        where: eq(dmConversationTable.id, input.conversationId),
        with: {
          participantOne: true,
          participantTwo: true,
        },
      });

      if (!conversation) {
        throw new ORPCError("NOT_FOUND", {
          message: "Conversation not found.",
        });
      }

      return conversation;
    }),

  muteConversation: dmProcedure
    .input(MuteDmConversationInput)
    .handler(async ({ input, context: { db, session } }) => {
      const callerId = session.user.id;

      await verifyParticipant(db, input.conversationId, callerId);

      await db
        .insert(dmConversationMuteTable)
        .values({
          conversationId: input.conversationId,
          userId: callerId,
        })
        .onConflictDoNothing();

      return { success: true, message: "Conversation muted." };
    }),

  unmuteConversation: dmProcedure
    .input(UnmuteDmConversationInput)
    .handler(async ({ input, context: { db, session } }) => {
      const callerId = session.user.id;

      await verifyParticipant(db, input.conversationId, callerId);

      await db
        .delete(dmConversationMuteTable)
        .where(
          and(
            eq(dmConversationMuteTable.conversationId, input.conversationId),
            eq(dmConversationMuteTable.userId, callerId)
          )
        );

      return { success: true, message: "Conversation unmuted." };
    }),

  sendMessage: dmProcedure
    .input(SendDmMessageInput)
    .handler(async ({ input, context }) => {
      const { db, orgId, session } = context;
      const userId = session.user.id;
      const senderName = session.user.name ?? "Someone";

      const result = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const conversation = await tx.query.dmConversationTable.findFirst({
          where: and(
            eq(dmConversationTable.id, input.conversationId),
            eq(dmConversationTable.organizationId, orgId),
            or(
              eq(dmConversationTable.participantOneId, userId),
              eq(dmConversationTable.participantTwoId, userId)
            )
          ),
        });

        if (!conversation) {
          throw new ORPCError("FORBIDDEN", {
            message: "You are not a participant of this conversation.",
          });
        }

        const normalizedContent = input.content?.trim() || null;

        const [message] = await tx
          .insert(dmMessageTable)
          .values({
            ...(input.id ? { id: input.id } : {}),
            conversationId: input.conversationId,
            senderId: userId,
            content: normalizedContent,
            type: input.type,
            parentMessageId: input.parentMessageId,
            replyToMessageId: input.replyToMessageId,
          })
          .returning();

        if (!message) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message: "Failed to send message.",
          });
        }

        if (input.parentMessageId) {
          await tx
            .update(dmMessageTable)
            .set({ threadCount: sql`${dmMessageTable.threadCount} + 1` })
            .where(
              and(
                eq(dmMessageTable.id, input.parentMessageId),
                eq(dmMessageTable.conversationId, input.conversationId)
              )
            );
        }

        if (input.attachments && input.attachments.length > 0) {
          await tx.insert(dmAttachmentTable).values(
            input.attachments.map((attachment) => ({
              messageId: message.id,
              fileName: attachment.fileName,
              originalName: attachment.originalName,
              fileSize: attachment.fileSize,
              mimeType: attachment.mimeType,
              type: attachment.type,
              url: attachment.url,
              uploadedBy: userId,
            }))
          );
        }

        await tx
          .update(dmConversationTable)
          .set({
            lastMessageAt: message.createdAt,
            messageCount: sql`${dmConversationTable.messageCount} + 1`,
          })
          .where(eq(dmConversationTable.id, input.conversationId));

        const recipientId =
          conversation.participantOneId === userId
            ? conversation.participantTwoId
            : conversation.participantOneId;

        const mute = await tx.query.dmConversationMuteTable.findFirst({
          where: and(
            eq(dmConversationMuteTable.conversationId, input.conversationId),
            eq(dmConversationMuteTable.userId, recipientId)
          ),
        });

        const notificationMessage = (
          normalizedContent ??
          input.attachments?.[0]?.originalName ??
          "Sent an attachment"
        ).slice(0, 200);

        return {
          isMuted: Boolean(mute),
          message,
          notificationMessage,
          parentMessageId: input.parentMessageId,
          replyToMessageId: input.replyToMessageId,
          recipientId,
          txid,
        };
      });

      // Publish to search indexing queue
      try {
        const searchPayload: SearchIndexQueueMessage = {
          action: "upsert",
          messageId: result.message.id,
          organizationId: orgId,
          scopeType: "dm",
          scopeId: input.conversationId,
          contentHtml: result.message.content || undefined,
          senderId: userId,
          senderName: session.user.name || undefined,
          messageType: result.message.type || undefined,
          createdAt: result.message.createdAt.toISOString(),
          updatedAt: result.message.updatedAt?.toISOString() || undefined,
          parentMessageId: result.message.parentMessageId || undefined,
          hasAttachments:
            input.attachments && input.attachments.length > 0
              ? true
              : undefined,
        };
        Queue.publish("SEARCH_INDEXING", searchPayload);
      } catch (error) {
        console.error("Failed to publish to search indexing queue:", error);
      }

      await emitDmEvent(input.conversationId, DM_EVENTS.NEW_MESSAGE, {
        conversationId: input.conversationId,
        message: result.message,
      });

      if (!result.isMuted && context.notification) {
        Promise.resolve().then(async () => {
          try {
            if (result.parentMessageId) {
              await context.notification.emit({
                actorId: userId,
                entityId: result.message.id,
                entityType: "message",
                metadata: {
                  conversationId: input.conversationId,
                  messagePreview: result.notificationMessage,
                  replySenderId: userId,
                  replySenderName: senderName,
                  threadId: result.parentMessageId,
                },
                orgId,
                targetUserId: result.recipientId,
                type: "dm_reply",
              });
            }

            if (result.replyToMessageId) {
              const originalMessage =
                await context.db.query.dmMessageTable.findFirst({
                  where: and(
                    eq(dmMessageTable.id, result.replyToMessageId),
                    eq(dmMessageTable.conversationId, input.conversationId)
                  ),
                  columns: { senderId: true },
                });

              if (originalMessage && originalMessage.senderId !== userId) {
                await context.notification.emit({
                  actorId: userId,
                  entityId: result.message.id,
                  entityType: "message",
                  metadata: {
                    conversationId: input.conversationId,
                    messagePreview: result.notificationMessage,
                    replySenderId: userId,
                    replySenderName: senderName,
                    originalMessageId: result.replyToMessageId,
                  },
                  orgId,
                  targetUserId: originalMessage.senderId,
                  type: "dm_direct_reply",
                });
              }
            }

            if (!(result.parentMessageId || result.replyToMessageId)) {
              await context.notification.emit({
                actorId: userId,
                entityId: result.message.id,
                entityType: "message",
                metadata: {
                  conversationId: input.conversationId,
                  messagePreview: result.notificationMessage,
                  senderId: userId,
                  senderName,
                },
                orgId,
                targetUserId: result.recipientId,
                type: "dm_message",
              });
            }
          } catch (error) {
            console.error("Error emitting DM message notification:", error);
          }
        });
      }

      return { txid: result.txid, message: result.message };
    }),

  getMessages: dmProcedure
    .input(GetDmMessagesInput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const userId = session.user.id;
      const conversation = await db.query.dmConversationTable.findFirst({
        where: and(
          eq(dmConversationTable.id, input.conversationId),
          eq(dmConversationTable.organizationId, orgId),
          or(
            eq(dmConversationTable.participantOneId, userId),
            eq(dmConversationTable.participantTwoId, userId)
          )
        ),
      });

      if (!conversation) {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not a participant of this conversation.",
        });
      }

      const whereClauses = [
        eq(dmMessageTable.conversationId, input.conversationId),
        eq(dmMessageTable.isDeleted, false),
      ];

      if (input.cursor) {
        const cursor = await db.query.dmMessageTable.findFirst({
          where: and(
            eq(dmMessageTable.id, input.cursor),
            eq(dmMessageTable.conversationId, input.conversationId)
          ),
          columns: { createdAt: true, id: true },
        });

        if (cursor?.createdAt) {
          whereClauses.push(
            sql`(
              ${dmMessageTable.createdAt} < ${cursor.createdAt}
              OR (
                ${dmMessageTable.createdAt} = ${cursor.createdAt}
                AND ${dmMessageTable.id} < ${cursor.id}
              )
            )`
          );
        }
      }

      if (input.parentMessageId) {
        whereClauses.push(
          eq(dmMessageTable.parentMessageId, input.parentMessageId)
        );
      }

      const rows = await db.query.dmMessageTable.findMany({
        where: and(...whereClauses),
        orderBy: [desc(dmMessageTable.createdAt), desc(dmMessageTable.id)],
        limit: input.limit + 1,
        with: {
          sender: true,
          attachments: true,
          reactions: {
            columns: {
              emoji: true,
              userId: true,
            },
          },
        },
      });

      const hasMore = rows.length > input.limit;
      const messages = rows.slice(0, input.limit).map((message) => {
        const grouped = new Map<
          string,
          { emoji: string; count: number; reacted: boolean }
        >();

        for (const reaction of message.reactions) {
          const existing = grouped.get(reaction.emoji);
          if (!existing) {
            grouped.set(reaction.emoji, {
              emoji: reaction.emoji,
              count: 1,
              reacted: reaction.userId === userId,
            });
            continue;
          }

          existing.count += 1;
          if (reaction.userId === userId) {
            existing.reacted = true;
          }
        }

        return {
          ...message,
          reactions: [...grouped.values()],
        };
      });

      return {
        messages,
        nextCursor: hasMore ? (messages.at(-1)?.id ?? undefined) : undefined,
      };
    }),

  editMessage: dmProcedure
    .input(EditDmMessageInput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const userId = session.user.id;

      const result = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const message = await tx.query.dmMessageTable.findFirst({
          where: eq(dmMessageTable.id, input.messageId),
        });

        if (!message) {
          throw new ORPCError("NOT_FOUND", {
            message: "Message not found.",
          });
        }

        const conversation = await tx.query.dmConversationTable.findFirst({
          where: and(
            eq(dmConversationTable.id, message.conversationId),
            eq(dmConversationTable.organizationId, orgId),
            or(
              eq(dmConversationTable.participantOneId, userId),
              eq(dmConversationTable.participantTwoId, userId)
            )
          ),
        });

        if (!conversation || message.senderId !== userId) {
          throw new ORPCError("FORBIDDEN", {
            message: "Only the sender can edit this message.",
          });
        }

        const [updated] = await tx
          .update(dmMessageTable)
          .set({
            content: input.content,
            isEdited: true,
            editedAt: new Date(),
          })
          .where(eq(dmMessageTable.id, input.messageId))
          .returning();

        if (!updated) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Failed to edit message.",
          });
        }

        return { txid, message: updated };
      });

      // Publish to search indexing queue
      try {
        const searchPayload: SearchIndexQueueMessage = {
          action: "upsert",
          messageId: result.message.id,
          organizationId: orgId,
          scopeType: "dm",
          scopeId: result.message.conversationId,
          contentHtml: result.message.content || undefined,
          senderId: result.message.senderId || undefined,
          updatedAt: result.message.updatedAt?.toISOString() || undefined,
          parentMessageId: result.message.parentMessageId || undefined,
        };
        Queue.publish("SEARCH_INDEXING", searchPayload);
      } catch (error) {
        console.error("Failed to publish to search indexing queue:", error);
      }

      await emitDmEvent(result.message.conversationId, DM_EVENTS.EDIT_MESSAGE, {
        conversationId: result.message.conversationId,
        message: result.message,
      });

      return result;
    }),

  deleteMessage: dmProcedure
    .input(DeleteDmMessageInput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const userId = session.user.id;

      const result = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const message = await tx.query.dmMessageTable.findFirst({
          where: eq(dmMessageTable.id, input.messageId),
        });

        if (!message) {
          throw new ORPCError("NOT_FOUND", {
            message: "Message not found.",
          });
        }

        const conversation = await tx.query.dmConversationTable.findFirst({
          where: and(
            eq(dmConversationTable.id, message.conversationId),
            eq(dmConversationTable.organizationId, orgId),
            or(
              eq(dmConversationTable.participantOneId, userId),
              eq(dmConversationTable.participantTwoId, userId)
            )
          ),
        });

        if (!conversation || message.senderId !== userId) {
          throw new ORPCError("FORBIDDEN", {
            message: "Only the sender can delete this message.",
          });
        }

        const [deleted] = await tx
          .update(dmMessageTable)
          .set({
            isDeleted: true,
            deletedAt: new Date(),
          })
          .where(eq(dmMessageTable.id, input.messageId))
          .returning();

        if (!deleted) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Failed to delete message.",
          });
        }

        return { txid, message: deleted };
      });

      // Publish to search indexing queue for deleted message
      try {
        const deletePayload: SearchIndexQueueMessage = {
          action: "delete",
          messageId: input.messageId,
          organizationId: orgId,
          scopeType: "dm",
        };
        Queue.publish("SEARCH_INDEXING", deletePayload);
      } catch (error) {
        console.error("Failed to publish to search indexing queue:", error);
      }

      await emitDmEvent(
        result.message.conversationId,
        DM_EVENTS.DELETE_MESSAGE,
        {
          conversationId: result.message.conversationId,
          messageId: result.message.id,
        }
      );

      return result;
    }),

  toggleReaction: dmProcedure
    .input(ToggleDmReactionInput)
    .handler(
      async ({ input, context: { db, orgId, session, notification } }) => {
        const userId = session.user.id;

        const result = await db.transaction(async (tx) => {
          const txid = await generateTxId(tx);
          const message = await tx.query.dmMessageTable.findFirst({
            where: eq(dmMessageTable.id, input.messageId),
          });

          if (!message) {
            throw new ORPCError("NOT_FOUND", {
              message: "Message not found.",
            });
          }

          const conversation = await tx.query.dmConversationTable.findFirst({
            where: and(
              eq(dmConversationTable.id, message.conversationId),
              eq(dmConversationTable.organizationId, orgId),
              or(
                eq(dmConversationTable.participantOneId, userId),
                eq(dmConversationTable.participantTwoId, userId)
              )
            ),
          });

          if (!conversation) {
            throw new ORPCError("FORBIDDEN", {
              message: "You are not a participant of this conversation.",
            });
          }

          const existing = await tx.query.dmMessageReactionTable.findFirst({
            where: and(
              eq(dmMessageReactionTable.messageId, input.messageId),
              eq(dmMessageReactionTable.userId, userId),
              eq(dmMessageReactionTable.emoji, input.emoji)
            ),
          });

          let action: "added" | "removed";
          if (existing) {
            await tx
              .delete(dmMessageReactionTable)
              .where(eq(dmMessageReactionTable.id, existing.id));
            action = "removed";
          } else {
            await tx.insert(dmMessageReactionTable).values({
              messageId: input.messageId,
              userId,
              emoji: input.emoji,
            });
            action = "added";
          }

          return {
            txid,
            action,
            conversationId: message.conversationId,
            messageSenderId: message.senderId,
            messagePreview: message.content?.slice(0, 100) ?? "",
          };
        });

        await emitDmEvent(result.conversationId, DM_EVENTS.REACTION, {
          messageId: input.messageId,
          userId,
          emoji: input.emoji,
          action: result.action,
        });

        if (
          notification &&
          result.action === "added" &&
          userId !== result.messageSenderId
        ) {
          Promise.resolve().then(async () => {
            try {
              await notification.emit({
                type: "dm_reaction",
                actorId: userId,
                targetUserId: result.messageSenderId,
                orgId,
                entityId: input.messageId,
                entityType: "reaction",
                metadata: {
                  conversationId: result.conversationId,
                  messagePreview: result.messagePreview,
                  reactorId: userId,
                  reactorName: session.user.name ?? "Someone",
                  emoji: input.emoji,
                },
              });
            } catch (error) {
              console.error("Error emitting DM reaction notification:", error);
            }
          });
        }

        return result;
      }
    ),

  togglePin: dmProcedure
    .input(ToggleDmPinInput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const userId = session.user.id;

      const result = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const message = await tx.query.dmMessageTable.findFirst({
          where: eq(dmMessageTable.id, input.messageId),
        });

        if (!message) {
          throw new ORPCError("NOT_FOUND", {
            message: "Message not found.",
          });
        }

        const conversation = await tx.query.dmConversationTable.findFirst({
          where: and(
            eq(dmConversationTable.id, message.conversationId),
            eq(dmConversationTable.organizationId, orgId),
            or(
              eq(dmConversationTable.participantOneId, userId),
              eq(dmConversationTable.participantTwoId, userId)
            )
          ),
        });

        if (!conversation) {
          throw new ORPCError("FORBIDDEN", {
            message: "You are not a participant of this conversation.",
          });
        }

        const nextPinnedState = !message.isPinned;
        const [updated] = await tx
          .update(dmMessageTable)
          .set({
            isPinned: nextPinnedState,
            pinnedAt: nextPinnedState ? new Date() : null,
            pinnedBy: nextPinnedState ? userId : null,
          })
          .where(eq(dmMessageTable.id, input.messageId))
          .returning();

        if (!updated) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Failed to toggle pin.",
          });
        }

        return { txid, message: updated };
      });

      await emitDmEvent(result.message.conversationId, DM_EVENTS.PIN_TOGGLE, {
        conversationId: result.message.conversationId,
        messageId: result.message.id,
        isPinned: result.message.isPinned,
        pinnedAt: result.message.pinnedAt,
        pinnedBy: result.message.pinnedBy,
      });

      return result;
    }),

  markRead: dmProcedure
    .input(MarkDmReadInput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const userId = session.user.id;

      const result = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const conversation = await tx.query.dmConversationTable.findFirst({
          where: and(
            eq(dmConversationTable.id, input.conversationId),
            eq(dmConversationTable.organizationId, orgId),
            or(
              eq(dmConversationTable.participantOneId, userId),
              eq(dmConversationTable.participantTwoId, userId)
            )
          ),
        });

        if (!conversation) {
          throw new ORPCError("FORBIDDEN", {
            message: "You are not a participant of this conversation.",
          });
        }

        const message = await tx.query.dmMessageTable.findFirst({
          where: and(
            eq(dmMessageTable.id, input.messageId),
            eq(dmMessageTable.conversationId, input.conversationId),
            eq(dmMessageTable.isDeleted, false)
          ),
        });

        if (!message) {
          throw new ORPCError("NOT_FOUND", {
            message: "Message not found in this conversation.",
          });
        }

        const readAt = new Date();
        await tx
          .insert(dmConversationReadTable)
          .values({
            conversationId: input.conversationId,
            userId,
            lastReadMessageId: input.messageId,
            lastReadAt: readAt,
          })
          .onConflictDoUpdate({
            target: [
              dmConversationReadTable.conversationId,
              dmConversationReadTable.userId,
            ],
            set: {
              lastReadMessageId: input.messageId,
              lastReadAt: readAt,
            },
          });

        await tx
          .insert(dmMessageReadTable)
          .values({
            messageId: input.messageId,
            userId,
            readAt,
          })
          .onConflictDoNothing();

        return { txid, readAt };
      });

      await emitDmEvent(input.conversationId, DM_EVENTS.READ_RECEIPT, {
        conversationId: input.conversationId,
        messageId: input.messageId,
        userId,
        readAt: result.readAt,
      });

      return result;
    }),

  searchMessages: dmProcedure
    .input(SearchDmMessagesInput)
    .output(SearchDmMessagesOutput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const userId = session.user.id;

      const conversation = await db.query.dmConversationTable.findFirst({
        where: and(
          eq(dmConversationTable.id, input.conversationId),
          eq(dmConversationTable.organizationId, orgId),
          or(
            eq(dmConversationTable.participantOneId, userId),
            eq(dmConversationTable.participantTwoId, userId)
          )
        ),
      });

      if (!conversation) {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not a participant of this conversation.",
        });
      }

      const client = await OpenSearchClient.ensureConnected();
      const limit = input.limit ?? 20;

      const filters: Record<string, unknown>[] = [
        { term: { scopeType: "dm" } },
        { term: { scopeId: input.conversationId } },
        { term: { organizationId: orgId } },
      ];

      type SearchHit = {
        _source: {
          createdAt: string;
          messageId: string;
          contentPlain?: string;
          messageType: string;
          parentMessageId?: string;
          scopeId: string;
          senderId: string;
        };
        highlight?: {
          contentPlain?: string[];
        };
        sort?: unknown[];
      };

      const response = await client.search({
        index: "message_search",
        body: {
          query: {
            bool: {
              must: [{ match: { contentPlain: input.query } }],
              filter: filters,
            },
          },
          highlight: {
            pre_tags: ["<mark>"],
            post_tags: ["</mark>"],
            fields: {
              contentPlain: {
                fragment_size: 150,
                number_of_fragments: 3,
              },
            },
          },
          sort: [
            { _score: "desc" },
            { createdAt: "desc" },
            { messageId: "asc" },
          ],
          size: limit,
          ...(input.cursor
            ? {
                search_after: JSON.parse(
                  Buffer.from(input.cursor, "base64").toString("utf8")
                ),
              }
            : {}),
        },
      });

      const hits = response.body.hits.hits as unknown as SearchHit[];
      const totalHits = response.body.hits.total;
      const total =
        typeof totalHits === "number" ? totalHits : (totalHits?.value ?? 0);

      const senderIds = Array.from(
        new Set(hits.map((hit) => hit._source.senderId))
      );

      const senders =
        senderIds.length > 0
          ? await db
              .select({
                id: userTable.id,
                name: userTable.name,
                email: userTable.email,
                image: userTable.image,
              })
              .from(userTable)
              .where(inArray(userTable.id, senderIds))
          : [];

      const senderMap = new Map(senders.map((sender) => [sender.id, sender]));

      const messages = hits.map((hit) => {
        const source = hit._source;
        const sender = senderMap.get(source.senderId);

        return {
          id: source.messageId,
          conversationId: source.scopeId,
          senderId: source.senderId,
          content: source.contentPlain ?? null,
          type: source.messageType,
          parentMessageId: source.parentMessageId ?? null,
          createdAt: new Date(source.createdAt),
          sender: sender ?? { name: "Unknown", email: "", image: null },
          highlights:
            (hit.highlight?.contentPlain as string[] | undefined) ?? [],
        };
      });

      let nextCursor: string | null = null;
      if (hits.length > 0 && hits.length === limit) {
        const lastHit = hits.at(-1);
        if (lastHit?.sort) {
          nextCursor = Buffer.from(JSON.stringify(lastHit.sort)).toString(
            "base64"
          );
        }
      }

      return { messages, nextCursor, total };
    }),

  getThreadMessages: dmProcedure
    .input(
      z.object({
        parentMessageId: z.cuid2(),
      })
    )
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const userId = session.user.id;
      const parent = await db.query.dmMessageTable.findFirst({
        where: eq(dmMessageTable.id, input.parentMessageId),
      });

      if (!parent) {
        throw new ORPCError("NOT_FOUND", {
          message: "Parent message not found.",
        });
      }

      const conversation = await db.query.dmConversationTable.findFirst({
        where: and(
          eq(dmConversationTable.id, parent.conversationId),
          eq(dmConversationTable.organizationId, orgId),
          or(
            eq(dmConversationTable.participantOneId, userId),
            eq(dmConversationTable.participantTwoId, userId)
          )
        ),
      });

      if (!conversation) {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not a participant of this conversation.",
        });
      }

      const messages = await db.query.dmMessageTable.findMany({
        where: and(
          eq(dmMessageTable.parentMessageId, input.parentMessageId),
          eq(dmMessageTable.isDeleted, false)
        ),
        orderBy: [desc(dmMessageTable.createdAt)],
        with: {
          sender: true,
        },
      });

      return {
        messages,
        replyCount: messages.length,
      };
    }),

  addAttachment: dmProcedure
    .input(DmAttachmentInput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const userId = session.user.id;

      const attachment = await db.transaction(async (tx) => {
        const message = await tx.query.dmMessageTable.findFirst({
          where: eq(dmMessageTable.id, input.messageId),
        });

        if (!message) {
          throw new ORPCError("NOT_FOUND", {
            message: "Message not found.",
          });
        }

        const conversation = await tx.query.dmConversationTable.findFirst({
          where: and(
            eq(dmConversationTable.id, message.conversationId),
            eq(dmConversationTable.organizationId, orgId),
            or(
              eq(dmConversationTable.participantOneId, userId),
              eq(dmConversationTable.participantTwoId, userId)
            )
          ),
        });

        if (!conversation) {
          throw new ORPCError("FORBIDDEN", {
            message: "You are not a participant of this conversation.",
          });
        }

        const [created] = await tx
          .insert(dmAttachmentTable)
          .values({
            messageId: input.messageId,
            fileName: input.fileName,
            originalName: input.originalName ?? input.fileName,
            fileSize: input.size,
            mimeType: input.mimeType,
            type: input.type,
            url: input.url,
            uploadedBy: userId,
          })
          .returning();

        if (!created) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Failed to add attachment.",
          });
        }

        return created;
      });

      return { attachment };
    }),
};
