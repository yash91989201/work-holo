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

export type MessageDSL = {
  create: PermissionAction;
  view: PermissionAction;
  update: PermissionAction;
  delete: PermissionAction;
  list: PermissionAction;
  search: PermissionAction;
  read: PermissionAction;
  unread_count: PermissionAction;
  react: PermissionAction;
  pin: PermissionAction;
  mention: {
    user: PermissionAction;
    channel: PermissionAction;
  };
  pinList: PermissionAction;
  readersList: PermissionAction;
};

export function Message(): MessageDSL {
  const t = (key: string) => createActionTerminal(key);

  return {
    create: t("message.create"),
    view: t("message.view"),
    update: t("message.update"),
    delete: t("message.delete"),
    list: t("message.list"),
    search: t("message.search"),
    read: t("message.read"),
    unread_count: t("message.unread_count"),
    react: t("message.react"),
    pin: t("message.pin"),
    mention: {
      user: t("message.mention.user"),
      channel: t("message.mention.channel"),
    },
    pinList: t("message.pin.list"),
    readersList: t("message.readers.list"),
  };
}
