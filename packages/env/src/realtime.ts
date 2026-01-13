import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_JWKS_URL: z.url(),
    REALTIME_GRANT_SECRET: z.string().min(32),
    REDIS_URL: z.url(),
    PORT: z.coerce.number().default(3002),
  },
  runtimeEnv: process.env,
});
