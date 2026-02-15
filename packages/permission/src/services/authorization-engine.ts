import type { db as Db } from "@work-holo/db";
import {
  permissionNodeTable,
  policyOverrideTable,
  roleAssignmentTable,
  rolePermissionTable,
} from "@work-holo/db/schema/authorization";
import { and, eq, gt, inArray, isNull, or } from "drizzle-orm";
import {
  bitsetToHex,
  checkBit,
  createEmptyBitset,
  setBit,
} from "../lib/bitset";
import { resolvePermissionKey } from "../lib/permission-resolver";
import type {
  AuthorizationRequest,
  AuthorizationResult,
  BitsetData,
} from "../lib/types";
import { TOTAL_PERMISSIONS } from "../lib/vocabulary";
import type { CacheManager } from "./cache-manager";
import type { PolicyManager } from "./policy-manager";

type ScopeContext = {
  teamId?: string;
  resourceId?: string;
};

/**
 * Executes permission authorization through cache, bitset, and Casbin layers.
 */
export class AuthorizationEngine {
  private readonly cacheManager: CacheManager;
  private readonly policyManager: PolicyManager;
  private readonly db: typeof Db;

  constructor(
    cacheManager: CacheManager,
    policyManager: PolicyManager,
    db: typeof Db
  ) {
    this.cacheManager = cacheManager;
    this.policyManager = policyManager;
    this.db = db;
  }

  /**
   * Authorizes a request with optional owner bypass handling.
   *
   * When the user is the resource owner:
   * 1. Runs the full authorization pipeline first.
   * 2. If allowed by normal grants, returns that result.
   * 3. If denied, checks for an explicit deny override in policyOverrideTable.
   * 4. If an explicit deny override exists, respects it (deny wins over ownership).
   * 5. Otherwise, applies owner bypass (owner is allowed by default).
   *
   * respectDenyOverrides is hardcoded to true for now. A future org settings
   * feature will make this configurable per-organization.
   */
  async authorizeWithOwnerBypass(
    request: AuthorizationRequest,
    ownerId?: string
  ): Promise<AuthorizationResult> {
    const result = await this.authorize(request);

    if (result.allowed) {
      return result;
    }

    // If user is not the owner, deny stands
    if (!ownerId || request.userId !== ownerId) {
      return result;
    }

    // User is owner but was denied. Check if there's an explicit deny override.
    // respectDenyOverrides is true by default — will be configurable via org settings in the future.
    const respectDenyOverrides = true;

    if (respectDenyOverrides) {
      const scopeContext = this.resolveScopeContext(request);
      const hasExplicitDeny = await this.hasExplicitDenyOverride(
        request.userId,
        request.orgId,
        request.permission.permissionKey,
        scopeContext
      );

      if (hasExplicitDeny) {
        return result;
      }
    }

    // No explicit deny — apply owner bypass
    return {
      allowed: true,
      decidedBy: "owner",
      durationMs: result.durationMs,
      permissionKey: request.permission.permissionKey,
    };
  }

  /**
   * Authorizes a request through cache, bitset pre-filter, and Casbin.
   */
  async authorize(request: AuthorizationRequest): Promise<AuthorizationResult> {
    const start = performance.now();
    const { userId, orgId, permission } = request;
    const scopeContext = this.resolveScopeContext(request);
    const scopeCacheKey = this.buildScopeCacheKey(scopeContext);

    const currentVersion = await this.policyManager.getPolicyVersion(orgId);

    const cached = await this.cacheManager.getCachedDecision(
      userId,
      orgId,
      permission.permissionKey,
      currentVersion,
      scopeCacheKey
    );
    if (cached) {
      return {
        allowed: cached.allowed,
        decidedBy: "cache",
        durationMs: performance.now() - start,
        permissionKey: permission.permissionKey,
      };
    }

    const bitsetData = await this.getOrCompileBitset(
      userId,
      orgId,
      scopeContext,
      scopeCacheKey,
      currentVersion
    );
    const bitsetAllowed = checkBit(bitsetData.bitset, permission.bitIndex);

    if (!bitsetAllowed) {
      await this.cacheManager.setCachedDecision(
        userId,
        orgId,
        permission.permissionKey,
        false,
        currentVersion,
        scopeCacheKey
      );
      return {
        allowed: false,
        decidedBy: "bitset",
        durationMs: performance.now() - start,
        permissionKey: permission.permissionKey,
      };
    }

    const enforcer = await this.policyManager.getEnforcer();
    const domain = `org:${orgId}`;

    const allowed = await enforcer.enforce(
      userId,
      domain,
      { name: permission.obj },
      permission.act
    );

    await this.cacheManager.setCachedDecision(
      userId,
      orgId,
      permission.permissionKey,
      allowed,
      currentVersion,
      scopeCacheKey
    );

    return {
      allowed,
      decidedBy: "casbin",
      durationMs: performance.now() - start,
      permissionKey: permission.permissionKey,
    };
  }

  /**
   * Returns a valid cached bitset or compiles a new one.
   */
  async getOrCompileBitset(
    userId: string,
    orgId: string,
    scopeContext: ScopeContext,
    scopeCacheKey: string,
    currentVersion: number
  ): Promise<BitsetData> {
    const cached = await this.cacheManager.getCachedBitset(
      userId,
      orgId,
      currentVersion,
      scopeCacheKey
    );
    if (cached) return cached;
    return this.compileBitset(
      userId,
      orgId,
      scopeContext,
      scopeCacheKey,
      currentVersion
    );
  }

  /**
   * Compiles and caches a user permission bitset from effective grants.
   */
  async compileBitset(
    userId: string,
    orgId: string,
    scopeContext: ScopeContext,
    scopeCacheKey: string,
    currentVersion: number
  ): Promise<BitsetData> {
    const permissionKeys = await this.getUserPermissionKeys(
      userId,
      orgId,
      scopeContext
    );
    const bitset = createEmptyBitset(TOTAL_PERMISSIONS);

    for (const key of permissionKeys) {
      const entry = resolvePermissionKey(key);
      if (entry) {
        setBit(bitset, entry.bitIndex);
      }
    }

    const data: BitsetData = {
      bitset: bitsetToHex(bitset),
      policyVersion: currentVersion,
      compiledAt: Date.now(),
    };

    await this.cacheManager.setCachedBitset(userId, orgId, data, scopeCacheKey);
    return data;
  }

  /**
   * Checks if an explicit deny override exists for the user and permission.
   */
  private async hasExplicitDenyOverride(
    userId: string,
    orgId: string,
    permissionKey: string,
    scopeContext: ScopeContext
  ): Promise<boolean> {
    const denyOverrides = await this.db
      .select({
        id: policyOverrideTable.id,
        teamId: policyOverrideTable.teamId,
        resourceId: policyOverrideTable.resourceId,
      })
      .from(policyOverrideTable)
      .innerJoin(
        permissionNodeTable,
        eq(policyOverrideTable.permissionNodeId, permissionNodeTable.id)
      )
      .where(
        and(
          eq(policyOverrideTable.userId, userId),
          eq(policyOverrideTable.organizationId, orgId),
          eq(policyOverrideTable.effect, "deny"),
          eq(permissionNodeTable.key, permissionKey),
          or(
            isNull(policyOverrideTable.expiresAt),
            gt(policyOverrideTable.expiresAt, new Date())
          )
        )
      );

    return denyOverrides.some((override) =>
      this.isOverrideApplicable(override, scopeContext)
    );
  }

  /**
   * Computes effective permission keys from role grants and active overrides.
   */
  private async getUserPermissionKeys(
    userId: string,
    orgId: string,
    scopeContext: ScopeContext
  ): Promise<Set<string>> {
    const permissionKeys = new Set<string>();

    const applicableTemplateIds = await this.getApplicableTemplateIds(
      userId,
      orgId,
      scopeContext
    );

    if (applicableTemplateIds.length > 0) {
      const rolePerms = await this.db.query.rolePermissionTable.findMany({
        where: inArray(
          rolePermissionTable.roleTemplateId,
          applicableTemplateIds
        ),
        columns: { effect: true, roleTemplateId: true },
        with: {
          permissionNode: {
            columns: { key: true },
          },
        },
      });

      this.applyPermissionEffects(permissionKeys, rolePerms);
    }

    const overrides = await this.fetchActiveOverrides(userId, orgId);
    this.applyScopedOverrides(permissionKeys, overrides, scopeContext);

    return permissionKeys;
  }

  /**
   * Retrieves role template IDs applicable to the user based on scope.
   */
  private async getApplicableTemplateIds(
    userId: string,
    orgId: string,
    scopeContext: ScopeContext
  ): Promise<string[]> {
    const assignments = await this.db.query.roleAssignmentTable.findMany({
      where: and(
        eq(roleAssignmentTable.userId, userId),
        eq(roleAssignmentTable.organizationId, orgId)
      ),
      columns: { roleTemplateId: true, teamId: true },
      with: {
        roleTemplate: {
          columns: { id: true, scope: true },
        },
      },
    });

    return assignments
      .filter((assignment) => {
        if (assignment.roleTemplate.scope === "org") {
          return true;
        }

        return Boolean(
          scopeContext.teamId && assignment.teamId === scopeContext.teamId
        );
      })
      .map((assignment) => assignment.roleTemplateId);
  }

  /**
   * Fetches active policy overrides for a user within an organization.
   */
  private fetchActiveOverrides(userId: string, orgId: string) {
    return this.db.query.policyOverrideTable.findMany({
      where: and(
        eq(policyOverrideTable.userId, userId),
        eq(policyOverrideTable.organizationId, orgId),
        or(
          isNull(policyOverrideTable.expiresAt),
          gt(policyOverrideTable.expiresAt, new Date())
        )
      ),
      columns: { effect: true, teamId: true, resourceId: true },
      with: {
        permissionNode: {
          columns: { key: true },
        },
      },
    });
  }

  /**
   * Applies allow/deny effects to the permission set.
   */
  private applyPermissionEffects(
    permissionKeys: Set<string>,
    effects: Array<{ effect: string; permissionNode: { key: string } }>
  ): void {
    for (const effect of effects) {
      if (effect.effect === "allow") {
        permissionKeys.add(effect.permissionNode.key);
      } else if (effect.effect === "deny") {
        permissionKeys.delete(effect.permissionNode.key);
      }
    }
  }

  /**
   * Applies scoped overrides (team/resource-level) to the permission set.
   */
  private applyScopedOverrides(
    permissionKeys: Set<string>,
    overrides: Array<{
      effect: string;
      teamId: string | null;
      resourceId: string | null;
      permissionNode: { key: string };
    }>,
    scopeContext: ScopeContext
  ): void {
    for (const override of overrides) {
      if (!this.isOverrideApplicable(override, scopeContext)) {
        continue;
      }

      this.applyPermissionEffects(permissionKeys, [override]);
    }
  }

  /**
   * Extracts team and resource scope from the authorization request.
   */
  private resolveScopeContext(request: AuthorizationRequest): ScopeContext {
    const parts = request.permission.obj.split(":");
    const entry = resolvePermissionKey(request.permission.permissionKey);

    if (!entry) {
      return {
        teamId: request.teamId,
      };
    }

    const hasTeamPrefix = parts[0] === "team" && parts[1];
    const baseIndex = hasTeamPrefix ? 2 : 0;
    const expectedSegments = 1 + entry.subResources.length;
    const resourceSegmentIndex = baseIndex + expectedSegments;

    return {
      teamId: request.teamId ?? (hasTeamPrefix ? parts[1] : undefined),
      resourceId:
        parts.length > resourceSegmentIndex
          ? parts[resourceSegmentIndex]
          : undefined,
    };
  }

  /**
   * Builds a cache key from scope context (team and resource).
   */
  private buildScopeCacheKey(scopeContext: ScopeContext): string {
    const teamPart = scopeContext.teamId
      ? `team:${scopeContext.teamId}`
      : "org";
    const resourcePart = scopeContext.resourceId
      ? `resource:${scopeContext.resourceId}`
      : "resource:*";
    return `${teamPart}|${resourcePart}`;
  }

  /**
   * Checks if an override applies to the current scope context.
   */
  private isOverrideApplicable(
    override: { teamId: string | null; resourceId: string | null },
    scopeContext: ScopeContext
  ): boolean {
    if (override.teamId && override.teamId !== scopeContext.teamId) {
      return false;
    }

    if (
      override.resourceId &&
      override.resourceId !== scopeContext.resourceId
    ) {
      return false;
    }

    return true;
  }
}
