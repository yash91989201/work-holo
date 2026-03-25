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

This project includes a `dev.sh` script to manage the entire local development workflow.

### Quick Start

```bash
./dev.sh init
```

This will:

1. Check dependencies (bun, docker, openssl)
2. Install npm packages
3. Create environment files with auto-generated secrets
4. Start Docker services (PostgreSQL, Redis, RabbitMQ, etc.)
5. Run database migrations
6. Seed the database
7. Prompt to start the development server

### Development Workflow

```bash
# Quick start - full setup (dependencies, env files, docker, migrations, seed)
./dev.sh init

# Start everything (docker services + dev server)
./dev.sh start

# Start only docker services (useful for running dev server separately)
./dev.sh start --docker-only

# Start only dev server (auto-starts services if needed, includes Turbo TUI)
./dev.sh start --dev-only

# Stop all docker services
./dev.sh stop-services

# Check what's running
./dev.sh status

# Check environment health
./dev.sh doctor

# View service logs
./dev.sh logs postgres
```

### Available Commands

| Command | Description |
|---------|-------------|
| `init` | Full project setup - dependencies, env files, docker, migrations, seed |
| `start` | Start Docker services and dev server (see options below) |
| `start --docker-only` | Start only Docker services |
| `start --dev-only` | Start only dev server (with Turbo TUI), auto-starts services if needed |
| `stop-services` | Stop all Docker services |
| `status` | Show status of services, ports, and environment files |
| `reset-services` | **Destructive** - Remove all containers, volumes, and re-initialize |
| `update-packages` | Update all packages in apps/*, packages/*, workers/* |
| `doctor` | Check dependencies, env files, services, and ports |
| `logs [service]` | View Docker logs for a specific service (or all if no service specified) |
| `seed [--only=X]` | Run database seeds (optionally filter with --only) |

### Manual Setup (Alternative)

If you prefer not to use `dev.sh`:

1. Install dependencies:

   ```bash
   bun install
   ```

2. Set up environment files in:
   - `apps/server/.env`
   - `apps/web/.env`
   - `workers/notification/.env`
   - `workers/message-search/.env`
   - `workers/read-receipt/.env`

3. Start Docker services:

   ```bash
   docker compose up -d
   ```

4. Apply database schema:

   ```bash
   bun db:push
   ```

5. Run the development server:

   ```bash
   bun dev
   ```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
Use the Expo Go app to run the mobile application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
work-holo/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
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
- `bun dev:server`: Start only the server
- `bun check-types`: Check TypeScript types across all apps
- `bun dev:native`: Start the React Native/Expo development server
- `bun db:push`: Push schema changes to database
- `bun db:studio`: Open database studio UI
- `cd apps/web && bun desktop:dev`: Start Tauri desktop app in development
- `cd apps/web && bun desktop:build`: Build Tauri desktop app
- `cd apps/docs && bun dev`: Start documentation site
- `cd apps/docs && bun build`: Build documentation site
