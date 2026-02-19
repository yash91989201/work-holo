import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "postgresql",
  casing: "camelCase",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
