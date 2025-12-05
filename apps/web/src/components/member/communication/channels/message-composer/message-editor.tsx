import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Dropcursor } from "@tiptap/extensions";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowRight,
  Bold,
  Code,
  Eraser,
  Image as ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Maximize,
  Mic,
  Minimize2,
  Paperclip,
  Redo,
  Send,
  SmilePlus,
  Strikethrough,
  Undo,
  X,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { AutoLinkPreview } from "./auto-link-preview";
import { LinkBubbleMenu } from "./link-bubble-menu";
import { LinkPreviewNode } from "./link-preview-node";
import { createMentionSuggestion } from "./mention-suggestion";
import "tippy.js/dist/tippy.css";
import "@/styles/tiptap.css";
import z from "zod";
import { Badge } from "@/components/ui/badge";
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
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";

const URL_REGEX = /^[a-zA-Z]+:\/\//;

interface MessageEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  onCursorChange?: (position: number) => void;
  fetchUsers: (
    query: string
  ) => Promise<Array<{ id: string; name: string; email: string }>>;
  onMaximize?: () => void;
  onMinimize?: () => void;
  isMaximized?: boolean;
  isInMaximizedComposer?: boolean;
  // New props for integrated actions
  isRecording?: boolean;
  isCreatingMessage?: boolean;
  hasAttachments?: boolean;
  hasAudio?: boolean;
  onEmojiSelect?: (emoji: { emoji: string; label: string }) => void;
  onFileUpload?: () => void;
  onVoiceRecord?: () => void;
}

export function MessageEditor({
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
  onEmojiSelect,
  onFileUpload,
  onVoiceRecord,
}: MessageEditorProps) {
  const uploadImageToSupabase = useCallback(
    async (file: File): Promise<string> => {
      const bucket = "message-image";

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(file.name, file);

      if (error || !data) throw new Error("Upload failed");

      // Get public URL
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicData.publicUrl;
    },
    []
  );

  const editorRef = useRef<Editor | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkToggleRef = useRef<HTMLButtonElement>(null);
  const handleImageUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const handleFileInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        try {
          const url = await uploadImageToSupabase(file);
          if (url) {
            editorRef.current
              ?.chain()
              .focus()
              .setImage({ src: url, height: 240, width: 240 })
              .run();
          }
        } catch (error) {
          console.error("Image upload failed", error);
        }
      }
      e.currentTarget.value = "";
    },
    [uploadImageToSupabase]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Type a message...",
        showOnlyWhenEditable: true,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: createMentionSuggestion(fetchUsers),
      }),
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
        protocols: ["http", "https", "mailto", "tel"],
        HTMLAttributes: {
          class: "tiptap-link",
          rel: "noopener noreferrer",
          target: "_blank",
        },
        shouldAutoLink: (url) => {
          const checkUrl = z.url().safeParse(url);
          return checkUrl.success;
        },
      }),
      Image.configure({
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
        },
      }),
      LinkPreviewNode,
      AutoLinkPreview,
      Dropcursor,
    ],
    content,
    editable: !disabled,
    autofocus: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from } = editor.state.selection;
      onCursorChange?.(from);
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none break-words focus:outline-none",
          isMaximized && isInMaximizedComposer
            ? "min-h-[56vh] overflow-y-auto sm:min-h-[64vh]"
            : "max-h-36 min-h-32 overflow-y-auto"
        ),
      },
      handleKeyDown: (_, event) => {
        // Enter sends message, Shift+Enter creates new line
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onSubmit();
          return true;
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((i) => i.type.startsWith("image/"));
        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) {
            uploadImageToSupabase(file)
              .then((url) => {
                if (url) {
                  editorRef.current
                    ?.chain()
                    .focus()
                    .setImage({ src: url })
                    .run();
                }
              })
              .catch((e) => {
                console.error("Image upload failed", e);
              });
          }
          return true;
        }
        return false;
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));
        if (imageFiles.length > 0) {
          event.preventDefault();
          for (const file of imageFiles) {
            uploadImageToSupabase(file)
              .then((url) => {
                if (url) {
                  editorRef.current
                    ?.chain()
                    .focus()
                    .setImage({ src: url })
                    .run();
                }
              })
              .catch(() => {
                console.error("Image upload failed");
              });
          }
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();
    if (content !== currentContent && content !== editor.getText()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  // Auto-scroll to keep cursor visible when typing
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      // Get the DOM element of the editor
      const editorElement = editor.view.dom;
      const { selection } = editor.state;
      const { from } = selection;

      // Get the coordinates of the cursor
      const coords = editor.view.coordsAtPos(from);
      const editorRect = editorElement.getBoundingClientRect();

      // Check if cursor is below the visible area
      if (coords.bottom > editorRect.bottom) {
        // Scroll to keep cursor visible
        editorElement.scrollTop += coords.bottom - editorRect.bottom + 20;
      }
      // Check if cursor is above the visible area
      else if (coords.top < editorRect.top) {
        editorElement.scrollTop -= editorRect.top - coords.top + 20;
      }
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const handleAddLink = useCallback(() => {
    setIsLinkPopoverOpen(true);
  }, []);

  const handleSaveLink = useCallback(() => {
    if (linkUrl) {
      // Ensure URL has protocol
      let url = linkUrl;
      if (!url.match(URL_REGEX)) {
        url = `https://${url}`;
      }

      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, " ");

      if (text) {
        // Text is selected, apply link to selection (keep the text)
        editor.chain().focus().setLink({ href: url }).run();
      } else {
        // No text selected, insert the URL as both text and link
        editor
          .chain()
          .focus()
          .insertContent({
            type: "text",
            marks: [{ type: "link", attrs: { href: url } }],
            text: url,
          })
          .run();
      }

      // Note: Preview will be auto-inserted by AutoLinkPreview extension

      setLinkUrl("");
      setIsLinkPopoverOpen(false);
    }
  }, [editor, linkUrl]);

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
          "mx-3 overflow-hidden rounded-lg border transition-colors",
          "focus-within:border-primary",
          isMaximized && "mx-0 flex flex-1 flex-col rounded-none border-0"
        )}
      >
        {/* Editor Content */}
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

          {/* Content Length Badge - Bottom Right */}
          <div className="pointer-events-none absolute right-4 bottom-3">
            <Badge
              variant={content.length > 5000 ? "destructive" : "secondary"}
            >
              {content.length}/5000
            </Badge>
          </div>
        </div>

        {/* Actions Bar at Bottom */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-t bg-muted/30 px-3 py-1.5">
          {/* Formatting Group */}
          <div className="flex items-center gap-0.5">
            <Toggle
              aria-label="Toggle bold"
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              pressed={editor.isActive("bold")}
              size="sm"
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-3.5 w-3.5" />
            </Toggle>

            <Toggle
              aria-label="Toggle italic"
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
              pressed={editor.isActive("italic")}
              size="sm"
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-3.5 w-3.5" />
            </Toggle>

            <Toggle
              aria-label="Toggle strikethrough"
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
              pressed={editor.isActive("strike")}
              size="sm"
              title="Strikethrough (Ctrl+Shift+S)"
            >
              <Strikethrough className="h-3.5 w-3.5" />
            </Toggle>

            <Toggle
              aria-label="Toggle code"
              onPressedChange={() => editor.chain().focus().toggleCode().run()}
              pressed={editor.isActive("code")}
              size="sm"
              title="Inline Code (Ctrl+E)"
            >
              <Code className="h-3.5 w-3.5" />
            </Toggle>
          </div>

          <Separator className="h-4" orientation="vertical" />

          {/* Lists Group */}
          <div className="flex items-center gap-0.5">
            <Toggle
              aria-label="Toggle bullet list"
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
              pressed={editor.isActive("bulletList")}
              size="sm"
              title="Bullet List (Ctrl+Shift+8)"
            >
              <List className="h-3.5 w-3.5" />
            </Toggle>

            <Toggle
              aria-label="Toggle ordered list"
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
              pressed={editor.isActive("orderedList")}
              size="sm"
              title="Ordered List (Ctrl+Shift+7)"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </Toggle>
          </div>

          <Separator className="h-4" orientation="vertical" />

          {/* History Group */}
          <div className="flex items-center gap-0.5">
            <Toggle
              aria-label="Undo"
              disabled={!editor.can().undo()}
              onPressedChange={() => editor.chain().focus().undo().run()}
              pressed={false}
              size="sm"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-3.5 w-3.5" />
            </Toggle>

            <Toggle
              aria-label="Redo"
              disabled={!editor.can().redo()}
              onPressedChange={() => editor.chain().focus().redo().run()}
              pressed={false}
              size="sm"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="h-3.5 w-3.5" />
            </Toggle>
            <Toggle
              aria-label="Clear content"
              onClick={() => {
                editor.chain().focus().clearContent(true).run();
                onChange("");
              }}
              size="sm"
              title="Clear Content"
            >
              <Eraser className="h-3.5 w-3.5" />
            </Toggle>
          </div>

          <Separator className="h-4" orientation="vertical" />

          {/* Insert Group */}
          <div className="flex items-center gap-0.5">
            <Popover
              onOpenChange={setIsLinkPopoverOpen}
              open={isLinkPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Toggle
                  aria-label="Add a link"
                  onPressedChange={handleAddLink}
                  pressed={editor.isActive("link") || isLinkPopoverOpen}
                  ref={linkToggleRef}
                  size="sm"
                  title="Insert Link (Ctrl+K)"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </Toggle>
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
                      variant="ghost"
                    >
                      <X className="h-3.5 w-3.5" />
                    </InputGroupButton>
                    <InputGroupButton
                      onClick={handleSaveLink}
                      size="icon-xs"
                      title="Insert Link"
                      type="button"
                      variant="ghost"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </PopoverContent>
            </Popover>

            <Toggle
              aria-label="Upload image"
              onPressedChange={handleImageUploadClick}
              pressed={false}
              size="sm"
              title="Upload Image"
            >
              <ImageIcon className="h-3.5 w-3.5" />
            </Toggle>
          </div>

          <Separator className="h-4" orientation="vertical" />

          {/* Communication Actions Group */}
          <div className="flex items-center gap-0.5">
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
                    title={
                      content.trim().length > 0
                        ? "Clear text to record audio"
                        : isRecording
                          ? "Stop recording"
                          : "Start voice message"
                    }
                    variant="ghost"
                  >
                    <Mic
                      className={cn(
                        "h-3.5 w-3.5",
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
                  <SmilePlus
                    className={cn("h-3.5 w-3.5", hasAudio && "opacity-50")}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 p-0" side="top">
                <EmojiPicker onEmojiSelect={onEmojiSelect || (() => {})}>
                  <EmojiPickerSearch
                    className="h-16"
                    placeholder="Search emoji..."
                  />
                  <EmojiPickerContent />
                  <EmojiPickerFooter />
                </EmojiPicker>
              </PopoverContent>
            </Popover>

            <Button
              className="transition-all duration-200"
              onClick={onFileUpload}
              size="icon-sm"
              title="Attach file"
              variant="ghost"
            >
              <Paperclip className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Separator className="h-4" orientation="vertical" />

          {/* Actions Group - Right Aligned */}
          <div className="ml-auto flex items-center gap-3">
            <Toggle
              aria-label={isMaximized ? "Minimize editor" : "Maximize editor"}
              onPressedChange={() => {
                if (isMaximized) {
                  onMinimize?.();
                } else {
                  onMaximize?.();
                }
              }}
              pressed={isMaximized}
              size="sm"
              title={
                isMaximized
                  ? "Minimize Editor (Ctrl+M)"
                  : "Maximize Editor (Ctrl+M)"
              }
            >
              {isMaximized ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize className="h-3.5 w-3.5" />
              )}
            </Toggle>

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
                <Send className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
