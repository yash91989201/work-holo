import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

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
