import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/our-bpo-services/solution/technical-support"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Solutions/technical_support"!</div>;
}
