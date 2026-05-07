import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { env } from "./env";
import * as schema from "./schema";

const client = new SQL({
  url: env.DATABASE_URL,
  max: 20,
  idleTimeout: 30,
});

export const db = drizzle(client, {
  schema,
  casing: "camelCase",
});
