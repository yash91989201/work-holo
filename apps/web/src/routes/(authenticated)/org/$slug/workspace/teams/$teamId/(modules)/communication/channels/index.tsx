import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  ChannelsListTable,
  ChannelsListTableSkeleton,
} from "@/components/modules/communication/channels/channels-list-table";
import { CreateChannelForm } from "@/components/modules/communication/channels/create-channel-form";
import {
  ChannelFeatures,
  ChannelTypes,
  GettingStarted,
  RecentChannels,
} from "@/components/modules/communication/channels/overview";
import { ChannelTips } from "@/components/modules/communication/channels/overview/tips";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/teams/$teamId/(modules)/communication/channels/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6 p-6">
      <RecentChannels />

      <CreateChannelForm />

      <Suspense fallback={<ChannelsListTableSkeleton />}>
        <ChannelsListTable />
      </Suspense>
      <GettingStarted />
      <ChannelTypes />
      <ChannelFeatures />
      <ChannelTips />
    </div>
  );
}
