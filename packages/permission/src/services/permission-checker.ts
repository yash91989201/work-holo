import { ORPCError } from "@orpc/server";
import { resolvePermissionKey } from "../lib/permission-resolver";
import type { AuthorizationResult, PermissionDescriptor } from "../lib/types";
import type { AuthorizationEngine } from "./authorization-engine";

/**
 * Performs descriptor and key-based authorization checks for one user context.
 */
export class PermissionChecker {
  private readonly userId: string;
  private readonly orgId: string;
  private readonly enforceMode: boolean;
  private readonly authorizationEngine: AuthorizationEngine;

  /**
   * Creates a checker bound to user, org, and enforce mode.
   */
  constructor(
    userId: string,
    orgId: string,
    enforceMode: boolean,
    authorizationEngine: AuthorizationEngine
  ) {
    this.userId = userId;
    this.orgId = orgId;
    this.enforceMode = enforceMode;
    this.authorizationEngine = authorizationEngine;
  }

  /**
   * Returns whether denied checks should throw.
   */
  shouldEnforce(): boolean {
    return this.enforceMode;
  }

  /**
   * Returns an authorization decision for a descriptor.
   */
  async authorizeDescriptor(
    descriptor: PermissionDescriptor,
    options?: { ownerId?: string; teamId?: string }
  ): Promise<AuthorizationResult> {
    const request = {
      userId: this.userId,
      orgId: this.orgId,
      teamId: options?.teamId,
      permission: options?.ownerId
        ? {
            ...descriptor,
            attrs: { ...descriptor.attrs, ownerId: options.ownerId },
          }
        : descriptor,
    };

    if (options?.ownerId) {
      return await this.authorizationEngine.authorizeWithOwnerBypass(
        request,
        options.ownerId
      );
    }

    return this.authorizationEngine.authorize(request);
  }

  /**
   * Throws FORBIDDEN when descriptor access is denied in enforce mode.
   */
  async check(
    descriptor: PermissionDescriptor,
    options?: { ownerId?: string; teamId?: string }
  ): Promise<void> {
    const result = await this.authorizeDescriptor(descriptor, options);

    if (!result.allowed && this.enforceMode) {
      throw new ORPCError("FORBIDDEN", {
        message: `Not allowed: ${result.permissionKey}`,
      });
    }
  }

  /**
   * Resolves and checks a permission by key.
   */
  async checkByKey(
    permissionKey: string,
    options?: { resourceId?: string; ownerId?: string; teamId?: string }
  ): Promise<void> {
    const descriptor = this.buildDescriptorFromKey(permissionKey, options);
    await this.check(descriptor, options);
  }

  /**
   * Returns true when descriptor access is allowed.
   */
  async can(
    descriptor: PermissionDescriptor,
    options?: { ownerId?: string; teamId?: string }
  ): Promise<boolean> {
    const result = await this.authorizeDescriptor(descriptor, options);
    return result.allowed;
  }

  /**
   * Resolves and evaluates a permission by key.
   */
  canByKey(
    permissionKey: string,
    options?: { resourceId?: string; ownerId?: string; teamId?: string }
  ): Promise<boolean> {
    const descriptor = this.buildDescriptorFromKey(permissionKey, options);
    return this.can(descriptor, options);
  }

  /**
   * Builds a permission descriptor from a permission key.
   * @param permissionKey Permission key to resolve
   * @param options Optional resource and team IDs
   * @returns Permission descriptor with object, action, and bitset info
   * @throws ORPCError if permission key is unknown
   */
  buildDescriptorFromKey(
    permissionKey: string,
    options?: { resourceId?: string; teamId?: string }
  ): PermissionDescriptor {
    const entry = resolvePermissionKey(permissionKey);

    if (!entry) {
      throw new ORPCError("BAD_REQUEST", {
        message: `Unknown permission key: ${permissionKey}`,
      });
    }

    const objParts: string[] = [];

    if (options?.teamId) {
      objParts.push("team", options.teamId);
    }

    objParts.push(entry.resource);
    if (entry.subResources.length > 0) {
      objParts.push(...entry.subResources);
    }
    if (options?.resourceId) {
      objParts.push(options.resourceId);
    }

    return {
      obj: objParts.join(":"),
      act: permissionKey,
      permissionKey: entry.key,
      bitIndex: entry.bitIndex,
    };
  }
}
