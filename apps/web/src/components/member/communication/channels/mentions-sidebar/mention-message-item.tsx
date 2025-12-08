import { Link, useParams } from "@tanstack/react-router";
import type { MessageWithSenderType } from "@work-holo/api/lib/types";
import { ArrowRight, Hash } from "lucide-react";
import { useEffect, useRef } from "react";
import { MessageItem } from "@/components/member/communication/channels/message-list/message-item";
import { Button } from "@/components/ui/button";
import { useMessageMutations } from "@/hooks/communications/use-message-mutations";
import { cn } from "@/lib/utils";

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

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{message.channel.name}</span>
        </div>
        <Link
          params={{ slug, id: message.channel.id }}
          to="/org/$slug/communication/channels/$id"
        >
          <Button className="h-8 gap-1.5" size="sm" variant="ghost">
            <span>View mention</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
      <div className={cn("pointer-events-none opacity-90")}>
        <MessageItem message={message} />
      </div>
    </div>
  );
}
