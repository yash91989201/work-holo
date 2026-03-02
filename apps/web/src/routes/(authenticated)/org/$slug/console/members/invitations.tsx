import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { InvitationsTable } from "@/components/console/invitations/invitations-table";

const InvitationsSearchSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  perPage: z.number().int().positive().optional().default(10),
  search: z.string().optional(),
  role: z
    .enum(["all", "admin", "manager", "team-lead", "member"])
    .optional()
    .default("all"),
  status: z
    .enum(["all", "pending", "accepted", "rejected", "expired"])
    .optional()
    .default("all"),
  expiryStartDate: z.string().optional(),
  expiryEndDate: z.string().optional(),
  inviteMemberForm: z.enum(["open", "close"]).optional(),
});

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/members/invitations"
)({
  validateSearch: InvitationsSearchSchema,
  staticData: { crumb: "Invitations" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<InvitationsTable.Fallback />}>
        <InvitationsTable />
      </Suspense>
    </section>
  );
}
