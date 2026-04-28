import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { ChannelHeader } from "@/components/modules/communication/channels/channel-header";
import { ChannelInfoSidebar } from "@/components/modules/communication/channels/channel-info-sidebar";
import { ChannelRouteSkeleton } from "@/components/modules/communication/channels/channel-route-skeleton";
import { MentionsSidebar } from "@/components/modules/communication/channels/mentions-sidebar";
import { MessageListSkeleton } from "@/components/modules/communication/channels/message-list/message-list-skeleton";
import { MessageThreadSidebar } from "@/components/modules/communication/channels/message-thread-sidebar";
import { PinnedMessagesSidebar } from "@/components/modules/communication/channels/pinned-messages-sidebar";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/channels/$channelId"
)({
  beforeLoad: ({ context: { queryClient, queryUtils }, params }) => {
    queryClient.prefetchQuery(
      queryUtils.communication.channel.get.queryOptions({
        input: { channelId: params.channelId },
      })
    );

    queryClient.prefetchQuery(
      queryUtils.communication.channel.listMembers.queryOptions({
        input: {
          channelId: params.channelId,
        },
      })
    );
  },
  loader: async ({ context: { queryClient, queryUtils }, params }) => {
    const channel = await queryClient.ensureQueryData(
      queryUtils.communication.channel.get.queryOptions({
        input: { channelId: params.channelId },
      })
    );
    return { crumb: channel.name };
  },
  pendingComponent: ChannelRouteSkeleton,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex h-[calc(100dvh-var(--workspace-header-height))] min-h-0 flex-col">
      <ChannelHeader />
      <div className="flex min-h-0 flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-0 flex-1 flex-col">
              <MessageListSkeleton />
              <div className="border-t bg-background px-4 py-6 text-center text-muted-foreground text-sm">
                Preparing message composer.
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
        <MessageThreadSidebar />
        <MentionsSidebar />
        <PinnedMessagesSidebar />
        <ChannelInfoSidebar />
      </div>
    </section>
  );
}
