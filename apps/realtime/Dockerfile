# syntax=docker/dockerfile:1

FROM oven/bun:1.3.4-slim AS base
WORKDIR /app

FROM base AS deps
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./

COPY apps/realtime/package.json apps/realtime/
COPY packages/config/package.json packages/config/
COPY packages/realtime-api/package.json packages/realtime-api/
COPY packages/realtime-shared/package.json packages/realtime-shared/

RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install

FROM deps AS builder
WORKDIR /app

COPY packages/config packages/config

COPY packages/realtime-shared/tsconfig.json packages/realtime-shared/
COPY packages/realtime-shared/src packages/realtime-shared/src

COPY packages/realtime-api/tsconfig.json packages/realtime-api/
COPY packages/realtime-api/src packages/realtime-api/src

COPY apps/realtime/tsconfig.json apps/realtime/
COPY apps/realtime/src apps/realtime/src

RUN bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --target bun \
  --outfile /app/apps/realtime/server \
  apps/realtime/src/index.ts

FROM gcr.io/distroless/base@sha256:0c70ab46409b94a96f4e98e32e7333050581e75f7038de2877a4bfc146dfc7ce AS runtime
WORKDIR /app

COPY --from=builder /app/apps/realtime/server /app/server

ARG PORT=3002
ENV PORT=$PORT

EXPOSE $PORT

CMD ["/app/server"]
