import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { CreateTeamForm } from "@/components/console/teams/create-team-form";
import { TeamsTable } from "@/components/console/teams/teams-table";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/teams/"
)({
  staticData: { crumb: "Teams" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">Teams Management</h1>
          <div className="flex items-center gap-2">
            <CreateTeamForm />
          </div>
        </div>
      </div>

      <Suspense fallback={<TeamsTable.Fallback />}>
        <TeamsTable />
      </Suspense>
    </div>
  );
}
