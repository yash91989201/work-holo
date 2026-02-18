import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";
import { useNotificationSound } from "@/hooks/communications/use-notification-sound";
import { PermissionProvider } from "@/lib/permission";

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
