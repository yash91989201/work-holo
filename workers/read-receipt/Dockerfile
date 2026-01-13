# syntax=docker/dockerfile:1

FROM oven/bun:1.3.4-slim AS base
WORKDIR /app

FROM base AS deps
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
COPY workers/read-receipt/package.json workers/read-receipt/
COPY packages/config/package.json packages/config/
COPY packages/env/package.json packages/env/
COPY packages/db/package.json packages/db/

# Use cache mount for Bun's cache
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install

FROM deps AS runner
WORKDIR /app

COPY packages/config packages/config
COPY packages/db/tsconfig.json packages/db/
COPY packages/db/src packages/db/src
COPY packages/db/drizzle.config.ts packages/db/
COPY packages/env/tsconfig.json packages/env/
COPY packages/env/src/read-receipt.ts packages/env/src/

COPY workers/read-receipt/tsconfig.json workers/read-receipt/
COPY workers/read-receipt/lib workers/read-receipt/lib
COPY workers/read-receipt/index.ts workers/read-receipt/

WORKDIR /app/workers/read-receipt

CMD ["bun", "run", "index.ts"]
