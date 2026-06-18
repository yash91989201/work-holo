import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    RABBITMQ_URL: z.string(),
    OPENSEARCH_URL: z.url().default("http://localhost:9200"),
    PREFETCH_COUNT: z.coerce.number().int().positive().default(10),
    MAX_RETRIES: z.coerce.number().int().nonnegative().default(3),
    HEALTH_PORT: z.string().transform((val) => Number.parseInt(val, 10)),
    ENV: z
      .enum(["development", "staging", "testing", "production"])
      .default("development"),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
