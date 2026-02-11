import { PERMISSIONS, SYSTEM_ROLES } from "@work-holo/permission";
import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  permissionNodeTable,
  rolePermissionTable,
  roleTemplateTable,
} from "../schema/authorization";

// All permission keys from the runtime vocabulary
const ALL_KEYS = PERMISSIONS.map((p) => p.key);

// Communication-related keys
const CHANNEL_KEYS = ALL_KEYS.filter((k) => k.startsWith("channel."));
const MESSAGE_KEYS = ALL_KEYS.filter((k) => k.startsWith("message."));
const COMMUNICATION_KEYS = [...CHANNEL_KEYS, ...MESSAGE_KEYS];

// Attendance keys
const ATTENDANCE_KEYS = ALL_KEYS.filter((k) => k.startsWith("attendance."));
const ATTENDANCE_VIEW_KEYS = ATTENDANCE_KEYS.filter(
  (k) => k.endsWith(".view") || k.endsWith(".list") || k.endsWith(".create")
);

// Role permission assignments using runtime vocabulary keys
const ROLE_PERMISSIONS: Record<string, string[]> = {
  [SYSTEM_ROLES.ORG_OWNER]: ALL_KEYS,
  [SYSTEM_ROLES.ORG_ADMIN]: ALL_KEYS.filter(
    (k) => !(k === "org.delete" || k === "org.create")
  ),
  [SYSTEM_ROLES.ORG_MEMBER]: [
    ...COMMUNICATION_KEYS,
    ...ATTENDANCE_VIEW_KEYS,
    "org.view",
    "org.context.view",
    "org.context.switch",
    "team.view",
    "team.member.view",
    "module.access",
  ],
  [SYSTEM_ROLES.TEAM_ADMIN]: [
    ...COMMUNICATION_KEYS,
    ...ATTENDANCE_KEYS,
    "team.update",
    "team.view",
    "team.member.add",
    "team.member.remove",
    "team.member.view",
    "team.module.enable",
    "team.module.disable",
    "module.access",
  ],
  [SYSTEM_ROLES.TEAM_MEMBER]: [
    ...COMMUNICATION_KEYS,
    ...ATTENDANCE_VIEW_KEYS,
    "team.view",
    "team.member.view",
    "module.access",
  ],
};

const ROLE_DEFINITIONS: Array<{
  name: string;
  displayName: string;
  description: string;
  scope: "org" | "team";
}> = [
  {
    name: SYSTEM_ROLES.ORG_OWNER,
    displayName: "Organization Owner",
    description: "Full access to all organization resources and settings",
    scope: "org",
  },
  {
    name: SYSTEM_ROLES.ORG_ADMIN,
    displayName: "Organization Admin",
    description:
      "Administrative access to organization resources (cannot delete or create organizations)",
    scope: "org",
  },
  {
    name: SYSTEM_ROLES.ORG_MEMBER,
    displayName: "Organization Member",
    description:
      "Standard member access to communication and basic organization features",
    scope: "org",
  },
  {
    name: SYSTEM_ROLES.TEAM_ADMIN,
    displayName: "Team Admin",
    description:
      "Administrative access to team resources including member management",
    scope: "team",
  },
  {
    name: SYSTEM_ROLES.TEAM_MEMBER,
    displayName: "Team Member",
    description: "Standard member access to team communication and attendance",
    scope: "team",
  },
];

async function seedPermissions() {
  console.log("Seeding permission nodes...");

  for (const perm of PERMISSIONS) {
    await db
      .insert(permissionNodeTable)
      .values({
        key: perm.key,
        resource: perm.resource,
        subResource: perm.subResource,
        action: perm.action,
        description: perm.description,
        bitIndex: perm.bitIndex,
      })
      .onConflictDoUpdate({
        target: permissionNodeTable.key,
        set: {
          resource: perm.resource,
          subResource: perm.subResource,
          action: perm.action,
          description: perm.description,
          bitIndex: perm.bitIndex,
        },
      });
  }

  console.log(`  ${PERMISSIONS.length} permission nodes seeded`);

  console.log("Seeding system role templates...");

  const roleMap = new Map<string, string>();

  for (const roleDef of ROLE_DEFINITIONS) {
    const [existing] = await db
      .select({ id: roleTemplateTable.id })
      .from(roleTemplateTable)
      .where(eq(roleTemplateTable.name, roleDef.name))
      .limit(1);

    if (existing) {
      await db
        .update(roleTemplateTable)
        .set({
          displayName: roleDef.displayName,
          description: roleDef.description,
          scope: roleDef.scope,
          isSystem: true,
        })
        .where(eq(roleTemplateTable.id, existing.id));
      roleMap.set(roleDef.name, existing.id);
    } else {
      const [inserted] = await db
        .insert(roleTemplateTable)
        .values({
          name: roleDef.name,
          displayName: roleDef.displayName,
          description: roleDef.description,
          scope: roleDef.scope,
          isSystem: true,
        })
        .returning({ id: roleTemplateTable.id });

      if (inserted) {
        roleMap.set(roleDef.name, inserted.id);
      }
    }
  }

  console.log(`  ${ROLE_DEFINITIONS.length} system role templates seeded`);

  // Build permissionKey -> permissionNodeId map
  const allNodes = await db
    .select({ id: permissionNodeTable.id, key: permissionNodeTable.key })
    .from(permissionNodeTable);

  const nodeByKey = new Map<string, string>();
  for (const node of allNodes) {
    nodeByKey.set(node.key, node.id);
  }

  console.log("Seeding role permissions...");

  let totalRolePerms = 0;

  for (const [roleName, permKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) {
      console.warn(`  Role ${roleName} not found, skipping permissions`);
      continue;
    }

    for (const key of permKeys) {
      const nodeId = nodeByKey.get(key);
      if (!nodeId) {
        console.warn(`  Permission node ${key} not found, skipping`);
        continue;
      }

      await db
        .insert(rolePermissionTable)
        .values({
          roleTemplateId: roleId,
          permissionNodeId: nodeId,
          effect: "allow",
        })
        .onConflictDoNothing();

      totalRolePerms++;
    }
  }

  console.log(`  ${totalRolePerms} role-permission mappings seeded`);
  console.log("Permission seeding complete!");
}

seedPermissions()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
