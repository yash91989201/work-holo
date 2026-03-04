import type { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getPusherClient } from "@/lib/pusher";
import { orpcClient } from "@/utils/orpc";

interface NotificationPayload {
  actorId: string;
  actorName: string;
  channelName: string | null;
  entityId: string | null;
  entityType: string | null;
  eventType: string;
  messagePreview: string | null;
  notificationId: string;
  playSound?: boolean;
  timestamp: string;
}

interface SoundPreference {
  customSoundUrl: string | null;
  presetId: string | null;
  soundType: string;
}

interface SoundPreset {
  filename: string;
  id: string;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

const preferenceCache = new Map<string, CacheEntry<SoundPreference | null>>();
const presetCache = new Map<string, CacheEntry<SoundPreset | null>>();

function getCached<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string
): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.data;
}

function setCache<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
  data: T
): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function fetchPreference(
  scope: "global" | "channel" | "dm_conversation" | "event_type",
  entityId?: string | null
): Promise<SoundPreference | null> {
  const cacheKey = `${scope}:${entityId ?? ""}`;
  const cached = getCached(preferenceCache, cacheKey);
  if (cached !== undefined) return cached;

  try {
    const { preference } =
      await orpcClient.notification.soundPreferences.getPreference({
        scope,
        entityId: entityId ?? undefined,
      });

    const result: SoundPreference | null = preference
      ? {
          soundType: preference.soundType,
          presetId: preference.presetId ?? null,
          customSoundUrl: preference.customSoundUrl ?? null,
        }
      : null;

    setCache(preferenceCache, cacheKey, result);
    return result;
  } catch (error) {
    console.error("[NotificationSound] Failed to fetch preference:", error);
    return null;
  }
}

async function fetchPresetFilename(presetId: string): Promise<string | null> {
  const cached = getCached(presetCache, presetId);
  if (cached !== undefined) return cached?.filename ?? null;

  try {
    const { presets } =
      await orpcClient.notification.soundPreferences.listPresets({});

    for (const preset of presets) {
      setCache(presetCache, preset.id, {
        id: preset.id,
        filename: preset.filename,
      });
    }

    const matched = presets.find((p) => p.id === presetId);
    if (!matched) {
      setCache(presetCache, presetId, null);
      return null;
    }
    return matched.filename;
  } catch (error) {
    console.error("[NotificationSound] Failed to fetch presets:", error);
    return null;
  }
}

function resolveGlobalEntityId(entityType: string | null): string | null {
  if (entityType === "channel") return "global_channel";
  if (entityType === "dm_conversation") return "global_dm";
  return null;
}

async function resolveSoundUrl(payload: NotificationPayload): Promise<string> {
  const DEFAULT_SOUND = "/assets/sounds/notify.webm";

  if (payload.entityType && payload.entityId) {
    const scope = payload.entityType as
      | "channel"
      | "dm_conversation"
      | "event_type";
    const pref = await fetchPreference(scope, payload.entityId);
    const url = await preferenceToUrl(pref);
    if (url) return url;
  }

  const categoryEntityId = resolveGlobalEntityId(payload.entityType);

  if (categoryEntityId) {
    const pref = await fetchPreference("global", categoryEntityId);
    const url = await preferenceToUrl(pref);
    if (url) return url;
  }

  return DEFAULT_SOUND;
}

async function preferenceToUrl(
  pref: SoundPreference | null
): Promise<string | null> {
  if (!pref) return null;

  if (pref.soundType === "custom" && pref.customSoundUrl) {
    return pref.customSoundUrl;
  }

  if (pref.soundType === "preset" && pref.presetId) {
    const filename = await fetchPresetFilename(pref.presetId);
    if (filename) return `/assets/sounds/${filename}`;
  }

  return null;
}

function playSound(url: string): void {
  const audio = new Audio(url);
  audio.play().catch((error) => {
    console.error("[NotificationSound] Error playing sound:", error);
  });
}

export function useNotificationSound() {
  const { user } = useAuthedSession();
  const channelRef = useRef<Channel | null>(null);
  const handledNotificationIdsRef = useRef<Set<string>>(new Set());

  const handleNotification = useCallback(async (data: NotificationPayload) => {
    if (handledNotificationIdsRef.current.has(data.notificationId)) {
      return;
    }

    handledNotificationIdsRef.current.add(data.notificationId);

    if (handledNotificationIdsRef.current.size > 1000) {
      handledNotificationIdsRef.current.clear();
      handledNotificationIdsRef.current.add(data.notificationId);
    }

    if (data.playSound === false) {
      return;
    }

    const soundUrl = await resolveSoundUrl(data);
    playSound(soundUrl);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const pusher = getPusherClient();
    const channelName = `private-user-${user.id}`;
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;
    handledNotificationIdsRef.current.clear();

    channel.bind("notification:new", handleNotification);

    return () => {
      channel.unbind("notification:new", handleNotification);
      pusher.unsubscribe(channelName);
      channelRef.current = null;
    };
  }, [user?.id, handleNotification]);
}
