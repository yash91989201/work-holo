import {
  IconCircleChevronRightFilled,
  IconHash,
  IconLockFilled,
  IconMessageFilled,
  IconMessageOff,
  IconUsers,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import type { ChannelMemberType } from "@work-holo/db/lib/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { buttonVariants } from "@work-holo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import * as React from "react";
import { getInitials } from "@/utils";
import { queryUtils } from "@/utils/orpc";

export function RecentChannels() {
  const { data: recentChannels } = useSuspenseQuery(
    queryUtils.communication.channel.getRecent.queryOptions({})
  );

  if (recentChannels.length === 0) {
    return <NoRecentChannels />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <IconMessageFilled />
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
  const ChannelIcon = channel.isPrivate ? IconLockFilled : IconHash;
  const { slug } = useParams({ from: "/(authenticated)/org/$slug" });

  return (
    <Item>
      <Link
        params={{ slug, channelId: channel.id }}
        to="/org/$slug/workspace/communication/channels/$channelId"
      >
        <ItemMedia>
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt={channel.creator.name}
              src={channel.creator.image ?? undefined}
            />
            <AvatarFallback className="text-xs">
              {getInitials(channel.creator.name)}
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
              <IconUsers className="h-3 w-3" />
              {channel.members.length}
            </span>
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <IconCircleChevronRightFilled className="h-4 w-4 text-muted-foreground" />
        </ItemActions>
      </Link>
    </Item>
  );
}

function getBadgeVariant(
  type: "team" | "group" | "direct"
): "default" | "secondary" | "outline" {
  if (type === "direct") {
    return "default";
  }
  if (type === "group") {
    return "secondary";
  }
  return "outline";
}

function NoRecentChannels() {
  const { slug } = useParams({ from: "/(authenticated)/org/$slug" });

  return (
    <Empty className="max-w-md border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconMessageOff />
        </EmptyMedia>
        <EmptyTitle>No recent channels</EmptyTitle>
        <EmptyDescription>
          You have not messaged in any channels recently.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          params={{ slug }}
          to="/org/$slug/workspace/communication/channels"
        >
          Browse Channels
        </Link>
      </EmptyContent>
    </Empty>
  );
}
