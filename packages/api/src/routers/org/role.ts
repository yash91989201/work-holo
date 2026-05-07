import { ORPCError } from "@orpc/server";
import type { db as Db } from "@work-holo/db";
import { member, team, teamMember } from "@work-holo/db/schema/auth";
import {
  permissionNodeTable,
  roleAssignmentTable,
  rolePermissionTable,
  roleTemplateTable,
} from "@work-holo/db/schema/authorization";
import { and, asc, eq, inArray, ne } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";
import {
  AssignCustomRoleInput,
  CreateCustomRoleInput,
  CustomRoleMutationOutput,
  DeleteCustomRoleInput,
  GetMemberRoleAssignmentsInput,
  GetMemberRoleAssignmentsOutput,
  ListCustomRolesInput,
  ListCustomRolesOutput,
  RevokeCustomRoleInput,
  UpdateCustomRoleInput,
} from "../../lib/schemas/org-role";

function buildCustomRoleName(displayName: string): string {
  const normalized = displayName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalized) {
    throw new ORPCError("BAD_REQUEST", {
      message: "Role name must contain letters or numbers",
    });
  }

  return normalized;
}

async function resolveCustomRolePermissionNodes(
  db: typeof Db,
  permissionKeys: string[]
) {
  const uniqueKeys = [...new Set(permissionKeys)];

  const permissionNodes = uniqueKeys.length
    ? await db
        .select({
          id: permissionNodeTable.id,
          key: permissionNodeTable.key,
          resource: permissionNodeTable.resource,
          bitIndex: permissionNodeTable.bitIndex,
        })
        .from(permissionNodeTable)
        .where(inArray(permissionNodeTable.key, uniqueKeys))
    : [];

  if (permissionNodes.length !== uniqueKeys.length) {
    const foundKeys = new Set(permissionNodes.map((node) => node.key));
    const missing = uniqueKeys.filter((key) => !foundKeys.has(key));

    throw new ORPCError("BAD_REQUEST", {
      message: `Unknown permission keys: ${missing.join(", ")}`,
    });
  }

  const invalidNodes = permissionNodes.filter(
    (node) => node.resource === "org"
  );
  if (invalidNodes.length > 0) {
    throw new ORPCError("BAD_REQUEST", {
      message:
        "Custom team roles cannot include organization-scoped permissions",
    });
  }

  return permissionNodes.sort((a, b) => a.bitIndex - b.bitIndex);
}

async function ensureCustomRoleNameAvailable(
  db: typeof Db,
  orgId: string,
  name: string,
  excludeRoleTemplateId?: string
): Promise<void> {
  const existing = await db.query.roleTemplateTable.findMany({
    where: and(
      eq(roleTemplateTable.organizationId, orgId),
      eq(roleTemplateTable.name, name)
    ),
    columns: { id: true },
    limit: 2,
  });

  const conflicting = existing.find((row) => row.id !== excludeRoleTemplateId);
  if (conflicting) {
    throw new ORPCError("BAD_REQUEST", {
      message:
        "A custom role with this name already exists in the organization",
    });
  }
}

async function loadCustomRoleTemplate(
  db: typeof Db,
  orgId: string,
  roleTemplateId: string
) {
  const template = await db.query.roleTemplateTable.findFirst({
    where: eq(roleTemplateTable.id, roleTemplateId),
    columns: {
      id: true,
      name: true,
      displayName: true,
      description: true,
      scope: true,
      isSystem: true,
      organizationId: true,
    },
  });

  if (!template) {
    throw new ORPCError("NOT_FOUND", {
      message: "Custom role not found",
    });
  }

  if (template.isSystem || template.organizationId !== orgId) {
    throw new ORPCError("FORBIDDEN", {
      message: "Custom role does not belong to this organization",
    });
  }

  if (template.scope !== "team") {
    throw new ORPCError("BAD_REQUEST", {
      message: "Only team-scoped custom roles are supported",
    });
  }

  return template;
}

async function getAssignedUserIdsForRoleTemplate(
  db: typeof Db,
  orgId: string,
  roleTemplateId: string
): Promise<string[]> {
  const rows = await db
    .select({ userId: roleAssignmentTable.userId })
    .from(roleAssignmentTable)
    .where(
      and(
        eq(roleAssignmentTable.organizationId, orgId),
        eq(roleAssignmentTable.roleTemplateId, roleTemplateId)
      )
    );

  return [...new Set(rows.map((row) => row.userId))];
}

export const roleRouter = {
  list: orgMemberProcedure
    .input(ListCustomRolesInput)
    .output(ListCustomRolesOutput)
    .handler(async ({ context: { db, permission, orgId } }) => {
      await permission.check(permission.org.role.list());

      const [roles, availablePermissions] = await Promise.all([
        db.query.roleTemplateTable.findMany({
          where: and(
            eq(roleTemplateTable.organizationId, orgId),
            eq(roleTemplateTable.isSystem, false),
            eq(roleTemplateTable.scope, "team")
          ),
          columns: {
            id: true,
            name: true,
            displayName: true,
            description: true,
            scope: true,
            createdAt: true,
            updatedAt: true,
          },
          with: {
            rolePermissions: {
              columns: { id: true },
              with: {
                permissionNode: {
                  columns: { key: true, bitIndex: true },
                },
              },
            },
          },
          orderBy: (table, { asc }) => [asc(table.displayName)],
        }),
        db.query.permissionNodeTable.findMany({
          where: ne(permissionNodeTable.resource, "org"),
          columns: {
            key: true,
            resource: true,
            subResource: true,
            action: true,
            description: true,
            bitIndex: true,
          },
          orderBy: (table, { asc }) => [asc(table.bitIndex)],
        }),
      ]);

      return {
        roles: roles.map((role) => {
          const permissionKeys = role.rolePermissions
            .slice()
            .sort(
              (a, b) => a.permissionNode.bitIndex - b.permissionNode.bitIndex
            )
            .map((entry) => entry.permissionNode.key);

          return {
            id: role.id,
            name: role.name,
            displayName: role.displayName,
            description: role.description,
            scope: role.scope,
            permissionKeys,
            permissionCount: permissionKeys.length,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
          };
        }),
        availablePermissions,
      };
    }),

  create: orgMemberProcedure
    .input(CreateCustomRoleInput)
    .output(CustomRoleMutationOutput)
    .handler(async ({ context: { db, permission, orgId }, input }) => {
      await permission.check(permission.org.role.create());

      const name = buildCustomRoleName(input.displayName);
      const permissionNodes = await resolveCustomRolePermissionNodes(
        db,
        input.permissionKeys
      );

      await ensureCustomRoleNameAvailable(db, orgId, name);

      const inserted = await db.transaction(async (tx) => {
        const [roleTemplate] = await tx
          .insert(roleTemplateTable)
          .values({
            name,
            displayName: input.displayName.trim(),
            description: input.description?.trim() || null,
            scope: "team",
            isSystem: false,
            organizationId: orgId,
          })
          .returning({ id: roleTemplateTable.id });

        if (!roleTemplate) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message: "Failed to create custom role",
          });
        }

        if (permissionNodes.length > 0) {
          await tx.insert(rolePermissionTable).values(
            permissionNodes.map((node) => ({
              roleTemplateId: roleTemplate.id,
              permissionNodeId: node.id,
              effect: "allow" as const,
            }))
          );
        }

        return roleTemplate;
      });

      await permission.recompilePolicies({
        targetRoleId: inserted.id,
        reason: "role_created",
      });

      return {
        success: true,
        roleTemplateId: inserted.id,
      };
    }),

  update: orgMemberProcedure
    .input(UpdateCustomRoleInput)
    .output(CustomRoleMutationOutput)
    .handler(async ({ context: { db, permission, orgId }, input }) => {
      await permission.check(permission.org.role.update());

      await loadCustomRoleTemplate(db, orgId, input.roleTemplateId);
      const assignedUserIds = await getAssignedUserIdsForRoleTemplate(
        db,
        orgId,
        input.roleTemplateId
      );

      const name = buildCustomRoleName(input.displayName);
      const permissionNodes = await resolveCustomRolePermissionNodes(
        db,
        input.permissionKeys
      );

      await ensureCustomRoleNameAvailable(
        db,
        orgId,
        name,
        input.roleTemplateId
      );

      await db.transaction(async (tx) => {
        await tx
          .update(roleTemplateTable)
          .set({
            name,
            displayName: input.displayName.trim(),
            description: input.description?.trim() || null,
            updatedAt: new Date(),
          })
          .where(eq(roleTemplateTable.id, input.roleTemplateId));

        await tx
          .delete(rolePermissionTable)
          .where(eq(rolePermissionTable.roleTemplateId, input.roleTemplateId));

        if (permissionNodes.length > 0) {
          await tx.insert(rolePermissionTable).values(
            permissionNodes.map((node) => ({
              roleTemplateId: input.roleTemplateId,
              permissionNodeId: node.id,
              effect: "allow" as const,
            }))
          );
        }
      });

      await permission.recompilePolicies({
        targetRoleId: input.roleTemplateId,
        affectedUserIds: assignedUserIds,
        reason: "role_permissions_updated",
      });
      await permission.notifyUsersPermissionUpdated(assignedUserIds, {
        targetRoleId: input.roleTemplateId,
        reason: "role_permissions_updated",
      });

      return {
        success: true,
        roleTemplateId: input.roleTemplateId,
      };
    }),

  remove: orgMemberProcedure
    .input(DeleteCustomRoleInput)
    .output(CustomRoleMutationOutput)
    .handler(async ({ context: { db, permission, orgId }, input }) => {
      await permission.check(permission.org.role.delete());

      await loadCustomRoleTemplate(db, orgId, input.roleTemplateId);
      const assignedUserIds = await getAssignedUserIdsForRoleTemplate(
        db,
        orgId,
        input.roleTemplateId
      );

      await db
        .delete(roleTemplateTable)
        .where(eq(roleTemplateTable.id, input.roleTemplateId));

      await permission.recompilePolicies({
        targetRoleId: input.roleTemplateId,
        affectedUserIds: assignedUserIds,
        reason: "role_deleted",
      });
      await permission.notifyUsersPermissionUpdated(assignedUserIds, {
        targetRoleId: input.roleTemplateId,
        reason: "role_deleted",
      });

      return {
        success: true,
        roleTemplateId: input.roleTemplateId,
      };
    }),

  getMemberAssignments: orgMemberProcedure
    .input(GetMemberRoleAssignmentsInput)
    .output(GetMemberRoleAssignmentsOutput)
    .handler(async ({ context: { db, permission, orgId }, input }) => {
      await permission.check(permission.org.role.read());

      const orgMember = await db.query.member.findFirst({
        where: and(
          eq(member.organizationId, orgId),
          eq(member.userId, input.userId)
        ),
        columns: { id: true },
      });

      if (!orgMember) {
        throw new ORPCError("NOT_FOUND", {
          message: "Organization member not found",
        });
      }

      const [assignments, availableRoles, availableTeams] = await Promise.all([
        db
          .select({
            id: roleAssignmentTable.id,
            roleTemplateId: roleAssignmentTable.roleTemplateId,
            roleDisplayName: roleTemplateTable.displayName,
            roleDescription: roleTemplateTable.description,
            teamId: team.id,
            teamName: team.name,
            assignedAt: roleAssignmentTable.assignedAt,
          })
          .from(roleAssignmentTable)
          .innerJoin(
            roleTemplateTable,
            eq(roleAssignmentTable.roleTemplateId, roleTemplateTable.id)
          )
          .innerJoin(team, eq(roleAssignmentTable.teamId, team.id))
          .innerJoin(
            teamMember,
            and(
              eq(teamMember.teamId, team.id),
              eq(teamMember.userId, roleAssignmentTable.userId)
            )
          )
          .where(
            and(
              eq(roleAssignmentTable.userId, input.userId),
              eq(roleAssignmentTable.organizationId, orgId),
              eq(roleTemplateTable.organizationId, orgId),
              eq(roleTemplateTable.isSystem, false),
              eq(roleTemplateTable.scope, "team"),
              eq(team.organizationId, orgId)
            )
          )
          .orderBy(asc(team.name), asc(roleTemplateTable.displayName)),
        db.query.roleTemplateTable.findMany({
          where: and(
            eq(roleTemplateTable.organizationId, orgId),
            eq(roleTemplateTable.isSystem, false),
            eq(roleTemplateTable.scope, "team")
          ),
          columns: {
            id: true,
            displayName: true,
            description: true,
          },
          orderBy: (table, { asc }) => [asc(table.displayName)],
        }),
        db
          .select({
            id: team.id,
            name: team.name,
          })
          .from(teamMember)
          .innerJoin(team, eq(teamMember.teamId, team.id))
          .where(
            and(
              eq(teamMember.userId, input.userId),
              eq(team.organizationId, orgId)
            )
          )
          .orderBy(asc(team.name)),
      ]);

      return {
        assignments,
        availableRoles,
        availableTeams,
      };
    }),

  assign: orgMemberProcedure
    .input(AssignCustomRoleInput)
    .output(CustomRoleMutationOutput)
    .handler(async ({ context: { permission }, input }) => {
      await permission.check(permission.org.role.assign());
      await permission.assignRole(input.userId, input.roleTemplateId, {
        teamId: input.teamId,
      });

      return {
        success: true,
        roleTemplateId: input.roleTemplateId,
      };
    }),

  revoke: orgMemberProcedure
    .input(RevokeCustomRoleInput)
    .output(CustomRoleMutationOutput)
    .handler(async ({ context: { permission }, input }) => {
      await permission.check(permission.org.role.remove());
      await permission.revokeRole(input.userId, input.roleTemplateId, {
        teamId: input.teamId,
      });

      return {
        success: true,
        roleTemplateId: input.roleTemplateId,
      };
    }),
};
