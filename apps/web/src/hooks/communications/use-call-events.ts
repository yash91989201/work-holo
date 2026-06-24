import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getPusherClient } from "@/lib/pusher";
import { type CallType, useCallStore } from "@/stores/call-store";

const RINGING_SOUND = "/assets/sounds/notify.webm";

interface IncomingPayload {
  callerAvatar: string | null;
  callerId: string;
  callerName: string;
  callId: string;
  type: CallType;
}

interface CallIdPayload {
  callId: string;
}

/**
 * Subscribes to the current user's private channel and translates DM call
 * signaling events into callStore state. Mount once, high in the authenticated
 * tree (alongside useNotificationSound).
 */
export function useCallEvents() {
  const { user } = useAuthedSession();
  const ringAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopRinging = () => {
    if (ringAudioRef.current) {
      ringAudioRef.current.pause();
      ringAudioRef.current.currentTime = 0;
      ringAudioRef.current = null;
    }
  };

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const pusher = getPusherClient();
    const channelName = `private-user-${user.id}`;
    const channel = pusher.subscribe(channelName);
    const store = useCallStore;

    const handleIncoming = (payload: IncomingPayload) => {
      // Ignore if already in this exact call, or it's our own initiation echo.
      if (payload.callerId === user.id) {
        return;
      }
      // Stop any prior ring before replacing the audio ref (prevents orphaned
      // looping audio if a second incoming call arrives).
      stopRinging();
      store.getState().setIncomingCall({
        callId: payload.callId,
        callerId: payload.callerId,
        callerName: payload.callerName,
        callerAvatar: payload.callerAvatar,
        type: payload.type,
      });

      const audio = new Audio(RINGING_SOUND);
      audio.loop = true;
      audio.play().catch(() => {
        // Autoplay may be blocked until user interacts — non-fatal.
      });
      ringAudioRef.current = audio;
    };

    const handleAccepted = (_payload: CallIdPayload) => {
      // Caller side: callee picked up. Caller is already in the room.
      stopRinging();
    };

    const handleRejected = (payload: CallIdPayload) => {
      const { activeCall } = store.getState();
      stopRinging();
      if (activeCall?.callId === payload.callId) {
        store.getState().endCall();
      }
      toast.info("Call declined");
    };

    const handleCancelled = (payload: CallIdPayload) => {
      const { incomingCall } = store.getState();
      if (incomingCall?.callId === payload.callId) {
        store.getState().clearIncomingCall();
        stopRinging();
      }
    };

    const handleEnded = (payload: CallIdPayload) => {
      const { activeCall } = store.getState();
      if (activeCall?.callId === payload.callId) {
        store.getState().endCall();
      }
      stopRinging();
    };

    const handleMissed = (payload: CallIdPayload) => {
      const { incomingCall, activeCall } = store.getState();
      if (incomingCall?.callId === payload.callId) {
        // Callee side: we had an incoming call that timed out.
        store.getState().clearIncomingCall();
        store.getState().incrementMissedCount();
        stopRinging();
      }
      if (activeCall?.callId === payload.callId) {
        // Caller side: their ring timed out with no answer.
        store.getState().endCall();
        toast.info("No answer");
      }
    };

    channel.bind("call.incoming", handleIncoming);
    channel.bind("call.accepted", handleAccepted);
    channel.bind("call.rejected", handleRejected);
    channel.bind("call.cancelled", handleCancelled);
    channel.bind("call.ended", handleEnded);
    channel.bind("call.missed", handleMissed);

    // Stop ringing whenever the incoming call clears — covers the callee
    // accepting (which clears incomingCall from a different hook).
    const unsubStore = useCallStore.subscribe((state, prev) => {
      if (prev.incomingCall && !state.incomingCall) {
        stopRinging();
      }
    });

    return () => {
      channel.unbind("call.incoming", handleIncoming);
      channel.unbind("call.accepted", handleAccepted);
      channel.unbind("call.rejected", handleRejected);
      channel.unbind("call.cancelled", handleCancelled);
      channel.unbind("call.ended", handleEnded);
      channel.unbind("call.missed", handleMissed);
      unsubStore();
      // Do not unsubscribe the channel — useNotificationSound shares it.
      stopRinging();
    };
  }, [user?.id]);
}
