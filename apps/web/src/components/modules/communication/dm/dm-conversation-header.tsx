import {
  IconInfoCircleFilled,
  IconPinFilled,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
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
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useDmConversations } from "@/hooks/communications/dm/use-dm-conversations";
import { useDmMessageSearch } from "@/hooks/communications/dm/use-dm-message-search";
import { useVirtualDmMessages } from "@/hooks/communications/dm/use-dm-messages";
import { useDmPresence } from "@/hooks/communications/dm/use-dm-presence";
import { cn } from "@/lib/utils";
import {
  useDmInfoSidebar,
  useDmMessageHighlight,
  useDmMessageThreadSidebar,
  useDmPinnedMessagesSidebar,
} from "@/stores/dm-store";

const SKELETON_ROW_KEYS = ["row-1", "row-2", "row-3"];

export function DmConversationHeader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const { conversationId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId",
  });
  const { slug } = useParams({ from: "/(authenticated)/org/$slug" });
  const navigate = useNavigate();

  const { conversations } = useDmConversations();
  const { isUserOnline } = useDmPresence(conversationId);
  const { isOpen: isPinsOpen, togglePinnedMessages } =
    useDmPinnedMessagesSidebar();
  const { isOpen: isInfoOpen, toggleInfoSidebar } = useDmInfoSidebar();
  const { highlightMessage } = useDmMessageHighlight();
  const { openMessageThread } = useDmMessageThreadSidebar();
  const { scrollToDate } = useVirtualDmMessages();

  const [query, setQuery] = useState("");

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherParticipant = conversation?.otherParticipant;
  const isOnline = otherParticipant ? isUserOnline(otherParticipant.id) : false;
  const hasQuery = query.trim().length > 0;

  const { results, isLoading, hasMore, loadMore } = useDmMessageSearch({
    conversationId,
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

  const handleResultClick = (result: (typeof results)[0]) => {
    setQuery("");

    scrollToDate(new Date(result.createdAt));

    setTimeout(() => {
      if (result.parentMessageId) {
        openMessageThread(result.parentMessageId);
        setTimeout(() => highlightMessage(result.id), 100);
      } else {
        highlightMessage(result.id);
      }
    }, 300);
  };

  const handleClose = () => {
    navigate({
      to: "/org/$slug/workspace/communication/dm",
      params: { slug },
    });
  };

  let popoverContent: ReactNode;

  if (isLoading) {
    popoverContent = (
      <ScrollArea className="max-h-[min(70vh,34rem)]">
        <div className="space-y-1 p-2">
          {SKELETON_ROW_KEYS.map((skeletonRowKey) => (
            <DmSearchMessageResultItemSkeleton key={skeletonRowKey} />
          ))}
        </div>
      </ScrollArea>
    );
  } else if (results.length > 0) {
    popoverContent = (
      <>
        <ScrollArea className="max-h-[min(70vh,34rem)]">
          <div className="space-y-1 p-2">
            {results.map((result) => {
              const previewHtml = result.highlights[0] || result.content || "";

              return (
                <button
                  className="w-full rounded-xl border border-transparent p-3 text-left transition-colors hover:border-border hover:bg-muted/40"
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  type="button"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={result.sender.image || undefined} />
                      <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-medium text-primary text-xs">
                        {result.sender.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {result.sender.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }).format(new Date(result.createdAt))}
                        </span>
                        {result.parentMessageId ? (
                          <Badge variant="secondary">Thread</Badge>
                        ) : null}
                      </div>

                      {previewHtml ? (
                        <div className="rounded-lg bg-muted/50 px-3 py-2">
                          <div className="ProseMirror prose-sm dark:prose-invert max-h-28 overflow-hidden break-words text-sm leading-relaxed [&_mark]:rounded-sm [&_mark]:bg-primary/20 [&_mark]:px-0.5 [&_mark]:text-foreground">
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
  } else {
    popoverContent = (
      <div className="p-3">
        <Empty className="border-muted/70 bg-muted/20 p-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconSearch className="h-5 w-5" />
            </EmptyMedia>
            <EmptyTitle className="text-base">No messages found</EmptyTitle>
            <EmptyDescription>Try another keyword.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="flex w-full items-center gap-3 px-3">
        {/* User info */}
        {otherParticipant && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  alt={otherParticipant.name}
                  src={otherParticipant.image || undefined}
                />
                <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-medium text-primary text-xs">
                  {otherParticipant.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background",
                  isOnline ? "bg-emerald-500" : "bg-muted-foreground/40"
                )}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight">
                {otherParticipant.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <Popover open={hasQuery}>
            <div className="w-44 sm:w-60 md:w-72" ref={anchorRef}>
              <InputGroup className="h-8 rounded-full bg-background">
                <InputGroupAddon>
                  <InputGroupText>
                    {isLoading ? <Spinner /> : <IconSearch />}
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
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

                    if (event.key === "Escape") {
                      setQuery("");
                      inputRef.current?.blur();
                    }
                  }}
                  placeholder="Search messages..."
                  ref={inputRef}
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
              className="w-[min(46rem,calc(100vw-1rem))] gap-0 overflow-hidden p-0"
              initialFocus={false}
              side="bottom"
              sideOffset={8}
            >
              {popoverContent}
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  onClick={togglePinnedMessages}
                  size="icon-sm"
                  variant={isPinsOpen ? "secondary" : "ghost"}
                >
                  <IconPinFilled />
                </Button>
              }
            />
            <TooltipContent>
              {isPinsOpen ? "Close pinned messages" : "View pinned messages"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  onClick={toggleInfoSidebar}
                  size="icon-sm"
                  variant={isInfoOpen ? "secondary" : "ghost"}
                >
                  <IconInfoCircleFilled />
                </Button>
              }
            />
            <TooltipContent>Conversation Info</TooltipContent>
          </Tooltip>

          <Button onClick={handleClose} size="icon-sm" variant="ghost">
            <IconX />
          </Button>
        </div>
      </div>
    </header>
  );
}

function DmSearchMessageResultItemSkeleton() {
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
