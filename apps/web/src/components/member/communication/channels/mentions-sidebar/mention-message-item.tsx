import { Link, useParams } from "@tanstack/react-router";
import type { MessageWithSenderType } from "@work-holo/api/lib/types";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useMessageMutations } from "@/hooks/communications/use-message-mutations";
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
  const { markMentionSeen } = useMessageMutations();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasMarkedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const { highlightMessage } = useChannelMessageHighlight();

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug/(modules)/communication/channels/$id",
  });

  const timestamp = formatMessageTimestamp(message.createdAt);

  useEffect(() => {
    if (message.mention.isSeen || hasMarkedRef.current) return;

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const handleInView = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasMarkedRef.current) {
        timeoutRef.current = window.setTimeout(() => {
          hasMarkedRef.current = true;
          markMentionSeen({ mentionId: message.mention.id });
        }, 2000);
      } else if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const observer = new IntersectionObserver(handleInView, {
      threshold: 0.5,
    });

    observer.observe(node);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      observer.disconnect();
    };
  }, [markMentionSeen, message.mention.id, message.mention.isSeen]);

  const handleViewMention = () => {
    highlightMessage(message.id);
  };

  return (
    <Item ref={containerRef} variant="outline">
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
          params={{ slug, id: message.channel.id }}
          to="/org/$slug/communication/channels/$id"
        >
          <Button size="sm" variant="secondary">
            View
          </Button>
        </Link>
      </ItemActions>
    </Item>
  );
}
