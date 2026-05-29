import { IconArrowBackUp, IconX } from "@tabler/icons-react";
import { useAsyncDebouncer } from "@tanstack/react-pacer";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@work-holo/ui/components/alert";
import { Button } from "@work-holo/ui/components/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMessageMutations } from "@/hooks/communications/use-message-mutations";
import { useTypingIndicator } from "@/hooks/communications/use-typing-indicator";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { CHANNEL_MENTION, CHANNEL_MENTION_ID } from "@/lib/mentions";
import { cn, generateId } from "@/lib/utils";
import {
  useChannelComposerFocus,
  useChannelReplyState,
  useChannelThreadReplyState,
  useMaximizedMessageComposerActions,
} from "@/stores/channel-store";
import {
  REPLY_PREVIEW_TRUNCATE_LENGTH,
  stripHtmlToText,
  truncateText,
} from "@/utils/message-utils";
import { orpcClient } from "@/utils/orpc";
import { uploadToStorage } from "@/utils/upload-helper";
import { AttachmentPreviewList } from "./attachment-preview-list";
import { AudioRecorder } from "./audio-recorder";
import { type ComposerView, MessageEditor } from "./message-editor";
import { TypingIndicator } from "./typing-indicator";

/** Debounce delay for mention user search API calls (in milliseconds) */
const MENTION_DEBOUNCE_DELAY_MS = 300;

/** User type for mention autocomplete results */
type MentionUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

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

interface MessageComposerProps {
  channelId: string;
  className?: string;
  initialContent?: string;
  onMaximize?: (content: string) => void;
  onSendSuccess?: () => void;
  parentMessageId?: string;
  placeholder?: string;
}

export function MessageComposer({
  channelId,
  className,
  parentMessageId,
  onSendSuccess,
  onMaximize,
  initialContent = "",
}: MessageComposerProps) {
  const { user } = useAuthedSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const composerFocusHandlerRef = useRef<(() => void) | null>(null);

  const [text, setText] = useState(initialContent);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([]);
  const [composerView, setComposerView] = useState<ComposerView>("editor");
  const { openMaximizedMessageComposer } = useMaximizedMessageComposerActions();
  const mainReplyState = useChannelReplyState();
  const threadReplyState = useChannelThreadReplyState();
  const { setMainComposerFocus, setThreadComposerFocus } =
    useChannelComposerFocus();
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

  const { createMessage } = useMessageMutations();
  const { typingUsers, broadcastTyping } = useTypingIndicator(channelId);

  const fetchMentionUsersFromApi = useCallback(
    async (
      query: string,
      includeChannelMention: boolean
    ): Promise<MentionUser[]> => {
      const { users = [] } = await orpcClient.communication.message.searchUsers(
        {
          channelId,
          query,
        }
      );

      const channelMention = includeChannelMention ? [CHANNEL_MENTION] : [];
      return [...channelMention, ...users.filter((su) => su.id !== user.id)];
    },
    [channelId, user.id]
  );

  const mentionUserSearchDebouncer = useAsyncDebouncer(
    (query: string, includeChannelMention: boolean) =>
      fetchMentionUsersFromApi(query, includeChannelMention),
    {
      key: `mention-user-search:${channelId}`,
      wait: MENTION_DEBOUNCE_DELAY_MS,
    }
  );

  const fetchUsers = useCallback(
    async (query: string): Promise<MentionUser[]> => {
      const normalizedQuery = query.trim().toLowerCase();
      const includeChannelMention =
        normalizedQuery.length === 0 ||
        "channel".startsWith(normalizedQuery.replace("@", ""));

      const channelMention = includeChannelMention ? [CHANNEL_MENTION] : [];

      const { lastArgs, lastResult } = mentionUserSearchDebouncer.store.state;
      if (lastArgs && lastResult) {
        const [lastQuery, lastIncludeChannelMention] = lastArgs;
        if (
          lastQuery === query &&
          lastIncludeChannelMention === includeChannelMention
        ) {
          const cached = await lastResult;
          if (cached.length > 0) return cached;
        }
      }

      if (normalizedQuery.length === 0) {
        try {
          return await fetchMentionUsersFromApi(query, includeChannelMention);
        } catch {
          return channelMention;
        }
      }

      try {
        const result = await mentionUserSearchDebouncer.maybeExecute(
          query,
          includeChannelMention
        );

        return result ?? channelMention;
      } catch {
        return channelMention;
      }
    },
    [fetchMentionUsersFromApi, mentionUserSearchDebouncer]
  );

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

    // Clear UI immediately for better UX
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
      const mentionRegex =
        /<span[^>]*data-type="mention"[^>]*data-id="([^"]+)"[^>]*>/g;
      const mentionUserIds = new Set<string>();
      let match: RegExpExecArray | null;

      while (true) {
        match = mentionRegex.exec(textToSend || "");
        if (match === null) break;
        mentionUserIds.add(match[1]);
      }

      if (mentionUserIds.has(CHANNEL_MENTION_ID)) {
        try {
          const channelMembers =
            await orpcClient.communication.channel.listMembers({
              channelId,
            });

          for (const member of channelMembers) {
            if (member.id !== user.id) {
              mentionUserIds.add(member.id);
            }
          }
        } catch (error) {
          console.error("Error fetching channel members for mention:", error);
        }

        mentionUserIds.delete(CHANNEL_MENTION_ID);
      }

      // Determine message type
      let messageType: "text" | "attachment" | "audio" = "text";
      if (!textToSend && audioBlobToUpload) {
        messageType = "audio";
      } else if (!textToSend && attachmentsToUpload.length > 0) {
        messageType = "attachment";
      }

      // Upload attachments and audio in parallel
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

      // Wait for all uploads to complete
      const uploadedAttachments =
        uploadPromises.length > 0 ? await Promise.all(uploadPromises) : [];

      const messageData = {
        id: generateId(),
        channelId,
        content: textToSend,
        mentions:
          mentionUserIds.size > 0 ? Array.from(mentionUserIds) : undefined,
        parentMessageId,
        replyToMessageId,
        type: messageType,
        attachments:
          uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      };

      createMessage({ message: messageData });
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
    channelId,
    createMessage,
    broadcastTyping,
    user.name,
    user.id,
    parentMessageId,
    replyingToMessage?.id,
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

      // If file was already uploaded to storage, delete it via API
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

  // Sync text when initialContent changes (for thread replies)
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
                <TypingIndicator typingUsers={typingUsers} />
              </div>
            )}

            {replyingToMessage && (
              <Alert className="mb-3 border-primary/30 bg-primary/5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 text-primary">
                    <IconArrowBackUp className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <AlertTitle>
                      Replying to {replyingToMessage.sender?.name ?? "Unknown"}
                    </AlertTitle>
                    <AlertDescription className="truncate text-sm">
                      {replyingToMessage.content
                        ? truncateText(
                            stripHtmlToText(replyingToMessage.content),
                            REPLY_PREVIEW_TRUNCATE_LENGTH
                          )
                        : "📎 Attachment"}
                    </AlertDescription>
                  </div>
                  <Button
                    onClick={clearReplyingToMessage}
                    size="icon"
                    variant="destructive"
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
              </Alert>
            )}

            <MessageEditor
              attachmentPreview={
                composerView === "attachments" && attachments.length > 0 ? (
                  <AttachmentPreviewList
                    attachments={attachments}
                    onRemove={handleRemoveAttachment}
                  />
                ) : undefined
              }
              audioPreview={
                composerView === "audio" && (isRecording || audioUrl) ? (
                  <div className="p-3">
                    <AudioRecorder
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
              fetchUsers={fetchUsers}
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
            />
          </div>
        </div>
      </div>
    </>
  );
}
