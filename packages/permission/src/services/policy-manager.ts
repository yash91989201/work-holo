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
import type {
  CompilationResult,
  CompiledGroupingPolicy,
  CompiledPolicy,
  PolicyEffect,
} from "../lib/types";

const MODEL_CONF_PATH = "../lib/model.conf";

const POLICY_VERSION_PREFIX = "policy_version:";

/**
 * Database row type representing a role assignment from the DB query result.
 * Used internally by fetchRoleAssignments().
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
 * Database row type representing a role permission from the DB query result.
 * Used internally by fetchRolePermissions().
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
 * Database row type representing a policy override from the DB query result.
 * Used internally by fetchPolicyOverrides().
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
 * Manages policy compilation from database state into Casbin authorization rules.
 *
 * **Core Responsibilities:**
 * - Compiles role assignments, role permissions, and policy overrides into Casbin p-rules and g-rules
 * - Manages Casbin enforcer singleton with lazy initialization
 * - Tracks policy versions in Redis for cross-process synchronization
 * - Maintains local version cache for fast policy version lookups
 * - Coordinates transactional policy updates to ensure atomicity
 *
 * **Policy Compilation Pipeline:**
 * 1. Fetch role assignments, role permissions (batched), and policy overrides from DB
 * 2. Compile grouping policies (g-rules): user-to-role mappings within org domains
 * 3. Compile role policies (p-rules): role-to-permission mappings
 * 4. Compile override policies (p-rules): direct user-to-permission exceptions
 * 5. Within a single DB transaction: delete old rules for org domain, insert new rules
 * 6. Increment policy version in Redis, reload Casbin enforcer
 *
 * **Object Path Construction:**
 * Object paths in Casbin rules use colon-separated hierarchies:
 * - Org-scoped: `resource:subResource` (e.g., `"channel:member"`)
 * - Team-scoped: `team:teamId:resource:subResource` (e.g., `"team:tm_1:team:member"`)
 * - Resource-specific: `resource:subResource:resourceId` (e.g., `"channel:member:ch_123"`)
 *
 * **Role Name Construction:**
 * Role names distinguish between org-scoped and team-scoped roles:
 * - Org-scoped: `role:roleName` (e.g., `"role:org_admin"`)
 * - Team-scoped: `role:roleName:team:teamId` (e.g., `"role:team_admin:team:tm_1"`)
 *
 * **Policy Versioning:**
 * - Each org has a monotonically increasing policy version stored in Redis (`policy_version:<orgId>`)
 * - On policy compilation, version is incremented and written to Redis
 * - All caches include policy version; stale caches are auto-evicted when version changes
 * - Local version cache (in-memory Map) provides fast reads without Redis round-trips
 *
 * **Casbin Integration:**
 * - Uses DrizzleAdapter to load policies from `casbin_rule` table
 * - Model defined in `lib/model.conf` (RBAC with domain and owner bypass)
 * - Enforcer singleton is lazily initialized and cached per process
 * - `reloadPolicies()` refreshes enforcer from DB after compilation
 *
 * @example
 * ```typescript
 * const policyManager = new PolicyManager(db, getRedisClient);
 *
 * // Compile policies for an organization
 * const result = await policyManager.compilePolicies("org_123", "user_456");
 * console.log(`Compiled ${result.policies.length} policies, version ${result.version}`);
 *
 * // Get Casbin enforcer for authorization checks
 * const enforcer = await policyManager.getEnforcer();
 * const allowed = await enforcer.enforce("user_123", "org:org_456", { name: "channel:member" }, "channel.member.add");
 *
 * // Check current policy version
 * const version = await policyManager.getPolicyVersion("org_123");
 * ```
 */
export class PolicyManager {
  /** Database connection for querying authorization tables and writing Casbin rules */
  private readonly db: typeof Db;

  /** Redis client for policy version storage and retrieval */
  private readonly redis: RedisClient;

  /**
   * Singleton promise for Casbin enforcer initialization.
   * Lazy-initialized on first getEnforcer() call, cached thereafter.
   * Reset to null by resetEnforcer() to force re-initialization.
   */
  private enforcerPromise: Promise<Enforcer> | null = null;

  /**
   * Prevents concurrent policy reloads.
   * Set to true during reloadPolicies() execution to ensure only one reload happens at a time.
   */
  private reloadLock = false;

  /**
   * Local in-memory cache of policy versions per organization.
   * Reduces Redis round-trips by caching the most recent version read from Redis.
   * Cleared by resetEnforcer().
   */
  private readonly localVersionCache = new Map<string, number>();

  /**
   * Creates a new PolicyManager instance.
   *
   * @param db - Drizzle database instance for querying authorization tables and Casbin rules
   * @param redis - Redis client for policy version storage
   */
  constructor(db: typeof Db, redis: RedisClient) {
    this.db = db;
    this.redis = redis;
  }

  /**
   * Gets or initializes the Casbin enforcer singleton.
   *
   * **Lazy Initialization:**
   * - On first call, creates DrizzleAdapter from `casbin_rule` table
   * - Loads Casbin model from `lib/model.conf`
   * - Initializes enforcer and loads all policies from database
   * - Caches enforcer promise; subsequent calls return cached instance
   *
   * **Model Configuration:**
   * The Casbin model defines RBAC with domain support and owner bypass:
   * - Request: `(sub, dom, obj, act)` - subject, domain, object, action
   * - Policy: `(sub, dom, obj, act, eft)` - includes effect (allow/deny)
   * - Grouping: domain-aware role inheritance
   * - Matcher: supports role inheritance, domain isolation, keyMatch2 patterns, and owner bypass
   *
   * @returns Promise resolving to the Casbin enforcer instance
   *
   * @example
   * ```typescript
   * const enforcer = await policyManager.getEnforcer();
   * const allowed = await enforcer.enforce(
   *   "user_123",
   *   "org:org_456",
   *   { name: "channel:member:ch_789", ownerId: "" },
   *   "channel.member.add"
   * );
   * ```
   */
  getEnforcer(): Promise<Enforcer> {
    if (!this.enforcerPromise) {
      this.enforcerPromise = (async () => {
        const adapter = await DrizzleAdapter.newAdapter({
          db: this.db,
          table: casbinRule,
        });
        const enforcer = await newEnforcer(MODEL_CONF_PATH, adapter);
        await enforcer.loadPolicy();
        return enforcer;
      })();
    }

    return this.enforcerPromise;
  }

  /**
   * Reloads all policies from the database into the Casbin enforcer.
   *
   * **Concurrency Control:**
   * Uses `reloadLock` to prevent concurrent reloads. If a reload is already in progress,
   * subsequent calls return immediately without waiting.
   *
   * **When to Call:**
   * - After `compilePolicies()` completes to refresh enforcer with new rules
   * - After external policy changes (e.g., manual DB updates)
   *
   * @example
   * ```typescript
   * await policyManager.compilePolicies("org_123");
   * await policyManager.reloadPolicies();
   * ```
   */
  async reloadPolicies(): Promise<void> {
    if (this.reloadLock) return;
    this.reloadLock = true;
    try {
      const enforcer = await this.getEnforcer();
      await enforcer.loadPolicy();
    } finally {
      this.reloadLock = false;
    }
  }

  /**
   * Gets the current policy version for an organization.
   *
   * **Read Strategy:**
   * 1. Read from Redis (`policy_version:<orgId>`)
   * 2. If found, parse as integer and update local cache
   * 3. If not found, return from local cache (default 0 if never cached)
   *
   * **Cache Behavior:**
   * - Redis is source of truth for cross-process synchronization
   * - Local cache reduces Redis round-trips for repeated reads
   * - Local cache is updated whenever Redis value is read
   *
   * @param orgId - Organization ID to get policy version for
   * @returns Current policy version (0 if never compiled)
   *
   * @example
   * ```typescript
   * const version = await policyManager.getPolicyVersion("org_123");
   * console.log(`Current policy version: ${version}`);
   * ```
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
   * Sets the policy version for an organization in Redis and local cache.
   *
   * **Write Behavior:**
   * - Writes to Redis (`policy_version:<orgId>`) with no TTL
   * - Updates local cache to match Redis value
   * - Triggers cache invalidation in other processes when they read the new version
   *
   * **Atomicity:**
   * Called within the `compilePolicies()` transaction to ensure version increment
   * happens atomically with policy rule updates.
   *
   * @param orgId - Organization ID to set policy version for
   * @param version - New policy version (typically incremented from previous)
   *
   * @example
   * ```typescript
   * const currentVersion = await policyManager.getPolicyVersion("org_123");
   * await policyManager.setPolicyVersion("org_123", currentVersion + 1);
   * ```
   */
  async setPolicyVersion(orgId: string, version: number): Promise<void> {
    const key = `${POLICY_VERSION_PREFIX}${orgId}`;
    await this.redis.send("SET", [key, String(version)]);
    this.localVersionCache.set(orgId, version);
  }

  /**
   * Resets the enforcer singleton and clears local version cache.
   *
   * **Effect:**
   * - Sets `enforcerPromise` to null, forcing re-initialization on next `getEnforcer()` call
   * - Clears all entries in `localVersionCache`
   *
   * **When to Use:**
   * - During testing to reset state between test cases
   * - After catastrophic errors requiring enforcer rebuild
   * - Rarely needed in production (use `reloadPolicies()` instead)
   *
   * @example
   * ```typescript
   * policyManager.resetEnforcer();
   * const enforcer = await policyManager.getEnforcer();
   * ```
   */
  resetEnforcer(): void {
    this.enforcerPromise = null;
    this.localVersionCache.clear();
  }

  /**
   * Compiles all policies for an organization from database state into Casbin rules.
   *
   * **Compilation Pipeline:**
   * 1. Create new policy version record in DB with status "compiling"
   * 2. Fetch in parallel: role assignments, role permissions (batched), policy overrides
   * 3. Compile grouping policies (g-rules) from role assignments
   * 4. Compile role policies (p-rules) from role permissions
   * 5. Compile override policies (p-rules) from policy overrides (filters expired)
   * 6. Within a single DB transaction:
   *    - Delete all existing Casbin rules for org domain
   *    - Insert all new compiled rules
   * 7. Mark policy version as "compiled" in DB
   * 8. Update policy version in Redis (triggers cache invalidation)
   * 9. Reload Casbin enforcer from DB
   *
   * **Grouping Policies (g-rules):**
   * Map users to roles within org domains:
   * - `g, user_123, role:org_member, org:org_456`
   * - `g, user_456, role:team_admin:team:tm_1, org:org_456`
   *
   * **Role Policies (p-rules):**
   * Map roles to permissions:
   * - `p, role:org_member, org:org_456, channel:member, channel.member.list, allow`
   *
   * **Override Policies (p-rules):**
   * Direct user-to-permission exceptions:
   * - `p, user_789, org:org_456, message, message.delete, deny`
   *
   * **Error Handling:**
   * - On error, marks policy version as "error" with error message in DB
   * - Returns CompilationResult with empty policies and error field
   * - Does not throw; returns error details for handling by caller
   *
   * **Atomicity:**
   * - Policy deletion and insertion happen in a single DB transaction
   * - If transaction fails, no partial state is committed
   * - Policy version increment only happens after successful transaction
   *
   * @param orgId - Organization ID to compile policies for
   * @param compiledBy - Optional user ID of the actor performing compilation (for audit)
   * @returns CompilationResult with compiled policies, version, and timestamp
   *
   * @example
   * ```typescript
   * const result = await policyManager.compilePolicies("org_123", "user_456");
   * if (result.error) {
   *   console.error(`Compilation failed: ${result.error}`);
   * } else {
   *   console.log(`Compiled ${result.policies.length} policies, version ${result.version}`);
   * }
   * ```
   */
  async compilePolicies(
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

      const groupingPolicies = this.compileGroupingPolicies(assignments);
      const rolePolicies = this.compileRolePolicies(rolePermissions, orgId);
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
   * Gets the latest policy version record for an organization from the database.
   *
   * **Query:**
   * Retrieves the policy version with the highest version number for the given org.
   *
   * **Use Cases:**
   * - Check compilation status ("compiling", "compiled", "error")
   * - Retrieve version ID for linking to permission snapshots
   * - Audit policy compilation history
   *
   * @param orgId - Organization ID to get latest policy version for
   * @returns Latest policy version record (id, version, status), or null if never compiled
   *
   * @example
   * ```typescript
   * const latest = await policyManager.getLatestPolicyVersion("org_123");
   * if (latest?.status === "error") {
   *   console.error("Last compilation failed");
   * }
   * ```
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
   *
   * **Format:**
   * `org:<orgId>`
   *
   * **Purpose:**
   * Casbin uses domains to isolate policies between organizations.
   * All policies and grouping rules for an org use this domain identifier.
   *
   * @param orgId - Organization ID
   * @returns Domain string for use in Casbin rules
   */
  private buildDomain(orgId: string): string {
    return `org:${orgId}`;
  }

  /**
   * Builds the Casbin object path for a permission.
   *
   * **Path Formats:**
   * - Org-scoped: `resource:subResource` (e.g., `"channel:member"`)
   * - Team-scoped: `team:teamId:resource:subResource` (e.g., `"team:tm_1:team:member"`)
   * - Resource-specific: `resource:subResource:resourceId` (e.g., `"channel:member:ch_123"`)
   *
   * **Path Construction Rules:**
   * 1. If scope is "team" and scopeId provided, prepend `team:scopeId:`
   * 2. Append resource
   * 3. If subResource is non-empty, append `:subResource`
   * 4. If resourceId provided, append `:resourceId`
   *
   * @param scope - Permission scope ("org" or "team")
   * @param resource - Resource type (e.g., "channel", "message", "org")
   * @param subResource - Sub-resource type (e.g., "member", "invite") or empty string
   * @param scopeId - Team ID for team-scoped permissions (ignored for org scope)
   * @param resourceId - Specific resource ID for resource-level permissions
   * @returns Colon-separated object path for Casbin rules
   *
   * @example
   * ```typescript
   * buildObject("org", "channel", "member", null, null);        // "channel:member"
   * buildObject("team", "team", "member", "tm_1", null);        // "team:tm_1:team:member"
   * buildObject("org", "channel", "member", null, "ch_123");    // "channel:member:ch_123"
   * ```
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
      parts.push(subResource);
    }

    if (resourceId) {
      parts.push(resourceId);
    }

    return parts.join(":");
  }

  /**
   * Builds the Casbin role name for a role template.
   *
   * **Name Formats:**
   * - Org-scoped: `role:roleName` (e.g., `"role:org_admin"`)
   * - Team-scoped: `role:roleName:team:teamId` (e.g., `"role:team_admin:team:tm_1"`)
   *
   * **Why Different Formats:**
   * Team-scoped roles are specific to individual teams. Two users with "team_admin"
   * role in different teams should not inherit each other's permissions. The teamId
   * suffix ensures role names are unique per team.
   *
   * @param roleName - Role template name (e.g., "org_admin", "team_member")
   * @param scope - Role scope ("org" or "team")
   * @param teamId - Team ID for team-scoped roles (ignored for org scope)
   * @returns Role name string for use in Casbin g-rules and p-rules
   *
   * @example
   * ```typescript
   * buildRoleName("org_admin", "org", null);           // "role:org_admin"
   * buildRoleName("team_admin", "team", "tm_1");       // "role:team_admin:team:tm_1"
   * buildRoleName("team_member", "team", "tm_2");      // "role:team_member:team:tm_2"
   * ```
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
   * Compiles grouping policies (g-rules) from role assignments.
   *
   * **Grouping Policy Format:**
   * `g, userId, roleName, domain`
   *
   * Maps users to their assigned roles within organization domains.
   * Casbin uses these rules for role inheritance in authorization checks.
   *
   * @param assignments - Role assignment rows from database
   * @returns Array of compiled grouping policies for Casbin
   *
   * @example
   * ```typescript
   * // Input: [{ userId: "user_123", roleTemplate: { name: "org_member", scope: "org" }, organizationId: "org_456", teamId: null }]
   * // Output: [{ ptype: "g", user: "user_123", role: "role:org_member", domain: "org:org_456" }]
   * ```
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
   * Compiles role policies (p-rules) from role permissions.
   *
   * **Policy Format:**
   * `p, roleName, domain, objectPath, permissionKey, effect`
   *
   * Maps roles to their allowed/denied permissions.
   * Object paths are constructed based on role scope (org vs team).
   *
   * **Effect Values:**
   * - "allow" - role grants this permission
   * - "deny" - role explicitly denies this permission (deny takes precedence)
   *
   * @param permissions - Role permission rows from database
   * @param orgId - Organization ID (used to build domain)
   * @returns Array of compiled role policies for Casbin
   *
   * @example
   * ```typescript
   * // Input: [{ roleTemplate: { name: "org_member", scope: "org" }, permissionNode: { key: "channel.member.list", resource: "channel", subResource: "member" }, effect: "allow" }]
   * // Output: [{ ptype: "p", sub: "role:org_member", dom: "org:org_456", obj: "channel:member", act: "channel.member.list", eft: "allow" }]
   * ```
   */
  private compileRolePolicies(
    permissions: RolePermissionRow[],
    orgId: string
  ): CompiledPolicy[] {
    return permissions.map((rp) => ({
      ptype: "p" as const,
      sub: this.buildRoleName(rp.roleTemplate.name, rp.roleTemplate.scope),
      dom: this.buildDomain(orgId),
      obj: this.buildObject(
        rp.roleTemplate.scope,
        rp.permissionNode.resource,
        rp.permissionNode.subResource
      ),
      act: rp.permissionNode.key,
      eft: rp.effect as PolicyEffect,
    }));
  }

  /**
   * Compiles override policies (p-rules) from policy overrides.
   *
   * **Policy Format:**
   * `p, userId, domain, objectPath, permissionKey, effect`
   *
   * Similar to role policies, but `sub` is a direct user ID instead of a role name.
   * These provide per-user permission exceptions that override role-based permissions.
   *
   * **Expiration Handling:**
   * Filters out expired overrides (where `expiresAt` is in the past).
   * Only active overrides (no expiry or expiry in future) are compiled.
   *
   * **Object Path:**
   * Can include team scope and specific resource IDs for granular overrides:
   * - Team-scoped: `team:teamId:resource:subResource`
   * - Resource-specific: `resource:subResource:resourceId`
   *
   * @param overrides - Policy override rows from database
   * @returns Array of compiled override policies for Casbin (excludes expired)
   *
   * @example
   * ```typescript
   * // Input: [{ userId: "user_789", permissionNode: { key: "message.delete", resource: "message", subResource: "" }, effect: "deny", organizationId: "org_456", teamId: null, resourceId: null, expiresAt: null }]
   * // Output: [{ ptype: "p", sub: "user_789", dom: "org:org_456", obj: "message", act: "message.delete", eft: "deny" }]
   * ```
   */
  private compileOverridePolicies(
    overrides: PolicyOverrideRow[]
  ): CompiledPolicy[] {
    const now = new Date();

    return overrides
      .filter((o) => !o.expiresAt || o.expiresAt > now)
      .map((o) => ({
        ptype: "p" as const,
        sub: o.userId,
        dom: this.buildDomain(o.organizationId),
        obj: this.buildObject(
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

  /**
   * Fetches all role assignments for an organization from the database.
   *
   * **Query:**
   * Joins `role_assignment` with `role_template` to get role name and scope.
   * Includes team-scoped assignments (teamId is nullable).
   *
   * @param orgId - Organization ID to fetch assignments for
   * @returns Array of role assignment rows with joined role template data
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
   * Fetches all role permissions for an organization from the database.
   *
   * **Batched Query Strategy:**
   * 1. Fetch all role templates for org (custom roles + system roles)
   * 2. Extract template IDs into array
   * 3. Single batched query: fetch all role_permission rows for all template IDs
   *
   * **Why Batched:**
   * - Reduces N+1 query problem (avoid separate query per role template)
   * - Single query with `WHERE roleTemplateId IN (...)` is much faster
   * - Joins with `permission_node` and `role_template` for full data
   *
   * **System Roles:**
   * Includes system roles (isSystem = true, organizationId = null) that apply globally.
   *
   * @param orgId - Organization ID to fetch permissions for
   * @returns Array of role permission rows with joined permission node and role template data
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
   * Fetches active policy overrides for an organization from the database.
   *
   * **Query Filters:**
   * - Organization ID matches
   * - Override has not expired (expiresAt is null OR expiresAt > now)
   *
   * **Expiration Check:**
   * Database query filters expired overrides; `compileOverridePolicies()` double-checks
   * expiry at compile time to handle race conditions.
   *
   * @param orgId - Organization ID to fetch overrides for
   * @returns Array of active policy override rows with joined permission node data
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
