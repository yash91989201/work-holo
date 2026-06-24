import { useEffect } from "react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getPusherClient } from "@/lib/pusher";
import { type CallType, useCallStore } from "@/stores/call-store";

interface ChannelStartedPayload {
  callId: string;
  channelId: string;
  initiatorName: string;
  type: CallType;
}

interface ChannelEndedPayload {
  callId: string;
  channelId: string;
}

interface ChannelParticipantPayload {
  callId: string;
  channelId: string;
  participantCount: number;
  userId: string;
}

/**
 * Subscribes to the org-wide channel for channel-call (huddle) lifecycle events
 * and mirrors them into callStore.activeChannelCalls so the sidebar live
 * indicator and in-thread banner can react. Mount once in the workspace layout.
 */
export function useOrgCallEvents() {
  const { session } = useAuthedSession();
  const orgId = session.activeOrganizationId;

  useEffect(() => {
    if (!orgId) {
      return;
    }

    const pusher = getPusherClient();
    const channelName = `private-org-${orgId}`;
    const channel = pusher.subscribe(channelName);
    const store = useCallStore;

    const handleStarted = (payload: ChannelStartedPayload) => {
      store.getState().setChannelCall(payload.channelId, {
        callId: payload.callId,
        type: payload.type,
        participantCount: 1,
      });
    };

    const handleEnded = (payload: ChannelEndedPayload) => {
      store.getState().setChannelCall(payload.channelId, null);
    };

    const handleParticipant = (payload: ChannelParticipantPayload) => {
      const existing = store.getState().activeChannelCalls[payload.channelId];
      if (existing) {
        store.getState().setChannelCall(payload.channelId, {
          ...existing,
          participantCount: payload.participantCount,
        });
      }
    };

    channel.bind("call.channel.started", handleStarted);
    channel.bind("call.channel.ended", handleEnded);
    channel.bind("call.channel.participant", handleParticipant);

    return () => {
      channel.unbind("call.channel.started", handleStarted);
      channel.unbind("call.channel.ended", handleEnded);
      channel.unbind("call.channel.participant", handleParticipant);
      // private-org channel may be shared with other features — don't unsubscribe.
    };
  }, [orgId]);
}
