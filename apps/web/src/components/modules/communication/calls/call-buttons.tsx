import { Button } from "@work-holo/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@work-holo/ui/components/tooltip";
import { Phone, Video } from "lucide-react";
import { useCall } from "@/hooks/communications/use-call";
import { useActiveCall } from "@/stores/call-store";

/**
 * Voice + video call buttons for a DM conversation header. Starts a direct-ring
 * call to the other participant.
 */
export function CallButtons({
  calleeId,
  conversationId,
}: {
  calleeId: string;
  conversationId: string;
}) {
  const { initiate } = useCall();
  const activeCall = useActiveCall();
  const disabled = activeCall !== null;

  const start = (type: "voice" | "video") => {
    initiate({
      type,
      calleeIds: [calleeId],
      sourceConversationId: conversationId,
      sourceType: "dm",
    });
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              disabled={disabled}
              onClick={() => start("voice")}
              size="icon-sm"
              variant="ghost"
            >
              <Phone />
            </Button>
          }
        />
        <TooltipContent>Start voice call</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              disabled={disabled}
              onClick={() => start("video")}
              size="icon-sm"
              variant="ghost"
            >
              <Video />
            </Button>
          }
        />
        <TooltipContent>Start video call</TooltipContent>
      </Tooltip>
    </>
  );
}
