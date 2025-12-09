import { Bell, BellOff, Check, X } from "lucide-react";
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

export function NotificationSettings() {
  const { requestPermission, isGranted, isDenied, isDefault } =
    useNotificationPermission();

  const handleRequestPermission = async () => {
    await requestPermission();
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
      <h3>Notification manager</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Desktop Notifications</ItemTitle>
            <ItemDescription>
              Receive desktop notifications with sound when you get mentions or
              messages while the app is in the background
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
                <ItemTitle>How it works</ItemTitle>
                <ItemDescription>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground text-sm">
                    <li>
                      When the app is focused: sounds play directly in the
                      browser
                    </li>
                    <li>
                      When the app is in the background: desktop notifications
                      appear with sound
                    </li>
                    <li>
                      You'll receive notifications for mentions and new messages
                      in your channels
                    </li>
                  </ul>
                </ItemDescription>
              </ItemContent>
            </Item>
          </>
        )}
      </div>

      {isDefault && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
          <p className="font-medium text-sm">Why enable notifications?</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>Never miss important mentions or messages</li>
            <li>Stay updated even when working in other apps</li>
            <li>Get instant alerts with sound notifications</li>
          </ul>
        </div>
      )}

      {isDenied && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100">
          <p className="font-medium text-sm">How to enable notifications:</p>
          <ul className="mt-2 list-inside list-decimal space-y-1 text-sm">
            <li>
              Click the lock icon or settings icon in your browser's address bar
            </li>
            <li>Find "Notifications" in the permissions list</li>
            <li>Change the setting from "Block" to "Allow"</li>
            <li>Reload this page</li>
          </ul>
        </div>
      )}
    </div>
  );
}
