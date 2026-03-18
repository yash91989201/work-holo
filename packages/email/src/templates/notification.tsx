import { Heading, Link, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

export interface NotificationEmailProps {
  actionLabel: string;
  actionUrl: string;
  body: string;
  recipientName: string;
  title: string;
}

export default function NotificationEmail({
  recipientName,
  title,
  body,
  actionUrl,
  actionLabel,
}: NotificationEmailProps) {
  return (
    <EmailLayout preview={title}>
      <Heading className="font-semibold text-gray-900 text-xl">{title}</Heading>
      <Text className="text-gray-700 text-sm">Hi {recipientName},</Text>
      <Text className="text-gray-700 text-sm">{body}</Text>
      <Section className="mt-4 text-center">
        <Link
          className="inline-block rounded-md bg-brand px-5 py-3 font-medium text-sm text-white no-underline"
          href={actionUrl}
        >
          {actionLabel}
        </Link>
      </Section>
    </EmailLayout>
  );
}

NotificationEmail.PreviewProps = {
  recipientName: "Jane",
  title: "New Notification",
  body: "You have a new notification in your workspace.",
  actionUrl: "https://app.workholo.com/notifications",
  actionLabel: "View Notification",
} satisfies NotificationEmailProps;
