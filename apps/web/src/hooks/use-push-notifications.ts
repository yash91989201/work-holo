import { useEffect, useRef, useState } from "react";
import {
  isPushSubscribed,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "@/lib/push-subscription";

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  const hasInitialized = useRef(false);

  // Check initial subscription status and permission
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    async function checkStatus() {
      setIsLoading(true);

      // Check notification permission
      if ("Notification" in window) {
        setPermission(Notification.permission);
      }

      // Check if already subscribed
      const subscribed = await isPushSubscribed();
      setIsSubscribed(subscribed);

      setIsLoading(false);
    }

    checkStatus();
  }, []);

  // Subscribe to push notifications
  const subscribe = async () => {
    setIsLoading(true);

    try {
      const subscription = await subscribeToPushNotifications();

      if (subscription) {
        setIsSubscribed(true);
        setPermission(Notification.permission);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Unsubscribe from push notifications
  const unsubscribe = async () => {
    setIsLoading(true);

    try {
      const unsubscribed = await unsubscribeFromPushNotifications();

      if (unsubscribed) {
        setIsSubscribed(false);
      }

      return unsubscribed;
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    isSupported: "Notification" in window && "serviceWorker" in navigator,
  };
}
