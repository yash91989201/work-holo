import { permissionRouter } from "./permission";
import { pushSubscriptionRouter } from "./push-subscription";

export const userRouter = {
  pushSubscription: pushSubscriptionRouter,
  permission: permissionRouter,
};
