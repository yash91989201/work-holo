import { Link, useParams } from "@tanstack/react-router";
import type { MessageWithSenderType } from "@work-holo/api/lib/types";
import { ArrowRight, Hash } from "lucide-react";
import { MessageItem } from "@/components/member/communication/channels/message-list/message-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MentionMessageItemProps {
  message: MessageWithSenderType & {
    channel: { id: string; name: string };
  };
  currentChannelId: string;
}

export function MentionMessageItem({
  message,
  currentChannelId,
}: MentionMessageItemProps) {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug/(member)/(base-modules)/communication/channels/$id",
  });

  const isCurrentChannel = message.channel.id === currentChannelId;

  if (isCurrentChannel) {
    return <MessageItem message={message} />;
  }

  return (
    <div className="space-y-2">
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
            <span>Go to channel</span>
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
