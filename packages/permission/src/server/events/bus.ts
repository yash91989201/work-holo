import { EventEmitter } from "node:events";
import type { PermissionEvent } from "../../core/types";

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

export const permissionBus = new PermissionBus();
