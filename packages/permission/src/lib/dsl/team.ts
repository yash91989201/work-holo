import type {
  AuthResource,
  PermissionAction,
  PermissionDescriptor,
} from "../types";
import { PERMISSION_BY_KEY } from "../vocabulary";

function buildDescriptor(
  teamId: string,
  permissionKey: string,
  resourceId?: string
): PermissionDescriptor {
  const entry = PERMISSION_BY_KEY.get(permissionKey);
  if (!entry) {
    throw new Error(`Unknown permission key: ${permissionKey}`);
  }

  const objParts = [`team:${teamId}`, entry.resource];
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
  teamId: string,
  permissionKey: string
): PermissionAction {
  return (resourceId?: string) =>
    buildDescriptor(teamId, permissionKey, resourceId);
}

export type TeamDSL = {
  create: PermissionAction;
  view: PermissionAction;
  update: PermissionAction;
  delete: PermissionAction;
  member: {
    add: PermissionAction;
    remove: PermissionAction;
    view: PermissionAction;
  };
  role: {
    create: PermissionAction;
    assign: PermissionAction;
    update: PermissionAction;
    delete: PermissionAction;
  };
  module: {
    enable: PermissionAction;
    disable: PermissionAction;
  };
};

export function Team(teamId: string): TeamDSL {
  const t = (key: string) => createActionTerminal(teamId, key);

  return {
    create: t("team.create"),
    view: t("team.view"),
    update: t("team.update"),
    delete: t("team.delete"),
    member: {
      add: t("team.member.add"),
      remove: t("team.member.remove"),
      view: t("team.member.view"),
    },
    role: {
      create: t("team.role.create"),
      assign: t("team.role.assign"),
      update: t("team.role.update"),
      delete: t("team.role.delete"),
    },
    module: {
      enable: t("team.module.enable"),
      disable: t("team.module.disable"),
    },
  };
}
