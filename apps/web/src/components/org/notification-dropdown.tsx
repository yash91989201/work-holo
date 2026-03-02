import {
  IconAt,
  IconBell,
  IconBellFilled,
  IconCheck,
  IconChecks,
  IconChevronRight,
  IconMail,
  IconMessage,
  IconUsers,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { messagesCollection } from "@/db/collections";
import { useNotifications } from "@/hooks/communications/use-notifications";
import { cn } from "@/lib/utils";
import { useChannelMessageHighlight } from "@/stores/channel-store";

type NotificationType =
  | "mention"
  | "channel_invite"
  | "direct_message"
  | "default";
type TimeGroup = "today" | "yesterday" | "earlier";
type FilterType = "all" | "unread" | "read";

interface NotificationConfig {
  accentColor: string;
  bgTone: string;
  gradient: string;
  icon: React.ReactNode;
  label: string;
  tone: string;
}

const notificationConfig: Record<NotificationType, NotificationConfig> = {
  mention: {
    icon: <IconAt className="h-4 w-4" />,
    label: "Mentioned you",
    tone: "text-amber-600 dark:text-amber-400",
    bgTone: "bg-amber-500/10 dark:bg-amber-500/15",
    accentColor: "border-amber-400/30",
    gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
  },
  channel_invite: {
    icon: <IconUsers className="h-4 w-4" />,
    label: "Invited you",
    tone: "text-emerald-600 dark:text-emerald-400",
    bgTone: "bg-emerald-500/10 dark:bg-emerald-500/15",
    accentColor: "border-emerald-400/30",
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
  },
  direct_message: {
    icon: <IconMail className="h-4 w-4" />,
    label: "Sent a message",
    tone: "text-blue-600 dark:text-blue-400",
    bgTone: "bg-blue-500/10 dark:bg-blue-500/15",
    accentColor: "border-blue-400/30",
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
  },
  default: {
    icon: <IconMessage className="h-4 w-4" />,
    label: "Notification",
    tone: "text-muted-foreground",
    bgTone: "bg-muted/50",
    accentColor: "border-border/30",
    gradient: "from-muted/20 via-muted/10 to-transparent",
  },
};

const filterOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

function getNotificationMeta(type: string): NotificationConfig {
  return (
    notificationConfig[type as NotificationType] ?? notificationConfig.default
  );
}

function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getTimeGroup(date: Date): TimeGroup {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInDays = Math.floor(
    (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "yesterday";
  return "earlier";
}

function groupNotificationsByTime<T extends { createdAt: string | Date }>(
  notifications: T[]
): Record<TimeGroup, T[]> {
  return notifications.reduce(
    (groups, notification) => {
      const group = getTimeGroup(new Date(notification.createdAt));
      groups[group].push(notification);
      return groups;
    },
    { today: [], yesterday: [], earlier: [] } as Record<TimeGroup, T[]>
  );
}

export function NotificationDropdown() {
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

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;
    if (filter === "unread") {
      filtered = notifications.filter((n) => n.status === "unread");
    } else if (filter === "read") {
      filtered = notifications.filter((n) => n.status === "read");
    }
    return filtered;
  }, [notifications, filter]);

  const groupedNotifications = useMemo(
    () => groupNotificationsByTime(filteredNotifications),
    [filteredNotifications]
  );

  return (
    <TooltipProvider>
      <Popover onOpenChange={setOpen} open={open}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                className="group relative size-10 rounded-xl bg-linear-to-br from-primary/5 to-primary/0 shadow-lg shadow-primary/5 transition-all duration-300 hover:scale-105 hover:shadow-primary/10 hover:shadow-xl"
                size="icon"
                variant="ghost"
              >
                <div
                  className={cn(
                    "relative transition-transform duration-300",
                    open && "rotate-12"
                  )}
                >
                  {unreadCount > 0 ? (
                    <IconBellFilled className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  ) : (
                    <IconBell className="h-5 w-5 text-foreground/60 transition-transform group-hover:scale-110 group-hover:text-foreground" />
                  )}
                </div>
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-linear-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-linear-to-br from-red-500 to-red-600 opacity-50" />
                  </>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent className="font-medium" side="bottom">
            <p>
              Notifications
              {unreadCount > 0 && ` (${unreadCount})`}
            </p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent
          align="end"
          className="w-[24rem] overflow-hidden rounded-2xl border border-border/40 bg-background/95 p-0 shadow-2xl shadow-primary/5 backdrop-blur-xl"
          sideOffset={12}
        >
          <div className="relative overflow-hidden border-border/40 border-b">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-primary/0 to-transparent" />
            <div className="relative px-5 pt-5 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <h2 className="font-bold text-foreground text-xl tracking-tight">
                      Notifications
                    </h2>
                    {unreadCount > 0 && (
                      <Badge
                        className="h-6 rounded-full bg-linear-to-r from-primary to-primary/80 font-bold text-[10px] uppercase tracking-wider"
                        variant="default"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                      : "You're all caught up"}
                  </p>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-9 w-9 rounded-lg bg-background/60 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                      disabled={unreadCount === 0}
                      onClick={handleMarkAllAsRead}
                      size="icon"
                      variant="ghost"
                    >
                      <IconChecks className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Mark all as read</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="mt-4 flex gap-2">
                {filterOptions.map((option) => (
                  <button
                    className={cn(
                      "relative overflow-hidden rounded-lg px-3 py-1.5 font-medium text-xs transition-all duration-200",
                      "border",
                      filter === option.value
                        ? "border-primary/50 bg-primary/10 text-primary shadow-primary/10 shadow-sm"
                        : "border-border/40 bg-background/60 text-muted-foreground hover:border-border/60 hover:bg-background hover:text-foreground"
                    )}
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    type="button"
                  >
                    {option.label}
                    {option.value === "unread" && unreadCount > 0 && (
                      <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ScrollArea className="h-112">
            <NotificationContent
              filter={filter}
              groupedNotifications={groupedNotifications}
              isLoading={isLoading}
              onClose={() => setOpen(false)}
              onMarkAsRead={handleMarkAsRead}
            />
          </ScrollArea>

          <div className="flex items-center justify-between border-border/40 border-t bg-muted/30 px-5 py-3">
            <span className="font-medium text-[11px] text-muted-foreground/70">
              {filteredNotifications.length}{" "}
              {filteredNotifications.length === 1 ? "item" : "items"}
            </span>
            <Button
              className="h-7 gap-1.5 rounded-lg px-2.5 font-medium text-muted-foreground text-xs transition-all hover:bg-primary/5 hover:text-foreground"
              variant="ghost"
            >
              View all
              <IconChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

interface NotificationContentProps {
  filter: string;
  groupedNotifications: Record<
    TimeGroup,
    ReturnType<typeof useNotifications>["notifications"]
  >;
  isLoading: boolean;
  onClose: () => void;
  onMarkAsRead: (input: { notificationId: string }) => void;
}

function NotificationContent({
  filter,
  isLoading,
  groupedNotifications,
  onClose,
  onMarkAsRead,
}: NotificationContentProps) {
  if (isLoading) {
    return <NotificationListSkeleton />;
  }

  const hasNotifications = Object.values(groupedNotifications).some(
    (group) => group.length > 0
  );

  if (!hasNotifications) {
    return <EmptyState filter={filter} />;
  }

  return (
    <div className="flex flex-col py-2">
      {groupedNotifications.today.length > 0 && (
        <TimeGroupSection
          label="Today"
          notifications={groupedNotifications.today}
          onClose={onClose}
          onMarkAsRead={onMarkAsRead}
        />
      )}
      {groupedNotifications.yesterday.length > 0 && (
        <TimeGroupSection
          label="Yesterday"
          notifications={groupedNotifications.yesterday}
          onClose={onClose}
          onMarkAsRead={onMarkAsRead}
        />
      )}
      {groupedNotifications.earlier.length > 0 && (
        <TimeGroupSection
          label="Earlier"
          notifications={groupedNotifications.earlier}
          onClose={onClose}
          onMarkAsRead={onMarkAsRead}
        />
      )}
    </div>
  );
}

interface TimeGroupSectionProps {
  label: string;
  notifications: ReturnType<typeof useNotifications>["notifications"];
  onClose: () => void;
  onMarkAsRead: (input: { notificationId: string }) => void;
}

function TimeGroupSection({
  label,
  notifications,
  onClose,
  onMarkAsRead,
}: TimeGroupSectionProps) {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-background/95 px-5 py-2 backdrop-blur-sm">
        <span className="font-bold text-[10px] text-muted-foreground/70 uppercase tracking-widest">
          {label}
        </span>
        <div className="h-px flex-1 bg-linear-to-r from-border/40 to-transparent" />
        <span className="font-medium text-[10px] text-muted-foreground/50">
          {notifications.length}
        </span>
      </div>

      <div className="flex flex-col gap-1 px-2 py-1">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={onClose}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </div>
  );
}

type NotificationItemProps = {
  notification: ReturnType<typeof useNotifications>["notifications"][number];
  onMarkAsRead: (input: { notificationId: string }) => void;
  onClose: () => void;
};

function NotificationItem({
  notification,
  onMarkAsRead,
  onClose,
}: NotificationItemProps) {
  const { highlightMessage } = useChannelMessageHighlight();
  const navigate = useNavigate();
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });
  const meta = getNotificationMeta(notification.type);
  const isUnread = notification.status === "unread";

  const handleClick = () => {
    if (isUnread) {
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
          to: "/org/$slug/workspace/communication/channels/$channelId",
          params: {
            slug,
            channelId: message.channelId,
          },
        });
      }
    }
  };

  const handleMarkAsReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead({ notificationId: notification.id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl transition-all duration-200",
        isUnread &&
          "border-l-2 border-l-primary bg-linear-to-r from-primary/5 via-primary/2 to-transparent"
      )}
    >
      <button
        className={cn(
          "flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200",
          isUnread ? "hover:bg-primary/8" : "hover:bg-muted/40"
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <div className="relative">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-200",
              meta.bgTone,
              meta.accentColor,
              "group-hover:scale-105 group-hover:shadow-lg",
              isUnread && "shadow-md"
            )}
          >
            <span className={cn(meta.tone)}>{meta.icon}</span>
          </div>
          {isUnread && (
            <div className="absolute -right-0.5 -bottom-0.5 flex h-3 w-3 items-center justify-center">
              <div className="h-2 w-2 animate-ping rounded-full bg-primary" />
              <div className="absolute h-2 w-2 rounded-full bg-primary" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "min-w-0 flex-1 truncate font-medium text-sm leading-snug",
                isUnread ? "text-foreground" : "text-foreground/70"
              )}
            >
              {notification.title}
            </span>
            <span className="ml-2 shrink-0 font-medium text-[10px] text-muted-foreground/50 tabular-nums">
              {formatTimeAgo(new Date(notification.createdAt))}
            </span>
          </div>

          <div
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium text-[10px] leading-none",
              meta.bgTone,
              meta.accentColor,
              meta.tone
            )}
          >
            {meta.label}
          </div>

          {notification.message && (
            <p className="line-clamp-2 text-muted-foreground/60 text-xs leading-relaxed">
              {parse(DOMPurify.sanitize(notification.message))}
            </p>
          )}
        </div>
      </button>

      {isUnread && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-label="Mark as read"
              className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-background/80 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-150 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100"
              onClick={handleMarkAsReadClick}
              type="button"
            >
              <IconCheck className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Mark as read</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function EmptyState({ filter }: { filter: string }) {
  const messages: Record<string, { title: string; description: string }> = {
    all: {
      title: "No notifications",
      description: "You're all caught up! Check back later for updates.",
    },
    unread: {
      title: "No unread notifications",
      description:
        "You've read everything! Great job staying on top of things.",
    },
    read: {
      title: "No read notifications",
      description: "Notifications you mark as read will appear here.",
    },
  };

  const { title, description } = messages[filter] ?? messages.all;

  return (
    <Empty className="h-full min-h-80 border-0">
      <EmptyHeader className="gap-4">
        <EmptyMedia
          className="h-16 w-16 rounded-2xl bg-linear-to-br from-primary/10 to-primary/0 shadow-lg shadow-primary/5 ring-1 ring-border/30"
          variant="icon"
        >
          <IconBell className="h-8 w-8 text-primary/40" />
        </EmptyMedia>
        <div className="space-y-1.5">
          <EmptyTitle className="font-semibold text-base tracking-tight">
            {title}
          </EmptyTitle>
          <EmptyDescription className="max-w-56 text-sm">
            {description}
          </EmptyDescription>
        </div>
      </EmptyHeader>
    </Empty>
  );
}

function NotificationListSkeleton() {
  return (
    <div className="flex flex-col py-2">
      {([0, 1] as const).map((groupIndex) => (
        <div className="flex flex-col" key={groupIndex}>
          <div className="flex items-center gap-2 px-5 py-2">
            <Skeleton className="h-2.5 w-16 rounded-full" />
            <div className="h-px flex-1 bg-linear-to-r from-border/40 to-transparent" />
            <Skeleton className="h-2.5 w-4 rounded-full" />
          </div>

          <div className="flex flex-col gap-1 px-2 py-1">
            {([0, 1, 2] as const).map((itemIndex) => (
              <div
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                key={itemIndex}
              >
                <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-3.5 w-32 rounded-full" />
                    <Skeleton className="h-2.5 w-10 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="mt-0.5 h-2.5 w-full rounded-full" />
                  <Skeleton className="h-2.5 w-3/4 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
