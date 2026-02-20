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

/* ---------------- HELPERS ---------------- */

function Item({
  icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
        "hover:bg-muted",
        active && "bg-muted",
        disabled && "cursor-not-allowed opacity-50"
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="h-4 w-4">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* ---------------- MAIN ---------------- */

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
      if (disabled) return;
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        onSubmit();
      }
    },
    [disabled, onSubmit]
  );

  if (!editor) return null;

  return (
    <div className="mx-2 mb-5 flex items-center gap-1 rounded-full border bg-background p-2">
      {/* FILE INPUT */}
      <input
        className="hidden"
        multiple
        onChange={handleFileInputChange}
        ref={fileInputRef}
        type="file"
      />

      {/* PLUS MENU */}
      <Popover onOpenChange={setPlusOpen} open={plusOpen}>
        <PopoverTrigger asChild>
          <Button className="h-8 w-8" size="icon-sm" variant="ghost">
            <IconPlus />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-44 p-1" side="top">
          <Item
            active={editor.isActive("bold")}
            icon={<IconBold />}
            label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <Item
            active={editor.isActive("italic")}
            icon={<IconItalic />}
            label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <Item
            active={editor.isActive("strike")}
            icon={<IconStrikethrough />}
            label="Strike"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
          <Item
            active={editor.isActive("code")}
            icon={<IconCode />}
            label="Code"
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
          <Item
            icon={<IconPolaroid />}
            label="Image / Video"
            onClick={handleImageUploadClick}
          />
          <Item
            active={editor.isActive("bulletList")}
            icon={<IconList />}
            label="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />

          <Item
            active={editor.isActive("orderedList")}
            icon={<IconListNumbers />}
            label="Numbered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />

          <Item
            icon={<IconEraser />}
            label="Clear"
            onClick={() => {
              editor.chain().focus().clearContent().run();
              onChange("");
            }}
          />
        </PopoverContent>
      </Popover>

      {/* EMOJI */}
      <Popover onOpenChange={setEmojiOpen} open={emojiOpen}>
        <PopoverTrigger asChild>
          <Button className="h-8 w-8" size="icon-sm" variant="ghost">
            <IconMoodSmileBeam />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-80 p-0" side="top">
          <EmojiPicker
            onEmojiSelect={(emoji) => {
              editor.chain().focus().insertContent(emoji.emoji).run();
              onEmojiSelect?.(emoji);
              setEmojiOpen(false);
            }}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverContent>
      </Popover>

      {/* EDITOR */}
      <div className="flex-1 overflow-hidden">
        <LinkBubbleMenu editor={editor} />
        <EditorContent
          className="h-10 overflow-y-auto px-2 text-sm leading-10"
          editor={editor}
          onKeyDown={handleEditorKeyDown}
        />
      </div>

      {/* MIC / SEND */}
      <Button
        disabled={content.trim().length > 0}
        onClick={onVoiceRecord}
        size="icon-sm"
        variant="ghost"
      >
        <IconMicrophone />
      </Button>

      <Button
        disabled={
          isCreatingMessage || !(content.trim() || hasAttachments || hasAudio)
        }
        onClick={onSubmit}
        size="icon-sm"
        variant="ghost"
      >
        {isCreatingMessage ? <Spinner /> : <IconSend />}
      </Button>
    </div>
  );
}
