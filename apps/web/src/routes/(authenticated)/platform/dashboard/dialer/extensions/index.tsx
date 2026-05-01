import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { ExtensionsTable } from "@/components/platform/dialer/extensions/extensions-table";

const ExtensionsSearchSchema = z.object({
  search: z.string().optional(),
  organizationId: z.string().optional(),
});

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/dialer/extensions/"
)({
  validateSearch: ExtensionsSearchSchema,
  staticData: { crumb: "Agent Extensions" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<ExtensionsTable.Fallback />}>
        <ExtensionsTable />
      </Suspense>
    </section>
  );
}
