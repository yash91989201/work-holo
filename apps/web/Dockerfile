# syntax=docker/dockerfile:1.7

FROM oven/bun:1.3.13-slim AS builder

WORKDIR /app

# Copy root manifests first for better cache reuse
COPY package.json bun.lock bunfig.toml ./

# Copy ALL workspace package manifests (bun --frozen-lockfile validates all workspaces exist)
COPY packages/config/package.json packages/config/
COPY packages/env/package.json packages/env/
COPY packages/db/package.json packages/db/
COPY packages/auth/package.json packages/auth/
COPY packages/api/package.json packages/api/
COPY packages/permission/package.json packages/permission/
COPY packages/infrastructure/package.json packages/infrastructure/
COPY packages/ui/package.json packages/ui/
COPY apps/web/package.json apps/web/

# Install all deps needed to build (including dev deps)
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install

# @vitejs/plugin-rsc uses fs.renameSync for RSC temp output. Docker overlayfs can
# throw EXDEV for that rename, so add a copy+remove fallback inside the image.
RUN bun -e 'const fs = require("fs"), path = require("path"); const bunDir = path.join(process.cwd(), "node_modules/.bun"); const pluginDir = fs.readdirSync(bunDir).find((name) => name.startsWith("@vitejs+plugin-rsc@")); if (!pluginDir) throw new Error("@vitejs/plugin-rsc not found"); const file = path.join(bunDir, pluginDir, "node_modules/@vitejs/plugin-rsc/dist/plugin-BhzHKRFo.js"); let source = fs.readFileSync(file, "utf8"); const move = (from, to) => `try { fs.renameSync(${from}, ${to}); } catch (error) { if (error && error.code === "EXDEV") { fs.cpSync(${from}, ${to}, { recursive: true }); fs.rmSync(${from}, { recursive: true, force: true }); } else { throw error; } }`; source = source.replace("fs.renameSync(rscOutDir, tempRscOutDir);", move("rscOutDir", "tempRscOutDir")).replace("fs.renameSync(tempRscOutDir, rscOutDir);", move("tempRscOutDir", "rscOutDir")); fs.writeFileSync(file, source);'

# Copy source
COPY packages/config packages/config
COPY packages/env packages/env
COPY packages/db packages/db
COPY packages/auth packages/auth
COPY packages/api packages/api
COPY packages/permission packages/permission
COPY packages/infrastructure packages/infrastructure
COPY packages/ui packages/ui
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

ENV NODE_ENV=production

# Build the application
WORKDIR /app/apps/web
RUN bun run build

FROM oven/bun:1.3.13-slim AS runtime

WORKDIR /app/apps/web

# Runtime only needs built output and the Bun server entrypoint.
COPY --from=builder /app/apps/web/dist ./dist
COPY --from=builder /app/apps/web/server.ts ./server.ts

CMD ["bun", "server.ts"]
