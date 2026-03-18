FROM oven/bun:1.3.10-slim AS deps
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
COPY packages/config/package.json packages/config/
COPY packages/db/package.json packages/db/
COPY packages/env/package.json packages/env/
COPY packages/permission/package.json packages/permission/

RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --frozen-lockfile

FROM deps AS runner
WORKDIR /app

COPY packages/config packages/config
COPY packages/db packages/db
COPY packages/env packages/env
COPY packages/permission packages/permission

ENV SKIP_ENV_VALIDATION=true

WORKDIR /app/packages/permission
ENTRYPOINT ["bun", "run", "seed:permissions"]
