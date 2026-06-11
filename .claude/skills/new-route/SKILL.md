---
name: new-route
description: Scaffold a complete new TanStack Router page for work-holo's web app following all conventions. Creates the route file, Suspense wrapper, query hook wiring, and route registration. Use when adding any new page or workspace section.
---

You are scaffolding a new TanStack Router route for work-holo's web app (`apps/web`).

## Step 1 — Gather Info

Ask the user (if not already provided):
1. What is this page? (one sentence)
2. Route path — e.g., `/org/$slug/workspace/attendance/reports`
3. Where in the route tree does it live? (which layout group)
4. What data does it fetch? (which oRPC procedures)
5. What actions can the user take? (which mutations)
6. Is it permission-gated? Does the user need a specific role/permission?

## Step 2 — Determine File Location

Map the route path to the file system:
- `/(authenticated)/org/$slug/workspace/<feature>/<page>` → `apps/web/src/routes/(authenticated)/org/$slug/workspace/<feature>/<page>.tsx`
- `/(authenticated)/org/$slug/console/<feature>` → `apps/web/src/routes/(authenticated)/org/$slug/console/<feature>/index.tsx`
- `/(public)/...` → `apps/web/src/routes/(public)/...`

## Step 3 — Create the Route File

```tsx
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { queryUtils } from "@/utils/orpc"

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/<feature>/<page>"
)({
  staticData: { crumb: "<Page Title>" },
  component: () => (
    <Suspense fallback={<PageSkeleton />}>
      <RouteComponent />
    </Suspense>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-destructive">Failed to load: {error.message}</div>
  ),
})

function RouteComponent() {
  const { slug } = Route.useParams()
  
  const { data: <resource> } = useSuspenseQuery(
    queryUtils.<domain>.<procedure>.queryOptions({ input: { /* ... */ } })
  )

  return (
    <section className="page-gradient space-y-6 p-6">
      <h1 className="text-2xl font-semibold"><Page Title></h1>
      {/* content */}
    </section>
  )
}

function PageSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-48 rounded-md bg-muted animate-pulse" />
      <div className="h-32 rounded-md bg-muted animate-pulse" />
    </div>
  )
}
```

## Step 4 — Handle Mutations

```tsx
import { orpcClient, queryClient, queryUtils } from "@/utils/orpc"

// Inside the component:
async function handleAction(input: ActionInput) {
  await orpcClient.<domain>.<procedure>(input)
  await queryClient.invalidateQueries({
    queryKey: queryUtils.<domain>.<readProcedure>.queryOptions({ input: {} }).queryKey
  })
}
```

## Step 5 — Permission Gate (if needed)

```tsx
import { PermissionGate } from "@/lib/permission/components"

// Wrap content that requires a permission:
<PermissionGate permission="<module>:<resource>:<action>">
  <SensitiveContent />
</PermissionGate>
```

## Step 6 — Link the Route

Check if the route needs to appear in a sidebar, breadcrumb, or navigation. If so:
- Add to the relevant sidebar nav config file in `apps/web/src/components/`
- The `staticData: { crumb: "..." }` handles the breadcrumb automatically if the parent layout reads it

## Step 7 — Checklist Before Done

- [ ] `createFileRoute` path string exactly matches the file path
- [ ] `useSuspenseQuery` is inside `<Suspense>` boundary
- [ ] `errorComponent` defined on the route
- [ ] Mutations invalidate the correct query keys
- [ ] Dynamic params accessed via `Route.useParams()` not `useParams()`
- [ ] Empty state rendered when data is an empty array
- [ ] Loading skeleton in Suspense fallback (not just a spinner)
