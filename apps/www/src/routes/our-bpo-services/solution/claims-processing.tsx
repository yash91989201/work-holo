import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/our-bpo-services/solution/claims-processing"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Solutions/claims_processing"!</div>;
}
