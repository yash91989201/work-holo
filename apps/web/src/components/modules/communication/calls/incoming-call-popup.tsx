import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Button } from "@work-holo/ui/components/button";
import { Phone, PhoneOff, Video } from "lucide-react";
import { useEffect } from "react";
import { useCall } from "@/hooks/communications/use-call";
import { useIncomingCall } from "@/stores/call-store";

// Safety net: if the ring-timeout Pusher event is missed, dismiss locally.
const AUTO_DISMISS_MS = 32_000;

export function IncomingCallPopup() {
  const incomingCall = useIncomingCall();
  const { accept, decline } = useCall();

  useEffect(() => {
    if (!incomingCall) {
      return;
    }
    const callId = incomingCall.callId;
    const timer = setTimeout(() => {
      decline(callId);
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [incomingCall, decline]);

  if (!incomingCall) {
    return null;
  }

  const isVideo = incomingCall.type === "video";
  const initials = incomingCall.callerName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="slide-in-from-top-2 fixed top-4 right-4 z-[100] w-80 animate-in rounded-xl border bg-card p-4 shadow-2xl">
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarImage src={incomingCall.callerAvatar ?? undefined} />
          <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-medium text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-sm">
            {incomingCall.callerName}
          </p>
          <p className="flex items-center gap-1 text-muted-foreground text-xs">
            {isVideo ? (
              <Video className="size-3" />
            ) : (
              <Phone className="size-3" />
            )}
            Incoming {isVideo ? "video" : "voice"} call…
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          className="flex-1"
          onClick={() => decline(incomingCall.callId)}
          size="sm"
          variant="destructive"
        >
          <PhoneOff className="size-4" />
          Decline
        </Button>
        <Button
          className="flex-1 bg-green-600 text-white hover:bg-green-700"
          onClick={() => accept(incomingCall.callId, incomingCall.type)}
          size="sm"
        >
          <Phone className="size-4" />
          Accept
        </Button>
      </div>
    </div>
  );
}
