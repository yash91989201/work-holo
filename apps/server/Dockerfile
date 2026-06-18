# syntax=docker/dockerfile:1

FROM oven/bun:1.3.10-slim AS base
WORKDIR /app

FROM base AS deps
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
COPY packages/config/package.json packages/config/
COPY packages/env/package.json packages/env/
COPY packages/db/package.json packages/db/
COPY packages/auth/package.json packages/auth/
COPY packages/permission/package.json packages/permission/
COPY packages/api/package.json packages/api/
COPY packages/infrastructure/package.json packages/infrastructure/
COPY apps/server/package.json apps/server/

# Use cache mount for Bun's cache
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install

FROM deps AS builder
WORKDIR /app

COPY packages/config packages/config
COPY packages/env/tsconfig.json packages/env/
COPY packages/db/tsconfig.json packages/db/
COPY packages/api/tsconfig.json packages/api/
COPY packages/auth/tsconfig.json packages/auth/
COPY packages/permission/tsconfig.json packages/permission/
COPY apps/server/tsconfig.json apps/server/

COPY packages/db/drizzle.config.ts packages/db/
COPY apps/server/tsdown.config.ts apps/server/

COPY packages/env/src/server.ts packages/env/src/
COPY packages/db/src packages/db/src
COPY packages/auth/src packages/auth/src
COPY packages/api/src packages/api/src
COPY packages/permission/src packages/permission/src
COPY packages/infrastructure/src packages/infrastructure/src
COPY apps/server/src apps/server/src

RUN bun run --cwd apps/server build

FROM oven/bun:1.3.10-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=deps /app/node_modules/.bun node_modules/.bun
COPY --from=deps /app/apps/server/node_modules apps/server/node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/apps/server/package.json apps/server/
COPY --from=builder /app/apps/server/dist apps/server/dist

ARG PORT
ENV PORT=$PORT

EXPOSE $PORT

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health/live || exit 1

CMD ["bun", "apps/server/dist/index.mjs"]
