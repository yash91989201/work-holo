import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { OrgAssignmentsTable } from "@/components/platform/dialer/org-assignments/org-assignments-table";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/dialer/org-assignments/"
)({
  staticData: { crumb: "Org Assignments" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<OrgAssignmentsTable.Fallback />}>
        <OrgAssignmentsTable />
      </Suspense>
    </section>
  );
}
