import { useCallback } from "react";
import { toast } from "sonner";
import { type CallType, useCallStore } from "@/stores/call-store";
import { orpcClient, queryClient, queryUtils } from "@/utils/orpc";

interface InitiateArgs {
  calleeIds: string[];
  sourceConversationId?: string;
  sourceType?: "dm" | "channel";
  type: CallType;
}

export function useCall() {
  const setActiveCall = useCallStore((s) => s.setActiveCall);
  const clearIncomingCall = useCallStore((s) => s.clearIncomingCall);
  const setSoftSwitchPending = useCallStore((s) => s.setSoftSwitchPending);

  const initiate = useCallback(
    async (args: InitiateArgs) => {
      // Soft switch: refuse to start a second call while one is active.
      const { activeCall } = useCallStore.getState();
      if (activeCall) {
        toast.error("You're already in a call. Leave it first.");
        return;
      }

      // Warn (non-blocking) if any callee is already in a call.
      if (args.calleeIds.length > 0) {
        const presenceData = queryClient.getQueryData(
          queryUtils.org.presence.getOrgPresence.queryKey({ input: {} })
        ) as { presence: Record<string, { status: string }> } | undefined;
        const inCall = args.calleeIds.some(
          (id) => presenceData?.presence?.[id]?.status === "in_call"
        );
        if (inCall) {
          toast.warning(
            "This person is already on a call — they may not answer"
          );
        }
      }

      try {
        const result = await orpcClient.communication.call.initiate({
          type: args.type,
          calleeIds: args.calleeIds,
          sourceConversationId: args.sourceConversationId,
          sourceType: args.sourceType,
        });

        setActiveCall({
          callId: result.callId,
          roomName: result.livekitRoomName,
          type: args.type,
          sourceType: args.sourceType ?? "dm",
          sourceConversationId: args.sourceConversationId ?? null,
          isHost: true,
          livekitToken: result.token,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to start call"
        );
      }
    },
    [setActiveCall]
  );

  const accept = useCallback(
    async (callId: string, type: CallType) => {
      // If already in a call, prompt soft switch instead of joining directly.
      const { activeCall, incomingCall } = useCallStore.getState();
      if (activeCall) {
        setSoftSwitchPending({
          callId,
          callerName: incomingCall?.callerName ?? "Unknown",
          type,
        });
        return;
      }

      try {
        const result = await orpcClient.communication.call.accept({ callId });
        setActiveCall({
          callId,
          roomName: result.livekitRoomName,
          type,
          sourceType: "dm",
          sourceConversationId: null,
          isHost: false,
          livekitToken: result.token,
        });
        clearIncomingCall();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to join call"
        );
        clearIncomingCall();
      }
    },
    [setActiveCall, clearIncomingCall, setSoftSwitchPending]
  );

  const decline = useCallback(
    async (callId: string) => {
      clearIncomingCall();
      try {
        await orpcClient.communication.call.reject({ callId });
      } catch (error) {
        console.error("[useCall] reject failed:", error);
      }
    },
    [clearIncomingCall]
  );

  const cancel = useCallback(async (callId: string) => {
    try {
      await orpcClient.communication.call.cancel({ callId });
    } catch (error) {
      console.error("[useCall] cancel failed:", error);
    }
    useCallStore.getState().endCall();
  }, []);

  const end = useCallback(async (callId: string) => {
    try {
      await orpcClient.communication.call.end({ callId });
    } catch (error) {
      console.error("[useCall] end failed:", error);
    }
    useCallStore.getState().endCall();
  }, []);

  const startChannelCall = useCallback(
    async (channelId: string, type: CallType) => {
      const { activeCall } = useCallStore.getState();
      if (activeCall) {
        toast.error("You're already in a call. Leave it first.");
        return;
      }
      try {
        const result = await orpcClient.communication.call.initiate({
          type,
          calleeIds: [],
          sourceConversationId: channelId,
          sourceType: "channel",
        });
        setActiveCall({
          callId: result.callId,
          roomName: result.livekitRoomName,
          type,
          sourceType: "channel",
          sourceConversationId: channelId,
          isHost: true,
          livekitToken: result.token,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to start call"
        );
      }
    },
    [setActiveCall]
  );

  const joinChannelCall = useCallback(
    async (callId: string, channelId: string, type: CallType) => {
      const { activeCall } = useCallStore.getState();
      if (activeCall) {
        toast.error("You're already in a call. Leave it first.");
        return;
      }
      try {
        const result = await orpcClient.communication.call.getJoinToken({
          callId,
        });
        setActiveCall({
          callId,
          roomName: result.livekitRoomName,
          type,
          sourceType: "channel",
          sourceConversationId: channelId,
          isHost: false,
          livekitToken: result.token,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to join call"
        );
      }
    },
    [setActiveCall]
  );

  return {
    initiate,
    accept,
    decline,
    cancel,
    end,
    startChannelCall,
    joinChannelCall,
  };
}
