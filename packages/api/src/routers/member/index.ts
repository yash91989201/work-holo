import { memberAttendanceRouter } from "./attendance";
import { memberChannelRouter } from "./channel";
import { memberMessageRouter } from "./message";
import { memberNotificationRouter } from "./notification";
import { presenceRouter } from "./presence";
import { memberPushSubscriptionRouter } from "./push-subscription";
import { workBlockRouter } from "./work-block";

export const memberRouter = {
	attendance: memberAttendanceRouter,
	channel: memberChannelRouter,
	notification: memberNotificationRouter,
	pushSubscription: memberPushSubscriptionRouter,
	workBlock: workBlockRouter,
	presence: presenceRouter,
	message: memberMessageRouter,
};
