import { useCallback, useEffect, useRef } from "react";

interface TabNotificationOptions {
  defaultTitle?: string;
  unreadCount: number;
}

interface NotificationInfo {
  actorName: string;
  channelName: string | null;
}

const FLASH_INTERVAL_MS = 2000;
const BADGE_RADIUS = 4;
const BADGE_COLOR = "#ef4444";
const NOTIFICATION_FAVICON_ATTR = "data-tab-notification-favicon";
const ICON_LINK_SELECTOR = 'link[rel~="icon"]';

const noop = () => undefined;

function getCurrentManagedFaviconHref(): string {
  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>(ICON_LINK_SELECTOR)
  );

  for (let index = links.length - 1; index >= 0; index -= 1) {
    const link = links[index];
    if (link.hasAttribute(NOTIFICATION_FAVICON_ATTR)) continue;
    if (!link.href || link.href.startsWith("data:")) continue;
    return link.href;
  }

  return "/favicon.ico";
}

function setNotificationFaviconHref(href: string): void {
  let link = document.querySelector<HTMLLinkElement>(
    `link[${NOTIFICATION_FAVICON_ATTR}]`
  );

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.sizes = "32x32";
    link.setAttribute(NOTIFICATION_FAVICON_ATTR, "true");

    const firstIconLink =
      document.querySelector<HTMLLinkElement>(ICON_LINK_SELECTOR);
    if (firstIconLink) {
      document.head.insertBefore(link, firstIconLink);
    } else {
      document.head.appendChild(link);
    }
  }

  link.href = href;
}

function clearNotificationFavicon(): void {
  const link = document.querySelector<HTMLLinkElement>(
    `link[${NOTIFICATION_FAVICON_ATTR}]`
  );
  link?.remove();
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

export function useTabNotification({
  unreadCount,
  defaultTitle,
}: TabNotificationOptions) {
  const originalTitleRef = useRef<string>(document.title);
  const flashIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isBadgeActiveRef = useRef(false);
  const latestNotificationRef = useRef<NotificationInfo | null>(null);
  const activeNotificationTitleRef = useRef<string | null>(null);

  const startTitleFlash = useCallback((info: NotificationInfo) => {
    if (document.visibilityState === "visible") return;

    latestNotificationRef.current = info;

    if (document.title !== activeNotificationTitleRef.current) {
      originalTitleRef.current = document.title;
    }

    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
    }

    const notificationTitle = buildNotificationTitle(info);
    activeNotificationTitleRef.current = notificationTitle;
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
    activeNotificationTitleRef.current = null;
    document.title = originalTitleRef.current;
    latestNotificationRef.current = null;
  }, []);

  const showBadge = useCallback(async () => {
    if (isBadgeActiveRef.current) return;

    try {
      const managedFaviconHref = getCurrentManagedFaviconHref();
      const badgedHref = await createBadgedFavicon(managedFaviconHref);
      setNotificationFaviconHref(badgedHref);
      isBadgeActiveRef.current = true;
    } catch {
      return;
    }
  }, []);

  const clearBadge = useCallback(() => {
    clearNotificationFavicon();
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
    if (!defaultTitle) return;
    if (activeNotificationTitleRef.current !== null) return;

    originalTitleRef.current = defaultTitle;
    document.title = defaultTitle;
  }, [defaultTitle]);

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
    }
  }, [unreadCount, clearAll]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTitle = document.title;
      if (currentTitle !== activeNotificationTitleRef.current) {
        originalTitleRef.current = currentTitle;
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  return { notify, clearTitle, clearBadge, clearAll };
}
