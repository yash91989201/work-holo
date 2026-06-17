import type { db as DbClient } from "@work-holo/db";
import type { RedisClient } from "@work-holo/infrastructure";

import type Pusher from "pusher";
import { AuthorizationEngine } from "../services/authorization-engine";
import { CacheManager } from "../services/cache-manager";
import { PermissionEventManager } from "../services/permission-event-manager";
import { PermissionMapManager } from "../services/permission-map-manager";
import { PolicyManager } from "../services/policy-manager";

/**
 * Aggregates all singleton-like manager instances used by the permission package.
 */
export interface AllPermissionManagers {
  authorizationEngine: AuthorizationEngine;
  cacheManager: CacheManager;
  eventManager: PermissionEventManager;
  permissionMapManager: PermissionMapManager;
  policyManager: PolicyManager;
}

let cacheManager: CacheManager | null = null;
let policyManager: PolicyManager | null = null;
let authorizationEngine: AuthorizationEngine | null = null;
let eventManager: PermissionEventManager | null = null;
let permissionMapManager: PermissionMapManager | null = null;

/**
 * Returns initialized managers or throws when initialization is missing.
 */
const assertInitialized = (): AllPermissionManagers => {
  if (
    !(
      cacheManager &&
      policyManager &&
      authorizationEngine &&
      eventManager &&
      permissionMapManager
    )
  ) {
    throw new Error(
      "PermissionManagers not initialized. Call PermissionManagers.initialize() first."
    );
  }

  return {
    cacheManager,
    policyManager,
    authorizationEngine,
    eventManager,
    permissionMapManager,
  };
};

/**
 * Initializes and exposes shared manager instances for the permission package.
 */
export const PermissionManagers = {
  /**
   * Constructs and wires all managers.
   */
  initialize(config: {
    db: typeof DbClient;
    redis: RedisClient;
    pusher?: Pusher;
  }): void {
    cacheManager = new CacheManager(config.redis);
    policyManager = new PolicyManager(config.db, config.redis);
    authorizationEngine = new AuthorizationEngine(
      cacheManager,
      policyManager,
      config.db
    );
    eventManager = new PermissionEventManager(config.db, config.pusher);
    permissionMapManager = new PermissionMapManager(
      config.db,
      cacheManager,
      policyManager
    );

    eventManager.initialize();
  },

  /**
   * Returns all initialized managers.
   */
  getAll(): AllPermissionManagers {
    return assertInitialized();
  },

  /**
   * Returns the cache manager instance.
   */
  getCacheManager(): CacheManager {
    return assertInitialized().cacheManager;
  },

  /**
   * Returns the policy manager instance.
   */
  getPolicyManager(): PolicyManager {
    return assertInitialized().policyManager;
  },

  /**
   * Returns the authorization engine instance.
   */
  getAuthorizationEngine(): AuthorizationEngine {
    return assertInitialized().authorizationEngine;
  },

  /**
   * Returns the permission event manager instance.
   */
  getEventManager(): PermissionEventManager {
    return assertInitialized().eventManager;
  },

  /**
   * Returns the permission map manager instance.
   */
  getPermissionMapManager(): PermissionMapManager {
    return assertInitialized().permissionMapManager;
  },

  /**
   * Resets all manager singletons, primarily for tests and re-initialization.
   */
  reset(): void {
    cacheManager = null;
    policyManager = null;
    authorizationEngine = null;
    eventManager = null;
    permissionMapManager = null;
  },
} as const;
