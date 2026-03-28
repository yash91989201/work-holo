FROM oven/bun:1.3.10-alpine

WORKDIR /app

# Install all external dependencies required by the seeder and its workspace packages
RUN bun install \
  drizzle-orm@latest \
  postgres@latest \
  dotenv@latest \
  better-auth@latest \
  @t3-oss/env-core@latest \
  zod@latest \
  drizzle-cuid2@latest \
  casbin@latest \
  casbin-drizzle-adapter@latest

# Copy workspace package sources (only seed-relevant files)

# @work-holo/db
COPY ./packages/db/src ./packages/db/src
COPY ./packages/db/package.json ./packages/db/package.json

# @work-holo/env
COPY ./packages/env/src ./packages/env/src
COPY ./packages/env/package.json ./packages/env/package.json

# @work-holo/permission (seed entrypoint + its lib dependencies)
COPY ./packages/permission/src/seed.ts ./packages/permission/src/seed.ts
COPY ./packages/permission/src/lib ./packages/permission/src/lib
COPY ./packages/permission/package.json ./packages/permission/package.json

# @work-holo/api (seed entrypoint)
COPY ./packages/api/src/seed.ts ./packages/api/src/seed.ts
COPY ./packages/api/package.json ./packages/api/package.json

COPY ./apps/server/src/db/seed.ts ./apps/server/src/db/seed.ts

# seeder app
COPY ./apps/seeder/src ./apps/seeder/src
COPY ./apps/seeder/package.json ./apps/seeder/package.json

# Root workspace manifest (required for bun workspace resolution)
COPY ./package.json ./package.json

WORKDIR /app/apps/seeder

ENTRYPOINT ["bun", "run", "src/index.ts"]
