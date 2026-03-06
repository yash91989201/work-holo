import {
  IconBell,
  IconMail,
  IconPlayerPlay,
  IconUpload,
  IconVolume,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationEventType } from "@work-holo/api/services/notification/types";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CHANNEL_EVENT_DEFINITIONS } from "@/components/settings/notifications/constants";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { queryUtils } from "@/utils/orpc";
import { uploadNotificationSound } from "@/utils/upload-helper";

interface ChannelNotificationSettingsProps {
  channelId: string;
}

export function ChannelNotificationSettings({
  channelId,
}: ChannelNotificationSettingsProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { isSubscribed, isSupported } = usePushNotifications();
  const { isGranted } = useNotificationPermission();
  const isDesktopReady = isGranted && isSubscribed && isSupported;

  const { data: muteStatus } = useQuery(
    queryUtils.notification.getChannelMuteStatus.queryOptions({
      input: { entityType: "channel", entityId: channelId },
    })
  );

  const toggleMute = useMutation(
    queryUtils.notification.toggleChannelMute.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryUtils.notification.getChannelMuteStatus.queryKey({
            input: { entityType: "channel", entityId: channelId },
          }),
        });
      },
    })
  );

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

  const { data: presetsData } = useQuery(
    queryUtils.notification.soundPreferences.listPresets.queryOptions({
      input: {},
    })
  );

  const { data: soundPref } = useQuery(
    queryUtils.notification.soundPreferences.getPreference.queryOptions({
      input: { scope: "channel", entityId: channelId },
    })
  );

  const { data: globalSoundPref } = useQuery(
    queryUtils.notification.soundPreferences.getPreference.queryOptions({
      input: { scope: "channel" },
    })
  );

  const updateSoundPreference = useMutation(
    queryUtils.notification.soundPreferences.updatePreference.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            queryUtils.notification.soundPreferences.getPreference.queryKey({
              input: { scope: "channel", entityId: channelId },
            }),
        });
      },
    })
  );

  const deleteSoundPreference = useMutation(
    queryUtils.notification.soundPreferences.deletePreference.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            queryUtils.notification.soundPreferences.getPreference.queryKey({
              input: { scope: "channel", entityId: channelId },
            }),
        });
      },
    })
  );

  const isMuted = muteStatus?.muted ?? false;

  const handleMuteToggle = (checked: boolean) => {
    toggleMute.mutate({
      entityType: "channel",
      entityId: channelId,
      muted: checked,
    });
  };

  const handlePreferenceToggle = (
    eventType: NotificationEventType,
    deliveryChannel: "sound" | "push" | "email",
    enabled: boolean
  ) => {
    if (deliveryChannel === "push" && !isDesktopReady) {
      return;
    }

    updatePreference.mutate({
      eventType,
      deliveryChannel,
      enabled,
      entityType: "channel",
      entityId: channelId,
    });
  };

  const handleSoundChange = (value: string) => {
    if (value === "default") {
      deleteSoundPreference.mutate({
        scope: "channel",
        entityId: channelId,
      });
      return;
    }

    if (value === "custom") {
      fileInputRef.current?.click();
      return;
    }

    updateSoundPreference.mutate({
      scope: "channel",
      entityId: channelId,
      soundType: "preset",
      presetId: value,
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadNotificationSound(file);
      await updateSoundPreference.mutateAsync({
        scope: "channel",
        entityId: channelId,
        soundType: "custom",
        customSoundUrl: result.url,
        customSoundName: file.name,
      });
      toast.success("Custom sound uploaded successfully");
    } catch (_error) {
      toast.error("Failed to upload sound");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(() => toast.error("Failed to play sound"));
  };

  const getPreferenceState = (
    eventType: NotificationEventType,
    deliveryChannel: "sound" | "push" | "email"
  ) => {
    if (deliveryChannel === "push" && !isDesktopReady) {
      return { isOverride: false, enabled: false };
    }

    const override = preferences?.overrides.find(
      (o) =>
        o.eventType === eventType &&
        o.deliveryChannel === deliveryChannel &&
        o.entityType === "channel" &&
        o.entityId === channelId
    );

    if (override) {
      return { isOverride: true, enabled: override.enabled };
    }

    const globalEnabled =
      preferences?.global[eventType]?.[deliveryChannel] ?? false;
    return { isOverride: false, enabled: globalEnabled };
  };

  let currentSoundValue = "default";
  if (soundPref?.preference) {
    if (soundPref.preference.soundType === "custom") {
      currentSoundValue = "custom";
    } else if (soundPref.preference.presetId) {
      currentSoundValue = soundPref.preference.presetId;
    }
  }

  const handlePlaySound = () => {
    const effectivePreference =
      soundPref?.preference ?? globalSoundPref?.preference;

    if (effectivePreference?.soundType === "custom") {
      if (!effectivePreference.customSoundUrl) {
        toast.error("Custom sound is unavailable");
        return;
      }

      playSound(effectivePreference.customSoundUrl);
      return;
    }

    if (effectivePreference?.soundType === "preset") {
      if (!effectivePreference.presetId) {
        playSound("/assets/sounds/notify.webm");
        return;
      }

      const preset = presetsData?.presets.find(
        (p) => p.id === effectivePreference.presetId
      );
      if (!preset) {
        toast.error("Selected sound is still loading");
        return;
      }

      playSound(`/assets/sounds/${preset.filename}`);
      return;
    }

    playSound("/assets/sounds/notify.webm");
  };

  const canPlaySound =
    currentSoundValue !== "custom" ||
    (soundPref?.preference?.soundType === "custom" &&
      soundPref?.preference?.customSoundUrl);

  const renderEventRow = (
    event: (typeof CHANNEL_EVENT_DEFINITIONS)[number]
  ) => {
    const soundState = getPreferenceState(event.id, "sound");
    const pushState = getPreferenceState(event.id, "push");
    const emailState = getPreferenceState(event.id, "email");

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
          <div className="flex items-center justify-center gap-1">
            <Switch
              checked={soundState.enabled}
              onCheckedChange={(checked) =>
                handlePreferenceToggle(event.id, "sound", checked)
              }
            />
            {!soundState.isOverride && (
              <span className="text-muted-foreground text-xs">(Default)</span>
            )}
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Switch
              checked={pushState.enabled}
              disabled={!isDesktopReady}
              onCheckedChange={(checked) =>
                handlePreferenceToggle(event.id, "push", checked)
              }
            />
            {!pushState.isOverride && (
              <span className="text-muted-foreground text-xs">(Default)</span>
            )}
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Switch
              checked={emailState.enabled}
              onCheckedChange={(checked) =>
                handlePreferenceToggle(event.id, "email", checked)
              }
            />
            {!emailState.isOverride && (
              <span className="text-muted-foreground text-xs">(Default)</span>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Mute Channel</ItemTitle>
            <ItemDescription>
              Stop receiving all notifications for this channel
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch checked={isMuted} onCheckedChange={handleMuteToggle} />
          </ItemActions>
        </Item>
      </div>

      {!isMuted && (
        <>
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Sound Settings</h3>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
              <Item>
                <ItemContent>
                  <ItemTitle>Notification Sound</ItemTitle>
                  <ItemDescription>
                    Override the default sound for this channel
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex items-center gap-2">
                  {canPlaySound && (
                    <Button
                      onClick={handlePlaySound}
                      size="icon"
                      variant="ghost"
                    >
                      <IconPlayerPlay className="size-4" />
                    </Button>
                  )}
                  <Select
                    disabled={isUploading}
                    onValueChange={handleSoundChange}
                    value={currentSoundValue}
                  >
                    <SelectTrigger className="w-50">
                      <SelectValue placeholder="Select a sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (Global)</SelectItem>
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
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-sm">Event Overrides</h3>
            <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Event</TableHead>
                    <TableHead className="w-[20%] text-center">
                      <div className="flex items-center justify-center gap-1">
                        <IconVolume className="size-3.5" />
                        <span>Sound</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[20%] text-center">
                      <div className="flex items-center justify-center gap-1">
                        <IconBell className="size-3.5" />
                        <span>Push</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[20%] text-center">
                      <div className="flex items-center justify-center gap-1">
                        <IconMail className="size-3.5" />
                        <span>Email</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CHANNEL_EVENT_DEFINITIONS.map((event) =>
                    renderEventRow(event)
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

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
