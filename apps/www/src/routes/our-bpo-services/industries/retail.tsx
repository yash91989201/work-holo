import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/Our-Bpo-Services/Industries/retail")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Industries/retail"!</div>;
}
