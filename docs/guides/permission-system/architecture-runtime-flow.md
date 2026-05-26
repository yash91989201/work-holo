# Architecture and Runtime Flow

## Core runtime components

The permission system is centered in `packages/permission/src/services`.

- `PermissionService`: facade used by application code (`check`, `can`, guards, admin APIs)
- `PermissionChecker`: resolves descriptors and dispatches authorization
- `AuthorizationEngine`: decision pipeline (membership-derived system roles, owner bypass, cache, bitset, Casbin)
- `PolicyManager`: compiles role + override data into Casbin rules and manages versioning
- `CacheManager`: Redis cache for decisions, bitsets, and permission maps
- `PermissionMapManager`: computes and caches full permission maps for frontend hydration
- `PermissionAdmin`: role and override mutations with recompilation + invalidation
- `PermissionEventManager`: audit + realtime fanout
- `PermissionResourceGuard`: channel/message precondition checks before permission checks

Manager instances are wired by `PermissionManagers.initialize()` in `apps/server/src/index.ts`.

## End-to-end request flow

For org-scoped API handlers, `packages/api/src/index.ts` creates a `PermissionService` in `orgProcedure` and places it in request context. `orgMemberProcedure` then validates membership and synchronizes the persisted org-scoped system-role assignment from `member.role` before continuing.

Typical check path:

1. API route calls `permission.check(...)` or a guard method.
2. `PermissionChecker.authorizeDescriptor()` builds `AuthorizationRequest`.
3. `AuthorizationEngine.authorizeWithOwnerBypass()` runs the full auth pipeline first, then applies owner bypass if the user is denied but is the resource owner (unless a scope-applicable explicit deny override exists).
4. `AuthorizationEngine.authorize()` checks Redis decision cache.
5. If no decision cache hit, engine resolves applicable role templates:
   - system org role from Better Auth `member.role`
   - non-system role assignments from `roleAssignment`
6. Engine loads/compiles user bitset (reading policy version once and using it consistently throughout compilation) and checks permission bit.
7. If bit is set, engine calls Casbin enforcer with domain/object/action.
8. Final decision is cached with current policy version.

## Decision modes (`AuthorizationResult.decidedBy`)

- `owner`: owner bypass applied (user is resource owner, no explicit deny override exists)
- `cache`: decision came from Redis decision cache
- `bitset`: denied at bitset prefilter without Casbin call
- `casbin`: full Casbin enforcement performed

## Owner bypass behavior

Owner bypass is handled at the application layer in `AuthorizationEngine.authorizeWithOwnerBypass()`, not in the Casbin model.

When a user is the resource owner and the normal authorization pipeline denies the request:

1. Check if a **scope-applicable** explicit deny override exists in `policyOverrideTable` for this user, org, permission key, and scope context (teamId/resourceId) — non-expired.
2. The scope matching uses the same `isOverrideApplicable` logic as normal override enforcement:
   - If override has a `teamId` set, it only applies if the request's teamId matches
   - If override has a `resourceId` set, it only applies if the request's resourceId matches
   - Global overrides (null teamId/resourceId) always apply
3. If a scope-applicable explicit deny override exists, the deny is respected — ownership does not override it.
4. If no explicit deny override exists, the owner bypass is applied and the request is allowed.

The `respectDenyOverrides` flag is currently hardcoded to `true`. A future org settings feature will make this configurable per-organization, allowing admins to control whether explicit deny overrides take precedence over resource ownership.

## Resource guard flow

`PermissionResourceGuard` adds data-level checks before auth:

- `requireChannelAccess(channelId, action)`
  - channel exists
  - channel belongs to current org
  - user is a member of channel
  - **channel's teamId is retrieved from the database**
  - **if channel has a teamId, descriptor is rebuilt with team scope for proper policy matching**
  - permission check runs with teamId in options (ownerId uses channel creator)
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

## Current role architecture

The runtime now follows these rules:

- **System org roles** (`owner`, `admin`, `member`) come from Better Auth membership rows, not from `roleAssignment`
- **Persisted system assignments** may still exist for sync/audit compatibility, but compilation and runtime authorization derive the effective system role from `member.role`
- **Custom roles** are non-system templates; team-specific custom access should be modeled with `scope: "team"` and `roleAssignment.teamId`
- direct backend checks against membership role strings should be treated as legacy unless no permission key exists for the capability
