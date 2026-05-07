import { createFileRoute } from "@tanstack/react-router";
import { OrgCallsTable } from "@/components/console/dialer/calls-table";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/dialer/calls/"
)({
  staticData: { crumb: "Call Logs" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <div>
        <h2 className="font-semibold text-lg">Call Logs</h2>
        <p className="text-muted-foreground text-sm">
          Call history for your organization.
        </p>
      </div>
      <OrgCallsTable />
    </section>
  );
}
