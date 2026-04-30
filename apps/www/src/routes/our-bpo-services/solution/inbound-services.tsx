import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/Our-Bpo-Services/solution/inbound-services"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Solutions/Inbound_Services"!</div>;
}
