import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "@work-holo/api/index";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";
import { communicationRouter } from "./communication";
import { memberRouter } from "./member";
import { realtimeRouter } from "./realtime";
import { storageRouter } from "./storage";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  auth: authRouter,
  member: memberRouter,
  communication: communicationRouter,
  admin: adminRouter,
  storage: storageRouter,
  realtime: realtimeRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
