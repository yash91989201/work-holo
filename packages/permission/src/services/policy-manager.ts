import type { db as Db } from "@work-holo/db";
import {
  policyOverrideTable,
  policyVersionTable,
  roleAssignmentTable,
  rolePermissionTable,
  roleTemplateTable,
} from "@work-holo/db/schema/authorization";
import { casbinTable } from "@work-holo/db/schema/casbin";
import type { RedisClient } from "@work-holo/infrastructure";
import { type Enforcer, newEnforcer, newModel } from "casbin";
import { DrizzleAdapter } from "casbin-drizzle-adapter";
import { and, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { keyMatchColonFunc } from "../lib/casbin-matchers";
import { resolvePermissionKey } from "../lib/permission-resolver";
import type {
  CompilationResult,
  CompiledGroupingPolicy,
  CompiledPolicy,
  PolicyEffect,
} from "../lib/types";

// Casbin model configuration (inlined to avoid bundling issues with external files)
const MODEL_CONFIG = `[request_definition]
r = sub, dom, obj, act

[policy_definition]
p = sub, dom, obj, act, eft

[role_definition]
g = _, _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = (r.sub == p.sub || g(r.sub, p.sub, r.dom)) && r.dom == p.dom && keyMatchColon(r.obj.name, p.obj) && r.act == p.act`;

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
        const model = newModel(MODEL_CONFIG);
        const adapter = DrizzleAdapter.newAdapter(this.db, casbinTable);
        const enforcer = await newEnforcer(model, adapter);
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
    const redis = this.redis;
    const key = `${POLICY_VERSION_PREFIX}${orgId}`;
    const raw = await redis.get(key);

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
    const redis = this.redis;
    const key = `${POLICY_VERSION_PREFIX}${orgId}`;
    await redis.set(key, String(version));
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
   * Acquires a distributed lock for policy compilation with TTL.
   */
  private async acquireCompilationLock(
    orgId: string,
    ttlMs = 30_000
  ): Promise<boolean> {
    const redis = this.redis;
    const lockKey = `compilation_lock:${orgId}`;
    const result = await redis.set(lockKey, "1", { PX: ttlMs, NX: true });
    return result === "OK";
  }

  /**
   * Releases the distributed compilation lock for an organization.
   */
  private async releaseCompilationLock(orgId: string): Promise<void> {
    const redis = this.redis;
    const lockKey = `compilation_lock:${orgId}`;
    await redis.del(lockKey);
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

    const promise = this.executeWithDistributedLock(orgId, compiledBy);
    this.compilationLocks.set(orgId, promise);

    try {
      return await promise;
    } finally {
      this.compilationLocks.delete(orgId);
    }
  }

  /**
   * Executes compilation with distributed lock and retry logic.
   */
  private async executeWithDistributedLock(
    orgId: string,
    compiledBy?: string
  ): Promise<CompilationResult> {
    const maxRetries = 3;
    const retryDelayMs = 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const acquired = await this.acquireCompilationLock(orgId);
      if (acquired) {
        try {
          return await this.executeCompilation(orgId, compiledBy);
        } finally {
          try {
            await this.releaseCompilationLock(orgId);
          } catch (releaseError) {
            console.error(
              "[permission-policy-manager] Failed to release compilation lock:",
              releaseError
            );
          }
        }
      }

      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }

    const latestVersion = await this.getLatestPolicyVersion(orgId);
    return {
      policies: [],
      groupingPolicies: [],
      version: latestVersion?.version ?? 0,
      compiledAt: new Date(),
      error:
        "Compilation skipped: another instance is currently compiling policies for this organization",
    };
  }

  /**
   * Performs the actual policy compilation and Casbin rule generation.
   */
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
            teamAssignments.get(assignment.roleTemplateId) ?? new Set<string>();
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
        await tx
          .delete(casbinTable)
          .where(
            or(
              and(eq(casbinTable.ptype, "p"), eq(casbinTable.v1, domain)),
              and(eq(casbinTable.ptype, "g"), eq(casbinTable.v2, domain))
            )
          );

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
          await tx.insert(casbinTable).values(rows);
        }
      });

      await this.markVersionComplete(policyVersion.id);

      await this.reloadPolicies();
      await this.setPolicyVersion(orgId, policyVersion.version);

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
  /**
   * Builds the Casbin domain string for an organization.
   */
  private buildDomain(orgId: string): string {
    return `org:${orgId}`;
  }

  /**
   * Builds the Casbin object path for org/team/resource-scoped permissions.
   * @param scope Org or team scope
   * @param resource Resource name
   * @param subResource Sub-resource path (dot-separated)
   * @param scopeId Team ID for team-scoped resources
   * @param resourceId Specific resource instance ID
   * @returns Colon-separated object path
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
   * @param roleName Template name
   * @param scope Org or team scope
   * @param teamId Team ID for team-scoped roles
   * @returns Role identifier string
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
   * @param assignments Role assignments to compile
   * @returns Grouping policies mapping users to roles
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
   * @param permissions Role permissions to compile
   * @param orgId Organization ID
   * @param teamAssignments Map of role template IDs to team IDs
   * @returns Policy rules for role-based access
   */
  private compileRolePolicies(
    permissions: RolePermissionRow[],
    orgId: string,
    teamAssignments: Map<string, Set<string>>
  ): CompiledPolicy[] {
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
   * @param overrides Policy overrides to compile
   * @returns Policy rules for user-specific overrides
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
   * @param orgId Organization ID
   * @returns Role assignment rows with template info
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
   * @param orgId Organization ID
   * @returns Role permission rows with permission node info
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
   * @param orgId Organization ID
   * @returns Policy override rows with permission node info
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
   * @param orgId Organization ID
   * @returns Policy version row with ID and version number
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
   * @param versionId Policy version ID
   * @param error Optional error message if compilation failed
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
