import { ArrowDownIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVirtualMessages } from "@/hooks/communications/use-messages";
import type { DateSeparator } from "@/lib/communications/message";
import { DateFilter } from "./date-filter";
import { DateSeparator as DateSeparatorComponent } from "./date-separator";
import { EmptyState } from "./empty-state";
import { MessageItem } from "./message-item";

function isDateSeparator(item: unknown): item is DateSeparator {
  return (
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === "date-separator"
  );
}

export function MessageList() {
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
  } = useVirtualMessages();

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
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-linear-to-b from-background via-background to-muted/10">
      {messages.length > 0 && (
        <DateFilter
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
              <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
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
                    <DateSeparatorComponent displayDate={item.displayDate} />
                  </div>
                );
              }

              return (
                <div
                  className="p-3"
                  data-index={virtualRow.index}
                  key={virtualRow.key}
                  ref={virtualizer.measureElement}
                >
                  <MessageItem message={item} />
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
            <ArrowDownIcon />
            <span className="text-sm">Jump to latest messages</span>
          </Button>
        </div>
      )}
    </div>
  );
}
