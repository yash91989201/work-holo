import { IconArrowBackUp, IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDmMessageMutations } from "@/hooks/communications/dm/use-dm-message-mutations";
import { useDmTyping } from "@/hooks/communications/dm/use-dm-typing";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { cn, generateId } from "@/lib/utils";
import {
  useDmComposerFocus,
  useDmReplyState,
  useDmThreadReplyState,
  useMaximizedDmMessageComposerActions,
} from "@/stores/dm-store";
import {
  REPLY_PREVIEW_TRUNCATE_LENGTH,
  stripHtmlToText,
  truncateText,
} from "@/utils/message-utils";
import { orpcClient } from "@/utils/orpc";
import { uploadToStorage } from "@/utils/upload-helper";
import { DmAttachmentPreviewList } from "./attachment-preview-list";
import { DmAudioRecorder } from "./audio-recorder";
import { DmMessageEditor } from "./message-editor";
import { DmTypingIndicator } from "./typing-indicator";

interface AttachmentPreview {
  file: File;
  id: string;
  uploadedFileName?: string;
}

interface MessageAttachment {
  fileName: string;
  fileSize: number;
  mimeType: string;
  originalName: string;
  type: "image" | "document" | "video" | "audio" | "archive";
  url: string;
}

interface DmMessageComposerProps {
  className?: string;
  conversationId: string;
  initialContent?: string;
  onMaximize?: (content: string) => void;
  onSendSuccess?: () => void;
  parentMessageId?: string;
  placeholder?: string;
}

export function DmMessageComposer({
  conversationId,
  className,
  parentMessageId,
  onSendSuccess,
  onMaximize,
  initialContent = "",
  placeholder = "Type a message...",
}: DmMessageComposerProps) {
  const { user } = useAuthedSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const composerFocusHandlerRef = useRef<(() => void) | null>(null);

  const [text, setText] = useState(initialContent);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([]);
  const [composerView, setComposerView] = useState<
    "editor" | "attachments" | "audio"
  >("editor");
  const { openMaximizedMessageComposer } =
    useMaximizedDmMessageComposerActions();
  const mainReplyState = useDmReplyState();
  const threadReplyState = useDmThreadReplyState();
  const { setMainComposerFocus, setThreadComposerFocus } = useDmComposerFocus();
  const { replyingToMessage, clearReplyingToMessage } = parentMessageId
    ? threadReplyState
    : mainReplyState;

  const handleFocusHandlerChange = useCallback(
    (handler: (() => void) | null) => {
      composerFocusHandlerRef.current = handler;
    },
    []
  );

  const focusComposer = useCallback(() => {
    setComposerView("editor");

    requestAnimationFrame(() => {
      composerFocusHandlerRef.current?.();
    });
  }, []);

  const {
    isRecording,
    audioBlob,
    audioUrl,
    duration,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useAudioRecorder();

  const { createMessage } = useDmMessageMutations();
  const { typingUsers, broadcastTyping } = useDmTyping(conversationId);

  const handleTypingBroadcast = useCallback(
    (content: string) => {
      if (!user?.name) return;

      if (content.trim()) {
        broadcastTyping(true, user.name);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          broadcastTyping(false, user.name);
        }, 3000);
      } else {
        broadcastTyping(false, user.name);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
    [broadcastTyping, user?.name]
  );

  const handleMarkdownChange = useCallback(
    (content: string) => {
      setText(content);
      handleTypingBroadcast(content);
    },
    [handleTypingBroadcast]
  );

  const handleSubmit = useCallback(async () => {
    const hasText = text.trim().length > 0;
    const hasAttachments = attachments.length > 0;
    const hasAudio = audioBlob !== null;

    if (!(hasText || hasAttachments || hasAudio)) return;

    const textToSend = hasText ? text.trim() : undefined;
    const attachmentsToUpload = [...attachments];
    const audioBlobToUpload = audioBlob;
    const replyToMessageId = replyingToMessage?.id ?? undefined;

    setText("");
    setAttachments([]);
    cancelRecording();
    broadcastTyping(false, user.name);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      let messageType: "text" | "attachment" | "audio" = "text";
      if (!textToSend && audioBlobToUpload) {
        messageType = "audio";
      } else if (!textToSend && attachmentsToUpload.length > 0) {
        messageType = "attachment";
      }

      const uploadPromises: Promise<MessageAttachment>[] = [];

      if (attachmentsToUpload.length > 0) {
        for (const attachment of attachmentsToUpload) {
          uploadPromises.push(
            uploadToStorage(attachment.file, "message-attachment").then(
              (uploaded) => {
                const fileType = attachment.file.type;
                let attachmentType:
                  | "image"
                  | "document"
                  | "video"
                  | "audio"
                  | "archive" = "document";

                if (fileType.startsWith("image/")) attachmentType = "image";
                else if (fileType.startsWith("video/"))
                  attachmentType = "video";
                else if (fileType.startsWith("audio/"))
                  attachmentType = "audio";
                else if (
                  fileType.includes("zip") ||
                  fileType.includes("rar") ||
                  fileType.includes("7z")
                )
                  attachmentType = "archive";

                return {
                  fileName: uploaded.fileName,
                  originalName: uploaded.originalName,
                  fileSize: uploaded.fileSize,
                  mimeType: uploaded.mimeType,
                  type: attachmentType,
                  url: uploaded.url,
                };
              }
            )
          );
        }
      }

      if (audioBlobToUpload) {
        const audioFile = new File(
          [audioBlobToUpload],
          `audio-${Date.now()}.webm`,
          {
            type: "audio/webm",
          }
        );

        uploadPromises.push(
          uploadToStorage(audioFile, "message-audio").then((uploaded) => ({
            fileName: uploaded.fileName,
            originalName: uploaded.originalName,
            fileSize: uploaded.fileSize,
            mimeType: uploaded.mimeType,
            type: "audio" as const,
            url: uploaded.url,
          }))
        );
      }

      const uploadedAttachments =
        uploadPromises.length > 0 ? await Promise.all(uploadPromises) : [];

      const messageData = {
        id: generateId(),
        conversationId,
        content: textToSend,
        parentMessageId,
        replyToMessageId,
        type: messageType,
        attachments:
          uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      };

      await createMessage({ message: messageData });
      clearReplyingToMessage();

      onSendSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  }, [
    text,
    attachments,
    audioBlob,
    conversationId,
    createMessage,
    broadcastTyping,
    user.name,
    parentMessageId,
    replyingToMessage,
    clearReplyingToMessage,
    onSendSuccess,
    cancelRecording,
  ]);

  const handleEmojiSelect = useCallback(
    (emoji: { emoji: string; label: string }) => {
      const newMessage = text + emoji.emoji;
      setText(newMessage);
    },
    [text]
  );

  useEffect(() => {
    if (composerView === "attachments" && attachments.length === 0) {
      setComposerView("editor");
    }
  }, [attachments.length, composerView]);

  useEffect(() => {
    if (composerView === "audio" && !isRecording && !audioUrl) {
      setComposerView("editor");
    }
  }, [composerView, isRecording, audioUrl]);

  useEffect(() => {
    if (parentMessageId) {
      setThreadComposerFocus(focusComposer);
      return () => setThreadComposerFocus(null);
    }

    setMainComposerFocus(focusComposer);
    return () => setMainComposerFocus(null);
  }, [
    focusComposer,
    parentMessageId,
    setMainComposerFocus,
    setThreadComposerFocus,
  ]);

  const handleFileUpload = useCallback((files?: FileList) => {
    const filesToAdd = files || fileInputRef.current?.files;
    if (!filesToAdd) return;

    const newAttachments: AttachmentPreview[] = Array.from(filesToAdd).map(
      (file) => ({
        file,
        id: `${Date.now()}-${Math.random()}`,
      })
    );

    setAttachments((prev) => [...prev, ...newAttachments]);
    setComposerView("attachments");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleRemoveAttachment = useCallback(
    async (id: string) => {
      const attachment = attachments.find((att) => att.id === id);

      if (attachment?.uploadedFileName) {
        try {
          await orpcClient.storage.delete({
            bucket: "message-attachment",
            filePath: attachment.uploadedFileName,
          });
        } catch (error) {
          console.error("Error deleting attachment:", error);
        }
      }

      setAttachments((prev) => prev.filter((att) => att.id !== id));
    },
    [attachments]
  );

  const handleVoiceRecord = useCallback(async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
      setComposerView("audio");
    }
  }, [isRecording, startRecording, stopRecording]);

  const handleAudioCancel = useCallback(() => {
    cancelRecording();
  }, [cancelRecording]);

  const handleMaximize = useCallback(() => {
    if (onMaximize) {
      onMaximize(text);
      return;
    }

    setIsEditorMaximized(true);
    openMaximizedMessageComposer({
      content: text,
      parentMessageId: parentMessageId ?? null,
      onComplete: (result) => {
        setIsEditorMaximized(false);

        if (result.action === "cancel") {
          if (typeof result.content === "string") {
            setText(result.content);
            handleTypingBroadcast(result.content);
          }
          return;
        }

        setText("");
        setAttachments([]);
        cancelRecording();
        if (user?.name) {
          broadcastTyping(false, user.name);
        }
      },
    });
  }, [
    onMaximize,
    text,
    openMaximizedMessageComposer,
    parentMessageId,
    handleTypingBroadcast,
    cancelRecording,
    user?.name,
    broadcastTyping,
  ]);

  useEffect(() => {
    setText(initialContent);
  }, [initialContent]);

  useEffect(() => {
    if (!replyingToMessage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearReplyingToMessage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [replyingToMessage, clearReplyingToMessage]);

  const getReplyPreviewContent = () => {
    if (!replyingToMessage?.content) return "📎 Attachment";
    const plainText = stripHtmlToText(replyingToMessage.content);
    return truncateText(plainText, REPLY_PREVIEW_TRUNCATE_LENGTH);
  };

  return (
    <>
      <input
        accept="*/*"
        className="hidden"
        multiple
        onChange={(e) => handleFileUpload(e.target.files || undefined)}
        ref={fileInputRef}
        type="file"
      />

      <div
        className={cn(
          "relative min-w-0 overflow-x-hidden bg-background p-3",
          className
        )}
      >
        <div className="min-w-0">
          <div className="relative min-w-0">
            {typingUsers.length > 0 && (
              <div className="border-b px-4 py-2">
                <DmTypingIndicator typingUsers={typingUsers} />
              </div>
            )}

            {replyingToMessage && !parentMessageId && (
              <div className="mb-2 flex items-start gap-3 rounded-lg bg-primary/25 px-4 py-3">
                <div className="mt-0.5 shrink-0 text-primary">
                  <IconArrowBackUp className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {replyingToMessage.sender?.image ? (
                      <img
                        alt={replyingToMessage.sender.name}
                        className="h-5 w-5 rounded-full object-cover"
                        height={20}
                        src={replyingToMessage.sender.image}
                        width={20}
                      />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-medium text-[10px] text-primary">
                        {replyingToMessage.sender?.name
                          ?.slice(0, 2)
                          .toUpperCase() || "??"}
                      </div>
                    )}
                    <span className="font-semibold text-foreground text-sm">
                      {replyingToMessage.sender?.name ?? "Unknown"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-muted-foreground text-sm">
                    {getReplyPreviewContent()}
                  </p>
                </div>
                <button
                  className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  onClick={clearReplyingToMessage}
                  type="button"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>
            )}

            <DmMessageEditor
              attachmentPreview={
                composerView === "attachments" && attachments.length > 0 ? (
                  <DmAttachmentPreviewList
                    attachments={attachments}
                    onRemove={handleRemoveAttachment}
                  />
                ) : undefined
              }
              audioPreview={
                composerView === "audio" && (isRecording || audioUrl) ? (
                  <div className="p-3">
                    <DmAudioRecorder
                      audioUrl={audioUrl}
                      duration={duration}
                      isRecording={isRecording}
                      onCancel={handleAudioCancel}
                      onStart={startRecording}
                      onStop={stopRecording}
                    />
                  </div>
                ) : undefined
              }
              composerView={composerView}
              content={text}
              disabled={isRecording || audioUrl !== null}
              hasAttachments={attachments.length > 0}
              hasAudio={audioUrl !== null}
              isCreatingMessage={false}
              isMaximized={onMaximize ? false : isEditorMaximized}
              isRecording={isRecording}
              onChange={handleMarkdownChange}
              onComposerViewChange={setComposerView}
              onEmojiSelect={handleEmojiSelect}
              onFileUpload={() => fileInputRef.current?.click()}
              onFocusHandlerChange={handleFocusHandlerChange}
              onMaximize={handleMaximize}
              onSubmit={handleSubmit}
              onVoiceRecord={handleVoiceRecord}
              placeholder={placeholder}
            />
          </div>
        </div>
      </div>
    </>
  );
}
