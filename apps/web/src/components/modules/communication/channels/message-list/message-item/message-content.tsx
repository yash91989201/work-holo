import { IconDownload, IconFile, IconMaximize } from "@tabler/icons-react";
import type { MessageWithSenderType } from "@work-holo/api/lib/types";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { type JSX, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn, formatFileSize } from "@/lib/utils";
import { LinkPreview } from "../../message-composer/link-preview";

interface MessageContentProps {
  isOwnMessage?: boolean;
  message: MessageWithSenderType;
}

export function MessageContent({
  message,
  isOwnMessage = false,
}: MessageContentProps) {
  const hasContent =
    message.content &&
    message.content.trim().length > 0 &&
    message.content.replace(/<[^>]*>/g, "").trim().length > 0;
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
                  asChild
                  className="shrink-0"
                  size="icon-sm"
                  variant="ghost"
                >
                  <a
                    download
                    href={attachment.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <IconDownload className="size-4" />
                  </a>
                </Button>
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
                    asChild
                    className="shrink-0"
                    size="icon-sm"
                    variant="ghost"
                  >
                    <a
                      download
                      href={attachment.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <IconDownload className="size-4" />
                    </a>
                  </Button>
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
      <Button asChild className="shrink-0" size="icon-sm" variant="ghost">
        <a
          download
          href={url}
          rel="noopener noreferrer"
          target="_blank"
          title="Download audio"
        >
          <IconDownload className="size-4" />
        </a>
      </Button>
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
          asChild
          className="bg-background/90 backdrop-blur-sm hover:bg-background"
          size="icon-sm"
          variant="secondary"
        >
          <a
            download
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            title="Download video"
          >
            <IconDownload className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function ImagePreview({ url, fileName }: { url: string; fileName: string }) {
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
    <div className="group relative max-w-md overflow-hidden rounded-lg border">
      <img
        alt={fileName}
        className="max-h-80 w-full object-cover"
        height={100}
        src={url}
        width={100}
      />
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          asChild
          className="bg-background/90 backdrop-blur-sm hover:bg-background"
          size="icon-sm"
          variant="secondary"
        >
          <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            title="Open full size"
          >
            <IconMaximize className="size-4" />
          </a>
        </Button>
        <Button
          className="bg-background/90 backdrop-blur-sm hover:bg-background"
          onClick={handleDownload}
          size="icon-sm"
          title="Download image"
          variant="secondary"
        >
          <IconDownload className="size-4" />
        </Button>
      </div>
    </div>
  );
}
