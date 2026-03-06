import { Heading, Hr, Link, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

export interface DigestItem {
  preview: string;
  timestamp: string;
  title: string;
  type: "mention" | "reply" | "reaction" | "dm";
  url: string;
}

export interface DigestNotificationEmailProps {
  dashboardUrl: string;
  items: DigestItem[];
  period: string;
  recipientName: string;
}

const typeLabels: Record<DigestItem["type"], string> = {
  mention: "Mention",
  reply: "Reply",
  reaction: "Reaction",
  dm: "Direct Message",
};

const typeBadgeColors: Record<DigestItem["type"], string> = {
  mention: "bg-blue-100 text-blue-800",
  reply: "bg-green-100 text-green-800",
  reaction: "bg-yellow-100 text-yellow-800",
  dm: "bg-purple-100 text-purple-800",
};

export default function DigestNotificationEmail({
  recipientName,
  items,
  period,
  dashboardUrl,
}: DigestNotificationEmailProps) {
  return (
    <EmailLayout
      preview={`Your ${period} digest — ${items.length} notifications`}
    >
      <Heading className="font-semibold text-gray-900 text-xl">
        Your {period} digest
      </Heading>
      <Text className="text-gray-700 text-sm">Hi {recipientName},</Text>
      <Text className="text-gray-700 text-sm">
        Here&apos;s a summary of your {items.length} unread{" "}
        {items.length === 1 ? "notification" : "notifications"} from the past{" "}
        {period}.
      </Text>

      {items.map((item, index) => (
        <Section key={`${item.url}-${item.timestamp}`}>
          {index > 0 && <Hr className="border-gray-200" />}
          <Section className="py-3">
            <Text className="mb-1 text-xs">
              <span
                className={`rounded-full px-2 py-1 font-medium ${typeBadgeColors[item.type]}`}
              >
                {typeLabels[item.type]}
              </span>
              <span className="ml-2 text-muted">{item.timestamp}</span>
            </Text>
            <Text className="font-medium text-gray-900 text-sm">
              {item.title}
            </Text>
            <Text className="text-gray-600 text-sm">{item.preview}</Text>
            <Link className="text-brand text-sm underline" href={item.url}>
              View &rarr;
            </Link>
          </Section>
        </Section>
      ))}

      <Hr className="border-gray-200" />
      <Section className="mt-4 text-center">
        <Link
          className="inline-block rounded-md bg-brand px-5 py-3 font-medium text-sm text-white no-underline"
          href={dashboardUrl}
        >
          View All Notifications
        </Link>
      </Section>
    </EmailLayout>
  );
}

DigestNotificationEmail.PreviewProps = {
  recipientName: "Jane",
  period: "daily",
  dashboardUrl: "https://app.workholo.com/notifications",
  items: [
    {
      type: "mention",
      title: "Alex mentioned you in #engineering",
      preview: "Hey @Jane, can you take a look at the PR?",
      url: "https://app.workholo.com/channels/engineering/messages/123",
      timestamp: "2 hours ago",
    },
    {
      type: "reply",
      title: "Sam replied to your message",
      preview: "That makes sense, let me update the docs.",
      url: "https://app.workholo.com/channels/general/threads/456",
      timestamp: "4 hours ago",
    },
    {
      type: "reaction",
      title: "Taylor reacted 🎉 to your message",
      preview: "Sprint goals achieved!",
      url: "https://app.workholo.com/channels/general/messages/789",
      timestamp: "5 hours ago",
    },
    {
      type: "dm",
      title: "New message from Jordan",
      preview: "Are you available for a quick call?",
      url: "https://app.workholo.com/dm/jordan",
      timestamp: "6 hours ago",
    },
  ],
} satisfies DigestNotificationEmailProps;
