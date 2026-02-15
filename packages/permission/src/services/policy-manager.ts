import type { db as Db } from "@work-holo/db";
import {
  policyOverrideTable,
  policyVersionTable,
  roleAssignmentTable,
  rolePermissionTable,
  roleTemplateTable,
} from "@work-holo/db/schema/authorization";
import { casbinRule } from "@work-holo/db/schema/casbin";
import type { RedisClient } from "bun";
import { type Enforcer, newEnforcer } from "casbin";
import DrizzleAdapter from "drizzle-adapter";
import { and, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { keyMatchColonFunc } from "../lib/casbin-matchers";
import { resolvePermissionKey } from "../lib/permission-resolver";
import type {
  CompilationResult,
  CompiledGroupingPolicy,
  CompiledPolicy,
  PolicyEffect,
} from "../lib/types";

const MODEL_CONF_PATH = `${import.meta.dir}/../lib/model.conf`;

const POLICY_VERSION_PREFIX = "policy_version:";

/**
 * Internal role-assignment row shape used during policy compilation.
 */
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

/**
 * Internal role-permission row shape used during policy compilation.
 */
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

/**
 * Internal override row shape used during policy compilation.
 */
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

/**
 * Compiles authorization data into Casbin rules and manages policy versions.
 */
export class PolicyManager {
  private readonly db: typeof Db;
  private readonly redis: RedisClient;

  /**
   * Lazily initialized Casbin enforcer singleton promise.
   */
  private enforcerPromise: Promise<Enforcer> | null = null;

  /**
   * Guards concurrent policy reload calls.
   */
  private reloading = false;
  private pendingReload = false;

  private readonly compilationLocks = new Map<
    string,
    Promise<CompilationResult>
  >();

  /**
   * Local cache for org policy versions to reduce Redis reads.
   */
  private readonly localVersionCache = new Map<string, number>();

  /**
   * Creates a policy manager with database and Redis dependencies.
   */
  constructor(db: typeof Db, redis: RedisClient) {
    this.db = db;
    this.redis = redis;
  }

  /**
   * Returns a lazily initialized Casbin enforcer instance.
   */
  getEnforcer(): Promise<Enforcer> {
    if (!this.enforcerPromise) {
      this.enforcerPromise = (async () => {
        const adapter = await DrizzleAdapter.newAdapter({
          db: this.db,
          table: casbinRule,
        });
        const enforcer = await newEnforcer(MODEL_CONF_PATH, adapter);
        await enforcer.addFunction("keyMatchColon", keyMatchColonFunc);
        await enforcer.loadPolicy();
        return enforcer;
      })();
    }

    return this.enforcerPromise;
  }

  /**
   * Reloads policy rules into the enforcer with a concurrency guard.
   * If a reload is already in progress, schedules exactly one re-reload after it completes.
   */
  async reloadPolicies(): Promise<void> {
    if (this.reloading) {
      this.pendingReload = true;
      return;
    }

    this.reloading = true;
    try {
      const enforcer = await this.getEnforcer();
      await enforcer.loadPolicy();
    } finally {
      this.reloading = false;
    }

    if (this.pendingReload) {
      this.pendingReload = false;
      await this.reloadPolicies();
    }
  }

  /**
   * Returns the current org policy version from Redis or local cache.
   */
  async getPolicyVersion(orgId: string): Promise<number> {
    const key = `${POLICY_VERSION_PREFIX}${orgId}`;
    const raw = await this.redis.get(key);

    if (raw) {
      const version = Number.parseInt(raw, 10);
      this.localVersionCache.set(orgId, version);
      return version;
    }

    return this.localVersionCache.get(orgId) ?? 0;
  }

  /**
   * Stores an org policy version in Redis and local cache.
   */
  async setPolicyVersion(orgId: string, version: number): Promise<void> {
    const key = `${POLICY_VERSION_PREFIX}${orgId}`;
    await this.redis.send("SET", [key, String(version)]);
    this.localVersionCache.set(orgId, version);
  }

  /**
   * Resets enforcer and local version cache state.
   */
  resetEnforcer(): void {
    this.enforcerPromise = null;
    this.localVersionCache.clear();
  }

  /**
   * Compiles org assignments/overrides into Casbin rules and bumps policy version.
   */
  async compilePolicies(
    orgId: string,
    compiledBy?: string
  ): Promise<CompilationResult> {
    const existing = this.compilationLocks.get(orgId);
    if (existing) {
      return existing;
    }

    const promise = this.executeCompilation(orgId, compiledBy);
    this.compilationLocks.set(orgId, promise);

    try {
      return await promise;
    } finally {
      this.compilationLocks.delete(orgId);
    }
  }

  private async executeCompilation(
    orgId: string,
    compiledBy?: string
  ): Promise<CompilationResult> {
    const policyVersion = await this.getOrCreatePolicyVersion(orgId);

    if (compiledBy) {
      await this.db
        .update(policyVersionTable)
        .set({ compiledBy })
        .where(eq(policyVersionTable.id, policyVersion.id));
    }

    try {
      const [assignments, rolePermissions, overrides] = await Promise.all([
        this.fetchRoleAssignments(orgId),
        this.fetchRolePermissions(orgId),
        this.fetchPolicyOverrides(orgId),
      ]);

      const teamAssignments = new Map<string, Set<string>>();
      for (const assignment of assignments) {
        if (
          assignment.roleTemplate.scope === "team" &&
          assignment.teamId &&
          assignment.roleTemplateId
        ) {
          const set =
            teamAssignments.get(assignment.roleTemplateId) ??
            new Set<string>();
          set.add(assignment.teamId);
          teamAssignments.set(assignment.roleTemplateId, set);
        }
      }

      const groupingPolicies = this.compileGroupingPolicies(assignments);
      const rolePolicies = this.compileRolePolicies(
        rolePermissions,
        orgId,
        teamAssignments
      );
      const overridePolicies = this.compileOverridePolicies(overrides);
      const allPolicies = [...rolePolicies, ...overridePolicies];

      await this.db.transaction(async (tx) => {
        const domain = this.buildDomain(orgId);
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

      await this.markVersionComplete(policyVersion.id);

      await this.setPolicyVersion(orgId, policyVersion.version);
      await this.reloadPolicies();

      return {
        policies: allPolicies,
        groupingPolicies,
        version: policyVersion.version,
        compiledAt: new Date(),
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown compilation error";

      await this.markVersionComplete(policyVersion.id, errorMessage);

      return {
        policies: [],
        groupingPolicies: [],
        version: policyVersion.version,
        compiledAt: new Date(),
        error: errorMessage,
      };
    }
  }

  /**
   * Returns the latest policy-version row for an organization.
   */
  async getLatestPolicyVersion(
    orgId: string
  ): Promise<{ id: string; version: number; status: string } | null> {
    const row = await this.db.query.policyVersionTable.findFirst({
      where: eq(policyVersionTable.organizationId, orgId),
      orderBy: (table, { desc }) => [desc(table.version)],
      columns: { id: true, version: true, status: true },
    });

    return row ?? null;
  }

  /**
   * Builds the Casbin domain string for an organization.
   */
  private buildDomain(orgId: string): string {
    return `org:${orgId}`;
  }

  /**
   * Builds the Casbin object path for org/team/resource-scoped permissions.
   */
  private buildObject(
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
      parts.push(...subResource.split("."));
    }

    if (resourceId) {
      parts.push(resourceId);
    }

    return parts.join(":");
  }

  /**
   * Builds a Casbin role identifier for org- or team-scoped templates.
   */
  private buildRoleName(
    roleName: string,
    scope: "org" | "team",
    teamId?: string | null
  ): string {
    if (scope === "team" && teamId) {
      return `role:${roleName}:team:${teamId}`;
    }
    return `role:${roleName}`;
  }

  /**
   * Compiles role-assignment rows into Casbin grouping policies.
   */
  private compileGroupingPolicies(
    assignments: RoleAssignmentRow[]
  ): CompiledGroupingPolicy[] {
    return assignments.map((a) => ({
      ptype: "g" as const,
      user: a.userId,
      role: this.buildRoleName(
        a.roleTemplate.name,
        a.roleTemplate.scope,
        a.teamId
      ),
      domain: this.buildDomain(a.organizationId),
    }));
  }

  /**
   * Compiles role permission rows into Casbin policy rules.
   */
  private compileRolePolicies(
    permissions: RolePermissionRow[],
    orgId: string,
    teamAssignments: Map<string, Set<string>>
  ): CompiledPolicy[] {
    const teamAssignmentsByTemplate = new Map<string, Set<string>>();

    for (const assignment of assignments) {
      if (assignment.roleTemplate.scope !== "team" || !assignment.teamId) {
        continue;
      }

      const existing = teamAssignmentsByTemplate.get(assignment.roleTemplateId);
      if (existing) {
        existing.add(assignment.teamId);
        continue;
      }

      teamAssignmentsByTemplate.set(
        assignment.roleTemplateId,
        new Set([assignment.teamId])
      );
    }

    return permissions.flatMap((rolePermission) => {
      const entry = resolvePermissionKey(rolePermission.permissionNode.key);
      if (!entry) {
        return [];
      }

      if (rolePermission.roleTemplate.scope === "team") {
        const teamIds = teamAssignments.get(rolePermission.roleTemplateId);
        if (!teamIds || teamIds.size === 0) {
          return [];
        }

        return Array.from(teamIds).map((teamId) => ({
          ptype: "p" as const,
          sub: this.buildRoleName(
            rolePermission.roleTemplate.name,
            rolePermission.roleTemplate.scope,
            teamId
          ),
          dom: this.buildDomain(orgId),
          obj: this.buildObject(
            rolePermission.roleTemplate.scope,
            rolePermission.permissionNode.resource,
            rolePermission.permissionNode.subResource,
            teamId
          ),
          act: entry.key,
          eft: rolePermission.effect as PolicyEffect,
        }));
      }

      return {
        ptype: "p" as const,
        sub: this.buildRoleName(
          rolePermission.roleTemplate.name,
          rolePermission.roleTemplate.scope
        ),
        dom: this.buildDomain(orgId),
        obj: this.buildObject(
          rolePermission.roleTemplate.scope,
          rolePermission.permissionNode.resource,
          rolePermission.permissionNode.subResource
        ),
        act: entry.key,
        eft: rolePermission.effect as PolicyEffect,
      };
    });
  }

  /**
   * Compiles active user overrides into Casbin policy rules.
   */
  private compileOverridePolicies(
    overrides: PolicyOverrideRow[]
  ): CompiledPolicy[] {
    const now = new Date();

    return overrides
      .filter((o) => !o.expiresAt || o.expiresAt > now)
      .flatMap((override) => {
        const entry = resolvePermissionKey(override.permissionNode.key);
        if (!entry) {
          return [];
        }

        return {
          ptype: "p" as const,
          sub: override.userId,
          dom: this.buildDomain(override.organizationId),
          obj: this.buildObject(
            override.teamId ? "team" : "org",
            override.permissionNode.resource,
            override.permissionNode.subResource,
            override.teamId,
            override.resourceId
          ),
          act: entry.key,
          eft: override.effect as PolicyEffect,
        };
      });
  }

  /**
   * Fetches role assignments for an organization with template metadata.
   */
  private async fetchRoleAssignments(
    orgId: string
  ): Promise<RoleAssignmentRow[]> {
    const rows = await this.db.query.roleAssignmentTable.findMany({
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

  /**
   * Fetches role permissions for all applicable role templates in an org.
   */
  private async fetchRolePermissions(
    orgId: string
  ): Promise<RolePermissionRow[]> {
    const templates = await this.db.query.roleTemplateTable.findMany({
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

    const rows = await this.db.query.rolePermissionTable.findMany({
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

  /**
   * Fetches active policy overrides for an organization.
   */
  private async fetchPolicyOverrides(
    orgId: string
  ): Promise<PolicyOverrideRow[]> {
    const rows = await this.db.query.policyOverrideTable.findMany({
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

  /**
   * Creates and returns the next policy-version row for an organization.
   */
  private async getOrCreatePolicyVersion(
    orgId: string
  ): Promise<{ id: string; version: number }> {
    const existing = await this.db.query.policyVersionTable.findFirst({
      where: eq(policyVersionTable.organizationId, orgId),
      orderBy: (table, { desc }) => [desc(table.version)],
      columns: { id: true, version: true },
    });

    const nextVersion = existing ? existing.version + 1 : 1;

    const [row] = await this.db
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

  /**
   * Marks a policy-version row as compiled or errored.
   */
  private async markVersionComplete(
    versionId: string,
    error?: string
  ): Promise<void> {
    await this.db
      .update(policyVersionTable)
      .set({
        status: error ? "error" : "compiled",
        compiledAt: new Date(),
        errorMessage: error ?? null,
      })
      .where(eq(policyVersionTable.id, versionId));
  }
}
