import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/our-bpo-services/solution/customer-retention"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Solutions/Customer_Retention"!</div>;
}
