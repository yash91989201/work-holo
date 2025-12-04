import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/security"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(authenticated)/settings/account/security"!</div>;
}
