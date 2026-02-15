/**
 * Resource types that can be authorized (org, team, channel, attendance).
 */
export type AuthResource = "org" | "team" | "channel" | "attendance";

/**
 * Actions that can be performed on resources (create, read, update, delete, etc.).
 */
export type AuthAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "list"
  | "add"
  | "remove"
  | "resend"
  | "assign"
  | "enable"
  | "disable"
  | "access"
  | "switch"
  | "react"
  | "pin"
  | "reply"
  | "mention.user"
  | "mention.channel";

/**
 * Unique permission identifier combining resource and action (e.g., "org.create").
 */
export type PermissionKey = `${AuthResource}.${string}`;

/**
 * Scope level for authorization checks (org-level or team-level).
 */
export type AuthScope = "org" | "team";

/**
 * Policy effect determining whether a permission is allowed or denied.
 */
export type PolicyEffect = "allow" | "deny";

/**
 * Describes a specific permission with resource, action, and bit representation.
 */
export type PermissionDescriptor = {
  obj: string;
  act: string;
  permissionKey: PermissionKey;
  bitIndex: number;
  attrs?: Record<string, string>;
};

/**
 * Request to check if a user has a specific permission in an org or team.
 */
export type AuthorizationRequest = {
  userId: string;
  orgId: string;
  teamId?: string;
  permission: PermissionDescriptor;
};

/**
 * Result of an authorization check including decision and performance metrics.
 */
export type AuthorizationResult = {
  allowed: boolean;
  decidedBy: "bitset" | "cache" | "casbin" | "owner";
  durationMs: number;
  permissionKey: string;
};

/**
 * Cache key for storing authorization decisions.
 */
export type CacheKey = string;

/**
 * Cached authorization decision with policy version and timestamp.
 */
export type CachedDecision = {
  allowed: boolean;
  policyVersion: number;
  cachedAt: number;
};

/**
 * Compiled bitset representation of permissions with policy version.
 */
export type BitsetData = {
  bitset: string;
  policyVersion: number;
  compiledAt: number;
};

/**
 * Compiled policy rule in Casbin format (subject, domain, object, action, effect).
 */
export type CompiledPolicy = {
  ptype: "p";
  sub: string;
  dom: string;
  obj: string;
  act: string;
  eft: PolicyEffect;
};

/**
 * Compiled role grouping rule mapping users to roles within a domain.
 */
export type CompiledGroupingPolicy = {
  ptype: "g";
  user: string;
  role: string;
  domain: string;
};

/**
 * Result of compiling policies and grouping rules into enforceable format.
 */
export type CompilationResult = {
  policies: CompiledPolicy[];
  groupingPolicies: CompiledGroupingPolicy[];
  version: number;
  compiledAt: Date;
  error?: string;
};

/**
 * Single permission entry in a user's permission map with resource and action details.
 */
export type PermissionMapEntry = {
  key: PermissionKey;
  allowed: boolean;
  resource: AuthResource;
  subResources: string[];
  action: AuthAction;
};

/**
 * Snapshot of all permissions for a user in an org at a specific policy version.
 */
export type PermissionMap = {
  userId: string;
  orgId: string;
  policyVersion: number;
  permissions: Record<string, boolean>;
  computedAt: number;
};

/**
 * Event types emitted when permission state changes (role assignment, policy updates, etc.).
 */
export type PermissionEventType =
  | "role_assigned"
  | "role_revoked"
  | "policy_override_created"
  | "policy_override_removed"
  | "policy_compiled"
  | "permission_snapshot_updated";

/**
 * Event emitted when permission state changes, including actor and affected resources.
 */
export type PermissionEvent = {
  type: PermissionEventType;
  orgId: string;
  teamId?: string;
  userId?: string;
  actorId: string;
  payload: Record<string, unknown>;
  timestamp: number;
};

/**
 * Vocabulary entry mapping permission keys to bit indices and descriptions.
 */
export type VocabularyEntry = {
  key: PermissionKey;
  resource: AuthResource;
  subResources: string[];
  action: string;
  bitIndex: number;
  description?: string;
};

/**
 * Built-in system roles (owner, admin, member) used across the application.
 */
export const SYSTEM_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

/**
 * Type representing one of the system roles.
 */
export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

/**
 * Audit action constants for permission-related events.
 */
export const AUDIT_ACTIONS = {
  ROLE_ASSIGNED: "role_assigned",
  ROLE_REVOKED: "role_revoked",
  POLICY_OVERRIDE_CREATED: "policy_override_created",
  POLICY_OVERRIDE_REMOVED: "policy_override_removed",
  POLICY_COMPILED: "policy_compiled",
  SNAPSHOT_UPDATED: "permission_snapshot_updated",
} as const;

/**
 * Type representing one of the audit actions.
 */
export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

/**
 * Callable DSL terminal that builds a permission descriptor.
 */
export type PermissionAction = (resourceId?: string) => PermissionDescriptor;
