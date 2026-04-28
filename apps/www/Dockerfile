# syntax=docker/dockerfile:1.7

FROM oven/bun:1.3.13-slim AS builder

WORKDIR /app

# Copy root manifests first for better cache reuse.
COPY package.json bun.lock bunfig.toml ./

# Copy workspace package manifests so Bun can validate the monorepo.
COPY packages/config/package.json packages/config/
COPY packages/env/package.json packages/env/
COPY packages/db/package.json packages/db/
COPY packages/auth/package.json packages/auth/
COPY packages/api/package.json packages/api/
COPY packages/permission/package.json packages/permission/
COPY packages/infrastructure/package.json packages/infrastructure/
COPY packages/ui/package.json packages/ui/
COPY apps/www/package.json apps/www/

# Install all deps needed to build.
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install

# Copy source.
COPY packages/config packages/config
COPY packages/env packages/env
COPY packages/db packages/db
COPY packages/auth packages/auth
COPY packages/api packages/api
COPY packages/permission packages/permission
COPY packages/infrastructure packages/infrastructure
COPY packages/ui packages/ui
COPY apps/www apps/www

# Build-time public envs.
ARG VITE_ENV
ARG VITE_WWW_URL
ARG VITE_SERVER_URL
ARG VITE_IMAGE_TRANSFORMATION_URL

ENV VITE_ENV=${VITE_ENV}
ENV VITE_WWW_URL=${VITE_WWW_URL}
ENV VITE_SERVER_URL=${VITE_SERVER_URL}
ENV VITE_IMAGE_TRANSFORMATION_URL=${VITE_IMAGE_TRANSFORMATION_URL}

ENV NODE_ENV=production

WORKDIR /app/apps/www
RUN bun run build

FROM oven/bun:1.3.13-slim AS runtime

WORKDIR /app/apps/www

COPY --from=builder /app/apps/www/dist ./dist

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5100

EXPOSE 5100

CMD ["bun", "-e", "import handler from './dist/server/server.js'; Bun.serve({ hostname: '0.0.0.0', port: Number(process.env.PORT ?? 5100), fetch: (...args) => handler.fetch(...args) });"]
