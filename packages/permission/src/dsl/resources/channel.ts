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

export type ChannelDSL = {
  create: PermissionAction;
  view: PermissionAction;
  update: PermissionAction;
  delete: PermissionAction;
  member: {
    list: PermissionAction;
    add: PermissionAction;
    remove: PermissionAction;
    search: PermissionAction;
  };
};

export function Channel(): ChannelDSL {
  const t = (key: string) => createActionTerminal(key);

  return {
    create: t("channel.create"),
    view: t("channel.view"),
    update: t("channel.update"),
    delete: t("channel.delete"),
    member: {
      list: t("channel.member.list"),
      add: t("channel.member.add"),
      remove: t("channel.member.remove"),
      search: t("channel.member.search"),
    },
  };
}
