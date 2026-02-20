# Workers Directory

Background workers for asynchronous job processing in the Work-Holo platform.

## Overview

Workers are standalone Bun processes that consume messages from RabbitMQ queues to handle tasks that shouldn't block the main API server. Each worker is independently deployable via Docker.

## Available Workers

| Worker | Queue | Purpose |
|--------|-------|---------|
| `read-receipt` | `read_receipts` | Aggregates message read data into summary tables |

## Architecture Pattern

```
API Server                    RabbitMQ                   Worker
    │                            │                          │
    │ publish message ──────────►│                          │
    │                            │◄──────── consume ────────│
    │                            │                          │
    │                            │         process          │
    │                            │            │             │
    │                            │            ▼             │
    │                            │       PostgreSQL         │
```

## Shared Infrastructure

Workers use these shared packages:
- `@work-holo/db` - Database client and schema
- `@work-holo/env` - Environment validation
- `@work-holo/infrastructure` - Queue client (RabbitMQ)
- `@work-holo/config` - TypeScript configuration

## Queue Configuration

All queues are configured in `packages/infrastructure/src/queue.ts`:
- **Durable**: Messages persist across restarts
- **Message TTL**: 1 hour (3,600,000 ms)
- **Max Length**: 10,000 messages

## Running Workers

### Development
```bash
cd workers/<worker-name>
bun run dev
```

### Production (Docker)
```bash
docker build -t <worker-name> ./workers/<worker-name>
docker run -e DATABASE_URL=... -e RABBITMQ_URL=... <worker-name>
```

## Adding New Workers

1. Create folder: `workers/<name>/`
2. Add `package.json` with workspace dependencies
3. Add `tsconfig.json` extending `@work-holo/config`
4. Create `index.ts` entry point with queue consumer
5. Add `.env.example` with required variables
6. Add `Dockerfile` for deployment
7. Create `CLAUDE.md` documenting the worker
8. Add environment schema to `packages/env/src/<name>.ts`

## Environment Variables

Each worker has its own env schema in `packages/env/src/`. Common variables:
- `DATABASE_URL` - PostgreSQL connection (required)
- `RABBITMQ_URL` - RabbitMQ connection (default: `amqp://admin:admin@localhost:5672`)
