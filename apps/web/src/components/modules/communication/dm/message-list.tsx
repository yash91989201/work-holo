import { IconArrowDown, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";
import { useMarkDmMessagesRead } from "@/hooks/communications/dm/use-dm-mark-messages-read";
import { useVirtualDmMessages } from "@/hooks/communications/dm/use-dm-messages";
import { useVisibleDmMessages } from "@/hooks/communications/dm/use-dm-visible-messages";
import type {
  DateSeparator,
  NewMessagesSeparator as NewMessagesSeparatorType,
} from "@/lib/communications/dm-message";
import { DmDateFilter } from "./date-filter";
import { DmDateSeparator } from "./date-separator";
import { DmEmptyState } from "./empty-state";
import { DmMessageItem } from "./message-item";
import { DmNewMessagesSeparator } from "./new-messages-separator";

function isDateSeparator(item: unknown): item is DateSeparator {
  return (
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === "date-separator"
  );
}

function isNewMessagesSeparator(
  item: unknown
): item is NewMessagesSeparatorType {
  return (
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === "new-messages-separator"
  );
}

export function DmMessageList() {
  const {
    scrollRef,
    virtualizer,
    virtualItems,
    totalSize,
    items,
    messages,
    isLoading,
    isFetchingNextPage,
    showScrollButton,
    scrollToBottom,
    filterDate,
    scrollToDate,
    dateRange,
    highlightedMessageId,
  } = useVirtualDmMessages();

  // Track visible messages for read receipts
  const { visibleMessageIds } = useVisibleDmMessages({
    virtualItems,
    items,
    enabled: true,
  });

  // Mark visible messages as read
  useMarkDmMessagesRead(visibleMessageIds, {
    debounceMs: 500,
  });

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 overflow-hidden bg-linear-to-b from-background via-background to-muted/10">
        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
          Loading messages...
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-hidden bg-linear-to-b from-background via-background to-muted/10">
        <DmEmptyState />
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-linear-to-b from-background via-background to-muted/10">
      {messages.length > 0 && (
        <DmDateFilter
          maxDate={dateRange.maxDate}
          minDate={dateRange.minDate}
          onDateSelect={scrollToDate}
          selectedDate={filterDate}
        />
      )}

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
                Loading older messages...
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
            {virtualItems.map((virtualRow) => {
              const item = items[virtualRow.index];

              if (isDateSeparator(item)) {
                return (
                  <div
                    data-index={virtualRow.index}
                    key={virtualRow.key}
                    ref={virtualizer.measureElement}
                  >
                    <DmDateSeparator displayDate={item.displayDate} />
                  </div>
                );
              }

              if (isNewMessagesSeparator(item)) {
                return (
                  <div
                    data-index={virtualRow.index}
                    key={virtualRow.key}
                    ref={virtualizer.measureElement}
                  >
                    <DmNewMessagesSeparator />
                  </div>
                );
              }

              return (
                <div
                  className="px-3 py-1.5"
                  data-id={item.id}
                  data-index={virtualRow.index}
                  key={virtualRow.key}
                  ref={virtualizer.measureElement}
                >
                  <DmMessageItem
                    isHighlighted={highlightedMessageId === item.id}
                    message={item}
                  />
                </div>
              );
            })}
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
            <span className="text-sm">Jump to latest messages</span>
          </Button>
        </div>
      )}
    </div>
  );
}
