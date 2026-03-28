import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { UsersTable } from "@/components/platform/users/users-table";

const UsersSearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/users/"
)({
  validateSearch: UsersSearchSchema,
  staticData: { crumb: "Users" },
  component: RouteComponent,
});

function RouteComponent() {
  const { adminRole } = Route.useRouteContext();

  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<UsersTable.Fallback />}>
        <UsersTable adminRole={adminRole} />
      </Suspense>
    </section>
  );
}
