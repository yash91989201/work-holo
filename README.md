# work-holo

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Hono, ORPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **React Native** - Build mobile apps using React
- **Expo** - Tools for React Native development
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Husky** - Git hooks for code quality
- **Starlight** - Documentation site with Astro
- **Tauri** - Build native desktop applications
- **Turborepo** - Optimized monorepo build system

## Getting Started

This project includes a `scripts/dev.sh` script to manage the entire local development workflow.
On Windows cmd shell, use `scripts\dev.cmd`.

### Quick Start

```bash
scripts/dev.sh init
```

To skip dependency installation during init:

```bash
scripts/dev.sh init --skip-steps deps-install
```

This will:

1. Check dependencies (bun, docker, openssl)
2. Install npm packages (unless `deps-install` is skipped via `--skip-steps`)
3. Create environment files with auto-generated secrets
4. Start Docker services (PostgreSQL, Redis, RabbitMQ, etc.)
5. Run database migrations
6. Seed baseline data
7. Bootstrap the default dev organization, users, teams, channels, and credentials
8. Prompt to start the development server

### Development Workflow

```bash
# Quick start - full setup (dependencies, env files, docker, migrations, seed, dev workspace bootstrap)
scripts/dev.sh init

# Quick start without dependency installation
scripts/dev.sh init --skip-steps deps-install

# View all init steps and dependencies
scripts/dev.sh init --list-steps

# Start everything (docker services + dev server)
scripts/dev.sh start

# Start only docker services (useful for running dev server separately)
scripts/dev.sh start --docker-only

# Start only dev server (auto-starts services if needed, includes Turbo TUI)
scripts/dev.sh start --dev-only

# Start specific apps/workers only (add studio to include Drizzle Studio)
scripts/dev.sh start --run web,read-receipt,message-indexer

# Start only web + server + Drizzle Studio
scripts/dev.sh start --run web,server,studio

# Start only Drizzle Studio
scripts/dev.sh start --run studio

# Stop all docker services
scripts/dev.sh stop-services

# Reset this project's services and volumes, then re-run init while skipping dependency install
scripts/dev.sh reset-services --skip-init-steps deps-install

# Check what's running
scripts/dev.sh status

# Check environment health
scripts/dev.sh doctor

# View service logs
scripts/dev.sh logs postgres
```

### Available Commands

| Command | Description |
|---------|-------------|
| `init [--skip-steps step1,step2] [--list-steps]` | Full project setup with step controls. `--skip-steps` skips named init steps with dependency validation for the remaining init graph. `deps-install` can be skipped if dependencies were installed manually already. `--list-steps` prints all steps and dependencies. |
| `start` | Start Docker services and dev server (see options below) |
| `start --docker-only` | Start only Docker services |
| `start --dev-only` | Start only dev server (with Turbo TUI), auto-starts services if needed |
| `start --run target1,target2` | Start Docker services and run only selected dev targets (`all`, `web`, `www`, `server`, `studio`, `read-receipt`, `message-search`, `message-indexer` alias, `notification`) |
| `stop-services` | Stop all Docker services without removing the containers |
| `status` | Show status of services, ports, and environment files |
| `reset-services [--skip-init-steps step1,step2]` | **Destructive** - Remove all containers, volumes, and re-run `init`. `--skip-init-steps` forwards the same step names supported by `init --skip-steps`, including dependency validation. |
| `update-packages` | Update all packages, remove node_modules, and fresh install |
| `doctor` | Check dependencies, env files, services, and ports |
| `logs [service]` | View Docker logs for a specific service (or all if no service specified) |
| `seed [--only=X]` | Run database seeds (optionally filter with --only) |

`--run` notes:
- Works with `start` and `start --dev-only`
- Cannot be combined with `start --docker-only`
- Drizzle Studio starts by default with `start` (runs `drizzle-kit studio` directly, not via Turbo); add `studio` to a filtered `--run` list to include it
- Type generators (`web`, `api`, `db`) run automatically in watch mode alongside dev targets

`--run` supported values:
- `all` — run default full dev graph
- `web` — run `apps/web`
- `www` — run `apps/www`
- `server` — run `apps/server`
- `studio` — run Drizzle Studio (`bun db:studio`)
- `read-receipt` — run `workers/read-receipt`
- `message-search` — run `workers/message-search`
- `message-indexer` — alias of `message-search`
- `notification` — run `workers/notification` (`@work-holo/notification-worker`)

After `init`, the workflow bootstraps a ready-to-use local workspace and writes the generated credentials to `apps/server/.env` as `USER1..USER7` entries:

- `owner@gmail.com`
- `admin1@gmail.com`
- `admin2@gmail.com`
- `member1@gmail.com`
- `member2@gmail.com`
- `member3@gmail.com`
- `member4@gmail.com`

The bootstrap step creates the default organization, the `IT`, `Sales`, `HR`, and `Accounts` teams, one team channel for each team, and a shared `general` channel so a clean database is immediately usable for development.

### Manual Setup (Alternative)

If you prefer not to use `scripts/dev.sh`:

1. Install dependencies:

   ```bash
   bun install
   ```

2. Set up environment files in:
   - `apps/server/.env`
   - `apps/web/.env`
   - `apps/www/.env`
   - `workers/notification/.env`
   - `workers/message-search/.env`
   - `workers/read-receipt/.env`

3. Start Docker services:

   ```bash
   docker compose up -d
   ```

4. Run database migrations:

   ```bash
   bun db:migrate
   ```

5. Seed baseline data:

   ```bash
   bun run --cwd apps/seeder src/index.ts
   ```

6. Bootstrap the default dev workspace:

   ```bash
   bun run --cwd apps/seeder seed:dev-bootstrap
   ```

7. Run the development server:

   ```bash
   bun dev
   ```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the main web application.
Open [http://localhost:5100](http://localhost:5100) to view the marketing site.
Use the Expo Go app to run the mobile application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
work-holo/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   ├── www/         # Marketing site (Vite)
│   ├── native/      # Mobile application (React Native, Expo)
│   ├── docs/        # Documentation site (Astro Starlight)
│   └── server/      # Backend API (Hono, ORPC)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun dev:www`: Start only the marketing site
- `bun dev:server`: Start only the server
- `bun check-types`: Check TypeScript types across all apps
- `bun dev:native`: Start the React Native/Expo development server
- `bun db:migrate`: Run committed database migrations
- `bun db:push`: Push schema changes directly to the database schema
- `bun db:studio`: Open database studio UI (also started automatically by `scripts/dev.sh start`)
- `bun generate:types`: Generate TypeScript types from Zod schemas (web, api, db)
- `bun generate:types:watch`: Watch and regenerate types on schema changes
- `cd apps/web && bun desktop:dev`: Start Tauri desktop app in development
- `cd apps/web && bun desktop:build`: Build Tauri desktop app
- `cd apps/docs && bun dev`: Start documentation site
- `cd apps/docs && bun build`: Build documentation site

## Type Generation

This project auto-generates TypeScript types from Zod schemas. The type generators run automatically in watch mode when using `scripts/dev.sh start`.

### Type Generator Locations

| Package | Schema Directory | Output File |
|---------|-----------------|-------------|
| `apps/web` | `src/lib/schemas/` | `src/lib/types.ts` |
| `packages/api` | `src/lib/schemas/` | `src/lib/types.ts` |
| `packages/db` | `src/lib/schemas/` | `src/lib/types.ts` |

### Manual Type Generation

```bash
# Generate types once for a specific package
cd apps/web && bun run generate:types
cd packages/api && bun run generate:types
cd packages/db && bun run generate:types

# Watch mode (regenerates on schema changes)
cd apps/web && bun run generate:types:watch
```

### How It Works

1. Define Zod schemas in `src/lib/schemas/*.ts`
2. Export schemas with names ending in `Schema`, `Input`, or `Output`
3. Run `generate:types` to create corresponding TypeScript types
4. Types are auto-generated as `z.infer<typeof SchemaName>` exports
5. In watch mode, types regenerate automatically when schema files change
