import type { Channel } from "pusher-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getPusherClient } from "@/lib/pusher";

export interface TypingUser {
  userId: string;
  userName: string;
}

interface TypingPayload {
  isTyping: boolean;
  timestamp: string;
  userId: string;
  userName: string;
}

export function useTypingIndicator(channelId: string) {
  const { user } = useAuthedSession();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const channelRef = useRef<Channel | null>(null);
  const typingTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (!user?.id) return;

    const pusher = getPusherClient();
    const channelName = `private-typing-${channelId}`;
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    const handleTyping = (data: TypingPayload) => {
      if (data.userId === user.id) return;

      const existingTimeout = typingTimeoutsRef.current.get(data.userId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      if (data.isTyping) {
        setTypingUsers((prev) => {
          if (!prev.some((u) => u.userId === data.userId)) {
            return [...prev, { userId: data.userId, userName: data.userName }];
          }
          return prev;
        });

        const timeout = setTimeout(() => {
          setTypingUsers((prev) =>
            prev.filter((u) => u.userId !== data.userId)
          );
          typingTimeoutsRef.current.delete(data.userId);
        }, 3000);

        typingTimeoutsRef.current.set(data.userId, timeout);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
        typingTimeoutsRef.current.delete(data.userId);
      }
    };

    channel.bind("client-typing", handleTyping);

    return () => {
      for (const timeout of typingTimeoutsRef.current.values()) {
        clearTimeout(timeout);
      }
      typingTimeoutsRef.current.clear();
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      channelRef.current = null;
      setTypingUsers([]);
    };
  }, [channelId, user?.id]);

  const broadcastTyping = useCallback(
    (isTyping: boolean, userName: string) => {
      if (!(channelRef.current && user?.id)) return;

      channelRef.current.trigger("client-typing", {
        userId: user.id,
        userName,
        isTyping,
        timestamp: new Date().toISOString(),
      });
    },
    [user?.id]
  );

  return {
    typingUsers,
    broadcastTyping,
  };
}
