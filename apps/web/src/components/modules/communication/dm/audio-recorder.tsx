import { IconMicrophone, IconPlayerStop, IconTrash } from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";

interface DmAudioRecorderProps {
  audioUrl: string | null;
  duration: number;
  isRecording: boolean;
  onCancel: () => void;
  onStart: () => void;
  onStop: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function DmAudioRecorder({
  audioUrl,
  duration,
  isRecording,
  onCancel,
  onStart,
  onStop,
}: DmAudioRecorderProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
      {isRecording ? (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Recording...</p>
            <p className="text-muted-foreground text-xs">
              {formatDuration(duration)}
            </p>
          </div>
          <Button
            className="h-9 w-9"
            onClick={onStop}
            size="icon"
            variant="secondary"
          >
            <IconPlayerStop className="h-4 w-4" />
          </Button>
          <Button
            className="h-9 w-9"
            onClick={onCancel}
            size="icon"
            variant="ghost"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </>
      ) : audioUrl ? (
        <>
          <audio className="flex-1" controls src={audioUrl} />
          <Button
            className="h-9 w-9"
            onClick={onCancel}
            size="icon"
            variant="ghost"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button className="w-full gap-2" onClick={onStart} variant="outline">
          <IconMicrophone className="h-4 w-4" />
          <span>Start recording</span>
        </Button>
      )}
    </div>
  );
}
