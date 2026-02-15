import { ORPCError } from "@orpc/server";
import type { db as Db } from "@work-holo/db";
import {
  policyOverrideTable,
  roleAssignmentTable,
  roleTemplateTable,
} from "@work-holo/db/schema/authorization";
import { and, eq } from "drizzle-orm";
import type { PermissionEvent } from "../lib/types";
import type { CacheManager } from "./cache-manager";
import type { PermissionEventManager } from "./permission-event-manager";
import type { PermissionMapManager } from "./permission-map-manager";
import type { PolicyManager } from "./policy-manager";

/**
 * Handles role and override mutations for one organization context.
 */
export class PermissionAdmin {
  private readonly userId: string;
  private readonly orgId: string;
  private readonly db: typeof Db;
  private readonly cacheManager: CacheManager;
  private readonly policyManager: PolicyManager;
  private readonly eventManager: PermissionEventManager;
  private readonly permissionMapManager: PermissionMapManager;

  /**
   * Creates an admin operations service with required managers.
   */
  constructor(config: {
    userId: string;
    orgId: string;
    db: typeof Db;
    cacheManager: CacheManager;
    policyManager: PolicyManager;
    eventManager: PermissionEventManager;
    permissionMapManager: PermissionMapManager;
  }) {
    this.userId = config.userId;
    this.orgId = config.orgId;
    this.db = config.db;
    this.cacheManager = config.cacheManager;
    this.policyManager = config.policyManager;
    this.eventManager = config.eventManager;
    this.permissionMapManager = config.permissionMapManager;
  }

  /**
   * Assigns a role template to a user and refreshes permissions.
   */
  async assignRole(
    targetUserId: string,
    roleTemplateId: string,
    options?: { teamId?: string }
  ): Promise<void> {
    const template = await this.db.query.roleTemplateTable.findFirst({
      where: eq(roleTemplateTable.id, roleTemplateId),
      columns: { id: true, name: true, scope: true },
    });

    if (!template) {
      throw new ORPCError("NOT_FOUND", {
        message: "Role template not found",
      });
    }

    await this.db.insert(roleAssignmentTable).values({
      userId: targetUserId,
      roleTemplateId,
      organizationId: this.orgId,
      teamId: options?.teamId ?? null,
      assignedBy: this.userId,
    });

    await this.recompileAndInvalidate(targetUserId);

    this.emitEvent({
      type: "role_assigned",
      orgId: this.orgId,
      teamId: options?.teamId,
      userId: targetUserId,
      actorId: this.userId,
      payload: {
        targetUserId,
        roleTemplateId,
        roleName: template.name,
      },
      timestamp: Date.now(),
    });
  }

  /**
   * Revokes a role template from a user and refreshes permissions.
   */
  async revokeRole(
    targetUserId: string,
    roleTemplateId: string,
    options?: { teamId?: string }
  ): Promise<void> {
    const template = await this.db.query.roleTemplateTable.findFirst({
      where: eq(roleTemplateTable.id, roleTemplateId),
      columns: { id: true, scope: true },
    });

    if (!template) {
      throw new ORPCError("NOT_FOUND", {
        message: "Role template not found",
      });
    }

    if (template.scope === "team" && !options?.teamId) {
      throw new ORPCError("BAD_REQUEST", {
        message: "teamId is required when revoking a team-scoped role",
      });
    }

    const conditions = [
      eq(roleAssignmentTable.userId, targetUserId),
      eq(roleAssignmentTable.roleTemplateId, roleTemplateId),
      eq(roleAssignmentTable.organizationId, this.orgId),
    ];

    if (options?.teamId) {
      conditions.push(eq(roleAssignmentTable.teamId, options.teamId));
    }

    await this.db.delete(roleAssignmentTable).where(and(...conditions));

    await this.recompileAndInvalidate(targetUserId);

    this.emitEvent({
      type: "role_revoked",
      orgId: this.orgId,
      teamId: options?.teamId,
      userId: targetUserId,
      actorId: this.userId,
      payload: { targetUserId, roleTemplateId },
      timestamp: Date.now(),
    });
  }

  /**
   * Creates a direct allow/deny override for a user.
   */
  async createPolicyOverride(
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
    await this.db.insert(policyOverrideTable).values({
      userId: targetUserId,
      permissionNodeId,
      organizationId: this.orgId,
      teamId: options?.teamId ?? null,
      resourceId: options?.resourceId ?? null,
      effect,
      reason: options?.reason ?? null,
      expiresAt: options?.expiresAt ?? null,
      createdBy: this.userId,
    });

    await this.recompileAndInvalidate(targetUserId);

    this.emitEvent({
      type: "policy_override_created",
      orgId: this.orgId,
      teamId: options?.teamId,
      userId: targetUserId,
      actorId: this.userId,
      payload: {
        targetUserId,
        targetPermissionId: permissionNodeId,
        effect,
      },
      timestamp: Date.now(),
    });
  }

  /**
   * Removes a direct override and refreshes permissions.
   */
  async removePolicyOverride(
    overrideId: string,
    targetUserId: string
  ): Promise<void> {
    await this.db
      .delete(policyOverrideTable)
      .where(
        and(
          eq(policyOverrideTable.id, overrideId),
          eq(policyOverrideTable.organizationId, this.orgId)
        )
      );

    await this.recompileAndInvalidate(targetUserId);

    this.emitEvent({
      type: "policy_override_removed",
      orgId: this.orgId,
      userId: targetUserId,
      actorId: this.userId,
      payload: { targetUserId, overrideId },
      timestamp: Date.now(),
    });
  }

  /**
   * Rebuilds organization policies and clears org-level decision cache.
   */
  async recompilePolicies(): Promise<void> {
    await this.policyManager.compilePolicies(this.orgId, this.userId);
    await this.cacheManager.invalidateOrgCache(this.orgId);

    this.emitEvent({
      type: "policy_compiled",
      orgId: this.orgId,
      actorId: this.userId,
      payload: {},
      timestamp: Date.now(),
    });
  }

  /**
   * Recompiles policies and invalidates user-level caches.
   */
  private async recompileAndInvalidate(targetUserId: string): Promise<void> {
    await this.policyManager.compilePolicies(this.orgId, this.userId);
    await Promise.all([
      this.cacheManager.invalidateUserCache(targetUserId, this.orgId),
      this.cacheManager.invalidateBitset(targetUserId, this.orgId),
      this.permissionMapManager.invalidatePermissionMap(
        targetUserId,
        this.orgId
      ),
    ]);
  }

  /**
   * Emits a permission-domain event through the event manager.
   */
  private emitEvent(event: PermissionEvent): void {
    this.eventManager.emit(event);
  }
}
