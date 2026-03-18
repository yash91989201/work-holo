import { dashboardRouter } from "./dashboard";
import { invitationRouter } from "./invitation";
import { memberRouter } from "./member";
import { moduleConfigRouter } from "./module-config";
import { presenceRouter } from "./presence";

export const orgRouter = {
  member: memberRouter,
  invitation: invitationRouter,
  dashboard: dashboardRouter,
  presence: presenceRouter,
  moduleConfig: moduleConfigRouter,
};
