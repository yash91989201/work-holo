import { permissionAuditLogTable } from "@work-holo/db/schema/authorization";
import type { PermissionEvent } from "../../core/types";
import { getDb, getPusher } from "../config";
import { permissionBus } from "./bus";

function writeAuditLog(event: PermissionEvent): void {
  const db = getDb();
  db.insert(permissionAuditLogTable)
    .values({
      organizationId: event.orgId,
      actorId: event.actorId,
      action: event.type,
      targetUserId: (event.payload.targetUserId as string) ?? null,
      targetRoleId: (event.payload.targetRoleId as string) ?? null,
      targetPermissionId: (event.payload.targetPermissionId as string) ?? null,
      details: JSON.stringify(event.payload),
    })
    .catch((err: unknown) => {
      console.error("[permission-emitter] Failed to write audit log:", err);
    });
}

function broadcastToOrg(event: PermissionEvent): void {
  const pusher = getPusher();
  if (!pusher) return;

  const channel = `private-org-${event.orgId}`;
  pusher
    .trigger(channel, "permission:change", {
      type: event.type,
      orgId: event.orgId,
      teamId: event.teamId,
      timestamp: event.timestamp,
    })
    .catch((err: unknown) => {
      console.error("[permission-emitter] Failed to broadcast to org:", err);
    });
}

function notifyUser(event: PermissionEvent): void {
  if (!event.userId) return;

  const pusher = getPusher();
  if (!pusher) return;

  const channel = `private-user-${event.userId}`;
  pusher
    .trigger(channel, "permission:update", {
      type: event.type,
      orgId: event.orgId,
      teamId: event.teamId,
      timestamp: event.timestamp,
      payload: event.payload,
    })
    .catch((err: unknown) => {
      console.error("[permission-emitter] Failed to notify user:", err);
    });
}

function handlePermissionChange(event: PermissionEvent): void {
  writeAuditLog(event);
  broadcastToOrg(event);
  notifyUser(event);
}

let initialized = false;

export function initPermissionEmitter(): void {
  if (initialized) return;
  permissionBus.on("permission_change", handlePermissionChange);
  initialized = true;
}

export function emitPermissionEvent(event: PermissionEvent): void {
  permissionBus.emit("permission_change", event);
}
