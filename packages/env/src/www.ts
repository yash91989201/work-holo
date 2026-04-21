import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_WWW_URL: z.url(),
    VITE_SERVER_URL: z.url(),
    VITE_IMAGE_TRANSFORMATION_URL: z.url(),
    VITE_ENV: z
      .enum(["development", "staging", "testing", "production"])
      .default("development"),
  },
  runtimeEnv: import.meta.env,
  skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
