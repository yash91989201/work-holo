import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      Home route
    </div>
  );
}
