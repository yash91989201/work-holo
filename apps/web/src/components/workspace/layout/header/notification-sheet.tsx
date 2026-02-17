import {
  IconAt,
  IconBellFilled,
  IconMailFilled,
  IconMessageFilled,
  IconUsers,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { messagesCollection } from "@/db/collections";
import { useNotifications } from "@/hooks/communications/use-notifications";
import { cn } from "@/lib/utils";
import { useChannelMessageHighlight } from "@/stores/channel-store";

function getNotificationIcon(type: string) {
  switch (type) {
    case "mention":
      return <IconAt className="h-4 w-4" />;
    case "channel_invite":
      return <IconUsers className="h-4 w-4" />;
    case "direct_message":
      return <IconMailFilled className="h-4 w-4" />;
    default:
      return <IconMessageFilled className="h-4 w-4" />;
  }
}

function formatTimeAgo(date: Date) {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function NotificationSheet() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markNotificationAsRead,
    markAllAsRead,
    filter,
    setFilter,
  } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleMarkAsRead = useCallback(
    (input: { notificationId: string }) => markNotificationAsRead(input),
    [markNotificationAsRead]
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead({});
  }, [markAllAsRead]);

  const triggerBadge = useMemo(
    () =>
      unreadCount > 0 ? (
        <span className="pointer-events-none absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-semibold text-[10px] text-destructive-foreground leading-none">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null,
    [unreadCount]
  );

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          className="relative rounded-2xl border border-border"
          size="icon"
          variant="ghost"
        >
          <IconBellFilled className="h-4 w-4" />
          {triggerBadge}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col sm:max-w-md">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>
                Stay on top of mentions, invites, and messages.
              </SheetDescription>
            </div>
            {unreadCount > 0 && filter === "unread" && (
              <Button onClick={handleMarkAllAsRead} size="sm" variant="ghost">
                Mark all as read
              </Button>
            )}
          </div>

          <Tabs
            className="w-full"
            onValueChange={(value) =>
              setFilter(value as "all" | "unread" | "read")
            }
            value={filter}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 font-semibold text-[10px] text-primary-foreground leading-none">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
          </Tabs>
        </SheetHeader>
        <ScrollArea className="-mx-6 flex-1 px-6">
          {(() => {
            if (isLoading) {
              return <NotificationListSkeleton />;
            }

            if (notifications.length === 0) {
              return (
                <div className="m-3 rounded-lg border bg-muted/40 p-3 text-center text-muted-foreground text-sm">
                  You&apos;re all caught up. New notifications will appear here.
                </div>
              );
            }

            return (
              <ItemGroup className="gap-3 px-4">
                {notifications.map((notification) => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    onClose={() => setOpen(false)}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </ItemGroup>
            );
          })()}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

type NotificationListItemProps = {
  notification: ReturnType<typeof useNotifications>["notifications"][number];
  onMarkAsRead: (input: { notificationId: string }) => void;
  onClose: () => void;
};

function NotificationListItem({
  notification,
  onMarkAsRead,
  onClose,
}: NotificationListItemProps) {
  const { highlightMessage } = useChannelMessageHighlight();
  const navigate = useNavigate();
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const handleClick = () => {
    if (notification.status === "unread") {
      onMarkAsRead({ notificationId: notification.id });
    }

    if (
      notification.type === "mention" &&
      notification.entityId &&
      typeof slug === "string"
    ) {
      const message = messagesCollection.get(notification.entityId);

      if (message) {
        highlightMessage(notification.entityId);

        onClose();

        // TODO: Need teamId from the message or context to navigate correctly
        navigate({
          to: "/org/$slug/workspace/teams/$teamId/communication/channels/$channelId",
          params: { slug, teamId: "", channelId: message.channelId },
        });
      }
    }
  };

  return (
    <Item
      asChild
      className={cn(
        "items-start gap-3",
        notification.status === "unread" &&
          "bg-primary/5 ring-1 ring-primary/10"
      )}
      variant="outline"
    >
      <div className="flex flex-col">
        <div className="flex gap-3">
          <ItemMedia className="mt-1" variant="icon">
            {getNotificationIcon(notification.type)}
          </ItemMedia>
          <ItemContent>
            <div className="flex items-start justify-between gap-3">
              <ItemTitle>{notification.title}</ItemTitle>
              <span className="whitespace-nowrap text-muted-foreground text-xs">
                {formatTimeAgo(new Date(notification.createdAt))}
              </span>
            </div>
            {notification.message && (
              <ItemDescription>
                {parse(DOMPurify.sanitize(notification.message))}
              </ItemDescription>
            )}
          </ItemContent>
        </div>
        <div className="mt-3 flex justify-end">
          <ItemActions>
            <Button onClick={handleClick} size="sm" variant="ghost">
              View
            </Button>
            {notification.status === "unread" && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead({ notificationId: notification.id });
                }}
                size="sm"
                variant="ghost"
              >
                Mark as read
              </Button>
            )}
          </ItemActions>
        </div>
      </div>
    </Item>
  );
}

export function NotificationListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="flex items-start gap-3 rounded-lg border p-3"
          key={index.toString()}
        >
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-5/6" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
