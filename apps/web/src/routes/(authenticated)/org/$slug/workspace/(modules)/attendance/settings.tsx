import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/(modules)/attendance/settings"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/(authenticated)/org/$slug/apps/attendance/settings"!</div>
  );
}
