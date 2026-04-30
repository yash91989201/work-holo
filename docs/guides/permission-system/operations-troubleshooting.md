# Operations and Troubleshooting

## Operational touchpoints

## Initialization failures

Symptom:

- Runtime error: `PermissionManagers not initialized. Call PermissionManagers.initialize() first.`

Check:

1. confirm `apps/server/src/index.ts` runs `PermissionManagers.initialize(...)` before serving API
2. confirm Redis connection is established before initialization

## Permission change not reflected in UI

Check in order:

1. policy recompile success (no error result)
2. policy version incremented (`policy_version:{orgId}`)
3. user/org caches invalidated
4. permission event emitted (`permission:update` to user channel)
5. frontend subscription active (`usePermissionSync` mounted)
6. query invalidation and refetch occurred (`user.permission.get`)
7. if the change was a base org-role change, confirm Better Auth `member.role` was updated and that an org-scoped request ran through `orgMemberProcedure` to trigger `assignOrgUserRole(...)` synchronization

## Unexpected deny on API

Check in order:

1. correct org context in request (`activeOrganizationId`)
2. resource guard preconditions (channel org match, channel membership, message existence)
3. permission key correctness (exists in vocabulary)
4. for base org access, verify the user's Better Auth membership row has the expected `member.role`
5. for custom access, verify the expected non-system `roleAssignment` exists with the correct `teamId` / org scope
6. bitset contains expected bit index for user
7. Casbin rules present for subject/domain/object/action
8. deny override exists and is active (not expired)

## Enforce mode behavior

`PermissionChecker.check()` throws `FORBIDDEN` only when `CASBIN_ENFORCE` is enabled.

`can()` and `authorizeDescriptor()` remain decision-oriented and do not throw on deny.

## Common event channels

From `PermissionEventManager`:

- org broadcast: `private-org-${orgId}` with event `permission:change`
- user broadcast: `private-user-${userId}` with event `permission:update`

From frontend sync hook:

- subscribed event for refresh: `permission:update`

## Key files for debugging

- runtime checks: `packages/permission/src/services/authorization-engine.ts`
- cache behavior: `packages/permission/src/services/cache-manager.ts`
- compile behavior: `packages/permission/src/services/policy-manager.ts`
- membership/system-role sync: `packages/permission/src/utils/assign-org-user-role.ts`
- route usage: `packages/api/src/routers/communication/channel.ts`
- route usage: `packages/api/src/routers/communication/message.ts`
- web hydration: `apps/web/src/lib/permission/permission-context.tsx`
- web sync: `apps/web/src/hooks/use-permission-sync.ts`
