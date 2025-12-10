import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { env } from "../env";

interface VersionInfo {
  hash: string;
  timestamp: number;
  date: string;
}

const CHECK_INTERVAL = 5 * 60 * 1000;
const VERSION_URL = "/version.json";

export function useVersionCheck() {
  const currentVersionRef = useRef<string | null>(null);
  const toastIdRef = useRef<string | number | undefined>(undefined);
  const isReloadingRef = useRef(false);

  const reloadWithServiceWorkerUpdate = useCallback(async () => {
    if (isReloadingRef.current) {
      return;
    }

    isReloadingRef.current = true;

    const waitForControllerChange = () =>
      new Promise<void>((resolve) => {
        const onControllerChange = () => {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            onControllerChange
          );
          resolve();
        };

        navigator.serviceWorker.addEventListener(
          "controllerchange",
          onControllerChange
        );
      });

    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();

      if (registration?.waiting) {
        const controllerChanged = waitForControllerChange();
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        await controllerChanged;
        window.location.reload();
        return;
      }

      await registration?.update();
    }

    window.location.reload();
  }, []);

  const fetchVersion = useCallback(async (): Promise<VersionInfo | null> => {
    try {
      const versionUrl = new URL(VERSION_URL, env.VITE_WEB_URL).toString();

      const response = await fetch(`${versionUrl}?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      return await response.json();
    } catch {
      return null;
    }
  }, []);

  const checkVersion = useCallback(async () => {
    const versionInfo = await fetchVersion();

    if (!versionInfo) return;

    if (currentVersionRef.current === null) {
      currentVersionRef.current = versionInfo.hash;
      return;
    }

    if (currentVersionRef.current !== versionInfo.hash) {
      if (toastIdRef.current !== undefined) {
        toast.dismiss(toastIdRef.current);
      }

      toastIdRef.current = toast.info("New version available", {
        description:
          "A new version of the app is available. Refresh to update.",
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: "Update",
          onClick: () => {
            reloadWithServiceWorkerUpdate();
          },
        },
        cancel: {
          label: "Later",
          onClick: () => {
            if (toastIdRef.current !== undefined) {
              toast.dismiss(toastIdRef.current);
            }
          },
        },
      });

      currentVersionRef.current = versionInfo.hash;
    }
  }, [fetchVersion, reloadWithServiceWorkerUpdate]);

  useEffect(() => {
    if (env.VITE_ENV !== "production") {
      return;
    }

    checkVersion();

    const interval = setInterval(checkVersion, CHECK_INTERVAL);

    const handleFocus = () => {
      checkVersion();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      if (toastIdRef.current !== undefined) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [checkVersion]);
}
