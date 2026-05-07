import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { AgentAccessTable } from "@/components/console/dialer/agent-access-table";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/dialer/"
)({
  staticData: { crumb: "Dialer" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <div>
        <h2 className="font-semibold text-lg">Dialer Access</h2>
        <p className="text-muted-foreground text-sm">
          Assign DIDs and configure calling permissions for each member.
        </p>
      </div>
      <Suspense fallback={null}>
        <AgentAccessTable />
      </Suspense>
    </section>
  );
}
