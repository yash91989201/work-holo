import type { Channel } from "pusher-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import {
  DM_EVENTS,
  getDmTypingChannel,
} from "@/lib/communications/dm-realtime";
import { getPusherClient } from "@/lib/pusher";

export interface DmTypingUser {
  userId: string;
  userName: string;
}

interface DmTypingPayload {
  isTyping: boolean;
  timestamp: string;
  userId: string;
  userName: string;
}

const TYPING_TIMEOUT_MS = 3000;

export function useDmTyping(conversationId: string | null) {
  const { user } = useAuthedSession();
  const [typingUsers, setTypingUsers] = useState<DmTypingUser[]>([]);
  const channelRef = useRef<Channel | null>(null);
  const typingTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (!(conversationId && user?.id)) {
      setTypingUsers([]);
      return;
    }

    const pusher = getPusherClient();
    const channelName = getDmTypingChannel(conversationId);
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    const handleTypingStart = (data: DmTypingPayload) => {
      if (data.userId === user.id) return;

      const existingTimeout = typingTimeoutsRef.current.get(data.userId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      setTypingUsers((prev) => {
        if (prev.some((u) => u.userId === data.userId)) return prev;
        return [...prev, { userId: data.userId, userName: data.userName }];
      });

      const timeout = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
        typingTimeoutsRef.current.delete(data.userId);
      }, TYPING_TIMEOUT_MS);

      typingTimeoutsRef.current.set(data.userId, timeout);
    };

    const handleTypingStop = (data: DmTypingPayload) => {
      if (data.userId === user.id) return;

      const existingTimeout = typingTimeoutsRef.current.get(data.userId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        typingTimeoutsRef.current.delete(data.userId);
      }

      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    channel.bind(DM_EVENTS.TYPING_START, handleTypingStart);
    channel.bind(DM_EVENTS.TYPING_STOP, handleTypingStop);

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
  }, [conversationId, user?.id]);

  const broadcastTyping = useCallback(
    (isTyping: boolean, userName: string) => {
      if (!(channelRef.current && user?.id)) return;

      const event = isTyping ? DM_EVENTS.TYPING_START : DM_EVENTS.TYPING_STOP;

      channelRef.current.trigger(`client-${event}`, {
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
