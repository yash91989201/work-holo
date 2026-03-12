import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/home-page")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(public)/home-page"!</div>;
}
