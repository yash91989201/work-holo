# Backend Integration

## Bootstrap and manager lifecycle

`apps/server/src/index.ts` initializes shared permission managers at process startup:

- `PermissionManagers.initialize({ db, redis, pusher })`

Initialized managers:

- `CacheManager`
- `PolicyManager`
- `AuthorizationEngine`
- `PermissionEventManager`
- `PermissionMapManager`

`PermissionEventManager.initialize()` is called during this setup to register internal listeners.

## API context injection

`packages/api/src/index.ts` injects `PermissionService` in `orgProcedure`.

- Requires authenticated session with active org
- Fetches shared managers via `PermissionManagers.getAll()`
- Creates per-request service:
  - `userId`: current user
  - `orgId`: active organization
  - `db`: request database handle
  - managers: cache/policy/engine/event/map

`orgMemberProcedure` then validates organization membership and adds member role metadata.

## Permission check usage patterns in API routers

Two common patterns are used in `packages/api/src/routers`:

1. **Direct descriptor checks**
   - Example shape: `await permission.check(permission.org.read())`
   - Example shape: `await permission.check(permission.channel().message.create())`
   - Example shape: `await permission.check(permission.attendance().record.read())`
   - Used in org/team/channel/attendance/message endpoints
   - **Note:** `channel()` and `attendance()` are now methods (not getters) and accept optional `teamId` for team-scoped permissions

2. **Resource guards for communication domain**
   - `await permission.requireChannelAccess(channelId, action)`
   - `await permission.requireMessageAccess(messageId, action)`
   - Used heavily in:
     - `packages/api/src/routers/communication/channel.ts`
     - `packages/api/src/routers/communication/message.ts`

In communication routes, this combines membership validation with permission enforcement in one call.

## Permission map endpoint for web hydration

`packages/api/src/routers/user/permission.ts` exposes:

- `permissionRouter.get`
- Procedure: `orgMemberProcedure`
- Implementation: `context.permission.getPermissionMap()`

This endpoint is the single source used by web permission context.

## Admin mutation flow

`PermissionAdmin` methods (`assignRole`, `revokeRole`, `createPolicyOverride`, `removePolicyOverride`, `recompilePolicies`) follow this pattern:

1. Write DB mutation
2. Recompile policies for org
3. Invalidate affected cache scopes
4. Emit permission event (audit + realtime)

For user-scoped mutations, invalidation targets:

- decision cache entries for that user + org
- bitset cache for that user + org
- permission map cache for that user + org

For org-wide recompile, org-level decision/bitset/map keys are invalidated.

## Admin API constraints

**Role revocation requires teamId for team-scoped roles:**

`PermissionAdmin.revokeRole(targetUserId, roleTemplateId, options)` validates:
- If the role template has `scope: "team"` and no `teamId` is provided in options, throws `BAD_REQUEST` error
- This prevents accidental revocation across all teams when only a single team assignment should be removed
- Org-scoped roles can still be revoked without providing `teamId`
