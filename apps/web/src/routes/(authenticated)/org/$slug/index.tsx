import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Greeting } from "@/components/member/attendance/greeting";
import { OrgStats } from "@/components/org/org-stats";
import {
  PresenceRoster,
  PresenceRosterSkeleton,
} from "@/components/org/presence-roster";
import { RecentChannels } from "@/components/org/recent-channels";

export const Route = createFileRoute("/(authenticated)/org/$slug/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <section className="space-y-6 p-6">
        <Greeting />
        <OrgStats />
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
