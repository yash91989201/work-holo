export type {
  EmailDigestInterval,
  NotificationPreference,
} from "./defaults";
export {
  DEFAULT_EMAIL_DIGEST_INTERVAL,
  DEFAULT_NOTIFICATION_PREFERENCES,
  getDefaultPreference,
  isDeliveryEnabledByDefault,
} from "./defaults";
export { NotificationService } from "./notification.service";
export {
  getEmailDigestInterval,
  isMuted,
  resolveDeliveryChannels,
} from "./preference-resolver";
export type {
  NotificationDeliveryChannel,
  NotificationDomainEvent,
  NotificationEventType,
  NotificationServiceInterface,
} from "./types";
