export { checkBit } from "./lib/bitset";
export type { AttendanceDSL } from "./lib/dsl/attendance";
export { Attendance } from "./lib/dsl/attendance";
export type { ChannelDSL } from "./lib/dsl/channel";
export { Channel } from "./lib/dsl/channel";
export type {
  PermissionExpression,
  PermissionInput,
  PermissionKeyFromDSL,
  PermissionKeys,
  PermissionSelector,
} from "./lib/dsl/keys";
export {
  and,
  evaluateExpression,
  not,
  or,
  permissionKey,
  resolvePermission,
} from "./lib/dsl/keys";
export type { OrgDSL } from "./lib/dsl/org";
export { Org } from "./lib/dsl/org";
export type { TeamDSL } from "./lib/dsl/team";
export { Team } from "./lib/dsl/team";

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

export type { PermissionKeyLiteral } from "./lib/vocabulary";

export {
  getBitIndex,
  getPermission,
  PERMISSION_BY_BIT_INDEX,
  PERMISSION_BY_KEY,
  PERMISSIONS,
  TOTAL_PERMISSIONS,
} from "./lib/vocabulary";
export { AuthorizationEngine } from "./services/authorization-engine";
export { CacheManager } from "./services/cache-manager";
export { PermissionService } from "./services/permission.service";
export { PermissionAdmin } from "./services/permission-admin";
export { PermissionChecker } from "./services/permission-checker";
export { PermissionDSL } from "./services/permission-dsl";
export { PermissionEventManager } from "./services/permission-event-manager";
export { PermissionIntrospection } from "./services/permission-introspection";
export { PermissionMapManager } from "./services/permission-map-manager";
export { PermissionResourceGuard } from "./services/permission-resource-guard";
export { PolicyManager } from "./services/policy-manager";
export { assignOrgUserRole } from "./utils/assign-org-user-role";

export type { AllPermissionManagers } from "./utils/permission-managers";
export { PermissionManagers } from "./utils/permission-managers";
