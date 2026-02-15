import { EventEmitter } from "node:events";
import type { db as Db } from "@work-holo/db";
import { permissionAuditLogTable } from "@work-holo/db/schema/authorization";
import type Pusher from "pusher";
import type { PermissionEvent } from "../lib/types";

/**
 * Type-safe event emitter for permission change events.
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
 * Emits permission domain events and dispatches audit and realtime side effects.
 */
export class PermissionEventManager {
  private readonly db: typeof Db;
  private readonly pusher?: Pusher;
  private readonly bus: PermissionBus;
  private initialized = false;

  constructor(db: typeof Db, pusher?: Pusher) {
    this.db = db;
    this.pusher = pusher;
    this.bus = new PermissionBus();
  }

  /**
   * Registers internal listeners once.
   */
  initialize(): void {
    if (this.initialized) return;
    this.bus.on("permission_change", (event) =>
      this.handlePermissionChange(event)
    );
    this.initialized = true;
  }

  /**
   * Emits a permission change event to subscribers.
   */
  emit(event: PermissionEvent): void {
    this.bus.emit("permission_change", event);
  }

  /**
   * Adds a listener for permission change events.
   */
  on(listener: (data: PermissionEvent) => void): this {
    this.bus.on("permission_change", listener);
    return this;
  }

  /**
   * Removes a listener for permission change events.
   */
  off(listener: (data: PermissionEvent) => void): this {
    this.bus.off("permission_change", listener);
    return this;
  }

  /**
   * Adds a one-time listener for permission change events.
   */
  once(listener: (data: PermissionEvent) => void): this {
    this.bus.once("permission_change", listener);
    return this;
  }

  /**
   * Runs audit and notification side effects for an emitted event.
   */
  private handlePermissionChange(event: PermissionEvent): void {
    this.writeAuditLog(event);
    this.broadcastToOrg(event);
    this.notifyUser(event);
  }

  /**
   * Persists an audit-log record for a permission event.
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
   * Broadcasts a permission event to the organization channel.
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
   * Sends a permission event to the affected user channel when applicable.
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
