import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Greeting } from "@/components/member/attendance/greeting";
import {
  PresenceRoster,
  PresenceRosterSkeleton,
} from "@/components/org/presence-roster";
import { RecentChannels } from "@/components/org/recent-channels";
import { usePresenceHeartbeat } from "@/hooks/use-presence";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute("/(authenticated)/org/$slug/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Suspense fallback={null}>
        <OrgPresenceHeartbeat />
      </Suspense>
      <Header />
      <section className="space-y-6 p-6">
        <Greeting />
        {/* <OrgStats /> */}
        <div className="flex flex-col gap-3 md:flex-row">
          <RecentChannels />
          <Suspense fallback={<PresenceRosterSkeleton />}>
            <PresenceRoster />
          </Suspense>
        </div>
      </section>
    </>
  );
}

function OrgPresenceHeartbeat() {
  const { data: attendance } = useSuspenseQuery(
    queryUtils.attendance.records.getStatus.queryOptions({})
  );

  const hasCheckedIn = Boolean(attendance?.checkInTime);
  const hasCheckedOut = Boolean(attendance?.checkOutTime);
  const isWorking = hasCheckedIn && !hasCheckedOut;

  usePresenceHeartbeat({
    enabled: isWorking,
    punchedIn: isWorking,
    onBreak: false,
  });

  return null;
}
