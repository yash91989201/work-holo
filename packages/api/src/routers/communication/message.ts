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
import { Queue } from "@work-holo/infrastructure";
import { env } from "../../env";
import { orgMemberProcedure } from "../../index";
import { generateTxId } from "../../lib/electric-proxy";
import {
  largeChannelReadersSql,
  smallChannelReadersSql,
} from "../../lib/prepared-sql";
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

const MAX_MEMBERS_FOR_DETAILED_TRACKING =
  Number(process.env.MAX_MEMBERS_FOR_DETAILED_TRACKING) || 25;

export const messageRouter = {
  /**
   * Searches channel members by name or email for mention autocomplete.
   * Requires channel access with channel.member.list permission.
   *
   * @param input.channelId - The channel to search members in
   * @param input.query - Name or email search string
   * @returns Matching users with id, name, email, and image
   */
  searchUsers: orgMemberProcedure
    .input(SearchUsersInput)
    .output(SearchUsersOutput)
    .handler(async ({ input, context: { db, permission } }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.member.list"
      );
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

  /**
   * Creates a new message in a channel. Handles file attachments, user mentions
   * with push notifications, thread count updates for replies, and per-message
   * or channel-level read tracking based on member count threshold.
   *
   * @param input.channelId - Target channel
   * @param input.content - Message text content
   * @param input.attachments - Optional file attachments
   * @param input.mentions - Optional user IDs to mention
   * @param input.parentMessageId - Optional parent message for threading
   * @returns Transaction ID and the created message record
   * @throws NOT_FOUND if the channel does not exist
   */
  create: orgMemberProcedure
    .input(CreateMessageInput)
    .output(CreateMessageOutput)
    .handler(
      async ({
        context: {
          db,
          session: { user },
          headers,
          permission,
        },
        input,
      }) => {
        await permission.requireChannelAccess(
          input.channelId,
          permission.channel().message.create
        );
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
                type: "channel_mention" as const,
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
                            type: "channel_mention",
                            url,
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

          if (input.parentMessageId) {
            await tx
              .update(messageTable)
              .set({
                threadCount: sql`${messageTable.threadCount} + 1`,
              })
              .where(eq(messageTable.id, input.parentMessageId));
          }

          const readTimestamp = new Date();
          const memberCount = await tx
            .select({ count: count() })
            .from(channelMemberTable)
            .where(eq(channelMemberTable.channelId, input.channelId))
            .then((result) => result[0]?.count ?? 0);

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

  /**
   * Updates a message's content and mention metadata. Replaces existing mentions
   * with the new set, creates notifications, and sends push notifications for
   * newly mentioned users.
   *
   * @param input.messageId - The message to update
   * @param input.content - New message content
   * @param input.mentions - Updated list of mentioned user IDs (replaces existing)
   * @returns Transaction ID and updated message with sender details
   * @throws BAD_REQUEST if the message update fails
   */
  update: orgMemberProcedure
    .input(UpdateMessageInput)
    .output(UpdateMessageOutput)
    .handler(
      async ({
        context: {
          db,
          session: { user },
          permission,
        },
        input,
      }) => {
        await permission.requireMessageAccess(
          input.messageId,
          permission.channel().message.update
        );
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
                  type: "channel_mention" as const,
                  title: `${user.name} mentioned you in ${channel.name}`,
                  message:
                    input.content?.slice(0, 200) ??
                    "You were mentioned in a message",
                  entityId: updatedMessage.id,
                  entityType: "message",
                })
              );

              await tx.insert(notificationTable).values(mentionNotifications);

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
                              type: "channel_mention",
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

  /**
   * Retrieves all non-deleted messages for a channel, including sender details,
   * file attachments, and parent message data for threaded replies.
   *
   * @param input.channelId - The channel to fetch messages from
   * @returns Object containing array of messages with sender and attachment data
   */
  getChannelMessages: orgMemberProcedure
    .input(GetChannelMessagesInput)
    .output(GetChannelMessagesOutput)
    .handler(async ({ input, context: { db, permission } }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.message.list"
      );
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

  /**
   * Deletes a message, its file attachments from storage, attachment records,
   * and any child thread messages. Requires message access with delete permission.
   *
   * @param input.messageId - The message to delete
   * @returns Transaction ID for the deletion
   * @throws NOT_FOUND if the message does not exist
   */
  delete: orgMemberProcedure
    .input(DeleteMessageInput)
    .output(DeleteMessageOutput)
    .handler(async ({ input, context: { db, permission } }) => {
      await permission.requireMessageAccess(
        input.messageId,
        permission.channel().message.delete
      );

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

  /**
   * Returns unread message count for the current user in a specific channel.
   * Counts non-deleted messages created after the user's last read timestamp.
   *
   * @param input.channelId - The channel to check
   * @returns Object with unread message count
   */
  getUnreadCount: orgMemberProcedure
    .input(GetUnreadCountInput)
    .output(UnreadCountOutput)
    .handler(async ({ input, context: { db, session, permission } }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.message.list"
      );
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

  /**
   * Searches messages by content within a channel using case-insensitive matching.
   * Returns results with sender details, ordered by most recent first.
   *
   * @param input.channelId - The channel to search in
   * @param input.query - Search text to match against message content
   * @param input.limit - Maximum results to return
   * @param input.offset - Pagination offset
   * @returns Matching messages with sender info, total count, and hasMore flag
   */
  search: orgMemberProcedure
    .input(SearchMessagesInput)
    .output(SearchMessageOutput)
    .handler(async ({ input, context: { db, permission } }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.message.list"
      );
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

  /**
   * Retrieves a single message by ID with sender details.
   * Requires message access with read permission.
   *
   * @param input.messageId - The message to retrieve
   * @returns Message record with sender name, email, and image
   */
  get: orgMemberProcedure
    .input(GetMessageInput)
    .output(GetMessageOutput)
    .handler(async ({ input, context: { db, permission } }) => {
      await permission.requireMessageAccess(
        input.messageId,
        permission.channel().message.read
      );
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

  /**
   * Retrieves the parent message of a thread reply, with sender details.
   * Requires message access with read permission.
   *
   * @param input.messageId - The child message whose parent to retrieve
   * @returns Parent message record with sender info, or undefined if none
   */
  getParent: orgMemberProcedure
    .input(GetMessageInput)
    .output(GetMessageOutput)
    .handler(async ({ input, context: { db, permission } }) => {
      await permission.requireMessageAccess(
        input.messageId,
        permission.channel().message.read
      );
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

  /**
   * Pins a message in a channel. Records the pinning user and timestamp.
   * Requires message access with pin permission.
   *
   * @param input.messageId - The message to pin
   * @returns Transaction ID for the pin operation
   */
  pin: orgMemberProcedure
    .input(PinMessageInput)
    .output(PinMessageOutput)
    .handler(
      async ({
        context: {
          db,
          session: { user },
          permission,
        },
        input,
      }) => {
        await permission.requireMessageAccess(
          input.messageId,
          permission.channel().message.pin
        );
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
  /**
   * Unpins a previously pinned message, clearing the pin metadata.
   *
   * @param input.messageId - The message to unpin
   * @returns Transaction ID for the unpin operation
   */
  unPin: orgMemberProcedure
    .input(UnPinMessageInput)
    .output(UnPinMessageOutput)
    .handler(async ({ context: { db, permission }, input }) => {
      await permission.requireMessageAccess(
        input.messageId,
        permission.channel().message.pin
      );
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
  /**
   * Lists pinned messages for a channel with optional content search.
   * Only returns non-deleted messages, includes sender details.
   *
   * @param input.channelId - The channel to list pinned messages for
   * @param input.query - Optional search text to filter pinned messages by content
   * @returns Array of pinned message records with sender data
   */
  getPinnedMessages: orgMemberProcedure
    .input(GetPinnedMessagesInput)
    .output(GetPinnedMessagesOutput)
    .handler(async ({ context: { db, permission }, input }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.message.pin"
      );
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
  /**
   * Resolves user records for a list of user IDs, used for displaying
   * mention details in the UI.
   *
   * @param input.userIds - Array of user IDs to look up
   * @returns Array of user records
   */
  getMentionUsers: orgMemberProcedure
    .input(GetMenionUsersInput)
    .output(GetMenionUsersOutput)
    .handler(async ({ context: { db, permission }, input }) => {
      await permission.check(permission.org.read());
      const users = await db.query.user.findMany({
        where: inArray(userTable.id, input.userIds),
      });

      return users;
    }),
  /**
   * Marks a single mention as seen for the current user. Verifies the mention
   * exists, belongs to the user, and the message is not deleted before updating.
   *
   * @param input.mentionId - The mention record ID to mark as seen
   * @returns Transaction ID and success status
   * @throws NOT_FOUND if the mention does not exist or message was deleted
   */
  markMentionSeen: orgMemberProcedure
    .input(MarkMentionSeenInput)
    .output(MarkMentionSeenOutput)
    .handler(async ({ context: { db, session, permission }, input }) => {
      await permission.check(permission.channel().message.read());
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
  /**
   * Marks all unseen mentions for the current user in a channel as seen.
   * Only processes mentions on non-deleted messages.
   *
   * @param input.channelId - The channel to mark all mentions seen in
   * @returns Transaction ID, success status, and count of mentions updated
   */
  markAllMentionsSeen: orgMemberProcedure
    .input(MarkAllMentionsSeenInput)
    .output(MarkAllMentionsSeenOutput)
    .handler(async ({ context: { db, session, permission }, input }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.message.read"
      );
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
  /**
   * Adds an emoji reaction to a message. Uses conflict-safe insert to prevent
   * duplicate reactions from the same user with the same emoji.
   *
   * @param input.messageId - The message to react to
   * @param input.emoji - The emoji reaction string
   * @returns Transaction ID and success status
   * @throws NOT_FOUND if the message does not exist
   */
  addReaction: orgMemberProcedure
    .input(AddReactionInput)
    .output(AddReactionOutput)
    .handler(async ({ context: { db, session, permission }, input }) => {
      await permission.requireMessageAccess(
        input.messageId,
        permission.channel().message.react
      );
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

  /**
   * Removes a reaction from a message. Only the user who added the reaction
   * can remove it. Validates ownership before deletion.
   *
   * @param input.reactionId - The reaction record ID to remove
   * @returns Transaction ID and success status
   * @throws NOT_FOUND if the reaction does not exist or belongs to another user
   */
  removeReaction: orgMemberProcedure
    .input(RemoveReactionInput)
    .output(RemoveReactionOutput)
    .handler(async ({ context: { db, session, permission }, input }) => {
      const userId = session.user.id;

      const reaction = await db.query.messageReactionTable.findFirst({
        where: and(
          eq(messageReactionTable.id, input.reactionId),
          eq(messageReactionTable.userId, userId)
        ),
        columns: { messageId: true },
      });

      if (!reaction) {
        throw new ORPCError("NOT_FOUND", {
          message:
            "Reaction not found or you don't have permission to remove it.",
        });
      }

      await permission.requireMessageAccess(
        reaction.messageId,
        permission.channel().message.react
      );

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

  /**
   * Marks messages as read for the current user. Updates channel-level read tracking,
   * per-message read records (for channels under the member count threshold),
   * mention seen status, and notification status. Publishes to the read receipts
   * queue for real-time sync.
   *
   * @param input.channelId - The channel containing the messages
   * @param input.messageIds - Array of message IDs to mark as read
   * @returns Transaction ID and success status
   * @throws FORBIDDEN if the user is not a channel member
   */
  markAsRead: orgMemberProcedure
    .input(MarkMessagesAsReadInput)
    .output(MarkMessagesAsReadOutput)
    .handler(async ({ context: { db, session, permission }, input }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.message.read"
      );
      const userId = session.user.id;

      const { txid, memberCount } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        const memberCountResult = await tx
          .select({ count: count() })
          .from(channelMemberTable)
          .where(eq(channelMemberTable.channelId, input.channelId));

        const memberCount = Number(memberCountResult[0]?.count ?? 0);

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

        if (memberCount <= MAX_MEMBERS_FOR_DETAILED_TRACKING) {
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

        const messageIdsArray = messagesFromOthers.map((m) => m.id);

        if (messageIdsArray.length > 0) {
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

          await tx
            .update(notificationTable)
            .set({
              status: "read",
              readAt: new Date(),
            })
            .where(
              and(
                eq(notificationTable.userId, userId),
                eq(notificationTable.type, "channel_mention"),
                inArray(notificationTable.entityId, messageIdsArray),
                eq(notificationTable.status, "unread")
              )
            );
        }

        return { txid, memberCount };
      });

      try {
        Queue.publish("READ_RECEIPTS", {
          type: "process_channel",
          channelId: input.channelId,
          memberCount,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to publish to read receipts queue:", error);
      }

      return {
        txid,
        success: true,
      };
    }),

  /**
   * Retrieves all readers for a message. Uses per-message read tracking for
   * channels with fewer than MAX_MEMBERS_FOR_DETAILED_TRACKING members,
   * and falls back to channel-level read tracking for larger channels.
   *
   * @param input.messageId - The message to get readers for
   * @returns Array of reader records with id, name, email, image, and readAt
   * @throws FORBIDDEN if the user is not a member of the message's channel
   */
  getAllReaders: orgMemberProcedure
    .input(GetAllMessageReadersInput)
    .output(GetAllMessageReadersOutput)
    .handler(async ({ context: { db, session, permission }, input }) => {
      await permission.requireMessageAccess(
        input.messageId,
        "channel.message.reader.list"
      );
      const userId = session.user.id;

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
