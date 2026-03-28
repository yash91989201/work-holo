import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { OrganizationsGrid } from "@/components/platform/organizations/organizations-grid";

const OrganizationsSearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/organizations/"
)({
  validateSearch: OrganizationsSearchSchema,
  staticData: { crumb: "Organizations" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<OrganizationsGrid.Fallback />}>
        <OrganizationsGrid />
      </Suspense>
    </section>
  );
}
