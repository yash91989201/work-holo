import type { db as Db } from "@work-holo/db";
import { env } from "@work-holo/env/server";
import type {
  AuthorizationResult,
  PermissionAction,
  PermissionDescriptor,
  PermissionMap,
} from "../lib/types";
import type { AuthorizationEngine } from "./authorization-engine";
import type { CacheManager } from "./cache-manager";
import { PermissionAdmin } from "./permission-admin";
import { PermissionChecker } from "./permission-checker";
import { PermissionDSL } from "./permission-dsl";
import type { PermissionEventManager } from "./permission-event-manager";
import { PermissionIntrospection } from "./permission-introspection";
import type { PermissionMapManager } from "./permission-map-manager";
import { PermissionResourceGuard } from "./permission-resource-guard";
import type { PolicyManager } from "./policy-manager";

type PermissionServiceConstructor = {
  userId: string;
  db: typeof Db;
  orgId: string;
  authorizationEngine: AuthorizationEngine;
  cacheManager: CacheManager;
  policyManager: PolicyManager;
  eventManager: PermissionEventManager;
  permissionMapManager: PermissionMapManager;
};

/**
 * Public facade for permission checks, guards, and admin operations.
 */
export class PermissionService {
  readonly userId: string;
  readonly orgId: string;
  readonly db: typeof Db;

  private readonly checker: PermissionChecker;
  private readonly dsl: PermissionDSL;
  private readonly resourceGuard: PermissionResourceGuard;
  private readonly introspection: PermissionIntrospection;
  private readonly admin: PermissionAdmin;

  /**
   * Creates a permission service bound to one user and organization.
   */
  constructor({
    userId,
    db,
    orgId,
    authorizationEngine,
    cacheManager,
    policyManager,
    eventManager,
    permissionMapManager,
  }: PermissionServiceConstructor) {
    this.userId = userId;
    this.db = db;
    this.orgId = orgId;

    const enforceMode = env.CASBIN_ENFORCE;

    this.dsl = new PermissionDSL(this.orgId);
    this.checker = new PermissionChecker(
      this.userId,
      this.orgId,
      enforceMode,
      authorizationEngine
    );
    this.resourceGuard = new PermissionResourceGuard(
      this.userId,
      this.orgId,
      this.db,
      this.checker
    );
    this.introspection = new PermissionIntrospection(
      this.userId,
      this.orgId,
      permissionMapManager
    );
    this.admin = new PermissionAdmin({
      userId: this.userId,
      orgId: this.orgId,
      db: this.db,
      cacheManager,
      policyManager,
      eventManager,
      permissionMapManager,
    });
  }

  /**
   * Returns whether authorization failures should throw in check methods.
   */
  shouldEnforce(): boolean {
    return this.checker.shouldEnforce();
  }

  /**
   * Returns organization-scoped permission builders.
   */
  get org() {
    return this.dsl.org;
  }

  /**
   * Returns team-scoped permission builders for a team ID.
   */
  team(teamId: string) {
    return this.dsl.team(teamId);
  }

  /**
   * Returns channel permission builders, optionally team scoped.
   */
  channel() {
    return this.dsl.channel();
  }

  /**
   * Returns attendance permission builders, optionally team scoped.
   */
  attendance() {
    return this.dsl.attendance();
  }

  /**
   * Authorizes a descriptor and returns decision metadata.
   */
  authorizeDescriptor(
    descriptor: PermissionDescriptor,
    options?: { ownerId?: string; teamId?: string }
  ): Promise<AuthorizationResult> {
    return this.checker.authorizeDescriptor(descriptor, options);
  }

  /**
   * Enforces access for a descriptor and throws when denied.
   */
  check(
    descriptor: PermissionDescriptor,
    options?: { ownerId?: string; teamId?: string }
  ): Promise<void> {
    return this.checker.check(descriptor, options);
  }

  /**
   * Enforces access using a raw permission key.
   */
  checkByKey(
    permissionKey: string,
    options?: { resourceId?: string; ownerId?: string; teamId?: string }
  ): Promise<void> {
    return this.checker.checkByKey(permissionKey, options);
  }

  /**
   * Returns whether access is allowed for a descriptor.
   */
  can(
    descriptor: PermissionDescriptor,
    options?: { ownerId?: string; teamId?: string }
  ): Promise<boolean> {
    return this.checker.can(descriptor, options);
  }

  /**
   * Returns whether access is allowed for a raw permission key.
   */
  canByKey(
    permissionKey: string,
    options?: { resourceId?: string; ownerId?: string; teamId?: string }
  ): Promise<boolean> {
    return this.checker.canByKey(permissionKey, options);
  }

  /**
   * Verifies channel existence, membership, and action permission.
   */
  requireChannelAccess(
    channelId: string,
    action: PermissionAction | string
  ): Promise<void> {
    return this.resourceGuard.requireChannelAccess(channelId, action);
  }

  /**
   * Verifies message, channel access, and action permission.
   */
  requireMessageAccess(
    messageId: string,
    action: PermissionAction | string
  ): Promise<void> {
    return this.resourceGuard.requireMessageAccess(messageId, action);
  }

  /**
   * Returns the full permission map for the current user.
   */
  getPermissionMap(): Promise<PermissionMap> {
    return this.introspection.getPermissionMap();
  }

  /**
   * Assigns a role to a target user and refreshes authorization state.
   */
  assignRole(
    targetUserId: string,
    roleTemplateId: string,
    options?: { teamId?: string }
  ): Promise<void> {
    return this.admin.assignRole(targetUserId, roleTemplateId, options);
  }

  /**
   * Revokes a role from a target user and refreshes authorization state.
   */
  revokeRole(
    targetUserId: string,
    roleTemplateId: string,
    options?: { teamId?: string }
  ): Promise<void> {
    return this.admin.revokeRole(targetUserId, roleTemplateId, options);
  }

  /**
   * Creates a user-specific permission override.
   */
  createPolicyOverride(
    targetUserId: string,
    permissionNodeId: string,
    effect: "allow" | "deny",
    options?: {
      teamId?: string;
      resourceId?: string;
      reason?: string;
      expiresAt?: Date;
    }
  ): Promise<void> {
    return this.admin.createPolicyOverride(
      targetUserId,
      permissionNodeId,
      effect,
      options
    );
  }

  /**
   * Removes a user-specific permission override.
   */
  removePolicyOverride(
    overrideId: string,
    targetUserId: string
  ): Promise<void> {
    return this.admin.removePolicyOverride(overrideId, targetUserId);
  }

  /**
   * Recompiles organization policies and invalidates org-level cache.
   */
  recompilePolicies(): Promise<void> {
    return this.admin.recompilePolicies();
  }
}
