import type { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getPusherClient } from "@/lib/pusher";
import { orpcClient } from "@/utils/orpc";

interface NotificationPayload {
  actorId?: string;
  actorName?: string;
  channelName?: string | null;
  entityId?: string | null;
  entityType?: string | null;
  eventType?: string;
  messagePreview?: string | null;
  notificationId?: string;
  playSound?: boolean;
  timestamp?: string;
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
  if (!entry) return;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return;
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

function normalizeEntityType(
  entityType: string | null | undefined
): "channel" | "dm_conversation" | "event_type" | null {
  if (entityType === "channel") return "channel";
  if (entityType === "dm_conversation") return "dm_conversation";
  if (entityType === "event" || entityType === "event_type") {
    return "event_type";
  }
  return null;
}

async function resolveSoundUrl(payload: NotificationPayload): Promise<string> {
  const DEFAULT_SOUND = "/assets/sounds/notify.webm";

  const normalizedEntityType = normalizeEntityType(payload.entityType);

  if (normalizedEntityType && payload.entityId) {
    const scope = normalizedEntityType;
    const pref = await fetchPreference(scope, payload.entityId);
    const url = await preferenceToUrl(pref);
    if (url) return url;
  }

  if (normalizedEntityType) {
    const pref = await fetchPreference(normalizedEntityType);
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

function buildNotificationDedupKey(payload: NotificationPayload): string {
  if (payload.notificationId) {
    return payload.notificationId;
  }

  return [
    payload.eventType ?? "unknown",
    payload.entityType ?? "global",
    payload.entityId ?? "none",
    payload.timestamp ?? String(Date.now()),
  ].join(":");
}

function isNotificationPayload(value: unknown): value is NotificationPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as { eventType?: unknown };
  return (
    payload.eventType === undefined || typeof payload.eventType === "string"
  );
}

export function useNotificationSound() {
  const { user } = useAuthedSession();
  const channelRef = useRef<Channel | null>(null);
  const handledNotificationIdsRef = useRef<Set<string>>(new Set());
  const lastSubscribedUserIdRef = useRef<string | undefined>(undefined);

  const handleNotification = useCallback(async (data: NotificationPayload) => {
    const dedupeKey = buildNotificationDedupKey(data);

    if (handledNotificationIdsRef.current.has(dedupeKey)) {
      return;
    }

    handledNotificationIdsRef.current.add(dedupeKey);

    if (handledNotificationIdsRef.current.size > 1000) {
      handledNotificationIdsRef.current.clear();
      handledNotificationIdsRef.current.add(dedupeKey);
    }

    if (data.playSound === false) {
      return;
    }

    const soundUrl = await resolveSoundUrl(data);
    playSound(soundUrl);
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const handleServiceWorkerMessage = (event: MessageEvent<unknown>) => {
      const message = event.data;
      if (!message || typeof message !== "object") {
        return;
      }

      const typedMessage = message as { payload?: unknown; type?: unknown };
      if (typedMessage.type !== "push-notification-received") {
        return;
      }

      if (!isNotificationPayload(typedMessage.payload)) {
        return;
      }

      handleNotification(typedMessage.payload).catch((error) => {
        console.error(
          "[NotificationSound] Failed to handle SW message:",
          error
        );
      });
    };

    navigator.serviceWorker.addEventListener(
      "message",
      handleServiceWorkerMessage
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "message",
        handleServiceWorkerMessage
      );
    };
  }, [handleNotification]);

  useEffect(() => {
    if (!user?.id) return;

    const pusher = getPusherClient();
    const channelName = `private-user-${user.id}`;
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    if (
      lastSubscribedUserIdRef.current &&
      lastSubscribedUserIdRef.current !== user.id
    ) {
      handledNotificationIdsRef.current.clear();
    }
    lastSubscribedUserIdRef.current = user.id;

    channel.bind("notification:new", handleNotification);

    return () => {
      channel.unbind("notification:new", handleNotification);
      pusher.unsubscribe(channelName);
      channelRef.current = null;
    };
  }, [user?.id, handleNotification]);
}
