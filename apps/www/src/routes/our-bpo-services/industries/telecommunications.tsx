import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/our-bpo-services/industries/telecommunications"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Industries/telecommunications"!</div>;
}
