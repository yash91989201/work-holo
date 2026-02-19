import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import {
  MemberListTableSkeleton,
  MembersTable,
} from "@/components/console/members/members-table";

const MembersSearchSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  perPage: z.number().int().positive().optional().default(10),
  search: z.string().optional(),
  role: z.enum(["all", "owner", "admin", "member"]).optional().default("all"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/members/"
)({
  validateSearch: MembersSearchSchema,
  staticData: { crumb: "Members" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="relative min-h-screen space-y-6 p-6 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.15),transparent_50%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.1),transparent_50%)] before:dark:bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_60%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.15),transparent_60%)]">
      <h1 className="mt-2 font-bold text-2xl">Members</h1>
      <Suspense fallback={<MemberListTableSkeleton />}>
        <MembersTable />
      </Suspense>
    </section>
  );
}
