import { createFileRoute } from "@tanstack/react-router";
import {
  DesktopNotifications,
  EmailNotifications,
  SoundNotifications,
} from "@/components/settings/notifications";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/notifications"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="space-y-6">
        <h2 className="font-semibold text-2xl tracking-tight">Notifications</h2>
        <div className="space-y-8">
          <SoundNotifications />
          <DesktopNotifications />
          <EmailNotifications />
        </div>
      </div>
    </div>
  );
}
