import { ORPCError } from "@orpc/server";
import type { db as Db } from "@work-holo/db";
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
import { Attendance } from "../lib/dsl/attendance";
import { Channel } from "../lib/dsl/channel";
import { Message } from "../lib/dsl/message";
import { Module } from "../lib/dsl/module";
import { Org } from "../lib/dsl/org";
import { Team } from "../lib/dsl/team";
import type {
  AuthorizationResult,
  PermissionAction,
  PermissionDescriptor,
  PermissionEvent,
  PermissionMap,
} from "../lib/types";
import { PERMISSION_BY_KEY } from "../lib/vocabulary";
import type { AuthorizationEngine } from "./authorization-engine";
import type { CacheManager } from "./cache-manager";
import type { PermissionEventManager } from "./permission-event-manager";
import type { PermissionMapManager } from "./permission-map-manager";
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
 * Main public API for authorization in the application.
 *
 * PermissionService is the primary interface for all permission checks, role management, and policy operations.
 * It orchestrates a three-tier authorization pipeline (Redis cache → hex bitset pre-filter → Casbin policy engine)
 * and provides type-safe DSL accessors for building permission descriptors.
 *
 * **Responsibilities:**
 * - DSL accessors for constructing type-safe permission descriptors (org, team, channel, message, attendance, module)
 * - Authorization checks with configurable enforce mode (throw on denial vs. return boolean)
 * - Resource-level access guards (verify existence, membership, and permission in one call)
 * - Permission map introspection for frontend hydration
 * - Admin operations: role assignment/revocation, policy overrides, policy recompilation
 *
 * **Constructor Dependencies:**
 * - `userId`: The current user performing authorization checks
 * - `orgId`: The current organization context
 * - `db`: Database connection for querying roles, overrides, and resources
 * - `authorizationEngine`: Three-tier decision engine (cache → bitset → Casbin)
 * - `cacheManager`: Redis-backed decision cache and bitset cache
 * - `policyManager`: Compiles DB state into Casbin rules
 * - `eventManager`: Emits audit logs and real-time notifications
 * - `permissionMapManager`: Builds complete permission maps for frontend hydration
 *
 * **Enforce Mode:**
 * Controlled by the `CASBIN_ENFORCE` environment variable:
 * - `"true"`: `check()` throws `ORPCError("FORBIDDEN")` when permission is denied
 * - `"false"`: `check()` silently allows denied permissions (useful for gradual rollout)
 * - `can()` always returns a boolean, never throws
 *
 * **Typical Usage Patterns:**
 *
 * @example
 * ```typescript
 * // Type-safe DSL for org-level operations
 * await permission.check(permission.org.create());
 * await permission.check(permission.org.invite.create());
 *
 * // Type-safe DSL for team operations
 * await permission.check(permission.team(teamId).member.add());
 *
 * // Type-safe DSL for resource operations
 * await permission.check(permission.channel.create(channelId));
 * await permission.check(permission.message.react(messageId));
 *
 * // Owner bypass: allow resource owner to perform actions
 * await permission.check(permission.message.update(messageId), { ownerId: message.senderId });
 *
 * // String-based permission keys (when DSL is too verbose)
 * await permission.checkByKey("channel.view", { resourceId: channelId });
 *
 * // Boolean checks (never throw)
 * const canDelete = await permission.can(permission.message.delete(messageId));
 * if (!canDelete) {
 *   // show disabled button or error message
 * }
 *
 * // Resource guards: verify existence + membership + permission in one call
 * await permission.requireChannelAccess(channelId, permission.channel.view);
 * await permission.requireMessageAccess(messageId, permission.message.delete);
 *
 * // Admin operations (trigger policy recompilation + cache invalidation)
 * await permission.assignRole(userId, roleTemplateId);
 * await permission.createPolicyOverride(userId, permissionNodeId, "allow");
 *
 * // Frontend hydration: get complete permission map for current user
 * const permissionMap = await permission.getPermissionMap();
 * // Send to frontend: { permissions: { "channel.create": true, "org.delete": false, ... } }
 * ```
 *
 * **Architecture/Strategy:**
 * The service delegates to specialized manager classes:
 * - **AuthorizationEngine**: Implements the three-tier decision pipeline
 * - **CacheManager**: Manages Redis caches with version-based staleness detection
 * - **PolicyManager**: Compiles role assignments and overrides into Casbin rules
 * - **PermissionEventManager**: Emits audit logs and Pusher notifications
 * - **PermissionMapManager**: Builds and caches complete permission maps
 *
 * All admin operations follow the same pattern: write to DB → recompile policies → invalidate caches → emit event.
 * This ensures consistency across all processes in a multi-process deployment.
 */
export class PermissionService {
  /** The user ID for whom authorization checks are performed. */
  readonly userId: string;

  /** The organization ID providing the authorization context. */
  readonly orgId: string;

  /** Database connection for querying roles, overrides, and resources. */
  readonly db: typeof Db;

  /** Whether to throw on denied permissions (from CASBIN_ENFORCE env var). */
  private readonly enforceMode: boolean;

  /** Three-tier authorization decision engine. */
  private readonly authorizationEngine: AuthorizationEngine;

  /** Redis-backed decision cache and bitset cache. */
  private readonly cacheManager: CacheManager;

  /** Compiles DB state into Casbin rules. */
  private readonly policyManager: PolicyManager;

  /** Emits audit logs and real-time notifications. */
  private readonly eventManager: PermissionEventManager;

  /** Builds complete permission maps for frontend hydration. */
  private readonly permissionMapManager: PermissionMapManager;

  /**
   * Create a new PermissionService instance.
   *
   * @param config - Configuration object with all required dependencies
   * @param config.userId - The current user performing authorization checks
   * @param config.orgId - The current organization context
   * @param config.db - Database connection
   * @param config.authorizationEngine - Three-tier decision engine
   * @param config.cacheManager - Redis-backed cache manager
   * @param config.policyManager - Policy compiler
   * @param config.eventManager - Event emitter for audit logs and notifications
   * @param config.permissionMapManager - Permission map builder
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
    this.enforceMode = process.env.CASBIN_ENFORCE === "true";
    this.authorizationEngine = authorizationEngine;
    this.cacheManager = cacheManager;
    this.policyManager = policyManager;
    this.eventManager = eventManager;
    this.permissionMapManager = permissionMapManager;
  }

  /**
   * Check whether enforce mode is enabled.
   *
   * When enforce mode is enabled, `check()` throws `ORPCError("FORBIDDEN")` on denied permissions.
   * When disabled, `check()` silently allows denied permissions (useful for gradual rollout).
   *
   * **Important Behavior:**
   * - Controlled by the `CASBIN_ENFORCE` environment variable
   * - `can()` always returns a boolean, regardless of enforce mode
   * - This method is primarily for internal use; most code should use `check()` or `can()`
   *
   * @returns `true` if enforce mode is enabled, `false` otherwise
   *
   * @example
   * ```typescript
   * if (permission.shouldEnforce()) {
   *   // Enforce mode is on: check() will throw on denied permissions
   * } else {
   *   // Enforce mode is off: check() will silently allow denied permissions
   * }
   * ```
   */
  shouldEnforce(): boolean {
    return this.enforceMode;
  }

  // ---------------------------------------------------------------------------
  // DSL Accessors — build type-safe PermissionDescriptors
  // ---------------------------------------------------------------------------

  /**
   * Get the Org DSL scoped to the current organization.
   *
   * Returns a type-safe DSL for constructing organization-level permission descriptors.
   * All org-level operations are automatically scoped to the current `orgId`.
   *
   * **Important Behavior:**
   * - Scoped to `this.orgId` (the current organization context)
   * - Provides access to org-level operations: create, view, update, delete, list
   * - Provides access to org sub-resources: invite, role, context
   * - All descriptors built from this DSL are org-scoped
   *
   * @returns OrgDSL instance scoped to the current organization
   *
   * @example
   * ```typescript
   * // Create a new organization
   * await permission.check(permission.org.create());
   *
   * // Create an organization invite
   * await permission.check(permission.org.invite.create());
   *
   * // View organization roles
   * await permission.check(permission.org.role.view());
   *
   * // Switch organization context
   * await permission.check(permission.org.context.switch());
   * ```
   */
  get org() {
    return Org(this.orgId);
  }

  /**
   * Get the Team DSL scoped to a specific team.
   *
   * Returns a type-safe DSL for constructing team-level permission descriptors.
   * All team-level operations are scoped to the provided `teamId`.
   *
   * **Important Behavior:**
   * - Scoped to the provided `teamId` (not the current organization)
   * - Provides access to team-level operations: create, view, update, delete
   * - Provides access to team sub-resources: member, role, module
   * - All descriptors built from this DSL are team-scoped
   *
   * @param teamId - The team ID to scope this DSL to
   * @returns TeamDSL instance scoped to the specified team
   *
   * @example
   * ```typescript
   * // Add a member to a team
   * await permission.check(permission.team(teamId).member.add());
   *
   * // Assign a role within a team
   * await permission.check(permission.team(teamId).role.assign());
   *
   * // Enable a module for a team
   * await permission.check(permission.team(teamId).module.enable());
   * ```
   */
  team(teamId: string) {
    return Team(teamId);
  }

  /**
   * Get the Channel DSL (unscoped).
   *
   * Returns a type-safe DSL for constructing channel-level permission descriptors.
   * Channel operations are not scoped to a specific organization or team; the scope
   * is determined by the resource ID passed to the descriptor builder.
   *
   * **Important Behavior:**
   * - Unscoped: no automatic organization or team prefix
   * - Provides access to channel-level operations: create, view, update, delete
   * - Provides access to channel sub-resources: member
   * - Resource ID is passed when building the descriptor (e.g., `channel.view(channelId)`)
   *
   * @returns ChannelDSL instance
   *
   * @example
   * ```typescript
   * // Create a new channel
   * await permission.check(permission.channel.create());
   *
   * // View a specific channel
   * await permission.check(permission.channel.view(channelId));
   *
   * // Add a member to a channel
   * await permission.check(permission.channel.member.add(channelId));
   * ```
   */
  get channel() {
    return Channel();
  }

  /**
   * Get the Message DSL (unscoped).
   *
   * Returns a type-safe DSL for constructing message-level permission descriptors.
   * Message operations are not scoped to a specific organization or team; the scope
   * is determined by the resource ID passed to the descriptor builder.
   *
   * **Important Behavior:**
   * - Unscoped: no automatic organization or team prefix
   * - Provides access to message-level operations: create, view, update, delete, list, search, read
   * - Provides access to message sub-resources: react, pin, mention, readers
   * - Resource ID is passed when building the descriptor (e.g., `message.react(messageId)`)
   *
   * @returns MessageDSL instance
   *
   * @example
   * ```typescript
   * // Create a new message
   * await permission.check(permission.message.create());
   *
   * // React to a message
   * await permission.check(permission.message.react(messageId));
   *
   * // Pin a message
   * await permission.check(permission.message.pin(messageId));
   *
   * // Mention a user in a message
   * await permission.check(permission.message.mention.user(messageId));
   * ```
   */
  get message() {
    return Message();
  }

  /**
   * Get the Attendance DSL (unscoped).
   *
   * Returns a type-safe DSL for constructing attendance-level permission descriptors.
   * Attendance operations are not scoped to a specific organization or team; the scope
   * is determined by the resource ID passed to the descriptor builder.
   *
   * **Important Behavior:**
   * - Unscoped: no automatic organization or team prefix
   * - Provides access to attendance sub-resources: record
   * - Record operations: create, view, update, delete, list
   * - Resource ID is passed when building the descriptor (e.g., `attendance.record.view(recordId)`)
   *
   * @returns AttendanceDSL instance
   *
   * @example
   * ```typescript
   * // Create an attendance record
   * await permission.check(permission.attendance.record.create());
   *
   * // View an attendance record
   * await permission.check(permission.attendance.record.view(recordId));
   *
   * // Update an attendance record
   * await permission.check(permission.attendance.record.update(recordId));
   * ```
   */
  get attendance() {
    return Attendance();
  }

  /**
   * Get the Module DSL (unscoped).
   *
   * Returns a type-safe DSL for constructing module-level permission descriptors.
   * Module operations are not scoped to a specific organization or team; the scope
   * is determined by the resource ID passed to the descriptor builder.
   *
   * **Important Behavior:**
   * - Unscoped: no automatic organization or team prefix
   * - Provides access to module-level operations: access
   * - Resource ID is passed when building the descriptor (e.g., `module.access(moduleId)`)
   *
   * @returns ModuleDSL instance
   *
   * @example
   * ```typescript
   * // Access a module
   * await permission.check(permission.module.access(moduleId));
   * ```
   */
  get module() {
    return Module();
  }

  // ---------------------------------------------------------------------------
  // Core Authorization — full pipeline (cache → bitset → casbin)
  // ---------------------------------------------------------------------------

  /**
   * Authorize a PermissionDescriptor through the full three-tier pipeline.
   *
   * This is the main authorization entry point that delegates to the AuthorizationEngine.
   * It implements a three-tier decision pipeline:
   * 1. **Redis Decision Cache**: Fast path for recently cached decisions
   * 2. **Hex Bitset Pre-filter**: Over-approximation check to reject most denials quickly
   * 3. **Casbin Policy Engine**: Full RBAC evaluation with role inheritance and pattern matching
   *
   * **Important Behavior:**
   * - Returns `{ allowed: true, decidedBy: "owner" }` if `ownerId` is provided and matches `userId` (owner bypass)
   * - Caches decisions in Redis with version-based staleness detection
   * - Bitset pre-filter eliminates expensive Casbin calls for most denials
   * - All decisions include metadata: `allowed`, `decidedBy`, `durationMs`, `permissionKey`
   * - Does NOT throw; use `check()` for throwing variant
   *
   * @param descriptor - The permission descriptor to authorize (built from DSL or vocabulary)
   * @param options - Optional authorization context
   * @param options.ownerId - If provided, enables owner bypass (userId === ownerId → auto-allow)
   * @param options.teamId - Team context for team-scoped permissions
   * @returns AuthorizationResult with allowed status and decision metadata
   *
   * @example
   * ```typescript
   * // Basic authorization check
   * const result = await permission.authorizeDescriptor(permission.channel.view(channelId));
   * if (result.allowed) {
   *   // User can view the channel
   * }
   *
   * // With owner bypass
   * const result = await permission.authorizeDescriptor(
   *   permission.message.delete(messageId),
   *   { ownerId: message.senderId }
   * );
   * // If userId === message.senderId, immediately returns allowed: true
   *
   * // With team context
   * const result = await permission.authorizeDescriptor(
   *   permission.team(teamId).member.add(),
   *   { teamId }
   * );
   * ```
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
      return await this.authorizationEngine.authorizeWithOwnerBypass(
        request,
        options.ownerId
      );
    }

    return this.authorizationEngine.authorize(request);
  }

  /**
   * Check a PermissionDescriptor and throw FORBIDDEN if not allowed (when enforce mode is on).
   *
   * This is the primary method for procedure-level permission checks in API handlers.
   * It delegates to `authorizeDescriptor()` and throws `ORPCError("FORBIDDEN")` if the
   * permission is denied AND enforce mode is enabled.
   *
   * **Important Behavior:**
   * - Throws `ORPCError("FORBIDDEN")` only if BOTH conditions are true:
   *   1. Permission is denied (`result.allowed === false`)
   *   2. Enforce mode is enabled (`CASBIN_ENFORCE === "true"`)
   * - If enforce mode is disabled, silently allows denied permissions (useful for gradual rollout)
   * - Does nothing if permission is allowed (no throw, no return value)
   * - Use `can()` for non-throwing variant that returns a boolean
   *
   * @param descriptor - The permission descriptor to check (built from DSL or vocabulary)
   * @param options - Optional authorization context
   * @param options.ownerId - If provided, enables owner bypass (userId === ownerId → auto-allow)
   * @param options.teamId - Team context for team-scoped permissions
   * @throws ORPCError - With code "FORBIDDEN" if permission is denied and enforce mode is on
   *
   * @example
   * ```typescript
   * // Type-safe DSL usage
   * await permission.check(permission.org.create());
   * await permission.check(permission.channel.view(channelId));
   * await permission.check(permission.message.update(messageId), { ownerId: message.senderId });
   *
   * // String-based permission key (when DSL is too verbose)
   * await permission.checkByKey("channel.view", { resourceId: channelId });
   *
   * // In an API handler
   * export const deleteMessage = procedure
   *   .input(z.object({ messageId: z.string() }))
   *   .mutation(async ({ input, ctx }) => {
   *     const message = await db.query.messageTable.findFirst({
   *       where: eq(messageTable.id, input.messageId),
   *     });
   *     // Throws FORBIDDEN if user can't delete messages
   *     await ctx.permission.check(permission.message.delete(input.messageId), {
   *       ownerId: message.senderId,
   *     });
   *     // ... proceed with deletion
   *   });
   * ```
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
   * Check a permission by its string key and throw FORBIDDEN if not allowed.
   *
   * This is a convenience wrapper around `check()` that builds a descriptor from
   * a permission key string instead of using the type-safe DSL. Useful when the
   * DSL is too verbose or when permission keys are stored as strings.
   *
   * **Important Behavior:**
   * - Looks up the permission key in the vocabulary
   * - Throws `ORPCError("BAD_REQUEST")` if the permission key is unknown
   * - Throws `ORPCError("FORBIDDEN")` if permission is denied and enforce mode is on
   * - Builds descriptor with optional `resourceId` parameter
   *
   * @param permissionKey - The permission key string (e.g., "channel.view", "message.delete")
   * @param options - Optional authorization context
   * @param options.resourceId - Resource ID to include in the descriptor (e.g., channelId, messageId)
   * @param options.ownerId - If provided, enables owner bypass (userId === ownerId → auto-allow)
   * @param options.teamId - Team context for team-scoped permissions
   * @throws ORPCError - With code "BAD_REQUEST" if permission key is unknown
   * @throws ORPCError - With code "FORBIDDEN" if permission is denied and enforce mode is on
   *
   * @example
   * ```typescript
   * // Simple permission check by key
   * await permission.checkByKey("channel.view", { resourceId: channelId });
   *
   * // With owner bypass
   * await permission.checkByKey("message.delete", {
   *   resourceId: messageId,
   *   ownerId: message.senderId,
   * });
   *
   * // Useful when permission keys are stored in database
   * const requiredPermission = "channel.member.add";
   * await permission.checkByKey(requiredPermission, { resourceId: channelId });
   * ```
   */
  async checkByKey(
    permissionKey: string,
    options?: { resourceId?: string; ownerId?: string; teamId?: string }
  ): Promise<void> {
    const descriptor = this.buildDescriptorFromKey(permissionKey, options);
    await this.check(descriptor, options);
  }

  /**
   * Check a PermissionDescriptor and return true/false (never throws).
   *
   * This is the non-throwing variant of `check()`. It always returns a boolean
   * indicating whether the permission is allowed, regardless of enforce mode.
   * Use this when you need to conditionally show/hide UI elements or make
   * decisions based on permission status.
   *
   * **Important Behavior:**
   * - Always returns a boolean; never throws
   * - Ignores enforce mode setting (always returns actual permission status)
   * - Delegates to `authorizeDescriptor()` for the actual authorization check
   * - Useful for frontend permission hydration and conditional UI rendering
   *
   * @param descriptor - The permission descriptor to check (built from DSL or vocabulary)
   * @param options - Optional authorization context
   * @param options.ownerId - If provided, enables owner bypass (userId === ownerId → auto-allow)
   * @param options.teamId - Team context for team-scoped permissions
   * @returns `true` if permission is allowed, `false` otherwise
   *
   * @example
   * ```typescript
   * // Conditional UI rendering
   * const canDelete = await permission.can(permission.message.delete(messageId));
   * if (canDelete) {
   *   // Show delete button
   * } else {
   *   // Show disabled button or hide it
   * }
   *
   * // With owner bypass
   * const canEdit = await permission.can(permission.message.update(messageId), {
   *   ownerId: message.senderId,
   * });
   *
   * // Building permission maps for frontend
   * const permissions = {
   *   canCreateChannel: await permission.can(permission.channel.create()),
   *   canDeleteMessage: await permission.can(permission.message.delete(messageId)),
   *   canManageTeam: await permission.can(permission.team(teamId).update()),
   * };
   * ```
   */
  async can(
    descriptor: PermissionDescriptor,
    options?: { ownerId?: string; teamId?: string }
  ): Promise<boolean> {
    const result = await this.authorizeDescriptor(descriptor, options);
    return result.allowed;
  }

  /**
   * Check a permission by its string key and return true/false (never throws).
   *
   * This is a convenience wrapper around `can()` that builds a descriptor from
   * a permission key string. It always returns a boolean, never throws.
   *
   * **Important Behavior:**
   * - Looks up the permission key in the vocabulary
   * - Throws `ORPCError("BAD_REQUEST")` if the permission key is unknown
   * - Returns `false` if permission is denied (never throws FORBIDDEN)
   * - Useful for conditional logic and permission checks in non-critical paths
   *
   * @param permissionKey - The permission key string (e.g., "channel.view", "message.delete")
   * @param options - Optional authorization context
   * @param options.resourceId - Resource ID to include in the descriptor (e.g., channelId, messageId)
   * @param options.ownerId - If provided, enables owner bypass (userId === ownerId → auto-allow)
   * @param options.teamId - Team context for team-scoped permissions
   * @returns `true` if permission is allowed, `false` otherwise
   * @throws ORPCError - With code "BAD_REQUEST" if permission key is unknown
   *
   * @example
   * ```typescript
   * // Simple boolean check
   * const canView = await permission.canByKey("channel.view", { resourceId: channelId });
   *
   * // With owner bypass
   * const canDelete = await permission.canByKey("message.delete", {
   *   resourceId: messageId,
   *   ownerId: message.senderId,
   * });
   *
   * // Conditional logic
   * if (await permission.canByKey("org.invite.create")) {
   *   // Show invite button
   * }
   * ```
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

  /**
   * Verify channel existence, membership, and permission in one call.
   *
   * This is a resource guard that combines three checks:
   * 1. Channel exists in the database
   * 2. Channel belongs to the current organization
   * 3. User is a member of the channel
   * 4. User has the required permission for the action
   *
   * Throws `ORPCError` with appropriate code if any check fails. Useful for
   * API handlers that need to verify resource access before proceeding.
   *
   * **Important Behavior:**
   * - Throws `NOT_FOUND` if channel doesn't exist
   * - Throws `FORBIDDEN` if channel doesn't belong to current org
   * - Throws `FORBIDDEN` if user is not a channel member
   * - Throws `FORBIDDEN` if user lacks the required permission (when enforce mode is on)
   * - Supports both DSL actions and string permission keys
   * - Automatically includes channel creator as `ownerId` for owner bypass
   *
   * @param channelId - The channel ID to verify access for
   * @param action - Either a DSL action function (e.g., `permission.channel.view`) or a permission key string (e.g., "channel.view")
   * @throws ORPCError - With code "NOT_FOUND" if channel doesn't exist
   * @throws ORPCError - With code "FORBIDDEN" if org/membership/permission checks fail
   *
   * @example
   * ```typescript
   * // Using DSL action
   * await permission.requireChannelAccess(channelId, permission.channel.view);
   * await permission.requireChannelAccess(channelId, permission.channel.member.add);
   *
   * // Using string permission key
   * await permission.requireChannelAccess(channelId, "channel.view");
   * await permission.requireChannelAccess(channelId, "channel.member.add");
   *
   * // In an API handler
   * export const getChannelMessages = procedure
   *   .input(z.object({ channelId: z.string() }))
   *   .query(async ({ input, ctx }) => {
   *     // Verifies: channel exists, user is member, user can view
   *     await ctx.permission.requireChannelAccess(input.channelId, permission.channel.view);
   *     // ... proceed with fetching messages
   *   });
   * ```
   */
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

  /**
   * Verify message existence, channel membership, and permission in one call.
   *
   * This is a resource guard that combines multiple checks:
   * 1. Message exists in the database
   * 2. User has access to the message's channel (via `requireChannelAccess`)
   * 3. User has the required permission for the action on the message
   *
   * Throws `ORPCError` with appropriate code if any check fails. Useful for
   * API handlers that need to verify message access before proceeding.
   *
   * **Important Behavior:**
   * - Throws `NOT_FOUND` if message doesn't exist
   * - Delegates to `requireChannelAccess()` for channel verification
   * - Throws `FORBIDDEN` if user lacks the required permission (when enforce mode is on)
   * - Supports both DSL actions and string permission keys
   * - Automatically includes message sender as `ownerId` for owner bypass
   *
   * @param messageId - The message ID to verify access for
   * @param action - Either a DSL action function (e.g., `permission.message.delete`) or a permission key string (e.g., "message.delete")
   * @throws ORPCError - With code "NOT_FOUND" if message doesn't exist
   * @throws ORPCError - With code "FORBIDDEN" if channel/membership/permission checks fail
   *
   * @example
   * ```typescript
   * // Using DSL action
   * await permission.requireMessageAccess(messageId, permission.message.delete);
   * await permission.requireMessageAccess(messageId, permission.message.update);
   *
   * // Using string permission key
   * await permission.requireMessageAccess(messageId, "message.delete");
   * await permission.requireMessageAccess(messageId, "message.update");
   *
   * // In an API handler
   * export const deleteMessage = procedure
   *   .input(z.object({ messageId: z.string() }))
   *   .mutation(async ({ input, ctx }) => {
   *     // Verifies: message exists, user is channel member, user can delete
   *     await ctx.permission.requireMessageAccess(input.messageId, permission.message.delete);
   *     // ... proceed with deletion
   *   });
   * ```
   */
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
   * Build a complete permission map for the current user in the current organization.
   *
   * Returns a `PermissionMap` containing the user's permission status for all 59 permissions
   * in the system. This is used for frontend hydration: send once on login or org switch,
   * then use the map to conditionally render UI elements without making individual permission checks.
   *
   * **Important Behavior:**
   * - Implements a three-tier read strategy: Redis cache → DB snapshot → full recompute
   * - Caches result in Redis with version-based staleness detection
   * - Persists result to DB snapshot table for cross-process consistency
   * - Includes all 59 permissions from the vocabulary
   * - Respects role assignments, policy overrides, and owner bypass rules
   *
   * @returns PermissionMap with userId, orgId, policyVersion, and permissions object
   *
   * @example
   * ```typescript
   * // On login or org switch
   * const permissionMap = await permission.getPermissionMap();
   * // Send to frontend:
   * // {
   * //   userId: "user_123",
   * //   orgId: "org_456",
   * //   policyVersion: 7,
   * //   permissions: {
   * //     "channel.create": true,
   * //     "channel.delete": false,
   * //     "message.delete": false,
   * //     "org.invite.create": true,
   * //     ... (all 59 permissions)
   * //   },
   * //   computedAt: 1707634800000
   * // }
   *
   * // Frontend usage
   * if (permissionMap.permissions["channel.create"]) {
   *   // Show "Create Channel" button
   * }
   * ```
   */
  getPermissionMap(): Promise<PermissionMap> {
    return this.permissionMapManager.buildPermissionMap(
      this.userId,
      this.orgId
    );
  }

  // ---------------------------------------------------------------------------
  // Role & Policy Management — admin operations
  // ---------------------------------------------------------------------------

  /**
   * Assign a role template to a user in this organization.
   *
   * Creates a new role assignment record in the database, then triggers policy recompilation
   * and cache invalidation for the target user. All admin operations follow the same pattern:
   * write to DB → recompile policies → invalidate caches → emit event.
   *
   * **Important Behavior:**
   * - Throws `NOT_FOUND` if the role template doesn't exist
   * - Optionally scopes the role to a specific team (for team-scoped roles)
   * - Automatically recompiles policies for the entire organization
   * - Invalidates all caches for the target user (decision cache, bitset, permission map)
   * - Emits `role_assigned` event for audit logging and real-time notifications
   * - In multi-process deployments, other processes detect the change via policy version bump
   *
   * @param targetUserId - The user to assign the role to
   * @param roleTemplateId - The role template ID to assign
   * @param options - Optional configuration
   * @param options.teamId - If provided, scopes the role to this team (for team-scoped roles)
   * @throws ORPCError - With code "NOT_FOUND" if role template doesn't exist
   *
   * @example
   * ```typescript
   * // Assign org-level role
   * await permission.assignRole(userId, "role_org_member");
   *
   * // Assign team-scoped role
   * await permission.assignRole(userId, "role_team_admin", { teamId });
   *
   * // After assignment, the user's permissions are immediately updated
   * // and other processes detect the change via policy version bump
   * ```
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
   *
   * Deletes a role assignment record from the database, then triggers policy recompilation
   * and cache invalidation for the target user. All admin operations follow the same pattern:
   * write to DB → recompile policies → invalidate caches → emit event.
   *
   * **Important Behavior:**
   * - Deletes the role assignment matching userId, roleTemplateId, and orgId
   * - Optionally filters by teamId for team-scoped roles
   * - Automatically recompiles policies for the entire organization
   * - Invalidates all caches for the target user (decision cache, bitset, permission map)
   * - Emits `role_revoked` event for audit logging and real-time notifications
   * - In multi-process deployments, other processes detect the change via policy version bump
   *
   * @param targetUserId - The user to revoke the role from
   * @param roleTemplateId - The role template ID to revoke
   * @param options - Optional configuration
   * @param options.teamId - If provided, only revokes the role for this specific team
   *
   * @example
   * ```typescript
   * // Revoke org-level role
   * await permission.revokeRole(userId, "role_org_member");
   *
   * // Revoke team-scoped role
   * await permission.revokeRole(userId, "role_team_admin", { teamId });
   *
   * // After revocation, the user's permissions are immediately updated
   * // and other processes detect the change via policy version bump
   * ```
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
   * Create a per-user policy override to grant or deny a specific permission.
   *
   * Creates a policy override record that takes precedence over role-based permissions.
   * Overrides can be org-wide, team-scoped, or resource-specific, and can optionally expire.
   * Triggers policy recompilation and cache invalidation for the target user.
   *
   * **Important Behavior:**
   * - Overrides take precedence over role-based permissions
   * - Can be org-wide (no teamId/resourceId), team-scoped, or resource-specific
   * - Can optionally expire at a specified time (checked during authorization)
   * - Automatically recompiles policies for the entire organization
   * - Invalidates all caches for the target user (decision cache, bitset, permission map)
   * - Emits `policy_override_created` event for audit logging and real-time notifications
   * - In multi-process deployments, other processes detect the change via policy version bump
   *
   * @param targetUserId - The user to create the override for
   * @param permissionNodeId - The permission node ID to override
   * @param effect - "allow" to grant the permission, "deny" to revoke it
   * @param options - Optional configuration
   * @param options.teamId - If provided, scopes the override to this team
   * @param options.resourceId - If provided, scopes the override to this specific resource
   * @param options.reason - Optional reason for the override (for audit purposes)
   * @param options.expiresAt - Optional expiration time (override is ignored after this time)
   *
   * @example
   * ```typescript
   * // Grant a user permission to delete messages (org-wide)
   * await permission.createPolicyOverride(
   *   userId,
   *   permissionNodeId,
   *   "allow",
   *   { reason: "Temporary moderation access" }
   * );
   *
   * // Deny a user permission to create channels (org-wide, expires in 1 hour)
   * await permission.createPolicyOverride(
   *   userId,
   *   permissionNodeId,
   *   "deny",
   *   { expiresAt: new Date(Date.now() + 3600000) }
   * );
   *
   * // Grant a user permission for a specific resource
   * await permission.createPolicyOverride(
   *   userId,
   *   permissionNodeId,
   *   "allow",
   *   { resourceId: channelId, reason: "Channel moderator" }
   * );
   * ```
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
   * Remove a policy override by its ID.
   *
   * Deletes a policy override record from the database, then triggers policy recompilation
   * and cache invalidation for the target user. All admin operations follow the same pattern:
   * write to DB → recompile policies → invalidate caches → emit event.
   *
   * **Important Behavior:**
   * - Deletes the override matching overrideId and orgId
   * - Automatically recompiles policies for the entire organization
   * - Invalidates all caches for the target user (decision cache, bitset, permission map)
   * - Emits `policy_override_removed` event for audit logging and real-time notifications
   * - In multi-process deployments, other processes detect the change via policy version bump
   *
   * @param overrideId - The policy override ID to remove
   * @param targetUserId - The user whose override is being removed (for cache invalidation)
   *
   * @example
   * ```typescript
   * // Remove a policy override
   * await permission.removePolicyOverride(overrideId, userId);
   *
   * // After removal, the user's permissions revert to role-based permissions
   * // and other processes detect the change via policy version bump
   * ```
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
   * Trigger a full policy recompilation for this organization.
   *
   * Recompiles all Casbin rules for the organization from the current DB state
   * (role assignments + policy overrides), then invalidates all org-wide caches.
   * Use this after bulk admin operations to ensure consistency.
   *
   * **Important Behavior:**
   * - Recompiles policies for the entire organization (not just one user)
   * - Invalidates all decision caches for the organization
   * - Bumps the policy version in Redis, invalidating all cached decisions across all processes
   * - Emits `policy_compiled` event for audit logging
   * - Useful after bulk role assignments or override changes
   * - Individual admin operations (assignRole, revokeRole, etc.) call this automatically
   *
   * @example
   * ```typescript
   * // After bulk admin operations
   * await permission.assignRole(user1, role1);
   * await permission.assignRole(user2, role2);
   * await permission.assignRole(user3, role3);
   * // Optionally trigger explicit recompilation (usually not needed)
   * await permission.recompilePolicies();
   *
   * // Or use it to force a refresh after external changes
   * // (e.g., if policies were modified directly in the database)
   * await permission.recompilePolicies();
   * ```
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

  // ---------------------------------------------------------------------------
  // Private Helpers
  // ---------------------------------------------------------------------------

  /**
   * Build a PermissionDescriptor from a permission key string.
   *
   * This is a private helper that converts a permission key string (e.g., "channel.view")
   * into a full PermissionDescriptor object. It looks up the key in the vocabulary,
   * validates it exists, and constructs the descriptor with optional resource ID.
   *
   * **Important Behavior:**
   * - Throws `ORPCError("BAD_REQUEST")` if the permission key is unknown
   * - Constructs the `obj` field by joining resource, subResource, and resourceId with colons
   * - Includes the bitIndex from the vocabulary for bitset pre-filtering
   * - Used internally by `checkByKey()` and `canByKey()` methods
   *
   * @param permissionKey - The permission key string (e.g., "channel.view", "message.delete")
   * @param options - Optional configuration
   * @param options.resourceId - Resource ID to include in the descriptor (e.g., channelId, messageId)
   * @returns PermissionDescriptor with obj, act, permissionKey, and bitIndex
   * @throws ORPCError - With code "BAD_REQUEST" if permission key is unknown
   *
   * @example
   * ```typescript
   * // Build descriptor for "channel.view" with channelId
   * const descriptor = this.buildDescriptorFromKey("channel.view", { resourceId: "ch_123" });
   * // Returns: {
   * //   obj: "channel:view:ch_123",
   * //   act: "channel.view",
   * //   permissionKey: "channel.view",
   * //   bitIndex: 8
   * // }
   * ```
   */
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

  /**
   * Recompile policies and invalidate all caches for a target user.
   *
   * This is a private helper that implements the standard admin operation pattern:
   * 1. Recompile policies for the entire organization
   * 2. Invalidate all caches for the target user (decision cache, bitset, permission map)
   *
   * Called by all admin operations (assignRole, revokeRole, createPolicyOverride, removePolicyOverride)
   * to ensure consistency after DB changes.
   *
   * **Important Behavior:**
   * - Recompiles policies for the entire organization (not just the target user)
   * - Invalidates three separate caches: decision cache, bitset, permission map
   * - Runs cache invalidations in parallel for performance
   * - Policy version bump in Redis automatically invalidates caches in other processes
   * - Should always be called after any DB change to role assignments or policy overrides
   *
   * @param targetUserId - The user whose caches should be invalidated
   *
   * @example
   * ```typescript
   * // After assigning a role to a user
   * await this.db.insert(roleAssignmentTable).values({ ... });
   * await this.recompileAndInvalidate(targetUserId);
   * // Now the user's permissions are updated and caches are cleared
   * ```
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
   * Emit a permission event for audit logging and real-time notifications.
   *
   * This is a private helper that delegates to the PermissionEventManager.
   * The event is processed asynchronously: audit log is written to the database,
   * and Pusher notifications are sent to relevant users/organizations.
   *
   * **Important Behavior:**
   * - Delegates to `eventManager.emit()` for processing
   * - Event processing is asynchronous (fire-and-forget)
   * - Includes audit logging to permission_audit_log table
   * - Includes real-time notifications via Pusher
   * - Called by all admin operations to maintain audit trail
   *
   * @param event - The PermissionEvent to emit
   *
   * @example
   * ```typescript
   * // After assigning a role
   * this.emitEvent({
   *   type: "role_assigned",
   *   orgId: this.orgId,
   *   userId: targetUserId,
   *   actorId: this.userId,
   *   payload: { targetUserId, roleTemplateId, roleName },
   *   timestamp: Date.now(),
   * });
   * ```
   */
  private emitEvent(event: PermissionEvent): void {
    this.eventManager.emit(event);
  }
}
