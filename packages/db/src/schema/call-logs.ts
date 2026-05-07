import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization, user } from "./auth";
import { agentExtensions, didInventory } from "./dialer";

export const callLogs = pgTable(
  "callLogs",
  {
    id: cuid2().defaultRandom().primaryKey(),
    freeswitchCallId: text("freeswitchCallId").notNull().unique(),
    organizationId: text("organizationId").references(() => organization.id, {
      onDelete: "set null",
    }),
    agentUserId: text("agentUserId").references(() => user.id, {
      onDelete: "set null",
    }),
    extensionId: text("extensionId").references(() => agentExtensions.id, {
      onDelete: "set null",
    }),
    didId: text("didId").references(() => didInventory.id, {
      onDelete: "set null",
    }),
    direction: text("direction").notNull(), // "inbound" | "outbound"
    fromNumber: text("fromNumber").notNull(),
    toNumber: text("toNumber").notNull(),
    status: text("status").notNull(), // "answered" | "missed" | "failed" | "busy" | "no_answer"
    hangupCause: text("hangupCause"),
    startedAt: timestamp("startedAt").notNull(),
    answeredAt: timestamp("answeredAt"),
    endedAt: timestamp("endedAt"),
    durationSeconds: integer("durationSeconds").default(0).notNull(),
    billableSeconds: integer("billableSeconds").default(0).notNull(),
    recordingUrl: text("recordingUrl"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("callLogs_organizationId_idx").on(table.organizationId),
    index("callLogs_agentUserId_idx").on(table.agentUserId),
    index("callLogs_startedAt_idx").on(table.startedAt),
    index("callLogs_direction_idx").on(table.direction),
    index("callLogs_status_idx").on(table.status),
  ]
);

export const callLogsRelations = relations(callLogs, ({ one }) => ({
  organization: one(organization, {
    fields: [callLogs.organizationId],
    references: [organization.id],
  }),
  agentUser: one(user, {
    fields: [callLogs.agentUserId],
    references: [user.id],
  }),
  extension: one(agentExtensions, {
    fields: [callLogs.extensionId],
    references: [agentExtensions.id],
  }),
  did: one(didInventory, {
    fields: [callLogs.didId],
    references: [didInventory.id],
  }),
}));
