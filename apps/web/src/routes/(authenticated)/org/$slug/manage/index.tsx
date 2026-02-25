import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/org/$slug/manage/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto py-6">
      Org owner controls are being added.
    </div>
  );
}
