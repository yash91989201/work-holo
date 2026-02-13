import type { db as DbClient } from "@work-holo/db";
import type { RedisClient } from "bun";
import type Pusher from "pusher";
import { AuthorizationEngine } from "../services/authorization-engine";
import { CacheManager } from "../services/cache-manager";
import { PermissionEventManager } from "../services/permission-event-manager";
import { PermissionMapManager } from "../services/permission-map-manager";
import { PolicyManager } from "../services/policy-manager";

export interface AllPermissionManagers {
  cacheManager: CacheManager;
  policyManager: PolicyManager;
  authorizationEngine: AuthorizationEngine;
  eventManager: PermissionEventManager;
  permissionMapManager: PermissionMapManager;
}

let cacheManager: CacheManager | null = null;
let policyManager: PolicyManager | null = null;
let authorizationEngine: AuthorizationEngine | null = null;
let eventManager: PermissionEventManager | null = null;
let permissionMapManager: PermissionMapManager | null = null;

// biome-ignore lint/complexity/noStaticOnlyClass: Singleton pattern with encapsulated state
export class PermissionManagers {
  static initialize(config: {
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
  }

  static getAll(): AllPermissionManagers {
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
  }

  static getCacheManager(): CacheManager {
    if (!cacheManager) {
      throw new Error(
        "PermissionManagers not initialized. Call PermissionManagers.initialize() first."
      );
    }
    return cacheManager;
  }

  static getPolicyManager(): PolicyManager {
    if (!policyManager) {
      throw new Error(
        "PermissionManagers not initialized. Call PermissionManagers.initialize() first."
      );
    }
    return policyManager;
  }

  static getAuthorizationEngine(): AuthorizationEngine {
    if (!authorizationEngine) {
      throw new Error(
        "PermissionManagers not initialized. Call PermissionManagers.initialize() first."
      );
    }
    return authorizationEngine;
  }

  static getEventManager(): PermissionEventManager {
    if (!eventManager) {
      throw new Error(
        "PermissionManagers not initialized. Call PermissionManagers.initialize() first."
      );
    }
    return eventManager;
  }

  static getPermissionMapManager(): PermissionMapManager {
    if (!permissionMapManager) {
      throw new Error(
        "PermissionManagers not initialized. Call PermissionManagers.initialize() first."
      );
    }
    return permissionMapManager;
  }

  static reset(): void {
    cacheManager = null;
    policyManager = null;
    authorizationEngine = null;
    eventManager = null;
    permissionMapManager = null;
  }
}
