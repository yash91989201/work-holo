import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { queryClient, queryUtils } from "@/utils/orpc";
import { useActiveOrganization } from "./use-active-organization";

export type PresenceStatus =
  | "available"
  | "away"
  | "on_break"
  | "busy"
  | "in_call"
  | "in_meeting"
  | "offline"
  | "dnd";

export type ManualStatus = "dnd" | "busy" | "away" | null;

interface UsePresenceHeartbeatOptions {
  enabled?: boolean;
  punchedIn: boolean;
  onBreak: boolean;
  inCall?: boolean;
  inMeeting?: boolean;
  manualStatus?: ManualStatus;
  intervalMs?: number;
}

export function usePresenceHeartbeat({
  enabled = true,
  punchedIn,
  onBreak,
  inCall = false,
  inMeeting = false,
  manualStatus = null,
  intervalMs = 300_000, // 5 minutes
}: UsePresenceHeartbeatOptions) {
  const organization = useActiveOrganization();
  const lastActivityRef = useRef(Date.now());
  const isTabFocusedRef = useRef(true);
  const lastHeartbeatRef = useRef(0); // ADD THIS LINE

  const { mutate: sendHeartbeat } = useMutation(
    queryUtils.member.presence.heartbeat.mutationOptions({})
  );

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();

      // Throttle heartbeats to once per 5 minutes
      const now = Date.now();
      const timeSinceLastHeartbeat = now - lastHeartbeatRef.current;
      const THROTTLE_INTERVAL = 300_000; // 5 minutes

      if (timeSinceLastHeartbeat < THROTTLE_INTERVAL) {
        return; // Skip heartbeat, too soon
      }

      // Send heartbeat when user becomes active (throttled)
      if (enabled && organization?.id) {
        lastHeartbeatRef.current = now;
        const isIdle = false;
        sendHeartbeat({
          orgId: organization.id,
          punchedIn,
          onBreak,
          inCall,
          inMeeting,
          isTabFocused: true,
          isIdle,
          manualStatus,
        });
      }
    };

    const handleVisibilityChange = () => {
      const newFocusState = !document.hidden;
      isTabFocusedRef.current = newFocusState;

      // Send immediate heartbeat when tab becomes focused
      if (newFocusState && enabled && organization?.id) {
        const now = Date.now();
        lastActivityRef.current = now;
        lastHeartbeatRef.current = now; // ADD THIS LINE
        sendHeartbeat({
          orgId: organization.id,
          punchedIn,
          onBreak,
          inCall,
          inMeeting,
          isTabFocused: true,
          isIdle: false,
          manualStatus,
        });
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    enabled,
    organization?.id,
    punchedIn,
    onBreak,
    inCall,
    inMeeting,
    manualStatus,
    sendHeartbeat,
  ]);

  // Send heartbeat
  useEffect(() => {
    if (!(enabled && organization?.id)) return;

    const sendPresenceUpdate = () => {
      const now = Date.now();
      const idleTime = now - lastActivityRef.current;
      const isIdle = idleTime > 60 * 1000; // 1 minute

      sendHeartbeat({
        orgId: organization.id,
        punchedIn,
        onBreak,
        inCall,
        inMeeting,
        isTabFocused: isTabFocusedRef.current,
        isIdle,
        manualStatus,
      });
    };

    // Initialize throttle ref - ADD THIS LINE
    lastHeartbeatRef.current = Date.now();

    // Send immediately
    sendPresenceUpdate();

    // Then send periodically
    const interval = setInterval(sendPresenceUpdate, intervalMs);

    return () => clearInterval(interval);
  }, [
    enabled,
    organization?.id,
    punchedIn,
    onBreak,
    inCall,
    inMeeting,
    manualStatus,
    intervalMs,
    sendHeartbeat,
  ]);
}

export function useSetManualStatus() {
  const organization = useActiveOrganization();
  return useMutation(
    queryUtils.member.presence.setManualStatus.mutationOptions({
      onSuccess: async () => {
        // Immediately refetch the org presence data to update UI
        await queryClient.refetchQueries({
          queryKey: queryUtils.member.presence.getOrgPresence.queryKey({
            input: {
              orgId: organization?.id ?? "",
            },
          }),
          exact: true,
        });
      },
    })
  );
}

export function useOrgPresence() {
  const organization = useActiveOrganization();

  return useQuery(
    queryUtils.member.presence.getOrgPresence.queryOptions({
      input: {
        orgId: organization?.id ?? "",
      },
      enabled: !!organization?.id,
      refetchInterval: 30_000,
    })
  );
}
