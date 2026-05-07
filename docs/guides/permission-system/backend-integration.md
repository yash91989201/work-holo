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

`orgMemberProcedure` then validates organization membership, synchronizes the permission system's persisted system-role assignment from Better Auth via `assignOrgUserRole(...)`, and adds member role metadata.

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

## Prefer permission checks over raw org role checks

API routes should enforce authorization through `context.permission.check(...)`, not by manually checking `context.orgMembership.role` strings.

For example, `packages/api/src/routers/org/module-config.ts` now uses `context.permission.check(context.permission.org.update())` instead of a hardcoded `owner/admin` bypass. This keeps backend authorization compatible with future custom roles.

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

`PermissionAdmin.assignRole(...)` and `PermissionAdmin.revokeRole(...)` now validate the role model more strictly:

- system role templates cannot be assigned or revoked through `PermissionAdmin`
  - org system roles are controlled by Better Auth membership on `member.role`
- non-system role templates must belong to the current organization
- `teamId` is required for `scope: "team"` role templates
- `teamId` is rejected for `scope: "org"` role templates
- when `teamId` is provided, the team must belong to the current organization
- role assignment writes use `onConflictDoNothing()` so repeated assignment is idempotent

This means the admin API is only for custom assignable roles and direct policy overrides. Base `owner` / `admin` / `member` changes should happen through the organization membership system, not through permission role assignment APIs.
