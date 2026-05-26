/** biome-ignore-all lint/style/noNestedTernary: <Nested ternary is needed> */
import {
  IconMicrophone,
  IconMoodSmile,
  IconPaperclip,
  IconSend,
} from "@tabler/icons-react";
import { Badge } from "@work-holo/ui/components/badge";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@work-holo/ui/components/emoji-picker";
import { InputGroupButton } from "@work-holo/ui/components/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@work-holo/ui/components/popover";
import { Spinner } from "@work-holo/ui/components/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@work-holo/ui/components/tooltip";
import { cn } from "@/lib/utils";

interface ComposerActionsProps {
  hasAttachments: boolean;
  hasAudio: boolean;
  hasText: boolean;
  isCreatingMessage: boolean;
  isRecording: boolean;
  onEmojiSelect: (emoji: { emoji: string; label: string }) => void;
  onFileUpload: () => void;
  onSubmit: () => void;
  onVoiceRecord: () => void;
  recordingDuration?: number;
  text: string;
}

export function ComposerActions({
  isRecording,
  isCreatingMessage,
  text,
  hasText,
  hasAttachments,
  hasAudio,
  onEmojiSelect,
  onFileUpload,
  onVoiceRecord,
  onSubmit,
}: ComposerActionsProps) {
  const canSend = hasText || hasAttachments || hasAudio;
  const isAudioDisabled = hasText;
  const isTextDisabled = hasAudio;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <InputGroupButton
                aria-label={
                  isRecording ? "Stop recording" : "Start voice message"
                }
                className={cn(
                  "transition-all duration-200",
                  isRecording && "relative"
                )}
                disabled={isAudioDisabled}
                onClick={onVoiceRecord}
                size="icon-sm"
                title={
                  isAudioDisabled
                    ? "Clear text to record audio"
                    : isRecording
                      ? "Stop recording"
                      : "Start voice message"
                }
                variant="ghost"
              >
                <IconMicrophone
                  className={cn(
                    "size-4",
                    isAudioDisabled && "opacity-50",
                    isRecording && "text-red-500"
                  )}
                />
              </InputGroupButton>
            }
          />
          {isAudioDisabled && (
            <TooltipContent>
              <p>Clear text to record audio</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <PopoverTrigger
          render={
            <InputGroupButton
              className="transition-all duration-200"
              disabled={isTextDisabled}
              size="icon-sm"
              title="Add emoji (⌘+E)"
              variant="ghost"
            >
              <IconMoodSmile className={cn(isTextDisabled && "opacity-50")} />
            </InputGroupButton>
          }
        />
        <PopoverContent align="start" className="w-80 p-0" side="top">
          <EmojiPicker onEmojiSelect={onEmojiSelect}>
            <EmojiPickerSearch className="h-6" placeholder="Search emoji..." />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverContent>
      </Popover>

      <InputGroupButton
        className="transition-all duration-200"
        onClick={onFileUpload}
        size="icon-sm"
        title="Attach file (⌘+U)"
        variant="ghost"
      >
        <IconPaperclip className="size-4" />
      </InputGroupButton>

      <Badge
        className="ml-auto"
        variant={text.length > 5000 ? "destructive" : "secondary"}
      >
        {text.length}/5000
      </Badge>

      <InputGroupButton
        className={cn(
          "rounded-full transition-all duration-200",
          canSend && "scale-105 bg-primary hover:bg-primary/90"
        )}
        disabled={isCreatingMessage || !canSend}
        onClick={onSubmit}
        size="icon-sm"
        title="Send message (Shift+Enter)"
        variant={canSend ? "default" : "ghost"}
      >
        {isCreatingMessage ? <Spinner /> : <IconSend className="h-4 w-4" />}
      </InputGroupButton>
    </div>
  );
}
