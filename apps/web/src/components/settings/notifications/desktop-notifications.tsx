import { IconBellFilled } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { queryUtils } from "@/utils/orpc";

export function DesktopNotifications() {
  const { requestPermission, isGranted, isDenied } =
    useNotificationPermission();

  const {
    isSubscribed,
    isLoading: isPushLoading,
    subscribe,
    unsubscribe,
    isSupported,
  } = usePushNotifications();

  const {
    mutateAsync: testPushSubscription,
    isPending: isTestingPushSubscription,
  } = useMutation(
    queryUtils.user.pushSubscription.test.mutationOptions({
      onSuccess: (result) => {
        if (result.sent > 0) {
          toast.success("Test notification sent successfully");
        } else {
          toast.warning("No active subscriptions found");
        }
      },
      onError: () => {
        toast.error("Failed to send test notification");
      },
    })
  );

  const handleTogglePermission = async (enabled: boolean) => {
    if (!isSupported) {
      return;
    }

    if (enabled) {
      if (isGranted) {
        return;
      }

      if (isDenied) {
        toast.message(
          "Notifications are blocked in browser settings. Use the lock icon in the address bar to allow them."
        );
        return;
      }

      const permission = await requestPermission();
      if (permission !== "granted") {
        toast.error("Notification permission is required");
      }

      return;
    }

    if (isGranted) {
      toast.message(
        "Browser notification permission can be revoked from site settings."
      );
    }
  };

  const handleTogglePushNotifications = async (enabled: boolean) => {
    if (enabled) {
      await subscribe();
    } else {
      await unsubscribe();
    }
  };

  const handleTestNotification = () => {
    testPushSubscription({});
  };

  return (
    <div className="space-y-3">
      <h3>Desktop Notifications</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Browser Permission</ItemTitle>
            <ItemDescription>
              Allow browser to show notifications (browser-level permission)
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch
              checked={isGranted}
              disabled={!isSupported || isPushLoading}
              onCheckedChange={handleTogglePermission}
            />
          </ItemActions>
        </Item>

        {isDenied && (
          <>
            <Separator />
            <Item>
              <ItemContent>
                <ItemDescription className="text-yellow-600 dark:text-yellow-500">
                  To enable notifications, click the lock icon in your
                  browser&apos;s address bar and update permissions.
                </ItemDescription>
              </ItemContent>
            </Item>
          </>
        )}

        {isGranted && (
          <>
            <Separator />
            <Item>
              <ItemContent>
                <ItemTitle>Push Notifications</ItemTitle>
                <ItemDescription>
                  Receive alerts even when tab is closed or in background
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                {isSupported ? (
                  <Switch
                    checked={isSubscribed}
                    disabled={isPushLoading}
                    onCheckedChange={handleTogglePushNotifications}
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Not supported
                  </span>
                )}
              </ItemActions>
            </Item>
          </>
        )}

        {isSubscribed && isSupported && (
          <>
            <Separator />
            <Item>
              <ItemContent>
                <ItemTitle>Test Notification</ItemTitle>
                <ItemDescription>
                  Send a test notification to verify it&apos;s working
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  disabled={isTestingPushSubscription}
                  onClick={handleTestNotification}
                  size="sm"
                  variant="outline"
                >
                  {isTestingPushSubscription ? (
                    <>
                      <Spinner />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <IconBellFilled />
                      <span>Test</span>
                    </>
                  )}
                </Button>
              </ItemActions>
            </Item>
          </>
        )}
      </div>
    </div>
  );
}
