import {
  IconArrowBigRightFilled,
  IconHash,
  IconLockFilled,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { ListChannelsOutputType } from "@work-holo/api/lib/types";
import { Badge } from "@work-holo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";
import { queryUtils } from "@/utils/orpc";

export const RecentChannels = () => {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug/workspace",
  });

  const { data: channels } = useSuspenseQuery(
    queryUtils.communication.channel.getRecent.queryOptions({ input: {} })
  );

  return (
    <div>
      <h2 className="mb-4 font-semibold text-xl">Recent Channels</h2>
      {channels.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconHash className="h-12 w-12 text-green-600" />
            </EmptyMedia>
            <EmptyTitle>No recent channels found</EmptyTitle>
            <EmptyDescription>
              Start by creating sending messages in channels.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <ChannelCard channel={channel} key={channel.id} slug={slug} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ChannelCard = ({
  channel,
  slug,
}: {
  channel: ListChannelsOutputType["channels"][number];
  slug: string;
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate({
      to: "/org/$slug/workspace/communication/channels/$channelId",
      params: { slug, channelId: channel.id },
    });
  };

  return (
    <Card
      className="group cursor-pointer border-l-4 border-l-primary/20 transition-shadow hover:border-l-primary hover:shadow-md"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {channel.isPrivate ? (
              <IconLockFilled className="h-5 w-5 text-orange-600" />
            ) : (
              <IconHash className="h-5 w-5 text-green-600" />
            )}
            <CardTitle className="truncate text-lg">{channel.name}</CardTitle>
          </div>
          {channel.isPrivate && (
            <Badge className="text-xs" variant="secondary">
              Private
            </Badge>
          )}
        </div>
        {channel.description && (
          <CardDescription className="line-clamp-2">
            {channel.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-muted-foreground text-sm">
          <span>Created by {channel.creator.name}</span>
          <IconArrowBigRightFilled className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </CardContent>
    </Card>
  );
};
