# syntax=docker/dockerfile:1

# ============================================
# Dependencies stage
# ============================================
FROM oven/bun:1.3.6-slim AS deps
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
COPY packages/config/package.json packages/config/
COPY packages/env/package.json packages/env/
COPY packages/db/package.json packages/db/
COPY packages/auth/package.json packages/auth/
COPY packages/api/package.json packages/api/
COPY apps/web/package.json apps/web/

RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install

# ============================================
# Builder stage
# ============================================
FROM deps AS builder
WORKDIR /app

COPY packages/config packages/config
COPY packages/env/tsconfig.json packages/env/
COPY packages/env/src/web.ts packages/env/src/
COPY packages/db/tsconfig.json packages/db/
COPY packages/auth/tsconfig.json packages/auth/
COPY packages/api/tsconfig.json packages/api/

COPY packages/db/drizzle.config.ts packages/db/

COPY packages/env/src/server.ts packages/env/src/
COPY packages/db/src packages/db/src
COPY packages/auth/src packages/auth/src
COPY packages/api/src packages/api/src

COPY apps/web apps/web

ARG VITE_ENV
ENV VITE_ENV=$VITE_ENV

ARG VITE_WEB_URL
ENV VITE_WEB_URL=$VITE_WEB_URL

ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

ARG VITE_IMAGE_TRANSFORMATION_URL
ENV VITE_IMAGE_TRANSFORMATION_URL=$VITE_IMAGE_TRANSFORMATION_URL

WORKDIR /app/apps/web
RUN bun run build

# ============================================
# Runtime stage (Nginx server)
# ============================================
FROM nginx:1.27-alpine AS production
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/apps/web/dist ./

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
