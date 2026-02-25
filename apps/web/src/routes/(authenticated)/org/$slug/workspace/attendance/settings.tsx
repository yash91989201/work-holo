import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/attendance/settings"
)({
  staticData: { crumb: "Settings" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/(authenticated)/org/$slug/apps/attendance/settings"!</div>
  );
}
