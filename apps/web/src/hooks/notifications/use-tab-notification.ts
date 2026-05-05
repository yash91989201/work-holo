import { useCallback, useEffect, useRef } from "react";
import { TAB_UNREAD_COUNT_CHANGED_EVENT } from "@/hooks/communications/use-notifications";

interface TabNotificationOptions {
  defaultTitle?: string;
  unreadCount: number;
}

interface NotificationInfo {
  actorName: string;
  channelName: string | null;
  eventType: string;
}

const FLASH_INTERVAL_MS = 2000;
const BADGE_COLOR = "#ef4444";
const BADGE_TEXT_COLOR = "#ffffff";
const BADGE_FONT_SIZE = 15;
const BADGE_MIN_WIDTH = 20;
const BADGE_HEIGHT = 20;
const BADGE_HORIZONTAL_PADDING = 3;
const NOTIFICATION_FAVICON_ATTR = "data-tab-notification-favicon";
const ICON_LINK_SELECTOR = 'link[rel~="icon"]';

const noop = () => undefined;

function formatUnreadCount(unreadCount: number): string {
  if (unreadCount > 99) {
    return "99+";
  }

  return String(Math.max(1, unreadCount));
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  const cornerRadius = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.lineTo(x + width - cornerRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
  ctx.lineTo(x + width, y + height - cornerRadius);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - cornerRadius,
    y + height
  );
  ctx.lineTo(x + cornerRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
  ctx.lineTo(x, y + cornerRadius);
  ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
  ctx.closePath();
}

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

  if (!link) {
    return;
  }

  const resetHref = getCurrentManagedFaviconHref();

  try {
    const resetUrl = new URL(resetHref, window.location.href);
    resetUrl.searchParams.set("tabNotificationReset", `${Date.now()}`);
    link.href = resetUrl.toString();
  } catch {
    link.href = resetHref;
  }

  requestAnimationFrame(() => {
    link.remove();
  });
}

function buildNotificationTitle(info: NotificationInfo): string {
  switch (info.eventType) {
    case "channel_mention":
      return `🔔 ${info.actorName} mentioned you in #${info.channelName ?? "a channel"}`;
    case "channel_message":
      return `🔔 ${info.actorName} sent a message in #${info.channelName ?? "a channel"}`;
    case "channel_reply":
      return `🔔 ${info.actorName} replied in #${info.channelName ?? "a channel"}`;
    case "channel_reaction":
      return `🔔 ${info.actorName} reacted in #${info.channelName ?? "a channel"}`;
    case "dm_reply":
      return `🔔 ${info.actorName} replied to your message`;
    case "dm_reaction":
      return `🔔 ${info.actorName} reacted to your message`;
    case "dm_message":
      return `🔔 ${info.actorName} sent you a message`;
    default:
      if (info.channelName) {
        return `🔔 ${info.actorName} in #${info.channelName}`;
      }
      return `🔔 ${info.actorName} sent you a message`;
  }
}

function createBadgedFavicon(
  originalHref: string,
  unreadCount: number
): Promise<string> {
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

      const badgeText = formatUnreadCount(unreadCount);
      ctx.font = `800 ${BADGE_FONT_SIZE}px sans-serif`;
      const textWidth = ctx.measureText(badgeText).width;
      const badgeWidth = Math.max(
        BADGE_MIN_WIDTH,
        Math.ceil(textWidth + BADGE_HORIZONTAL_PADDING * 2)
      );
      const badgeX = (size - badgeWidth) / 2;
      const badgeY = (size - BADGE_HEIGHT) / 2;

      drawRoundedRect(
        ctx,
        badgeX,
        badgeY,
        badgeWidth,
        BADGE_HEIGHT,
        BADGE_HEIGHT / 2
      );
      ctx.fillStyle = BADGE_COLOR;
      ctx.fill();

      ctx.fillStyle = BADGE_TEXT_COLOR;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        badgeText,
        badgeX + badgeWidth / 2,
        badgeY + BADGE_HEIGHT / 2
      );

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
  const badgeGenerationIdRef = useRef(0);
  const lastBadgeCountRef = useRef<number | null>(null);
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

  const showBadge = useCallback(async (badgeCount: number) => {
    if (badgeCount <= 0) return;

    if (isBadgeActiveRef.current && lastBadgeCountRef.current === badgeCount) {
      return;
    }

    const generationId = ++badgeGenerationIdRef.current;

    try {
      const managedFaviconHref = getCurrentManagedFaviconHref();
      const badgedHref = await createBadgedFavicon(
        managedFaviconHref,
        badgeCount
      );

      if (generationId !== badgeGenerationIdRef.current) {
        return;
      }

      setNotificationFaviconHref(badgedHref);
      isBadgeActiveRef.current = true;
      lastBadgeCountRef.current = badgeCount;
    } catch {
      return;
    }
  }, []);

  const clearBadge = useCallback(() => {
    badgeGenerationIdRef.current += 1;
    clearNotificationFavicon();
    isBadgeActiveRef.current = false;
    lastBadgeCountRef.current = null;
  }, []);

  const clearAll = useCallback(() => {
    clearTitle();
    clearBadge();
  }, [clearTitle, clearBadge]);

  const notify = useCallback(
    (info: NotificationInfo) => {
      startTitleFlash(info);

      const optimisticNextCount =
        Math.max(lastBadgeCountRef.current ?? 0, unreadCount, 0) + 1;

      showBadge(optimisticNextCount).catch(noop);
    },
    [startTitleFlash, showBadge, unreadCount]
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
      return;
    }

    showBadge(unreadCount).catch(noop);
  }, [unreadCount, clearAll, showBadge]);

  useEffect(() => {
    const handleUnreadCountChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{ unreadCount: number }>;
      const nextUnreadCount = customEvent.detail?.unreadCount;

      if (typeof nextUnreadCount !== "number") {
        return;
      }

      if (nextUnreadCount <= 0) {
        clearAll();
        return;
      }

      showBadge(nextUnreadCount).catch(noop);
    };

    window.addEventListener(
      TAB_UNREAD_COUNT_CHANGED_EVENT,
      handleUnreadCountChanged
    );

    return () => {
      window.removeEventListener(
        TAB_UNREAD_COUNT_CHANGED_EVENT,
        handleUnreadCountChanged
      );
    };
  }, [clearAll, showBadge]);

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

  useEffect(
    () => () => {
      clearAll();
    },
    [clearAll]
  );

  return { notify, clearTitle, clearBadge, clearAll };
}
