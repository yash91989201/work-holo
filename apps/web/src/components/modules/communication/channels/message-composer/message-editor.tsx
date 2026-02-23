import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconArrowRight,
  IconBold,
  IconCode,
  IconEraser,
  IconItalic,
  IconKeyboard,
  IconLink,
  IconList,
  IconListNumbers,
  IconMaximize,
  IconMicrophone,
  IconMinimize,
  IconMoodPlus,
  IconPaperclip,
  IconPhoto,
  IconSend,
  IconStrikethrough,
  IconX,
} from "@tabler/icons-react";
import { EditorContent } from "@tiptap/react";
import type { KeyboardEvent } from "react";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMessageEditor } from "@/hooks/communications/use-message-editor";
import { cn } from "@/lib/utils";
import { AutoLinkPreview } from "./auto-link-preview";
import { LinkBubbleMenu } from "./link-bubble-menu";
import { LinkPreviewNode } from "./link-preview-node";
import { createMentionSuggestion } from "./mention-suggestion";
import "tippy.js/dist/tippy.css";
import "@/styles/tiptap.css";

export type ComposerView = "editor" | "attachments" | "audio";

interface MessageEditorProps {
  attachmentPreview?: React.ReactNode;
  audioPreview?: React.ReactNode;
  composerView?: ComposerView;
  content: string;
  disabled?: boolean;
  fetchUsers: (query: string) => Promise<
    Array<{
      id: string;
      name: string | null;
      image: string | null;
      email: string;
    }>
  >;
  hasAttachments?: boolean;
  hasAudio?: boolean;
  isCreatingMessage?: boolean;
  isInMaximizedComposer?: boolean;
  isMaximized?: boolean;
  isRecording?: boolean;
  onChange: (content: string) => void;
  onComposerViewChange?: (view: ComposerView) => void;
  onCursorChange?: (position: number) => void;
  onEmojiSelect?: (emoji: { emoji: string; label: string }) => void;
  onFileUpload?: () => void;
  onMaximize?: () => void;
  onMinimize?: () => void;
  onSubmit: () => void;
  onVoiceRecord?: () => void;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Composer combines many conditional UI states in one orchestrating component.
export function MessageEditor({
  attachmentPreview,
  audioPreview,
  composerView = "editor",
  content,
  onChange,
  onSubmit,
  disabled = false,
  onCursorChange,
  fetchUsers,
  onMaximize,
  onMinimize,
  isMaximized = false,
  isInMaximizedComposer = false,
  isRecording = false,
  isCreatingMessage = false,
  hasAttachments = false,
  hasAudio = false,
  onComposerViewChange,
  onEmojiSelect,
  onFileUpload,
  onVoiceRecord,
}: MessageEditorProps) {
  const {
    editor,
    fileInputRef,
    isLinkPopoverOpen,
    setIsLinkPopoverOpen,
    linkUrl,
    setLinkUrl,
    handleImageUploadClick,
    handleFileInputChange,
    handleAddLink,
    handleSaveLink,
  } = useMessageEditor({
    content,
    onChange,
    onSubmit,
    disabled,
    onCursorChange,
    fetchUsers,
    isMaximized,
    isInMaximizedComposer,
    createMentionSuggestion,
    LinkPreviewNode,
    AutoLinkPreview,
  });

  const handleEditorKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      const isModifierPressed = event.ctrlKey || event.metaKey;
      const isMaximizeShortcut =
        isModifierPressed && event.key.toLowerCase() === "m";

      if (!isMaximizeShortcut) return;

      event.preventDefault();
      event.stopPropagation();

      if (!(isMaximized || isInMaximizedComposer)) {
        onMaximize?.();
        return;
      }

      if (isMaximized && isInMaximizedComposer) {
        onMinimize?.();
      }
    },
    [disabled, isInMaximizedComposer, isMaximized, onMaximize, onMinimize]
  );

  let voiceRecordTitle = "Start voice message";

  if (isRecording) {
    voiceRecordTitle = "Stop recording";
  }

  if (content.trim().length > 0) {
    voiceRecordTitle = "Clear text to record audio";
  }

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col overflow-x-hidden",
        isMaximized ? "flex-1 overflow-y-hidden" : ""
      )}
    >
      <input
        accept="image/*"
        className="hidden"
        multiple
        onChange={handleFileInputChange}
        ref={fileInputRef}
        type="file"
      />

      <div
        className={cn(
          "overflow-hidden rounded-lg border transition-colors",
          "focus-within:border-primary",
          isMaximized && "mx-0 flex flex-1 flex-col rounded-none border-0"
        )}
      >
        {composerView === "editor" && (
          <div
            className={cn(
              "relative min-w-0 overflow-x-hidden",
              isMaximized && "flex-1 overflow-y-auto"
            )}
          >
            <LinkBubbleMenu editor={editor} />
            <div className="p-3">
              <EditorContent
                className={cn("min-w-0", disabled && "opacity-50")}
                editor={editor}
                onKeyDown={handleEditorKeyDown}
              />
            </div>

            <div className="pointer-events-none absolute right-4 bottom-3">
              <Badge
                variant={content.length > 5000 ? "destructive" : "secondary"}
              >
                {content.length}/5000
              </Badge>
            </div>
          </div>
        )}

        {composerView === "attachments" && attachmentPreview && (
          <div
            className={cn(
              "relative min-w-0 overflow-x-hidden",
              isMaximized && "flex-1 overflow-y-auto"
            )}
          >
            {attachmentPreview}
          </div>
        )}

        {composerView === "audio" && audioPreview && (
          <div
            className={cn(
              "relative min-w-0 overflow-x-hidden",
              isMaximized && "flex-1 overflow-y-auto"
            )}
          >
            {audioPreview}
          </div>
        )}

        {/* Actions Bar at Bottom */}
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t bg-muted/30 px-3 py-1.5">
          {/* History Group - First */}
          <ButtonGroup>
            <Button
              aria-label="Undo"
              disabled={!editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
              size="icon-sm"
              title="Undo (Ctrl+Z)"
              variant="ghost"
            >
              <IconArrowBackUp />
            </Button>
            <Button
              aria-label="Redo"
              disabled={!editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
              size="icon-sm"
              title="Redo (Ctrl+Y)"
              variant="ghost"
            >
              <IconArrowForwardUp />
            </Button>
            <Button
              aria-label="Clear content"
              onClick={() => {
                editor.chain().focus().clearContent(true).run();
                onChange("");
              }}
              size="icon-sm"
              title="Clear Content"
              variant="ghost"
            >
              <IconEraser />
            </Button>
          </ButtonGroup>

          <Separator orientation="vertical" />

          {/* Formatting Group */}
          <ToggleGroup size="sm" spacing={0} type="multiple" variant="default">
            <ToggleGroupItem
              aria-label="Toggle bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold (Ctrl+B)"
              value="bold"
            >
              <IconBold />
            </ToggleGroupItem>
            <ToggleGroupItem
              aria-label="Toggle italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic (Ctrl+I)"
              value="italic"
            >
              <IconItalic />
            </ToggleGroupItem>
            <ToggleGroupItem
              aria-label="Toggle strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough (Ctrl+Shift+S)"
              value="strike"
            >
              <IconStrikethrough />
            </ToggleGroupItem>
            <ToggleGroupItem
              aria-label="Toggle code"
              onClick={() => editor.chain().focus().toggleCode().run()}
              title="Inline Code (Ctrl+E)"
              value="code"
            >
              <IconCode />
            </ToggleGroupItem>
          </ToggleGroup>

          <Separator orientation="vertical" />

          {/* Lists Group */}
          <ToggleGroup size="sm" spacing={0} type="multiple" variant="default">
            <ToggleGroupItem
              aria-label="Toggle bullet list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet List (Ctrl+Shift+8)"
              value="bulletList"
            >
              <IconList />
            </ToggleGroupItem>
            <ToggleGroupItem
              aria-label="Toggle ordered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Ordered List (Ctrl+Shift+7)"
              value="orderedList"
            >
              <IconListNumbers />
            </ToggleGroupItem>
          </ToggleGroup>

          <Separator orientation="vertical" />

          {/* Insert Group */}
          <ButtonGroup>
            <Popover
              onOpenChange={setIsLinkPopoverOpen}
              open={isLinkPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  aria-label="Add a link"
                  onClick={handleAddLink}
                  size="icon-sm"
                  title="Insert Link (Ctrl+K)"
                  variant="ghost"
                >
                  <IconLink />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 p-2">
                <InputGroup>
                  <InputGroupInput
                    autoFocus
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveLink();
                      }
                      if (e.key === "Escape") {
                        setLinkUrl("");
                        setIsLinkPopoverOpen(false);
                      }
                    }}
                    placeholder="https://example.com"
                    type="url"
                    value={linkUrl}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() => {
                        setLinkUrl("");
                        setIsLinkPopoverOpen(false);
                      }}
                      size="icon-xs"
                      title="Cancel"
                      type="button"
                      variant="default"
                    >
                      <IconX />
                    </InputGroupButton>
                    <InputGroupButton
                      onClick={handleSaveLink}
                      size="icon-xs"
                      title="Insert Link"
                      type="button"
                      variant="default"
                    >
                      <IconArrowRight />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </PopoverContent>
            </Popover>
            <Button
              aria-label="Upload image"
              onClick={handleImageUploadClick}
              size="icon-sm"
              title="Upload Image"
              variant="ghost"
            >
              <IconPhoto />
            </Button>
          </ButtonGroup>

          <Separator orientation="vertical" />

          {/* Communication Actions + Actions Group - Merged and Right Aligned */}
          <div className="ml-auto flex items-center gap-3">
            <ButtonGroup>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      aria-label={
                        isRecording ? "Stop recording" : "Start voice message"
                      }
                      className={cn(
                        "transition-all duration-200",
                        isRecording && "relative"
                      )}
                      disabled={!onVoiceRecord || content.trim().length > 0}
                      onClick={onVoiceRecord}
                      size="icon-sm"
                      title={voiceRecordTitle}
                      variant="ghost"
                    >
                      <IconMicrophone
                        className={cn(
                          content.trim().length > 0 && "opacity-50",
                          isRecording && "text-red-500"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  {content.trim().length > 0 && (
                    <TooltipContent>
                      <p>Clear text to record audio</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="transition-all duration-200"
                    disabled={!onEmojiSelect || hasAudio}
                    size="icon-sm"
                    title="Add emoji"
                    variant="ghost"
                  >
                    <IconMoodPlus className={cn(hasAudio && "opacity-50")} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" side="top">
                  <EmojiPicker
                    onEmojiSelect={onEmojiSelect ?? (() => undefined)}
                  >
                    <EmojiPickerSearch placeholder="Search emoji..." />
                    <EmojiPickerContent className="max-h-70 overflow-y-auto" />
                    <EmojiPickerFooter />
                  </EmojiPicker>
                </PopoverContent>
              </Popover>
              {composerView !== "editor" && onComposerViewChange && (
                <Button
                  aria-label="Back to text editor"
                  className="transition-all duration-200"
                  onClick={() => onComposerViewChange("editor")}
                  size="icon-sm"
                  title="Back to text editor"
                  variant="ghost"
                >
                  <IconKeyboard className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                className="transition-all duration-200"
                onClick={onFileUpload}
                size="icon-sm"
                title="Attach file"
                variant="ghost"
              >
                <IconPaperclip className="h-3.5 w-3.5" />
              </Button>
              <Button
                aria-label={isMaximized ? "Minimize editor" : "Maximize editor"}
                onClick={() => {
                  if (isMaximized) {
                    onMinimize?.();
                  } else {
                    onMaximize?.();
                  }
                }}
                size="icon-sm"
                title={
                  isMaximized
                    ? "Minimize Editor (Ctrl+M)"
                    : "Maximize Editor (Ctrl+M)"
                }
                variant="ghost"
              >
                {isMaximized ? (
                  <IconMinimize className="h-3.5 w-3.5" />
                ) : (
                  <IconMaximize className="h-3.5 w-3.5" />
                )}
              </Button>
            </ButtonGroup>
            <Button
              className={cn(
                "ml-2 rounded-full transition-all duration-200",
                (content.trim().length > 0 || hasAttachments || hasAudio) &&
                  "scale-105 bg-primary hover:bg-primary/90"
              )}
              disabled={
                isCreatingMessage ||
                content.length > 5000 ||
                !(content.trim().length > 0 || hasAttachments || hasAudio)
              }
              onClick={onSubmit}
              size="icon-sm"
              title="Send message (Enter)"
              variant={
                content.trim().length > 0 || hasAttachments || hasAudio
                  ? "default"
                  : "ghost"
              }
            >
              {isCreatingMessage ? (
                <Spinner />
              ) : (
                <IconSend className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
