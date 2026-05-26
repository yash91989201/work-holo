import {
  IconAt,
  IconInfoCircleFilled,
  IconPinFilled,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button, buttonVariants } from "@work-holo/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@work-holo/ui/components/input-group";
import { Kbd } from "@work-holo/ui/components/kbd";
import { Popover, PopoverContent } from "@work-holo/ui/components/popover";
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Spinner } from "@work-holo/ui/components/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@work-holo/ui/components/tooltip";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useEffect, useId, useRef, useState } from "react";
import { useChannelMentions } from "@/hooks/communications/use-channel-mentions";
import { useMessageSearch } from "@/hooks/communications/use-message-search";
import { formatMessageTimestamp } from "@/lib/utils";
import {
  useChannelInfoSidebar,
  useChannelMessageHighlight,
  useMentionsSidebar,
  useMessageThreadSidebar,
  usePinnedMessagesSidebar,
} from "@/stores/channel-store";

export function ChannelHeader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });
  const { channelId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/$channelId",
  });

  const { toggleInfoSidebar } = useChannelInfoSidebar();
  const { isOpen, togglePinnedMessages } = usePinnedMessagesSidebar();
  const { isOpen: mentionsOpen, toggleMentionsSidebar } = useMentionsSidebar();
  const { highlightMessage } = useChannelMessageHighlight();
  const {
    isOpen: isThreadSidebarOpen,
    messageId: activeThreadId,
    openMessageThread,
  } = useMessageThreadSidebar();

  const [query, setQuery] = useState("");
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const [pendingThreadHighlight, setPendingThreadHighlight] = useState<{
    messageId: string;
    parentMessageId: string;
  } | null>(null);

  const { unreadMentionCount } = useChannelMentions();

  const hasQuery = query.trim().length > 0;
  const isSearchPopoverOpen = hasQuery;
  const searchResultsListboxId = useId();
  const skeletonRowKeys = ["row-1", "row-2", "row-3"];

  const { results, isLoading, hasMore, loadMore } = useMessageSearch({
    channelId,
    query,
    enabled: hasQuery,
  });

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k" &&
        !event.shiftKey;

      if (!isSearchShortcut) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const isTypingInEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable === true;

      if (isTypingInEditable) {
        return;
      }

      event.preventDefault();
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        const valueLength = inputRef.current?.value.length ?? 0;
        inputRef.current?.setSelectionRange(valueLength, valueLength);
      });
    };

    window.addEventListener("keydown", handleGlobalShortcut);
    return () => window.removeEventListener("keydown", handleGlobalShortcut);
  }, []);

  useEffect(() => {
    if (!pendingThreadHighlight) {
      return;
    }

    if (!isThreadSidebarOpen) {
      return;
    }

    if (activeThreadId !== pendingThreadHighlight.parentMessageId) {
      return;
    }

    highlightMessage(pendingThreadHighlight.messageId);
    setPendingThreadHighlight(null);
  }, [
    activeThreadId,
    highlightMessage,
    isThreadSidebarOpen,
    pendingThreadHighlight,
  ]);

  useEffect(() => {
    if (!isSearchPopoverOpen || results.length === 0) {
      setActiveOptionIndex(-1);
      return;
    }

    setActiveOptionIndex((currentIndex) => {
      if (currentIndex < 0) {
        return 0;
      }

      if (currentIndex >= results.length) {
        return results.length - 1;
      }

      return currentIndex;
    });
  }, [isSearchPopoverOpen, results.length]);

  const activeOptionId =
    activeOptionIndex >= 0 && activeOptionIndex < results.length
      ? `${searchResultsListboxId}-option-${results[activeOptionIndex]?.id}`
      : undefined;

  const moveActiveOption = (direction: "next" | "prev") => {
    if (results.length === 0) {
      return;
    }

    setActiveOptionIndex((currentIndex) => {
      if (direction === "next") {
        if (currentIndex < 0 || currentIndex >= results.length - 1) {
          return 0;
        }

        return currentIndex + 1;
      }

      if (currentIndex <= 0) {
        return results.length - 1;
      }

      return currentIndex - 1;
    });
  };

  const handleActiveOptionSelect = () => {
    if (activeOptionIndex < 0 || activeOptionIndex >= results.length) {
      return;
    }

    handleResultClick(results[activeOptionIndex]);
  };

  const handleResultClick = (result: (typeof results)[0]) => {
    setActiveOptionIndex(-1);
    setQuery("");

    if (result.parentMessageId) {
      setPendingThreadHighlight({
        messageId: result.id,
        parentMessageId: result.parentMessageId,
      });
      openMessageThread(result.parentMessageId);
      return;
    }

    setPendingThreadHighlight(null);
    highlightMessage(result.id);
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) supports-backdrop-filter:bg-background/60">
      <div className="flex w-full items-center gap-1 px-3 lg:gap-2">
        <div className="ml-auto flex items-center gap-2">
          <Popover open={isSearchPopoverOpen}>
            <div className="w-48 sm:w-64 md:w-80" ref={anchorRef}>
              <InputGroup className="h-8 rounded-full bg-background">
                <InputGroupAddon>
                  <InputGroupText>
                    {isLoading ? <Spinner /> : <IconSearch />}
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  aria-activedescendant={activeOptionId}
                  aria-autocomplete="list"
                  aria-controls={searchResultsListboxId}
                  aria-expanded={isSearchPopoverOpen}
                  aria-haspopup="listbox"
                  aria-label="Search messages"
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    const isSearchShortcut =
                      (event.metaKey || event.ctrlKey) &&
                      event.key.toLowerCase() === "k" &&
                      !event.shiftKey;

                    if (isSearchShortcut) {
                      event.preventDefault();
                      inputRef.current?.select();
                      return;
                    }

                    if (isSearchPopoverOpen && event.key === "ArrowDown") {
                      event.preventDefault();
                      moveActiveOption("next");
                      return;
                    }

                    if (isSearchPopoverOpen && event.key === "ArrowUp") {
                      event.preventDefault();
                      moveActiveOption("prev");
                      return;
                    }

                    if (isSearchPopoverOpen && event.key === "Enter") {
                      event.preventDefault();
                      handleActiveOptionSelect();
                      return;
                    }

                    if (event.key === "Escape") {
                      setQuery("");
                      inputRef.current?.blur();
                    }
                  }}
                  placeholder="Search messages..."
                  ref={inputRef}
                  role="combobox"
                  value={query}
                />
                <InputGroupAddon align="inline-end" className="hidden md:flex">
                  {hasQuery ? (
                    <InputGroupButton
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                      size="icon-xs"
                    >
                      <IconX className="size-3" />
                    </InputGroupButton>
                  ) : (
                    <Kbd>Ctrl/Cmd K</Kbd>
                  )}
                </InputGroupAddon>
              </InputGroup>
            </div>

            <PopoverContent
              align="end"
              anchor={anchorRef.current ?? undefined}
              aria-label="Search results"
              className="w-[min(46rem,calc(100vw-1rem))] gap-0 overflow-hidden p-0"
              id={searchResultsListboxId}
              role="listbox"
              side="bottom"
              sideOffset={8}
            >
              {(() => {
                if (isLoading) {
                  return (
                    <ScrollArea className="max-h-[min(70vh,34rem)]">
                      <div className="space-y-1 p-2">
                        {skeletonRowKeys.map((skeletonRowKey) => (
                          <SearchMessageResultItemSkeleton
                            key={skeletonRowKey}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  );
                }

                if (results.length > 0) {
                  return (
                    <>
                      <ScrollArea className="max-h-[min(70vh,34rem)]">
                        <div className="space-y-1 p-2">
                          {results.map((result, index) => {
                            const timestamp = formatMessageTimestamp(
                              result.createdAt
                            );
                            const previewHtml =
                              result.highlights[0] || result.content || "";
                            const optionId = `${searchResultsListboxId}-option-${result.id}`;
                            const isActive = index === activeOptionIndex;

                            return (
                              <button
                                aria-selected={isActive}
                                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                  isActive
                                    ? "border-border bg-muted/40"
                                    : "border-transparent hover:border-border hover:bg-muted/40"
                                }`}
                                id={optionId}
                                key={result.id}
                                onClick={() => handleResultClick(result)}
                                onFocus={() => setActiveOptionIndex(index)}
                                onMouseEnter={() => setActiveOptionIndex(index)}
                                role="option"
                                type="button"
                              >
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarImage
                                      src={result.sender.image || undefined}
                                    />
                                    <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-medium text-primary text-xs">
                                      {result.sender.name
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="min-w-0 flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-semibold text-foreground text-sm">
                                        {result.sender.name}
                                      </span>
                                      <span className="text-muted-foreground text-xs">
                                        {timestamp.formatted}
                                      </span>
                                      {result.parentMessageId ? (
                                        <Badge variant="secondary">
                                          Thread
                                        </Badge>
                                      ) : null}
                                    </div>

                                    {previewHtml ? (
                                      <div className="rounded-lg bg-muted/50 px-3 py-2">
                                        <div className="ProseMirror prose-sm dark:prose-invert wrap-break-word max-h-28 overflow-hidden text-sm leading-relaxed [&_mark]:rounded-sm [&_mark]:bg-primary/20 [&_mark]:px-0.5 [&_mark]:text-foreground">
                                          {parse(
                                            DOMPurify.sanitize(previewHtml, {
                                              ADD_ATTR: ["target", "rel"],
                                            })
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="rounded-lg bg-muted/50 px-3 py-2 text-muted-foreground text-sm">
                                        No text content
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </ScrollArea>

                      {hasMore ? (
                        <div className="border-t p-2">
                          <Button
                            className="w-full"
                            disabled={isLoading}
                            onClick={loadMore}
                            variant="ghost"
                          >
                            Load more results
                          </Button>
                        </div>
                      ) : null}
                    </>
                  );
                }

                return (
                  <div className="p-3">
                    <Empty className="border-muted/70 bg-muted/20 p-8">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <IconSearch className="h-5 w-5" />
                        </EmptyMedia>
                        <EmptyTitle className="text-base">
                          No messages found
                        </EmptyTitle>
                        <EmptyDescription>
                          Try another keyword.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </div>
                );
              })()}
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="relative"
                  onClick={toggleMentionsSidebar}
                  size="icon-sm"
                  variant={mentionsOpen ? "secondary" : "ghost"}
                >
                  <IconAt />
                  {unreadMentionCount > 0 && (
                    <span className="pointer-events-none absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 font-semibold text-[10px] text-destructive-foreground leading-none">
                      {unreadMentionCount > 99 ? "99+" : unreadMentionCount}
                    </span>
                  )}
                </Button>
              }
            />
            <TooltipContent>Mentions</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  onClick={togglePinnedMessages}
                  size="icon-sm"
                  variant={isOpen ? "secondary" : "ghost"}
                >
                  <IconPinFilled />
                </Button>
              }
            />
            <TooltipContent>
              {isOpen ? "Close pinned messages" : "View pinned messages"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  onClick={toggleInfoSidebar}
                  size="icon-sm"
                  variant="ghost"
                >
                  <IconInfoCircleFilled />
                </Button>
              }
            />
            <TooltipContent>Channel Info</TooltipContent>
          </Tooltip>

          <Link
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            params={{ slug }}
            to="/org/$slug/workspace/communication/channels"
          >
            <IconX />
          </Link>
        </div>
      </div>
    </header>
  );
}

function SearchMessageResultItemSkeleton() {
  return (
    <div className="w-full rounded-xl border border-transparent p-3">
      <div className="flex items-start gap-3">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-18" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>

          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-8/12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
