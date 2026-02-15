import type { db as Db } from "@work-holo/db";
import {
  permissionSnapshotTable,
  policyVersionTable,
} from "@work-holo/db/schema/authorization";
import { and, desc, eq } from "drizzle-orm";
import type { PermissionMap } from "../lib/types";
import { PERMISSIONS } from "../lib/vocabulary";
import type { CacheManager } from "./cache-manager";
import type { PolicyManager } from "./policy-manager";

/**
 * Builds, caches, and persists full permission maps per user and organization.
 */
export class PermissionMapManager {
  private readonly db: typeof Db;
  private readonly cacheManager: CacheManager;
  private readonly policyManager: PolicyManager;

  constructor(
    db: typeof Db,
    cacheManager: CacheManager,
    policyManager: PolicyManager
  ) {
    this.db = db;
    this.cacheManager = cacheManager;
    this.policyManager = policyManager;
  }

  /**
   * Returns a permission map via Redis, DB snapshot, or Casbin recomputation.
   */
  async buildPermissionMap(
    userId: string,
    orgId: string
  ): Promise<PermissionMap> {
    let policyVersion = await this.policyManager.getPolicyVersion(orgId);

    if (policyVersion === 0) {
      await this.policyManager.compilePolicies(orgId, userId);
      await this.policyManager.reloadPolicies();
      policyVersion = await this.policyManager.getPolicyVersion(orgId);
    }

    const cached = await this.cacheManager.getCachedPermissionMap(
      userId,
      orgId,
      policyVersion
    );
    if (cached) return cached;

    const dbSnapshot = await this.loadSnapshotFromDb(userId, orgId);
    if (dbSnapshot && dbSnapshot.policyVersion === policyVersion) {
      await this.cacheManager.setCachedPermissionMap(userId, orgId, dbSnapshot);
      return dbSnapshot;
    }

    const permissionMap = await this.computePermissionMap(userId, orgId);

    await Promise.all([
      this.saveSnapshot(userId, orgId, permissionMap),
      this.cacheManager.setCachedPermissionMap(userId, orgId, permissionMap),
    ]);

    return permissionMap;
  }

  /**
   * Deletes the Redis permission-map cache entry for a user and org.
   */
  async invalidatePermissionMap(userId: string, orgId: string): Promise<void> {
    await this.cacheManager.invalidatePermissionMap(userId, orgId);
  }

  /**
   * Returns the latest compiled policy-version row ID for an organization.
   * @param orgId Organization to query
   * @returns Version ID or null if not found
   */
  private async getLatestVersionId(orgId: string): Promise<string | null> {
    const row = await this.db.query.policyVersionTable.findFirst({
      where: and(
        eq(policyVersionTable.organizationId, orgId),
        eq(policyVersionTable.status, "compiled")
      ),
      orderBy: [desc(policyVersionTable.version)],
      columns: { id: true },
    });
    return row?.id ?? null;
  }

  /**
   * Loads a persisted permission snapshot from the database.
   * @param userId User to load snapshot for
   * @param orgId Organization context
   * @returns Cached permission map with policy version or null
   */
  private async loadSnapshotFromDb(
    userId: string,
    orgId: string
  ): Promise<PermissionMap | null> {
    const row = await this.db.query.permissionSnapshotTable.findFirst({
      where: and(
        eq(permissionSnapshotTable.userId, userId),
        eq(permissionSnapshotTable.organizationId, orgId)
      ),
      columns: {
        permissionMap: true,
      },
      with: {
        policyVersion: {
          columns: { version: true },
        },
      },
    });

    if (!row) return null;

    const map = JSON.parse(row.permissionMap) as PermissionMap;
    map.policyVersion = row.policyVersion.version;
    return map;
  }

  /**
   * Computes a full permission map by evaluating all vocabulary entries against Casbin.
   * @param userId User to compute permissions for
   * @param orgId Organization context
   * @returns Complete permission map with current policy version
   */
  private async computePermissionMap(
    userId: string,
    orgId: string
  ): Promise<PermissionMap> {
    const enforcer = await this.policyManager.getEnforcer();
    const domain = `org:${orgId}`;
    const permissions: Record<string, boolean> = {};

    for (const entry of PERMISSIONS) {
      const objParts: string[] = [entry.resource];
      if (entry.subResources.length > 0) {
        objParts.push(...entry.subResources);
      }
      const objName = objParts.join(":");
      const allowed = await enforcer.enforce(
        userId,
        domain,
        { name: objName, ownerId: "" },
        entry.key
      );
      permissions[entry.key] = allowed;
    }

    const currentVersion = await this.policyManager.getPolicyVersion(orgId);
    return {
      userId,
      orgId,
      policyVersion: currentVersion,
      permissions,
      computedAt: Date.now(),
    };
  }

  /**
   * Upserts a computed permission map snapshot for the current policy version.
   * @param userId User to save snapshot for
   * @param orgId Organization context
   * @param permissionMap Map to persist
   */
  private async saveSnapshot(
    userId: string,
    orgId: string,
    permissionMap: PermissionMap
  ): Promise<void> {
    const versionId = await this.getLatestVersionId(orgId);
    if (!versionId) return;

    const serializedMap = JSON.stringify(permissionMap);

    await this.db
      .insert(permissionSnapshotTable)
      .values({
        userId,
        organizationId: orgId,
        policyVersionId: versionId,
        bitset: "",
        permissionMap: serializedMap,
      })
      .onConflictDoUpdate({
        target: [
          permissionSnapshotTable.userId,
          permissionSnapshotTable.organizationId,
        ],
        set: {
          policyVersionId: versionId,
          bitset: "",
          permissionMap: serializedMap,
          computedAt: new Date(),
        },
      });
  }
}
