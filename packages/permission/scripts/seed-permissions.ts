import { db } from "@work-holo/db";
import {
  permissionNodeTable,
  rolePermissionTable,
  roleTemplateTable,
} from "@work-holo/db/schema/authorization";
import { PERMISSIONS, SYSTEM_ROLES } from "@work-holo/permission";
import { eq, inArray } from "drizzle-orm";

// All permission keys from the runtime vocabulary
const ALL_KEYS = PERMISSIONS.map((p) => p.key);

// Communication-related keys
const CHANNEL_KEYS = ALL_KEYS.filter((k) => k.startsWith("channel."));
const COMMUNICATION_KEYS = [...CHANNEL_KEYS];
const MEMBER_BLOCKED_CHANNEL_KEYS = new Set([
  "channel.create",
  "channel.update",
  "channel.delete",
]);
const MEMBER_COMMUNICATION_KEYS = COMMUNICATION_KEYS.filter(
  (key) => !MEMBER_BLOCKED_CHANNEL_KEYS.has(key)
);

// Attendance keys
const ATTENDANCE_KEYS = ALL_KEYS.filter((k) => k.startsWith("attendance."));
const ATTENDANCE_VIEW_KEYS = ATTENDANCE_KEYS.filter(
  (k) => k.endsWith(".read") || k.endsWith(".list") || k.endsWith(".create")
);

// Role permission assignments using runtime vocabulary keys
const ROLE_PERMISSIONS: Record<string, string[]> = {
  [SYSTEM_ROLES.OWNER]: ALL_KEYS,
  [SYSTEM_ROLES.ADMIN]: ALL_KEYS.filter(
    (k) => !(k === "org.delete" || k === "org.create")
  ),
  [SYSTEM_ROLES.MEMBER]: [
    ...MEMBER_COMMUNICATION_KEYS,
    ...ATTENDANCE_VIEW_KEYS,
    "org.read",
    "org.active.read",
    "org.active.switch",
    "team.read",
    "team.member.read",
    "team.module.access",
  ],
};

const ROLE_DEFINITIONS: Array<{
  name: string;
  displayName: string;
  description: string;
  scope: "org" | "team";
}> = [
  {
    name: SYSTEM_ROLES.OWNER,
    displayName: "Owner",
    description: "Full access to all organization resources and settings",
    scope: "org",
  },
  {
    name: SYSTEM_ROLES.ADMIN,
    displayName: "Admin",
    description:
      "Administrative access to organization resources (cannot delete or create organizations)",
    scope: "org",
  },
  {
    name: SYSTEM_ROLES.MEMBER,
    displayName: "Member",
    description:
      "Standard member access to communication and basic organization features",
    scope: "org",
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
        subResource: perm.subResources.join("."),
        action: perm.action,
        description: perm.description,
        bitIndex: perm.bitIndex,
      })
      .onConflictDoUpdate({
        target: permissionNodeTable.key,
        set: {
          resource: perm.resource,
          subResource: perm.subResources.join("."),
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

    const existingRolePerms = await db
      .select({
        id: rolePermissionTable.id,
        permissionNodeId: rolePermissionTable.permissionNodeId,
      })
      .from(rolePermissionTable)
      .where(eq(rolePermissionTable.roleTemplateId, roleId));

    const desiredNodeIds = new Set<string>();

    for (const key of permKeys) {
      const nodeId = nodeByKey.get(key);
      if (!nodeId) {
        console.warn(`  Permission node ${key} not found, skipping`);
        continue;
      }

      desiredNodeIds.add(nodeId);

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

    const staleRolePermissionIds = existingRolePerms
      .filter((row) => !desiredNodeIds.has(row.permissionNodeId))
      .map((row) => row.id);

    if (staleRolePermissionIds.length > 0) {
      await db
        .delete(rolePermissionTable)
        .where(inArray(rolePermissionTable.id, staleRolePermissionIds));
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
