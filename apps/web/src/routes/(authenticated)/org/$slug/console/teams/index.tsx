import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import {
  TeamsTable,
  TeamsTableSkeleton,
} from "@/components/console/teams/teams-table";

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
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="relative min-h-screen space-y-6 p-6 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.15),transparent_50%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.1),transparent_50%)] before:dark:bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_60%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.15),transparent_60%)]">
      <h1 className="mt-2 font-bold text-2xl">Teams</h1>
      <Suspense fallback={<TeamsTableSkeleton />}>
        <TeamsTable />
      </Suspense>
    </section>
  );
}
