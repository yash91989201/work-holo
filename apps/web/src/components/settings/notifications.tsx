import { Bell } from "lucide-react";
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
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";

export function WebNotifications() {
	const { requestPermission, isGranted, isDenied, isDefault } =
		useNotificationPermission();

	const handleToggle = async (enabled: boolean) => {
		if (enabled && isDefault) {
			await requestPermission();
		}
	};

	return (
		<div className="space-y-3">
			<h3>Web Notifications</h3>
			<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
				<Item>
					<ItemContent>
						<ItemTitle>Browser Notifications</ItemTitle>
						<ItemDescription>
							Get notified about mentions and messages
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Switch
							checked={isGranted}
							disabled={isDenied}
							onCheckedChange={handleToggle}
						/>
					</ItemActions>
				</Item>

				{isDenied && (
					<>
						<Separator />
						<Item>
							<ItemContent>
								<ItemDescription className="text-yellow-600 dark:text-yellow-500">
									To enable notifications, click the lock icon in your browser's
									address bar and update permissions.
								</ItemDescription>
							</ItemContent>
						</Item>
					</>
				)}
			</div>
		</div>
	);
}

export function PushNotifications() {
	const { isGranted } = useNotificationPermission();
	const {
		isSubscribed,
		isLoading: isPushLoading,
		subscribe,
		unsubscribe,
		isSupported,
	} = usePushNotifications();

	const [isTesting, setIsTesting] = useState(false);

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
		} finally {
			setIsTesting(false);
		}
	};

	if (!isGranted) {
		return null;
	}

	return (
		<div className="space-y-3">
			<h3>Push Notifications</h3>
			<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
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

				{isSubscribed && isSupported && (
					<>
						<Separator />
						<Item>
							<ItemContent>
								<ItemTitle>Test Notification</ItemTitle>
								<ItemDescription>
									Send a test notification to verify it's working
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Button
									disabled={isTesting}
									onClick={handleTestNotification}
									size="sm"
									variant="outline"
								>
									{isTesting ? (
										<>
											<Spinner />
											<span>Testing...</span>
										</>
									) : (
										<>
											<Bell className="size-3" />
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
