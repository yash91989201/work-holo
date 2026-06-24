import { Button } from "@work-holo/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@work-holo/ui/components/tooltip";
import { Phone, Video } from "lucide-react";
import { useCall } from "@/hooks/communications/use-call";
import { useActiveCall, useChannelCall } from "@/stores/call-store";

/**
 * Channel header call control. If a huddle is already live in this channel,
 * shows a "Join" button; otherwise shows voice/video start buttons.
 */
export function ChannelCallButton({ channelId }: { channelId: string }) {
  const { startChannelCall, joinChannelCall } = useCall();
  const channelCall = useChannelCall(channelId);
  const activeCall = useActiveCall();

  const isInThisCall = activeCall?.sourceConversationId === channelId;
  if (isInThisCall) {
    return null;
  }

  if (channelCall) {
    return (
      <Button
        className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
        onClick={() =>
          joinChannelCall(channelCall.callId, channelId, channelCall.type)
        }
        size="sm"
      >
        <Phone className="size-4" />
        Join huddle
      </Button>
    );
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              disabled={activeCall !== null}
              onClick={() => startChannelCall(channelId, "voice")}
              size="icon-sm"
              variant="ghost"
            >
              <Phone />
            </Button>
          }
        />
        <TooltipContent>Start voice huddle</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              disabled={activeCall !== null}
              onClick={() => startChannelCall(channelId, "video")}
              size="icon-sm"
              variant="ghost"
            >
              <Video />
            </Button>
          }
        />
        <TooltipContent>Start video huddle</TooltipContent>
      </Tooltip>
    </>
  );
}
