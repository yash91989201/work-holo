import { EditorContent } from "@tiptap/react";
import {
  IconBold,
  IconCode,
  IconEraser,
  IconPolaroid,
  IconItalic,
  IconList,
  IconListNumbers,
  IconMicrophone,
  IconPlus,
  IconSend,
  IconMoodSmileBeam,
  IconStrikethrough,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useMessageEditor } from "@/hooks/communications/use-message-editor";
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
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
        "hover:bg-muted",
        active && "bg-muted",
        disabled && "opacity-50 cursor-not-allowed"
      )}
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
    <div className="mx-2 mb-5 rounded-full border bg-background p-2 flex items-center gap-1">
      {/* FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* PLUS MENU */}
      <Popover open={plusOpen} onOpenChange={setPlusOpen}>
        <PopoverTrigger asChild>
          <Button size="icon-sm" variant="ghost" className="h-8 w-8">
            <IconPlus />
          </Button>
        </PopoverTrigger>

        <PopoverContent side="top" align="start" className="w-44 p-1">
          <Item
            icon={<IconBold />}
            label="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <Item
            icon={<IconItalic />}
            label="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <Item
            icon={<IconStrikethrough />}
            label="Strike"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
          <Item
            icon={<IconCode />}
            label="Code"
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
          <Item
            icon={<IconPolaroid />}
            label="Image / Video"
            onClick={handleImageUploadClick}
          />
          <Item
            icon={<IconList />}
            label="Bullet List"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />

          <Item
            icon={<IconListNumbers />}
            label="Numbered List"
            active={editor.isActive("orderedList")}
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
      <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
        <PopoverTrigger asChild>
          <Button size="icon-sm" variant="ghost" className="h-8 w-8">
            <IconMoodSmileBeam />
          </Button>
        </PopoverTrigger>

        <PopoverContent side="top" align="start" className="w-80 p-0">
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
          editor={editor}
          onKeyDown={handleEditorKeyDown}
          className="h-10 leading-10 text-sm px-2 overflow-y-auto"
        />
      </div>

   

      {/* MIC / SEND */}
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onVoiceRecord}
        disabled={content.trim().length > 0}
      >
        <IconMicrophone />
      </Button>

      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onSubmit}
        disabled={
          isCreatingMessage || !(content.trim() || hasAttachments || hasAudio)
        }
      >
        {isCreatingMessage ? <Spinner /> : <IconSend />}
      </Button>
    </div>
  );
}
