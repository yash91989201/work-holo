import { Heading, Link, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

export interface DmNotificationEmailProps {
  conversationUrl: string;
  messagePreview: string;
  recipientName: string;
  senderName: string;
}

export default function DmNotificationEmail({
  recipientName,
  senderName,
  messagePreview,
  conversationUrl,
}: DmNotificationEmailProps) {
  return (
    <EmailLayout preview={`New message from ${senderName}`}>
      <Heading className="font-semibold text-gray-900 text-xl">
        New direct message
      </Heading>
      <Text className="text-gray-700 text-sm">Hi {recipientName},</Text>
      <Text className="text-gray-700 text-sm">
        <strong>{senderName}</strong> sent you a direct message:
      </Text>
      <Section className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <Text className="font-medium text-gray-800 text-sm">{senderName}</Text>
        <Text className="text-gray-600 text-sm">
          &ldquo;{messagePreview}&rdquo;
        </Text>
      </Section>
      <Section className="mt-4 text-center">
        <Link
          className="inline-block rounded-md bg-brand px-5 py-3 font-medium text-sm text-white no-underline"
          href={conversationUrl}
        >
          Reply
        </Link>
      </Section>
    </EmailLayout>
  );
}

DmNotificationEmail.PreviewProps = {
  recipientName: "Jane",
  senderName: "Alex",
  messagePreview:
    "Hey! Are you free for a quick sync about the notification feature?",
  conversationUrl: "https://app.workholo.com/dm/alex",
} satisfies DmNotificationEmailProps;
