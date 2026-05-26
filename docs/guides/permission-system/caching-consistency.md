# Caching and Consistency

## Cache domains and Redis keys

`CacheManager` manages three keyspaces:

- decision cache: `perm:{userId}:{orgId}:{permissionKey}`
- bitset cache: `bitset:{userId}:{orgId}`
- permission-map cache: `perm_map:{userId}:{orgId}`

## TTL configuration

Current hardcoded TTLs in `packages/permission/src/services/cache-manager.ts`:

- decision cache TTL: `300` seconds
- bitset cache TTL: `600` seconds
- permission-map cache TTL: `600` seconds

## Policy version alignment

All cached payloads include `policyVersion`.

Read behavior:

1. cache value is parsed
2. `policyVersion` is compared with current org policy version
3. on mismatch, stale key is deleted and treated as cache miss

This gives version-safe cache invalidation even before TTL expiry.

## Version consistency in authorization chain

In `AuthorizationEngine.authorize()`, the policy version is read once at the start and passed through the entire authorization chain:
- `authorize()` reads `currentVersion` from Redis/cache
- passes to `getOrCompileBitset()`
- passes to `compileBitset()`
- used for all cache lookups and writes within that request

This eliminates version skew where different parts of the pipeline could see different versions mid-request, preventing false denies from stale bitsets labeled with newer versions.

## Policy version storage

`PolicyManager` stores current org policy version in Redis key:

- `policy_version:{orgId}`

and also keeps local process cache in memory (`localVersionCache`) as fallback.

**Version publication ordering:**
The active policy version is only published to Redis **after** the Casbin enforcer successfully reloads the new policies. This ensures other instances never see a new version number while enforcement still uses old policies.

The compile pipeline order is:
1. Write new policies to `casbin_rule` table
2. Mark policy version row as `compiled`
3. **Reload enforcer** (`enforcer.loadPolicy()`)
4. **Publish version** (`SET policy_version:{orgId}`)

If step 3 fails, step 4 never executes, and the old version remains active.

## Invalidation behavior

### User-scoped invalidation

Used after role/override mutation for a target user.

- decision keys for `userId + orgId` are found with Redis `SCAN` and deleted
- bitset key for `userId + orgId` is deleted
- permission-map key for `userId + orgId` is deleted

### Org-scoped invalidation

Used after org-level recompile:

- scans and deletes all matching org decision, bitset, and permission-map keys

Current scan batch size is `COUNT 100`.

## Consistency implications

- Fast path checks are usually cache + bitset.
- Bitset compilation only folds in org-wide overrides (no `teamId`/`resourceId`), so scoped overrides are enforced at the Casbin layer without being short-circuited by the bitset prefilter.
- Version mismatches automatically flush stale read paths.
- Policy recompilation increments version and forces subsequent reads to refresh.
- Frontend map consistency is improved through event-driven query invalidation (`permission:update`).
