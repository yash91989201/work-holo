import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useNotificationSound } from "@/hooks/communications/use-notification-sound";

export const Route = createFileRoute("/(authenticated)")({
	beforeLoad: ({ context }) => {
		const session = context.session;

		if (!session) {
			throw redirect({
				to: "/",
			});
		}

		return { session };
	},
	component: RouteComponent,
});

function RouteComponent() {
	useNotificationSound();

	return <Outlet />;
}
