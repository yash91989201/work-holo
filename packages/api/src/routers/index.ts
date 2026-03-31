import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../index";
import { adminRouter } from "./admin";
import { attendanceRouter } from "./attendance";
import { communicationRouter } from "./communication";
import { notificationRouter } from "./notification";
import { orgRouter } from "./org";
import { realtimeRouter } from "./realtime";
import { storageRouter } from "./storage";
import { teamRouter } from "./team";
import { userRouter } from "./user";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  admin: adminRouter,
  attendance: attendanceRouter,
  communication: communicationRouter,
  notification: notificationRouter,
  org: orgRouter,
  user: userRouter,
  team: teamRouter,
  storage: storageRouter,
  realtime: realtimeRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
