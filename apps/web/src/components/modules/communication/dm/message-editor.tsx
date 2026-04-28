import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBold,
  IconCode,
  IconEraser,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconMarkdown,
  IconMaximize,
  IconMicrophone,
  IconMoodPlus,
  IconPaperclip,
  IconPhoto,
  IconSend,
  IconStrikethrough,
} from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";
import { ButtonGroup } from "@work-holo/ui/components/button-group";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@work-holo/ui/components/emoji-picker";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@work-holo/ui/components/popover";
import { Separator } from "@work-holo/ui/components/separator";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@work-holo/ui/components/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@work-holo/ui/components/tooltip";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type FocusHandler = (() => void) | null;

interface DmMessageEditorProps {
  attachmentPreview?: React.ReactNode;
  audioPreview?: React.ReactNode;
  composerView: "editor" | "attachments" | "audio";
  content: string;
  disabled?: boolean;
  hasAttachments: boolean;
  hasAudio: boolean;
  isCreatingMessage: boolean;
  isMaximized: boolean;
  isRecording: boolean;
  onChange: (content: string) => void;
  onComposerViewChange: (view: "editor" | "attachments" | "audio") => void;
  onEmojiSelect: (emoji: { emoji: string; label: string }) => void;
  onFileUpload: () => void;
  onFocusHandlerChange?: (handler: FocusHandler) => void;
  onMaximize: () => void;
  onSubmit: () => void;
  onVoiceRecord: () => void;
  placeholder?: string;
}

export function DmMessageEditor({
  attachmentPreview,
  audioPreview,
  composerView,
  content,
  disabled,
  hasAttachments,
  hasAudio,
  isCreatingMessage,
  isMaximized,
  isRecording,
  onChange,
  onComposerViewChange,
  onEmojiSelect,
  onFileUpload,
  onFocusHandlerChange,
  onMaximize,
  onSubmit,
  onVoiceRecord,
  placeholder = "Type a message...",
}: DmMessageEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFormattingBarOpen, setIsFormattingBarOpen] = useState(false);
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  });

  useEffect(() => {
    if (!onFocusHandlerChange) return;

    onFocusHandlerChange(() => {
      const textarea = textareaRef.current;
      if (!textarea || disabled) return;

      textarea.focus();
      const end = textarea.value.length;
      textarea.setSelectionRange(end, end);
    });

    return () => onFocusHandlerChange(null);
  }, [disabled, onFocusHandlerChange]);

  const handleChange = (newContent: string) => {
    onChange(newContent);
    // Add to history for undo/redo
    if (newContent !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const insertMarkdown = (before: string, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    handleChange(newText);

    // Restore focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toggleBold = () => insertMarkdown("**", "**");
  const toggleItalic = () => insertMarkdown("*", "*");
  const toggleStrike = () => insertMarkdown("~~", "~~");
  const toggleCode = () => insertMarkdown("`", "`");
  const toggleBulletList = () => insertMarkdown("- ");
  const toggleOrderedList = () => insertMarkdown("1. ");

  const handleAddLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (selectedText) {
      // If text is selected, wrap it as link text
      const newText =
        content.substring(0, start) +
        `[${selectedText}]()` +
        content.substring(end);
      handleChange(newText);
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + selectedText.length + 3;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      setIsLinkPopoverOpen(true);
    }
  };

  const handleSaveLink = () => {
    if (!linkUrl) {
      setIsLinkPopoverOpen(false);
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || linkUrl;

    const newText =
      content.substring(0, start) +
      `[${selectedText}](${linkUrl})` +
      content.substring(end);

    handleChange(newText);
    setLinkUrl("");
    setIsLinkPopoverOpen(false);

    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onChange(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onChange(history[historyIndex + 1]);
    }
  };

  const handleClear = () => {
    onChange("");
    const newHistory = [...history, ""];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  let voiceRecordTitle = "Start voice message";
  if (isRecording) {
    voiceRecordTitle = "Stop recording";
  }
  if (content.trim().length > 0) {
    voiceRecordTitle = "Clear text to record audio";
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
          "overflow-hidden rounded-3xl border transition-colors",
          "focus-within:border-primary",
          isMaximized && "mx-0 flex flex-1 flex-col rounded-none border-0"
        )}
      >
        {/* Top Formatting Bar */}
        {isFormattingBarOpen && (
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-b bg-muted/20 px-2 py-1">
            {/* Formatting Group */}
            <ToggleGroup variant="default">
              <ToggleGroupItem
                aria-label="Toggle bold"
                onClick={toggleBold}
                title="Bold (Ctrl+B)"
                value="bold"
              >
                <IconBold />
              </ToggleGroupItem>
              <ToggleGroupItem
                aria-label="Toggle italic"
                onClick={toggleItalic}
                title="Italic (Ctrl+I)"
                value="italic"
              >
                <IconItalic />
              </ToggleGroupItem>
              <ToggleGroupItem
                aria-label="Toggle strikethrough"
                onClick={toggleStrike}
                title="Strikethrough"
                value="strike"
              >
                <IconStrikethrough />
              </ToggleGroupItem>
              <ToggleGroupItem
                aria-label="Toggle code"
                onClick={toggleCode}
                title="Inline Code"
                value="code"
              >
                <IconCode />
              </ToggleGroupItem>
            </ToggleGroup>

            <Separator orientation="vertical" />

            {/* Lists Group */}
            <ToggleGroup variant="default">
              <ToggleGroupItem
                aria-label="Toggle bullet list"
                onClick={toggleBulletList}
                title="Bullet List"
                value="bulletList"
              >
                <IconList />
              </ToggleGroupItem>
              <ToggleGroupItem
                aria-label="Toggle ordered list"
                onClick={toggleOrderedList}
                title="Ordered List"
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
                <PopoverTrigger
                  render={
                    <Button
                      aria-label="Add a link"
                      onClick={handleAddLink}
                      size="icon"
                      title="Insert Link"
                      variant="ghost"
                    >
                      <IconLink />
                    </Button>
                  }
                />
                <PopoverContent
                  align="start"
                  className="w-96 p-0"
                  sideOffset={14}
                >
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
                        <IconEraser className="h-3 w-3" />
                      </InputGroupButton>
                      <InputGroupButton
                        onClick={handleSaveLink}
                        size="icon-xs"
                        title="Insert Link"
                        type="button"
                        variant="default"
                      >
                        <IconLink className="h-3 w-3" />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </PopoverContent>
              </Popover>
              <Button
                aria-label="Upload image"
                onClick={handleImageUploadClick}
                size="icon"
                title="Upload Image"
                variant="ghost"
              >
                <IconPhoto />
              </Button>
            </ButtonGroup>
          </div>
        )}

        {composerView === "editor" && (
          <div
            className={cn(
              "relative min-w-0 overflow-x-hidden",
              isMaximized && "flex-1 overflow-y-auto"
            )}
          >
            <div className="p-3">
              <textarea
                className={cn(
                  "min-h-20 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground",
                  disabled && "opacity-50"
                )}
                disabled={disabled}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                ref={textareaRef}
                rows={1}
                value={content}
              />
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

        {/* Bottom Actions Bar */}
        <div className="flex shrink-0 items-center justify-between gap-1 border-t bg-muted/30 p-1.5">
          {/* Left: Markdown toggle + actions */}
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label="Toggle formatting toolbar"
                      onClick={() => setIsFormattingBarOpen((v) => !v)}
                      size="sm"
                      variant={isFormattingBarOpen ? "default" : "ghost"}
                    >
                      <IconMarkdown />
                    </Button>
                  }
                />
                <TooltipContent>
                  <p>
                    {isFormattingBarOpen ? "Hide" : "Show"} formatting toolbar
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" />
            <ButtonGroup>
              <Button
                aria-label="Undo"
                disabled={!canUndo}
                onClick={handleUndo}
                size="icon"
                title="Undo (Ctrl+Z)"
                variant="ghost"
              >
                <IconArrowBackUp />
              </Button>
              <Button
                aria-label="Redo"
                disabled={!canRedo}
                onClick={handleRedo}
                size="icon"
                title="Redo (Ctrl+Y)"
                variant="ghost"
              >
                <IconArrowForwardUp />
              </Button>
              <Button
                aria-label="Clear content"
                onClick={handleClear}
                size="icon"
                title="Clear Content"
                variant="ghost"
              >
                <IconEraser />
              </Button>
            </ButtonGroup>
            <Separator orientation="vertical" />

            <ButtonGroup>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
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
                        size="icon"
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
                    }
                  />
                  {content.trim().length > 0 && (
                    <TooltipContent>
                      <p>Clear text to record audio</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      className="transition-all duration-200"
                      disabled={!onEmojiSelect || hasAudio}
                      size="icon"
                      title="Add emoji"
                      variant="ghost"
                    >
                      <IconMoodPlus className={cn(hasAudio && "opacity-50")} />
                    </Button>
                  }
                />
                <PopoverContent align="end" side="top">
                  <EmojiPicker onEmojiSelect={onEmojiSelect}>
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
                  size="icon"
                  title="Back to text editor"
                  variant="ghost"
                >
                  <IconMarkdown className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                className="transition-all duration-200"
                onClick={onFileUpload}
                size="icon"
                title="Attach file"
                variant="ghost"
              >
                <IconPaperclip className="h-3.5 w-3.5" />
              </Button>
            </ButtonGroup>
            <Separator orientation="vertical" />
            <Button
              aria-label={isMaximized ? "Minimize editor" : "Maximize editor"}
              onClick={onMaximize}
              size="icon"
              title={isMaximized ? "Minimize Editor" : "Maximize Editor"}
              variant="ghost"
            >
              <IconMaximize className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Right: Send button */}
          <Button
            className={cn(
              "gap-1.5 rounded-full px-4 transition-all duration-200",
              (content.trim().length > 0 || hasAttachments || hasAudio) &&
                "scale-105 bg-primary hover:bg-primary/90"
            )}
            disabled={
              isCreatingMessage ||
              content.length > 5000 ||
              !(content.trim().length > 0 || hasAttachments || hasAudio)
            }
            onClick={onSubmit}
            size="sm"
            title="Send message (Enter)"
            variant={
              content.trim().length > 0 || hasAttachments || hasAudio
                ? "default"
                : "ghost"
            }
          >
            <IconSend className="h-3.5 w-3.5" />
            <span>Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
