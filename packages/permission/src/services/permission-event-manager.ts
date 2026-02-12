import { EventEmitter } from "node:events";
import type { db as Db } from "@work-holo/db";
import { permissionAuditLogTable } from "@work-holo/db/schema/authorization";
import type { PermissionEvent, PusherLike } from "../lib/types";

/**
 * Typed EventEmitter wrapper for permission change events
 *
 * **PermissionBus** provides type-safe event handling by overriding EventEmitter methods
 * with strongly-typed signatures for the "permission_change" event.
 *
 * This ensures compile-time type safety when emitting or listening to permission events.
 */
class PermissionBus extends EventEmitter {
  emit(event: "permission_change", data: PermissionEvent): boolean {
    return super.emit(event, data);
  }

  on(
    event: "permission_change",
    listener: (data: PermissionEvent) => void
  ): this {
    return super.on(event, listener);
  }

  off(
    event: "permission_change",
    listener: (data: PermissionEvent) => void
  ): this {
    return super.off(event, listener);
  }

  once(
    event: "permission_change",
    listener: (data: PermissionEvent) => void
  ): this {
    return super.once(event, listener);
  }
}

/**
 * Event bus and side-effect manager for permission system changes
 *
 * **PermissionEventManager** coordinates three side-effects when permissions change:
 * 1. **Audit Logging**: Immutable write to `permission_audit_log` table
 * 2. **Org Broadcast**: Real-time notification to all org members via Pusher
 * 3. **User Notification**: Direct notification to affected user via Pusher
 *
 * **Event Types:**
 * - `role_assigned` - User granted a role
 * - `role_revoked` - User lost a role
 * - `policy_override_created` - Direct permission grant/deny added
 * - `policy_override_removed` - Override removed
 * - `policy_compiled` - Policies recompiled for organization
 *
 * **Event Payload Structure:**
 * ```typescript
 * {
 *   type: PermissionEventType,
 *   orgId: string,
 *   teamId?: string,
 *   userId?: string,       // target user (not actor)
 *   actorId: string,       // who performed the action
 *   payload: Record<string, unknown>,  // event-specific data
 *   timestamp: number      // Date.now()
 * }
 * ```
 *
 * **Side-Effect Handlers:**
 * - `writeAuditLog()`: INSERT to DB (fire-and-forget, errors logged)
 * - `broadcastToOrg()`: Pusher trigger to `private-org-<orgId>` / "permission:change"
 * - `notifyUser()`: Pusher trigger to `private-user-<userId>` / "permission:update"
 *
 * **Initialization:**
 * - Must call `initialize()` once to register event handlers
 * - Idempotent (has initialized guard)
 * - Typically called at server startup
 *
 * **Error Handling:**
 * - All side-effects are fire-and-forget (don't block main flow)
 * - Errors caught and logged to console
 * - Failed audit logs or notifications don't prevent authorization
 *
 * @example
 * ```typescript
 * const eventManager = new PermissionEventManager(db, pusher);
 * eventManager.initialize();  // Register handlers (once at startup)
 *
 * // Emit permission event (from PermissionService admin operations)
 * eventManager.emit({
 *   type: "role_assigned",
 *   orgId: "org_123",
 *   userId: "user_456",  // target user
 *   actorId: "user_789",  // admin who performed action
 *   payload: { roleTemplateId: "role_abc", teamId: "team_xyz" },
 *   timestamp: Date.now()
 * });
 * // → Audit log written, org notified, user notified
 *
 * // Listen to permission changes (optional, for custom logic)
 * eventManager.on((event) => {
 *   console.log(`Permission changed: ${event.type}`);
 * });
 * ```
 */
export class PermissionEventManager {
  /** Database connection for audit log writes */
  private readonly db: typeof Db;

  /** Optional Pusher client for real-time notifications */
  private readonly pusher?: PusherLike;

  /** Typed EventEmitter for permission_change events */
  private readonly bus: PermissionBus;

  /** Initialization guard to prevent duplicate handler registration */
  private initialized = false;

  constructor(db: typeof Db, pusher?: PusherLike) {
    this.db = db;
    this.pusher = pusher;
    this.bus = new PermissionBus();
  }

  /**
   * Register event handlers for permission change events
   *
   * **Idempotency:**
   * - Safe to call multiple times (has initialized guard)
   * - Only registers handlers on first call
   *
   * **When to Call:**
   * - Once at server startup after creating PermissionEventManager
   * - Before any permission changes occur
   *
   * **What It Does:**
   * - Registers `handlePermissionChange()` listener on internal bus
   * - Sets initialized flag to prevent duplicate registration
   */
  initialize(): void {
    if (this.initialized) return;
    this.bus.on("permission_change", (event) =>
      this.handlePermissionChange(event)
    );
    this.initialized = true;
  }

  /**
   * Emit a permission change event to all registered listeners
   *
   * **Triggers Side-Effects:**
   * 1. Audit log write to `permission_audit_log` table
   * 2. Pusher broadcast to org (all members notified)
   * 3. Pusher notification to specific user (if userId present)
   *
   * **Fire-and-Forget:**
   * - Does not wait for side-effects to complete
   * - Side-effect errors logged but don't throw
   *
   * @param event - Permission event with type, orgId, actorId, payload, timestamp
   */
  emit(event: PermissionEvent): void {
    this.bus.emit("permission_change", event);
  }

  /**
   * Register a listener for permission change events
   *
   * @param listener - Function called with PermissionEvent when changes occur
   * @returns This instance for chaining
   */
  on(listener: (data: PermissionEvent) => void): this {
    this.bus.on("permission_change", listener);
    return this;
  }

  /**
   * Unregister a listener for permission change events
   *
   * @param listener - Previously registered listener function
   * @returns This instance for chaining
   */
  off(listener: (data: PermissionEvent) => void): this {
    this.bus.off("permission_change", listener);
    return this;
  }

  /**
   * Register a one-time listener for permission change events
   *
   * **Behavior:**
   * - Listener automatically removed after first invocation
   *
   * @param listener - Function called once with PermissionEvent
   * @returns This instance for chaining
   */
  once(listener: (data: PermissionEvent) => void): this {
    this.bus.once("permission_change", listener);
    return this;
  }

  /**
   * Orchestrate all side-effects for a permission change event
   *
   * **Side-Effects (all fire-and-forget):**
   * 1. Write audit log to DB
   * 2. Broadcast to organization channel (Pusher)
   * 3. Notify affected user (Pusher)
   *
   * **Error Handling:**
   * - Each side-effect catches its own errors
   * - Failures logged to console
   * - One failing side-effect doesn't block others
   *
   * @param event - Permission change event to process
   */
  private handlePermissionChange(event: PermissionEvent): void {
    this.writeAuditLog(event);
    this.broadcastToOrg(event);
    this.notifyUser(event);
  }

  /**
   * Write immutable audit log entry to database
   *
   * **Audit Log Schema:**
   * - organizationId: Which org the change occurred in
   * - actorId: Who performed the action
   * - action: Event type (role_assigned, etc.)
   * - targetUserId: User affected by change (if applicable)
   * - targetRoleId: Role involved (if applicable)
   * - targetPermissionId: Permission involved (if applicable)
   * - details: Full event payload as JSON string
   * - createdAt: Timestamp (auto-set by DB)
   *
   * **Fire-and-Forget:**
   * - DB insert not awaited (async operation)
   * - Errors caught and logged to console
   * - Failed audit writes don't block authorization
   *
   * @param event - Permission event to audit
   */
  private writeAuditLog(event: PermissionEvent): void {
    this.db
      .insert(permissionAuditLogTable)
      .values({
        organizationId: event.orgId,
        actorId: event.actorId,
        action: event.type,
        targetUserId: (event.payload.targetUserId as string) ?? null,
        targetRoleId: (event.payload.targetRoleId as string) ?? null,
        targetPermissionId:
          (event.payload.targetPermissionId as string) ?? null,
        details: JSON.stringify(event.payload),
      })
      .catch((err: unknown) => {
        console.error(
          "[permission-event-manager] Failed to write audit log:",
          err
        );
      });
  }

  /**
   * Broadcast permission change to all organization members via Pusher
   *
   * **Channel Format:** `private-org-<orgId>`
   * **Event Name:** `permission:change`
   *
   * **Payload:**
   * - type: Event type (role_assigned, etc.)
   * - orgId: Organization ID
   * - teamId: Team ID (if team-scoped change)
   * - timestamp: When change occurred
   *
   * **When Skipped:**
   * - If Pusher client not configured (pusher === undefined)
   *
   * **Error Handling:**
   * - Pusher trigger not awaited
   * - Errors caught and logged
   *
   * @param event - Permission event to broadcast
   */
  private broadcastToOrg(event: PermissionEvent): void {
    if (!this.pusher) return;

    const channel = `private-org-${event.orgId}`;
    this.pusher
      .trigger(channel, "permission:change", {
        type: event.type,
        orgId: event.orgId,
        teamId: event.teamId,
        timestamp: event.timestamp,
      })
      .catch((err: unknown) => {
        console.error(
          "[permission-event-manager] Failed to broadcast to org:",
          err
        );
      });
  }

  /**
   * Send direct notification to affected user via Pusher
   *
   * **Channel Format:** `private-user-<userId>`
   * **Event Name:** `permission:update`
   *
   * **Payload:**
   * - type: Event type
   * - orgId: Organization ID
   * - teamId: Team ID (if applicable)
   * - timestamp: When change occurred
   * - payload: Full event payload (includes role/permission details)
   *
   * **When Skipped:**
   * - If event.userId is undefined (no specific target user)
   * - If Pusher client not configured
   *
   * **Error Handling:**
   * - Pusher trigger not awaited
   * - Errors caught and logged
   *
   * @param event - Permission event to notify user about
   */
  private notifyUser(event: PermissionEvent): void {
    if (!event.userId) return;
    if (!this.pusher) return;

    const channel = `private-user-${event.userId}`;
    this.pusher
      .trigger(channel, "permission:update", {
        type: event.type,
        orgId: event.orgId,
        teamId: event.teamId,
        timestamp: event.timestamp,
        payload: event.payload,
      })
      .catch((err: unknown) => {
        console.error("[permission-event-manager] Failed to notify user:", err);
      });
  }
}
