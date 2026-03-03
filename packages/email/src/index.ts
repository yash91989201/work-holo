export { type SendEmailOptions, sendEmail } from "./send";
export {
  type DigestItem,
  type DigestNotificationEmailProps,
  default as DigestNotificationEmail,
} from "./templates/digest-notification";
export {
  type DmNotificationEmailProps,
  default as DmNotificationEmail,
} from "./templates/dm-notification";
export { EmailLayout, type EmailLayoutProps } from "./templates/layout";
export {
  default as MentionNotificationEmail,
  type MentionNotificationEmailProps,
} from "./templates/mention-notification";
export {
  default as NotificationEmail,
  type NotificationEmailProps,
} from "./templates/notification";
export {
  default as ReactionNotificationEmail,
  type ReactionNotificationEmailProps,
} from "./templates/reaction-notification";
export {
  default as ReplyNotificationEmail,
  type ReplyNotificationEmailProps,
} from "./templates/reply-notification";
export { createEmailTransport, type SmtpConfig } from "./transport";
