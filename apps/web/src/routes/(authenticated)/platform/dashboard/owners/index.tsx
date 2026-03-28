import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { OwnersTable } from "@/components/platform/owners/owners-table";

const OwnersSearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/owners/"
)({
  validateSearch: OwnersSearchSchema,
  staticData: { crumb: "Owners" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<OwnersTable.Fallback />}>
        <OwnersTable />
      </Suspense>
    </section>
  );
}
