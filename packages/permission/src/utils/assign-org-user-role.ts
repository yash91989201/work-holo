import type { db as Db } from "@work-holo/db";
import {
  roleAssignmentTable,
  roleTemplateTable,
} from "@work-holo/db/schema/authorization";
import { and, eq } from "drizzle-orm";
import { PermissionManagers } from "./permission-managers";

/**
 * Assigns an org-scoped system role and recompiles policies for the user.
 */
export async function assignOrgUserRole(
  db: typeof Db,
  userId: string,
  orgId: string,
  role: string
): Promise<void> {
  const template = await db.query.roleTemplateTable.findFirst({
    where: and(
      eq(roleTemplateTable.name, role),
      eq(roleTemplateTable.isSystem, true)
    ),
    columns: { id: true },
  });

  if (!template) return;

  await db
    .insert(roleAssignmentTable)
    .values({
      userId,
      roleTemplateId: template.id,
      organizationId: orgId,
    })
    .onConflictDoNothing();

  const policyManager = PermissionManagers.getPolicyManager();
  await policyManager.compilePolicies(orgId, userId);
}
