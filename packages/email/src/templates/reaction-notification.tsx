import { Heading, Link, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

export interface ReactionNotificationEmailProps {
  channelName: string;
  emoji: string;
  messagePreview: string;
  messageUrl: string;
  reactedBy: string;
  recipientName: string;
}

export default function ReactionNotificationEmail({
  recipientName,
  reactedBy,
  emoji,
  channelName,
  messagePreview,
  messageUrl,
}: ReactionNotificationEmailProps) {
  return (
    <EmailLayout preview={`${reactedBy} reacted ${emoji} to your message`}>
      <Heading className="font-semibold text-gray-900 text-xl">
        Someone reacted to your message
      </Heading>
      <Text className="text-gray-700 text-sm">Hi {recipientName},</Text>
      <Text className="text-gray-700 text-sm">
        <strong>{reactedBy}</strong> reacted with {emoji} to your message in{" "}
        <strong>#{channelName}</strong>.
      </Text>
      <Section className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <Text className="text-gray-600 text-sm">
          &ldquo;{messagePreview}&rdquo;
        </Text>
        <Text className="mt-2 text-2xl">{emoji}</Text>
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

ReactionNotificationEmail.PreviewProps = {
  recipientName: "Jane",
  reactedBy: "Alex",
  emoji: "🎉",
  channelName: "engineering",
  messagePreview: "Deployment completed successfully!",
  messageUrl: "https://app.workholo.com/channels/engineering/messages/789",
} satisfies ReactionNotificationEmailProps;
