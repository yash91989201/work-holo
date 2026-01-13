import { env } from "@work-holo/env/web";
import { createRealtimeClient } from "@work-holo/realtime-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient } from "@/utils/orpc";

export interface TypingUser {
  userId: string;
  userName: string;
}

export function useTypingIndicator(channelId: string) {
  const { user } = useAuthedSession();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const clientRef = useRef<ReturnType<typeof createRealtimeClient> | null>(
    null
  );
  const roomRef = useRef<ReturnType<
    ReturnType<typeof createRealtimeClient>["room"]
  > | null>(null);
  const typingTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const handleTypingBroadcast = useCallback(
    (msg: { event: string; payload: Record<string, unknown> }) => {
      if (msg.event !== "typing" || !user?.id) return;

      const { userId, userName, isTyping } = msg.payload as {
        userId: string;
        userName: string;
        isTyping: boolean;
      };

      if (userId === user.id) return;

      const existingTimeout = typingTimeoutsRef.current.get(userId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      if (isTyping) {
        setTypingUsers((prev) => {
          if (!prev.some((u) => u.userId === userId)) {
            return [...prev, { userId, userName }];
          }
          return prev;
        });

        const timeout = setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
          typingTimeoutsRef.current.delete(userId);
        }, 3000);

        typingTimeoutsRef.current.set(userId, timeout);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
        typingTimeoutsRef.current.delete(userId);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    if (!user?.id) return;

    let mounted = true;

    const setupRealtime = async () => {
      try {
        const { grant, room: roomName } =
          await orpcClient.realtime.issueTypingRoomGrant({
            channelId,
          });

        if (!mounted) return;

        const client = createRealtimeClient({
          url: env.VITE_REALTIME_URL,
          onError: (error) => {
            console.error("Realtime error:", error);
          },
        });

        const room = client.room({
          name: roomName,
          grant,
          onRefreshGrant: async () => {
            const refreshed = await orpcClient.realtime.issueTypingRoomGrant({
              channelId,
            });
            return refreshed.grant;
          },
          onBroadcast: handleTypingBroadcast,
        });

        client.connect();

        // Wait for server to send ready message before joining room
        await client.waitForReady();

        if (!mounted) return;

        room.join();

        // Wait for server to confirm room join before storing refs
        await room.waitForJoin();

        if (!mounted) return;

        clientRef.current = client;
        roomRef.current = room;
      } catch (error) {
        console.error("Failed to setup realtime:", error);
      }
    };

    setupRealtime();

    return () => {
      mounted = false;

      for (const timeout of typingTimeoutsRef.current.values()) {
        clearTimeout(timeout);
      }

      typingTimeoutsRef.current.clear();

      if (roomRef.current) {
        roomRef.current.leave();
        roomRef.current = null;
      }

      if (clientRef.current) {
        clientRef.current.disconnect();
        clientRef.current = null;
      }

      setTypingUsers([]);
    };
  }, [channelId, user?.id, handleTypingBroadcast]);

  const broadcastTyping = (isTyping: boolean, userName: string) => {
    if (!(roomRef.current && user?.id)) return;

    roomRef.current.broadcast("typing", {
      userId: user.id,
      userName,
      isTyping,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    typingUsers,
    broadcastTyping,
  };
}
