import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  MarkAttendance,
  MarkAttendanceSkeleton,
} from "@/components/member/attendance/mark-attendance";
import {
  WorkBlocksList,
  WorkBlocksListSkeleton,
} from "@/components/member/attendance/work-blocks-list";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/(modules)/attendance/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Suspense fallback={<MarkAttendanceSkeleton />}>
            <MarkAttendance />
          </Suspense>
          <Suspense fallback={<WorkBlocksListSkeleton />}>
            <WorkBlocksList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
