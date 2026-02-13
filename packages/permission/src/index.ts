// ============================================================================
// Permission System - Server-Side Exports
// ============================================================================
//
// This package provides a comprehensive permission system with:
// - Type-safe DSL for building permission descriptors
// - Three-tier authorization pipeline (cache → bitset → Casbin)
// - Policy compilation from database to Casbin rules
// - Redis caching for performance
// - Audit logging and real-time events
// - Permission map building for frontend hydration
//
// ============================================================================

// ── Core Services ───────────────────────────────────────────────────────

export { AuthorizationEngine } from "./services/authorization-engine";
export { CacheManager } from "./services/cache-manager";
export { PermissionService } from "./services/permission.service";
export { PermissionEventManager } from "./services/permission-event-manager";
export { PermissionMapManager } from "./services/permission-map-manager";
export { PolicyManager } from "./services/policy-manager";

// ── Types ───────────────────────────────────────────────────────────────

export type {
  AuditAction,
  AuthAction,
  AuthorizationRequest,
  AuthorizationResult,
  AuthResource,
  AuthScope,
  BitsetData,
  CachedDecision,
  CacheKey,
  CompilationResult,
  CompiledGroupingPolicy,
  CompiledPolicy,
  PermissionAction,
  PermissionDescriptor,
  PermissionEvent,
  PermissionEventType,
  PermissionKey,
  PermissionMap,
  PermissionMapEntry,
  PolicyEffect,
  SystemRole,
  VocabularyEntry,
} from "./lib/types";

export { AUDIT_ACTIONS, SYSTEM_ROLES } from "./lib/types";

// ── Vocabulary ──────────────────────────────────────────────────────────

export type { PermissionKeyLiteral } from "./lib/vocabulary";

export {
  getBitIndex,
  getPermission,
  PERMISSION_BY_BIT_INDEX,
  PERMISSION_BY_KEY,
  PERMISSIONS,
  TOTAL_PERMISSIONS,
} from "./lib/vocabulary";

// ── DSL Builders ────────────────────────────────────────────────────────
// Type-safe fluent API for building permission descriptors

export type { AttendanceDSL } from "./lib/dsl/attendance";
export { Attendance } from "./lib/dsl/attendance";

export type { ChannelDSL } from "./lib/dsl/channel";
export { Channel } from "./lib/dsl/channel";

export type { MessageDSL } from "./lib/dsl/message";
export { Message } from "./lib/dsl/message";

export type { ModuleDSL } from "./lib/dsl/module";
export { Module } from "./lib/dsl/module";

export type { OrgDSL } from "./lib/dsl/org";
export { Org } from "./lib/dsl/org";

export type { TeamDSL } from "./lib/dsl/team";
export { Team } from "./lib/dsl/team";

// ── Utilities ───────────────────────────────────────────────────────────

export { assignOrgUserRole } from "./utils/assign-org-user-role";
export { checkBit } from "./utils/bitset";

// ── Singleton ──────────────────────────────────────────────────────────

export type { AllPermissionManagers } from "./utils/permission-managers";
export { PermissionManagers } from "./utils/permission-managers";
