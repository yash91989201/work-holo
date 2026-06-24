import {
  IconPhone,
  IconPhoneOff,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import { Phone, Video } from "lucide-react";
import { formatCallDuration } from "@/stores/call-store";
import { getInitials } from "@/utils";

interface CallHistoryItemProps {
  /** Avatar image URL (DM calls only) */
  avatarUrl?: string | null;
  callId: string;
  endedAt?: Date | null;
  /** Name of the other party (other participant for DM, channel name for channel calls) */
  label: string;
  /** If provided, show a quick-redial button */
  onRedial?: () => void;
  onVideoRedial?: () => void;
  sourceType: "dm" | "channel" | null;
  startedAt?: Date | null;
  status: "active" | "missed" | "rejected" | "cancelled" | "ended" | "ringing";
  type: "voice" | "video";
}

function getCallDuration(
  startedAt: Date | null | undefined,
  endedAt: Date | null | undefined
): string | null {
  if (!(startedAt && endedAt)) return null;
  const seconds = Math.floor(
    (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000
  );
  return formatCallDuration(seconds);
}

export function CallHistoryItem({
  type,
  status,
  sourceType,
  label,
  avatarUrl,
  startedAt,
  endedAt,
  onRedial,
  onVideoRedial,
}: CallHistoryItemProps) {
  const isMissed = status === "missed" || status === "rejected";
  const duration = getCallDuration(startedAt, endedAt);

  const TypeIcon =
    type === "video"
      ? isMissed
        ? IconVideoOff
        : IconVideo
      : isMissed
        ? IconPhoneOff
        : IconPhone;

  return (
    <div className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted/40">
      {sourceType === "dm" ? (
        <Avatar className="size-7 shrink-0">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback className="text-[10px]">
            {getInitials(label)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
          <TypeIcon className="size-3.5 text-muted-foreground" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-medium text-sm">{label}</span>
          {isMissed && (
            <Badge
              className="h-4 shrink-0 px-1 py-0 text-[10px]"
              variant="destructive"
            >
              Missed
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <TypeIcon className="size-3" />
          <span>{type === "video" ? "Video" : "Voice"}</span>
          {duration && (
            <>
              <span>·</span>
              <span>{duration}</span>
            </>
          )}
        </div>
      </div>

      {(onRedial || onVideoRedial) && (
        <div className="flex shrink-0 items-center gap-1">
          {onRedial && (
            <Button
              aria-label="Voice call"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={onRedial}
              size="icon-sm"
              variant="ghost"
            >
              <Phone className="size-3.5" />
            </Button>
          )}
          {onVideoRedial && (
            <Button
              aria-label="Video call"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={onVideoRedial}
              size="icon-sm"
              variant="ghost"
            >
              <Video className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
