import { IconChecks } from "@tabler/icons-react";
import { eq, inArray, useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Button } from "@work-holo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@work-holo/ui/components/dialog";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Suspense, useMemo } from "react";
import {
  messageReadSummaryCollection,
  usersCollection,
} from "@/db/collections";
import { cn } from "@/lib/utils";
import { queryUtils } from "@/utils/orpc";

function formatReadTime(dateString: Date) {
  const date = new Date(dateString);
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return time;
  }

  const dateStr = date.toLocaleDateString([], {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

  return `${time} ${dateStr}`;
}

export function MessageReadReceipts({
  messageId,
  isOwnMessage,
  userId,
}: {
  messageId: string;
  isOwnMessage: boolean;
  userId: string;
}) {
  const { data: summaryResult } = useLiveQuery(
    (q) =>
      q
        .from({ summary: messageReadSummaryCollection })
        .where(({ summary }) => eq(summary.messageId, messageId)),
    [messageId]
  );

  const summary = summaryResult?.[0];
  const recentReaderIds = useMemo(
    () =>
      (summary?.recentReaders ?? [])?.filter(
        (readerId) => !isOwnMessage || readerId !== userId
      ),
    [summary?.recentReaders, isOwnMessage, userId]
  );

  const readCount = Math.max((summary?.readCount ?? 0) - 1, 0);

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
      <div className="flex -space-x-2 *:data-[slot=avatar]:size-6 *:data-[slot=avatar]:ring-1 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
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
      <DialogTrigger
        render={
          <Button size="icon-sm" variant="ghost">
            <IconChecks className="size-3.5" />
          </Button>
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Seen by {readCount}</DialogTitle>
          <DialogDescription>
            People who have seen this message
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <Suspense fallback={<MessageReadersList.Fallback />}>
            <MessageReadersList messageId={messageId} />
          </Suspense>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function MessageReadersList({ messageId }: { messageId: string }) {
  const { data: readers } = useSuspenseQuery(
    queryUtils.communication.message.getAllReaders.queryOptions({
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
    <ItemGroup>
      {readers.readers.map((reader) => (
        <Item key={reader.id}>
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
              {formatReadTime(reader.readAt)}
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
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
        <Item key={index}>
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

MessageReadersList.Fallback = MessageReadersListSkeleton;
