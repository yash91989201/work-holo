import { IconBell, IconMail, IconVolume } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import type { NotificationEventType } from "@work-holo/api/services/notification/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@work-holo/ui/components/select";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Switch } from "@work-holo/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@work-holo/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@work-holo/ui/components/tooltip";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { queryClient, queryUtils } from "@/utils/orpc";
import { CHANNEL_EVENTS, DM_EVENTS, EVENT_TYPES } from "./constants";

export function EmailNotifications() {
  const { data: preferences } = useSuspenseQuery(
    queryUtils.notification.getPreferences.queryOptions({ input: {} })
  );

  const updatePreference = useMutation(
    queryUtils.notification.updatePreference.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryUtils.notification.getPreferences.queryKey({
            input: {},
          }),
        });
      },
    })
  );

  const { isSubscribed, isSupported } = usePushNotifications();
  const { isGranted } = useNotificationPermission();
  const isDesktopReady = isGranted && isSubscribed && isSupported;

  const handleToggle = (
    eventType: NotificationEventType,
    deliveryChannel: "sound" | "push",
    enabled: boolean
  ) => {
    updatePreference.mutate({ eventType, deliveryChannel, enabled });
  };

  const handleEmailChange = (
    eventType: NotificationEventType,
    value: "off" | "immediate" | "15min" | "hourly" | "daily"
  ) => {
    if (value === "off") {
      updatePreference.mutate({
        eventType,
        deliveryChannel: "email",
        enabled: false,
      });
    } else {
      updatePreference.mutate({
        eventType,
        deliveryChannel: "email",
        enabled: true,
        emailDigestInterval: value,
      });
    }
  };

  const getEmailValue = (eventId: NotificationEventType): string => {
    const isEnabled = preferences?.global[eventId]?.email ?? false;
    if (!isEnabled) return "off";

    const override = preferences?.overrides.find(
      (o) => o.eventType === eventId && o.deliveryChannel === "email"
    );
    return override?.emailDigestInterval ?? "immediate";
  };

  const renderEventRow = (event: (typeof EVENT_TYPES)[number]) => {
    const soundEnabled = preferences?.global[event.id]?.sound ?? false;
    const pushEnabled = preferences?.global[event.id]?.push ?? false;
    const emailValue = getEmailValue(event.id);

    return (
      <TableRow key={event.id}>
        <TableCell>
          <div className="min-w-0">
            <div className="truncate font-medium text-sm">{event.label}</div>
            <div className="truncate text-muted-foreground text-xs">
              {event.description}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <Switch
            checked={soundEnabled}
            onCheckedChange={(checked) =>
              handleToggle(event.id, "sound", checked)
            }
          />
        </TableCell>
        <TableCell className="text-center">
          {isDesktopReady ? (
            <Switch
              checked={pushEnabled}
              onCheckedChange={(checked) =>
                handleToggle(event.id, "push", checked)
              }
            />
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="inline-block">
                    <Switch checked={false} disabled />
                  </div>
                }
              />
              <TooltipContent>
                <p>
                  Enable push notifications above to configure per-event
                  settings
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </TableCell>
        <TableCell className="text-right">
          <Select
            items={[
              { value: "off", label: "Off" },
              { value: "immediate", label: "Immediate" },
              { value: "15min", label: "Every 15 min" },
              { value: "hourly", label: "Hourly" },
              { value: "daily", label: "Daily" },
            ]}
            onValueChange={(val) => {
              if (val === null) return;
              handleEmailChange(
                event.id,
                val as "off" | "immediate" | "15min" | "hourly" | "daily"
              );
            }}
            value={emailValue}
          >
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">Off</SelectItem>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="15min">Every 15 min</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <h3>Notification Preferences</h3>
        <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Event</TableHead>
                <TableHead className="w-[16%] text-center">
                  <div className="flex items-center justify-center gap-1">
                    <IconVolume className="size-3.5" />
                    <span>Sound</span>
                  </div>
                </TableHead>
                <TableHead className="w-[16%] text-center">
                  <div className="flex items-center justify-center gap-1">
                    <IconBell className="size-3.5" />
                    <span>Desktop</span>
                  </div>
                </TableHead>
                <TableHead className="w-[18%] text-right">
                  <div className="flex items-center justify-end gap-1">
                    <IconMail className="size-3.5" />
                    <span>Email</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-muted/30">
                <TableCell
                  className="py-2 font-medium text-muted-foreground text-xs uppercase tracking-wide"
                  colSpan={4}
                >
                  Channel Events
                </TableCell>
              </TableRow>
              {CHANNEL_EVENTS.map((eventId) => {
                const event = EVENT_TYPES.find((e) => e.id === eventId);
                if (!event) return null;
                return renderEventRow(event);
              })}
              <TableRow className="bg-muted/30">
                <TableCell
                  className="py-2 font-medium text-muted-foreground text-xs uppercase tracking-wide"
                  colSpan={4}
                >
                  Direct Messages
                </TableCell>
              </TableRow>
              {DM_EVENTS.map((eventId) => {
                const event = EVENT_TYPES.find((e) => e.id === eventId);
                if (!event) return null;
                return renderEventRow(event);
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function EmailNotificationsSkeleton() {
  return (
    <TooltipProvider>
      <div className="space-y-3">
        <h3>Notification Preferences</h3>
        <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Event</TableHead>
                <TableHead className="w-[16%] text-center">
                  <div className="flex items-center justify-center gap-1">
                    <IconVolume className="size-3.5" />
                    <span>Sound</span>
                  </div>
                </TableHead>
                <TableHead className="w-[16%] text-center">
                  <div className="flex items-center justify-center gap-1">
                    <IconBell className="size-3.5" />
                    <span>Desktop</span>
                  </div>
                </TableHead>
                <TableHead className="w-[18%] text-right">
                  <div className="flex items-center justify-end gap-1">
                    <IconMail className="size-3.5" />
                    <span>Email</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-muted/30">
                <TableCell
                  className="py-2 font-medium text-muted-foreground text-xs uppercase tracking-wide"
                  colSpan={4}
                >
                  Channel Events
                </TableCell>
              </TableRow>
              {/* biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list */}
              {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="min-w-0 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-5 w-10 rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-5 w-10 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-8 w-36" />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30">
                <TableCell
                  className="py-2 font-medium text-muted-foreground text-xs uppercase tracking-wide"
                  colSpan={4}
                >
                  Direct Messages
                </TableCell>
              </TableRow>
              {/* biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list */}
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="min-w-0 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-5 w-10 rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-5 w-10 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-8 w-36" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}

EmailNotifications.Fallback = EmailNotificationsSkeleton;
