import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { MessageListSkeleton } from "@/components/modules/communication/channels/message-list/message-list-skeleton";
import { DmConversationHeader } from "@/components/modules/communication/dm/dm-conversation-header";
import { DmRouteSkeleton } from "@/components/modules/communication/dm/dm-route-skeleton";
import { DmInfoSidebar } from "@/components/modules/communication/dm/info-sidebar";
import { DmPinsSidebar } from "@/components/modules/communication/dm/pins-sidebar";
import { DmThreadSidebar } from "@/components/modules/communication/dm/thread-sidebar";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId"
)({
  loader: async ({ context: { queryClient, queryUtils }, params }) => {
    const conversation = await queryClient.ensureQueryData(
      queryUtils.communication.dm.getConversation.queryOptions({
        input: { conversationId: params.conversationId },
      })
    );

    const otherParticipant =
      conversation.participantOne ?? conversation.participantTwo;
    return { crumb: otherParticipant?.name ?? "Conversation" };
  },
  pendingComponent: DmRouteSkeleton,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex h-[calc(100dvh-var(--workspace-header-height))] min-h-0 flex-col">
      <DmConversationHeader />
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
        <DmThreadSidebar />
        <DmPinsSidebar />
        <DmInfoSidebar />
      </div>
    </section>
  );
}
