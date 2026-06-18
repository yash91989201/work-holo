# syntax=docker/dockerfile:1

FROM oven/bun:1.3.10-slim AS base
WORKDIR /app

FROM base AS deps
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
COPY workers/message-search/package.json workers/message-search/
COPY packages/config/package.json packages/config/
COPY packages/env/package.json packages/env/
COPY packages/infrastructure/package.json packages/infrastructure/

RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install

FROM deps AS builder
WORKDIR /app

COPY packages/config packages/config
COPY packages/env/tsconfig.json packages/env/
COPY packages/env/src/search-worker.ts packages/env/src/
COPY packages/infrastructure/src packages/infrastructure/src
COPY workers/message-search/tsconfig.json workers/message-search/
COPY workers/message-search/src workers/message-search/src

WORKDIR /app/workers/message-search
RUN bun build \
  --compile \
  --minify \
  --sourcemap=none \
  --outfile=message-search-worker \
  ./src/index.ts

FROM debian:bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/workers/message-search/message-search-worker ./

ARG HEALTH_PORT=3001
ENV HEALTH_PORT=$HEALTH_PORT

EXPOSE $HEALTH_PORT

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${HEALTH_PORT}/health/live || exit 1

CMD ["./message-search-worker"]
