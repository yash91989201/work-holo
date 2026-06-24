import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";

export const callTypeEnum = pgEnum("callType", ["voice", "video"]);

export const callStatusEnum = pgEnum("callStatus", [
  "ringing",
  "active",
  "missed",
  "rejected",
  "cancelled",
  "ended",
]);

export const callSourceTypeEnum = pgEnum("callSourceType", ["dm", "channel"]);

export const callParticipantRoleEnum = pgEnum("callParticipantRole", [
  "host",
  "participant",
]);

export const callTable = pgTable(
  "call",
  {
    id: cuid2().defaultRandom().primaryKey(),
    orgId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    type: callTypeEnum().notNull(),
    status: callStatusEnum().notNull().default("ringing"),
    initiatorId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    sourceConversationId: text(),
    sourceType: callSourceTypeEnum(),
    livekitRoomName: text().notNull().unique(),
    startedAt: timestamp({ withTimezone: true }),
    endedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("idx_call_org").on(table.orgId),
    index("idx_call_initiator").on(table.initiatorId),
    index("idx_call_status").on(table.status),
    index("idx_call_org_created").on(table.orgId, table.createdAt),
  ]
);

export const callParticipantTable = pgTable(
  "callParticipant",
  {
    id: cuid2().defaultRandom().primaryKey(),
    callId: cuid2()
      .notNull()
      .references(() => callTable.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: callParticipantRoleEnum().notNull().default("participant"),
    joinedAt: timestamp({ withTimezone: true }),
    leftAt: timestamp({ withTimezone: true }),
    isRemoved: boolean().default(false).notNull(),
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("idx_call_participant_call").on(table.callId),
    index("idx_call_participant_user").on(table.userId),
    uniqueIndex("unique_call_participant_call_user").on(
      table.callId,
      table.userId
    ),
  ]
);

export const callTableRelations = relations(callTable, ({ one, many }) => ({
  org: one(organization, {
    fields: [callTable.orgId],
    references: [organization.id],
  }),
  initiator: one(user, {
    fields: [callTable.initiatorId],
    references: [user.id],
  }),
  participants: many(callParticipantTable),
}));

export const callParticipantTableRelations = relations(
  callParticipantTable,
  ({ one }) => ({
    call: one(callTable, {
      fields: [callParticipantTable.callId],
      references: [callTable.id],
    }),
    user: one(user, {
      fields: [callParticipantTable.userId],
      references: [user.id],
    }),
  })
);
