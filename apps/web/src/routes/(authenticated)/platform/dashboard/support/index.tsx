import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { SupportTable } from "@/components/platform/support/support-table";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/support/"
)({
  beforeLoad: ({ context }) => {
    if ((context as Record<string, unknown>).adminRole !== "super_admin") {
      throw redirect({ to: "/platform/dashboard" });
    }
  },
  staticData: { crumb: "Support Agents" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="font-semibold text-2xl">Support Agents</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Support agents have read-only access to users and sessions. Promote
          users from the Users page.
        </p>
      </div>
      <Suspense fallback={<SupportTable.Fallback />}>
        <SupportTable />
      </Suspense>
    </section>
  );
}
