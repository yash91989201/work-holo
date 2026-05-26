import { drizzle } from "drizzle-orm/bun-sql";
import { env } from "./env";
import * as schema from "./schema";

export function createDb() {
  return drizzle(env.DATABASE_URL, {
    schema,
    casing: "camelCase",
  });
}

export const db = createDb();
