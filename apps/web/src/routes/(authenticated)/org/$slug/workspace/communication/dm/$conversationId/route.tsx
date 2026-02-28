import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { DmConversationHeader } from "@/components/modules/communication/dm/dm-conversation-header";
import { DmInfoSidebar } from "@/components/modules/communication/dm/info-sidebar";
import { DmPinsSidebar } from "@/components/modules/communication/dm/pins-sidebar";
import { DmThreadSidebar } from "@/components/modules/communication/dm/thread-sidebar";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId"
)({
  beforeLoad: ({ context: { queryClient, queryUtils }, params }) => {
    queryClient.prefetchQuery(
      queryUtils.communication.dm.getConversation.queryOptions({
        input: { conversationId: params.conversationId },
      })
    );
  },
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
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex h-[calc(100dvh-var(--workspace-header-height))] min-h-0 flex-col">
      <DmConversationHeader />
      <div className="flex min-h-0 flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Loading conversation…
              </p>
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
