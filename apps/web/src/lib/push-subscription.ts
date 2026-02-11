import { orpcClient } from "@/utils/orpc";
import { getServiceWorkerRegistration } from "./service-worker";

/**
 * Convert a base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("Notifications are not supported in this browser");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.warn("Notifications are not supported in this browser");
      return null;
    }

    // Request permission if not granted
    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    // Get service worker registration
    const registration = await getServiceWorkerRegistration();
    if (!registration) {
      console.error("Service worker not registered");
      return null;
    }

    // Get VAPID public key from server
    const { publicKey } =
      await orpcClient.user.pushSubscription.getVapidPublicKey();

    // Convert VAPID key to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    const p256dhKey = subscription.getKey("p256dh");
    const authKey = subscription.getKey("auth");

    if (!(p256dhKey && authKey)) {
      return null;
    }

    await orpcClient.user.pushSubscription.save({
      subscription: {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(p256dhKey))),
          auth: btoa(String.fromCharCode(...new Uint8Array(authKey))),
        },
      },
      userAgent: navigator.userAgent,
    });

    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const registration = await getServiceWorkerRegistration();
    if (!registration) {
      return false;
    }

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      return false;
    }

    // Unsubscribe from push manager
    const unsubscribed = await subscription.unsubscribe();

    if (unsubscribed) {
      // Remove subscription from server
      await orpcClient.user.pushSubscription.remove({
        endpoint: subscription.endpoint,
      });
    }

    return unsubscribed;
  } catch (error) {
    console.error("Failed to unsubscribe from push notifications:", error);
    return false;
  }
}

/**
 * Check if user is subscribed to push notifications
 */
export async function isPushSubscribed(): Promise<boolean> {
  try {
    const registration = await getServiceWorkerRegistration();
    if (!registration) {
      return false;
    }

    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch (error) {
    console.error("Failed to check push subscription status:", error);
    return false;
  }
}

/**
 * Get current push subscription
 */
export async function getPushSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await getServiceWorkerRegistration();
    if (!registration) {
      return null;
    }

    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error("Failed to get push subscription:", error);
    return null;
  }
}

/**
 * Test push notification
 */
export async function testPushNotification(): Promise<boolean> {
  try {
    const result =
      await orpcClient.user.pushSubscription.test();
    return result.success && result.sent > 0;
  } catch (error) {
    console.error("Failed to send test push notification:", error);
    return false;
  }
}
