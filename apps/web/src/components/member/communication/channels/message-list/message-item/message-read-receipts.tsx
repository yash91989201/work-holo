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
  messageReadCollection,
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
  const { data: summaryResult } = useLiveQuery((q) =>
    q
      .from({ summary: messageReadSummaryCollection })
      .where(({ summary }) => eq(summary.messageId, messageId))
  );

  const { data: detailedReads } = useLiveQuery((q) =>
    q
      .from({ read: messageReadCollection })
      .where(({ read }) => eq(read.messageId, messageId))
      .select(({ read }) => ({
        userId: read.userId,
        readAt: read.readAt,
      }))
  );

  const summary = summaryResult?.[0];
  const summaryRecentReaderIds =
    (summary?.recentReaders ?? []).filter(
      (readerId) => !isOwnMessage || readerId !== userId
    ) ?? [];

  const summaryReadCount = Math.max(
    (summary?.readCount ?? 0) - (isOwnMessage ? 1 : 0),
    0
  );

  const sortedDetailedReads =
    detailedReads
      ?.slice()
      .sort(
        (a, b) => new Date(b.readAt).getTime() - new Date(a.readAt).getTime()
      ) ?? [];

  const detailedRecentReaderIds = sortedDetailedReads
    .map((read) => read.userId)
    .filter((readerId) => !isOwnMessage || readerId !== userId);

  const detailedReadCount = Math.max(
    (detailedReads?.length ?? 0) - (isOwnMessage ? 1 : 0),
    0
  );

  // Avatars: prefer recent list from summary (shows who read most recently for large channels).
  // Fallback to detailed list when summary is empty (small channels / before aggregation).
  const recentReaderIds =
    summaryRecentReaderIds.length > 0
      ? summaryRecentReaderIds
      : detailedRecentReaderIds;

  // Count: prefer detailed (authoritative for small channels), else summary.
  const readCount =
    detailedReadCount > 0 ? detailedReadCount : summaryReadCount;

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
