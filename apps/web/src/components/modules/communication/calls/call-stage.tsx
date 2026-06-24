import {
  useConnectionState,
  useLocalParticipant,
  useRemoteParticipants,
  useTracks,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { useState } from "react";
import {
  type ActiveCall,
  formatCallDuration,
  useCallElapsed,
} from "@/stores/call-store";
import { ActiveSpeakerLayout } from "./active-speaker-layout";
import { CallConnecting } from "./call-connecting";
import { CallControls } from "./call-controls";
import { CallConnectionQuality } from "./connection-quality";
import { HostControlsPanel } from "./host-controls-panel";
import { ParticipantGrid } from "./participant-grid";

const GRID_MAX = 4;

export function CallStage({ activeCall }: { activeCall: ActiveCall }) {
  const elapsed = useCallElapsed();
  const connectionState = useConnectionState();
  const [showHostPanel, setShowHostPanel] = useState(false);

  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const useGrid = tracks.length <= GRID_MAX;
  const isConnected = connectionState === ConnectionState.Connected;

  const existingParticipantIds = [
    localParticipant.identity,
    ...remoteParticipants.map((p) => p.identity),
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <CallConnectionQuality />
          <span className="font-medium text-sm capitalize">
            {activeCall.type} call
          </span>
        </div>
        <span className="font-mono text-muted-foreground text-xs">
          {formatCallDuration(elapsed)}
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="relative min-h-0 flex-1 bg-muted/30 p-2">
          {isConnected ? (
            useGrid ? (
              <ParticipantGrid tracks={tracks} />
            ) : (
              <ActiveSpeakerLayout tracks={tracks} />
            )
          ) : (
            <CallConnecting />
          )}
        </div>

        {activeCall.isHost && showHostPanel && isConnected && (
          <div className="flex w-52 shrink-0 flex-col border-l">
            <div className="border-b px-3 py-2">
              <span className="font-medium text-sm">Participants</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              <Suspense fallback={null}>
                <HostControlsPanel callId={activeCall.callId} />
              </Suspense>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center border-t p-3">
        <CallControls
          callId={activeCall.callId}
          existingParticipantIds={existingParticipantIds}
          isHost={activeCall.isHost}
          onToggleHostPanel={() => setShowHostPanel((v) => !v)}
          showHostPanel={showHostPanel}
        />
      </div>
    </div>
  );
}
