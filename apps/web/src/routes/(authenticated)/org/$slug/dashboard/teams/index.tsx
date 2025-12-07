import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { CreateTeamForm } from "@/components/admin/team/create-team-form";
import { TeamList } from "@/components/owner";
import { TeamListSkeleton } from "@/components/owner/team-list";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/dashboard/teams/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* Header */}
      <div className="border-b py-4">
        <div className="flex items-center justify-between">
          <h1 className="mt-2 font-bold text-2xl">Teams Management</h1>
          <div className="flex items-center gap-2">
            <CreateTeamForm />
          </div>
        </div>
      </div>

      <Suspense fallback={<TeamListSkeleton />}>
        <TeamList />
      </Suspense>
    </div>
  );
}
