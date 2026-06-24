import { Button } from "@work-holo/ui/components/button";
import { Phone } from "lucide-react";
import { useCall } from "@/hooks/communications/use-call";
import { useActiveCall, useChannelCall } from "@/stores/call-store";

/**
 * In-thread banner shown when a huddle is live in this channel and the current
 * user hasn't joined it.
 */
export function ChannelCallBanner({ channelId }: { channelId: string }) {
  const channelCall = useChannelCall(channelId);
  const activeCall = useActiveCall();
  const { joinChannelCall } = useCall();

  if (!channelCall) {
    return null;
  }

  // Already in this call — no banner.
  if (activeCall?.sourceConversationId === channelId) {
    return null;
  }

  const count = channelCall.participantCount;

  return (
    <div className="flex items-center gap-3 border-green-500/20 border-b bg-green-500/10 px-4 py-2">
      <span className="inline-flex size-2 animate-pulse rounded-full bg-green-500" />
      <span className="flex-1 font-medium text-sm">
        Call in progress · {count} {count === 1 ? "person" : "people"} joined
      </span>
      <Button
        className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
        disabled={activeCall !== null}
        onClick={() =>
          joinChannelCall(channelCall.callId, channelId, channelCall.type)
        }
        size="sm"
      >
        <Phone className="size-4" />
        Join
      </Button>
    </div>
  );
}
