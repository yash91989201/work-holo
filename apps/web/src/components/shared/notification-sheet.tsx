import { useNavigate, useParams } from "@tanstack/react-router";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { AtSign, Bell, Mail, MessageSquare, Users } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { messagesCollection } from "@/db/collections";
import { useNotifications } from "@/hooks/communications/use-notifications";
import { cn } from "@/lib/utils";
import { useChannelMessageHighlight } from "@/stores/channel-store";
import { ScrollArea } from "../ui/scroll-area";

function getNotificationIcon(type: string) {
  switch (type) {
    case "mention":
      return <AtSign className="h-4 w-4" />;
    case "channel_invite":
      return <Users className="h-4 w-4" />;
    case "direct_message":
      return <Mail className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
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
  const { notifications, unreadCount, isLoading, markNotificationAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);

  const handleMarkAsRead = useCallback(
    (input: { notificationId: string }) => markNotificationAsRead(input),
    [markNotificationAsRead]
  );

  const triggerBadge = useMemo(
    () =>
      unreadCount > 0 ? (
        <span className="-right-1 -top-1 pointer-events-none absolute inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-semibold text-[10px] text-destructive-foreground leading-none">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null,
    [unreadCount]
  );

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="relative" size="icon" variant="ghost">
          <Bell className="h-4 w-4" />
          {triggerBadge}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay on top of mentions, invites, and messages.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {(() => {
            if (isLoading) {
              return <NotificationListSkeleton />;
            }

            if (notifications.length === 0) {
              return (
                <div className="rounded-lg border bg-muted/40 p-4 text-center text-muted-foreground text-sm">
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

        navigate({
          to: "/org/$slug/communication/channels/$id",
          params: { slug, id: message.channelId },
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
