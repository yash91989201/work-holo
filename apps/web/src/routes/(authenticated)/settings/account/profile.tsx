import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Profile } from "@/components/settings/profile";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/profile"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="container mx-auto max-w-3xl space-y-6 p-6">
      <h2 className="font-semibold text-2xl tracking-tight">Profile</h2>
      <div className="space-y-12">
        <Suspense fallback={<Profile.Fallback />}>
          <Profile />
        </Suspense>
      </div>
    </section>
  );
}
