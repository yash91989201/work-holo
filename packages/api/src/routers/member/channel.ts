import { ORPCError } from "@orpc/client";
import {
	channelMemberTable,
	channelReadTable,
	channelTable,
	messageTable,
} from "@work-holo/db/schema/index";
import {
	and,
	count,
	desc,
	eq,
	getTableColumns,
	gt,
	inArray,
} from "drizzle-orm";
import { protectedProcedure } from "../../index";
import {
	GetChannelUnreadCountsInput,
	GetChannelUnreadCountsOutput,
} from "../../lib/schemas/channel";

export const memberChannelRouter = {
	listChannels: protectedProcedure.handler(
		async ({ context: { db, session } }) => {
			const organizationId = session.session.activeOrganizationId;

			if (!organizationId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "No active organization",
				});
			}

			const userId = session.user.id;

			const channels = await db
				.select({ ...getTableColumns(channelTable) })
				.from(channelTable)
				.innerJoin(
					channelMemberTable,
					eq(channelMemberTable.channelId, channelTable.id)
				)
				.where(
					and(
						eq(channelMemberTable.userId, userId),
						eq(channelTable.organizationId, organizationId)
					)
				);

			return { channels };
		}
	),
	recentChannels: protectedProcedure.handler(
		async ({ context: { db, session } }) => {
			const recentMessages = await db.query.messageTable.findMany({
				where: eq(messageTable.senderId, session.user.id),
				orderBy: [desc(messageTable.createdAt)],
				limit: 5,
				columns: {
					channelId: true,
				},
			});

			if (recentMessages.length === 0) {
				return [];
			}

			const recentChannelIds = recentMessages.map(
				(message) => message.channelId
			);

			const recentChannels = await db.query.channelTable.findMany({
				where: inArray(channelTable.id, recentChannelIds),
				with: {
					creator: true,
					members: true,
				},
			});

			return recentChannels;
		}
	),
	getChannelUnreadCounts: protectedProcedure
		.input(GetChannelUnreadCountsInput)
		.output(GetChannelUnreadCountsOutput)
		.handler(async ({ context: { db, session } }) => {
			const userId = session.user.id;
			const organizationId = session.session.activeOrganizationId;

			if (!organizationId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "No active organization",
				});
			}

			// Get all channels user is a member of
			const userChannels = await db
				.select({ channelId: channelMemberTable.channelId })
				.from(channelMemberTable)
				.innerJoin(
					channelTable,
					eq(channelMemberTable.channelId, channelTable.id)
				)
				.where(
					and(
						eq(channelMemberTable.userId, userId),
						eq(channelTable.organizationId, organizationId),
						eq(channelTable.isArchived, false)
					)
				);

			const channelIds = userChannels.map((c) => c.channelId);

			if (channelIds.length === 0) {
				return [];
			}

			// Get channel read records for this user
			const channelReads = await db
				.select({
					channelId: channelReadTable.channelId,
					lastReadMessageId: channelReadTable.lastReadMessageId,
				})
				.from(channelReadTable)
				.where(
					and(
						eq(channelReadTable.userId, userId),
						inArray(channelReadTable.channelId, channelIds)
					)
				);

			// Create a map of channelId -> lastReadMessageId
			const lastReadMap = new Map(
				channelReads.map((cr) => [cr.channelId, cr.lastReadMessageId])
			);

			// Calculate unread count for each channel
			const unreadCounts = await Promise.all(
				channelIds.map(async (channelId) => {
					const lastReadMessageId = lastReadMap.get(channelId);

					if (!lastReadMessageId) {
						// No read record, count all messages
						const result = await db
							.select({ count: count() })
							.from(messageTable)
							.where(eq(messageTable.channelId, channelId));

						return {
							channelId,
							unreadCount: Number(result[0]?.count || 0),
						};
					}

					// Get the timestamp of the last read message
					const lastReadMessage = await db
						.select({ createdAt: messageTable.createdAt })
						.from(messageTable)
						.where(eq(messageTable.id, lastReadMessageId))
						.limit(1);

					if (!lastReadMessage[0]) {
						// Last read message not found, count all messages
						const result = await db
							.select({ count: count() })
							.from(messageTable)
							.where(eq(messageTable.channelId, channelId));

						return {
							channelId,
							unreadCount: Number(result[0]?.count || 0),
						};
					}

					// Count messages after the last read timestamp
					const result = await db
						.select({ count: count() })
						.from(messageTable)
						.where(
							and(
								eq(messageTable.channelId, channelId),
								gt(messageTable.createdAt, lastReadMessage[0].createdAt)
							)
						);

					return {
						channelId,
						unreadCount: Number(result[0]?.count || 0),
					};
				})
			);

			return unreadCounts;
		}),
};
