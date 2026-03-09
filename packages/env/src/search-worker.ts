import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    RABBITMQ_URL: z.string(),
    OPENSEARCH_URL: z.string().default("http://localhost:9200"),
    PREFETCH_COUNT: z.coerce.number().int().positive().default(5),
    ENV: z
      .enum(["development", "staging", "testing", "production"])
      .default("development"),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
