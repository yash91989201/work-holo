import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import {
	boolean,
	foreignKey,
	index,
	integer,
	json,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { organization, team, user } from "./auth";

export const channelTypeEnum = pgEnum("channelType", [
	"team",
	"group",
	"direct",
]);

export const messageTypeEnum = pgEnum("messageType", [
	"text",
	"attachment",
	"audio",
]);

export const notificationTypeEnum = pgEnum("notificationType", [
	"message",
	"mention",
	"channel_invite",
	"direct_message",
]);

export const notificationStatusEnum = pgEnum("notificationStatus", [
	"unread",
	"read",
	"dismissed",
]);

export const attachmentTypeEnum = pgEnum("attachmentType", [
	"image",
	"document",
	"video",
	"audio",
	"archive",
]);

export const joinRequestStatusEnum = pgEnum("joinRequestStatus", [
	"pending",
	"approved",
	"rejected",
]);

export const channelTable = pgTable("channel", {
	id: cuid2().defaultRandom().primaryKey(),
	name: text().notNull(),
	description: text(),
	type: channelTypeEnum().notNull().default("team"),
	organizationId: text()
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	teamId: text().references(() => team.id, { onDelete: "cascade" }),
	createdBy: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	isPrivate: boolean().default(false).notNull(),
	isArchived: boolean().default(false).notNull(),
	lastMessageAt: timestamp({ withTimezone: true }),
	messageCount: integer().default(0).notNull(),
	createdAt: timestamp({ withTimezone: true })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp({ withTimezone: true })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull(),
});

export const channelMemberTable = pgTable(
	"channelMember",
	{
		id: cuid2().defaultRandom().primaryKey(),
		channelId: text()
			.notNull()
			.references(() => channelTable.id, { onDelete: "cascade" }),
		userId: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: text().default("member").notNull(),
		joinedAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.notNull(),
		lastReadAt: timestamp({ withTimezone: true }),
		isMuted: boolean().default(false).notNull(),
	},
	(table) => [
		uniqueIndex("unique_channel_user").on(table.channelId, table.userId),
	]
);

export const channelJoinRequestTable = pgTable("channelJoinRequest", {
	id: cuid2().defaultRandom().primaryKey(),
	channelId: text()
		.notNull()
		.references(() => channelTable.id, { onDelete: "cascade" }),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	status: joinRequestStatusEnum().notNull().default("pending"),
	note: text(),
	requestedAt: timestamp({ withTimezone: true })
		.$defaultFn(() => new Date())
		.notNull(),
	reviewedBy: text().references(() => user.id, {
		onDelete: "set null",
	}),
	reviewedAt: timestamp({ withTimezone: true }),
	createdAt: timestamp({ withTimezone: true })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp({ withTimezone: true })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull(),
});

export const messageTable = pgTable(
	"message",
	{
		id: cuid2().defaultRandom().primaryKey(),
		channelId: text()
			.references(() => channelTable.id, {
				onDelete: "cascade",
			})
			.notNull(),
		senderId: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		receiverId: text().references(() => user.id, {
			onDelete: "cascade",
		}),
		content: text(),
		type: messageTypeEnum().notNull().default("text"),
		parentMessageId: text(),
		threadCount: integer().default(0).notNull(),
		isEdited: boolean().default(false).notNull(),
		editedAt: timestamp({ withTimezone: true }),
		isDeleted: boolean().default(false).notNull(),
		isPinned: boolean().default(false).notNull(),
		pinnedAt: timestamp({ withTimezone: true }),
		pinnedBy: text().references(() => user.id, {
			onDelete: "set null",
		}),
		deletedAt: timestamp({ withTimezone: true }),
		createdAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.parentMessageId],
			foreignColumns: [table.id],
			name: "fk_message_parent",
		}).onDelete("cascade"),
		index("idx_message_parent_message_id").on(table.parentMessageId),
		index("idx_message_is_deleted").on(table.isDeleted),
		index("idx_message_channel_id").on(table.channelId),
		index("idx_message_channel_deleted").on(table.channelId, table.isDeleted),
		index("idx_message_parent_deleted").on(
			table.parentMessageId,
			table.isDeleted
		),
	]
);

export const messageMentionTable = pgTable(
	"messageMention",
	{
		id: cuid2().defaultRandom().primaryKey(),
		messageId: text()
			.notNull()
			.references(() => messageTable.id, { onDelete: "cascade" }),
		mentionedById: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		mentionedUserId: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		isSeen: boolean().notNull().default(false),
		createdAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => [
		uniqueIndex("unique_message_mention_user").on(
			table.messageId,
			table.mentionedUserId
		),
		index("idx_message_mention_user").on(table.mentionedUserId),
		index("idx_message_mention_message").on(table.messageId),
	]
);

export const attachmentTable = pgTable("attachment", {
	id: cuid2().defaultRandom().primaryKey(),
	messageId: text()
		.notNull()
		.references(() => messageTable.id, { onDelete: "cascade" }),
	fileName: text().notNull(),
	originalName: text().notNull(),
	fileSize: integer().notNull(),
	mimeType: text().notNull(),
	type: attachmentTypeEnum().notNull(),
	url: text(),
	thumbnailUrl: text(),
	uploadedBy: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	isPublic: boolean().default(false).notNull(),
	createdAt: timestamp({ withTimezone: true })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp({ withTimezone: true })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull(),
});

export const notificationTable = pgTable("notification", {
	id: cuid2().defaultRandom().primaryKey(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	type: notificationTypeEnum().notNull(),
	status: notificationStatusEnum().notNull().default("unread"),
	title: text().notNull(),
	message: text(),
	entityId: text(),
	entityType: text(),
	actionUrl: text(),
	metadata: json(),
	readAt: timestamp({ withTimezone: true }),
	dismissedAt: timestamp({ withTimezone: true }),
	createdAt: timestamp({ withTimezone: true })
		.$defaultFn(() => new Date())
		.notNull(),
});

export const pushSubscriptionTable = pgTable(
	"pushSubscription",
	{
		id: cuid2().defaultRandom().primaryKey(),
		userId: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		endpoint: text().notNull(),
		p256dh: text().notNull(),
		auth: text().notNull(),
		userAgent: text(),
		createdAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => [
		uniqueIndex("unique_user_endpoint").on(table.userId, table.endpoint),
		index("idx_push_subscription_user").on(table.userId),
	]
);

export const messageReadTable = pgTable(
	"messageRead",
	{
		id: cuid2().defaultRandom().primaryKey(),
		messageId: text()
			.notNull()
			.references(() => messageTable.id, { onDelete: "cascade" }),
		userId: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		readAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => [
		index("idx_message_read_message_user").on(table.messageId, table.userId),
		uniqueIndex("unique_message_read_message_user").on(
			table.messageId,
			table.userId
		),
	]
);

export const channelReadTable = pgTable(
	"channelRead",
	{
		channelId: text()
			.notNull()
			.references(() => channelTable.id, { onDelete: "cascade" }),
		userId: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		lastReadMessageId: text().references(() => messageTable.id, {
			onDelete: "set null",
		}),
		lastReadAt: timestamp({ withTimezone: true }),
	},
	(table) => [
		index("idx_channel_read_user").on(table.userId),
		index("idx_channel_read_channel").on(table.channelId),
		primaryKey({ columns: [table.userId, table.channelId] }),
	]
);

export const messageReadSummaryTable = pgTable(
	"messageReadSummary",
	{
		id: cuid2().defaultRandom().primaryKey(),
		messageId: text()
			.notNull()
			.references(() => messageTable.id, { onDelete: "cascade" })
			.unique(),
		readCount: integer().default(0).notNull(),
		lastReadAt: timestamp({ withTimezone: true }),
		recentReaders: json().$type<string[]>().default([]).notNull(),
		createdAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("idx_message_read_summary_message").on(table.messageId),
		index("idx_message_read_summary_last_read").on(table.lastReadAt),
	]
);

export const channelReadProcessedWatermarkTable = pgTable(
	"channelReadProcessedWatermark",
	{
		id: cuid2().defaultRandom().primaryKey(),
		channelId: text()
			.notNull()
			.references(() => channelTable.id, { onDelete: "cascade" })
			.unique(),
		lastProcessedAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("idx_channel_read_watermark_channel").on(table.channelId)]
);

export const messageReactionTable = pgTable(
	"messageReaction",
	{
		id: cuid2().defaultRandom().primaryKey(),
		messageId: text()
			.notNull()
			.references(() => messageTable.id, { onDelete: "cascade" }),
		userId: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		reaction: text().notNull(),
		createdAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => [
		uniqueIndex("unique_message_reaction_user").on(
			table.messageId,
			table.userId,
			table.reaction
		),
		index("idx_message_reaction_message").on(table.messageId),
		index("idx_message_reaction_user").on(table.userId),
	]
);

export const messageTableRelations = relations(
	messageTable,
	({ one, many }) => ({
		// Relations to other tables (foreign keys in messageTable)
		channel: one(channelTable, {
			fields: [messageTable.channelId],
			references: [channelTable.id],
		}),
		sender: one(user, {
			fields: [messageTable.senderId],
			references: [user.id],
		}),
		receiver: one(user, {
			fields: [messageTable.receiverId],
			references: [user.id],
		}),
		parentMessage: one(messageTable, {
			fields: [messageTable.parentMessageId],
			references: [messageTable.id],
		}),
		pinnedBy: one(user, {
			fields: [messageTable.pinnedBy],
			references: [user.id],
		}),
		// Inverse relations (other tables reference messageTable)
		attachments: many(attachmentTable),
		reads: many(messageReadTable),
		mentions: many(messageMentionTable),
		reactions: many(messageReactionTable),
	})
);

// Channel relations
export const channelTableRelations = relations(
	channelTable,
	({ one, many }) => ({
		organization: one(organization, {
			fields: [channelTable.organizationId],
			references: [organization.id],
		}),
		team: one(team, {
			fields: [channelTable.teamId],
			references: [team.id],
		}),
		creator: one(user, {
			fields: [channelTable.createdBy],
			references: [user.id],
		}),
		members: many(channelMemberTable),
		messages: many(messageTable),
		joinRequests: many(channelJoinRequestTable),
	})
);

// Channel member relations
export const channelMemberTableRelations = relations(
	channelMemberTable,
	({ one }) => ({
		channel: one(channelTable, {
			fields: [channelMemberTable.channelId],
			references: [channelTable.id],
		}),
		user: one(user, {
			fields: [channelMemberTable.userId],
			references: [user.id],
		}),
	})
);

// Channel join request relations
export const channelJoinRequestTableRelations = relations(
	channelJoinRequestTable,
	({ one }) => ({
		channel: one(channelTable, {
			fields: [channelJoinRequestTable.channelId],
			references: [channelTable.id],
		}),
		user: one(user, {
			fields: [channelJoinRequestTable.userId],
			references: [user.id],
		}),
		reviewedBy: one(user, {
			fields: [channelJoinRequestTable.reviewedBy],
			references: [user.id],
		}),
	})
);

// Attachment relations
export const attachmentTableRelations = relations(
	attachmentTable,
	({ one }) => ({
		message: one(messageTable, {
			fields: [attachmentTable.messageId],
			references: [messageTable.id],
		}),
		uploadedBy: one(user, {
			fields: [attachmentTable.uploadedBy],
			references: [user.id],
		}),
	})
);

// Notification relations
export const notificationTableRelations = relations(
	notificationTable,
	({ one }) => ({
		user: one(user, {
			fields: [notificationTable.userId],
			references: [user.id],
		}),
	})
);

// Message read relations
export const messageReadTableRelations = relations(
	messageReadTable,
	({ one }) => ({
		message: one(messageTable, {
			fields: [messageReadTable.messageId],
			references: [messageTable.id],
		}),
		user: one(user, {
			fields: [messageReadTable.userId],
			references: [user.id],
		}),
	})
);

export const messageMentionTableRelations = relations(
	messageMentionTable,
	({ one }) => ({
		message: one(messageTable, {
			fields: [messageMentionTable.messageId],
			references: [messageTable.id],
		}),
		mentionedBy: one(user, {
			fields: [messageMentionTable.mentionedById],
			references: [user.id],
		}),
		mentionedUser: one(user, {
			fields: [messageMentionTable.mentionedUserId],
			references: [user.id],
		}),
	})
);

export const messageReactionTableRelations = relations(
	messageReactionTable,
	({ one }) => ({
		message: one(messageTable, {
			fields: [messageReactionTable.messageId],
			references: [messageTable.id],
		}),
		user: one(user, {
			fields: [messageReactionTable.userId],
			references: [user.id],
		}),
	})
);

// Push subscription relations
export const pushSubscriptionTableRelations = relations(
	pushSubscriptionTable,
	({ one }) => ({
		user: one(user, {
			fields: [pushSubscriptionTable.userId],
			references: [user.id],
		}),
	})
);

// Channel read relations
export const channelReadTableRelations = relations(
	channelReadTable,
	({ one }) => ({
		channel: one(channelTable, {
			fields: [channelReadTable.channelId],
			references: [channelTable.id],
		}),
		user: one(user, {
			fields: [channelReadTable.userId],
			references: [user.id],
		}),
		lastReadMessage: one(messageTable, {
			fields: [channelReadTable.lastReadMessageId],
			references: [messageTable.id],
		}),
	})
);

// Message read summary relations
export const messageReadSummaryTableRelations = relations(
	messageReadSummaryTable,
	({ one }) => ({
		message: one(messageTable, {
			fields: [messageReadSummaryTable.messageId],
			references: [messageTable.id],
		}),
	})
);

// Channel read processed watermark relations
export const channelReadProcessedWatermarkTableRelations = relations(
	channelReadProcessedWatermarkTable,
	({ one }) => ({
		channel: one(channelTable, {
			fields: [channelReadProcessedWatermarkTable.channelId],
			references: [channelTable.id],
		}),
	})
);
