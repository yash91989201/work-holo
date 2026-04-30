import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/Our-Bpo-Services/Industries/logistics-supply-chain"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/Our-Bpo-Services/Industries/logistics_supply_chain"!</div>
  );
}
