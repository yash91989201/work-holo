import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { TrunksTable } from "@/components/platform/dialer/trunks/trunks-table";

const TrunksSearchSchema = z.object({
  search: z.string().optional(),
  provider: z.string().optional(),
});

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/dialer/trunks/"
)({
  validateSearch: TrunksSearchSchema,
  staticData: { crumb: "SIP Trunks" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<TrunksTable.Fallback />}>
        <TrunksTable />
      </Suspense>
    </section>
  );
}
