import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { env } from "@work-holo/env/web";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useActiveCall,
  useCallStore,
  useIsCallMinimized,
} from "@/stores/call-store";
import { CallPill } from "./call-pill";
import { CallStage } from "./call-stage";

export function CallOverlay() {
  const activeCall = useActiveCall();
  const isMinimized = useIsCallMinimized();
  const endCall = useCallStore((s) => s.endCall);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: pos.x,
        originY: pos.y,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [pos]
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current) {
      return;
    }
    setPos({
      x: dragState.current.originX + (e.clientX - dragState.current.startX),
      y: dragState.current.originY + (e.clientY - dragState.current.startY),
    });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragState.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  if (!activeCall) {
    return null;
  }

  const handleDisconnected = () => {
    endCall();
  };

  const handleError = (error: Error) => {
    toast.error(`Call error: ${error.message}`);
    endCall();
  };

  return (
    <LiveKitRoom
      audio
      connect
      data-lk-theme="default"
      onDisconnected={handleDisconnected}
      onError={handleError}
      serverUrl={env.VITE_LIVEKIT_URL}
      token={activeCall.livekitToken}
      video={activeCall.type === "video"}
    >
      <RoomAudioRenderer />

      {isMinimized ? (
        <CallPill activeCall={activeCall} />
      ) : (
        <div
          className="fixed right-6 bottom-6 z-[95] overflow-hidden rounded-xl border bg-card shadow-2xl"
          style={{
            width: "min(680px, 90vw)",
            height: "min(520px, 80vh)",
            transform: `translate(${pos.x}px, ${pos.y}px)`,
          }}
        >
          <button
            aria-label="Drag call window"
            className="h-2 w-full cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            type="button"
          />
          <div className="h-[calc(100%-0.5rem)]">
            <CallStage activeCall={activeCall} />
          </div>
        </div>
      )}
    </LiveKitRoom>
  );
}
