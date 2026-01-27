import { ORPCError } from "@orpc/client";
import {
  attachmentTable,
  channelMemberTable,
  channelReadTable,
  channelTable,
  messageMentionTable,
  messageReactionTable,
  messageReadTable,
  messageTable,
  notificationTable,
  pushSubscriptionTable,
  user as userTable,
} from "@work-holo/db/schema/index";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm";
import webpush from "web-push";
import "../../lib/push-notifications";
import { auth } from "@work-holo/auth";
import { env } from "../../env";
import { orgMemberProcedure } from "../../index";
import { generateTxId } from "../../lib/electric-proxy";
import {
  largeChannelReadersSql,
  smallChannelReadersSql,
} from "../../lib/prepared-sql";
import { getQueueClient } from "../../lib/queue";
import {
  verifyChannelMembership,
  verifyMessageChannelMembership,
} from "./helpers";
import {
  AddReactionInput,
  AddReactionOutput,
  CreateMessageInput,
  CreateMessageOutput,
  DeleteMessageInput,
  DeleteMessageOutput,
  GetAllMessageReadersInput,
  GetAllMessageReadersOutput,
  GetChannelMessagesInput,
  GetChannelMessagesOutput,
  GetMenionUsersInput,
  GetMenionUsersOutput,
  GetMessageInput,
  GetMessageOutput,
  GetPinnedMessagesInput,
  GetPinnedMessagesOutput,
  GetUnreadCountInput,
  MarkAllMentionsSeenInput,
  MarkAllMentionsSeenOutput,
  MarkMentionSeenInput,
  MarkMentionSeenOutput,
  MarkMessagesAsReadInput,
  MarkMessagesAsReadOutput,
  PinMessageInput,
  PinMessageOutput,
  RemoveReactionInput,
  RemoveReactionOutput,
  SearchMessageOutput,
  SearchMessagesInput,
  SearchUsersInput,
  SearchUsersOutput,
  UnPinMessageInput,
  UnPinMessageOutput,
  UnreadCountOutput,
  UpdateMessageInput,
  UpdateMessageOutput,
} from "../../lib/schemas/message";
import { deleteFile } from "../../lib/storage";
import type { BucketName } from "../../lib/storage/types";

// Configuration: Maximum channel members for detailed read tracking
// Channels with <= this many members will use messageRead table (detailed tracking)
// Channels with > this many members will use messageReadSummary only (aggregated tracking)
const MAX_MEMBERS_FOR_DETAILED_TRACKING =
  Number(process.env.MAX_MEMBERS_FOR_DETAILED_TRACKING) || 25;

export const messageRouter = {
  searchUsers: orgMemberProcedure
    .input(SearchUsersInput)
    .output(SearchUsersOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      await verifyChannelMembership(db, input.channelId, session!.user.id, orgId!);
      const users = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          image: userTable.image,
        })
        .from(channelMemberTable)
        .innerJoin(userTable, eq(channelMemberTable.userId, userTable.id))
        .where(
          and(
            eq(channelMemberTable.channelId, input.channelId),
            or(
              ilike(userTable.name, `%${input.query}%`),
              ilike(userTable.email, `%${input.query}%`)
            )
          )
        );

      return { users };
    }),

  create: orgMemberProcedure
    .input(CreateMessageInput)
    .output(CreateMessageOutput)
    .handler(
      async ({
        context: {
          db,
          session: { user },
          headers,
          orgId,
        },
        input,
      }) => {
        await verifyChannelMembership(db, input.channelId, user.id, orgId!);
        const { txid, message } = await db.transaction(async (tx) => {
          const txid = await generateTxId(tx);

          const channel = await tx.query.channelTable.findFirst({
            where: eq(channelTable.id, input.channelId),
          });

          if (!channel) {
            throw new ORPCError("NOT_FOUND", {
              message: "Channel not found",
            });
          }

          const [newMessage] = await tx
            .insert(messageTable)
            .values({
              channelId: input.channelId,
              receiverId: input.receiverId,
              content: input.content,
              type: input.type,
              parentMessageId: input.parentMessageId,
              senderId: user.id,
            })
            .returning();

          if (!newMessage) {
            throw new ORPCError("NOT_FOUND", {
              message: "Failed to create message",
            });
          }

          // Handle attachments
          if (input.attachments && input.attachments.length > 0) {
            const attachmentValues = input.attachments.map((attachment) => ({
              messageId: newMessage.id,
              fileName: attachment.fileName,
              originalName: attachment.originalName,
              fileSize: attachment.fileSize,
              mimeType: attachment.mimeType,
              type: attachment.type,
              url: attachment.url,
              uploadedBy: user.id,
            }));

            await tx.insert(attachmentTable).values(attachmentValues);
          }

          if (input.mentions && input.mentions.length > 0) {
            const mentionValues = input.mentions.map((mentionedUserId) => ({
              messageId: newMessage.id,
              mentionedById: user.id,
              mentionedUserId,
              isSeen: false,
            }));

            await tx
              .insert(messageMentionTable)
              .values(mentionValues)
              .onConflictDoNothing({
                target: [
                  messageMentionTable.messageId,
                  messageMentionTable.mentionedUserId,
                ],
              });

            const mentionNotifications = input.mentions.map(
              (mentionedUserId) => ({
                userId: mentionedUserId,
                type: "mention" as const,
                title: `${user.name} mentioned you in ${channel.name}`,
                message:
                  input.content?.slice(0, 200) ||
                  "You were mentioned in a message",
                entityId: newMessage.id,
                entityType: "message",
              })
            );

            await tx.insert(notificationTable).values(mentionNotifications);
            const org = await auth.api.getFullOrganization({
              headers,
            });

            const url = `${env.CORS_ORIGIN}/org/${org?.slug}/communication/channels/${input.channelId}`;
            // Send push notifications asynchronously (don't block the transaction)
            Promise.resolve().then(async () => {
              try {
                const subscriptions = await db
                  .select()
                  .from(pushSubscriptionTable)
                  .where(
                    inArray(pushSubscriptionTable.userId, input.mentions || [])
                  );

                await Promise.allSettled(
                  subscriptions.map(async (sub) => {
                    try {
                      await webpush.sendNotification(
                        {
                          endpoint: sub.endpoint,
                          keys: { p256dh: sub.p256dh, auth: sub.auth },
                        },
                        JSON.stringify({
                          title: "Work Holo",
                          body: `${user.name} mentioned you in '${channel.name}' channel`,
                          icon: "/favicon.ico",
                          badge: "/favicon.ico",
                          tag: "work-holo-mention",
                          data: {
                            type: "mention",
                            url,
                          },
                        })
                      );
                    } catch (error: unknown) {
                      // Remove invalid subscriptions (410 Gone or 404 Not Found)
                      if (
                        error &&
                        typeof error === "object" &&
                        "statusCode" in error &&
                        (error.statusCode === 410 || error.statusCode === 404)
                      ) {
                        await db
                          .delete(pushSubscriptionTable)
                          .where(eq(pushSubscriptionTable.id, sub.id));
                      }
                    }
                  })
                );
              } catch (error) {
                console.error("Error sending push notifications:", error);
              }
            });
          }

          if (input.parentMessageId) {
            await tx
              .update(messageTable)
              .set({
                threadCount: sql`${messageTable.threadCount} + 1`,
              })
              .where(eq(messageTable.id, input.parentMessageId));
          }

          // Mark message as read for sender
          // Get member count to determine tracking strategy
          const readTimestamp = new Date();
          const memberCount = await tx
            .select({ count: count() })
            .from(channelMemberTable)
            .where(eq(channelMemberTable.channelId, input.channelId))
            .then((result) => result[0]?.count ?? 0);

          // Only insert messageRead for small channels
          if (memberCount <= MAX_MEMBERS_FOR_DETAILED_TRACKING) {
            await tx
              .insert(messageReadTable)
              .values({
                messageId: newMessage.id,
                userId: user.id,
                readAt: readTimestamp,
              })
              .onConflictDoNothing();
          }

          const newMessageCreatedAtIso = newMessage.createdAt.toISOString();
          const readTimestampIso = readTimestamp.toISOString();

          await tx
            .insert(channelReadTable)
            .values({
              channelId: input.channelId,
              userId: user.id,
              lastReadMessageId: newMessage.id,
              lastReadAt: readTimestamp,
            })
            .onConflictDoUpdate({
              target: [channelReadTable.channelId, channelReadTable.userId],
              set: {
                lastReadMessageId: sql`
                  CASE
                    WHEN ${sql.raw(`'${newMessageCreatedAtIso}'::timestamp`)} >
                    COALESCE(
                      (
                        SELECT ${messageTable.createdAt}
                        FROM ${messageTable}
                        WHERE ${messageTable.id} = ${channelReadTable.lastReadMessageId}
                      ),
                      '1970-01-01'::timestamp
                    )
                    THEN ${newMessage.id}
                    ELSE ${channelReadTable.lastReadMessageId}
                  END
                `,
                lastReadAt: sql`
                  CASE
                    WHEN ${sql.raw(`'${newMessageCreatedAtIso}'::timestamp`)} >
                    COALESCE(
                      (
                        SELECT ${messageTable.createdAt}
                        FROM ${messageTable}
                        WHERE ${messageTable.id} = ${channelReadTable.lastReadMessageId}
                      ),
                      '1970-01-01'::timestamp
                    )
                    THEN ${sql.raw(`'${readTimestampIso}'::timestamp`)}
                    ELSE ${channelReadTable.lastReadAt}
                  END
                `,
              },
            });

          return { txid, message: newMessage };
        });

        return { txid, message };
      }
    ),

  update: orgMemberProcedure
    .input(UpdateMessageInput)
    .output(UpdateMessageOutput)
    .handler(
      async ({
        context: {
          db,
          session: { user },
        },
        input,
      }) => {
        const { txid, message } = await db.transaction(async (tx) => {
          const txid = await generateTxId(tx);

          const [updatedMessage] = await tx
            .update(messageTable)
            .set({
              content: input.content,
              isEdited: true,
              editedAt: new Date(),
              ...(input.mentions !== undefined
                ? { mentions: input.mentions }
                : {}),
            })
            .where(eq(messageTable.id, input.messageId))
            .returning();

          if (!updatedMessage) {
            throw new ORPCError("BAD_REQUEST", {
              message: "Failed to update message.",
            });
          }

          const channel = await tx.query.channelTable.findFirst({
            where: eq(channelTable.id, updatedMessage.channelId),
          });

          if (!channel) {
            throw new ORPCError("NOT_FOUND", {
              message: "Channel not found",
            });
          }

          if (input.mentions !== undefined) {
            await tx
              .delete(messageMentionTable)
              .where(eq(messageMentionTable.messageId, input.messageId));

            if (input.mentions.length > 0) {
              const mentionValues = input.mentions.map((mentionedUserId) => ({
                messageId: updatedMessage.id,
                mentionedById: user.id,
                mentionedUserId,
                isSeen: false,
              }));

              await tx
                .insert(messageMentionTable)
                .values(mentionValues)
                .onConflictDoNothing({
                  target: [
                    messageMentionTable.messageId,
                    messageMentionTable.mentionedUserId,
                  ],
                });

              const mentionNotifications = input.mentions.map(
                (mentionedUserId) => ({
                  userId: mentionedUserId,
                  type: "mention" as const,
                  title: `${user.name} mentioned you in ${channel.name}`,
                  message:
                    input.content?.slice(0, 200) ??
                    "You were mentioned in a message",
                  entityId: updatedMessage.id,
                  entityType: "message",
                })
              );

              await tx.insert(notificationTable).values(mentionNotifications);

              // Send push notifications asynchronously (don't block the transaction)
              Promise.resolve().then(async () => {
                try {
                  const subscriptions = await db
                    .select()
                    .from(pushSubscriptionTable)
                    .where(
                      inArray(
                        pushSubscriptionTable.userId,
                        input.mentions || []
                      )
                    );

                  await Promise.allSettled(
                    subscriptions.map(async (sub) => {
                      try {
                        await webpush.sendNotification(
                          {
                            endpoint: sub.endpoint,
                            keys: { p256dh: sub.p256dh, auth: sub.auth },
                          },
                          JSON.stringify({
                            title: "Work Holo",
                            body: `${user.name} mentioned you in '${channel.name}' channel`,
                            icon: "/favicon.ico",
                            badge: "/favicon.ico",
                            tag: "work-holo-mention",
                            data: {
                              messageId: updatedMessage.id,
                              channelId: updatedMessage.channelId,
                              type: "mention",
                            },
                          })
                        );
                      } catch (error: unknown) {
                        if (
                          error &&
                          typeof error === "object" &&
                          "statusCode" in error &&
                          (error.statusCode === 410 || error.statusCode === 404)
                        ) {
                          await db
                            .delete(pushSubscriptionTable)
                            .where(eq(pushSubscriptionTable.id, sub.id));
                        }
                      }
                    })
                  );
                } catch (error) {
                  console.error("Error sending push notifications:", error);
                }
              });
            }
          }

          return { txid, message: updatedMessage };
        });

        return {
          txid,
          message: {
            ...message,
            sender: user,
          },
        };
      }
    ),

  getChannelMessages: orgMemberProcedure
    .input(GetChannelMessagesInput)
    .output(GetChannelMessagesOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      await verifyChannelMembership(db, input.channelId, session!.user.id, orgId!);
      const messages = await db.query.messageTable.findMany({
        where: and(
          eq(messageTable.channelId, input.channelId),
          eq(messageTable.isDeleted, false)
        ),
        with: {
          sender: true,
          attachments: true,
          parentMessage: {
            with: {
              sender: {
                columns: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      return {
        messages,
      };
    }),

  delete: orgMemberProcedure
    .input(DeleteMessageInput)
    .output(DeleteMessageOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      await verifyMessageChannelMembership(db, input.messageId, session!.user.id, orgId!);

      const { txid } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        const message = await tx.query.messageTable.findFirst({
          where: eq(messageTable.id, input.messageId),
          columns: { id: true, senderId: true, parentMessageId: true },
          with: {
            attachments: {
              columns: {
                fileName: true,
                type: true,
              },
            },
          },
        });

        if (!message) {
          throw new ORPCError("NOT_FOUND", {
            message: "Message not found.",
          });
        }

        if (message.attachments && message.attachments.length > 0) {
          for (const attachment of message.attachments) {
            const bucket: BucketName =
              attachment.type === "audio"
                ? "message-audio"
                : "message-attachment";

            try {
              await deleteFile({
                bucket,
                filePath: attachment.fileName,
              });
            } catch (error) {
              console.error(
                `Failed to delete file ${attachment.fileName} from ${bucket}:`,
                error
              );
            }
          }
        }

        await tx
          .delete(messageTable)
          .where(eq(messageTable.id, input.messageId));

        await tx
          .delete(attachmentTable)
          .where(eq(attachmentTable.messageId, input.messageId));

        await tx
          .delete(messageTable)
          .where(eq(messageTable.parentMessageId, input.messageId));

        return { txid };
      });

      return {
        txid,
      };
    }),

  getUnreadCount: orgMemberProcedure
    .input(GetUnreadCountInput)
    .output(UnreadCountOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      await verifyChannelMembership(db, input.channelId, session!.user.id, orgId!);
      const currentUser = session.user;

      const membership = await db.query.channelMemberTable.findFirst({
        where: and(
          eq(channelMemberTable.channelId, input.channelId),
          eq(channelMemberTable.userId, currentUser.id)
        ),
      });

      if (!membership?.lastReadAt) {
        const [messageCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(messageTable)
          .where(
            and(
              eq(messageTable.channelId, input.channelId),
              eq(messageTable.isDeleted, false)
            )
          );

        return { count: messageCount?.count ?? 0 };
      }

      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(messageTable)
        .where(
          and(
            eq(messageTable.channelId, input.channelId),
            eq(messageTable.isDeleted, false),
            sql`${messageTable.createdAt} > ${membership.lastReadAt}`
          )
        );

      return { count: result?.count ?? 0 };
    }),

  search: orgMemberProcedure
    .input(SearchMessagesInput)
    .output(SearchMessageOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      await verifyChannelMembership(db, input.channelId, session!.user.id, orgId!);
      const messages = await db
        .select({
          ...getTableColumns(messageTable),
          sender: {
            name: userTable.name,
            email: userTable.email,
            image: userTable.image,
          },
        })
        .from(messageTable)
        .innerJoin(userTable, eq(messageTable.senderId, userTable.id))
        .where(
          and(
            eq(messageTable.channelId, input.channelId),
            eq(messageTable.isDeleted, false),
            ilike(messageTable.content, `%${input.query}%`)
          )
        )
        .orderBy(desc(messageTable.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return {
        messages,
        total: messages.length,
        hasMore: messages.length === input.limit,
      };
    }),

  get: orgMemberProcedure
    .input(GetMessageInput)
    .output(GetMessageOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      await verifyMessageChannelMembership(db, input.messageId, session!.user.id, orgId!);
      const message = await db.query.messageTable.findFirst({
        where: eq(messageTable.id, input.messageId),
        with: {
          sender: {
            columns: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return message;
    }),

  getParent: orgMemberProcedure
    .input(GetMessageInput)
    .output(GetMessageOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      await verifyMessageChannelMembership(db, input.messageId, session!.user.id, orgId!);
      const parentMessage = await db.query.messageTable.findFirst({
        where: eq(messageTable.parentMessageId, input.messageId),
        with: {
          sender: {
            columns: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return parentMessage;
    }),

  pin: orgMemberProcedure
    .input(PinMessageInput)
    .output(PinMessageOutput)
    .handler(
      async ({
        context: {
          db,
          session: { user },
          orgId,
        },
        input,
      }) => {
        await verifyMessageChannelMembership(db, input.messageId, user.id, orgId!);
        const { txid } = await db.transaction(async (tx) => {
          const txid = await generateTxId(tx);

          await tx
            .update(messageTable)
            .set({
              isPinned: true,
              pinnedAt: new Date(),
              pinnedBy: user.id,
            })
            .where(eq(messageTable.id, input.messageId))
            .returning();

          return { txid };
        });

        return {
          txid,
        };
      }
    ),
  unPin: orgMemberProcedure
    .input(UnPinMessageInput)
    .output(UnPinMessageOutput)
    .handler(async ({ context: { db }, input }) => {
      const { txid } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        await tx
          .update(messageTable)
          .set({
            isPinned: false,
            pinnedAt: null,
            pinnedBy: null,
          })
          .where(eq(messageTable.id, input.messageId))
          .returning();

        return { txid };
      });

      return {
        txid,
      };
    }),
  getPinnedMessages: orgMemberProcedure
    .input(GetPinnedMessagesInput)
    .output(GetPinnedMessagesOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      await verifyChannelMembership(db, input.channelId, session!.user.id, orgId!);
      const baseConditions = [
        eq(messageTable.isPinned, true),
        eq(messageTable.channelId, input.channelId),
        eq(messageTable.isDeleted, false),
      ];

      if (input.query?.trim()) {
        const searchCondition = ilike(messageTable.content, `%${input.query}%`);

        if (searchCondition) {
          baseConditions.push(searchCondition);
        }
      }

      const pinnedMessages = await db.query.messageTable.findMany({
        where: and(...baseConditions),
        with: {
          sender: true,
        },
      });

      return pinnedMessages;
    }),
  getMentionUsers: orgMemberProcedure
    .input(GetMenionUsersInput)
    .output(GetMenionUsersOutput)
    .handler(async ({ context: { db }, input }) => {
      const users = await db.query.user.findMany({
        where: inArray(userTable.id, input.userIds),
      });

      return users;
    }),
  markMentionSeen: orgMemberProcedure
    .input(MarkMentionSeenInput)
    .output(MarkMentionSeenOutput)
    .handler(async ({ context: { db, session }, input }) => {
      const { user } = session;

      const { txid } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        const mention = await tx
          .select({
            id: messageMentionTable.id,
            isSeen: messageMentionTable.isSeen,
          })
          .from(messageMentionTable)
          .innerJoin(
            messageTable,
            eq(messageMentionTable.messageId, messageTable.id)
          )
          .where(
            and(
              eq(messageMentionTable.id, input.mentionId),
              eq(messageMentionTable.mentionedUserId, user.id),
              eq(messageTable.isDeleted, false)
            )
          )
          .then((rows) => rows[0]);

        if (!mention) {
          throw new ORPCError("NOT_FOUND", {
            message: "Mention not found or message was deleted.",
          });
        }

        if (!mention.isSeen) {
          await tx
            .update(messageMentionTable)
            .set({ isSeen: true })
            .where(eq(messageMentionTable.id, input.mentionId));
        }

        return { txid };
      });

      return { txid, success: true };
    }),

  markAllMentionsSeen: orgMemberProcedure
    .input(MarkAllMentionsSeenInput)
    .output(MarkAllMentionsSeenOutput)
    .handler(async ({ context: { db, session }, input }) => {
      const { user } = session;

      const { txid, count } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        const mentionsToUpdate = await tx
          .select({ id: messageMentionTable.id })
          .from(messageMentionTable)
          .innerJoin(
            messageTable,
            eq(messageMentionTable.messageId, messageTable.id)
          )
          .where(
            and(
              eq(messageMentionTable.mentionedUserId, user.id),
              eq(messageMentionTable.isSeen, false),
              eq(messageTable.channelId, input.channelId),
              eq(messageTable.isDeleted, false)
            )
          );

        if (mentionsToUpdate.length === 0) {
          return { txid, count: 0 };
        }

        const mentionIds = mentionsToUpdate.map((m) => m.id);

        await tx
          .update(messageMentionTable)
          .set({ isSeen: true })
          .where(inArray(messageMentionTable.id, mentionIds));

        return { txid };
      });

      return { txid, success: true, count };
    }),

  addReaction: orgMemberProcedure
    .input(AddReactionInput)
    .output(AddReactionOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      await verifyMessageChannelMembership(db, input.messageId, session!.user.id, orgId!);
      const userId = session.user.id;

      const { txid } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        const message = await tx.query.messageTable.findFirst({
          where: eq(messageTable.id, input.messageId),
          columns: { id: true },
        });

        if (!message) {
          throw new ORPCError("NOT_FOUND", {
            message: "Message not found.",
          });
        }

        await tx
          .insert(messageReactionTable)
          .values({
            messageId: input.messageId,
            userId,
            reaction: input.emoji,
          })
          .onConflictDoNothing({
            target: [
              messageReactionTable.messageId,
              messageReactionTable.userId,
              messageReactionTable.reaction,
            ],
          });

        return { txid };
      });

      return {
        txid,
        success: true,
        message: "Reaction added successfully.",
      };
    }),

  removeReaction: orgMemberProcedure
    .input(RemoveReactionInput)
    .output(RemoveReactionOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      const userId = session.user.id;

      // First get the reaction to find the messageId
      const reaction = await db.query.messageReactionTable.findFirst({
        where: and(
          eq(messageReactionTable.id, input.reactionId),
          eq(messageReactionTable.userId, userId)
        ),
        columns: { messageId: true },
      });

      if (!reaction) {
        throw new ORPCError("NOT_FOUND", {
          message: "Reaction not found or you don't have permission to remove it.",
        });
      }

      // Verify channel membership via message
      await verifyMessageChannelMembership(db, reaction.messageId, userId, orgId!);

      const { txid } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        await tx
          .delete(messageReactionTable)
          .where(
            and(
              eq(messageReactionTable.id, input.reactionId),
              eq(messageReactionTable.userId, userId)
            )
          );

        return { txid };
      });

      return {
        txid,
        success: true,
        message: "Reaction removed successfully.",
      };
    }),

  markMessagesAsRead: orgMemberProcedure
    .input(MarkMessagesAsReadInput)
    .output(MarkMessagesAsReadOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      await verifyChannelMembership(db, input.channelId, session!.user.id, orgId!);
      const userId = session.user.id;

      const { txid, memberCount } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        // Verify user is a member of the channel
        const channelMember = await tx.query.channelMemberTable.findFirst({
          where: and(
            eq(channelMemberTable.channelId, input.channelId),
            eq(channelMemberTable.userId, userId)
          ),
        });

        if (!channelMember) {
          throw new ORPCError("FORBIDDEN", {
            message: "You are not a member of this channel.",
          });
        }

        // Count channel members to determine tracking strategy
        const memberCountResult = await tx
          .select({ count: count() })
          .from(channelMemberTable)
          .where(eq(channelMemberTable.channelId, input.channelId));

        const memberCount = Number(memberCountResult[0]?.count ?? 0);

        // Get the latest message from the provided messageIds
        const messages = await tx.query.messageTable.findMany({
          where: and(
            inArray(messageTable.id, input.messageIds),
            eq(messageTable.channelId, input.channelId),
            eq(messageTable.isDeleted, false)
          ),
          orderBy: [desc(messageTable.createdAt)],
          columns: {
            id: true,
            createdAt: true,
            senderId: true,
          },
        });

        if (messages.length === 0) {
          return { txid, memberCount };
        }

        const messagesFromOthers = messages.filter(
          (message) => message.senderId !== userId
        );

        if (messagesFromOthers.length === 0) {
          return { txid, memberCount };
        }

        const latestMessage = messagesFromOthers[0];

        if (!latestMessage) {
          return { txid, memberCount };
        }

        const readTimestamp = new Date();
        const latestMessageCreatedAt = latestMessage.createdAt.toISOString();
        const readTimestampIso = readTimestamp.toISOString();

        // Use timestamp-based conditional update to prevent race conditions
        // Compare against the createdAt of the currently stored last read message
        await tx
          .insert(channelReadTable)
          .values({
            channelId: input.channelId,
            userId,
            lastReadMessageId: latestMessage.id,
            lastReadAt: readTimestamp,
          })
          .onConflictDoUpdate({
            target: [channelReadTable.channelId, channelReadTable.userId],
            set: {
              lastReadMessageId: sql`
                CASE
                  WHEN ${sql.raw(`'${latestMessageCreatedAt}'::timestamp`)} >
                  COALESCE(
                    (
                      SELECT ${messageTable.createdAt}
                      FROM ${messageTable}
                      WHERE ${messageTable.id} = ${channelReadTable.lastReadMessageId}
                    ),
                    '1970-01-01'::timestamp
                  )
                  THEN ${latestMessage.id}
                  ELSE ${channelReadTable.lastReadMessageId}
                END
              `,
              lastReadAt: sql`
                CASE
                  WHEN ${sql.raw(`'${latestMessageCreatedAt}'::timestamp`)} >
                  COALESCE(
                    (
                      SELECT ${messageTable.createdAt}
                      FROM ${messageTable}
                      WHERE ${messageTable.id} = ${channelReadTable.lastReadMessageId}
                    ),
                    '1970-01-01'::timestamp
                  )
                  THEN ${sql.raw(`'${readTimestampIso}'::timestamp`)}
                  ELSE ${channelReadTable.lastReadAt}
                END
              `,
            },
          });

        // Only insert into messageRead table for small channels (detailed tracking)
        // For large channels, worker will update messageReadSummary directly
        if (memberCount <= MAX_MEMBERS_FOR_DETAILED_TRACKING) {
          // Only create read receipts for messages that exist and are not deleted
          const messageReadValues = messagesFromOthers.map((message) => ({
            messageId: message.id,
            userId,
            readAt: new Date(),
          }));

          if (messageReadValues.length > 0) {
            await tx
              .insert(messageReadTable)
              .values(messageReadValues)
              .onConflictDoNothing();
          }
        }

        // Auto-mark related mentions as seen
        const messageIdsArray = messagesFromOthers.map((m) => m.id);

        if (messageIdsArray.length > 0) {
          // Mark mentions as seen for the current user
          await tx
            .update(messageMentionTable)
            .set({ isSeen: true })
            .where(
              and(
                inArray(messageMentionTable.messageId, messageIdsArray),
                eq(messageMentionTable.mentionedUserId, userId),
                eq(messageMentionTable.isSeen, false)
              )
            );

          // Mark mention notifications as read
          await tx
            .update(notificationTable)
            .set({
              status: "read",
              readAt: new Date(),
            })
            .where(
              and(
                eq(notificationTable.userId, userId),
                eq(notificationTable.type, "mention"),
                inArray(notificationTable.entityId, messageIdsArray),
                eq(notificationTable.status, "unread")
              )
            );
        }

        return { txid, memberCount };
      });

      // Publish to queue for background processing
      // For small channels: process messageRead -> messageReadSummary
      // For large channels: process channelRead -> messageReadSummary directly
      try {
        const queueClient = getQueueClient();
        queueClient.publish("READ_RECEIPTS", {
          type: "process_channel",
          channelId: input.channelId,
          memberCount,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        // Log error but don't fail the request
        // The worker will eventually process this channel anyway
        console.error("Failed to publish to read receipts queue:", error);
      }

      return {
        txid,
        success: true,
      };
    }),

  getAllMessageReaders: orgMemberProcedure
    .input(GetAllMessageReadersInput)
    .output(GetAllMessageReadersOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      await verifyMessageChannelMembership(db, input.messageId, session!.user.id, orgId!);
      const userId = session.user.id;

      // Verify the message exists and user has access
      const message = await db.query.messageTable.findFirst({
        where: and(
          eq(messageTable.id, input.messageId),
          eq(messageTable.isDeleted, false)
        ),
        columns: {
          id: true,
          channelId: true,
          createdAt: true,
        },
      });

      if (!message) {
        return { readers: [] };
      }

      // Verify user is a member of the channel
      const channelMember = await db.query.channelMemberTable.findFirst({
        where: and(
          eq(channelMemberTable.channelId, message.channelId),
          eq(channelMemberTable.userId, userId)
        ),
      });

      if (!channelMember) {
        throw new ORPCError("FORBIDDEN", {
          message: "You do not have access to this message.",
        });
      }

      // Check channel member count to determine tracking strategy
      const memberCountResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(channelMemberTable)
        .where(eq(channelMemberTable.channelId, message.channelId));

      const memberCount = Number(memberCountResult[0]?.count || 0);

      let readers: Array<{
        id: string;
        name: string;
        email: string;
        image: string | null;
        readAt: Date;
      }> = [];

      if (memberCount <= MAX_MEMBERS_FOR_DETAILED_TRACKING) {
        readers = await smallChannelReadersSql.execute({
          messageId: input.messageId,
          currentUserId: userId,
        });
      } else {
        readers = await largeChannelReadersSql.execute({
          channelId: message.channelId,
          messageCreatedAt: message.createdAt,
          currentUserId: userId,
        });
      }

      return { readers };
    }),
};
