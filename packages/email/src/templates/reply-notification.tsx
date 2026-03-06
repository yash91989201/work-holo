import { Heading, Link, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

export interface ReplyNotificationEmailProps {
  channelName: string;
  originalMessagePreview: string;
  recipientName: string;
  repliedBy: string;
  replyPreview: string;
  threadUrl: string;
}

export default function ReplyNotificationEmail({
  recipientName,
  repliedBy,
  channelName,
  originalMessagePreview,
  replyPreview,
  threadUrl,
}: ReplyNotificationEmailProps) {
  return (
    <EmailLayout
      preview={`${repliedBy} replied to your message in #${channelName}`}
    >
      <Heading className="font-semibold text-gray-900 text-xl">
        New reply to your message
      </Heading>
      <Text className="text-gray-700 text-sm">Hi {recipientName},</Text>
      <Text className="text-gray-700 text-sm">
        <strong>{repliedBy}</strong> replied to your message in{" "}
        <strong>#{channelName}</strong>.
      </Text>
      <Section className="rounded-md border-gray-300 border-l-4 bg-gray-50 p-4">
        <Text className="font-medium text-muted text-xs">Your message</Text>
        <Text className="text-gray-600 text-sm">
          &ldquo;{originalMessagePreview}&rdquo;
        </Text>
      </Section>
      <Section className="mt-2 rounded-md border-brand border-l-4 bg-gray-50 p-4">
        <Text className="font-medium text-brand text-xs">{repliedBy}</Text>
        <Text className="text-gray-700 text-sm">
          &ldquo;{replyPreview}&rdquo;
        </Text>
      </Section>
      <Section className="mt-4 text-center">
        <Link
          className="inline-block rounded-md bg-brand px-5 py-3 font-medium text-sm text-white no-underline"
          href={threadUrl}
        >
          View Thread
        </Link>
      </Section>
    </EmailLayout>
  );
}

ReplyNotificationEmail.PreviewProps = {
  recipientName: "Jane",
  repliedBy: "Alex",
  channelName: "engineering",
  originalMessagePreview:
    "I pushed the latest changes to the notification branch.",
  replyPreview: "Looks great! I left a few comments on the PR.",
  threadUrl: "https://app.workholo.com/channels/engineering/threads/456",
} satisfies ReplyNotificationEmailProps;
