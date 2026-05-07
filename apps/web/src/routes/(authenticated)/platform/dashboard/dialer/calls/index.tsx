import { createFileRoute } from "@tanstack/react-router";
import { AdminCallsTable } from "@/components/platform/dialer/calls/calls-table";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/dialer/calls/"
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
          All calls across every organization.
        </p>
      </div>
      <AdminCallsTable />
    </section>
  );
}
