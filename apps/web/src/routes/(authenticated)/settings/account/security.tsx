import { createFileRoute } from "@tanstack/react-router";
import { ChangePasswordForm } from "@/components/settings/security";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/security"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="container mx-auto max-w-3xl space-y-6 p-6">
      <h2 className="font-semibold text-2xl tracking-tight">
        Security & access
      </h2>
      <div className="space-y-12">
        <ChangePasswordForm />
      </div>
    </section>
  );
}
