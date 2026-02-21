import {
  IconBold,
  IconCode,
  IconEraser,
  IconItalic,
  IconList,
  IconListNumbers,
  IconMicrophone,
  IconMoodSmileBeam,
  IconPlus,
  IconPolaroid,
  IconSend,
  IconStrikethrough,
} from "@tabler/icons-react";
import { EditorContent } from "@tiptap/react";
import type { KeyboardEvent } from "react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { useMessageEditor } from "@/hooks/communications/use-message-editor";
import { cn } from "@/lib/utils";

import { AutoLinkPreview } from "./auto-link-preview";
import { LinkBubbleMenu } from "./link-bubble-menu";
import { LinkPreviewNode } from "./link-preview-node";
import { createMentionSuggestion } from "./mention-suggestion";

import "@/styles/tiptap.css";

/* ---------- Menu Item ---------- */

function Item({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm",
        "text-zinc-200 hover:bg-white/10",
        active && "bg-white/10"
      )}
    >
      <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      <span className="leading-none">{label}</span>
    </button>
  );
}

/* ---------- Main ---------- */

export function MessageEditor({
  content,
  onChange,
  onSubmit,
  disabled = false,
  onCursorChange,
  fetchUsers,
  isCreatingMessage = false,
  hasAttachments = false,
  hasAudio = false,
  onEmojiSelect,
  onVoiceRecord,
}: any) {
  const [plusOpen, setPlusOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const {
    editor,
    fileInputRef,
    handleImageUploadClick,
    handleFileInputChange,
  } = useMessageEditor({
    content,
    onChange,
    onSubmit,
    disabled,
    onCursorChange,
    fetchUsers,
    createMentionSuggestion,
    LinkPreviewNode,
    AutoLinkPreview,
  });

  const handleEditorKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        onSubmit();
      }
    },
    [onSubmit]
  );

  if (!editor) return null;

  return (
    <div className="mx-6 mb-6 rounded-2xl border border-white/10 bg-zinc-950/80 shadow-xl backdrop-blur-xl">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* ---------- EDITOR ---------- */}
      <div className="px-6 pt-4">
        <LinkBubbleMenu editor={editor} />
        <EditorContent
          editor={editor}
          onKeyDown={handleEditorKeyDown}
          className="
            min-h-[12px]
            max-h-15
            w-full
            overflow-y-auto
            bg-transparent
            text-sm
            text-zinc-100
            focus:outline-none
          "
          placeholder="Type a message..."
        />
      </div>

      {/* ---------- DIVIDER ---------- */}
      <div className="mx-6 mt-3 h-px bg-white/10" />

      {/* ---------- ACTION ROW ---------- */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-1">
          {/* PLUS MENU */}
          <Popover open={plusOpen} onOpenChange={setPlusOpen}>
            <PopoverTrigger asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                className="h-9 w-9 rounded-full text-zinc-400 hover:text-white"
              >
                <IconPlus className="h-5 w-5" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="start"
              className="w-48 rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-xl backdrop-blur"
            >
              <Item
                icon={<IconBold className="h-4 w-4" />}
                label="Bold"
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
              />
              <Item
                icon={<IconItalic className="h-4 w-4" />}
                label="Italic"
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              />
              <Item
                icon={<IconStrikethrough className="h-4 w-4" />}
                label="Strike"
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              />
              <Item
                icon={<IconCode className="h-4 w-4" />}
                label="Code"
                active={editor.isActive("code")}
                onClick={() => editor.chain().focus().toggleCode().run()}
              />
              <Item
                icon={<IconList className="h-4 w-4" />}
                label="Bullet List"
                active={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              />
              <Item
                icon={<IconListNumbers className="h-4 w-4" />}
                label="Numbered List"
                active={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              />
              <Item
                icon={<IconPolaroid className="h-4 w-4" />}
                label="Image / Video"
                onClick={handleImageUploadClick}
              />
              <Item
                icon={<IconEraser className="h-4 w-4" />}
                label="Clear"
                onClick={() => {
                  editor.chain().focus().clearContent().run();
                  onChange("");
                }}
              />
            </PopoverContent>
          </Popover>

          {/* EMOJI */}
          <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
            <PopoverTrigger asChild>
              <Button size="icon-sm" variant="ghost" className="h-4 w-4">
                <IconMoodSmileBeam />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="start"
              sideOffset={8}
              alignOffset={-4}
              className="w-68 rounded-xl p-0 shadow-lg overflow-hidden"
            >
              <EmojiPicker
                onEmojiSelect={(emoji) => {
                  editor.chain().focus().insertContent(emoji.emoji).run();
                  onEmojiSelect?.(emoji);
                  setEmojiOpen(false);
                }}
                className="p-0"
              >
                <EmojiPickerSearch className="h-9 px-2 text-sm border-b" />

                <EmojiPickerContent className="p-1 max-h-60" />

                <EmojiPickerFooter className="px-2 py-1 text-xs" />
              </EmojiPicker>
            </PopoverContent>
          </Popover>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant="ghost"
            className="h-9 w-9 rounded-full text-zinc-400 hover:text-white"
            disabled={content.trim().length > 0}
            onClick={onVoiceRecord}
          >
            <IconMicrophone className="h-5 w-5" />
          </Button>

          <Button
            className="h-9 rounded-full bg-violet-600 px-4 text-sm text-white hover:bg-violet-500"
            disabled={
              isCreatingMessage ||
              !(content.trim() || hasAttachments || hasAudio)
            }
            onClick={onSubmit}
          >
            {/* {isCreatingMessage ? <Spinner /> : <IconSend className="h-4 w-8" />} */}
            {isCreatingMessage ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <IconSend className="h-4 w-4 translate-y-[1px]" />
            )}
            <span>Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
