import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { DesktopNotifications } from "@/components/settings/notifications/desktop-notifications";
import { EmailNotifications } from "@/components/settings/notifications/email-notifications";
import { SoundNotifications } from "@/components/settings/notifications/sound-notifications";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/notifications"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="container mx-auto max-w-3xl space-y-6 p-6">
      <h2 className="font-semibold text-2xl tracking-tight">Notifications</h2>
      <div className="space-y-12">
        <Suspense fallback={<SoundNotifications.Fallback />}>
          <SoundNotifications />
        </Suspense>
        <DesktopNotifications />
        <Suspense fallback={<EmailNotifications.Fallback />}>
          <EmailNotifications />
        </Suspense>
      </div>
    </section>
  );
}
