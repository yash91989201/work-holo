import { orgCallLogsRouter } from "./call-logs";
import { dashboardRouter } from "./dashboard";
import { orgDialerRouter } from "./dialer";
import { invitationRouter } from "./invitation";
import { memberRouter } from "./member";
import { moduleConfigRouter } from "./module-config";
import { presenceRouter } from "./presence";
import { roleRouter } from "./role";

export const orgRouter = {
  member: memberRouter,
  invitation: invitationRouter,
  dashboard: dashboardRouter,
  presence: presenceRouter,
  moduleConfig: moduleConfigRouter,
  role: roleRouter,
  dialer: orgDialerRouter,
  callLogs: orgCallLogsRouter,
};
