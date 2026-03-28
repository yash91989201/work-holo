import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { SupportTable } from "@/components/platform/support/support-table";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/support/"
)({
  beforeLoad: ({ context }) => {
    if (context.adminRole !== "super_admin") {
      throw redirect({ to: "/platform/dashboard" });
    }
  },
  staticData: { crumb: "Support Agents" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<SupportTable.Fallback />}>
        <SupportTable />
      </Suspense>
    </section>
  );
}
