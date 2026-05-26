import { Link, useParams } from "@tanstack/react-router";
import type { MessageWithSenderType } from "@work-holo/api/lib/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Button } from "@work-holo/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@work-holo/ui/components/item";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { formatMessageTimestamp } from "@/lib/utils";
import { useChannelMessageHighlight } from "@/stores/channel-store";

interface MentionMessageItemProps {
  message: MessageWithSenderType & {
    channel: { id: string; name: string };
    mention: {
      id: string;
      isSeen: boolean;
    };
  };
}

export function MentionMessageItem({ message }: MentionMessageItemProps) {
  const { highlightMessage } = useChannelMessageHighlight();

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const timestamp = formatMessageTimestamp(message.createdAt);

  const handleViewMention = () => {
    highlightMessage(message.id);
  };

  return (
    <Item variant="outline">
      <ItemMedia variant="image">
        <Avatar className="h-10 w-10">
          <AvatarImage
            alt={message.sender.name}
            src={message.sender.image || undefined}
          />
          <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-medium text-primary text-xs">
            {message.sender.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {message.sender.name} mentioned you
          <span className="font-normal text-muted-foreground text-xs">
            {timestamp.formatted}
          </span>
        </ItemTitle>
        {message.content && (
          <ItemDescription className="line-clamp-2">
            {parse(DOMPurify.sanitize(message.content))}
          </ItemDescription>
        )}
      </ItemContent>
      <ItemActions>
        <Link
          onClick={handleViewMention}
          params={{ slug, channelId: message.channel.id }}
          to="/org/$slug/workspace/communication/channels/$channelId"
        >
          <Button size="sm" variant="secondary">
            View
          </Button>
        </Link>
      </ItemActions>
    </Item>
  );
}
