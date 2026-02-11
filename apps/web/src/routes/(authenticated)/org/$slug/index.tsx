import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Greeting } from "@/components/member/attendance/greeting";

import { OrgStats } from "@/components/org/org-stats";
import {
  PresenceRoster,
  PresenceRosterSkeleton,
} from "@/components/org/presence-roster";
import { ProductivityChart } from "@/components/org/productivity-chart";
import { RecentMentions } from "@/components/org/recent-mentions";
import { RecentMessages } from "@/components/org/recent-messages";
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

      <section className="space-y-6 p-6">
        {/* Greeting */}
        <Greeting />

        {/* Stats */}
        <OrgStats />

        {/* Chart + Messages */}
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <ProductivityChart />
          <RecentMessages />
        </div>

        {/* Mentions + Roster */}
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <RecentMentions />
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
    queryUtils.member.attendance.getStatus.queryOptions({})
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
