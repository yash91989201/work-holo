import type { db as Db } from "@work-holo/db";
import {
  roleAssignmentTable,
  roleTemplateTable,
} from "@work-holo/db/schema/authorization";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { PermissionManagers } from "./permission-managers";

/**
 * Synchronizes the persisted org-scoped system role assignment with Better Auth membership.
 */
export async function assignOrgUserRole(
  db: typeof Db,
  userId: string,
  orgId: string,
  role: string
): Promise<void> {
  const systemTemplates = await db.query.roleTemplateTable.findMany({
    where: and(
      eq(roleTemplateTable.isSystem, true),
      eq(roleTemplateTable.scope, "org"),
      isNull(roleTemplateTable.organizationId)
    ),
    columns: { id: true, name: true },
  });

  const systemTemplateIds = systemTemplates.map((template) => template.id);
  const template = systemTemplates.find((entry) => entry.name === role);

  const currentAssignments =
    systemTemplateIds.length > 0
      ? await db
          .select({ roleTemplateId: roleAssignmentTable.roleTemplateId })
          .from(roleAssignmentTable)
          .where(
            and(
              eq(roleAssignmentTable.userId, userId),
              eq(roleAssignmentTable.organizationId, orgId),
              isNull(roleAssignmentTable.teamId),
              inArray(roleAssignmentTable.roleTemplateId, systemTemplateIds)
            )
          )
      : [];

  const alreadySynchronized = template
    ? currentAssignments.length === 1 &&
      currentAssignments[0]?.roleTemplateId === template.id
    : currentAssignments.length === 0;

  if (alreadySynchronized) {
    return;
  }

  if (systemTemplateIds.length > 0) {
    await db
      .delete(roleAssignmentTable)
      .where(
        and(
          eq(roleAssignmentTable.userId, userId),
          eq(roleAssignmentTable.organizationId, orgId),
          isNull(roleAssignmentTable.teamId),
          inArray(roleAssignmentTable.roleTemplateId, systemTemplateIds)
        )
      );
  }

  if (template) {
    await db
      .insert(roleAssignmentTable)
      .values({
        userId,
        roleTemplateId: template.id,
        organizationId: orgId,
      })
      .onConflictDoNothing();
  }

  const { cacheManager, permissionMapManager, policyManager } =
    PermissionManagers.getAll();
  await policyManager.compilePolicies(orgId, userId);
  await Promise.all([
    cacheManager.invalidateUserCache(userId, orgId),
    cacheManager.invalidateBitset(userId, orgId),
    permissionMapManager.invalidatePermissionMap(userId, orgId),
  ]);
}
