import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const casbinRule = pgTable("casbin_rule", {
  id: serial("id").primaryKey(),
  ptype: varchar("ptype", { length: 255 }),
  v0: varchar("v0", { length: 255 }),
  v1: varchar("v1", { length: 255 }),
  v2: varchar("v2", { length: 255 }),
  v3: varchar("v3", { length: 255 }),
  v4: varchar("v4", { length: 255 }),
  v5: varchar("v5", { length: 255 }),
});

// Alias for casbin-drizzle-adapter compatibility
export const casbinTable = casbinRule;
