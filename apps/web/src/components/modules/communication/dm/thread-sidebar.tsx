import {
  IconArrowDown,
  IconLoader2,
  IconMessages,
  IconX,
} from "@tabler/icons-react";
import { useParams } from "@tanstack/react-router";
import { Button } from "@work-holo/ui/components/button";
import { useCallback, useEffect, useState } from "react";
// Import the thread hook - we'll create this
import { useVirtualDmMessageThread } from "@/hooks/communications/dm/use-dm-message-thread";
import { cn } from "@/lib/utils";
import {
  useDmMessageThreadSidebar,
  useMaximizedDmMessageComposerActions,
} from "@/stores/dm-store";
import { formatMessageDate } from "@/utils/message-utils";
import { DmMessageComposer } from "./message-composer";
import { DmMessageItem } from "./message-item";

export function DmThreadSidebar() {
  const [threadComposerText, setThreadComposerText] = useState("");

  const { conversationId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId",
  });

  const { messageId, isOpen, closeMessageThread } = useDmMessageThreadSidebar();

  const {
    scrollRef,
    virtualizer,
    virtualItems,
    totalSize,
    message,
    threadMessages,
    isLoading,
    isFetchingNextPage,
    showScrollButton,
    scrollToBottom,
  } = useVirtualDmMessageThread({
    messageId,
  });

  const repliesCount = threadMessages.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to close thread when conversation changes
  useEffect(() => {
    closeMessageThread();
  }, [conversationId, closeMessageThread]);

  const { openMaximizedMessageComposer } =
    useMaximizedDmMessageComposerActions();

  const handleMaximizedReply = useCallback(
    (content: string) => {
      if (!message) return;

      setThreadComposerText(content);
      openMaximizedMessageComposer({
        content,
        parentMessageId: message.id,
        onComplete: (result) => {
          if (result.action === "cancel") {
            setThreadComposerText(result.content ?? content);
            return;
          }
          setThreadComposerText("");
        },
      });
    },
    [message, openMaximizedMessageComposer]
  );

  return (
    <div
      className={cn(
        "flex h-full min-w-0 shrink-0 flex-col overflow-hidden border-l bg-background/95 backdrop-blur-sm transition-[width,opacity] duration-300 ease-in-out supports-backdrop-filter:bg-background/60",
        isOpen ? "w-96 opacity-100 shadow-lg sm:w-140" : "w-0 opacity-0"
      )}
    >
      <div className="flex h-full min-w-0 flex-1 flex-col">
        {!message && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center text-muted-foreground text-sm">
            <p>Message might be deleted</p>
            <Button className="rounded-full" onClick={closeMessageThread}>
              Close thread
            </Button>
          </div>
        )}

        {message && (
          <div className="flex items-start justify-between border-b bg-muted/30 px-4 py-3">
            <div className="flex gap-3 space-y-1.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <IconMessages className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="font-semibold text-base">
                  {message.sender.name}
                </div>
                <div className="text-muted-foreground text-xs">
                  {formatMessageDate(message.createdAt)}
                </div>
                <div className="font-medium text-primary text-xs">
                  {repliesCount === 0 && <span>No replies yet</span>}
                  {repliesCount > 0 && (
                    <span>
                      {repliesCount} repl{repliesCount === 1 ? "y" : "ies"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              aria-label="Close thread"
              className="rounded-lg p-1.5 opacity-70 ring-offset-background transition-all hover:bg-destructive/10 hover:text-destructive hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              onClick={closeMessageThread}
              type="button"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        )}

        {message && isLoading && threadMessages.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
            Loading replies...
          </div>
        )}

        {message && !isLoading && repliesCount === 0 && (
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="rounded-lg border bg-muted/40 p-4 text-center text-muted-foreground text-sm">
              Continue the conversation by replying here.
            </div>
          </div>
        )}

        {message && repliesCount > 0 && (
          <div className="relative flex-1 overflow-hidden">
            <div className="h-full overflow-auto" ref={scrollRef}>
              <div
                style={{
                  height: totalSize,
                  width: "100%",
                  position: "relative",
                }}
              >
                {isFetchingNextPage && (
                  <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-2 bg-background/80 py-2 shadow-sm backdrop-blur-sm">
                    <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="font-medium text-muted-foreground text-sm">
                      Loading older replies...
                    </span>
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                  }}
                >
                  {virtualItems.map((virtualRow) => (
                    <div
                      className="p-3"
                      data-index={virtualRow.index}
                      key={virtualRow.key}
                      ref={virtualizer.measureElement}
                    >
                      <DmMessageItem
                        isThreadMessage
                        message={threadMessages[virtualRow.index]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {showScrollButton && (
              <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center">
                <Button
                  className="gap-1.5 rounded-full"
                  onClick={scrollToBottom}
                  variant="secondary"
                >
                  <IconArrowDown />
                  <span className="text-sm">Jump to latest replies</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {message && (
          <DmMessageComposer
            conversationId={conversationId}
            initialContent={threadComposerText}
            key={`${message.id}-${Date.now()}`}
            onMaximize={handleMaximizedReply}
            parentMessageId={message.id}
            placeholder="Reply in thread..."
          />
        )}
      </div>
    </div>
  );
}
