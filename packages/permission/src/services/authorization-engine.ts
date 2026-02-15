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
      const hasExplicitDeny = await this.hasExplicitDenyOverride(
        request.userId,
        request.orgId,
        request.permission.permissionKey
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

    const currentVersion = await this.policyManager.getPolicyVersion(orgId);

    const cached = await this.cacheManager.getCachedDecision(
      userId,
      orgId,
      permission.permissionKey,
      currentVersion
    );
    if (cached) {
      return {
        allowed: cached.allowed,
        decidedBy: "cache",
        durationMs: performance.now() - start,
        permissionKey: permission.permissionKey,
      };
    }

    const bitsetData = await this.getOrCompileBitset(userId, orgId);
    const bitsetAllowed = checkBit(bitsetData.bitset, permission.bitIndex);

    if (!bitsetAllowed) {
      await this.cacheManager.setCachedDecision(
        userId,
        orgId,
        permission.permissionKey,
        false,
        currentVersion
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
      currentVersion
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
  async getOrCompileBitset(userId: string, orgId: string): Promise<BitsetData> {
    const currentVersion = await this.policyManager.getPolicyVersion(orgId);
    const cached = await this.cacheManager.getCachedBitset(
      userId,
      orgId,
      currentVersion
    );
    if (cached) return cached;
    return this.compileBitset(userId, orgId);
  }

  /**
   * Compiles and caches a user permission bitset from effective grants.
   */
  async compileBitset(userId: string, orgId: string): Promise<BitsetData> {
    const permissionKeys = await this.getUserPermissionKeys(userId, orgId);
    const bitset = createEmptyBitset(TOTAL_PERMISSIONS);

    for (const key of permissionKeys) {
      const entry = resolvePermissionKey(key);
      if (entry) {
        setBit(bitset, entry.bitIndex);
      }
    }

    const currentVersion = await this.policyManager.getPolicyVersion(orgId);
    const data: BitsetData = {
      bitset: bitsetToHex(bitset),
      policyVersion: currentVersion,
      compiledAt: Date.now(),
    };

    await this.cacheManager.setCachedBitset(userId, orgId, data);
    return data;
  }

  private async hasExplicitDenyOverride(
    userId: string,
    orgId: string,
    permissionKey: string
  ): Promise<boolean> {
    const denyOverride = await this.db
      .select({ id: policyOverrideTable.id })
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
      )
      .limit(1);

    return denyOverride.length > 0;
  }

  /**
   * Computes effective permission keys from role grants and active overrides.
   */
  private async getUserPermissionKeys(
    userId: string,
    orgId: string
  ): Promise<Set<string>> {
    const permissionKeys = new Set<string>();

    const assignments = await this.db.query.roleAssignmentTable.findMany({
      where: and(
        eq(roleAssignmentTable.userId, userId),
        eq(roleAssignmentTable.organizationId, orgId)
      ),
      columns: { roleTemplateId: true },
      with: {
        roleTemplate: {
          columns: { id: true },
        },
      },
    });

    const templateIds = assignments.map(
      (a: { roleTemplateId: string }) => a.roleTemplateId
    );

    if (templateIds.length === 0) {
      const overrides = await this.db.query.policyOverrideTable.findMany({
        where: and(
          eq(policyOverrideTable.userId, userId),
          eq(policyOverrideTable.organizationId, orgId),
          or(
            isNull(policyOverrideTable.expiresAt),
            gt(policyOverrideTable.expiresAt, new Date())
          )
        ),
        columns: { effect: true },
        with: {
          permissionNode: {
            columns: { key: true },
          },
        },
      });

      for (const override of overrides) {
        if (override.effect === "allow") {
          permissionKeys.add(override.permissionNode.key);
        } else if (override.effect === "deny") {
          permissionKeys.delete(override.permissionNode.key);
        }
      }

      return permissionKeys;
    }

    const rolePerms = await this.db.query.rolePermissionTable.findMany({
      where: inArray(rolePermissionTable.roleTemplateId, templateIds),
      columns: { effect: true, roleTemplateId: true },
      with: {
        permissionNode: {
          columns: { key: true },
        },
      },
    });

    for (const rp of rolePerms) {
      if (rp.effect === "allow") {
        permissionKeys.add(rp.permissionNode.key);
      } else if (rp.effect === "deny") {
        permissionKeys.delete(rp.permissionNode.key);
      }
    }

    const overrides = await this.db.query.policyOverrideTable.findMany({
      where: and(
        eq(policyOverrideTable.userId, userId),
        eq(policyOverrideTable.organizationId, orgId),
        or(
          isNull(policyOverrideTable.expiresAt),
          gt(policyOverrideTable.expiresAt, new Date())
        )
      ),
      columns: { effect: true },
      with: {
        permissionNode: {
          columns: { key: true },
        },
      },
    });

    for (const override of overrides) {
      if (override.effect === "allow") {
        permissionKeys.add(override.permissionNode.key);
      } else if (override.effect === "deny") {
        permissionKeys.delete(override.permissionNode.key);
      }
    }

    return permissionKeys;
  }
}
