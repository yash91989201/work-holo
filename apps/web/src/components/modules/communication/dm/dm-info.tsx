import {
  IconCalendar,
  IconMessage,
  IconUser,
  IconWifi,
  IconWifiOff,
} from "@tabler/icons-react";

interface DmInfoProps {
  conversation:
    | {
        id: string;
        createdAt: Date | string;
        messageCount?: number;
      }
    | undefined;
  isOnline: boolean;
  otherParticipant:
    | {
        id: string;
        name: string;
        email: string;
        image?: string | null;
      }
    | undefined;
}

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
    {children}
  </div>
);

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2.5">
    <IconBox>{icon}</IconBox>
    <div className="min-w-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="truncate font-medium text-foreground text-sm">{value}</p>
    </div>
  </div>
);

export const DmInfo = ({
  conversation,
  otherParticipant,
  isOnline,
}: DmInfoProps) => {
  const hasParticipant = Boolean(otherParticipant);
  let statusValue = "Unknown";
  if (hasParticipant) {
    statusValue = isOnline ? "Online" : "Offline";
  }

  return (
    <div className="space-y-2.5 p-3">
      <InfoItem
        icon={<IconUser className="h-3.5 w-3.5 text-muted-foreground" />}
        label="Participant"
        value={otherParticipant?.name ?? "-"}
      />
      <InfoItem
        icon={<IconMessage className="h-3.5 w-3.5 text-muted-foreground" />}
        label="Type"
        value="Direct Message"
      />
      <InfoItem
        icon={
          hasParticipant && isOnline ? (
            <IconWifi className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <IconWifiOff className="h-3.5 w-3.5 text-muted-foreground" />
          )
        }
        label="Status"
        value={statusValue}
      />
      <InfoItem
        icon={<IconCalendar className="h-3.5 w-3.5 text-muted-foreground" />}
        label="Started"
        value={
          conversation?.createdAt
            ? new Date(conversation.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "-"
        }
      />
    </div>
  );
};
