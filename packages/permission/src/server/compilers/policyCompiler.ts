import {
  policyOverrideTable,
  policyVersionTable,
  roleAssignmentTable,
  rolePermissionTable,
  roleTemplateTable,
} from "@work-holo/db/schema/authorization";
import { casbinRule } from "@work-holo/db/schema/casbin";
import { and, eq, gt, inArray, isNull, or } from "drizzle-orm";
import type {
  CompilationResult,
  CompiledGroupingPolicy,
  CompiledPolicy,
  PolicyEffect,
} from "../../core/types";
import { reloadPolicies, setPolicyVersion } from "../authorization/enforcer";
import { getDb } from "../config";

type RoleAssignmentRow = {
  userId: string;
  roleTemplateId: string;
  organizationId: string;
  teamId: string | null;
  roleTemplate: {
    name: string;
    scope: "org" | "team";
  };
};

type RolePermissionRow = {
  roleTemplateId: string;
  effect: string;
  permissionNode: {
    key: string;
    resource: string;
    subResource: string;
  };
  roleTemplate: {
    name: string;
    scope: "org" | "team";
  };
};

type PolicyOverrideRow = {
  userId: string;
  organizationId: string;
  teamId: string | null;
  resourceId: string | null;
  effect: string;
  expiresAt: Date | null;
  permissionNode: {
    key: string;
    resource: string;
    subResource: string;
  };
};

function buildDomain(orgId: string): string {
  return `org:${orgId}`;
}

function buildObject(
  scope: "org" | "team",
  resource: string,
  subResource: string,
  scopeId?: string | null,
  resourceId?: string | null
): string {
  const parts: string[] = [];

  if (scope === "team" && scopeId) {
    parts.push(`team:${scopeId}`);
  }

  parts.push(resource);
  if (subResource) {
    parts.push(subResource);
  }

  if (resourceId) {
    parts.push(resourceId);
  }

  return parts.join(":");
}

function buildRoleName(
  roleName: string,
  scope: "org" | "team",
  teamId?: string | null
): string {
  if (scope === "team" && teamId) {
    return `role:${roleName}:team:${teamId}`;
  }
  return `role:${roleName}`;
}

function compileGroupingPolicies(
  assignments: RoleAssignmentRow[]
): CompiledGroupingPolicy[] {
  return assignments.map((a) => ({
    ptype: "g" as const,
    user: a.userId,
    role: buildRoleName(a.roleTemplate.name, a.roleTemplate.scope, a.teamId),
    domain: buildDomain(a.organizationId),
  }));
}

function compileRolePolicies(
  permissions: RolePermissionRow[],
  orgId: string
): CompiledPolicy[] {
  return permissions.map((rp) => ({
    ptype: "p" as const,
    sub: buildRoleName(rp.roleTemplate.name, rp.roleTemplate.scope),
    dom: buildDomain(orgId),
    obj: buildObject(
      rp.roleTemplate.scope,
      rp.permissionNode.resource,
      rp.permissionNode.subResource
    ),
    act: rp.permissionNode.key,
    eft: rp.effect as PolicyEffect,
  }));
}

function compileOverridePolicies(
  overrides: PolicyOverrideRow[]
): CompiledPolicy[] {
  const now = new Date();

  return overrides
    .filter((o) => !o.expiresAt || o.expiresAt > now)
    .map((o) => ({
      ptype: "p" as const,
      sub: o.userId,
      dom: buildDomain(o.organizationId),
      obj: buildObject(
        o.teamId ? "team" : "org",
        o.permissionNode.resource,
        o.permissionNode.subResource,
        o.teamId,
        o.resourceId
      ),
      act: o.permissionNode.key,
      eft: o.effect as PolicyEffect,
    }));
}

async function fetchRoleAssignments(
  orgId: string
): Promise<RoleAssignmentRow[]> {
  const db = getDb();
  const rows = await db.query.roleAssignmentTable.findMany({
    where: eq(roleAssignmentTable.organizationId, orgId),
    columns: {
      userId: true,
      roleTemplateId: true,
      organizationId: true,
      teamId: true,
    },
    with: {
      roleTemplate: {
        columns: {
          name: true,
          scope: true,
        },
      },
    },
  });

  return rows as RoleAssignmentRow[];
}

async function fetchRolePermissions(
  orgId: string
): Promise<RolePermissionRow[]> {
  const db = getDb();
  const templates = await db.query.roleTemplateTable.findMany({
    where: or(
      eq(roleTemplateTable.organizationId, orgId),
      and(
        eq(roleTemplateTable.isSystem, true),
        isNull(roleTemplateTable.organizationId)
      )
    ),
    columns: { id: true },
  });

  const templateIds = templates.map((t) => t.id);
  if (templateIds.length === 0) return [];

  const rows = await db.query.rolePermissionTable.findMany({
    where: inArray(rolePermissionTable.roleTemplateId, templateIds),
    columns: {
      roleTemplateId: true,
      effect: true,
    },
    with: {
      permissionNode: {
        columns: {
          key: true,
          resource: true,
          subResource: true,
        },
      },
      roleTemplate: {
        columns: {
          name: true,
          scope: true,
        },
      },
    },
  });

  return rows as RolePermissionRow[];
}

async function fetchPolicyOverrides(
  orgId: string
): Promise<PolicyOverrideRow[]> {
  const db = getDb();
  const rows = await db.query.policyOverrideTable.findMany({
    where: and(
      eq(policyOverrideTable.organizationId, orgId),
      or(
        isNull(policyOverrideTable.expiresAt),
        gt(policyOverrideTable.expiresAt, new Date())
      )
    ),
    columns: {
      userId: true,
      organizationId: true,
      teamId: true,
      resourceId: true,
      effect: true,
      expiresAt: true,
    },
    with: {
      permissionNode: {
        columns: {
          key: true,
          resource: true,
          subResource: true,
        },
      },
    },
  });

  return rows as PolicyOverrideRow[];
}

async function getOrCreatePolicyVersion(
  orgId: string
): Promise<{ id: string; version: number }> {
  const db = getDb();
  const existing = await db.query.policyVersionTable.findFirst({
    where: eq(policyVersionTable.organizationId, orgId),
    orderBy: (table, { desc }) => [desc(table.version)],
    columns: { id: true, version: true },
  });

  const nextVersion = existing ? existing.version + 1 : 1;

  const [row] = await db
    .insert(policyVersionTable)
    .values({
      organizationId: orgId,
      version: nextVersion,
      status: "compiling",
    })
    .returning({
      id: policyVersionTable.id,
      version: policyVersionTable.version,
    });

  if (!row) {
    throw new Error("Failed to create policy version");
  }

  return row;
}

async function markVersionComplete(
  versionId: string,
  error?: string
): Promise<void> {
  const db = getDb();
  await db
    .update(policyVersionTable)
    .set({
      status: error ? "error" : "compiled",
      compiledAt: new Date(),
      errorMessage: error ?? null,
    })
    .where(eq(policyVersionTable.id, versionId));
}

export async function compilePolicies(
  orgId: string,
  compiledBy?: string
): Promise<CompilationResult> {
  const db = getDb();
  const policyVersion = await getOrCreatePolicyVersion(orgId);

  if (compiledBy) {
    await db
      .update(policyVersionTable)
      .set({ compiledBy })
      .where(eq(policyVersionTable.id, policyVersion.id));
  }

  try {
    const [assignments, rolePermissions, overrides] = await Promise.all([
      fetchRoleAssignments(orgId),
      fetchRolePermissions(orgId),
      fetchPolicyOverrides(orgId),
    ]);

    const groupingPolicies = compileGroupingPolicies(assignments);
    const rolePolicies = compileRolePolicies(rolePermissions, orgId);
    const overridePolicies = compileOverridePolicies(overrides);
    const allPolicies = [...rolePolicies, ...overridePolicies];

    await db.transaction(async (tx) => {
      const domain = buildDomain(orgId);
      await tx.delete(casbinRule).where(eq(casbinRule.v1, domain));

      const rows: Array<{
        ptype: string;
        v0: string;
        v1: string;
        v2: string;
        v3: string;
        v4: string;
        v5: string;
      }> = [];

      for (const p of allPolicies) {
        rows.push({
          ptype: p.ptype,
          v0: p.sub,
          v1: p.dom,
          v2: p.obj,
          v3: p.act,
          v4: p.eft,
          v5: "",
        });
      }

      for (const g of groupingPolicies) {
        rows.push({
          ptype: g.ptype,
          v0: g.user,
          v1: g.role,
          v2: g.domain,
          v3: "",
          v4: "",
          v5: "",
        });
      }

      if (rows.length > 0) {
        await tx.insert(casbinRule).values(rows);
      }
    });

    await markVersionComplete(policyVersion.id);

    await setPolicyVersion(orgId, policyVersion.version);
    await reloadPolicies();

    return {
      policies: allPolicies,
      groupingPolicies,
      version: policyVersion.version,
      compiledAt: new Date(),
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown compilation error";

    await markVersionComplete(policyVersion.id, errorMessage);

    return {
      policies: [],
      groupingPolicies: [],
      version: policyVersion.version,
      compiledAt: new Date(),
      error: errorMessage,
    };
  }
}

export async function getLatestPolicyVersion(
  orgId: string
): Promise<{ id: string; version: number; status: string } | null> {
  const db = getDb();
  const row = await db.query.policyVersionTable.findFirst({
    where: eq(policyVersionTable.organizationId, orgId),
    orderBy: (table, { desc }) => [desc(table.version)],
    columns: { id: true, version: true, status: true },
  });

  return row ?? null;
}
