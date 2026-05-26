import { IconPlayerPlay } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@work-holo/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@work-holo/ui/components/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@work-holo/ui/components/select";
import { Separator } from "@work-holo/ui/components/separator";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { queryClient, queryUtils } from "@/utils/orpc";
import { uploadNotificationSound } from "@/utils/upload-helper";

export function SoundNotifications() {
  const { data: presetsData } = useSuspenseQuery(
    queryUtils.notification.soundPreferences.listPresets.queryOptions({
      input: {},
    })
  );
  const { data: channelSoundPref } = useSuspenseQuery(
    queryUtils.notification.soundPreferences.getPreference.queryOptions({
      input: { scope: "channel" },
    })
  );
  const { data: dmSoundPref } = useSuspenseQuery(
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
            customSoundName?: string | null;
          } | null;
        }
      | undefined
  ) => {
    const currentValue =
      pref?.preference?.soundType === "custom"
        ? "custom"
        : pref?.preference?.presetId || presetsData?.presets[0]?.id || "";

    const selectItems = [
      ...(presetsData?.presets.map((preset) => ({
        label: preset.name,
        value: preset.id,
      })) || []),
      { label: "Upload Custom...", value: "custom" },
    ];

    const handlePlaySound = () => {
      if (
        pref?.preference?.soundType === "custom" &&
        pref.preference.customSoundUrl
      ) {
        playSound(pref.preference.customSoundUrl);
        return;
      }

      const presetId = pref?.preference?.presetId || currentValue;
      const preset = presetsData?.presets.find(
        (p: { id: string; filename: string }) => p.id === presetId
      );
      if (preset) {
        playSound(`/assets/sounds/${preset.filename}`);
      }
    };

    const canPlay =
      (pref?.preference?.soundType === "custom" &&
        pref.preference.customSoundUrl) ||
      currentValue;

    return (
      <Item>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemContent>
        <ItemActions className="flex items-center gap-2">
          {canPlay && (
            <Button onClick={handlePlaySound} size="icon" variant="ghost">
              <IconPlayerPlay className="size-4" />
            </Button>
          )}
          <Select
            items={selectItems}
            onValueChange={(val) => {
              if (val === null) return;
              handleSoundChange(scope, val);
            }}
            value={currentValue}
          >
            <SelectTrigger className="w-50">
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

export function SoundNotificationsSkeleton() {
  return (
    <div className="space-y-3">
      <h3>Sound Settings</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        {/* Channels Sound Item */}
        <Item>
          <ItemContent>
            <ItemTitle>Channels Sound</ItemTitle>
            <ItemDescription>
              Default sound for channel notifications
            </ItemDescription>
          </ItemContent>
          <ItemActions className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-50 rounded-md" />
          </ItemActions>
        </Item>
        <Separator />
        {/* DMs Sound Item */}
        <Item>
          <ItemContent>
            <ItemTitle>DMs Sound</ItemTitle>
            <ItemDescription>Default sound for direct messages</ItemDescription>
          </ItemContent>
          <ItemActions className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-50 rounded-md" />
          </ItemActions>
        </Item>
      </div>
    </div>
  );
}

SoundNotifications.Fallback = SoundNotificationsSkeleton;
