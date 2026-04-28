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

# @vitejs/plugin-rsc uses fs.renameSync for RSC temp output. Docker overlayfs can
# throw EXDEV for that rename, so add a copy+remove fallback inside the image.
RUN bun -e 'const fs = require("fs"), path = require("path"); const bunDir = path.join(process.cwd(), "node_modules/.bun"); const pluginDir = fs.readdirSync(bunDir).find((name) => name.startsWith("@vitejs+plugin-rsc@")); if (!pluginDir) throw new Error("@vitejs/plugin-rsc not found"); const file = path.join(bunDir, pluginDir, "node_modules/@vitejs/plugin-rsc/dist/plugin-BhzHKRFo.js"); let source = fs.readFileSync(file, "utf8"); const move = (from, to) => `try { fs.renameSync(${from}, ${to}); } catch (error) { if (error && error.code === "EXDEV") { fs.cpSync(${from}, ${to}, { recursive: true }); fs.rmSync(${from}, { recursive: true, force: true }); } else { throw error; } }`; source = source.replace("fs.renameSync(rscOutDir, tempRscOutDir);", move("rscOutDir", "tempRscOutDir")).replace("fs.renameSync(tempRscOutDir, rscOutDir);", move("tempRscOutDir", "rscOutDir")); fs.writeFileSync(file, source);'

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
COPY apps/web/server.ts apps/web/

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
COPY --from=builder /app/apps/web/server.ts /app/apps/web/server.ts

COPY --from=builder /app/apps/www/server.ts ./server.ts

CMD ["bun", "server.ts"]
