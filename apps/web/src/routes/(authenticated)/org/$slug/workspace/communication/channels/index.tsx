import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ChannelsListTable } from "@/components/modules/communication/channels/channels-list-table";
import { RecentChannels } from "@/components/modules/communication/channels/overview";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/channels/"
)({
  staticData: { crumb: "Channels" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <RecentChannels />

      <Suspense fallback={<ChannelsListTable.Fallback />}>
        <ChannelsListTable />
      </Suspense>
    </section>
  );
}
