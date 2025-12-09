import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

interface VersionInfo {
  hash: string;
  timestamp: number;
  date: string;
}

const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
const VERSION_URL = "/version.json";

export function useVersionCheck() {
  const currentVersionRef = useRef<string | null>(null);
  const toastIdRef = useRef<string | number | undefined>(undefined);

  const fetchVersion = useCallback(async (): Promise<VersionInfo | null> => {
    try {
      // Add cache buster to ensure we get fresh data
      const response = await fetch(`${VERSION_URL}?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        console.warn("Failed to fetch version info");
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching version:", error);
      return null;
    }
  }, []);

  const checkVersion = useCallback(async () => {
    const versionInfo = await fetchVersion();

    if (!versionInfo) return;

    // Initialize current version on first check
    if (currentVersionRef.current === null) {
      currentVersionRef.current = versionInfo.hash;
      console.log("Current version:", versionInfo.hash);
      return;
    }

    // Check if version has changed
    if (currentVersionRef.current !== versionInfo.hash) {
      console.log(
        "New version detected:",
        versionInfo.hash,
        "Previous:",
        currentVersionRef.current
      );

      // Dismiss any existing toast
      if (toastIdRef.current !== undefined) {
        toast.dismiss(toastIdRef.current);
      }

      // Show update notification
      toastIdRef.current = toast.info("New version available", {
        description:
          "A new version of the app is available. Refresh to update.",
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: "Refresh",
          onClick: () => {
            window.location.reload();
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

      // Update current version
      currentVersionRef.current = versionInfo.hash;
    }
  }, [fetchVersion]);

  useEffect(() => {
    // Initial check
    checkVersion();

    // Set up periodic checks
    const interval = setInterval(checkVersion, CHECK_INTERVAL);

    // Check on window focus (when user returns to tab)
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
