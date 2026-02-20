import type { PermissionMap } from "../lib/types";
import type { PermissionMapManager } from "./permission-map-manager";

/**
 * Exposes read-only permission introspection helpers.
 */
export class PermissionIntrospection {
  private readonly userId: string;
  private readonly orgId: string;
  private readonly permissionMapManager: PermissionMapManager;

  /**
   * Creates an introspection helper for one user and organization.
   */
  constructor(
    userId: string,
    orgId: string,
    permissionMapManager: PermissionMapManager
  ) {
    this.userId = userId;
    this.orgId = orgId;
    this.permissionMapManager = permissionMapManager;
  }

  /**
   * Returns the full permission map for the current user context.
   * @returns Complete permission map with all evaluated permissions
   */
  getPermissionMap(): Promise<PermissionMap> {
    return this.permissionMapManager.buildPermissionMap(
      this.userId,
      this.orgId
    );
  }
}
