# Frontend Integration

## Data source

Frontend permission state is hydrated from API endpoint `user.permission.get`, which returns a full permission map for the current user and active org.

## Provider wiring

`apps/web/src/routes/(authenticated)/org/$slug/route.tsx` does two key things:

1. Prefetches permission map query in route loader
2. Wraps authenticated org layout with `PermissionProvider`

`PermissionProvider` (`apps/web/src/lib/permission/permission-context.tsx`) loads map via:

- `useSuspenseQuery(queryUtils.user.permission.get.queryOptions({}))`

and provides `permissionMap.permissions` through React context.

## Hooks

### `usePermissions()`

Returns raw `Record<string, boolean>` from context.

### `useCan(input: PermissionInput)`

Evaluates permissions with shared DSL helpers from `@work-holo/permission`:

- `resolvePermission(input)`
- `evaluateExpression(expr, permissions)`

Supported inputs:

- direct key string
- selector callback using `permissionKey` tree
- composed expression with `and`, `or`, `not`

## UI gating components

`apps/web/src/lib/permission/components.tsx` provides:

- `Can` component
  - conditional render
  - optional fallback
  - optional render-prop children
- `withPermission` HOC
  - wraps a component and renders fallback/null when denied

## Realtime permission refresh

`apps/web/src/hooks/use-permission-sync.ts` subscribes to Pusher channel:

- `private-user-${user.id}`
- event: `permission:update`

On event, it invalidates `user.permission.get` query key, which rehydrates permission map.

## Practical guidance

- Use `useCan` for lightweight check logic in components.
- Use `Can` for declarative UI gating.
- Keep server-side checks authoritative; frontend gating is UX-level and not security boundary.
- Keep `PermissionProvider` high in authenticated org route tree to avoid duplicated fetches.
