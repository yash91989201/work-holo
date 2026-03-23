import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { AdminsTable } from "@/components/platform/admins/admins-table";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/admins/"
)({
  beforeLoad: ({ context }) => {
    if (context.adminRole !== "super_admin") {
      throw redirect({ to: "/platform/dashboard" });
    }
  },
  staticData: { crumb: "Admins" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="font-semibold text-2xl">Admins</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Promote users to admin from the Users page. Manage existing admins
          here.
        </p>
      </div>
      <Suspense fallback={<AdminsTable.Fallback />}>
        <AdminsTable />
      </Suspense>
    </section>
  );
}
