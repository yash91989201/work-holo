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
		RESEND_API_KEY: z.string(),
	},
	runtimeEnv: process.env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
