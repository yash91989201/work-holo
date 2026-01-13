import type { Members, PresenceChannel } from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getPusherClient } from "@/lib/pusher";

interface PresenceMember {
  id: string;
  info: { name: string };
}

export const useChannelPresence = (channelId: string | null) => {
  const { user } = useAuthedSession();
  const channelRef = useRef<PresenceChannel | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (!(channelId && user)) {
      setOnlineUserIds([]);
      return;
    }

    const pusher = getPusherClient();
    const channelName = `presence-channel-${channelId}`;
    const channel = pusher.subscribe(channelName) as PresenceChannel;
    channelRef.current = channel;

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const ids: string[] = [];
      members.each((member: PresenceMember) => {
        ids.push(member.id);
      });
      setOnlineUserIds(ids);
    });

    channel.bind("pusher:member_added", (member: PresenceMember) => {
      setOnlineUserIds((prev) => {
        if (prev.includes(member.id)) return prev;
        return [...prev, member.id];
      });
    });

    channel.bind("pusher:member_removed", (member: PresenceMember) => {
      setOnlineUserIds((prev) => prev.filter((id) => id !== member.id));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      channelRef.current = null;
      setOnlineUserIds([]);
    };
  }, [channelId, user]);

  return {
    onlineUserIds,
  };
};
