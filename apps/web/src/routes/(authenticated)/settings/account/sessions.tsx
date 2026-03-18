import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { CurrentSession, OtherSessions } from "@/components/settings/sessions";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/sessions"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="container mx-auto max-w-3xl space-y-6 p-6">
      <h2 className="font-semibold text-2xl tracking-tight">Manage Sessions</h2>
      <div className="space-y-12">
        <Suspense fallback={<CurrentSession.Fallback />}>
          <CurrentSession />
        </Suspense>

        <Suspense fallback={<OtherSessions.Fallback />}>
          <OtherSessions />
        </Suspense>
      </div>
    </section>
  );
}
