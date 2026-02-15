export type AuthResource = "org" | "team" | "channel" | "attendance";

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

export type PermissionKey = `${AuthResource}.${string}`;

export type AuthScope = "org" | "team";

export type PolicyEffect = "allow" | "deny";

export type PermissionDescriptor = {
  obj: string;
  act: string;
  permissionKey: PermissionKey;
  bitIndex: number;
  attrs?: Record<string, string>;
};

export type AuthorizationRequest = {
  userId: string;
  orgId: string;
  teamId?: string;
  permission: PermissionDescriptor;
};

export type AuthorizationResult = {
  allowed: boolean;
  decidedBy: "bitset" | "cache" | "casbin" | "owner";
  durationMs: number;
  permissionKey: string;
};

export type CacheKey = string;
export type CachedDecision = {
  allowed: boolean;
  policyVersion: number;
  cachedAt: number;
};

export type BitsetData = {
  bitset: string;
  policyVersion: number;
  compiledAt: number;
};

export type CompiledPolicy = {
  ptype: "p";
  sub: string;
  dom: string;
  obj: string;
  act: string;
  eft: PolicyEffect;
};

export type CompiledGroupingPolicy = {
  ptype: "g";
  user: string;
  role: string;
  domain: string;
};

export type CompilationResult = {
  policies: CompiledPolicy[];
  groupingPolicies: CompiledGroupingPolicy[];
  version: number;
  compiledAt: Date;
  error?: string;
};

export type PermissionMapEntry = {
  key: PermissionKey;
  allowed: boolean;
  resource: AuthResource;
  subResources: string[];
  action: AuthAction;
};

export type PermissionMap = {
  userId: string;
  orgId: string;
  policyVersion: number;
  permissions: Record<string, boolean>;
  computedAt: number;
};

export type PermissionEventType =
  | "role_assigned"
  | "role_revoked"
  | "policy_override_created"
  | "policy_override_removed"
  | "policy_compiled"
  | "permission_snapshot_updated";

export type PermissionEvent = {
  type: PermissionEventType;
  orgId: string;
  teamId?: string;
  userId?: string;
  actorId: string;
  payload: Record<string, unknown>;
  timestamp: number;
};

export type VocabularyEntry = {
  key: PermissionKey;
  resource: AuthResource;
  subResources: string[];
  action: string;
  bitIndex: number;
  description?: string;
};

export const SYSTEM_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

export const AUDIT_ACTIONS = {
  ROLE_ASSIGNED: "role_assigned",
  ROLE_REVOKED: "role_revoked",
  POLICY_OVERRIDE_CREATED: "policy_override_created",
  POLICY_OVERRIDE_REMOVED: "policy_override_removed",
  POLICY_COMPILED: "policy_compiled",
  SNAPSHOT_UPDATED: "permission_snapshot_updated",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

/**
 * Callable DSL terminal that builds a permission descriptor.
 */
export type PermissionAction = (resourceId?: string) => PermissionDescriptor;
