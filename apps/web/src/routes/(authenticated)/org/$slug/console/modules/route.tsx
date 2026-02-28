import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/modules"
)({
  staticData: { crumb: "Modules" },
  component: () => <Outlet />,
});
