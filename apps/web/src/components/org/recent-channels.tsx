import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ChannelMemberType } from "@work-holo/db/lib/types";
import { ChevronRight, Hash, Lock, MessageSquare, Users } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActiveOrgSlug } from "@/hooks/use-active-org-slug";
import { getNameInitials } from "@/utils";
import { queryUtils } from "@/utils/orpc";

function getBadgeVariant(
  type: "team" | "group" | "direct"
): "default" | "secondary" | "outline" {
  switch (type) {
    case "team":
      return "default";
    case "group":
      return "secondary";
    case "direct":
      return "outline";
    default:
      return "default";
  }
}

function NoRecentChannels() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <MessageSquare />
          Your recent channels
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          No recent channels. Join a channel to get started!
        </p>
      </CardContent>
    </Card>
  );
}

export function RecentChannels() {
  const { data: recentChannels } = useSuspenseQuery(
    queryUtils.member.channel.recentChannels.queryOptions({})
  );

  if (recentChannels.length === 0) {
    return <NoRecentChannels />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <MessageSquare />
          Your recent channels
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60">
          <ItemGroup className="">
            {recentChannels.map((channel, index) => (
              <React.Fragment key={channel.id}>
                <ChannelItem channel={channel} />
                {index < recentChannels.length - 1 ? <ItemSeparator /> : null}
              </React.Fragment>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

type ChannelItemProps = {
  channel: {
    id: string;
    name: string;
    description: string | null;
    type: "team" | "group" | "direct";
    isPrivate: boolean;
    lastMessageAt: Date | null;
    creator: {
      name: string;
      image: string | null;
    };
    members: ChannelMemberType[];
  };
};

function ChannelItem({ channel }: ChannelItemProps) {
  const badgeVariant = getBadgeVariant(channel.type);
  const ChannelIcon = channel.isPrivate ? Lock : Hash;
  const slug = useActiveOrgSlug() ?? "";

  return (
    <Item
      render={
        <Link
          params={{ slug, id: channel.id }}
          to="/org/$slug/communication/channels/$id"
        />
      }
    >
      <ItemMedia>
        <Avatar className="h-9 w-9">
          <AvatarImage
            alt={channel.creator.name}
            src={channel.creator.image ?? undefined}
          />
          <AvatarFallback className="text-xs">
            {getNameInitials(channel.creator.name)}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="flex items-center gap-1.5">
          <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate">{channel.name}</span>
          <Badge className="ml-auto shrink-0 text-xs" variant={badgeVariant}>
            {channel.type}
          </Badge>
        </ItemTitle>
        <ItemDescription className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {channel.members.length}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </ItemActions>
    </Item>
  );
}
