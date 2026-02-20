import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Greeting } from "@/components/modules/attendance/greeting";

import { OrgStats, OrgStatsSkeleton } from "@/components/org/home/org-stats";
import {
  PresenceRoster,
  PresenceRosterSkeleton,
} from "@/components/org/home/presence-roster";
import {
  ProductivityChart,
  ProductivityChartSkeleton,
} from "@/components/org/home/productivity-chart";
import { RecentMentions } from "@/components/org/home/recent-mentions";
import { RecentMessages } from "@/components/org/home/recent-messages";

export const Route = createFileRoute("/(authenticated)/org/$slug/workspace/")({
  staticData: { crumb: "Home" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="relative min-h-screen space-y-6 p-6 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.15),transparent_50%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.1),transparent_50%)] before:dark:bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_60%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.15),transparent_60%)]">
      <Greeting />

      <Suspense fallback={<OrgStatsSkeleton />}>
        <OrgStats />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Suspense fallback={<ProductivityChartSkeleton />}>
          <ProductivityChart />
        </Suspense>
        <RecentMessages />
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <RecentMentions />
        <Suspense fallback={<PresenceRosterSkeleton />}>
          <PresenceRoster />
        </Suspense>
      </div>
    </section>
  );
}
