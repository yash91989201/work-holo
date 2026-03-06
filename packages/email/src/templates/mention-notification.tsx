import { Heading, Link, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

export interface MentionNotificationEmailProps {
  channelName: string;
  mentionedBy: string;
  messagePreview: string;
  messageUrl: string;
  recipientName: string;
}

export default function MentionNotificationEmail({
  recipientName,
  mentionedBy,
  channelName,
  messagePreview,
  messageUrl,
}: MentionNotificationEmailProps) {
  return (
    <EmailLayout preview={`${mentionedBy} mentioned you in #${channelName}`}>
      <Heading className="font-semibold text-gray-900 text-xl">
        You were mentioned
      </Heading>
      <Text className="text-gray-700 text-sm">Hi {recipientName},</Text>
      <Text className="text-gray-700 text-sm">
        <strong>{mentionedBy}</strong> mentioned you in{" "}
        <strong>#{channelName}</strong>:
      </Text>
      <Section className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <Text className="text-gray-600 text-sm italic">
          &ldquo;{messagePreview}&rdquo;
        </Text>
      </Section>
      <Section className="mt-4 text-center">
        <Link
          className="inline-block rounded-md bg-brand px-5 py-3 font-medium text-sm text-white no-underline"
          href={messageUrl}
        >
          View Message
        </Link>
      </Section>
    </EmailLayout>
  );
}

MentionNotificationEmail.PreviewProps = {
  recipientName: "Jane",
  mentionedBy: "Alex",
  channelName: "engineering",
  messagePreview:
    "Hey @Jane, can you review the latest PR for the notification system?",
  messageUrl: "https://app.workholo.com/channels/engineering/messages/123",
} satisfies MentionNotificationEmailProps;
