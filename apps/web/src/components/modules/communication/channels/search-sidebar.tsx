import { IconLoader2, IconSearch } from "@tabler/icons-react";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useMessageSearch } from "@/hooks/communications/use-message-search";
import { useVirtualMessages } from "@/hooks/communications/use-messages";
import {
  useChannelMessageHighlight,
  useMessageThreadSidebar,
  useSearchSidebar,
} from "@/stores/channel-store";

export function SearchSidebar() {
  const { channelId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/$channelId",
  });

  const { isOpen, closeSearchSidebar } = useSearchSidebar();
  const { highlightMessage } = useChannelMessageHighlight();
  const { openMessageThread } = useMessageThreadSidebar();
  const { scrollToDate } = useVirtualMessages();
  const [query, setQuery] = useState("");

  const { results, isLoading, hasMore, loadMore } = useMessageSearch({
    channelId,
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
    <Sheet
      modal={false}
      onOpenChange={(open) => !open && closeSearchSidebar()}
      open={isOpen}
    >
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle className="font-semibold text-lg">
            Search Messages
          </SheetTitle>
          <InputGroup className="mt-4">
            <InputGroupAddon align="inline-start">
              {isLoading ? (
                <Spinner className="h-4 w-4 text-muted-foreground" />
              ) : (
                <IconSearch className="h-4 w-4 text-muted-foreground" />
              )}
            </InputGroupAddon>
            <InputGroupInput
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in channel..."
              value={query}
            />
          </InputGroup>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <IconLoader2 className="h-5 w-5 animate-spin" />
                <span className="ml-2">Searching...</span>
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No messages found for "{query}"
              </div>
            )}

            {!(isLoading || query) && (
              <div className="py-8 text-center text-muted-foreground text-sm">
                Type to search for messages
              </div>
            )}

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
                        <AvatarImage src={result.sender.image || undefined} />
                        <AvatarFallback>
                          {result.sender.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemHeader>
                        <ItemTitle>{result.sender.name}</ItemTitle>
                        <span className="text-muted-foreground text-xs">
                          {new Intl.DateTimeFormat("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                          }).format(new Date(result.createdAt))}
                        </span>
                      </ItemHeader>
                      <ItemDescription
                        className="[&>mark]:bg-yellow-200 [&>mark]:text-yellow-900 [&>mark]:dark:bg-yellow-900 [&>mark]:dark:text-yellow-200"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: Highlights contain safe <mark> tags from backend
                        dangerouslySetInnerHTML={{
                          __html: result.highlights[0] || result.content || "",
                        }}
                      />
                    </ItemContent>
                  </button>
                </Item>
              ))}
            </ItemGroup>

            {hasMore && (
              <Button
                className="w-full"
                disabled={isLoading}
                onClick={loadMore}
                variant="outline"
              >
                {isLoading ? (
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Load more
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
