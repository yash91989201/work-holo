import { Bell, BellOff, Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { Switch } from "../ui/switch";

export function NotificationSettings() {
  const { requestPermission, isGranted, isDenied, isDefault } =
    useNotificationPermission();

  const {
    isSubscribed,
    isLoading: isPushLoading,
    subscribe,
    unsubscribe,
    isSupported,
  } = usePushNotifications();

  const [isTesting, setIsTesting] = useState(false);

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  const handleTogglePushNotifications = async (enabled: boolean) => {
    if (enabled) {
      await subscribe();
    } else {
      await unsubscribe();
    }
  };

  const handleTestNotification = async () => {
    setIsTesting(true);
    try {
      const { testPushNotification } = await import("@/lib/push-subscription");
      await testPushNotification();
    } catch (error) {
      console.error("Failed to send test notification:", error);
    } finally {
      setIsTesting(false);
    }
  };

  const getPermissionStatus = () => {
    if (isGranted) {
      return (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <Check className="size-4" />
          <span className="font-medium text-sm">Enabled</span>
        </div>
      );
    }

    if (isDenied) {
      return (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <X className="size-4" />
          <span className="font-medium text-sm">Blocked</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <BellOff className="size-4" />
        <span className="font-medium text-sm">Not enabled</span>
      </div>
    );
  };

  const getPermissionAction = () => {
    if (isGranted) {
      return null;
    }

    if (isDenied) {
      return (
        <p className="text-muted-foreground text-sm">
          You've blocked notifications. To enable them, update your browser
          settings.
        </p>
      );
    }

    return (
      <Button onClick={handleRequestPermission} variant="outline">
        <Bell className="size-3" />
        <span>Enable Notifications</span>
      </Button>
    );
  };

  return (
    <div className="space-y-3">
      <h3>Notifications</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Desktop Notifications</ItemTitle>
            <ItemDescription>
              Get notified about mentions and messages
            </ItemDescription>
            <div className="mt-3">{getPermissionStatus()}</div>
            {!isGranted && <div className="mt-3">{getPermissionAction()}</div>}
          </ItemContent>
          {isGranted && (
            <ItemActions>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Check className="size-5" />
              </div>
            </ItemActions>
          )}
        </Item>

        {isGranted && (
          <>
            <Separator />
            <Item>
              <ItemContent>
                <ItemTitle>Push Notifications</ItemTitle>
                <ItemDescription>
                  Receive alerts even when tab is closed or in background
                </ItemDescription>
                {isSupported ? (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {isSubscribed ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={isSubscribed}
                        disabled={isPushLoading}
                        onCheckedChange={handleTogglePushNotifications}
                      />
                    </div>
                    {isSubscribed && (
                      <Button
                        disabled={isTesting}
                        onClick={handleTestNotification}
                        size="sm"
                        variant="outline"
                      >
                        {isTesting ? (
                          <>
                            <span className="size-3 animate-spin">⏳</span>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Bell className="size-3" />
                            <span>Test Notification</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-muted-foreground text-sm">
                    Not supported in your browser
                  </p>
                )}
              </ItemContent>
            </Item>
          </>
        )}
      </div>

      {isDefault && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
          <p className="font-medium text-sm">
            Enable to never miss mentions and messages
          </p>
        </div>
      )}

      {isDenied && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100">
          <p className="font-medium text-sm">
            Click the lock icon in your browser's address bar to allow
            notifications
          </p>
        </div>
      )}
    </div>
  );
}
