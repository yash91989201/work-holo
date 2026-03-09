import { IconLoader2, IconSearch, IconX } from "@tabler/icons-react";
import { useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useDmMessageSearch } from "@/hooks/communications/dm/use-dm-message-search";
import { useVirtualDmMessages } from "@/hooks/communications/dm/use-dm-messages";
import {
  useDmMessageHighlight,
  useDmMessageThreadSidebar,
  useDmSearchSidebar,
} from "@/stores/dm-store";

export function DmSearchSidebar() {
  const { isOpen, closeSearchSidebar } = useDmSearchSidebar();
  const { highlightMessage } = useDmMessageHighlight();
  const { openMessageThread } = useDmMessageThreadSidebar();
  const { scrollToDate } = useVirtualDmMessages();
  const { conversationId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId",
  });

  const [query, setQuery] = useState("");

  const { results, isLoading, hasMore, loadMore, total } = useDmMessageSearch({
    conversationId,
    query,
    enabled: isOpen,
  });

  const handleResultClick = (result: (typeof results)[0]) => {
    closeSearchSidebar();

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

  return (
    <Sheet onOpenChange={(open) => !open && closeSearchSidebar()} open={isOpen}>
      <SheetContent
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        showCloseButton={false}
      >
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle>Search Messages</SheetTitle>
            <Button
              className="h-8 w-8"
              onClick={closeSearchSidebar}
              size="icon"
              variant="ghost"
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
          <InputGroup className="mt-2">
            <InputGroupAddon align="inline-start">
              {isLoading ? (
                <Spinner className="h-4 w-4 text-muted-foreground" />
              ) : (
                <IconSearch className="h-4 w-4 text-muted-foreground" />
              )}
            </InputGroupAddon>
            <InputGroupInput
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in conversation..."
              value={query}
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => setQuery("")}
                  size="icon-xs"
                  variant="ghost"
                >
                  <IconX className="h-4 w-4" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {(() => {
            if (query.length === 0) {
              return (
                <div className="flex h-full items-center justify-center p-6 text-center text-muted-foreground text-sm">
                  Type to search for messages in this conversation
                </div>
              );
            }
            if (isLoading && results.length === 0) {
              return (
                <div className="flex h-full items-center justify-center">
                  <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              );
            }
            if (results.length === 0) {
              return (
                <div className="flex h-full items-center justify-center p-6 text-center text-muted-foreground text-sm">
                  No messages found matching "{query}"
                </div>
              );
            }
            return (
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-1 p-2">
                  <div className="px-2 py-1 font-medium text-muted-foreground text-xs">
                    {total} result{total === 1 ? "" : "s"}
                  </div>
                  <ItemGroup>
                    {results.map((result) => (
                      <Item
                        asChild
                        className="cursor-pointer"
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        variant="outline"
                      >
                        <button type="button">
                          <ItemMedia>
                            <Avatar className="size-8">
                              <AvatarImage
                                src={result.sender.image || undefined}
                              />
                              <AvatarFallback>
                                {result.sender.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </ItemMedia>
                          <ItemContent>
                            <ItemHeader>
                              <ItemTitle>{result.sender.name}</ItemTitle>
                              <span className="text-muted-foreground text-xs">
                                {format(
                                  new Date(result.createdAt),
                                  "MMM d, h:mm a"
                                )}
                              </span>
                            </ItemHeader>
                            <ItemDescription
                              className="[&>mark]:rounded-sm [&>mark]:bg-primary/20 [&>mark]:px-0.5 [&>mark]:text-foreground"
                              // biome-ignore lint/security/noDangerouslySetInnerHtml: Highlights are sanitized by the backend
                              dangerouslySetInnerHTML={{
                                __html:
                                  result.highlights[0] || result.content || "",
                              }}
                            />
                          </ItemContent>
                        </button>
                      </Item>
                    ))}
                  </ItemGroup>
                  {hasMore && (
                    <Button
                      className="mt-2 w-full"
                      disabled={isLoading}
                      onClick={loadMore}
                      variant="ghost"
                    >
                      {isLoading ? (
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Load more
                    </Button>
                  )}
                </div>
              </ScrollArea>
            );
          })()}
        </div>
      </SheetContent>
    </Sheet>
  );
}
