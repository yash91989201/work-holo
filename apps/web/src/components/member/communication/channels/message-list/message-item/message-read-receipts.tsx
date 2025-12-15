import { eq, inArray, useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCheck } from "lucide-react";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  messageReadSummaryCollection,
  usersCollection,
} from "@/db/collections";
import { cn } from "@/lib/utils";
import { queryUtils } from "@/utils/orpc";

export function MessageReadReceipts({
  messageId,
  isOwnMessage,
}: {
  messageId: string;
  isOwnMessage: boolean;
}) {
  const { data: summaryResult } = useLiveQuery((q) =>
    q
      .from({ summary: messageReadSummaryCollection })
      .where(({ summary }) => eq(summary.messageId, messageId))
  );

  const summary = summaryResult?.[0];
  const recentReaderIds = summary?.recentReaders ?? [];

  const { data: recentReaders } = useLiveQuery(
    (q) => {
      if (recentReaderIds.length === 0) {
        return q
          .from({ user: usersCollection })
          .where(({ user }) => eq(user.id, ""))
          .select(({ user }) => ({
            id: user.id,
            name: user.name,
            image: user.image,
          }));
      }

      return q
        .from({ user: usersCollection })
        .where(({ user }) => inArray(user.id, recentReaderIds))
        .select(({ user }) => ({
          id: user.id,
          name: user.name,
          image: user.image,
        }));
    },
    [recentReaderIds.join(",")]
  );

  const readCount = recentReaderIds.length;

  if (readCount === 0) {
    return null;
  }

  const displayedReaders = recentReaders.slice(0, 5) ?? [];

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-muted-foreground text-xs",
        isOwnMessage ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className="-space-x-2 flex *:data-[slot=avatar]:size-6 *:data-[slot=avatar]:ring-1 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
        {displayedReaders.map((reader) => (
          <Avatar key={reader.id}>
            <AvatarImage alt={reader.name} src={reader.image ?? undefined} />
            <AvatarFallback>
              {reader.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>

      {readCount > 0 && (
        <MessageReadersDialog messageId={messageId} readCount={readCount} />
      )}
    </div>
  );
}

function MessageReadersDialog({
  readCount,
  messageId,
}: {
  readCount: number;
  messageId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="ghost">
          <CheckCheck className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Seen by {readCount}</DialogTitle>
          <DialogDescription>
            People who have seen this message
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <Suspense fallback={<MessageReadersListSkeleton />}>
            <MessageReadersList messageId={messageId} />
          </Suspense>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function MessageReadersList({ messageId }: { messageId: string }) {
  const { data: readers } = useSuspenseQuery(
    queryUtils.communication.message.getAllMessageReaders.queryOptions({
      input: { messageId },
    })
  );

  if (!readers || readers.readers.length === 0) {
    return (
      <Item>
        <ItemContent>
          <ItemTitle>No readers yet</ItemTitle>
          <ItemDescription>
            People who have seen this message will appear here
          </ItemDescription>
        </ItemContent>
      </Item>
    );
  }

  return (
    <ItemGroup className="gap-3">
      {readers.readers.map((reader) => (
        <Item className="p-0" key={reader.id}>
          <ItemMedia>
            <Avatar className="h-8 w-8">
              <AvatarImage alt={reader.name} src={reader.image || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {reader.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-sm">{reader.name}</ItemTitle>
            <ItemDescription className="text-xs">
              {reader.email}
            </ItemDescription>
          </ItemContent>
          <ItemContent className="flex-none text-right">
            <ItemDescription className="text-xs">
              {new Date(reader.readAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}

function MessageReadersListSkeleton() {
  return (
    <ItemGroup>
      {Array.from({ length: 5 }).map((_, index) => (
        <Item key={index.toString()}>
          <ItemMedia>
            <Skeleton className="h-8 w-8 rounded-full" />
          </ItemMedia>
          <ItemContent>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-32" />
          </ItemContent>
          <ItemContent className="flex-none text-right">
            <Skeleton className="h-2 w-12" />
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
