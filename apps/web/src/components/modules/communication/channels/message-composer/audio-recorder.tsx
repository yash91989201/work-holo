import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconSend,
  IconTrashFilled,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface AudioRecorderProps {
  audioUrl: string | null;
  duration: number;
  isRecording: boolean;
  onCancel: () => void;
  onSend: () => void;
  onStart: () => void;
  onStop: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioRecorder({
  isRecording,
  audioUrl,
  duration,
  onStop,
  onCancel,
  onSend,
}: AudioRecorderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setPlaybackTime(Math.floor(audio.currentTime));
    const handleEnded = () => {
      setIsPlaying(false);
      setPlaybackTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (isRecording) {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-destructive/10 p-3">
        <div className="flex items-center gap-2">
          <div className="size-2 animate-pulse rounded-full bg-destructive" />
          <p className="font-medium text-sm">Recording</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-muted-foreground text-sm">
            {formatDuration(duration)}
          </span>
          <Button onClick={onStop} size="sm" variant="secondary">
            <IconPlayerPauseFilled className="mr-1 size-3" />
            Stop
          </Button>
          <Button onClick={onCancel} size="icon-sm" variant="ghost">
            <IconX className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (audioUrl) {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
        {/** biome-ignore lint/a11y/useMediaCaption: <track is not required here> */}
        <audio className="hidden" ref={audioRef} />
        <Button onClick={togglePlayback} size="icon-sm" variant="ghost">
          {isPlaying ? (
            <IconPlayerPauseFilled className="size-4" />
          ) : (
            <IconPlayerPlayFilled className="size-4" />
          )}
        </Button>
        <div className="flex-1">
          <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${duration > 0 ? (playbackTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="font-mono text-muted-foreground text-xs">
            {formatDuration(isPlaying ? playbackTime : duration)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button onClick={onSend} size="sm" variant="default">
            <IconSend className="mr-1 size-3" />
            Send
          </Button>
          <Button
            onClick={onCancel}
            size="icon-sm"
            title="Delete audio"
            variant="ghost"
          >
            <IconTrashFilled className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
