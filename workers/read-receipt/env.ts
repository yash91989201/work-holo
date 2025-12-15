import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    RABBITMQ_URL: z.url(),
    PREFETCH_COUNT: z.coerce.number().int().positive().default(5),
    READ_RECEIPT_BATCH_SIZE: z.coerce.number().int().positive().default(100),
    MAX_MEMBERS_FOR_DETAILED_TRACKING: z.coerce
      .number()
      .int()
      .positive()
      .default(25),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("production"),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
