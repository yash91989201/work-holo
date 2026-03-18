import { createFileRoute } from "@tanstack/react-router";
import { General, Interface } from "@/components/settings/preferences";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/preferences"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="container mx-auto max-w-3xl space-y-6 p-6">
      <h2 className="font-semibold text-2xl tracking-tight">Preferences</h2>
      <div className="space-y-12">
        <General />
        <Interface />
      </div>
    </section>
  );
}
