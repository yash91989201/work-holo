import {
  IconCalendar,
  IconFileDescription,
  IconUser,
} from "@tabler/icons-react";
import type React from "react";

interface ChannelInfoProps {
  channelDescription: string | null;
  createdAt: Date;
  createdByName: string;
}

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
    {children}
  </div>
);

export const ChannelInfo = ({
  createdByName,
  createdAt,
  channelDescription,
}: ChannelInfoProps) => (
  <div className="space-y-2.5 p-3">
    {channelDescription && (
      <InfoItem
        icon={
          <IconFileDescription className="h-3.5 w-3.5 text-muted-foreground" />
        }
        label="Description"
        value={channelDescription}
      />
    )}
    <InfoItem
      icon={<IconUser className="h-3.5 w-3.5 text-muted-foreground" />}
      label="Created by"
      value={createdByName}
    />
    <InfoItem
      icon={<IconCalendar className="h-3.5 w-3.5 text-muted-foreground" />}
      label="Created on"
      value={createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    />
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
