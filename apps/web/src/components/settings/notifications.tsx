import {
  IconBellFilled,
  IconPlayerPlay,
  IconUpload,
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

export function SoundNotifications() {
  const { data: preferences } = useQuery(
    queryUtils.notification.getPreferences.queryOptions({ input: {} })
  );
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

  const handleToggle = (eventType: NotificationEventType, enabled: boolean) => {
    updatePreference.mutate({
      eventType,
      deliveryChannel: "sound",
      enabled,
    });
  };

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
      <h3>Sound Notifications</h3>
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
        <Separator />
        {EVENT_TYPES.map((event, index) => (
          <div key={event.id}>
            <Item>
              <ItemContent>
                <ItemTitle>{event.label}</ItemTitle>
                <ItemDescription>{event.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  checked={preferences?.global[event.id]?.sound ?? false}
                  onCheckedChange={(checked) => handleToggle(event.id, checked)}
                />
              </ItemActions>
            </Item>
            {index < EVENT_TYPES.length - 1 && <Separator />}
          </div>
        ))}
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

  const handleToggleEvent = (
    eventType: NotificationEventType,
    enabled: boolean
  ) => {
    updatePreference.mutate({
      eventType,
      deliveryChannel: "push",
      enabled,
    });
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
                  To enable notifications, click the lock icon in your browser's
                  address bar and update permissions.
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
                  Send a test notification to verify it's working
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
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <IconBellFilled className="size-3" />
                      <span>Test</span>
                    </>
                  )}
                </Button>
              </ItemActions>
            </Item>

            <Separator />
            <div className="px-4 py-2 font-medium text-muted-foreground text-sm">
              Notify me about:
            </div>
            <Separator />

            {EVENT_TYPES.map((event, index) => (
              <div key={event.id}>
                <Item>
                  <ItemContent>
                    <ItemTitle>{event.label}</ItemTitle>
                    <ItemDescription>{event.description}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Switch
                      checked={preferences?.global[event.id]?.push ?? false}
                      onCheckedChange={(checked) =>
                        handleToggleEvent(event.id, checked)
                      }
                    />
                  </ItemActions>
                </Item>
                {index < EVENT_TYPES.length - 1 && <Separator />}
              </div>
            ))}
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

  const handleToggleEvent = (
    eventType: NotificationEventType,
    enabled: boolean
  ) => {
    updatePreference.mutate({
      eventType,
      deliveryChannel: "email",
      enabled,
    });
  };

  const handleDigestChange = (
    eventType: NotificationEventType,
    interval: "immediate" | "15min" | "hourly" | "daily"
  ) => {
    updatePreference.mutate({
      eventType,
      deliveryChannel: "email",
      enabled: true,
      emailDigestInterval: interval,
    });
  };

  return (
    <div className="space-y-3">
      <h3>Email Notifications</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        {EVENT_TYPES.map((event, index) => {
          const isEnabled = preferences?.global[event.id]?.email ?? false;
          const override = preferences?.overrides.find(
            (o) => o.eventType === event.id && o.deliveryChannel === "email"
          );
          const digestInterval = override?.emailDigestInterval || "immediate";

          return (
            <div key={event.id}>
              <Item>
                <ItemContent>
                  <ItemTitle>{event.label}</ItemTitle>
                  <ItemDescription>{event.description}</ItemDescription>
                </ItemContent>
                <ItemActions className="flex items-center gap-4">
                  {isEnabled && (
                    <Select
                      onValueChange={(
                        val: "immediate" | "15min" | "hourly" | "daily"
                      ) => handleDigestChange(event.id, val)}
                      value={digestInterval}
                    >
                      <SelectTrigger className="w-35">
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="15min">Every 15 mins</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) =>
                      handleToggleEvent(event.id, checked)
                    }
                  />
                </ItemActions>
              </Item>
              {index < EVENT_TYPES.length - 1 && <Separator />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
