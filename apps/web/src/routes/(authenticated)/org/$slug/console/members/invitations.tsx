import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import {
  InvitationListTableSkeleton,
  InvitationsTable,
} from "@/components/console/invitations/invitations-table";

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
});

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/members/invitations"
)({
  validateSearch: InvitationsSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="relative space-y-6 p-6 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.15),transparent_50%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.1),transparent_50%)] before:dark:bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_60%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.15),transparent_60%)]">
      <div className="mb-6">
        <h1 className="font-bold text-2xl">Manage Invitations</h1>
        <p className="text-muted-foreground">
          Send, track, and manage member invitations to your organization
        </p>
      </div>

      <Suspense fallback={<InvitationListTableSkeleton />}>
        <InvitationsTable />
      </Suspense>
    </section>
  );
}
