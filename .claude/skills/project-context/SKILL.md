---
name: project-context
description: Load full work-holo project context. Use this automatically at the start of any session to understand the product, architecture, conventions, and current state.
user-invocable: false
---

Load this context before doing any work on work-holo.

## Product

**work-holo** is a workplace productivity and communication platform for organizations.

Core modules:
- **Attendance** — clock-in/out, work blocks, analytics, admin oversight
- **Communication** — team channels, direct messages, threads, reactions, file sharing
- **Notifications** — in-app, push (web + native), preferences per event type
- **Presence** — real-time online/away/busy status via Pusher
- **Teams** — org-level team management, team-scoped access
- **Org Management** — invitations, member roles, module config per org
- **Storage** — file upload to object storage, attachment management

## Architecture

```
work-holo/
├── apps/
│   ├── web/          — React + TanStack Router + Vite (main web app)
│   ├── native/       — Expo (React Native mobile app)
│   ├── server/       — Hono server (serves oRPC + auth + Electric proxy)
│   ├── docs/         — Astro docs site
│   └── www/          — Marketing site
├── packages/
│   ├── api/          — oRPC routers, Zod schemas, procedure definitions
│   ├── db/           — Drizzle ORM, schema, migrations (PostgreSQL)
│   ├── auth/         — Better Auth configuration
│   ├── permission/   — Casbin RBAC permission system
│   ├── infrastructure/ — Redis, shared infra clients
│   ├── ui/           — Shared component library (shadcn-based)
│   ├── email/        — Email templates
│   ├── env/          — Shared env validation (t3-env)
│   └── config/       — Shared TS/ESLint configs
```

## Key Technology Choices

| Concern | Technology |
|---|---|
| API layer | oRPC (`@orpc/server`, `@orpc/client`) |
| Database | PostgreSQL via Drizzle ORM |
| Auth | Better Auth |
| Permissions | Casbin RBAC via `@work-holo/permission` |
| Real-time | Pusher (channels + presence) |
| Sync | ElectricSQL (local-first sync for web) |
| Web routing | TanStack Router (file-based) |
| Web state | TanStack Query (via `@orpc/tanstack-query`) |
| Mobile | Expo Router |
| IDs | cuid2 (never serial, never uuid()) |

## Procedure Hierarchy (packages/api/src/index.ts)

```
publicProcedure           — no auth
  └── protectedProcedure  — valid session
        └── orgProcedure  — active org selected, injects permission + notification
              └── orgMemberProcedure — confirmed org member, injects orgMembership
                    └── dmProcedure — orgMember + DM module enabled
        └── adminProcedure      — system admin/super_admin
        └── superAdminProcedure — super_admin only
```

## oRPC Convention

```ts
// In packages/api/src/routers/<domain>/<file>.ts
export const clockRouter = {
  punchIn: orgMemberProcedure
    .input(MemberPunchInInput)   // Zod schema from packages/api/src/lib/schemas/
    .output(MemberPunchInOutput)
    .handler(async ({ input, context: { db, session, orgId, permission } }) => {
      await permission.check(permission.attendance().record.create())
      // ... Drizzle queries
    }),
}
```

## Web Client Convention

```ts
// Query
const { data } = useSuspenseQuery(
  queryUtils.attendance.clock.getToday.queryOptions({ input: {} })
)

// Mutation
await orpcClient.attendance.clock.punchIn({ note: "arriving" })
await queryClient.invalidateQueries({ queryKey: queryUtils.attendance.clock.getToday.queryOptions({}).queryKey })
```

## Drizzle Schema Convention

```ts
export const myTable = pgTable("myTable", {
  id: cuid2().defaultRandom().primaryKey(),
  organizationId: text().notNull().references(() => organization.id, { onDelete: "cascade" }),
  userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp({ withTimezone: true }).$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
})
```

## After Adding Schemas

Always run: `bun run generate:types` to refresh `packages/api/src/lib/types.ts`
