import {
  IconBell,
  IconBellOff,
  IconMail,
  IconPlayerPlay,
  IconVolume,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationEventType } from "@work-holo/api/services/notification/types";
import { Button } from "@work-holo/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { Label } from "@work-holo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@work-holo/ui/components/select";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Switch } from "@work-holo/ui/components/switch";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { DM_EVENT_DEFINITIONS } from "@/components/settings/notifications/constants";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { queryUtils } from "@/utils/orpc";
import { uploadNotificationSound } from "@/utils/upload-helper";

interface DmNotificationSettingsProps {
  conversationId: string;
}

export function DmNotificationSettings({
  conversationId,
}: DmNotificationSettingsProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { isSubscribed, isSupported } = usePushNotifications();
  const { isGranted } = useNotificationPermission();
  const isDesktopReady = isGranted && isSubscribed && isSupported;

  const { data: muteStatus } = useQuery(
    queryUtils.notification.getChannelMuteStatus.queryOptions({
      input: { entityType: "dm_conversation", entityId: conversationId },
    })
  );

  const toggleMute = useMutation(
    queryUtils.notification.toggleChannelMute.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryUtils.notification.getChannelMuteStatus.queryKey({
            input: { entityType: "dm_conversation", entityId: conversationId },
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
      input: { scope: "dm_conversation", entityId: conversationId },
    })
  );

  const { data: globalSoundPref } = useQuery(
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
              input: { scope: "dm_conversation", entityId: conversationId },
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
              input: { scope: "dm_conversation", entityId: conversationId },
            }),
        });
      },
    })
  );

  const isMuted = muteStatus?.muted ?? false;

  const handleMuteToggle = (checked: boolean) => {
    toggleMute.mutate({
      entityType: "dm_conversation",
      entityId: conversationId,
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
      entityType: "dm_conversation",
      entityId: conversationId,
    });
  };

  const handleSoundChange = (value: string) => {
    if (value === "default") {
      deleteSoundPreference.mutate({
        scope: "dm_conversation",
        entityId: conversationId,
      });
      return;
    }

    if (value === "custom") {
      fileInputRef.current?.click();
      return;
    }

    updateSoundPreference.mutate({
      scope: "dm_conversation",
      entityId: conversationId,
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
        scope: "dm_conversation",
        entityId: conversationId,
        soundType: "custom",
        customSoundUrl: result.url,
        customSoundName: file.name,
      });
      toast.success("Custom sound uploaded successfully");
    } catch {
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
        o.entityType === "dm_conversation" &&
        o.entityId === conversationId
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

  const selectItems = [
    { label: "Default (Global)", value: "default" },
    ...(presetsData?.presets.map((preset) => ({
      label: preset.name,
      value: preset.id,
    })) || []),
    { label: "Upload Custom...", value: "custom" },
  ];

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
    <div className="space-y-4 p-3">
      <div className="space-y-1.5">
        <p className="px-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Conversation
        </p>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <Item size="sm">
            <ItemContent>
              <ItemTitle>
                {isMuted ? (
                  <IconBellOff className="size-3.5 text-muted-foreground" />
                ) : (
                  <IconBell className="size-3.5 text-muted-foreground" />
                )}
                Mute Conversation
              </ItemTitle>
              <ItemDescription>Silence all notifications</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch
                aria-label="Mute conversation"
                checked={isMuted}
                onCheckedChange={handleMuteToggle}
              />
            </ItemActions>
          </Item>
        </div>
      </div>

      {!isMuted && (
        <>
          <div className="space-y-1.5">
            <p className="px-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Sound
            </p>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
              <Item size="sm">
                <ItemContent>
                  <ItemTitle>
                    <IconVolume className="size-3.5 text-muted-foreground" />
                    Notification Sound
                  </ItemTitle>
                  <ItemDescription>
                    Sound played for this conversation
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
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
                    items={selectItems}
                    onValueChange={(value) => {
                      if (value === null) return;
                      handleSoundChange(value);
                    }}
                    value={currentSoundValue}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ItemActions>
              </Item>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="px-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Event Overrides
            </p>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
              <ItemGroup className="gap-0">
                {DM_EVENT_DEFINITIONS.map((event, index) => {
                  const soundState = getPreferenceState(event.id, "sound");
                  const pushState = getPreferenceState(event.id, "push");
                  const emailState = getPreferenceState(event.id, "email");

                  return (
                    <div key={event.id}>
                      {index > 0 && <ItemSeparator />}
                      <Item size="sm">
                        <ItemContent>
                          <ItemTitle>{event.label}</ItemTitle>
                          <ItemDescription>{event.description}</ItemDescription>
                        </ItemContent>
                        <ItemActions className="gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <Switch
                              aria-label={`${event.label} sound notifications`}
                              checked={soundState.enabled}
                              onCheckedChange={(checked) =>
                                handlePreferenceToggle(
                                  event.id,
                                  "sound",
                                  checked
                                )
                              }
                            />
                            <Label className="flex cursor-default items-center gap-0.5 text-[10px] text-muted-foreground">
                              <IconVolume className="size-2.5" />
                              {soundState.isOverride ? (
                                <span className="text-foreground">on</span>
                              ) : (
                                "dflt"
                              )}
                            </Label>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <Switch
                              aria-label={`${event.label} push notifications`}
                              checked={pushState.enabled}
                              disabled={!isDesktopReady}
                              onCheckedChange={(checked) =>
                                handlePreferenceToggle(
                                  event.id,
                                  "push",
                                  checked
                                )
                              }
                            />
                            <Label className="flex cursor-default items-center gap-0.5 text-[10px] text-muted-foreground">
                              <IconBell className="size-2.5" />
                              {pushState.isOverride ? (
                                <span className="text-foreground">on</span>
                              ) : (
                                "dflt"
                              )}
                            </Label>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <Switch
                              aria-label={`${event.label} email notifications`}
                              checked={emailState.enabled}
                              onCheckedChange={(checked) =>
                                handlePreferenceToggle(
                                  event.id,
                                  "email",
                                  checked
                                )
                              }
                            />
                            <Label className="flex cursor-default items-center gap-0.5 text-[10px] text-muted-foreground">
                              <IconMail className="size-2.5" />
                              {emailState.isOverride ? (
                                <span className="text-foreground">on</span>
                              ) : (
                                "dflt"
                              )}
                            </Label>
                          </div>
                        </ItemActions>
                      </Item>
                    </div>
                  );
                })}
              </ItemGroup>
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

const DmNotificationSettingsSkeleton = () => (
  <div className="space-y-4 p-3">
    <div className="space-y-1.5">
      <p className="px-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
        Conversation
      </p>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item size="sm">
          <ItemContent>
            <ItemTitle>
              <IconBell className="size-3.5 text-muted-foreground" />
              Mute Conversation
            </ItemTitle>
            <ItemDescription>Silence all notifications</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Skeleton className="h-5 w-9 rounded-full" />
          </ItemActions>
        </Item>
      </div>
    </div>

    <div className="space-y-1.5">
      <p className="px-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
        Sound
      </p>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item size="sm">
          <ItemContent>
            <ItemTitle>
              <IconVolume className="size-3.5 text-muted-foreground" />
              Notification Sound
            </ItemTitle>
            <ItemDescription>Sound played for this channel</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-36 rounded-md" />
          </ItemActions>
        </Item>
      </div>
    </div>

    <div className="space-y-1.5">
      <p className="px-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
        Event Overrides
      </p>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <ItemGroup className="gap-0">
          {DM_EVENT_DEFINITIONS.map((event, i) => (
            <div key={event.id}>
              {i > 0 && <ItemSeparator />}
              <Item size="sm">
                <ItemContent>
                  <ItemTitle>{event.label}</ItemTitle>
                  <ItemDescription>{event.description}</ItemDescription>
                </ItemContent>
                <ItemActions className="gap-3">
                  {[0, 1, 2].map((j) => (
                    <div className="flex flex-col items-center gap-1" key={j}>
                      <Skeleton className="h-5 w-9 rounded-full" />
                      <Skeleton className="h-3 w-6 rounded" />
                    </div>
                  ))}
                </ItemActions>
              </Item>
            </div>
          ))}
        </ItemGroup>
      </div>
    </div>
  </div>
);

DmNotificationSettings.Fallback = DmNotificationSettingsSkeleton;
