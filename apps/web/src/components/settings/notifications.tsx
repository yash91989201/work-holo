import {
  IconBell,
  IconBellFilled,
  IconMail,
  IconPlayerPlay,
  IconUpload,
  IconVolume,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { NotificationEventType } from "@work-holo/api/services/notification/types";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { testPushNotification } from "@/lib/push-subscription";
import { queryClient, queryUtils } from "@/utils/orpc";
import { uploadNotificationSound } from "@/utils/upload-helper";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";

const EVENT_TYPES: {
  id: NotificationEventType;
  label: string;
  description: string;
}[] = [
  {
    id: "channel_message",
    label: "Channel Messages",
    description: "New messages in channels",
  },
  {
    id: "channel_reply",
    label: "Channel Replies",
    description: "Replies to threads in channels",
  },
  {
    id: "channel_reaction",
    label: "Channel Reactions",
    description: "Reactions to your messages in channels",
  },
  {
    id: "channel_mention",
    label: "Channel Mentions",
    description: "When you are mentioned in a channel",
  },
  {
    id: "dm_message",
    label: "Direct Messages",
    description: "New direct messages",
  },
  {
    id: "dm_reply",
    label: "DM Replies",
    description: "Replies to threads in DMs",
  },
  {
    id: "dm_reaction",
    label: "DM Reactions",
    description: "Reactions to your messages in DMs",
  },
];

const CHANNEL_EVENTS: NotificationEventType[] = [
  "channel_message",
  "channel_reply",
  "channel_reaction",
  "channel_mention",
];

const DM_EVENTS: NotificationEventType[] = [
  "dm_message",
  "dm_reply",
  "dm_reaction",
];

export function SoundNotifications() {
  const { data: presetsData } = useQuery(
    queryUtils.notification.soundPreferences.listPresets.queryOptions({
      input: {},
    })
  );
  const { data: channelSoundPref } = useQuery(
    queryUtils.notification.soundPreferences.getPreference.queryOptions({
      input: { scope: "channel" },
    })
  );
  const { data: dmSoundPref } = useQuery(
    queryUtils.notification.soundPreferences.getPreference.queryOptions({
      input: { scope: "dm_conversation" },
    })
  );

  const updateSoundPreference = useMutation(
    queryUtils.notification.soundPreferences.updatePreference.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            queryUtils.notification.soundPreferences.getPreference.queryKey({
              input: { scope: "channel" },
            }),
        });
        queryClient.invalidateQueries({
          queryKey:
            queryUtils.notification.soundPreferences.getPreference.queryKey({
              input: { scope: "dm_conversation" },
            }),
        });
      },
    })
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingScope, setUploadingScope] = useState<
    "channel" | "dm_conversation" | null
  >(null);

  const handleSoundChange = (
    scope: "channel" | "dm_conversation",
    value: string
  ) => {
    if (value === "custom") {
      setUploadingScope(scope);
      fileInputRef.current?.click();
      return;
    }

    updateSoundPreference.mutate({
      scope,
      soundType: "preset",
      presetId: value,
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!(file && uploadingScope)) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      const result = await uploadNotificationSound(file);
      await updateSoundPreference.mutateAsync({
        scope: uploadingScope,
        soundType: "custom",
        customSoundUrl: result.url,
        customSoundName: file.name,
      });
      toast.success("Custom sound uploaded successfully");
    } catch (_error) {
      toast.error("Failed to upload sound");
    } finally {
      setUploadingScope(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(() => toast.error("Failed to play sound"));
  };

  const renderSoundPicker = (
    scope: "channel" | "dm_conversation",
    title: string,
    description: string,
    pref:
      | {
          preference?: {
            soundType: string;
            presetId?: string | null;
            customSoundUrl?: string | null;
          } | null;
        }
      | undefined
  ) => {
    const currentValue =
      pref?.preference?.soundType === "custom"
        ? "custom"
        : pref?.preference?.presetId || presetsData?.presets[0]?.id || "";

    return (
      <Item>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemContent>
        <ItemActions className="flex items-center gap-2">
          {pref?.preference?.soundType === "custom" &&
            pref.preference.customSoundUrl && (
              <Button
                onClick={() => {
                  if (pref.preference?.customSoundUrl) {
                    playSound(pref.preference.customSoundUrl);
                  }
                }}
                size="icon"
                variant="ghost"
              >
                <IconPlayerPlay className="size-4" />
              </Button>
            )}
          {pref?.preference?.soundType === "preset" &&
            pref?.preference?.presetId && (
              <Button
                onClick={() => {
                  const preset = presetsData?.presets.find(
                    (p: { id: string; filename: string }) =>
                      p.id === pref?.preference?.presetId
                  );
                  if (preset) {
                    playSound(`/assets/sounds/${preset.filename}`);
                  }
                }}
                size="icon"
                variant="ghost"
              >
                <IconPlayerPlay className="size-4" />
              </Button>
            )}
          <Select
            onValueChange={(val) => handleSoundChange(scope, val)}
            value={currentValue}
          >
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Select a sound" />
            </SelectTrigger>
            <SelectContent>
              {presetsData?.presets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
              <SelectItem value="custom">
                <div className="flex items-center gap-2">
                  <IconUpload className="size-4" />
                  <span>Upload Custom...</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </ItemActions>
      </Item>
    );
  };

  return (
    <div className="space-y-3">
      <h3>Sound Settings</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        {renderSoundPicker(
          "channel",
          "Channels Sound",
          "Default sound for channel notifications",
          channelSoundPref
        )}
        <Separator />
        {renderSoundPicker(
          "dm_conversation",
          "DMs Sound",
          "Default sound for direct messages",
          dmSoundPref
        )}
      </div>
      <input
        accept="audio/*"
        className="hidden"
        onChange={handleFileUpload}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
}

export function DesktopNotifications() {
  const { requestPermission, isGranted, isDenied } =
    useNotificationPermission();
  const {
    isSubscribed,
    isLoading: isPushLoading,
    subscribe,
    unsubscribe,
    isSupported,
  } = usePushNotifications();

  const [isTesting, setIsTesting] = useState(false);

  const handleTogglePermission = async (enabled: boolean) => {
    if (!isSupported) {
      return;
    }

    if (enabled) {
      if (isGranted) {
        return;
      }

      if (isDenied) {
        toast.message(
          "Notifications are blocked in browser settings. Use the lock icon in the address bar to allow them."
        );
        return;
      }

      const permission = await requestPermission();
      if (permission !== "granted") {
        toast.error("Notification permission is required");
      }

      return;
    }

    if (isGranted) {
      toast.message(
        "Browser notification permission can be revoked from site settings."
      );
    }
  };

  const handleTogglePushNotifications = async (enabled: boolean) => {
    if (enabled) {
      await subscribe();
    } else {
      await unsubscribe();
    }
  };

  const handleTestNotification = async () => {
    setIsTesting(true);
    try {
      await testPushNotification();
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3>Desktop Notifications</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Browser Permission</ItemTitle>
            <ItemDescription>
              Allow browser to show notifications (browser-level permission)
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch
              checked={isGranted}
              disabled={!isSupported || isPushLoading}
              onCheckedChange={handleTogglePermission}
            />
          </ItemActions>
        </Item>

        {isDenied && (
          <>
            <Separator />
            <Item>
              <ItemContent>
                <ItemDescription className="text-yellow-600 dark:text-yellow-500">
                  To enable notifications, click the lock icon in your
                  browser&apos;s address bar and update permissions.
                </ItemDescription>
              </ItemContent>
            </Item>
          </>
        )}

        {isGranted && (
          <>
            <Separator />
            <Item>
              <ItemContent>
                <ItemTitle>Push Notifications</ItemTitle>
                <ItemDescription>
                  Receive alerts even when tab is closed or in background
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                {isSupported ? (
                  <Switch
                    checked={isSubscribed}
                    disabled={isPushLoading}
                    onCheckedChange={handleTogglePushNotifications}
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Not supported
                  </span>
                )}
              </ItemActions>
            </Item>
          </>
        )}

        {isSubscribed && isSupported && (
          <>
            <Separator />
            <Item>
              <ItemContent>
                <ItemTitle>Test Notification</ItemTitle>
                <ItemDescription>
                  Send a test notification to verify it&apos;s working
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  disabled={isTesting}
                  onClick={handleTestNotification}
                  size="sm"
                  variant="outline"
                >
                  {isTesting ? (
                    <>
                      <Spinner />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <IconBellFilled className="size-3" />
                      <span>Send Test</span>
                    </>
                  )}
                </Button>
              </ItemActions>
            </Item>
          </>
        )}
      </div>
    </div>
  );
}

export function EmailNotifications() {
  const { data: preferences } = useQuery(
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
              <TooltipTrigger asChild>
                <div className="inline-block">
                  <Switch checked={false} disabled />
                </div>
              </TooltipTrigger>
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
            onValueChange={(
              val: "off" | "immediate" | "15min" | "hourly" | "daily"
            ) => handleEmailChange(event.id, val)}
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
