import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/our-bpo-services/industries/technology")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Industries/technology"!</div>;
}
