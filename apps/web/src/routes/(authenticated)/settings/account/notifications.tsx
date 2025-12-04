import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/notifications"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(authenticated)/settings/account/notifications"!</div>;
}
