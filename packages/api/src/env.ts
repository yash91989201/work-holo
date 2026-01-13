import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    ENV: z.enum(["development", "staging", "production"]),
    REDIS_URL: z.url(),
    PUSHER_APP_ID: z.string().min(1),
    PUSHER_APP_KEY: z.string().min(1),
    PUSHER_APP_SECRET: z.string().min(1),
    PUSHER_HOST: z.string(),
    PUSHER_PORT: z.coerce.number().default(6001),
    S3_ENDPOINT: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    ELECTRIC_URL: z.url(),
    ELECTRIC_SECRET: z.string(),
    CORS_ORIGIN: z.string().transform((val) =>
      val.split(",").map((url) => {
        const trimmed = url.trim();
        z.url().parse(trimmed);
        return trimmed;
      })
    ),
    VAPID_PUBLIC_KEY: z.string(),
    VAPID_PRIVATE_KEY: z.string(),
    VAPID_SUBJECT: z.url().or(z.email()),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
