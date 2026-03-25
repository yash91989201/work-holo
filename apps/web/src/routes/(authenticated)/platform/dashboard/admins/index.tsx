import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { AdminsTable } from "@/components/platform/admins/admins-table";

const AdminsSearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/admins/"
)({
  validateSearch: AdminsSearchSchema,
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
      <Suspense fallback={<AdminsTable.Fallback />}>
        <AdminsTable />
      </Suspense>
    </section>
  );
}
