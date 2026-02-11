// Shared types (frontend-safe)

// Bitset utilities (frontend-safe)
export { checkBit } from "./core/bitset";
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
} from "./core/types";
export { AUDIT_ACTIONS, SYSTEM_ROLES } from "./core/types";
// DSL builders (frontend-safe)
export type { AttendanceDSL } from "./dsl/resources/attendance";
export { Attendance } from "./dsl/resources/attendance";
export type { ChannelDSL } from "./dsl/resources/channel";
export { Channel } from "./dsl/resources/channel";
export type { MessageDSL } from "./dsl/resources/message";
export { Message } from "./dsl/resources/message";
export type { ModuleDSL } from "./dsl/resources/module";
export { Module } from "./dsl/resources/module";
export type { OrgDSL } from "./dsl/resources/org";
export { Org } from "./dsl/resources/org";
export type { TeamDSL } from "./dsl/resources/team";
export { Team } from "./dsl/resources/team";
export type { PermissionKeyLiteral } from "./dsl/vocabulary";
// Vocabulary (frontend-safe)
export {
  getBitIndex,
  getPermission,
  PERMISSION_BY_BIT_INDEX,
  PERMISSION_BY_KEY,
  PERMISSIONS,
  TOTAL_PERMISSIONS,
} from "./dsl/vocabulary";
