import type { AnyExtension } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Dropcursor } from "@tiptap/extensions";
import type { Editor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { SuggestionOptions } from "@tiptap/suggestion";
import { useCallback, useEffect, useRef, useState } from "react";
import z from "zod";
import { cn } from "@/lib/utils";
import { uploadMessageImage } from "@/utils/upload-helper";

const URL_REGEX = /^[a-zA-Z]+:\/\//;

interface UseMessageEditorOptions {
  AutoLinkPreview: AnyExtension;
  content: string;
  createMentionSuggestion: (
    fetchUsers: (query: string) => Promise<
      Array<{
        id: string;
        name: string | null;
        image: string | null;
        email: string;
      }>
    >
  ) => Omit<SuggestionOptions, "editor">;
  disabled?: boolean;
  fetchUsers: (query: string) => Promise<
    Array<{
      id: string;
      name: string | null;
      image: string | null;
      email: string;
    }>
  >;
  isInMaximizedComposer?: boolean;
  isMaximized?: boolean;
  LinkPreviewNode: AnyExtension;
  onChange: (content: string) => void;
  onCursorChange?: (position: number) => void;
  onSubmit: () => void;
}

export function useMessageEditor({
  content,
  onChange,
  onSubmit,
  disabled = false,
  onCursorChange,
  fetchUsers,
  isMaximized = false,
  isInMaximizedComposer = false,
  createMentionSuggestion,
  LinkPreviewNode,
  AutoLinkPreview,
}: UseMessageEditorOptions) {
  const editorRef = useRef<Editor | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkToggleRef = useRef<HTMLButtonElement>(null);
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const handleImageUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      const input = e.currentTarget;

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        try {
          const url = await uploadMessageImage(file);
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

      if (input) {
        input.value = "";
      }
    },
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
        link: false,
        underline: false,
        dropcursor: false,
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
            : "max-h-36 min-h-24 overflow-y-auto"
        ),
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          const { state } = view;

          for (const plugin of state.plugins) {
            const pluginState = plugin.getState(state);
            if (pluginState?.active === true) {
              return false;
            }
          }

          event.preventDefault();
          onSubmit();
          return true;
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((i) => i.type.startsWith("image/"));
        if (!imageItem) return false;
        {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) {
            uploadMessageImage(file)
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
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));
        if (imageFiles.length > 0) {
          event.preventDefault();
          for (const file of imageFiles) {
            uploadMessageImage(file)
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

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const editorElement = editor.view.dom;
      const { selection } = editor.state;
      const { from } = selection;

      const coords = editor.view.coordsAtPos(from);
      const editorRect = editorElement.getBoundingClientRect();

      if (coords.bottom > editorRect.bottom) {
        editorElement.scrollTop += coords.bottom - editorRect.bottom + 20;
      } else if (coords.top < editorRect.top) {
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

  const handleAddLink = useCallback(() => {
    setIsLinkPopoverOpen(true);
  }, []);

  const handleSaveLink = useCallback(() => {
    if (!(editor && linkUrl)) return;

    let url = linkUrl;
    if (!url.match(URL_REGEX)) {
      url = `https://${url}`;
    }

    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");

    if (text) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
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

    setLinkUrl("");
    setIsLinkPopoverOpen(false);
  }, [editor, linkUrl]);

  return {
    editor,
    editorRef,
    fileInputRef,
    linkToggleRef,
    isLinkPopoverOpen,
    setIsLinkPopoverOpen,
    linkUrl,
    setLinkUrl,
    handleImageUploadClick,
    handleFileInputChange,
    handleAddLink,
    handleSaveLink,
  };
}
