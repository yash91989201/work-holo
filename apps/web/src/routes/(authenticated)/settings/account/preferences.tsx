import { createFileRoute } from "@tanstack/react-router";
import { General, Interface } from "@/components/settings/preferences";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/preferences"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="space-y-6">
        <h2 className="font-semibold text-2xl tracking-tight">Preferences</h2>
        <div className="space-y-6">
          <General />
          <Interface />
        </div>
      </div>
    </div>
  );
}
