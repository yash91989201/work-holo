import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Greeting } from "@/components/modules/attendance/greeting";

import { OrgStats } from "@/components/org/home/org-stats";
import { PresenceRoster } from "@/components/org/home/presence-roster";
import { ProductivityChart } from "@/components/org/home/productivity-chart";
import { RecentMentions } from "@/components/org/home/recent-mentions";
import { RecentMessages } from "@/components/org/home/recent-messages";

export const Route = createFileRoute("/(authenticated)/org/$slug/workspace/")({
  staticData: { crumb: "Home" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="page-gradient relative min-h-screen space-y-6 p-6 *:relative *:z-10">
      <Greeting />

      <Suspense fallback={<OrgStats.Fallback />}>
        <OrgStats />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Suspense fallback={<ProductivityChart.Fallback />}>
          <ProductivityChart />
        </Suspense>
        <RecentMessages />
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <RecentMentions />
        <Suspense fallback={<PresenceRoster.Fallback />}>
          <PresenceRoster />
        </Suspense>
      </div>
    </section>
  );
}
