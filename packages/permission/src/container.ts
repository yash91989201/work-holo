import type { db as DbClient } from "@work-holo/db";
import type { RedisClient } from "bun";

/**
 * Pusher-like interface for real-time events.
 * Allows dependency injection without tight coupling to Pusher SDK.
 */
export interface PusherLike {
  trigger(channel: string, event: string, data: unknown): Promise<unknown>;
}

/**
 * Infrastructure dependencies required by the permission system.
 *
 * These are external services that the permission system depends on:
 * - Database for storing authorization rules
 * - Redis for caching and version tracking
 * - Pusher for real-time permission events (optional)
 */
export interface PermissionInfrastructure {
  /** Database client for querying authorization tables and Casbin rules */
  db: typeof DbClient;

  /** Redis client for caching and policy versioning */
  redis: RedisClient;

  /** Optional Pusher client for real-time permission events */
  pusher?: PusherLike;
}

/**
 * Singleton container for permission system dependencies.
 *
 * **Pattern: Dependency Injection Container**
 *
 * Benefits:
 * - Initialize once at app startup
 * - Access anywhere without passing dependencies through every function
 * - Easy to mock for testing (just call reset() and initialize with mocks)
 * - Clear ownership and lifecycle management
 * - No global state pollution (container is explicit)
 *
 * @example
 * ```typescript
 * // Server startup
 * const redis = await getRedisClient();
 * permissionContainer.initialize({ db, redis, pusher });
 *
 * // Later in services
 * const { db, redis } = permissionContainer.getInfrastructure();
 *
 * // Testing
 * permissionContainer.reset();
 * permissionContainer.initialize({ db: mockDb, redis: mockRedis });
 * ```
 */
class PermissionContainer {
  private infrastructure: PermissionInfrastructure | null = null;

  /**
   * Initialize the container with infrastructure dependencies.
   * Should be called once at application startup.
   *
   * @param infrastructure - Database, Redis, and optional Pusher clients
   * @throws Error if already initialized (call reset() first)
   *
   * @example
   * ```typescript
   * const redis = await getRedisClient();
   * permissionContainer.initialize({ db, redis, pusher });
   * ```
   */
  initialize(infrastructure: PermissionInfrastructure): void {
    if (this.infrastructure) {
      throw new Error(
        "PermissionContainer already initialized. Call reset() first if you need to re-initialize."
      );
    }
    this.infrastructure = infrastructure;
  }

  /**
   * Get the infrastructure dependencies.
   *
   * @returns Infrastructure object with db, redis, and optional pusher
   * @throws Error if not initialized
   *
   * @example
   * ```typescript
   * const { db, redis, pusher } = permissionContainer.getInfrastructure();
   * ```
   */
  getInfrastructure(): PermissionInfrastructure {
    if (!this.infrastructure) {
      throw new Error(
        "PermissionContainer not initialized. Call initialize() first."
      );
    }
    return this.infrastructure;
  }

  /**
   * Check if container is initialized.
   *
   * @returns true if initialize() has been called
   *
   * @example
   * ```typescript
   * if (!permissionContainer.isInitialized()) {
   *   permissionContainer.initialize({ db, redis });
   * }
   * ```
   */
  isInitialized(): boolean {
    return this.infrastructure !== null;
  }

  /**
   * Reset the container, clearing all dependencies.
   * Useful for testing or hot-reloading scenarios.
   *
   * @example
   * ```typescript
   * // In test teardown
   * afterEach(() => {
   *   permissionContainer.reset();
   * });
   * ```
   */
  reset(): void {
    this.infrastructure = null;
  }
}

/**
 * Singleton instance - import and use this directly.
 *
 * @example
 * ```typescript
 * import { permissionContainer } from "@work-holo/permission";
 *
 * // Initialize once
 * permissionContainer.initialize({ db, redis, pusher });
 *
 * // Use anywhere
 * const { redis } = permissionContainer.getInfrastructure();
 * ```
 */
export const permissionContainer = new PermissionContainer();
