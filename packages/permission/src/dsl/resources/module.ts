import type {
  AuthResource,
  PermissionAction,
  PermissionDescriptor,
} from "../../core/types";
import { PERMISSION_BY_KEY } from "../vocabulary";

function buildDescriptor(
  permissionKey: string,
  resourceId?: string
): PermissionDescriptor {
  const entry = PERMISSION_BY_KEY.get(permissionKey);
  if (!entry) {
    throw new Error(`Unknown permission key: ${permissionKey}`);
  }

  const objParts: string[] = [entry.resource];
  if (entry.subResource) {
    objParts.push(entry.subResource);
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

function createActionTerminal(permissionKey: string): PermissionAction {
  return (resourceId?: string) => buildDescriptor(permissionKey, resourceId);
}

export type ModuleDSL = {
  access: PermissionAction;
};

export function Module(): ModuleDSL {
  const t = (key: string) => createActionTerminal(key);

  return {
    access: t("module.access"),
  };
}
