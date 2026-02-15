import type {
  AuthResource,
  PermissionAction,
  PermissionDescriptor,
} from "../types";
import { PERMISSION_BY_KEY } from "../vocabulary";

/**
 * Builds a permission descriptor from key plus optional scope/resource context.
 */
export function buildDescriptor(
  permissionKey: string,
  resourceId?: string,
  scope?: { type: "org" | "team"; id: string }
): PermissionDescriptor {
  const entry = PERMISSION_BY_KEY.get(permissionKey);
  if (!entry) {
    throw new Error(`Unknown permission key: ${permissionKey}`);
  }

  const objParts: string[] = [];
  if (scope?.type === "team") {
    objParts.push(`team:${scope.id}`);
  }

  objParts.push(entry.resource);
  if (entry.subResources.length > 0) {
    objParts.push(...entry.subResources);
  }
  if (resourceId) {
    objParts.push(resourceId);
  }

  return {
    obj: objParts.join(":"),
    act: permissionKey,
    permissionKey: permissionKey as `${AuthResource}.${string}`,
    bitIndex: entry.bitIndex,
  };
}

/**
 * Creates an action terminal that optionally accepts a resource ID.
 */
export function createActionTerminal(permissionKey: string): PermissionAction {
  return (resourceId?: string) => buildDescriptor(permissionKey, resourceId);
}

/**
 * Creates an action terminal fixed to an org/team scope.
 */
export function createScopedActionTerminal(
  scopeType: "org" | "team",
  scopeId: string,
  permissionKey: string
): PermissionAction {
  return (resourceId?: string) =>
    buildDescriptor(permissionKey, resourceId, {
      type: scopeType,
      id: scopeId,
    });
}
