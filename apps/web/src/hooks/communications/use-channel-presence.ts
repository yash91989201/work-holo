import { createRealtimeClient } from "@work-holo/realtime-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "@/env";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient } from "@/utils/orpc";

interface PresencePayload {
  user_id: string;
  status?: "online" | "away" | "offline";
}

export const useChannelPresence = (channelId: string | null) => {
  const { user } = useAuthedSession();
  const clientRef = useRef<ReturnType<typeof createRealtimeClient> | null>(
    null
  );
  const roomRef = useRef<ReturnType<
    ReturnType<typeof createRealtimeClient>["room"]
  > | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  const handlePresenceSync = useCallback(
    (message: {
      presences: Array<{
        connectionId: string;
        state: Record<string, unknown>;
      }>;
    }) => {
      const idsSet = new Set<string>();
      for (const presence of message.presences) {
        const userId = presence.state.user_id as string | undefined;
        if (userId) {
          idsSet.add(userId);
        }
      }
      setOnlineUserIds(Array.from(idsSet));
    },
    []
  );

  const handlePresenceJoin = useCallback(
    (message: { connectionId: string; state: Record<string, unknown> }) => {
      const userId = message.state.user_id as string | undefined;
      if (userId) {
        setOnlineUserIds((prev) => {
          if (prev.includes(userId)) {
            return prev;
          }
          return [...prev, userId];
        });
      }
    },
    []
  );

  const handlePresenceLeave = useCallback(
    (message: { connectionId: string; state?: Record<string, unknown> }) => {
      const userId = message.state?.user_id as string | undefined;
      if (userId) {
        setOnlineUserIds((prev) => prev.filter((id) => id !== userId));
      }
    },
    []
  );

  useEffect(() => {
    if (!(channelId && user)) {
      setOnlineUserIds([]);
      return;
    }

    let mounted = true;

    const setupRealtime = async () => {
      try {
        const { grant, room: roomName } =
          await orpcClient.realtime.issuePresenceRoomGrant({
            channelId,
          });

        if (!mounted) return;

        const client = createRealtimeClient({
          url: env.VITE_REALTIME_URL,
          onError: (error) => {
            console.error("Presence realtime error:", error);
          },
        });

        const room = client.room({
          name: roomName,
          grant,
          onRefreshGrant: async () => {
            const refreshed = await orpcClient.realtime.issuePresenceRoomGrant({
              channelId,
            });
            return refreshed.grant;
          },
          onPresenceSync: handlePresenceSync,
          onPresenceJoin: handlePresenceJoin,
          onPresenceLeave: handlePresenceLeave,
        });

        client.connect();

        // Wait for server to send ready message before joining room
        await client.waitForReady();

        if (!mounted) return;

        room.join();

        // Wait for server to confirm room join before tracking presence
        await room.waitForJoin();

        if (!mounted) return;

        room.trackPresence({ user_id: user.id });

        clientRef.current = client;
        roomRef.current = room;
      } catch (error) {
        console.error("Failed to setup presence realtime:", error);
      }
    };

    setupRealtime();

    return () => {
      mounted = false;

      if (roomRef.current) {
        roomRef.current.leave();
        roomRef.current = null;
      }

      if (clientRef.current) {
        clientRef.current.disconnect();
        clientRef.current = null;
      }

      setOnlineUserIds([]);
    };
  }, [
    channelId,
    user?.id,
    handlePresenceSync,
    handlePresenceJoin,
    handlePresenceLeave,
  ]);

  return {
    onlineUserIds,
  };
};
