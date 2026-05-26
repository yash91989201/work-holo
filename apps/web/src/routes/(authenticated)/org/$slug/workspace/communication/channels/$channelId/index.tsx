import { createFileRoute } from "@tanstack/react-router";
import { MessageComposer } from "@/components/modules/communication/channels/message-composer";
import { MaximizedMessageComposer } from "@/components/modules/communication/channels/message-composer/maximized-message-composer";
import { MessageList } from "@/components/modules/communication/channels/message-list";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/channels/$channelId/"
)({
  beforeLoad: ({ context: { queryClient, queryUtils }, params }) => {
    queryClient.prefetchQuery(
      queryUtils.communication.message.searchUsers.queryOptions({
        input: {
          channelId: params.channelId,
          query: "",
          limit: 10,
        },
      })
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { channelId: id } = Route.useParams();

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background shadow-sm">
      <div className="page-gradient flex min-h-0 min-w-0 flex-1 flex-col">
        <MessageList key={id} />
        <MessageComposer channelId={id} />
      </div>
      <MaximizedMessageComposer />
    </div>
  );
}
