import { createFileRoute } from "@tanstack/react-router";
import { MaximizedDmMessageComposer } from "@/components/modules/communication/dm/maximized-message-composer";
import { DmMessageComposer } from "@/components/modules/communication/dm/message-composer";
import { DmMessageList } from "@/components/modules/communication/dm/message-list";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { conversationId } = Route.useParams();

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background shadow-sm">
      <div className="page-gradient flex min-h-0 min-w-0 flex-1 flex-col">
        <DmMessageList key={conversationId} />
        <DmMessageComposer conversationId={conversationId} />
      </div>
      <MaximizedDmMessageComposer />
    </div>
  );
}
