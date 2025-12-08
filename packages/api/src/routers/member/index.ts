import { memberAttendanceRouter } from "./attendance";
import { memberChannelRouter } from "./channel";
import { memberNotificationRouter } from "./notification";
import { presenceRouter } from "./presence";
import { workBlockRouter } from "./work-block";

export const memberRouter = {
  attendance: memberAttendanceRouter,
  channel: memberChannelRouter,
  notification: memberNotificationRouter,
  workBlock: workBlockRouter,
  presence: presenceRouter,
};
