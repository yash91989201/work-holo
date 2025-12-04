import { createFileRoute } from "@tanstack/react-router";
import { ChangePasswordForm } from "@/components/settings/security";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/security"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="space-y-6">
        <h2 className="font-semibold text-2xl tracking-tight">
          Scurity & access
        </h2>
        <div className="space-y-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
