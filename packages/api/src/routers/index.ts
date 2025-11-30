import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "@work-holo/api/index";
import { adminRouter } from "./admin";
import { communicationRouter } from "./communication";
import { memberRouter } from "./member";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  member: memberRouter,
  communication: communicationRouter,
  admin: adminRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
