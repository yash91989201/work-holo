import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import z from "zod";

dotenv.config({
  path: "../../apps/server/.env",
});

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
