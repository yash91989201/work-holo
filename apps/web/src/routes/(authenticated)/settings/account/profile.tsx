import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Profile, ProfileSkeleton } from "@/components/settings/profile";

export const Route = createFileRoute(
  "/(authenticated)/settings/account/profile"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="space-y-6">
        <h2 className="font-semibold text-2xl tracking-tight">Profile</h2>
        <div className="space-y-6">
          <Suspense fallback={<ProfileSkeleton />}>
            <Profile />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
