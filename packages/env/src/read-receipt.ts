import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    RABBITMQ_URL: z.string(),
    PREFETCH_COUNT: z.coerce.number().int().positive().default(5),
    READ_RECEIPT_BATCH_SIZE: z.coerce.number().int().positive().default(100),
    MAX_MEMBERS_FOR_DETAILED_TRACKING: z.coerce
      .number()
      .int()
      .positive()
      .default(25),
    HEALTH_PORT: z.string().transform((val) => Number.parseInt(val, 10)),
    ENV: z
      .enum(["development", "staging", "testing", "production"])
      .default("development"),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
