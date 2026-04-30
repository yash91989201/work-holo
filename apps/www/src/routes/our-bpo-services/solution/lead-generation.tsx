import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/Our-Bpo-Services/solution/lead-generation"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Solutions/Lead_Generation"!</div>;
}

