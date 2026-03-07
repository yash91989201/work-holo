import { IconCalendar, IconUser } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";

export const ChannelInfo = ({
  createdByName,
  createdAt,
  channelDescription,
}: {
  channelDescription: string;
  createdByName: string;
  createdAt: Date;
}) => (
  <div className="space-y-4">
    {channelDescription && (
      <div className="space-y-1.5">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Description
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          {channelDescription}
        </p>
      </div>
    )}

    {!channelDescription && (
      <p className="text-muted-foreground text-sm italic">
        No description set.
      </p>
    )}

    <Separator />

    <div className="space-y-3">
      <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
        Details
      </p>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
            <IconUser className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">Created by</p>
            <p className="truncate font-medium text-foreground text-sm">
              {createdByName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
            <IconCalendar className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">Created on</p>
            <p className="font-medium text-foreground text-sm">
              {createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
