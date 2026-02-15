# Architecture and Runtime Flow

## Core runtime components

The permission system is centered in `packages/permission/src/services`.

- `PermissionService`: facade used by application code (`check`, `can`, guards, admin APIs)
- `PermissionChecker`: resolves descriptors and dispatches authorization
- `AuthorizationEngine`: decision pipeline (owner bypass, cache, bitset, Casbin)
- `PolicyManager`: compiles role + override data into Casbin rules and manages versioning
- `CacheManager`: Redis cache for decisions, bitsets, and permission maps
- `PermissionMapManager`: computes and caches full permission maps for frontend hydration
- `PermissionAdmin`: role and override mutations with recompilation + invalidation
- `PermissionEventManager`: audit + realtime fanout
- `PermissionResourceGuard`: channel/message precondition checks before permission checks

Manager instances are wired by `PermissionManagers.initialize()` in `apps/server/src/index.ts`.

## End-to-end request flow

For org-scoped API handlers, `packages/api/src/index.ts` creates a `PermissionService` in `orgProcedure` and places it in request context.

Typical check path:

1. API route calls `permission.check(...)` or a guard method.
2. `PermissionChecker.authorizeDescriptor()` builds `AuthorizationRequest`.
3. `AuthorizationEngine.authorizeWithOwnerBypass()` runs the full auth pipeline first, then applies owner bypass if the user is denied but is the resource owner (unless an explicit deny override exists).
4. `AuthorizationEngine.authorize()` checks Redis decision cache.
5. If no decision cache hit, engine loads/compiles user bitset and checks permission bit.
6. If bit is set, engine calls Casbin enforcer with domain/object/action.
7. Final decision is cached with current policy version.

## Decision modes (`AuthorizationResult.decidedBy`)

- `owner`: owner bypass applied (user is resource owner, no explicit deny override exists)
- `cache`: decision came from Redis decision cache
- `bitset`: denied at bitset prefilter without Casbin call
- `casbin`: full Casbin enforcement performed

## Owner bypass behavior

Owner bypass is handled at the application layer in `AuthorizationEngine.authorizeWithOwnerBypass()`, not in the Casbin model.

When a user is the resource owner and the normal authorization pipeline denies the request:

1. Check if an explicit deny override exists in `policyOverrideTable` for this user, org, and permission key (non-expired).
2. If an explicit deny override exists, the deny is respected — ownership does not override it.
3. If no explicit deny override exists, the owner bypass is applied and the request is allowed.

The `respectDenyOverrides` flag is currently hardcoded to `true`. A future org settings feature will make this configurable per-organization, allowing admins to control whether explicit deny overrides take precedence over resource ownership.

## Resource guard flow

`PermissionResourceGuard` adds data-level checks before auth:

- `requireChannelAccess(channelId, action)`
  - channel exists
  - channel belongs to current org
  - user is a member of channel
  - permission check runs (ownerId uses channel creator)
- `requireMessageAccess(messageId, action)`
  - message exists
  - reuses channel access check for message's channel
  - message-level permission check (ownerId uses sender)

## Permission map flow (frontend hydration)

`PermissionMapManager.buildPermissionMap(userId, orgId)`:

1. Get current policy version
2. If version is `0`, compile + reload policies
3. Try Redis map cache (`perm_map:{userId}:{orgId}`)
4. Try DB snapshot (`permission_snapshot` table)
5. Compute map via Casbin over all vocabulary entries
6. Save to Redis + DB snapshot

This gives frontend a complete `Record<string, boolean>` map with one API call.
