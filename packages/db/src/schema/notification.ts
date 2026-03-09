import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";

export const notificationTypeEnum = pgEnum("notificationType", [
  "channel_message",
  "channel_reply",
  "channel_direct_reply",
  "channel_reaction",
  "channel_mention",
  "dm_message",
  "dm_reply",
  "dm_direct_reply",
  "dm_reaction",
]);

export const notificationStatusEnum = pgEnum("notificationStatus", [
  "unread",
  "read",
  "dismissed",
]);

export const notificationTable = pgTable("notification", {
  id: cuid2().defaultRandom().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  actorId: text().references(() => user.id, { onDelete: "set null" }),
  orgId: text().references(() => organization.id, { onDelete: "cascade" }),
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

export const notificationPreferenceTable = pgTable(
  "notificationPreference",
  {
    id: cuid2().defaultRandom().primaryKey(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    orgId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    eventType: notificationTypeEnum().notNull(),
    deliveryChannel: text().notNull(),
    enabled: boolean().notNull().default(true),
    entityType: text(),
    entityId: text(),
    emailDigestInterval: text(),
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_notification_preference").on(
      table.userId,
      table.orgId,
      table.eventType,
      table.deliveryChannel,
      table.entityType,
      table.entityId
    ),
    index("idx_notification_preference_user_org").on(table.userId, table.orgId),
  ]
);

export const notificationSoundPresetTable = pgTable("notificationSoundPreset", {
  id: cuid2().defaultRandom().primaryKey(),
  name: text().notNull(),
  filename: text().notNull(),
  category: text().notNull(),
  sortOrder: integer().notNull(),
  createdAt: timestamp({ withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const notificationSoundPreferenceTable = pgTable(
  "notificationSoundPreference",
  {
    id: cuid2().defaultRandom().primaryKey(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    orgId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    scope: text().notNull(),
    entityId: text(),
    soundType: text().notNull(),
    presetId: text().references(() => notificationSoundPresetTable.id, {
      onDelete: "set null",
    }),
    customSoundUrl: text(),
    customSoundName: text(),
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_notification_sound_preference").on(
      table.userId,
      table.orgId,
      table.scope,
      table.entityId
    ),
    index("idx_notification_sound_preference_user_org").on(
      table.userId,
      table.orgId
    ),
  ]
);

export const pendingEmailDigestTable = pgTable(
  "pendingEmailDigest",
  {
    id: cuid2().defaultRandom().primaryKey(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    orgId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    notificationId: text()
      .notNull()
      .references(() => notificationTable.id, { onDelete: "cascade" }),
    scheduledAt: timestamp({ withTimezone: true }).notNull(),
    sent: boolean().notNull().default(false),
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("idx_pending_email_digest_scheduled").on(
      table.scheduledAt,
      table.sent
    ),
    index("idx_pending_email_digest_user_org").on(table.userId, table.orgId),
  ]
);

// Notification relations
export const notificationTableRelations = relations(
  notificationTable,
  ({ one }) => ({
    user: one(user, {
      fields: [notificationTable.userId],
      references: [user.id],
      relationName: "notificationUser",
    }),
    actor: one(user, {
      fields: [notificationTable.actorId],
      references: [user.id],
      relationName: "notificationActor",
    }),
    organization: one(organization, {
      fields: [notificationTable.orgId],
      references: [organization.id],
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

export const notificationPreferenceTableRelations = relations(
  notificationPreferenceTable,
  ({ one }) => ({
    user: one(user, {
      fields: [notificationPreferenceTable.userId],
      references: [user.id],
    }),
    organization: one(organization, {
      fields: [notificationPreferenceTable.orgId],
      references: [organization.id],
    }),
  })
);

export const notificationSoundPreferenceTableRelations = relations(
  notificationSoundPreferenceTable,
  ({ one }) => ({
    user: one(user, {
      fields: [notificationSoundPreferenceTable.userId],
      references: [user.id],
    }),
    organization: one(organization, {
      fields: [notificationSoundPreferenceTable.orgId],
      references: [organization.id],
    }),
    preset: one(notificationSoundPresetTable, {
      fields: [notificationSoundPreferenceTable.presetId],
      references: [notificationSoundPresetTable.id],
    }),
  })
);

export const pendingEmailDigestTableRelations = relations(
  pendingEmailDigestTable,
  ({ one }) => ({
    user: one(user, {
      fields: [pendingEmailDigestTable.userId],
      references: [user.id],
    }),
    organization: one(organization, {
      fields: [pendingEmailDigestTable.orgId],
      references: [organization.id],
    }),
    notification: one(notificationTable, {
      fields: [pendingEmailDigestTable.notificationId],
      references: [notificationTable.id],
    }),
  })
);
