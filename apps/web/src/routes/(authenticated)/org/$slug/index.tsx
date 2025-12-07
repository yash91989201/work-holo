import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Greeting } from "@/components/member/attendance/greeting";
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
      <div className="space-y-6 p-6">
        <Greeting />
        <RecentChannels />
        <Suspense fallback={<PresenceRosterSkeleton />}>
          <PresenceRoster />
        </Suspense>
      </div>
    </>
  );
}
