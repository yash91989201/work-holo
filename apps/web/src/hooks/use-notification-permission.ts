import { useEffect, useState } from "react";

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification === "undefined" ? "default" : Notification.permission
  );

  useEffect(() => {
    if (typeof Notification === "undefined") return;

    const handlePermissionChange = () => {
      setPermission(Notification.permission);
    };

    // Listen for permission changes
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "notifications" })
        .then((permissionStatus) => {
          permissionStatus.addEventListener("change", handlePermissionChange);
          return () => {
            permissionStatus.removeEventListener(
              "change",
              handlePermissionChange
            );
          };
        })
        .catch(() => {
          // Some browsers don't support querying notification permission
        });
    }
  }, []);

  const requestPermission = async () => {
    if (typeof Notification === "undefined") {
      return "denied";
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  return {
    permission,
    requestPermission,
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    isDefault: permission === "default",
  };
}
