import { dashboardRouter } from "./dashboard";
import { invitationRouter } from "./invitation";
import { memberRouter } from "./member";
import { presenceRouter } from "./presence";

export const orgRouter = {
  member: memberRouter,
  invitation: invitationRouter,
  dashboard: dashboardRouter,
  presence: presenceRouter,
};
