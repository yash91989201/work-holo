import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    RABBITMQ_URL: z.string(),
    ENV: z
      .enum(["development", "staging", "testing", "production"])
      .default("development"),
    PORT: z.string().transform((val) => Number.parseInt(val, 10)),
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    WEB_URL: z.url(),
    CORS_ORIGIN: z.string().transform((val) =>
      val.split(",").map((url) => {
        const trimmed = url.trim();
        z.url().parse(trimmed);
        return trimmed;
      })
    ),
    S3_ENDPOINT: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    REDIS_URL: z.url(),
    PUSHER_APP_ID: z.string().min(1),
    PUSHER_APP_KEY: z.string().min(1),
    PUSHER_APP_SECRET: z.string().min(1),
    PUSHER_HOST: z.string(),
    PUSHER_PORT: z.coerce.number().default(6001),
    CASBIN_ENFORCE: z
      .enum(["true", "false"])
      .default("true")
      .transform((val) => val === "true"),
    OPENSEARCH_URL: z.url().default("http://localhost:9200"),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
