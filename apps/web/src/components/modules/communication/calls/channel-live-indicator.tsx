import { useChannelCall } from "@/stores/call-store";

/**
 * Pulsing green dot shown next to a channel name in the sidebar while a huddle
 * is live in that channel. Renders nothing when there's no active call.
 */
export function ChannelLiveIndicator({ channelId }: { channelId: string }) {
  const channelCall = useChannelCall(channelId);

  if (!channelCall) {
    return null;
  }

  return (
    <span
      aria-label="Live call in progress"
      className="inline-flex size-2 shrink-0 animate-pulse rounded-full bg-green-500"
      title="Live call in progress"
    />
  );
}
