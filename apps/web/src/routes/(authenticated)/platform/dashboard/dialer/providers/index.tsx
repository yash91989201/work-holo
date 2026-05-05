import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ProvidersTable } from "@/components/platform/dialer/providers/providers-table";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/dialer/providers/"
)({
  staticData: { crumb: "SIP Providers" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<ProvidersTable.Fallback />}>
        <ProvidersTable />
      </Suspense>
    </section>
  );
}
