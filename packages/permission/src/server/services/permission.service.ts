import { ORPCError } from "@orpc/server";
import {
  policyOverrideTable,
  roleAssignmentTable,
  roleTemplateTable,
} from "@work-holo/db/schema/authorization";
import {
  channelMemberTable,
  channelTable,
  messageTable,
} from "@work-holo/db/schema/index";
import { and, eq } from "drizzle-orm";
import type {
  AuthorizationResult,
  PermissionAction,
  PermissionDescriptor,
  PermissionEvent,
  PermissionMap,
} from "../../core/types";
import { Attendance } from "../../dsl/resources/attendance";
import { Channel } from "../../dsl/resources/channel";
import { Message } from "../../dsl/resources/message";
import { Module } from "../../dsl/resources/module";
import { Org } from "../../dsl/resources/org";
import { Team } from "../../dsl/resources/team";
import { PERMISSION_BY_KEY } from "../../dsl/vocabulary";
import {
  authorize,
  authorizeWithOwnerBypass,
} from "../authorization/authorize";
import {
  invalidateOrgCache,
  invalidateUserCache,
} from "../cache/decisionCache";
import { invalidateBitset } from "../compilers/bitsetCompiler";
import { compilePolicies } from "../compilers/policyCompiler";
import type { Database } from "../config";
import { emitPermissionEvent } from "../events/emitter";
import {
  buildPermissionMap,
  invalidatePermissionMap,
} from "../introspection/permissionMap";

type PermissionServiceConstructor = {
  userId: string;
  db: Database;
  orgId: string;
};

export class PermissionService {
  readonly userId: string;
  readonly orgId: string;
  readonly db: Database;
  private readonly enforceMode: boolean;

  constructor({ userId, db, orgId }: PermissionServiceConstructor) {
    this.userId = userId;
    this.db = db;
    this.orgId = orgId;
    this.enforceMode = process.env.CASBIN_ENFORCE === "true";
  }

  shouldEnforce(): boolean {
    return this.enforceMode;
  }

  // ---------------------------------------------------------------------------
  // DSL Accessors — build type-safe PermissionDescriptors
  // ---------------------------------------------------------------------------

  /**
   * Get the Org DSL scoped to the current orgId.
   * Usage: `permission.org.create()`, `permission.org.invite.create()`
   */
  get org() {
    return Org(this.orgId);
  }

  /**
   * Get the Team DSL scoped to a specific teamId.
   * Usage: `permission.team(teamId).create()`, `permission.team(teamId).member.add()`
   */
  team(teamId: string) {
    return Team(teamId);
  }

  /**
   * Get the Channel DSL (no scope prefix).
   * Usage: `permission.channel.create(channelId)`, `permission.channel.view(channelId)`
   */
  get channel() {
    return Channel();
  }

  /**
   * Get the Message DSL (no scope prefix).
   * Usage: `permission.message.create()`, `permission.message.react(messageId)`
   */
  get message() {
    return Message();
  }

  /**
   * Get the Attendance DSL (no scope prefix).
   * Usage: `permission.attendance.record.create()`, `permission.attendance.record.view()`
   */
  get attendance() {
    return Attendance();
  }

  /**
   * Get the Module DSL (no scope prefix).
   * Usage: `permission.module.access(moduleId)`
   */
  get module() {
    return Module();
  }

  // ---------------------------------------------------------------------------
  // Core Authorization — full pipeline (cache → bitset → casbin)
  // ---------------------------------------------------------------------------

  /**
   * Authorize a PermissionDescriptor through the full pipeline.
   * Returns the AuthorizationResult with allowed/denied + decidedBy.
   */
  async authorizeDescriptor(
    descriptor: PermissionDescriptor,
    options?: { ownerId?: string; teamId?: string }
  ): Promise<AuthorizationResult> {
    const request = {
      userId: this.userId,
      orgId: this.orgId,
      teamId: options?.teamId,
      permission: options?.ownerId
        ? {
            ...descriptor,
            attrs: { ...descriptor.attrs, ownerId: options.ownerId },
          }
        : descriptor,
    };

    if (options?.ownerId) {
      return await authorizeWithOwnerBypass(request, options.ownerId);
    }

    return authorize(request);
  }

  /**
   * Check a PermissionDescriptor and throw FORBIDDEN if not allowed (when enforce mode is on).
   * This is the primary method for procedure-level permission checks.
   *
   * Usage:
   *   await permission.check(permission.org.create());
   *   await permission.check(permission.channel.view(channelId));
   *   await permission.check(permission.message.update(messageId), { ownerId });
   */
  async check(
    descriptor: PermissionDescriptor,
    options?: { ownerId?: string; teamId?: string }
  ): Promise<void> {
    const result = await this.authorizeDescriptor(descriptor, options);

    if (!result.allowed && this.shouldEnforce()) {
      throw new ORPCError("FORBIDDEN", {
        message: `Not allowed: ${result.permissionKey}`,
      });
    }
  }

  /**
   * Check a permission by its string key (e.g. "channel.view").
   * Builds a descriptor from the vocabulary and runs it through the full pipeline.
   * Useful when the DSL is too verbose for simple checks.
   */
  async checkByKey(
    permissionKey: string,
    options?: { resourceId?: string; ownerId?: string; teamId?: string }
  ): Promise<void> {
    const descriptor = this.buildDescriptorFromKey(permissionKey, options);
    await this.check(descriptor, options);
  }

  /**
   * Return true/false for whether the user has this permission (does NOT throw).
   */
  async can(
    descriptor: PermissionDescriptor,
    options?: { ownerId?: string; teamId?: string }
  ): Promise<boolean> {
    const result = await this.authorizeDescriptor(descriptor, options);
    return result.allowed;
  }

  /**
   * Return true/false by permission key string.
   */
  canByKey(
    permissionKey: string,
    options?: { resourceId?: string; ownerId?: string; teamId?: string }
  ): Promise<boolean> {
    const descriptor = this.buildDescriptorFromKey(permissionKey, options);
    return this.can(descriptor, options);
  }

  // ---------------------------------------------------------------------------
  // Resource-Level Access Guards
  // ---------------------------------------------------------------------------

  async requireChannelAccess(
    channelId: string,
    action: PermissionAction | string
  ): Promise<void> {
    const channel = await this.db.query.channelTable.findFirst({
      where: eq(channelTable.id, channelId),
      columns: { organizationId: true, createdBy: true },
    });

    if (!channel) {
      throw new ORPCError("NOT_FOUND", {
        message: "Channel not found",
      });
    }

    if (channel.organizationId !== this.orgId) {
      throw new ORPCError("FORBIDDEN", {
        message: "Channel does not belong to your organization",
      });
    }

    const membership = await this.db.query.channelMemberTable.findFirst({
      where: and(
        eq(channelMemberTable.channelId, channelId),
        eq(channelMemberTable.userId, this.userId)
      ),
    });

    if (!membership) {
      throw new ORPCError("FORBIDDEN", {
        message: "You are not a member of this channel",
      });
    }

    const descriptor =
      typeof action === "function"
        ? action(channelId)
        : this.buildDescriptorFromKey(action, { resourceId: channelId });

    await this.check(descriptor, { ownerId: channel.createdBy ?? undefined });
  }

  async requireMessageAccess(
    messageId: string,
    action: PermissionAction | string
  ): Promise<void> {
    const message = await this.db.query.messageTable.findFirst({
      where: eq(messageTable.id, messageId),
      columns: { channelId: true, senderId: true },
    });

    if (!message) {
      throw new ORPCError("NOT_FOUND", {
        message: "Message not found",
      });
    }

    await this.requireChannelAccess(message.channelId, action);

    const descriptor =
      typeof action === "function"
        ? action(messageId)
        : this.buildDescriptorFromKey(action, { resourceId: messageId });

    await this.check(descriptor, { ownerId: message.senderId ?? undefined });
  }

  // ---------------------------------------------------------------------------
  // Introspection — frontend hydration
  // ---------------------------------------------------------------------------

  /**
   * Build a complete permission map for the current user + org.
   * Used for frontend permission hydration (send once on login/org switch).
   */
  getPermissionMap(): Promise<PermissionMap> {
    return buildPermissionMap(this.userId, this.orgId);
  }

  // ---------------------------------------------------------------------------
  // Role & Policy Management — admin operations
  // ---------------------------------------------------------------------------

  /**
   * Assign a role template to a user in this org (optionally scoped to a team).
   * Recompiles policies and invalidates all caches for the target user.
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
   * Revoke a role assignment from a user.
   * Recompiles policies and invalidates all caches for the target user.
   */
  async revokeRole(
    targetUserId: string,
    roleTemplateId: string,
    options?: { teamId?: string }
  ): Promise<void> {
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
   * Create a per-user policy override (grant or deny a specific permission).
   * Recompiles policies and invalidates all caches for the target user.
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
   * Remove a policy override by its id.
   * Recompiles policies and invalidates all caches for the target user.
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
   * Trigger a full policy recompilation for this org.
   * Invalidates org-wide caches. Use after bulk admin operations.
   */
  async recompilePolicies(): Promise<void> {
    await compilePolicies(this.orgId, this.userId);
    await invalidateOrgCache(this.orgId);

    this.emitEvent({
      type: "policy_compiled",
      orgId: this.orgId,
      actorId: this.userId,
      payload: {},
      timestamp: Date.now(),
    });
  }

  // ---------------------------------------------------------------------------
  // Private Helpers
  // ---------------------------------------------------------------------------

  private buildDescriptorFromKey(
    permissionKey: string,
    options?: { resourceId?: string }
  ): PermissionDescriptor {
    const entry = PERMISSION_BY_KEY.get(permissionKey);

    if (!entry) {
      throw new ORPCError("BAD_REQUEST", {
        message: `Unknown permission key: ${permissionKey}`,
      });
    }

    const objParts: string[] = [entry.resource];
    if (entry.subResource) {
      objParts.push(entry.subResource);
    }
    if (options?.resourceId) {
      objParts.push(options.resourceId);
    }

    return {
      obj: objParts.join(":"),
      act: permissionKey,
      permissionKey: entry.key,
      bitIndex: entry.bitIndex,
    };
  }

  private async recompileAndInvalidate(targetUserId: string): Promise<void> {
    await compilePolicies(this.orgId, this.userId);
    await Promise.all([
      invalidateUserCache(targetUserId, this.orgId),
      invalidateBitset(targetUserId, this.orgId),
      invalidatePermissionMap(targetUserId, this.orgId),
    ]);
  }

  private emitEvent(event: PermissionEvent): void {
    emitPermissionEvent(event);
  }
}
