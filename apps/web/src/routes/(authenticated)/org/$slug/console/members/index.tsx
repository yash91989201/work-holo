import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { MembersTable } from "@/components/console/members/members-table";

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
    <section className="space-y-6 p-6">
      <Suspense fallback={<MembersTable.Fallback />}>
        <MembersTable />
      </Suspense>
    </section>
  );
}
