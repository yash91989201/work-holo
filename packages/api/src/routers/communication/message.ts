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
  user as userTable,
} from "@work-holo/db/schema/index";
import {
  OpenSearchClient,
  Queue,
  type SearchIndexQueueMessage,
} from "@work-holo/infrastructure";
import { and, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
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
  GetMessageUnreadCountInput,
  GetPinnedMessagesInput,
  GetPinnedMessagesOutput,
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
import type { NotificationDomainEvent } from "../../services/notification/types";

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
    .handler(async ({ context, input }) => {
      const {
        db,
        orgId,
        session: { user },
        permission,
      } = context;

      await permission.requireChannelAccess(
        input.channelId,
        permission.channel().message.create
      );

      const {
        txid,
        message,
        mentionEvents,
        channelMessageEvents,
        replyEvents,
        directReplyEvent,
      } = await db.transaction(async (tx) => {
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
            ...(input.id ? { id: input.id } : {}),
            channelId: input.channelId,
            receiverId: input.receiverId,
            content: input.content,
            type: input.type,
            parentMessageId: input.parentMessageId,
            replyToMessageId: input.replyToMessageId,
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

        const messagePreview =
          input.content?.slice(0, 200) || "New message in channel";
        const mentionEvents: NotificationDomainEvent[] = [];

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

          mentionEvents.push(
            ...Array.from(new Set(input.mentions)).map((targetUserId) => ({
              type: "channel_mention" as const,
              actorId: user.id,
              orgId,
              targetUserId,
              entityId: newMessage.id,
              entityType: "message" as const,
              metadata: {
                channelId: input.channelId,
                channelName: channel.name,
                messagePreview,
                mentionedById: user.id,
                mentionedByName: user.name,
              },
            }))
          );
        }

        let replyEvents: NotificationDomainEvent[] = [];

        if (input.parentMessageId) {
          const parentMessage = await tx.query.messageTable.findFirst({
            where: eq(messageTable.id, input.parentMessageId),
            columns: {
              senderId: true,
            },
          });

          await tx
            .update(messageTable)
            .set({
              threadCount: sql`${messageTable.threadCount} + 1`,
            })
            .where(eq(messageTable.id, input.parentMessageId));

          if (parentMessage) {
            const threadParticipants = await tx
              .selectDistinct({ senderId: messageTable.senderId })
              .from(messageTable)
              .where(
                and(
                  eq(messageTable.parentMessageId, input.parentMessageId),
                  eq(messageTable.isDeleted, false)
                )
              );

            const participantIds = new Set(
              threadParticipants.map((p) => p.senderId)
            );
            participantIds.add(parentMessage.senderId);

            const threadId = input.parentMessageId;
            replyEvents = Array.from(participantIds).map((targetUserId) => ({
              type: "channel_reply" as const,
              actorId: user.id,
              orgId,
              targetUserId,
              entityId: newMessage.id,
              entityType: "message" as const,
              metadata: {
                channelId: input.channelId,
                channelName: channel.name,
                threadId,
                messagePreview,
                replySenderId: user.id,
                replySenderName: user.name,
              },
            }));
          }
        }

        let directReplyEvent: NotificationDomainEvent | null = null;

        if (input.replyToMessageId) {
          const originalMessage = await tx.query.messageTable.findFirst({
            where: eq(messageTable.id, input.replyToMessageId),
            columns: { senderId: true },
          });

          if (originalMessage && originalMessage.senderId !== user.id) {
            directReplyEvent = {
              type: "channel_direct_reply",
              actorId: user.id,
              orgId,
              targetUserId: originalMessage.senderId,
              entityId: newMessage.id,
              entityType: "message",
              metadata: {
                channelId: input.channelId,
                channelName: channel.name,
                messagePreview,
                replySenderId: user.id,
                replySenderName: user.name,
                originalMessageId: input.replyToMessageId,
              },
            };
          }
        }

        // Always query channel members first (needed for both notifications and memberCount)
        const channelMembers = await tx
          .select({ userId: channelMemberTable.userId })
          .from(channelMemberTable)
          .where(eq(channelMemberTable.channelId, input.channelId));

        let channelMessageEvents: NotificationDomainEvent[] = [];

        if (!input.parentMessageId) {
          channelMessageEvents = channelMembers.map(
            ({ userId: targetUserId }) => ({
              type: "channel_message",
              actorId: user.id,
              orgId,
              targetUserId,
              entityId: newMessage.id,
              entityType: "message",
              metadata: {
                channelId: input.channelId,
                channelName: channel.name,
                messagePreview,
                senderId: user.id,
                senderName: user.name,
              },
            })
          );
        }

        const readTimestamp = new Date();
        const memberCount = channelMembers.length;

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

        return {
          txid,
          message: newMessage,
          mentionEvents,
          channelMessageEvents,
          replyEvents,
          directReplyEvent,
        };
      });

      if (context.notification) {
        Promise.resolve().then(async () => {
          try {
            for (const event of mentionEvents) {
              await context.notification.emit(event);
            }

            if (channelMessageEvents.length > 0) {
              await context.notification.emitBulk(channelMessageEvents);
            }

            for (const event of replyEvents) {
              await context.notification.emit(event);
            }

            if (directReplyEvent) {
              await context.notification.emit(directReplyEvent);
            }
          } catch (error) {
            console.error("Error emitting notifications:", error);
          }
        });
      }

      // Publish to search indexing queue
      try {
        const searchPayload: SearchIndexQueueMessage = {
          action: "upsert",
          messageId: message.id,
          organizationId: orgId,
          scopeType: "channel",
          scopeId: input.channelId,
          contentHtml: message.content || undefined,
          senderId: user.id,
          senderName: user.name || undefined,
          messageType: message.type || undefined,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt?.toISOString() || undefined,
          parentMessageId: message.parentMessageId || undefined,
          hasAttachments:
            input.attachments && input.attachments.length > 0
              ? true
              : undefined,
          isPinned: message.isPinned || undefined,
          mentionedUserIds:
            input.mentions && input.mentions.length > 0
              ? input.mentions
              : undefined,
        };
        Queue.publish("SEARCH_INDEXING", searchPayload);
      } catch (error) {
        console.error("Failed to publish to search indexing queue:", error);
      }

      return { txid, message };
    }),

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
    .handler(async ({ context, input }) => {
      const {
        db,
        orgId,
        session: { user },
        permission,
      } = context;
      await permission.requireMessageAccess(
        input.messageId,
        permission.channel().message.update
      );
      const { txid, message, mentionEvents } = await db.transaction(
        async (tx) => {
          const txid = await generateTxId(tx);

          const [updatedMessage] = await tx
            .update(messageTable)
            .set({
              content: input.content,
              isEdited: true,
              editedAt: new Date(),
              ...(input.mentions === undefined
                ? {}
                : { mentions: input.mentions }),
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

          const mentionEvents: NotificationDomainEvent[] = [];

          if (input.mentions !== undefined) {
            const existingMentions = await tx
              .select({
                mentionedUserId: messageMentionTable.mentionedUserId,
              })
              .from(messageMentionTable)
              .where(eq(messageMentionTable.messageId, input.messageId));

            const existingMentionSet = new Set(
              existingMentions.map(({ mentionedUserId }) => mentionedUserId)
            );

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

              const newMentionUserIds = Array.from(
                new Set(input.mentions)
              ).filter((targetUserId) => !existingMentionSet.has(targetUserId));

              mentionEvents.push(
                ...newMentionUserIds.map((targetUserId) => ({
                  type: "channel_mention" as const,
                  actorId: user.id,
                  orgId,
                  targetUserId,
                  entityId: updatedMessage.id,
                  entityType: "message" as const,
                  metadata: {
                    channelId: updatedMessage.channelId,
                    channelName: channel.name,
                    messagePreview:
                      input.content?.slice(0, 200) ||
                      "You were mentioned in a message",
                    mentionedById: user.id,
                    mentionedByName: user.name,
                  },
                }))
              );
            }
          }

          return { txid, message: updatedMessage, mentionEvents };
        }
      );

      if (context.notification && mentionEvents.length > 0) {
        Promise.resolve().then(async () => {
          try {
            for (const event of mentionEvents) {
              await context.notification.emit(event);
            }
          } catch (error) {
            console.error("Error emitting mention notifications:", error);
          }
        });
      }

      // Publish to search indexing queue
      try {
        const searchPayload: SearchIndexQueueMessage = {
          action: "upsert",
          messageId: message.id,
          organizationId: orgId,
          scopeType: "channel",
          scopeId: message.channelId,
          contentHtml: message.content || undefined,
          senderId: message.senderId || undefined,
          senderName: user.name || undefined,
          messageType: message.type || undefined,
          updatedAt: message.updatedAt?.toISOString() || undefined,
          parentMessageId: message.parentMessageId || undefined,
          mentionedUserIds:
            input.mentions && input.mentions.length > 0
              ? input.mentions
              : undefined,
        };
        Queue.publish("SEARCH_INDEXING", searchPayload);
      } catch (error) {
        console.error("Failed to publish to search indexing queue:", error);
      }

      return {
        txid,
        message: {
          ...message,
          sender: user,
        },
      };
    }),

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
    .handler(async ({ input, context: { db, permission, orgId } }) => {
      await permission.requireMessageAccess(
        input.messageId,
        permission.channel().message.delete
      );

      const { txid, childMessageIds } = await db.transaction(async (tx) => {
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

        // Get child message IDs before deleting
        const childMessages = await tx
          .select({ id: messageTable.id })
          .from(messageTable)
          .where(eq(messageTable.parentMessageId, input.messageId));

        const childMessageIds = childMessages.map((msg) => msg.id);

        await tx
          .delete(messageTable)
          .where(eq(messageTable.id, input.messageId));

        await tx
          .delete(attachmentTable)
          .where(eq(attachmentTable.messageId, input.messageId));

        await tx
          .delete(messageTable)
          .where(eq(messageTable.parentMessageId, input.messageId));

        return { txid, childMessageIds };
      });

      // Publish to search indexing queue for deleted messages
      try {
        const deletePayload: SearchIndexQueueMessage = {
          action: "delete",
          messageId: input.messageId,
          organizationId: orgId,
          scopeType: "channel",
        };
        Queue.publish("SEARCH_INDEXING", deletePayload);

        for (const childMessageId of childMessageIds) {
          const childDeletePayload: SearchIndexQueueMessage = {
            action: "delete",
            messageId: childMessageId,
            organizationId: orgId,
            scopeType: "channel",
          };
          Queue.publish("SEARCH_INDEXING", childDeletePayload);
        }
      } catch (error) {
        console.error("Failed to publish to search indexing queue:", error);
      }

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
    .input(GetMessageUnreadCountInput)
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

  search: orgMemberProcedure
    .input(SearchMessagesInput)
    .output(SearchMessageOutput)
    .handler(async ({ input, context: { db, permission, orgId } }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.message.list"
      );

      const client = await OpenSearchClient.ensureConnected();

      const filters: Record<string, unknown>[] = [
        { term: { scopeType: "channel" } },
        { term: { scopeId: input.channelId } },
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

      if (input.senderId) {
        filters.push({ term: { senderId: input.senderId } });
      }

      if (input.hasAttachments) {
        filters.push({ term: { hasAttachments: true } });
      }

      if (input.fromDate || input.toDate) {
        const createdAt: Record<string, string> = {};

        if (input.fromDate) {
          createdAt.gte = input.fromDate.toISOString();
        }

        if (input.toDate) {
          createdAt.lte = input.toDate.toISOString();
        }

        filters.push({
          range: {
            createdAt,
          },
        });
      }

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
          size: input.limit,
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
          channelId: source.scopeId,
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
      if (hits.length > 0 && hits.length === input.limit) {
        const lastHit = hits.at(-1);
        if (!lastHit?.sort) {
          return {
            messages,
            nextCursor,
            total,
          };
        }
        nextCursor = Buffer.from(JSON.stringify(lastHit.sort)).toString(
          "base64"
        );
      }

      return {
        messages,
        nextCursor,
        total,
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
    .handler(async ({ context, input }) => {
      const { db, session, permission, notification, orgId } = context;
      await permission.requireMessageAccess(
        input.messageId,
        permission.channel().message.react
      );
      const userId = session.user.id;

      const { txid, messageSenderId, channelId, messagePreview } =
        await db.transaction(async (tx) => {
          const txid = await generateTxId(tx);

          const message = await tx.query.messageTable.findFirst({
            where: eq(messageTable.id, input.messageId),
            columns: {
              id: true,
              senderId: true,
              channelId: true,
              content: true,
            },
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

          return {
            txid,
            messageSenderId: message.senderId,
            channelId: message.channelId,
            messagePreview: message.content?.slice(0, 100) ?? "",
          };
        });

      // Emit channel_reaction notification (skip self-reactions)
      if (notification && userId !== messageSenderId) {
        const channel = await db.query.channelTable.findFirst({
          where: eq(channelTable.id, channelId),
          columns: { name: true },
        });

        Promise.resolve().then(async () => {
          try {
            await notification.emit({
              type: "channel_reaction",
              actorId: userId,
              targetUserId: messageSenderId,
              orgId,
              entityId: input.messageId,
              entityType: "reaction",
              metadata: {
                channelId,
                channelName: channel?.name ?? "",
                messagePreview,
                reactorId: userId,
                reactorName: session.user.name ?? "Someone",
                emoji: input.emoji,
              },
            });
          } catch (error) {
            console.error("Error emitting reaction notification:", error);
          }
        });
      }

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
