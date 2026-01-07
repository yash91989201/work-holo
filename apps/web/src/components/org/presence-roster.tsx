import { Circle, Clock, Moon, Users, WifiOff, XCircle } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import type { PresenceStatus } from "@/hooks/use-presence";
import { useOrgPresence } from "@/hooks/use-presence";
import { Separator } from "../ui/separator";

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
    icon: <Circle className="h-3 w-3 fill-green-600 text-green-600" />,
  },
  away: {
    label: "Away",
    color: "text-yellow-600",
    icon: <Moon className="h-3 w-3 text-yellow-600" />,
  },
  busy: {
    label: "Busy",
    color: "text-red-600",
    icon: <XCircle className="h-3 w-3 text-red-600" />,
  },
  offline: {
    label: "Offline",
    color: "text-gray-400",
    icon: <WifiOff className="h-3 w-3 text-gray-400" />,
  },
  dnd: {
    label: "Do Not Disturb",
    color: "text-red-700",
    icon: <XCircle className="h-3 w-3 fill-red-700 text-red-700" />,
  },
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const formatTimeAgo = (dateString: string | undefined) => {
  if (!dateString) return null;

  const date = new Date(Number(dateString));
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60_000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
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
    "busy",
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

  const totalMembers = membersWithPresence?.length ?? 0;
  const filteredCount = filteredAndSortedMembers?.length ?? 0;

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Presence Roster
        </CardTitle>
        <CardDescription>
          {statusFilter === "all"
            ? `Showing all ${totalMembers} team members`
            : `Showing ${filteredCount} ${presenceConfig[statusFilter]?.label.toLowerCase()} members`}
        </CardDescription>
        <CardAction>
          <Select
            onValueChange={(value) =>
              setStatusFilter(value as PresenceStatus | "all")
            }
            value={statusFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue>
                {statusFilter === "all"
                  ? "All Status"
                  : (presenceConfig[statusFilter]?.label ?? "Filter by status")}
              </SelectValue>
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
        <ScrollArea className="h-[300px]">
          <div>
            {filteredAndSortedMembers && filteredAndSortedMembers.length > 0 ? (
              <ItemGroup>
                {filteredAndSortedMembers.map((member, index) => {
                  const config = presenceConfig[member.status];
                  const initials = getInitials(member.user.name);
                  const lastSeen = formatTimeAgo(member.presence?.lastSeenAt);

                  return (
                    <div key={member.userId}>
                      <Item>
                        <ItemMedia>
                          <div className="relative">
                            <Avatar>
                              <AvatarImage
                                alt={member.user.name}
                                src={member.user.image ?? undefined}
                              />
                              <AvatarFallback className="text-sm">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="-bottom-1.5 -right-1.5 absolute rounded-full border-2 border-background bg-background p-0.5">
                              {config.icon}
                            </div>
                          </div>
                        </ItemMedia>

                        <ItemContent>
                          <ItemTitle>
                            {member.user.name}
                            <Badge
                              className={`shrink-0 ${config.color}`}
                              variant="outline"
                            >
                              {config.label}
                            </Badge>
                          </ItemTitle>

                          <ItemDescription>
                            {member.status !== "offline" && lastSeen && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Active {lastSeen}
                              </span>
                            )}
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                      {index < filteredAndSortedMembers.length - 1 && (
                        <ItemSeparator />
                      )}
                    </div>
                  );
                })}
              </ItemGroup>
            ) : (
              <div className="flex h-32 items-center justify-center text-center text-muted-foreground text-sm">
                No members found with the selected status.
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
          <Skeleton className="h-9 w-[180px]" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
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
