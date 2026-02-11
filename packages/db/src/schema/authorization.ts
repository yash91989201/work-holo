import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { organization, team, user } from "./auth";

export const scopeEnum = pgEnum("scope", ["org", "team"]);

export const permissionNodeTable = pgTable(
  "permission_node",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    key: text("key").notNull().unique(),
    resource: text("resource").notNull(),
    subResource: text("subResource").notNull(),
    action: text("action").notNull(),
    description: text("description"),
    bitIndex: integer("bitIndex").notNull().unique(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("permission_node_resource_idx").on(table.resource),
    uniqueIndex("permission_node_key_idx").on(table.key),
    uniqueIndex("permission_node_bitIndex_idx").on(table.bitIndex),
  ]
);

export const roleTemplateTable = pgTable(
  "role_template",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    displayName: text("displayName").notNull(),
    description: text("description"),
    scope: scopeEnum("scope").notNull(),
    isSystem: boolean("isSystem").default(false).notNull(),
    organizationId: text("organizationId").references(() => organization.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [
    uniqueIndex("role_template_name_organizationId_idx").on(
      table.name,
      table.organizationId
    ),
    index("role_template_organizationId_idx").on(table.organizationId),
  ]
);

export const rolePermissionTable = pgTable(
  "role_permission",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    roleTemplateId: text("roleTemplateId")
      .notNull()
      .references(() => roleTemplateTable.id, { onDelete: "cascade" }),
    permissionNodeId: text("permissionNodeId")
      .notNull()
      .references(() => permissionNodeTable.id, { onDelete: "cascade" }),
    effect: text("effect").default("allow").notNull(),
    conditions: text("conditions"),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("role_permission_role_permission_idx").on(
      table.roleTemplateId,
      table.permissionNodeId
    ),
    index("role_permission_permissionNodeId_idx").on(table.permissionNodeId),
  ]
);

export const roleAssignmentTable = pgTable(
  "role_assignment",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    roleTemplateId: text("roleTemplateId")
      .notNull()
      .references(() => roleTemplateTable.id, { onDelete: "cascade" }),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    teamId: text("teamId").references(() => team.id, {
      onDelete: "cascade",
    }),
    assignedBy: text("assignedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    assignedAt: timestamp("assignedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("role_assignment_unique_idx").on(
      table.userId,
      table.roleTemplateId,
      table.organizationId,
      table.teamId
    ),
    index("role_assignment_scope_idx").on(table.organizationId, table.teamId),
    index("role_assignment_userId_idx").on(table.userId),
  ]
);

export const policyOverrideTable = pgTable(
  "policy_override",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    permissionNodeId: text("permissionNodeId")
      .notNull()
      .references(() => permissionNodeTable.id, { onDelete: "cascade" }),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    teamId: text("teamId").references(() => team.id, { onDelete: "cascade" }),
    resourceId: text("resourceId"),
    effect: text("effect").notNull(),
    reason: text("reason"),
    expiresAt: timestamp("expiresAt", { withTimezone: true }),
    createdBy: text("createdBy").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("policy_override_user_org_idx").on(
      table.userId,
      table.organizationId
    ),
    index("policy_override_user_permission_idx").on(
      table.userId,
      table.permissionNodeId
    ),
  ]
);

export const policyVersionTable = pgTable(
  "policy_version",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    version: integer("version").default(1).notNull(),
    compiledAt: timestamp("compiledAt", { withTimezone: true }),
    compiledBy: text("compiledBy"),
    status: text("status").default("pending").notNull(),
    errorMessage: text("errorMessage"),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("policy_version_organizationId_version_idx").on(
      table.organizationId,
      table.version
    ),
    index("policy_version_organizationId_idx").on(table.organizationId),
  ]
);

export const permissionSnapshotTable = pgTable(
  "permission_snapshot",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    policyVersionId: text("policyVersionId")
      .notNull()
      .references(() => policyVersionTable.id, { onDelete: "cascade" }),
    bitset: text("bitset").notNull(),
    permissionMap: text("permissionMap").notNull(),
    computedAt: timestamp("computedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("permission_snapshot_user_org_idx").on(
      table.userId,
      table.organizationId
    ),
    index("permission_snapshot_policyVersionId_idx").on(table.policyVersionId),
  ]
);

export const permissionAuditLogTable = pgTable(
  "permission_audit_log",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    actorId: text("actorId").notNull(),
    action: text("action").notNull(),
    targetUserId: text("targetUserId"),
    targetRoleId: text("targetRoleId"),
    targetPermissionId: text("targetPermissionId"),
    details: text("details"),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("permission_audit_log_org_created_idx").on(
      table.organizationId,
      table.createdAt
    ),
    index("permission_audit_log_actorId_idx").on(table.actorId),
    index("permission_audit_log_targetUserId_idx").on(table.targetUserId),
  ]
);

export const teamModuleConfigTable = pgTable(
  "team_module_config",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    teamId: text("teamId")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    module: text("module").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
    updatedBy: text("updatedBy").references(() => user.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    uniqueIndex("team_module_config_teamId_module_idx").on(
      table.teamId,
      table.module
    ),
    index("team_module_config_teamId_idx").on(table.teamId),
  ]
);

export const permissionNodeRelations = relations(
  permissionNodeTable,
  ({ many }) => ({
    rolePermissions: many(rolePermissionTable),
    policyOverrides: many(policyOverrideTable),
  })
);

export const roleTemplateRelations = relations(
  roleTemplateTable,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [roleTemplateTable.organizationId],
      references: [organization.id],
    }),
    rolePermissions: many(rolePermissionTable),
    roleAssignments: many(roleAssignmentTable),
  })
);

export const rolePermissionRelations = relations(
  rolePermissionTable,
  ({ one }) => ({
    roleTemplate: one(roleTemplateTable, {
      fields: [rolePermissionTable.roleTemplateId],
      references: [roleTemplateTable.id],
    }),
    permissionNode: one(permissionNodeTable, {
      fields: [rolePermissionTable.permissionNodeId],
      references: [permissionNodeTable.id],
    }),
  })
);

export const roleAssignmentRelations = relations(
  roleAssignmentTable,
  ({ one }) => ({
    user: one(user, {
      fields: [roleAssignmentTable.userId],
      references: [user.id],
      relationName: "roleAssignmentUser",
    }),
    roleTemplate: one(roleTemplateTable, {
      fields: [roleAssignmentTable.roleTemplateId],
      references: [roleTemplateTable.id],
    }),
    organization: one(organization, {
      fields: [roleAssignmentTable.organizationId],
      references: [organization.id],
    }),
    team: one(team, {
      fields: [roleAssignmentTable.teamId],
      references: [team.id],
    }),
    assignedByUser: one(user, {
      fields: [roleAssignmentTable.assignedBy],
      references: [user.id],
      relationName: "roleAssignmentAssigner",
    }),
  })
);

export const policyOverrideRelations = relations(
  policyOverrideTable,
  ({ one }) => ({
    user: one(user, {
      fields: [policyOverrideTable.userId],
      references: [user.id],
      relationName: "policyOverrideUser",
    }),
    permissionNode: one(permissionNodeTable, {
      fields: [policyOverrideTable.permissionNodeId],
      references: [permissionNodeTable.id],
    }),
    organization: one(organization, {
      fields: [policyOverrideTable.organizationId],
      references: [organization.id],
    }),
    team: one(team, {
      fields: [policyOverrideTable.teamId],
      references: [team.id],
    }),
    createdByUser: one(user, {
      fields: [policyOverrideTable.createdBy],
      references: [user.id],
      relationName: "policyOverrideCreator",
    }),
  })
);

export const policyVersionRelations = relations(
  policyVersionTable,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [policyVersionTable.organizationId],
      references: [organization.id],
    }),
    permissionSnapshots: many(permissionSnapshotTable),
  })
);

export const permissionSnapshotRelations = relations(
  permissionSnapshotTable,
  ({ one }) => ({
    user: one(user, {
      fields: [permissionSnapshotTable.userId],
      references: [user.id],
    }),
    organization: one(organization, {
      fields: [permissionSnapshotTable.organizationId],
      references: [organization.id],
    }),
    policyVersion: one(policyVersionTable, {
      fields: [permissionSnapshotTable.policyVersionId],
      references: [policyVersionTable.id],
    }),
  })
);

export const permissionAuditLogRelations = relations(
  permissionAuditLogTable,
  ({ one }) => ({
    organization: one(organization, {
      fields: [permissionAuditLogTable.organizationId],
      references: [organization.id],
    }),
  })
);

export const teamModuleConfigRelations = relations(
  teamModuleConfigTable,
  ({ one }) => ({
    team: one(team, {
      fields: [teamModuleConfigTable.teamId],
      references: [team.id],
    }),
    updatedByUser: one(user, {
      fields: [teamModuleConfigTable.updatedBy],
      references: [user.id],
    }),
  })
);
