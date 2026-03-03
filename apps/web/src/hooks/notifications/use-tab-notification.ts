import { useCallback, useEffect, useRef } from "react";

interface TabNotificationOptions {
  unreadCount: number;
}

interface NotificationInfo {
  actorName: string;
  channelName: string | null;
}

const FLASH_INTERVAL_MS = 2000;
const BADGE_RADIUS = 4;
const BADGE_COLOR = "#ef4444";

const noop = () => undefined;

function getExistingFaviconHref(): string {
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  return link?.href ?? "/favicon.ico";
}

function setFaviconHref(href: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}

function buildNotificationTitle(info: NotificationInfo): string {
  if (info.channelName) {
    return `🔔 ${info.actorName} mentioned you in #${info.channelName}`;
  }
  return `🔔 ${info.actorName} sent you a message`;
}

function createBadgedFavicon(originalHref: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const size = 32;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(originalHref);
        return;
      }

      ctx.drawImage(img, 0, 0, size, size);

      ctx.beginPath();
      ctx.arc(
        size - BADGE_RADIUS - 1,
        BADGE_RADIUS + 1,
        BADGE_RADIUS,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = BADGE_COLOR;
      ctx.fill();

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      reject(new Error("Failed to load favicon image"));
    };

    img.src = originalHref;
  });
}

export function useTabNotification({ unreadCount }: TabNotificationOptions) {
  const originalTitleRef = useRef<string>(document.title);
  const originalFaviconRef = useRef<string>(getExistingFaviconHref());
  const flashIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isBadgeActiveRef = useRef(false);
  const latestNotificationRef = useRef<NotificationInfo | null>(null);

  const startTitleFlash = useCallback((info: NotificationInfo) => {
    if (document.visibilityState === "visible") return;

    latestNotificationRef.current = info;

    if (!flashIntervalRef.current) {
      originalTitleRef.current = document.title;
    }

    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
    }

    const notificationTitle = buildNotificationTitle(info);
    let showingNotification = true;
    document.title = notificationTitle;

    flashIntervalRef.current = setInterval(() => {
      showingNotification = !showingNotification;
      document.title = showingNotification
        ? notificationTitle
        : originalTitleRef.current;
    }, FLASH_INTERVAL_MS);
  }, []);

  const clearTitle = useCallback(() => {
    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
    }
    document.title = originalTitleRef.current;
    latestNotificationRef.current = null;
  }, []);

  const showBadge = useCallback(async () => {
    if (isBadgeActiveRef.current) return;

    try {
      const badgedHref = await createBadgedFavicon(originalFaviconRef.current);
      setFaviconHref(badgedHref);
      isBadgeActiveRef.current = true;
    } catch {
      return;
    }
  }, []);

  const clearBadge = useCallback(() => {
    if (!isBadgeActiveRef.current) return;
    setFaviconHref(originalFaviconRef.current);
    isBadgeActiveRef.current = false;
  }, []);

  const clearAll = useCallback(() => {
    clearTitle();
    clearBadge();
  }, [clearTitle, clearBadge]);

  const notify = useCallback(
    (info: NotificationInfo) => {
      startTitleFlash(info);
      showBadge().catch(noop);
    },
    [startTitleFlash, showBadge]
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        clearTitle();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearTitle]);

  useEffect(() => {
    if (unreadCount === 0) {
      clearAll();
    } else if (unreadCount > 0 && !isBadgeActiveRef.current) {
      showBadge().catch(noop);
    }
  }, [unreadCount, clearAll, showBadge]);

  useEffect(() => {
    const currentHref = getExistingFaviconHref();
    if (currentHref && !currentHref.startsWith("data:")) {
      originalFaviconRef.current = currentHref;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  return { notify, clearTitle, clearBadge, clearAll };
}
