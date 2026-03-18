import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { TeamsTable } from "@/components/console/teams/teams-table";

const TeamsSearchSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  perPage: z.number().int().positive().optional().default(10),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/teams/"
)({
  validateSearch: TeamsSearchSchema,
  staticData: { crumb: "Teams" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<TeamsTable.Fallback />}>
        <TeamsTable />
      </Suspense>
    </section>
  );
}
