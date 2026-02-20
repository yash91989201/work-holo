# Packages Directory

Shared packages for the Work-Holo monorepo. All packages are TypeScript-first and use Bun workspaces.

## Package Overview

| Package | Purpose | Exports |
|---------|---------|---------|
| `@work-holo/api` | oRPC routers and business logic | Routers, procedures, schemas |
| `@work-holo/auth` | Better-Auth configuration | Auth instance, types |
| `@work-holo/db` | Drizzle ORM schema and client | db, schema tables |
| `@work-holo/env` | Environment validation | Typed env objects |
| `@work-holo/permission` | RBAC engine (Casbin) | PermissionService, DSL |
| `@work-holo/infrastructure` | External services (Redis, Queue, Pusher) | Singleton clients |
| `@work-holo/config` | Shared TypeScript/Biome config | tsconfig.base.json |

## Dependency Graph

```
                    @work-holo/config
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
      @work-holo/env  @work-holo/db  (others)
            │             │
            │             ▼
            │      @work-holo/auth
            │             │
            └──────┬──────┘
                   ▼
            @work-holo/permission
                   │
            ┌──────┴──────┐
            ▼             ▼
     @work-holo/api  @work-holo/infrastructure
```

## Package Details

### @work-holo/api (`packages/api/`)

Core API implementation with oRPC for type-safe client-server communication.

**Key Files:**
- `src/index.ts` - Procedure definitions (public, protected, org, orgMember)
- `src/context.ts` - Request context creation
- `src/routers/` - Feature routers by domain

**Routers:**
- `attendance/` - Clock, records, work blocks, analytics
- `communication/` - Channels, messages, threads
- `org/` - Members, invitations, dashboard, presence
- `team/` - Team management
- `user/` - Permissions, push subscriptions
- `notification/`, `storage/`, `realtime/`, `electric/`

**Procedure Hierarchy:**
```
publicProcedure → protectedProcedure → orgProcedure → orgMemberProcedure
                                                            │
                                            (adds PermissionContext)
```

---

### @work-holo/db (`packages/db/`)

Database layer with Drizzle ORM and PostgreSQL.

**Key Files:**
- `src/index.ts` - Drizzle client initialization
- `src/schema/` - Table definitions

**Schema Files:**
- `auth.ts` - Users, sessions, accounts, organizations, teams (Better-Auth tables)
- `communication.ts` - Channels, messages, attachments, notifications
- `attendance.ts` - Clock records, work blocks, daily statistics
- `authorization.ts` - Permission nodes, role templates, role assignments
- `casbin.ts` - Casbin rules storage

**Commands:**
```bash
bun db:push      # Push schema changes
bun db:studio    # Open Drizzle Studio
bun db:generate  # Generate migrations
bun db:migrate   # Run migrations
```

---

### @work-holo/auth (`packages/auth/`)

Authentication setup using Better-Auth v1.4.18.

**Key Files:**
- `src/index.ts` - Auth configuration with plugins

**Plugins Enabled:**
- Passkey, 2FA, Username, Phone Number
- Magic Link, Email OTP
- Organization with Teams
- HaveIBeenPwned, MultiSession

**Hooks:**
- `afterCreateOrganization` - Assigns owner role
- `afterAddMember` - Assigns member role
- `afterAcceptInvitation` - Assigns member role

---

### @work-holo/permission (`packages/permission/`)

RBAC engine using Casbin v5 with custom DSL.

**Key Files:**
- `src/services/permission.service.ts` - Main facade
- `src/services/authorization-engine.ts` - Casbin enforcer wrapper
- `src/lib/dsl/` - Type-safe permission expressions

**Role Hierarchy:**
```
owner > admin > team_admin > team_lead > member
```

**Usage:**
```typescript
// In orgMemberProcedure context
permission.check('team', 'create')           // Base check
permission.checkTeamScope(teamId, 'update')  // With ownership scope
permission.getAccessibleTeamIds()            // null=all, array=filtered
```

**DSL Example:**
```typescript
permission.org.canManageMembers()
permission.team(teamId).canDelete()
permission.channel(channelId).canSendMessages()
```

---

### @work-holo/infrastructure (`packages/infrastructure/`)

External service clients with singleton patterns.

**Clients:**
- `redis.ts` - Redis client (caching, sessions)
- `queue.ts` - RabbitMQ client (job queues)
- `pusher.ts` - Pusher client (real-time events)

**Queue Configuration:**
- Queue: `read_receipts`
- Durable: Yes
- TTL: 1 hour
- Max Length: 10,000 messages

---

### @work-holo/env (`packages/env/`)

Centralized environment validation using t3-oss/env-core + Zod.

**Exports:**
- `./server` - Server environment
- `./web` - Client environment (VITE_ prefixed)
- `./native` - React Native environment
- `./realtime` - Real-time worker environment
- `./read-receipt` - Read receipt worker environment

---

### @work-holo/config (`packages/config/`)

Shared configuration files.

**Contains:**
- `tsconfig.base.json` - Base TypeScript config for all packages

## Adding New Packages

1. Create folder: `packages/<name>/`
2. Add `package.json` with `name: "@work-holo/<name>"`
3. Add `tsconfig.json` extending `@work-holo/config`
4. Add `src/index.ts` with exports
5. Register in root `package.json` workspaces (already `packages/*`)
6. Import in consuming packages

## Common Patterns

### Singleton Services
```typescript
// Infrastructure clients use singleton pattern
const redis = await Redis.getClient()
const queue = await Queue.getInstance()
```

### Context Injection
```typescript
// API procedures inject context
const ctx = { session, db, redis, permission }
```

### Environment Validation
```typescript
// All env access is validated at startup
import { env } from '@work-holo/env/server'
```
