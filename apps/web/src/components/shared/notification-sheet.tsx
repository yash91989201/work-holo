import { AtSign, Bell, Mail, MessageSquare, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
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
import { useNotifications } from "@/hooks/communications/use-notifications";
import { cn } from "@/lib/utils";

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
    <Sheet>
      <SheetTrigger asChild>
        <Button className="relative" size="icon" variant="ghost">
          <Bell className="h-4 w-4" />
          {triggerBadge}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay on top of mentions, invites, and messages.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
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
              <ItemGroup className="gap-3 p-3">
                {notifications.map((notification) => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </ItemGroup>
            );
          })()}
        </div>
      </SheetContent>
    </Sheet>
  );
}

type NotificationListItemProps = {
  notification: ReturnType<typeof useNotifications>["notifications"][number];
  onMarkAsRead: (input: { notificationId: string }) => void;
};

function NotificationListItem({
  notification,
  onMarkAsRead,
}: NotificationListItemProps) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const hasMarkedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (notification.status !== "unread" || hasMarkedRef.current) return;

    const node = itemRef.current;

    if (!node || typeof IntersectionObserver === "undefined") return;

    const handleInView = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && !hasMarkedRef.current) {
        timeoutRef.current = window.setTimeout(() => {
          hasMarkedRef.current = true;
          onMarkAsRead({ notificationId: notification.id });
        }, 2000);
      } else if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const observer = new IntersectionObserver(handleInView, {
      threshold: 0.5,
    });

    observer.observe(node);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      observer.disconnect();
    };
  }, [notification.id, notification.status, onMarkAsRead]);

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
      <div ref={itemRef}>
        <ItemMedia className="mt-1" variant="icon">
          {getNotificationIcon(notification.type)}
        </ItemMedia>
        <ItemContent>
          <div className="flex items-center gap-2">
            <ItemTitle>{notification.title}</ItemTitle>
            <Badge className="text-[10px]" variant="outline">
              {notification.type.replace("_", " ")}
            </Badge>
          </div>
          {notification.message && (
            <ItemDescription>{notification.message}</ItemDescription>
          )}
        </ItemContent>
        <span className="whitespace-nowrap text-muted-foreground text-xs">
          {formatTimeAgo(new Date(notification.createdAt))}
        </span>
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
