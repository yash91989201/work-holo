import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";

// ─── SIP Providers ───────────────────────────────────────────────────────────
// Each provider is a SIP carrier company (Frejun, CloudBharat, Telnyx, etc.)
// One provider can have many trunks (e.g. multiple accounts with same carrier)

export const sipProviders = pgTable(
  "sipProviders",
  {
    id: cuid2().defaultRandom().primaryKey(),
    name: text("name").notNull(), // "Frejun", "CloudBharat"
    slug: text("slug").notNull().unique(), // "frejun", "cloudbharat"
    host: text("host").notNull(), // "workholo-dialer-testing.sip.frejun.ai"
    port: integer("port").default(5060).notNull(),
    transport: text("transport").default("tcp").notNull(), // "udp" | "tcp" | "tls"
    requiresRegistration: boolean("requiresRegistration")
      .default(false)
      .notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdBy: text("createdBy")
      .notNull()
      .references(() => user.id),
  },
  (table) => [index("sipProviders_isActive_idx").on(table.isActive)]
);

// ─── SIP Trunks ──────────────────────────────────────────────────────────────
// A trunk is a specific account/credential set under a provider

export const sipTrunks = pgTable(
  "sipTrunks",
  {
    id: cuid2().defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    sipProviderId: text("sipProviderId").references(() => sipProviders.id), // null for legacy trunks
    provider: text("provider").notNull(), // kept for backward compat; mirrors sipProvider.slug
    username: text("username").notNull(),
    password: text("password").notNull(),
    proxy: text("proxy").notNull(),
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
    index("sipTrunks_sipProviderId_idx").on(table.sipProviderId),
    index("sipTrunks_provider_idx").on(table.provider),
    index("sipTrunks_isActive_idx").on(table.isActive),
  ]
);

// ─── DID Inventory ────────────────────────────────────────────────────────────
// Phone numbers owned by the platform. Platform admin assigns to orgs.
// Org admin then assigns to specific agents.

export const didInventory = pgTable(
  "didInventory",
  {
    id: cuid2().defaultRandom().primaryKey(),
    number: text("number").notNull().unique(), // E.164, e.g. "+914226628808"
    friendlyName: text("friendlyName"),
    sipTrunkId: text("sipTrunkId")
      .notNull()
      .references(() => sipTrunks.id),
    // Platform admin → org assignment
    organizationId: text("organizationId").references(() => organization.id),
    assignedToOrgAt: timestamp("assignedToOrgAt"),
    assignedToOrgBy: text("assignedToOrgBy").references(() => user.id),
    // Org admin → agent assignment
    assignedToUserId: text("assignedToUserId").references(() => user.id),
    assignedToUserAt: timestamp("assignedToUserAt"),
    assignedToUserBy: text("assignedToUserBy").references(() => user.id),
    status: text("status").default("available").notNull(), // "available" | "assigned" | "retired" | "blocked"
    destinationType: text("destinationType"), // "agent" | "queue" | "hangup"
    destinationTarget: text("destinationTarget"),
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
    index("didInventory_assignedToUserId_idx").on(table.assignedToUserId),
    index("didInventory_status_idx").on(table.status),
  ]
);

// ─── Agent Extensions ─────────────────────────────────────────────────────────
// SIP softphone extensions for agents (provisioned in FreeSWITCH directory)

export const agentExtensions = pgTable(
  "agentExtensions",
  {
    id: cuid2().defaultRandom().primaryKey(),
    extension: text("extension").notNull().unique(), // e.g. "1001"
    password: text("password").notNull(),
    callerIdName: text("callerIdName").notNull(),
    callerIdNumber: text("callerIdNumber").notNull(),
    organizationId: text("organizationId").references(() => organization.id),
    userId: text("userId").references(() => user.id),
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

// ─── Org Dialer Settings ──────────────────────────────────────────────────────
// Per-org dialer configuration set by platform admin when assigning DIDs

export const orgDialerSettings = pgTable("orgDialerSettings", {
  id: cuid2().defaultRandom().primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .unique()
    .references(() => organization.id, { onDelete: "cascade" }),
  isEnabled: boolean("isEnabled").default(false).notNull(),
  canMakeOutboundCalls: boolean("canMakeOutboundCalls")
    .default(false)
    .notNull(),
  canReceiveInboundCalls: boolean("canReceiveInboundCalls")
    .default(false)
    .notNull(),
  defaultOutboundTrunkId: text("defaultOutboundTrunkId").references(
    () => sipTrunks.id
  ),
  recordAllCalls: boolean("recordAllCalls").default(false).notNull(),
  maxConcurrentCalls: integer("maxConcurrentCalls").default(5).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdBy: text("createdBy")
    .notNull()
    .references(() => user.id),
});

// ─── Agent Dialer Access ──────────────────────────────────────────────────────
// Org admin grants specific members calling access and assigns their DID/extension

export const agentDialerAccess = pgTable(
  "agentDialerAccess",
  {
    id: cuid2().defaultRandom().primaryKey(),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    canMakeCalls: boolean("canMakeCalls").default(false).notNull(),
    canReceiveCalls: boolean("canReceiveCalls").default(false).notNull(),
    assignedDidId: text("assignedDidId").references(() => didInventory.id),
    assignedExtensionId: text("assignedExtensionId").references(
      () => agentExtensions.id
    ),
    isActive: boolean("isActive").default(true).notNull(),
    grantedBy: text("grantedBy")
      .notNull()
      .references(() => user.id),
    grantedAt: timestamp("grantedAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("agentDialerAccess_org_user_unique").on(
      table.organizationId,
      table.userId
    ),
    index("agentDialerAccess_organizationId_idx").on(table.organizationId),
    index("agentDialerAccess_userId_idx").on(table.userId),
  ]
);

// ─── Dialer Audit Log ─────────────────────────────────────────────────────────

export const dialerAuditLog = pgTable(
  "dialerAuditLog",
  {
    id: cuid2().defaultRandom().primaryKey(),
    entityType: text("entityType").notNull(), // "sip_provider" | "sip_trunk" | "did" | "agent_extension" | "org_settings" | "agent_access"
    entityId: text("entityId").notNull(),
    action: text("action").notNull(), // "created" | "updated" | "deleted" | "deployed" | "assigned" | "unassigned"
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

export const sipProvidersRelations = relations(
  sipProviders,
  ({ many, one }) => ({
    trunks: many(sipTrunks),
    createdByUser: one(user, {
      fields: [sipProviders.createdBy],
      references: [user.id],
    }),
  })
);

export const sipTrunksRelations = relations(sipTrunks, ({ many, one }) => ({
  dids: many(didInventory),
  sipProvider: one(sipProviders, {
    fields: [sipTrunks.sipProviderId],
    references: [sipProviders.id],
  }),
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
  assignedToUser: one(user, {
    fields: [didInventory.assignedToUserId],
    references: [user.id],
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

export const orgDialerSettingsRelations = relations(
  orgDialerSettings,
  ({ one }) => ({
    organization: one(organization, {
      fields: [orgDialerSettings.organizationId],
      references: [organization.id],
    }),
    defaultOutboundTrunk: one(sipTrunks, {
      fields: [orgDialerSettings.defaultOutboundTrunkId],
      references: [sipTrunks.id],
    }),
    createdByUser: one(user, {
      fields: [orgDialerSettings.createdBy],
      references: [user.id],
    }),
  })
);

export const agentDialerAccessRelations = relations(
  agentDialerAccess,
  ({ one }) => ({
    organization: one(organization, {
      fields: [agentDialerAccess.organizationId],
      references: [organization.id],
    }),
    user: one(user, {
      fields: [agentDialerAccess.userId],
      references: [user.id],
    }),
    assignedDid: one(didInventory, {
      fields: [agentDialerAccess.assignedDidId],
      references: [didInventory.id],
    }),
    assignedExtension: one(agentExtensions, {
      fields: [agentDialerAccess.assignedExtensionId],
      references: [agentExtensions.id],
    }),
    grantedByUser: one(user, {
      fields: [agentDialerAccess.grantedBy],
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
