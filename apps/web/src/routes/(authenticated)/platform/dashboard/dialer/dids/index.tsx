import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { DidsTable } from "@/components/platform/dialer/dids/dids-table";

const DidsSearchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["available", "assigned", "retired", "blocked"]).optional(),
  sipTrunkId: z.string().optional(),
  organizationId: z.string().optional(),
});

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/dialer/dids/"
)({
  validateSearch: DidsSearchSchema,
  staticData: { crumb: "DID Inventory" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<DidsTable.Fallback />}>
        <DidsTable />
      </Suspense>
    </section>
  );
}
