import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";
import { attachmentTypeEnum, messageTypeEnum } from "./channel";

export const dmConversationTable = pgTable(
  "dmConversation",
  {
    id: cuid2().defaultRandom().primaryKey(),
    organizationId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    participantOneId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    participantTwoId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lastMessageAt: timestamp({ withTimezone: true }),
    messageCount: integer().default(0).notNull(),
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_dm_conversation_participants").on(
      table.organizationId,
      table.participantOneId,
      table.participantTwoId
    ),
    index("idx_dm_conversation_org").on(table.organizationId),
    index("idx_dm_conversation_org_last_message_id").on(
      table.organizationId,
      table.lastMessageAt,
      table.id
    ),
    index("idx_dm_conversation_p1").on(table.participantOneId),
    index("idx_dm_conversation_p2").on(table.participantTwoId),
  ]
);

export const dmMessageTable = pgTable(
  "dmMessage",
  {
    id: cuid2().defaultRandom().primaryKey(),
    conversationId: cuid2()
      .notNull()
      .references(() => dmConversationTable.id, { onDelete: "cascade" }),
    senderId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text(),
    type: messageTypeEnum().notNull().default("text"),
    parentMessageId: cuid2(),
    replyToMessageId: cuid2(),
    threadCount: integer().default(0).notNull(),
    isEdited: boolean().default(false).notNull(),
    editedAt: timestamp({ withTimezone: true }),
    isDeleted: boolean().default(false).notNull(),
    deletedAt: timestamp({ withTimezone: true }),
    isPinned: boolean().default(false).notNull(),
    pinnedAt: timestamp({ withTimezone: true }),
    pinnedBy: text().references(() => user.id, { onDelete: "set null" }),
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
      name: "fk_dm_message_parent",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.replyToMessageId, table.conversationId],
      foreignColumns: [table.id, table.conversationId],
      name: "fk_dm_message_reply_to",
    }).onDelete("set null"),
    unique("unique_dm_message_id_conversation").on(
      table.id,
      table.conversationId
    ),
    index("idx_dm_message_conversation").on(table.conversationId),
    index("idx_dm_message_conversation_created_id").on(
      table.conversationId,
      table.createdAt,
      table.id
    ),
    index("idx_dm_message_sender").on(table.senderId),
    index("idx_dm_message_parent").on(table.parentMessageId),
    index("idx_dm_message_reply_to").on(table.replyToMessageId),
    index("idx_dm_message_is_deleted").on(table.isDeleted),
  ]
);

export const dmAttachmentTable = pgTable(
  "dmAttachment",
  {
    id: cuid2().defaultRandom().primaryKey(),
    messageId: cuid2()
      .notNull()
      .references(() => dmMessageTable.id, { onDelete: "cascade" }),
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
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("idx_dm_attachment_message").on(table.messageId)]
);

export const dmMessageReactionTable = pgTable(
  "dmMessageReaction",
  {
    id: cuid2().defaultRandom().primaryKey(),
    messageId: cuid2()
      .notNull()
      .references(() => dmMessageTable.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    emoji: text().notNull(),
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_dm_message_reaction").on(
      table.messageId,
      table.userId,
      table.emoji
    ),
    index("idx_dm_message_reaction_message").on(table.messageId),
    index("idx_dm_message_reaction_user").on(table.userId),
  ]
);

export const dmMessageReadTable = pgTable(
  "dmMessageRead",
  {
    id: cuid2().defaultRandom().primaryKey(),
    messageId: cuid2()
      .notNull()
      .references(() => dmMessageTable.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    readAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_dm_message_read").on(table.messageId, table.userId),
    index("idx_dm_message_read_message").on(table.messageId),
    index("idx_dm_message_read_user").on(table.userId),
  ]
);

export const dmConversationReadTable = pgTable(
  "dmConversationRead",
  {
    id: cuid2().defaultRandom().primaryKey(),
    conversationId: cuid2()
      .notNull()
      .references(() => dmConversationTable.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lastReadMessageId: cuid2().references(() => dmMessageTable.id, {
      onDelete: "set null",
    }),
    lastReadAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_dm_conversation_read").on(
      table.conversationId,
      table.userId
    ),
    index("idx_dm_conversation_read_conversation").on(table.conversationId),
    index("idx_dm_conversation_read_user").on(table.userId),
  ]
);

export const dmConversationMuteTable = pgTable(
  "dmConversationMute",
  {
    id: cuid2().defaultRandom().primaryKey(),
    conversationId: cuid2()
      .notNull()
      .references(() => dmConversationTable.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_dm_conversation_mute").on(
      table.conversationId,
      table.userId
    ),
    index("idx_dm_conversation_mute_conversation").on(table.conversationId),
    index("idx_dm_conversation_mute_user").on(table.userId),
  ]
);

export const dmConversationTableRelations = relations(
  dmConversationTable,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [dmConversationTable.organizationId],
      references: [organization.id],
    }),
    participantOne: one(user, {
      fields: [dmConversationTable.participantOneId],
      references: [user.id],
    }),
    participantTwo: one(user, {
      fields: [dmConversationTable.participantTwoId],
      references: [user.id],
    }),
    messages: many(dmMessageTable),
    reads: many(dmConversationReadTable),
    mutes: many(dmConversationMuteTable),
  })
);

export const dmMessageTableRelations = relations(
  dmMessageTable,
  ({ one, many }) => ({
    conversation: one(dmConversationTable, {
      fields: [dmMessageTable.conversationId],
      references: [dmConversationTable.id],
    }),
    sender: one(user, {
      fields: [dmMessageTable.senderId],
      references: [user.id],
    }),
    parentMessage: one(dmMessageTable, {
      fields: [dmMessageTable.parentMessageId],
      references: [dmMessageTable.id],
    }),
    replyToMessage: one(dmMessageTable, {
      fields: [dmMessageTable.replyToMessageId],
      references: [dmMessageTable.id],
    }),
    pinnedBy: one(user, {
      fields: [dmMessageTable.pinnedBy],
      references: [user.id],
    }),
    attachments: many(dmAttachmentTable),
    reactions: many(dmMessageReactionTable),
    reads: many(dmMessageReadTable),
  })
);

export const dmAttachmentTableRelations = relations(
  dmAttachmentTable,
  ({ one }) => ({
    message: one(dmMessageTable, {
      fields: [dmAttachmentTable.messageId],
      references: [dmMessageTable.id],
    }),
    uploadedBy: one(user, {
      fields: [dmAttachmentTable.uploadedBy],
      references: [user.id],
    }),
  })
);

export const dmMessageReactionTableRelations = relations(
  dmMessageReactionTable,
  ({ one }) => ({
    message: one(dmMessageTable, {
      fields: [dmMessageReactionTable.messageId],
      references: [dmMessageTable.id],
    }),
    user: one(user, {
      fields: [dmMessageReactionTable.userId],
      references: [user.id],
    }),
  })
);

export const dmMessageReadTableRelations = relations(
  dmMessageReadTable,
  ({ one }) => ({
    message: one(dmMessageTable, {
      fields: [dmMessageReadTable.messageId],
      references: [dmMessageTable.id],
    }),
    user: one(user, {
      fields: [dmMessageReadTable.userId],
      references: [user.id],
    }),
  })
);

export const dmConversationReadTableRelations = relations(
  dmConversationReadTable,
  ({ one }) => ({
    conversation: one(dmConversationTable, {
      fields: [dmConversationReadTable.conversationId],
      references: [dmConversationTable.id],
    }),
    user: one(user, {
      fields: [dmConversationReadTable.userId],
      references: [user.id],
    }),
    lastReadMessage: one(dmMessageTable, {
      fields: [dmConversationReadTable.lastReadMessageId],
      references: [dmMessageTable.id],
    }),
  })
);

export const dmConversationMuteTableRelations = relations(
  dmConversationMuteTable,
  ({ one }) => ({
    conversation: one(dmConversationTable, {
      fields: [dmConversationMuteTable.conversationId],
      references: [dmConversationTable.id],
    }),
    user: one(user, {
      fields: [dmConversationMuteTable.userId],
      references: [user.id],
    }),
  })
);
