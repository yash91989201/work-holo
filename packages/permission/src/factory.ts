import { permissionContainer } from "./container";
import { AuthorizationEngine } from "./services/authorization-engine";
import { CacheManager } from "./services/cache-manager";
import { PermissionEventManager } from "./services/permission-event-manager";
import { PermissionMapManager } from "./services/permission-map-manager";
import { PolicyManager } from "./services/policy-manager";

/**
 * Permission manager instances created from infrastructure dependencies.
 *
 * These are **stateless services** that can be safely shared across all requests.
 * They coordinate the permission system's core operations:
 * - Authorization decisions (3-tier pipeline)
 * - Policy compilation (DB → Casbin)
 * - Caching (Redis)
 * - Event emission (audit logs, Pusher)
 * - Permission map building (frontend hydration)
 */
export interface PermissionManagers {
  /** Manages Redis caching for decisions, bitsets, and permission maps */
  cacheManager: CacheManager;

  /** Compiles database policies into Casbin rules */
  policyManager: PolicyManager;

  /** Executes the 3-tier authorization pipeline */
  authorizationEngine: AuthorizationEngine;

  /** Emits audit logs and real-time permission events */
  eventManager: PermissionEventManager;

  /** Builds complete permission maps for frontend hydration */
  permissionMapManager: PermissionMapManager;
}

/**
 * Create permission manager instances from initialized infrastructure.
 *
 * **Important:**
 * - Call `permissionContainer.initialize()` BEFORE calling this function
 * - Managers are stateless and can be created once at startup
 * - Reuse the same manager instances across all requests (don't recreate per-request)
 * - Each manager coordinates a specific aspect of the permission system
 *
 * **Architecture:**
 * ```
 * PermissionManagers (stateless, reusable)
 *   ├─ CacheManager ──────────► Redis (decisions, bitsets, maps)
 *   ├─ PolicyManager ─────────► DB + Redis (Casbin policies, versions)
 *   ├─ AuthorizationEngine ───► Cache + Policy + DB (3-tier pipeline)
 *   ├─ EventManager ──────────► DB + Pusher (audit logs, events)
 *   └─ PermissionMapManager ──► DB + Cache + Policy (permission maps)
 * ```
 *
 * @returns Stateless permission manager instances
 * @throws Error if container not initialized
 *
 * @example
 * ```typescript
 * // Server startup (apps/server/src/index.ts)
 * const redis = await getRedisClient();
 * permissionContainer.initialize({ db, redis, pusher });
 *
 * // Create managers ONCE
 * const permissionManagers = createPermissionManagers();
 *
 * // Reuse across all requests
 * app.use(async (c, next) => {
 *   const context = await createContext({
 *     context: c,
 *     permissionManagers,  // ← Same instances for every request
 *   });
 *   // ...
 * });
 * ```
 */
export function createPermissionManagers(): PermissionManagers {
  const { db, redis, pusher } = permissionContainer.getInfrastructure();

  // Create stateless manager instances
  const cacheManager = new CacheManager(redis);
  const policyManager = new PolicyManager(db, redis);
  const authorizationEngine = new AuthorizationEngine(
    cacheManager,
    policyManager,
    db
  );
  const eventManager = new PermissionEventManager(db, pusher);
  const permissionMapManager = new PermissionMapManager(
    db,
    cacheManager,
    policyManager
  );

  // Initialize event manager (sets up event handlers)
  eventManager.initialize();

  return {
    cacheManager,
    policyManager,
    authorizationEngine,
    eventManager,
    permissionMapManager,
  };
}
