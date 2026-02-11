import type {
  AuthResource,
  PermissionAction,
  PermissionDescriptor,
} from "../../core/types";
import { PERMISSION_BY_KEY } from "../vocabulary";

function buildDescriptor(
  orgId: string,
  permissionKey: string,
  resourceId?: string
): PermissionDescriptor {
  const entry = PERMISSION_BY_KEY.get(permissionKey);
  if (!entry) {
    throw new Error(`Unknown permission key: ${permissionKey}`);
  }

  const objParts = [`org:${orgId}`, entry.resource];
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

function createActionTerminal(
  orgId: string,
  permissionKey: string
): PermissionAction {
  return (resourceId?: string) =>
    buildDescriptor(orgId, permissionKey, resourceId);
}

export type OrgDSL = {
  create: PermissionAction;
  view: PermissionAction;
  update: PermissionAction;
  delete: PermissionAction;
  list: PermissionAction;
  invite: {
    create: PermissionAction;
    view: PermissionAction;
    update: PermissionAction;
    delete: PermissionAction;
    resend: PermissionAction;
    list: PermissionAction;
  };
  role: {
    create: PermissionAction;
    view: PermissionAction;
    update: PermissionAction;
    delete: PermissionAction;
    list: PermissionAction;
  };
  context: {
    view: PermissionAction;
    switch: PermissionAction;
  };
};

export function Org(orgId: string): OrgDSL {
  const t = (key: string) => createActionTerminal(orgId, key);

  return {
    create: t("org.create"),
    view: t("org.view"),
    update: t("org.update"),
    delete: t("org.delete"),
    list: t("org.list"),
    invite: {
      create: t("org.invite.create"),
      view: t("org.invite.view"),
      update: t("org.invite.update"),
      delete: t("org.invite.delete"),
      resend: t("org.invite.resend"),
      list: t("org.invite.list"),
    },
    role: {
      create: t("org.role.create"),
      view: t("org.role.view"),
      update: t("org.role.update"),
      delete: t("org.role.delete"),
      list: t("org.role.list"),
    },
    context: {
      view: t("org.context.view"),
      switch: t("org.context.switch"),
    },
  };
}
