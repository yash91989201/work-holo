import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  CurrentSession,
  CurrentSessionSkeleton,
  OtherSessions,
  OtherSessionsSkeleton,
} from "@/components/settings/sessions";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/sessions"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="space-y-6">
        <h2 className="font-semibold text-2xl tracking-tight">
          Manage Sessions
        </h2>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3>Current session</h3>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
              <Suspense fallback={<CurrentSessionSkeleton />}>
                <CurrentSession />
              </Suspense>
            </div>
          </div>

          <div className="space-y-3">
            <h3>Other sessions</h3>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
              <Suspense fallback={<OtherSessionsSkeleton />}>
                <OtherSessions />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
