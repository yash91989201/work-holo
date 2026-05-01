import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";

// ─── SIP Trunks ──────────────────────────────────────────────────────────────

export const sipTrunks = pgTable(
  "sipTrunks",
  {
    id: cuid2().defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    provider: text("provider").notNull(), // "cloudbharat" | "telnyx" | "twilio" | "custom"
    username: text("username").notNull(),
    password: text("password").notNull(),
    proxy: text("proxy").notNull(), // e.g. "siptrunk.cloudbharat.in"
    fromDomain: text("fromDomain"),
    fromUser: text("fromUser"),
    register: boolean("register").default(true).notNull(),
    expireSeconds: integer("expireSeconds").default(60).notNull(),
    pingInterval: integer("pingInterval").default(25).notNull(),
    transport: text("transport").default("udp").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    deploymentStatus: text("deploymentStatus").default("pending").notNull(), // "pending" | "deployed" | "failed" | "undeployed"
    deployedAt: timestamp("deployedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdBy: text("createdBy")
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    index("sipTrunks_provider_idx").on(table.provider),
    index("sipTrunks_isActive_idx").on(table.isActive),
  ]
);

// ─── DID Inventory ────────────────────────────────────────────────────────────

export const didInventory = pgTable(
  "didInventory",
  {
    id: cuid2().defaultRandom().primaryKey(),
    number: text("number").notNull().unique(), // E.164, e.g. "+914226628808"
    friendlyName: text("friendlyName"),
    sipTrunkId: text("sipTrunkId")
      .notNull()
      .references(() => sipTrunks.id),
    organizationId: text("organizationId").references(() => organization.id), // null = unassigned
    status: text("status").default("available").notNull(), // "available" | "assigned" | "retired" | "blocked"
    destinationType: text("destinationType"), // "agent" | "queue" | "hangup"
    destinationTarget: text("destinationTarget"), // agent extension or queue id
    recordingEnabled: boolean("recordingEnabled").default(true).notNull(),
    stickyAgentEnabled: boolean("stickyAgentEnabled").default(false).notNull(),
    isActive: boolean("isActive").default(false).notNull(),
    deploymentStatus: text("deploymentStatus").default("undeployed").notNull(), // "pending" | "deployed" | "failed" | "undeployed"
    deployedAt: timestamp("deployedAt"),
    assignedAt: timestamp("assignedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdBy: text("createdBy")
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    index("didInventory_sipTrunkId_idx").on(table.sipTrunkId),
    index("didInventory_organizationId_idx").on(table.organizationId),
    index("didInventory_status_idx").on(table.status),
  ]
);

// ─── Agent Extensions ─────────────────────────────────────────────────────────

export const agentExtensions = pgTable(
  "agentExtensions",
  {
    id: cuid2().defaultRandom().primaryKey(),
    extension: text("extension").notNull().unique(), // e.g. "1001"
    password: text("password").notNull(),
    callerIdName: text("callerIdName").notNull(),
    callerIdNumber: text("callerIdNumber").notNull(), // DID number used as outbound caller ID
    organizationId: text("organizationId").references(() => organization.id),
    userId: text("userId").references(() => user.id), // link to Work Holo user
    context: text("context").default("default").notNull(),
    tollAllow: text("tollAllow")
      .default("domestic,international,local")
      .notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    deploymentStatus: text("deploymentStatus").default("pending").notNull(), // "pending" | "deployed" | "failed" | "undeployed"
    deployedAt: timestamp("deployedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdBy: text("createdBy")
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    index("agentExtensions_organizationId_idx").on(table.organizationId),
    index("agentExtensions_userId_idx").on(table.userId),
  ]
);

// ─── Dialer Audit Log ─────────────────────────────────────────────────────────

export const dialerAuditLog = pgTable(
  "dialerAuditLog",
  {
    id: cuid2().defaultRandom().primaryKey(),
    entityType: text("entityType").notNull(), // "sip_trunk" | "did" | "agent_extension"
    entityId: text("entityId").notNull(),
    action: text("action").notNull(), // "created" | "updated" | "deleted" | "deployed" | "assigned"
    changes: text("changes"), // JSON diff
    performedBy: text("performedBy")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("dialerAuditLog_entityType_entityId_idx").on(
      table.entityType,
      table.entityId
    ),
    index("dialerAuditLog_performedBy_idx").on(table.performedBy),
  ]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const sipTrunksRelations = relations(sipTrunks, ({ many, one }) => ({
  dids: many(didInventory),
  createdByUser: one(user, {
    fields: [sipTrunks.createdBy],
    references: [user.id],
  }),
}));

export const didInventoryRelations = relations(didInventory, ({ one }) => ({
  sipTrunk: one(sipTrunks, {
    fields: [didInventory.sipTrunkId],
    references: [sipTrunks.id],
  }),
  organization: one(organization, {
    fields: [didInventory.organizationId],
    references: [organization.id],
  }),
  createdByUser: one(user, {
    fields: [didInventory.createdBy],
    references: [user.id],
  }),
}));

export const agentExtensionsRelations = relations(
  agentExtensions,
  ({ one }) => ({
    organization: one(organization, {
      fields: [agentExtensions.organizationId],
      references: [organization.id],
    }),
    linkedUser: one(user, {
      fields: [agentExtensions.userId],
      references: [user.id],
    }),
    createdByUser: one(user, {
      fields: [agentExtensions.createdBy],
      references: [user.id],
    }),
  })
);

export const dialerAuditLogRelations = relations(dialerAuditLog, ({ one }) => ({
  performer: one(user, {
    fields: [dialerAuditLog.performedBy],
    references: [user.id],
  }),
}));
