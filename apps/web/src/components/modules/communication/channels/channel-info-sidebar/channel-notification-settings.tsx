import {
  IconBell,
  IconBellOff,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Channel
        </p>
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                {isMuted ? (
                  <IconBellOff className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <IconBell className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  Mute Channel
                </p>
                <p className="text-muted-foreground text-xs">
                  Silence all notifications
                </p>
              </div>
            </div>
            <Switch checked={isMuted} onCheckedChange={handleMuteToggle} />
          </div>
        </div>
      </div>

      {!isMuted && (
        <>
          <div className="space-y-1.5">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Sound
            </p>
            <div className="rounded-lg border bg-card">
              <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                    <IconVolume className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground text-sm">
                    Notification Sound
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {canPlaySound && (
                    <Button
                      className="h-7 w-7"
                      onClick={handlePlaySound}
                      size="icon"
                      variant="ghost"
                    >
                      <IconPlayerPlay className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Select
                    disabled={isUploading}
                    onValueChange={handleSoundChange}
                    value={currentSoundValue}
                  >
                    <SelectTrigger className="h-7 w-36 text-xs">
                      <SelectValue placeholder="Select sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (Global)</SelectItem>
                      {presetsData?.presets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">
                        <div className="flex items-center gap-1.5">
                          <IconUpload className="h-3.5 w-3.5" />
                          <span>Upload Custom…</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Event Overrides
            </p>
            <div className="divide-y rounded-lg border bg-card">
              {CHANNEL_EVENT_DEFINITIONS.map((event) => {
                const soundState = getPreferenceState(event.id, "sound");
                const pushState = getPreferenceState(event.id, "push");
                const emailState = getPreferenceState(event.id, "email");

                return (
                  <div className="space-y-2.5 px-3 py-3" key={event.id}>
                    <div>
                      <p className="font-medium text-foreground text-sm leading-tight">
                        {event.label}
                      </p>
                      <p className="text-muted-foreground text-xs leading-snug">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <IconVolume className="h-3 w-3 text-muted-foreground" />
                        <Switch
                          checked={soundState.enabled}
                          onCheckedChange={(checked) =>
                            handlePreferenceToggle(event.id, "sound", checked)
                          }
                        />
                        {!soundState.isOverride && (
                          <span className="text-[10px] text-muted-foreground/60">
                            default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IconBell className="h-3 w-3 text-muted-foreground" />
                        <Switch
                          checked={pushState.enabled}
                          disabled={!isDesktopReady}
                          onCheckedChange={(checked) =>
                            handlePreferenceToggle(event.id, "push", checked)
                          }
                        />
                        {!pushState.isOverride && (
                          <span className="text-[10px] text-muted-foreground/60">
                            default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IconMail className="h-3 w-3 text-muted-foreground" />
                        <Switch
                          checked={emailState.enabled}
                          onCheckedChange={(checked) =>
                            handlePreferenceToggle(event.id, "email", checked)
                          }
                        />
                        {!emailState.isOverride && (
                          <span className="text-[10px] text-muted-foreground/60">
                            default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
