# syntax=docker/dockerfile:1.7

# ============================================================
# Base
# ============================================================
FROM oven/bun:1.3.12-slim AS base
WORKDIR /app

# Common runtime env
ENV NODE_ENV=production
ENV BUN_ENV=production

# ============================================================
# Dependencies
# ============================================================
FROM base AS deps

# Copy root manifests first for better cache reuse
COPY package.json bun.lock bunfig.toml ./

# Copy workspace package manifests only
COPY packages/config/package.json packages/config/
COPY packages/env/package.json packages/env/
COPY packages/db/package.json packages/db/
COPY packages/auth/package.json packages/auth/
COPY packages/api/package.json packages/api/
COPY packages/permission/package.json packages/permission/
COPY packages/infrastructure/package.json packages/infrastructure/
COPY apps/web/package.json apps/web/

# Install all deps needed to build
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install 

# ============================================================
# Builder
# ============================================================
FROM base AS builder
WORKDIR /app

# Reuse installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/bun.lock ./bun.lock
COPY --from=deps /app/bunfig.toml ./bunfig.toml

# Copy source
COPY packages/config packages/config
COPY packages/env packages/env
COPY packages/db packages/db
COPY packages/auth packages/auth
COPY packages/api packages/api
COPY packages/permission packages/permission
COPY packages/infrastructure packages/infrastructure
COPY apps/web apps/web

# Build-time public envs only
ARG VITE_ENV
ARG VITE_WEB_URL
ARG VITE_SERVER_URL
ARG VITE_IMAGE_TRANSFORMATION_URL

ENV VITE_ENV=${VITE_ENV}
ENV VITE_WEB_URL=${VITE_WEB_URL}
ENV VITE_SERVER_URL=${VITE_SERVER_URL}
ENV VITE_IMAGE_TRANSFORMATION_URL=${VITE_IMAGE_TRANSFORMATION_URL}

# Tell Nitro to optimize output for Bun
ENV NITRO_PRESET=bun

WORKDIR /app/apps/web
RUN bun run build

# ============================================================
# Runtime
# ============================================================
FROM oven/bun:1.3.12-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV BUN_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Run as the non-root bun user included in the official image
USER bun

# Copy only runtime output
COPY --chown=bun:bun --from=builder /app/apps/web/.output ./.output

EXPOSE 3000

# Healthcheck assumes your app serves "/" with 200.
# If you have a dedicated /health route, switch to that.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bun -e "const r = await fetch('http://127.0.0.1:' + (process.env.PORT || 3000)); if (!r.ok) throw new Error('unhealthy')"

CMD ["bun", "run", ".output/server/index.mjs"]
