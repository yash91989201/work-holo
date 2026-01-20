# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Work-holo is a Turborepo monorepo built with Bun, featuring a full-stack TypeScript application with web (React + Vite), native (React Native + Expo), desktop (Tauri), and server components. The project uses oRPC for end-to-end type-safe APIs, Better-Auth for authentication, Drizzle ORM with PostgreSQL, and ElectricSQL for real-time data sync.

## Common Commands

### Development
```bash
bun dev                 # Start all apps in development mode
bun dev:web            # Start web app only (port 3001)
bun dev:server         # Start server only (port 3000)
bun dev:native         # Start React Native/Expo dev server
```

### Web-specific
```bash
cd apps/web && bun desktop:dev    # Start Tauri desktop app in dev
cd apps/web && bun desktop:build  # Build Tauri desktop app
```

### Database
```bash
bun db:push      # Push schema changes to database (Drizzle)
bun db:studio    # Open Drizzle Studio UI
bun db:generate  # Generate migrations
bun db:migrate   # Run migrations
```

### Code Quality
```bash
bun check            # Run oxlint
bun check-types      # Type-check all packages
npx ultracite fix    # Format and fix linting issues (Biome)
npx ultracite check  # Check for linting issues without fixing
```

### Authentication
```bash
bun auth:generate    # Generate Better-Auth schema
```

### Build
```bash
bun build            # Build all apps
```

## Monorepo Structure

```
work-holo/
├── apps/
│   ├── web/         # Vite + React + TanStack Router (port 3001)
│   ├── server/      # Hono API server with oRPC (port 3000)
│   ├── native/      # React Native + Expo mobile app
│   └── docs/        # Astro Starlight documentation
├── packages/
│   ├── api/         # oRPC routers and business logic
│   ├── auth/        # Better-Auth configuration
│   ├── db/          # Drizzle schema and database client
│   ├── env/         # Environment variable validation
│   └── config/      # Shared TypeScript configs
└── workers/
    └── read-receipt/ # Background worker for read receipts
```

## Architecture

### API Layer (oRPC)

The API is built using oRPC for full type-safety between client and server:

- **Server**: `apps/server/src/index.ts` - Hono app with oRPC handlers
- **API Router**: `packages/api/src/routers/index.ts` - Main router composition
- **Context**: `packages/api/src/context.ts` - Request context with session, db, redis
- **Procedures**: `packages/api/src/index.ts` - Base procedures (public, protected, admin)

Key routers in `packages/api/src/routers/`:
- `member` - Member management
- `communication` - Channels and messaging
- `admin` - Admin operations
- `storage` - File storage (MinIO)
- `realtime` - Pusher integration
- `electric` - ElectricSQL sync endpoint

### Authentication

Uses Better-Auth with passkey support:
- Config: `packages/auth/src/index.ts`
- Schema: Generated at `packages/db/src/schema/auth.ts` via `bun auth:generate`
- Auth endpoints: `/api/auth/*` handled by Better-Auth

### Database

Drizzle ORM with PostgreSQL:
- Schema location: `packages/db/src/schema/`
- Main schemas: `auth.ts`, `communication.ts`, `attendance.ts`
- Config: `packages/db/drizzle.config.ts`
- Client: `packages/db/src/index.ts`

### Frontend Routing

TanStack Router with file-based routing in `apps/web/src/routes/`:
- `(auth)/` - Login, signup, invitation acceptance
- `(authenticated)/` - Protected routes
  - `org/$slug/` - Organization-specific pages
    - `dashboard/` - Admin dashboard
    - `(modules)/` - User-facing modules (attendance, communication)
  - `settings/` - User settings
- `(public)/` - Landing page

### Real-time Features

Multiple real-time systems:
1. **ElectricSQL**: Real-time database sync (`ELECTRIC_URL` in env)
   - Router: `packages/api/src/routers/electric/`
2. **Pusher**: Real-time events (channels, presence)
   - Configuration in server `.env`
3. **RabbitMQ**: Message queue for background jobs
   - Used by workers like `read-receipt`

### Environment Variables

Environment configs are in `packages/env/src/`:
- `server.ts` - Server environment
- `web.ts` - Web client environment
- `native.ts` - Native app environment
- `realtime.ts` - Real-time worker environment
- `read-receipt.ts` - Read receipt worker environment

Example `.env` files in:
- `apps/server/.env.example`
- `apps/web/.env.example`
- `apps/native/.env.example`
- `workers/read-receipt/.env.example`

### Background Workers

Workers are separate processes in `workers/`:
- `read-receipt` - Processes read receipt events via RabbitMQ

### Storage

MinIO (S3-compatible) for file storage:
- Router: `packages/api/src/routers/storage`
- Configuration via `S3_*` env variables

## Key Technologies

- **Runtime**: Bun 1.3.6
- **Monorepo**: Turborepo
- **Language**: TypeScript
- **Web Framework**: Vite + React 19
- **Routing**: TanStack Router (web), Expo Router (native)
- **Server**: Hono
- **API**: oRPC (type-safe RPC)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better-Auth with passkey support
- **Real-time**: ElectricSQL, Pusher, RabbitMQ
- **Storage**: MinIO (S3-compatible)
- **Caching**: Redis
- **UI**: Radix UI, TailwindCSS 4, shadcn/ui patterns
- **Desktop**: Tauri 2
- **Mobile**: React Native, Expo
- **Linting**: Ultracite (Biome preset) + oxlint
- **Git Hooks**: Husky + lint-staged

## Development Workflow

1. Install dependencies: `bun install`
2. Set up environment variables (copy `.env.example` files)
3. Ensure services are running:
   - PostgreSQL (port 5432)
   - Redis (port 6379)
   - RabbitMQ (port 5672)
   - MinIO (port 9000)
   - ElectricSQL (port 5003)
   - Pusher (port 6001)
4. Push database schema: `bun db:push`
5. Start development: `bun dev` or specific app with `bun dev:web`/`bun dev:server`

## Testing

No test framework is currently configured in the project. Tests would need to be added.

## Code Standards

This project uses Ultracite (Biome preset) for formatting and linting. All code standards are documented in the existing `.claude/CLAUDE.md` file. Key points:

- Run `npx ultracite fix` before committing
- Husky pre-commit hook runs linting automatically
- TypeScript strict mode enabled
- Prefer explicit types for clarity
- Use React 19 features (ref as prop instead of forwardRef)
