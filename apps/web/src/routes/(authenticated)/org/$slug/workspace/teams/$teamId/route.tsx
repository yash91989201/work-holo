import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/teams/$teamId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
