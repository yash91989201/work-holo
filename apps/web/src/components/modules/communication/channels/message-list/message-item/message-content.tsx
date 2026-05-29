import {
  IconDownload,
  IconFile,
  IconMaximize,
  IconX,
} from "@tabler/icons-react";
import type { MessageWithSenderType } from "@work-holo/api/lib/types";
import { Button } from "@work-holo/ui/components/button";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { type JSX, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn, formatFileSize } from "@/lib/utils";
import { LinkPreview } from "../../message-composer/link-preview";

interface MessageContentProps {
  isOwnMessage?: boolean;
  message: MessageWithSenderType;
}

const HTML_TAG_REGEX = /<[^>]*>/g;
const INLINE_RENDERABLE_CONTENT_REGEX =
  /<(img|video|audio|iframe|picture|figure)\b/i;
const LINK_PREVIEW_CONTENT_REGEX = /data-type=["']link-preview["']/i;

export function MessageContent({
  message,
  isOwnMessage = false,
}: MessageContentProps) {
  const trimmedContent = message.content?.trim() ?? "";
  const hasTextContent =
    trimmedContent.replace(HTML_TAG_REGEX, "").trim().length > 0;
  const hasInlineRenderableContent =
    INLINE_RENDERABLE_CONTENT_REGEX.test(trimmedContent) ||
    LINK_PREVIEW_CONTENT_REGEX.test(trimmedContent);
  const hasContent =
    trimmedContent.length > 0 && (hasTextContent || hasInlineRenderableContent);
  const hasAttachments = message.attachments && message.attachments.length > 0;

  const parserOptions = {
    replace: (domNode: unknown): JSX.Element | object | undefined => {
      const node = domNode as {
        type?: string;
        name?: string;
        attribs?: Record<string, string>;
      };

      if (
        node.type === "tag" &&
        node.name === "div" &&
        node.attribs?.["data-type"] === "link-preview" &&
        node.attribs?.["data-url"]
      ) {
        return <LinkPreview url={node.attribs["data-url"]} />;
      }

      if (node.type === "tag" && node.name === "img" && node.attribs?.src) {
        return (
          <ClickableImage alt={node.attribs.alt ?? ""} src={node.attribs.src} />
        );
      }
    },
  };

  // For audio-only messages
  if (message.type === "audio" && hasAttachments) {
    const audioAttachment = message.attachments?.find(
      (att) => att.type === "audio"
    );
    if (audioAttachment?.url) {
      return <AudioPlayer url={audioAttachment.url} />;
    }
  }

  // For attachment-only messages
  if (message.type === "attachment" && hasAttachments && !hasContent) {
    return (
      <div className="flex flex-wrap gap-2">
        {message.attachments?.map((attachment) => {
          if (attachment.type === "image" && attachment.url) {
            return (
              <ImagePreview
                fileName={attachment.originalName}
                key={attachment.id}
                url={attachment.url}
              />
            );
          }

          if (attachment.type === "video" && attachment.url) {
            return <VideoPlayer key={attachment.id} url={attachment.url} />;
          }

          return (
            <div
              className="flex w-fit max-w-sm items-center gap-2.5 rounded-lg border bg-background p-2.5 transition-colors hover:bg-muted/50"
              key={attachment.id}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <IconFile className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm leading-tight">
                  {attachment.originalName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatFileSize(attachment.fileSize)}
                </p>
              </div>
              {attachment.url && (
                <Button
                  className="shrink-0"
                  render={
                    <a
                      download
                      href={attachment.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <IconDownload className="size-4" />
                    </a>
                  }
                  size="icon-sm"
                  variant="ghost"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // For text messages (with or without attachments)
  return (
    <div className="flex flex-col gap-2">
      {hasContent && message.content !== null && (
        <div
          className={cn(
            "rounded-lg px-3 py-2",
            isOwnMessage
              ? "bg-primary/30 text-foreground"
              : "bg-muted/50 text-foreground"
          )}
        >
          <div className="ProseMirror prose-sm dark:prose-invert wrap-break-words text-sm leading-relaxed">
            {parse(
              DOMPurify.sanitize(message.content, {
                ADD_ATTR: ["target", "rel", "data-url", "data-type"],
              }),
              parserOptions
            )}
          </div>
        </div>
      )}

      {hasAttachments && (
        <div className="flex flex-wrap gap-2">
          {message.attachments?.map((attachment) => {
            if (attachment.type === "audio" && attachment.url) {
              return <AudioPlayer key={attachment.id} url={attachment.url} />;
            }

            if (attachment.type === "image" && attachment.url) {
              return (
                <ImagePreview
                  fileName={attachment.originalName}
                  key={attachment.id}
                  url={attachment.url}
                />
              );
            }

            if (attachment.type === "video" && attachment.url) {
              return <VideoPlayer key={attachment.id} url={attachment.url} />;
            }

            return (
              <div
                className="flex w-fit max-w-sm items-center gap-2.5 rounded-lg border bg-background p-2.5 transition-colors hover:bg-muted/50"
                key={attachment.id}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <IconFile className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm leading-tight">
                    {attachment.originalName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatFileSize(attachment.fileSize)}
                  </p>
                </div>
                {attachment.url && (
                  <Button
                    className="shrink-0"
                    render={
                      <a
                        download
                        href={attachment.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <IconDownload className="size-4" />
                      </a>
                    }
                    size="icon-sm"
                    variant="ghost"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AudioPlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <div className="flex w-100 items-center gap-2.5 rounded-lg border bg-background p-2.5">
      {/** biome-ignore lint/a11y/useMediaCaption: <track is not required here> */}
      <audio className="flex-1" controls ref={audioRef} src={url} />
      <Button
        className="shrink-0"
        render={
          <a
            download
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            title="Download audio"
          >
            <IconDownload className="size-4" />
          </a>
        }
        size="icon-sm"
        variant="ghost"
      />
    </div>
  );
}

function VideoPlayer({ url }: { url: string }) {
  return (
    <div className="group relative max-w-xl overflow-hidden rounded-lg border">
      {/** biome-ignore lint/a11y/useMediaCaption: <track is not required here> */}
      <video className="w-full" controls preload="metadata" src={url}>
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          className="bg-background/90 backdrop-blur-sm hover:bg-background"
          render={
            <a
              download
              href={url}
              rel="noopener noreferrer"
              target="_blank"
              title="Download video"
            >
              <IconDownload className="size-4" />
            </a>
          }
          size="icon-sm"
          variant="secondary"
        />
      </div>
    </div>
  );
}

function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = alt || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // silently fail
    }
  };

  if (!isOpen) return null;

  return createPortal(
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click to close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="group relative"
        onClick={(e) => e.stopPropagation()}
        // biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation
        onKeyDown={() => {}}
      >
        <img
          alt={alt}
          className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
          src={src}
        />
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            className="bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
            onClick={handleDownload}
            size="icon-sm"
            title="Download image"
            variant="ghost"
          >
            <IconDownload className="size-4" />
          </Button>
          <Button
            className="bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
            onClick={onClose}
            size="icon-sm"
            title="Close"
            variant="ghost"
          >
            <IconX className="size-4" />
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ImagePreview({ url, fileName }: { url: string; fileName: string }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <>
      <div
        className="group relative max-w-md cursor-zoom-in overflow-hidden rounded-lg border"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          alt={fileName}
          className="max-h-80 w-full object-cover"
          height={100}
          src={url}
          width={100}
        />
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            className="bg-background/90 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            size="icon-sm"
            title="View full size"
            variant="secondary"
          >
            <IconMaximize className="size-4" />
          </Button>
          <Button
            className="bg-background/90 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            size="icon-sm"
            title="Download image"
            variant="secondary"
          >
            <IconDownload className="size-4" />
          </Button>
        </div>
      </div>
      <ImageLightbox
        alt={fileName}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        src={url}
      />
    </>
  );
}

function ClickableImage({ src, alt }: { src: string; alt: string }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: image click to open lightbox */}
      <img
        alt={alt}
        className="max-w-full cursor-zoom-in rounded"
        onClick={() => setIsLightboxOpen(true)}
        src={src}
      />
      <ImageLightbox
        alt={alt}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        src={src}
      />
    </>
  );
}
