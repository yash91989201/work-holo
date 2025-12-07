import { createFileRoute } from "@tanstack/react-router";
import { AdminTeamsManagement } from "@/components/admin/teams-management";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/dashboard/teams/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminTeamsManagement />;
}
