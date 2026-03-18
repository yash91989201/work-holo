import { analyticsRouter } from "./analytics";
import { clockRouter } from "./clock";
import { recordsRouter } from "./records";
import { workBlockRouter } from "./work-block";

export const attendanceRouter = {
  clock: clockRouter,
  records: recordsRouter,
  analytics: analyticsRouter,
  workBlock: workBlockRouter,
};
