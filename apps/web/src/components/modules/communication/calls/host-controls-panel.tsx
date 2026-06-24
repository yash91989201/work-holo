import { useRemoteParticipants } from "@livekit/components-react";
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconUserMinus,
} from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Button } from "@work-holo/ui/components/button";
import { Track } from "livekit-client";
import { useMemo } from "react";
import { toast } from "sonner";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import { getInitials } from "@/utils";
import { orpcClient } from "@/utils/orpc";

interface HostControlsPanelProps {
  callId: string;
}

export function HostControlsPanel({ callId }: HostControlsPanelProps) {
  const remoteParticipants = useRemoteParticipants();
  const { members } = useListOrgMembers();

  const memberMap = useMemo(() => {
    const m = new Map<
      string,
      { name: string | null; image: string | undefined }
    >();
    for (const mem of members) {
      m.set(mem.userId, {
        name: mem.user.name,
        image: mem.user.image ?? undefined,
      });
    }
    return m;
  }, [members]);

  if (remoteParticipants.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm">No other participants</p>
      </div>
    );
  }

  const handleMute = async (
    identity: string,
    trackSid: string,
    currentlyMuted: boolean
  ) => {
    try {
      await orpcClient.communication.call.muteParticipant({
        callId,
        participantUserId: identity,
        trackSid,
        muted: !currentlyMuted,
      });
    } catch {
      toast.error("Failed to mute participant");
    }
  };

  const handleRemove = async (identity: string, name: string) => {
    try {
      await orpcClient.communication.call.removeParticipant({
        callId,
        participantUserId: identity,
      });
      toast.success(`${name} was removed from the call`);
    } catch {
      toast.error("Failed to remove participant");
    }
  };

  return (
    <div className="flex flex-col gap-1 overflow-y-auto">
      {remoteParticipants.map((p) => {
        const user = memberMap.get(p.identity);
        const displayName = user?.name ?? p.name ?? p.identity;

        const audioPublication = [...p.audioTrackPublications.values()].find(
          (pub) => pub.source === Track.Source.Microphone
        );
        const isMuted = audioPublication ? audioPublication.isMuted : true;
        const trackSid = audioPublication?.trackSid ?? "";

        return (
          <div
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/40"
            key={p.identity}
          >
            <Avatar className="size-7 shrink-0">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="text-[10px]">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>

            <span className="min-w-0 flex-1 truncate text-sm">
              {displayName}
            </span>

            <div className="flex shrink-0 gap-1">
              <Button
                aria-label={isMuted ? "Unmute participant" : "Mute participant"}
                className="size-7 text-muted-foreground hover:text-foreground"
                disabled={!trackSid}
                onClick={() => handleMute(p.identity, trackSid, isMuted)}
                size="icon-sm"
                title={isMuted ? "Unmute" : "Mute"}
                variant="ghost"
              >
                {isMuted ? (
                  <IconMicrophoneOff className="size-3.5" />
                ) : (
                  <IconMicrophone className="size-3.5" />
                )}
              </Button>

              <Button
                aria-label={`Remove ${displayName}`}
                className="size-7 text-destructive/70 hover:text-destructive"
                onClick={() => handleRemove(p.identity, displayName)}
                size="icon-sm"
                title="Remove from call"
                variant="ghost"
              >
                <IconUserMinus className="size-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
