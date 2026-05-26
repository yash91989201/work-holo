import {
  IconBellFilled,
  IconCheck,
  IconCopy,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@work-holo/ui/components/alert";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { Separator } from "@work-holo/ui/components/separator";
import { Spinner } from "@work-holo/ui/components/spinner";
import { Switch } from "@work-holo/ui/components/switch";
import { useState } from "react";
import { toast } from "sonner";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { queryUtils } from "@/utils/orpc";

const BRAVE_PUSH_FIX_TOAST_ID = "brave-push-notification-fix";
const BRAVE_PUSH_SETTINGS_URL = "brave://settings/privacy";

async function isBraveBrowser(): Promise<boolean> {
  if (typeof navigator === "undefined") {
    return false;
  }

  const navigatorWithBrave = navigator as Navigator & {
    brave?: { isBrave?: () => Promise<boolean> };
  };

  if (typeof navigatorWithBrave.brave?.isBrave === "function") {
    try {
      return await navigatorWithBrave.brave.isBrave();
    } catch {
      return false;
    }
  }

  return navigator.userAgent.includes("Brave");
}

async function copyToClipboard(value: string): Promise<boolean> {
  if (typeof navigator === "undefined") {
    return false;
  }

  if (!navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

interface BravePushFixToastContentProps {
  onCopyUrl: () => Promise<boolean>;
  onDismiss: () => void;
}

function BravePushFixToastContent({
  onCopyUrl,
  onDismiss,
}: BravePushFixToastContentProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const copied = await onCopyUrl();
    if (copied) {
      setIsCopied(true);
    }
  };

  return (
    <div className="w-[min(26rem,calc(100vw-2rem))] space-y-3 rounded-lg border bg-background p-4 text-foreground shadow-lg">
      <div className="space-y-1.5">
        <Badge className="rounded-md" variant="outline">
          Brave Fix
        </Badge>
        <p className="font-medium text-sm leading-tight">
          Push notifications could not be enabled in Brave
        </p>
      </div>

      <Alert className="bg-muted/30 px-3 py-2" variant="default">
        <IconInfoCircle className="size-4" />
        <AlertTitle className="text-xs">Why this happens</AlertTitle>
        <AlertDescription className="text-xs leading-relaxed">
          Brave can block web push registration until one privacy setting is
          enabled.
        </AlertDescription>
      </Alert>

      <Separator />

      <div className="space-y-2">
        <p className="font-medium text-xs">How to fix this</p>

        <ol className="list-decimal space-y-1.5 pl-4 text-xs leading-relaxed">
          <li>
            Open{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono">
              {BRAVE_PUSH_SETTINGS_URL}
            </code>{" "}
            in Brave.
          </li>
          <li>Enable &quot;Use Google services for push messaging&quot;.</li>
          <li>Click the Relaunch button shown to the left of the toggle.</li>
          <li>
            After Brave relaunches, try enabling Push Notifications again.
          </li>
        </ol>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          onClick={() => {
            handleCopy().catch(() => {
              setIsCopied(false);
            });
          }}
          size="xs"
          type="button"
          variant="outline"
        >
          {isCopied ? (
            <IconCheck className="size-3 text-emerald-500" />
          ) : (
            <IconCopy className="size-3" />
          )}
          <span>{isCopied ? "Copied" : "Copy URL"}</span>
        </Button>
        <Button onClick={onDismiss} size="xs" type="button">
          Ok, understood
        </Button>
      </div>
    </div>
  );
}

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
      const subscribed = await subscribe();

      if (subscribed) {
        toast.dismiss(BRAVE_PUSH_FIX_TOAST_ID);
        return;
      }

      if (await isBraveBrowser()) {
        const handleCopySettingsUrl = async () =>
          copyToClipboard(BRAVE_PUSH_SETTINGS_URL);

        toast.custom(
          () => (
            <BravePushFixToastContent
              onCopyUrl={handleCopySettingsUrl}
              onDismiss={() => {
                toast.dismiss(BRAVE_PUSH_FIX_TOAST_ID);
              }}
            />
          ),
          {
            id: BRAVE_PUSH_FIX_TOAST_ID,
            duration: Number.POSITIVE_INFINITY,
          }
        );
      }
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
