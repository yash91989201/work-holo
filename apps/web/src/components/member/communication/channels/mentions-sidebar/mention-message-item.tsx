import { Link, useParams } from "@tanstack/react-router";
import type { MessageWithSenderType } from "@work-holo/api/lib/types";
import { Hash } from "lucide-react";
import { useEffect, useRef } from "react";
import { MessageItem } from "@/components/member/communication/channels/message-list/message-item";
import { Button } from "@/components/ui/button";
import { useMessageMutations } from "@/hooks/communications/use-message-mutations";
import { cn } from "@/lib/utils";
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

  const handleHighlight = () => {
    highlightMessage(message.id);
  };

  const handleViewMention = () => {
    highlightMessage(message.id);
  };

  return (
    <div className="space-y-2" onClick={handleHighlight} ref={containerRef}>
      <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
        <Hash className="h-4 w-4 text-muted-foreground" />
        <Link
          params={{ slug, id: message.channel.id }}
          onClick={handleViewMention}
          to="/org/$slug/communication/channels/$id"
        >
          <Button className="h-7 px-2 text-xs" size="sm" variant="ghost">
            <span>View mention</span>
          </Button>
        </Link>
      </div>
      <div className={cn("pointer-events-none opacity-90")}>
        <MessageItem message={message} />
      </div>
    </div>
  );
}
