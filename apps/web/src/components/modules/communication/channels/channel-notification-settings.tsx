import { IconPlayerPlay, IconUpload } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Switch } from "@/components/ui/switch";
import { queryUtils } from "@/utils/orpc";
import { uploadNotificationSound } from "@/utils/upload-helper";

const CHANNEL_EVENTS: {
  id: NotificationEventType;
  label: string;
  description: string;
}[] = [
  {
    id: "channel_message",
    label: "Channel Messages",
    description: "New messages in this channel",
  },
  {
    id: "channel_reply",
    label: "Channel Replies",
    description: "Replies to threads in this channel",
  },
  {
    id: "channel_reaction",
    label: "Channel Reactions",
    description: "Reactions to your messages in this channel",
  },
  {
    id: "channel_mention",
    label: "Channel Mentions",
    description: "When you are mentioned in this channel",
  },
];

interface ChannelNotificationSettingsProps {
  channelId: string;
}

export function ChannelNotificationSettings({
  channelId,
}: ChannelNotificationSettingsProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <div className="space-y-4">
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
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <Item>
              <ItemContent>
                <ItemTitle>Notification Sound</ItemTitle>
                <ItemDescription>
                  Override the default sound for this channel
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex items-center gap-2">
                {soundPref?.preference?.soundType === "custom" &&
                  soundPref.preference.customSoundUrl && (
                    <Button
                      onClick={() => {
                        if (soundPref.preference?.customSoundUrl) {
                          playSound(soundPref.preference.customSoundUrl);
                        }
                      }}
                      size="icon"
                      variant="ghost"
                    >
                      <IconPlayerPlay className="size-4" />
                    </Button>
                  )}
                {soundPref?.preference?.soundType === "preset" &&
                  soundPref.preference.presetId && (
                    <Button
                      onClick={() => {
                        const preset = presetsData?.presets.find(
                          (p) => p.id === soundPref.preference?.presetId
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
                  disabled={isUploading}
                  onValueChange={handleSoundChange}
                  value={currentSoundValue}
                >
                  <SelectTrigger className="w-[200px]">
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

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-4 font-medium text-sm">Event Overrides</div>
            <Separator />
            {CHANNEL_EVENTS.map((event, index) => (
              <div key={event.id}>
                <div className="p-4">
                  <div className="mb-3">
                    <div className="font-medium text-sm">{event.label}</div>
                    <div className="text-muted-foreground text-xs">
                      {event.description}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                    {(["sound", "push", "email"] as const).map((channel) => {
                      const state = getPreferenceState(event.id, channel);
                      return (
                        <div
                          className="flex items-center gap-2"
                          key={`${event.id}-${channel}`}
                        >
                          <Switch
                            checked={state.enabled}
                            onCheckedChange={(checked) =>
                              handlePreferenceToggle(event.id, channel, checked)
                            }
                          />
                          <span className="text-sm capitalize">
                            {channel}
                            {!state.isOverride && (
                              <span className="ml-1 text-muted-foreground text-xs">
                                (Default)
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {index < CHANNEL_EVENTS.length - 1 && <Separator />}
              </div>
            ))}
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
