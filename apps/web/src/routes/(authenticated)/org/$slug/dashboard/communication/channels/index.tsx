import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  ChannelsListTable,
  ChannelsListTableSkeleton,
} from "@/components/admin/communication/channels/channels-list-table";
import { CreateChannelForm } from "@/components/admin/communication/channels/create-channel-form";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/dashboard/communication/channels/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h1 className="mt-2 font-bold text-2xl">Channels</h1>
        <CreateChannelForm />
      </div>

      <Suspense fallback={<ChannelsListTableSkeleton />}>
        <ChannelsListTable />
      </Suspense>
    </div>
  );
}
