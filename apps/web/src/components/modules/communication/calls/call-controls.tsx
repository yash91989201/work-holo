import { useLocalParticipant } from "@livekit/components-react";
import { cn } from "@work-holo/ui/lib/utils";
import {
  Mic,
  MicOff,
  Minimize2,
  PhoneOff,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { useCall } from "@/hooks/communications/use-call";
import { useCallStore } from "@/stores/call-store";
import { AddParticipantDialog } from "./add-participant-dialog";
import { CallReactions } from "./call-reactions";
import { DeviceSwitcher } from "./device-switcher";

function ControlButton({
  active,
  danger,
  children,
  label,
  onClick,
}: {
  active?: boolean;
  danger?: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        "flex size-10 items-center justify-center rounded-full transition-colors",
        danger
          ? "bg-destructive text-white hover:bg-destructive/90"
          : active
            ? "bg-muted text-foreground hover:bg-muted/70"
            : "bg-destructive/15 text-destructive hover:bg-destructive/25"
      )}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

export function CallControls({
  callId,
  isHost,
  existingParticipantIds = [],
  onToggleHostPanel,
  showHostPanel,
}: {
  callId: string;
  isHost: boolean;
  existingParticipantIds?: string[];
  onToggleHostPanel?: () => void;
  showHostPanel?: boolean;
}) {
  const { isMicrophoneEnabled, isCameraEnabled, localParticipant } =
    useLocalParticipant();
  const toggleMinimized = useCallStore((s) => s.toggleMinimized);
  const endCall = useCallStore((s) => s.endCall);
  const { end } = useCall();

  const handleLeave = () => {
    if (isHost) {
      end(callId);
    } else {
      // Participant disconnects locally; LiveKit fires participant_left.
      endCall();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 rounded-full bg-background/80 px-3 py-2 backdrop-blur">
      <ControlButton
        active={isMicrophoneEnabled}
        label={isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}
        onClick={() =>
          localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
        }
      >
        {isMicrophoneEnabled ? (
          <Mic className="size-5" />
        ) : (
          <MicOff className="size-5" />
        )}
      </ControlButton>

      <ControlButton
        active={isCameraEnabled}
        label={isCameraEnabled ? "Turn off camera" : "Turn on camera"}
        onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
      >
        {isCameraEnabled ? (
          <Video className="size-5" />
        ) : (
          <VideoOff className="size-5" />
        )}
      </ControlButton>

      <DeviceSwitcher />
      <CallReactions />

      {isHost && onToggleHostPanel && (
        <button
          aria-label="Participants"
          className={cn(
            "flex size-10 items-center justify-center rounded-full transition-colors",
            showHostPanel
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-foreground hover:bg-muted/70"
          )}
          onClick={onToggleHostPanel}
          title="Participants"
          type="button"
        >
          <Users className="size-5" />
        </button>
      )}

      {isHost && (
        <AddParticipantDialog
          callId={callId}
          existingParticipantIds={existingParticipantIds}
        />
      )}

      <button
        aria-label="Minimize call"
        className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/70"
        onClick={toggleMinimized}
        title="Minimize call"
        type="button"
      >
        <Minimize2 className="size-5" />
      </button>

      <ControlButton
        danger
        label={isHost ? "End call" : "Leave call"}
        onClick={handleLeave}
      >
        <PhoneOff className="size-5" />
      </ControlButton>
    </div>
  );
}
