import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { StatsCards } from "@/components/platform/overview/stats-cards";

export const Route = createFileRoute("/(authenticated)/platform/dashboard/")({
  staticData: { crumb: "Overview" },
  component: RouteComponent,
});

function RouteComponent() {
  const { adminRole } = Route.useRouteContext();

  return (
    <section className="space-y-6 p-6">
      <h1 className="font-semibold text-2xl">Platform Overview</h1>
      {adminRole === "super_admin" ? (
        <Suspense fallback={<StatsCards.Fallback />}>
          <StatsCards />
        </Suspense>
      ) : (
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Use the sidebar to navigate.
        </p>
      )}
    </section>
  );
}
