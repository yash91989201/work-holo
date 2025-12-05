import { AtSign, Loader2Icon, X } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useChannelMentions } from "@/hooks/communications/use-channel-mentions";
import { insertDateSeparators } from "@/lib/communications/message";
import { cn } from "@/lib/utils";
import { useMentionsSidebar } from "@/stores/channel-store";
import { MentionMessageItem } from "./mention-message-item";

export function MentionsSidebar() {
  const { mentions, mentionCount, isLoading, currentChannelId } =
    useChannelMentions();

  const { isOpen, closeMentionsSidebar } = useMentionsSidebar();

  const mentionsWithSeparators = useMemo(
    () => insertDateSeparators(mentions),
    [mentions]
  );

  return (
    <div
      className={cn(
        "flex h-full min-w-0 shrink-0 flex-col overflow-hidden border-l bg-background/95 backdrop-blur-sm transition-[width,opacity] duration-300 ease-in-out supports-backdrop-filter:bg-background/60",
        isOpen ? "w-96 opacity-100 shadow-lg sm:w-[560px]" : "w-0 opacity-0"
      )}
    >
      <div className="shrink-0 border-border border-b bg-muted/30 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <AtSign className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-foreground text-lg">
                Mentions
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm">
                {mentionCount === 0 && <span>No mentions yet</span>}
                {mentionCount > 0 && (
                  <span>
                    {mentionCount} mention{mentionCount === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            onClick={closeMentionsSidebar}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading && mentions.length === 0 && (
        <div className="flex flex-1 items-center justify-center gap-2 p-6 text-muted-foreground text-sm">
          <Loader2Icon className="h-4 w-4 animate-spin" />
          <span>Fetching mentions...</span>
        </div>
      )}

      {!isLoading && mentionCount === 0 && (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="rounded-lg border bg-muted/40 p-4 text-center text-muted-foreground text-sm">
            No one has mentioned you yet. When someone @mentions you in any
            channel, the message will show up here instantly.
          </div>
        </div>
      )}

      {mentionCount > 0 && (
        <div className="flex-1 overflow-auto px-3 py-4">
          <div className="space-y-4">
            {mentionsWithSeparators.map((item) => {
              if ("type" in item && item.type === "date-separator") {
                return (
                  <div
                    className="sticky top-0 z-10 flex items-center justify-center py-2"
                    key={item.id}
                  >
                    <div className="rounded-full border bg-background px-3 py-1 font-medium text-muted-foreground text-xs shadow-sm">
                      {item.displayDate}
                    </div>
                  </div>
                );
              }

              return (
                <MentionMessageItem
                  currentChannelId={currentChannelId}
                  key={item.id}
                  message={item}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
