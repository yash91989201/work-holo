import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/our-bpo-services/solution/accounting-and-collections"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/Our-Bpo-Services/Solutions/accounting_and_collections"!</div>
  );
}
