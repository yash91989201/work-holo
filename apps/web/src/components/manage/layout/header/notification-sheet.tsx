import {
  IconAt,
  IconBell,
  IconBellFilled,
  IconCheck,
  IconChecks,
  IconFilter,
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
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  icon: React.ReactNode;
  label: string;
  linear: string;
  borderColor: string;
}

const notificationConfig: Record<NotificationType, NotificationConfig> = {
  mention: {
    icon: <IconAt className="h-4 w-4" />,
    label: "Mentioned you",
    linear: "from-amber-500/20 to-orange-500/10",
    borderColor: "border-amber-500/30",
  },
  channel_invite: {
    icon: <IconUsers className="h-4 w-4" />,
    label: "Invited you",
    linear: "from-emerald-500/20 to-teal-500/10",
    borderColor: "border-emerald-500/30",
  },
  direct_message: {
    icon: <IconMail className="h-4 w-4" />,
    label: "Sent a message",
    linear: "from-blue-500/20 to-indigo-500/10",
    borderColor: "border-blue-500/30",
  },
  default: {
    icon: <IconMessage className="h-4 w-4" />,
    label: "Notification",
    linear: "from-slate-500/20 to-gray-500/10",
    borderColor: "border-slate-500/30",
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

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d`;

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

  const currentFilterLabel =
    filterOptions.find((f) => f.value === filter)?.label ?? "All notifications";

  return (
    <TooltipProvider>
      <Popover onOpenChange={setOpen} open={open}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                className="relative size-10 rounded-xl border border-border/60 bg-background shadow-sm transition-all duration-200 hover:border-border hover:bg-muted/50 hover:shadow-md active:scale-95"
                size="icon-lg"
                variant="ghost"
              >
                <IconBellFilled className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                {unreadCount > 0 && (
                  <span className="zoom-in-50 pointer-events-none absolute -top-1 -right-1 flex h-5 min-w-5 animate-in items-center justify-center rounded-full bg-linear-to-br from-red-500 to-rose-600 px-1 font-semibold text-[10px] text-white shadow-lg ring-2 ring-background duration-300">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          align="end"
          className="w-120 overflow-hidden rounded-2xl border-border/60 p-0 shadow-2xl"
          sideOffset={8}
        >
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative overflow-hidden bg-linear-to-br from-primary/5 via-primary/3 to-background px-5 py-4">
              <div className="absolute inset-0 bg-[radial-linear(circle_at_top_right,theme(colors.primary.500/0.1),transparent_50%)]" />
              <div className="relative flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-lg">
                  Notifications
                </h3>
                <ButtonGroup>
                  <Button
                    className="h-9 gap-2 rounded-lg font-medium text-xs"
                    disabled={unreadCount === 0}
                    onClick={handleMarkAllAsRead}
                    size="sm"
                    variant="outline"
                  >
                    <IconChecks className="h-4 w-4" />
                    Mark all
                  </Button>
                  <ButtonGroupSeparator />

                  {/* Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="h-9 gap-2 rounded-lg font-medium text-xs"
                        size="sm"
                        variant="outline"
                      >
                        <IconFilter className="h-3.5 w-3.5" />
                        {currentFilterLabel}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {filterOptions.map((option) => (
                        <DropdownMenuCheckboxItem
                          checked={filter === option.value}
                          key={option.value}
                          onCheckedChange={() => setFilter(option.value)}
                        >
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={filter === "all"}
                        onCheckedChange={() => setFilter("all")}
                      >
                        Reset filter
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ButtonGroup>
              </div>
            </div>

            <ScrollArea className="max-h-100">
              <div className="p-2">
                <NotificationContent
                  filter={filter}
                  groupedNotifications={groupedNotifications}
                  isLoading={isLoading}
                  onClose={() => setOpen(false)}
                  onMarkAsRead={handleMarkAsRead}
                />
              </div>
            </ScrollArea>

            <div className="border-t bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">
                  Showing {filteredNotifications.length} of{" "}
                  {notifications.length}
                </span>
                <Button
                  className="h-auto gap-1.5 p-0 font-medium text-primary text-xs hover:text-primary/80"
                  variant="link"
                >
                  View all
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

interface NotificationContentProps {
  filter: string;
  isLoading: boolean;
  groupedNotifications: Record<
    TimeGroup,
    ReturnType<typeof useNotifications>["notifications"]
  >;
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
    <div className="space-y-1">
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
    <div className="py-1">
      <div className="sticky top-0 z-10 mb-2 flex items-center gap-2 bg-background/95 px-3 py-1.5 backdrop-blur-sm">
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          {label}
        </span>
        <Separator className="flex-1" />
        <Badge
          className="h-5 border-border/40 bg-muted px-1.5 font-medium text-[10px] text-muted-foreground"
          variant="outline"
        >
          {notifications.length}
        </Badge>
      </div>
      <div className="space-y-0.5">
        {notifications.map((notification, index) => (
          <NotificationItem
            index={index}
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
  index: number;
  notification: ReturnType<typeof useNotifications>["notifications"][number];
  onMarkAsRead: (input: { notificationId: string }) => void;
  onClose: () => void;
};

function NotificationItem({
  index,
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
          to: "/org/$slug/workspace/teams/$teamId/communication/channels/$channelId",
          params: { slug, teamId: "", channelId: message.channelId },
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
    <Item
      asChild
      className={cn(
        "group relative cursor-pointer transition-all duration-200 hover:translate-x-0.5 hover:shadow-md",
        isUnread
          ? cn(
              "border-primary/20 bg-linear-to-r from-primary/5 to-transparent shadow-sm",
              "hover:border-primary/30 hover:from-primary/2 hover:to-primary/2"
            )
          : "border-transparent bg-transparent hover:bg-muted/40"
      )}
      style={{
        animationDelay: `${index * 30}ms`,
      }}
      variant={isUnread ? "outline" : "default"}
    >
      <button onClick={handleClick} onKeyDown={handleKeyDown} type="button">
        {/* Unread indicator */}
        {isUnread && (
          <span className="zoom-in absolute top-4 left-1.5 h-2.5 w-2.5 animate-in rounded-full bg-primary shadow-primary/30 shadow-sm ring-2 ring-background duration-300" />
        )}

        {/* Icon Container */}
        <ItemMedia
          className={cn(
            "relative size-10 overflow-hidden rounded-xl border shadow-sm transition-transform duration-200 group-hover:scale-105",
            meta.borderColor,
            isUnread ? "bg-linear-to-br" : "bg-muted",
            isUnread ? meta.linear : ""
          )}
          variant="default"
        >
          <span
            className={cn(
              "transition-colors duration-200",
              isUnread ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {meta.icon}
          </span>
        </ItemMedia>

        {/* Content */}
        <ItemContent className="pt-0.5">
          {/* Header row */}
          <ItemHeader>
            <div className="flex items-center gap-2 overflow-hidden">
              <ItemTitle
                className={cn(
                  isUnread ? "text-foreground" : "text-foreground/70"
                )}
              >
                {notification.title}
              </ItemTitle>
              {isUnread && (
                <Badge
                  className="zoom-in h-5 shrink-0 animate-in border-primary/20 bg-primary/10 px-1.5 font-semibold text-[10px] text-primary"
                  variant="outline"
                >
                  NEW
                </Badge>
              )}
            </div>
            <span className="mt-0.5 shrink-0 text-muted-foreground text-xs tabular-nums">
              {formatTimeAgo(new Date(notification.createdAt))}
            </span>
          </ItemHeader>

          {/* Type label */}
          <p className="mt-0.5 text-muted-foreground text-xs">{meta.label}</p>

          {/* Message preview */}
          {notification.message && (
            <ItemDescription className="mt-1.5 text-muted-foreground/80 text-xs leading-relaxed">
              {parse(DOMPurify.sanitize(notification.message))}
            </ItemDescription>
          )}

          {/* Actions */}
          <div
            className={cn(
              "mt-2 flex items-center gap-1 transition-all duration-200",
              isUnread ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            {isUnread && (
              <Button
                className="h-7 gap-1.5 rounded-lg border-border/40 bg-background px-2.5 font-medium text-[11px] text-muted-foreground shadow-sm hover:text-foreground"
                onClick={handleMarkAsReadClick}
                size="sm"
                variant="outline"
              >
                <IconCheck className="h-3.5 w-3.5" />
                Mark read
              </Button>
            )}
          </div>
        </ItemContent>
      </button>
    </Item>
  );
}

function EmptyState({ filter }: { filter: string }) {
  const messages: Record<string, { title: string; description: string }> = {
    all: {
      title: "No notifications",
      description: "You're all caught up! Check back later.",
    },
    unread: {
      title: "No unread notifications",
      description: "You've read everything!",
    },
    read: {
      title: "No read notifications",
      description: "Notifications you mark as read will appear here.",
    },
  };

  const { title, description } = messages[filter] ?? messages.all;

  return (
    <Empty className="border-0 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBell className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function NotificationListSkeleton() {
  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center gap-2 px-2">
        <Skeleton className="h-3 w-12 rounded-full" />
        <Skeleton className="h-px flex-1" />
        <Skeleton className="h-4 w-6 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="flex items-start gap-3 rounded-xl border border-border/40 p-3.5"
            key={index.toString()}
          >
            <Skeleton className="size-10 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-3 w-10 rounded-full" />
              </div>
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Keep old name for backward compatibility
export const NotificationSheet = NotificationDropdown;
export default NotificationDropdown;
