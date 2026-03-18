import { PERMISSION_BY_KEY } from "./vocabulary";

/**
 * Resolves a permission key to its vocabulary metadata entry.
 */
export function resolvePermissionKey(permissionKey: string) {
  return PERMISSION_BY_KEY.get(permissionKey);
}

/**
 * Resolves a permission key to a bit index, or -1 when unknown.
 */
export function resolvePermissionBitIndex(permissionKey: string): number {
  return resolvePermissionKey(permissionKey)?.bitIndex ?? -1;
}
