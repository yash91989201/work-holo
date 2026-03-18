# syntax=docker/dockerfile:1

FROM oven/bun:1.3.10-slim AS base
WORKDIR /app

FROM base AS deps
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
COPY workers/read-receipt/package.json workers/read-receipt/
COPY packages/config/package.json packages/config/
COPY packages/env/package.json packages/env/
COPY packages/db/package.json packages/db/
COPY packages/infrastructure/package.json packages/infrastructure/

RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install

FROM deps AS builder
WORKDIR /app

COPY packages/config packages/config
COPY packages/db/tsconfig.json packages/db/
COPY packages/db/src packages/db/src
COPY packages/db/drizzle.config.ts packages/db/
COPY packages/env/tsconfig.json packages/env/
COPY packages/env/src/read-receipt.ts packages/env/src/
COPY packages/infrastructure/src packages/infrastructure/src
COPY workers/read-receipt/tsconfig.json workers/read-receipt/
COPY workers/read-receipt/src workers/read-receipt/src

WORKDIR /app/workers/read-receipt
RUN bun build \
  --compile \
  --minify \
  --sourcemap=none \
  --outfile=read-receipt-worker \
  ./src/index.ts

FROM debian:bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/workers/read-receipt/read-receipt-worker ./

CMD ["./read-receipt-worker"]
