import {
  IconCalendar,
  IconCircleFilled,
  IconCircleLetterXFilled,
  IconCoffee,
  IconMoonFilled,
  IconPhone,
  IconUsers,
  IconWifiOff,
} from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@work-holo/ui/components/select";
import { Separator } from "@work-holo/ui/components/separator";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { useState } from "react";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import type { PresenceStatus } from "@/hooks/use-presence";
import { useOrgPresence } from "@/hooks/use-presence";
import { getInitials } from "@/utils";

const presenceConfig: Record<
  PresenceStatus,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
  }
> = {
  available: {
    label: "Available",
    color: "text-green-600",
    icon: (
      <IconCircleFilled className="h-3 w-3 fill-green-600 text-green-600" />
    ),
  },
  away: {
    label: "Away",
    color: "text-yellow-600",
    icon: <IconMoonFilled className="h-3 w-3 text-yellow-600" />,
  },
  busy: {
    label: "Busy",
    color: "text-red-600",
    icon: <IconCircleLetterXFilled className="h-3 w-3 text-red-600" />,
  },
  offline: {
    label: "Offline",
    color: "text-gray-400",
    icon: <IconWifiOff className="h-3 w-3 text-gray-400" />,
  },
  dnd: {
    label: "Do Not Disturb",
    color: "text-red-700",
    icon: (
      <IconCircleLetterXFilled className="h-3 w-3 fill-red-700 text-red-700" />
    ),
  },
  on_break: {
    label: "On Break",
    color: "text-orange-500",
    icon: <IconCoffee className="h-3 w-3 text-orange-500" />,
  },
  in_call: {
    label: "In a Call",
    color: "text-blue-600",
    icon: <IconPhone className="h-3 w-3 text-blue-600" />,
  },
  in_meeting: {
    label: "In a Meeting",
    color: "text-purple-600",
    icon: <IconCalendar className="h-3 w-3 text-purple-600" />,
  },
};

export function PresenceRoster() {
  const { members } = useListOrgMembers();
  const { data: presenceData } = useOrgPresence();
  const [statusFilter, setStatusFilter] = useState<PresenceStatus | "all">(
    "all"
  );

  const membersWithPresence = members?.map((member) => {
    const presence = presenceData?.presence?.[member.userId];
    const status = (presence?.status as PresenceStatus) ?? "offline";

    return {
      ...member,
      status,
      presence,
    };
  });

  const statusOrder: PresenceStatus[] = [
    "available",
    "in_call",
    "in_meeting",
    "busy",
    "on_break",
    "away",
    "dnd",
    "offline",
  ];

  const filteredAndSortedMembers = membersWithPresence
    ?.filter(
      (member) => statusFilter === "all" || member.status === statusFilter
    )
    ?.sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    );

  const activeCount =
    membersWithPresence?.filter((m) => m.status !== "offline").length ?? 0;
  const totalMembers = membersWithPresence?.length ?? 0;
  const filteredCount = filteredAndSortedMembers?.length ?? 0;

  return (
    <Card
      className="w-full min-w-0 overflow-hidden rounded-2xl ring-1 ring-foreground/5"
      variant="neumorphic"
    >
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <IconUsers className="h-5 w-5 shrink-0" />
          <span className="truncate">Presence Roster</span>
          <Badge className="border-0 bg-emerald-100 font-semibold text-emerald-600 hover:bg-emerald-100">
            {activeCount} Active
          </Badge>
        </CardTitle>
        <CardDescription>
          {statusFilter === "all"
            ? `Showing all ${totalMembers} team members`
            : `Showing ${filteredCount} ${presenceConfig[statusFilter]?.label.toLowerCase()} members`}
        </CardDescription>
        <CardAction>
          <Select
            items={[
              { value: "all", label: "All Status" },
              { value: "available", label: "Available" },
              { value: "busy", label: "Busy" },
              { value: "away", label: "Away" },
              { value: "dnd", label: "Do Not Disturb" },
              { value: "on_break", label: "On Break" },
              { value: "in_call", label: "In a Call" },
              { value: "in_meeting", label: "In a Meeting" },
              { value: "offline", label: "Offline" },
            ]}
            onValueChange={(value) =>
              setStatusFilter(value as PresenceStatus | "all")
            }
            value={statusFilter}
          >
            <SelectTrigger className="w-28 sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">
                <span className="flex items-center gap-2">
                  {presenceConfig.available.icon}
                  Available
                </span>
              </SelectItem>
              <SelectItem value="busy">
                <span className="flex items-center gap-2">
                  {presenceConfig.busy.icon}
                  Busy
                </span>
              </SelectItem>
              <SelectItem value="away">
                <span className="flex items-center gap-2">
                  {presenceConfig.away.icon}
                  Away
                </span>
              </SelectItem>
              <SelectItem value="dnd">
                <span className="flex items-center gap-2">
                  {presenceConfig.dnd.icon}
                  Do Not Disturb
                </span>
              </SelectItem>
              <SelectItem value="on_break">
                <span className="flex items-center gap-2">
                  {presenceConfig.on_break.icon}
                  On Break
                </span>
              </SelectItem>
              <SelectItem value="in_call">
                <span className="flex items-center gap-2">
                  {presenceConfig.in_call.icon}
                  In a Call
                </span>
              </SelectItem>
              <SelectItem value="in_meeting">
                <span className="flex items-center gap-2">
                  {presenceConfig.in_meeting.icon}
                  In a Meeting
                </span>
              </SelectItem>
              <SelectItem value="offline">
                <span className="flex items-center gap-2">
                  {presenceConfig.offline.icon}
                  Offline
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-62">
          <div className="flex flex-col divide-y divide-border/50 px-6">
            {filteredAndSortedMembers && filteredAndSortedMembers.length > 0 ? (
              filteredAndSortedMembers.slice(0, 10).map((member) => {
                const config = presenceConfig[member.status];
                const initials = getInitials(member.user.name);

                return (
                  <div
                    className="flex items-center gap-3 py-3"
                    key={member.userId}
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          alt={member.user.name}
                          src={member.user.image ?? undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -right-0.5 -bottom-0.5 rounded-full border-2 border-card bg-card p-0.5">
                        {config.icon}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">
                        {member.user.name}
                      </p>
                      <p className={`text-xs ${config.color}`}>
                        {config.label}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-32 items-center justify-center text-center text-muted-foreground text-sm">
                No members found.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function PresenceRosterSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-9 w-45" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-150">
          <div className="space-y-1 px-6 pb-6">
            {[...new Array(5)].map((_, i) => (
              <div key={i.toString()}>
                <div className="flex items-start gap-4 rounded-lg p-3">
                  <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                </div>
                {i < 4 && <Separator className="my-1" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

PresenceRoster.Fallback = PresenceRosterSkeleton;
