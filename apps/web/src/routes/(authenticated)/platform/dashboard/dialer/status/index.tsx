import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Suspense } from "react";
import { ServerStatusCard } from "@/components/platform/dialer/status/server-status-card";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/dialer/status/"
)({
  staticData: { crumb: "Server Status" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ServerStatusCard />
      </Suspense>
    </section>
  );
}
