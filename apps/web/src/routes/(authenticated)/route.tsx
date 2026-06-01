import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useNotificationSound } from "@/hooks/communications/use-notification-sound";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/(authenticated)")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

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
