# Server Application

Hono-based API server with oRPC handlers, Better-Auth authentication, and real-time features.

## Overview

The server is the backend for Work-Holo, handling all API requests, authentication, real-time sync, and external service integrations.

**Tech Stack:**
- Runtime: Bun 1.3.6
- Framework: Hono
- API: oRPC (type-safe RPC)
- Auth: Better-Auth
- Database: PostgreSQL via Drizzle ORM
- Real-time: ElectricSQL, Pusher
- Queue: RabbitMQ

## Entry Point

**File:** `src/index.ts`

**Startup Sequence:**
1. Load environment via `dotenv/config`
2. Initialize Redis connection
3. Initialize Pusher client
4. Initialize RabbitMQ Queue
5. Initialize Permission managers (Casbin + caches)
6. Create Hono app with middleware
7. Mount route handlers
8. Start server on configured port

```typescript
// Simplified startup
await Redis.getClient()
await Pusher.getInstance()
await Queue.getInstance()
await PermissionManagers.initialize({ db, redis, pusher })

const app = new Hono()
app.use(logger())
app.use(cors({ origin: CORS_ORIGIN, credentials: true }))
// ... mount handlers
```

## Route Structure

| Path | Handler | Purpose |
|------|---------|---------|
| `/api/auth/*` | Better-Auth | Authentication endpoints |
| `/rpc/*` | oRPC Handler | Type-safe API (JSON-RPC) |
| `/api-reference/*` | OpenAPI Handler | REST endpoints with docs |
| `/electric/*` | Electric Router | Real-time database sync |

## Request Flow

```
HTTP Request
     │
     ▼
┌─────────────────┐
│ CORS Middleware │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Logger          │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Route Matching                          │
│ ├─ /api/auth/*  → Better-Auth          │
│ ├─ /rpc/*       → oRPC Handler         │
│ ├─ /api-ref/*   → OpenAPI Handler      │
│ └─ /electric/*  → ElectricSQL Proxy    │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Context Creation│
│ (session, db,   │
│  redis, perms)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Procedure Layer │
│ (auth checks)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Router Handler  │
│ (business logic)│
└─────────────────┘
```

## Context Object

Created for each request in `packages/api/src/context.ts`:

```typescript
interface Context {
  headers: Headers           // Raw request headers
  session?: Session          // Auth session (if authenticated)
  db: Database               // Drizzle ORM instance
  redis: RedisClient         // Redis client
  permission?: PermissionContext  // RBAC context (org procedures)
  orgId?: string             // Active organization ID
  orgMembership?: Membership // User's org membership
}
```

## Procedure Hierarchy

Defined in `packages/api/src/index.ts`:

```
publicProcedure
     │
     ▼
protectedProcedure (requires session)
     │
     ▼
orgProcedure (requires activeOrganizationId)
     │
     ▼
orgMemberProcedure (requires membership + creates PermissionContext)
```

## API Routers

Located in `packages/api/src/routers/`:

| Router | Path | Purpose |
|--------|------|---------|
| `attendance/` | `/attendance/*` | Clock in/out, work blocks, analytics |
| `communication/` | `/communication/*` | Channels, messages, threads |
| `org/` | `/org/*` | Members, invitations, dashboard |
| `team/` | `/team/*` | Team CRUD, membership |
| `user/` | `/user/*` | Permissions, push subscriptions |
| `storage/` | `/storage/*` | File upload/download (MinIO) |
| `realtime/` | `/realtime/*` | Pusher auth |
| `notification/` | `/notification/*` | Push notifications |
| `electric/` | `/electric/*` | ElectricSQL shape proxy |

## ElectricSQL Integration

Real-time database sync via shape subscriptions.

**Endpoint:** `/electric/shapes/:table`

**Available Shapes:**
- Messages, channels, channel members
- Teams, team members
- Attendance records, work blocks
- Organizations, members
- Notifications, reactions

**Middleware:**
- `requireAuth` - User must exist
- `requireOrgMember` - User must belong to organization

## Environment Variables

```bash
# Authentication
BETTER_AUTH_SECRET=       # Auth secret key
BETTER_AUTH_URL=          # Auth server URL

# Database
DATABASE_URL=             # PostgreSQL connection

# Cache & Queue
REDIS_URL=                # Redis connection
RABBITMQ_URL=             # RabbitMQ connection

# Storage (MinIO)
S3_ENDPOINT=              # S3-compatible endpoint
S3_ACCESS_KEY=            # Access key
S3_SECRET_KEY=            # Secret key
S3_BUCKET=                # Bucket name

# Real-time
PUSHER_APP_ID=            # Pusher app ID
PUSHER_KEY=               # Pusher key
PUSHER_SECRET=            # Pusher secret
PUSHER_HOST=              # Pusher host
PUSHER_PORT=              # Pusher port

ELECTRIC_URL=             # ElectricSQL server

# Email
RESEND_API_KEY=           # Resend API key

# Frontend
WEB_URL=                  # Web app URL
CORS_ORIGIN=              # Allowed CORS origins

# Permissions
CASBIN_ENFORCE=           # Enable RBAC enforcement

# Server
PORT=3000                 # Server port
```

## Running

### Development
```bash
bun run dev
# or from root
bun dev:server
```

### Production
```bash
bun run start
# or compile to binary
bun run compile && ./server
```

### Docker
```bash
docker build -t work-holo-server .
docker run -p 3000:3000 --env-file .env work-holo-server
```

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Entry point, server setup |
| `Dockerfile` | Multi-stage Docker build |
| `.env.example` | Environment template |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |

## Dependencies

Main dependencies from `@work-holo/*` packages:
- `@work-holo/api` - Business logic routers
- `@work-holo/auth` - Better-Auth setup
- `@work-holo/db` - Database client
- `@work-holo/env` - Environment validation
- `@work-holo/permission` - RBAC engine
- `@work-holo/infrastructure` - Redis, Queue, Pusher

## Error Handling

- oRPC interceptors catch and log errors
- Better-Auth handles auth-specific errors
- Hono middleware propagates errors with proper status codes
- Graceful shutdown on SIGINT/SIGTERM
