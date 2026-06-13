import {
  IconArrowBackUp,
  IconAt,
  IconBell,
  IconBellFilled,
  IconCheck,
  IconChecks,
  IconEye,
  IconMail,
  IconMessage,
  IconMoodSmile,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@work-holo/ui/components/button";
import { ButtonGroup } from "@work-holo/ui/components/button-group";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@work-holo/ui/components/popover";
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@work-holo/ui/components/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@work-holo/ui/components/tooltip";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import {
  dmMessagesCollection,
  messagesCollection,
  usersCollection,
} from "@/db/collections";
import { useNotifications } from "@/hooks/communications/use-notifications";
import { cn } from "@/lib/utils";
import { useChannelMessageHighlight } from "@/stores/channel-store";

type NotificationType =
  | "channel_message"
  | "channel_reply"
  | "channel_reaction"
  | "channel_mention"
  | "dm_message"
  | "dm_reply"
  | "dm_reaction"
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
  channel_message: {
    icon: <IconMessage className="h-4 w-4" />,
    label: "New message in channel",
    tone: "text-muted-foreground",
    bgTone: "bg-muted/50",
    accentColor: "border-border/30",
    gradient: "from-muted/20 via-muted/10 to-transparent",
  },
  channel_reply: {
    icon: <IconArrowBackUp className="h-4 w-4" />,
    label: "Replied to your message",
    tone: "text-blue-600 dark:text-blue-400",
    bgTone: "bg-blue-500/10 dark:bg-blue-500/15",
    accentColor: "border-blue-400/30",
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
  },
  channel_reaction: {
    icon: <IconMoodSmile className="h-4 w-4" />,
    label: "Reacted to your message",
    tone: "text-purple-600 dark:text-purple-400",
    bgTone: "bg-purple-500/10 dark:bg-purple-500/15",
    accentColor: "border-purple-400/30",
    gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
  },
  channel_mention: {
    icon: <IconAt className="h-4 w-4" />,
    label: "Mentioned you",
    tone: "text-amber-600 dark:text-amber-400",
    bgTone: "bg-amber-500/10 dark:bg-amber-500/15",
    accentColor: "border-amber-400/30",
    gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
  },
  dm_message: {
    icon: <IconMail className="h-4 w-4" />,
    label: "Sent you a message",
    tone: "text-blue-600 dark:text-blue-400",
    bgTone: "bg-blue-500/10 dark:bg-blue-500/15",
    accentColor: "border-blue-400/30",
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
  },
  dm_reply: {
    icon: <IconArrowBackUp className="h-4 w-4" />,
    label: "Replied to your message",
    tone: "text-blue-600 dark:text-blue-400",
    bgTone: "bg-blue-500/10 dark:bg-blue-500/15",
    accentColor: "border-blue-400/30",
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
  },
  dm_reaction: {
    icon: <IconMoodSmile className="h-4 w-4" />,
    label: "Reacted to your message",
    tone: "text-purple-600 dark:text-purple-400",
    bgTone: "bg-purple-500/10 dark:bg-purple-500/15",
    accentColor: "border-purple-400/30",
    gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
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

function getNotificationMeta(type: string): NotificationConfig {
  return (
    notificationConfig[type as NotificationType] ?? notificationConfig.default
  );
}

function parseNotificationMetadata(
  metadata: unknown
): Record<string, unknown> | null {
  if (!metadata) {
    return null;
  }

  if (typeof metadata === "object") {
    return metadata as Record<string, unknown>;
  }

  return null;
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
          <TooltipTrigger
            render={
              <PopoverTrigger
                render={
                  <Button
                    className="group relative size-9 rounded-full transition-all duration-300 hover:bg-primary/5"
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
                        <IconBell className="h-5 w-5 text-foreground/70 transition-transform group-hover:scale-110 group-hover:text-foreground" />
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-bold text-[10px] text-primary-foreground shadow-sm ring-2 ring-background">
                      {unreadCount > 99 ? "99+" : unreadCount}
                      {unreadCount > 0 && (
                        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary opacity-50" />
                      )}
                    </div>
                  </Button>
                }
              />
            }
          />
          <TooltipContent className="font-medium" side="bottom">
            <p>
              Notifications
              {unreadCount > 0 && ` (${unreadCount})`}
            </p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent
          align="end"
          className="flex max-h-[calc(100vh-2rem)] w-140 flex-col overflow-hidden rounded-xl border border-border/50 bg-background/95 p-0 shadow-black/5 shadow-xl backdrop-blur-xl"
          sideOffset={8}
        >
          <div className="flex items-center justify-between border-border/40 border-b bg-background/50 px-4 py-3 backdrop-blur-md">
            <h2 className="font-semibold text-base text-foreground tracking-tight">
              Notifications
            </h2>
            <ToggleGroup
              className="rounded-lg bg-muted/50 p-0.5"
              onValueChange={(value) => {
                if (value.length) setFilter(value[0] as FilterType);
              }}
              value={filter ? [filter] : []}
              variant="outline"
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="unread">
                Unread
                {unreadCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/10 px-1 font-semibold text-[10px] text-primary">
                    {unreadCount}
                  </span>
                )}
              </ToggleGroupItem>
              <ToggleGroupItem value="read">Read</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <NotificationContent
              filter={filter}
              groupedNotifications={groupedNotifications}
              isLoading={isLoading}
              onClose={() => setOpen(false)}
              onMarkAsRead={handleMarkAsRead}
            />
          </ScrollArea>

          <div className="flex items-center justify-between border-border/40 border-t bg-background/50 px-4 py-2 backdrop-blur-md">
            <p className="text-muted-foreground text-sm">
              {filteredNotifications.length}{" "}
              {filteredNotifications.length === 1
                ? "notification"
                : "notifications"}
            </p>
            <ButtonGroup className="rounded-md">
              <Button
                disabled={unreadCount === 0}
                onClick={handleMarkAllAsRead}
                variant="ghost"
              >
                <IconChecks />
                <span>Mark all as read</span>
              </Button>
              <Button variant="ghost">
                <IconEye />
                <span>View all</span>
              </Button>
            </ButtonGroup>
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
    <div className="flex flex-col pb-2">
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
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/80 px-4 py-2 backdrop-blur-md">
        <span className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {label}{" "}
          <span className="text-muted-foreground/50">
            ({notifications.length})
          </span>
        </span>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      <div className="flex flex-col">
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

  const metadata = parseNotificationMetadata(notification.metadata);
  const senderId = metadata?.senderId;
  const sender =
    typeof senderId === "string" ? usersCollection.get(senderId) : undefined;
  const actor = notification.actorId
    ? usersCollection.get(notification.actorId)
    : undefined;

  const actorName =
    (metadata?.senderName as string) ??
    (metadata?.replySenderName as string) ??
    (metadata?.reactorName as string) ??
    (metadata?.mentionedByName as string) ??
    (metadata?.actorName as string) ??
    sender?.name ??
    actor?.name ??
    "Someone";

  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead({ notificationId: notification.id });
    }

    if (!notification.entityId || typeof slug !== "string") return;

    const isChannelEvent = notification.type.startsWith("channel_");
    const isDmEvent = notification.type.startsWith("dm_");

    if (isChannelEvent) {
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
    } else if (isDmEvent) {
      const message = dmMessagesCollection.get(notification.entityId);

      if (message) {
        onClose();
        navigate({
          to: "/org/$slug/workspace/communication/dm/$conversationId",
          params: {
            slug,
            conversationId: message.conversationId,
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
        "group flex items-start gap-3 px-4 py-3 transition-all duration-200",
        isUnread ? "bg-primary/3 hover:bg-primary/6" : "hover:bg-muted/40",
        isUnread && "border-l-[3px] border-l-primary"
      )}
    >
      <div className="mt-0.5 shrink-0">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105",
            meta.bgTone
          )}
        >
          <span className={cn(meta.tone)}>{meta.icon}</span>
        </div>
      </div>

      <button
        className="flex min-w-0 flex-1 flex-col gap-0.5 text-left"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <span
          className={cn(
            "truncate font-semibold text-[15px]",
            isUnread ? "text-foreground" : "text-foreground/70"
          )}
        >
          {actorName}
        </span>

        {notification.message && (
          <p
            className={cn(
              "line-clamp-2 text-sm leading-snug",
              isUnread ? "text-foreground/85" : "text-muted-foreground"
            )}
          >
            {parse(DOMPurify.sanitize(notification.message))}
          </p>
        )}

        <span className="text-[11px] text-muted-foreground/70 tabular-nums">
          {formatTimeAgo(new Date(notification.createdAt))}
        </span>
      </button>

      {isUnread && (
        <Button
          className="h-8 w-8 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          onClick={handleMarkAsReadClick}
          size="icon"
          variant="ghost"
        >
          <IconCheck className="h-4 w-4" />
        </Button>
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
    <Empty className="h-full min-h-64 border-0">
      <EmptyHeader className="gap-3">
        <EmptyMedia
          className="h-12 w-12 rounded-full bg-muted/50"
          variant="icon"
        >
          <IconBell className="h-6 w-6 text-muted-foreground/50" />
        </EmptyMedia>
        <div className="space-y-1">
          <EmptyTitle className="font-medium text-foreground text-sm">
            {title}
          </EmptyTitle>
          <EmptyDescription className="max-w-50 text-muted-foreground text-xs">
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
          <div className="flex items-center gap-3 px-4 py-2">
            <Skeleton className="h-3 w-16 rounded-sm" />
            <div className="h-px flex-1 bg-border/40" />
          </div>

          <div className="flex flex-col">
            {([0, 1, 2] as const).map((itemIndex) => (
              <div className="flex items-start gap-3 px-4 py-3" key={itemIndex}>
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-0.5">
                  <Skeleton className="h-4 w-32 rounded-sm" />
                  <Skeleton className="h-3.5 w-full rounded-sm" />
                  <Skeleton className="h-3 w-20 rounded-sm" />
                </div>
                <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
