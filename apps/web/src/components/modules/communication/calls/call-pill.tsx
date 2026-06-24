import { useLocalParticipant } from "@livekit/components-react";
import { Maximize2, Mic, MicOff, PhoneOff } from "lucide-react";
import { useCall } from "@/hooks/communications/use-call";
import {
  type ActiveCall,
  formatCallDuration,
  useCallElapsed,
  useCallStore,
} from "@/stores/call-store";

export function CallPill({ activeCall }: { activeCall: ActiveCall }) {
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant();
  const toggleMinimized = useCallStore((s) => s.toggleMinimized);
  const endCall = useCallStore((s) => s.endCall);
  const { end } = useCall();
  const elapsed = formatCallDuration(useCallElapsed());

  const handleLeave = () => {
    if (activeCall.isHost) {
      end(activeCall.callId);
    } else {
      endCall();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[95] flex items-center gap-2 rounded-full border bg-card py-2 pr-2 pl-3 shadow-2xl">
      <span className="size-2 animate-pulse rounded-full bg-green-500" />
      <span className="font-mono text-xs">{elapsed}</span>

      <button
        aria-label={isMicrophoneEnabled ? "Mute" : "Unmute"}
        className="flex size-8 items-center justify-center rounded-full bg-muted hover:bg-muted/70"
        onClick={() =>
          localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
        }
        type="button"
      >
        {isMicrophoneEnabled ? (
          <Mic className="size-4" />
        ) : (
          <MicOff className="size-4" />
        )}
      </button>

      <button
        aria-label="Expand call"
        className="flex size-8 items-center justify-center rounded-full bg-muted hover:bg-muted/70"
        onClick={toggleMinimized}
        type="button"
      >
        <Maximize2 className="size-4" />
      </button>

      <button
        aria-label={activeCall.isHost ? "End call" : "Leave call"}
        className="flex size-8 items-center justify-center rounded-full bg-destructive text-white hover:bg-destructive/90"
        onClick={handleLeave}
        type="button"
      >
        <PhoneOff className="size-4" />
      </button>
    </div>
  );
}
