import { createFileRoute } from "@tanstack/react-router";
import { DmBlocked } from "@/components/modules/communication/dm/dm-blocked";
import { MaximizedDmMessageComposer } from "@/components/modules/communication/dm/maximized-message-composer";
import { DmMessageComposer } from "@/components/modules/communication/dm/message-composer";
import { DmMessageList } from "@/components/modules/communication/dm/message-list";
import { useCheckModuleAccess } from "@/hooks/use-module-access";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { conversationId } = Route.useParams();

  const { data: accessData } = useCheckModuleAccess("direct_message");

  if (accessData?.allowed === false) {
    return <DmBlocked reason={accessData.reason ?? "org_disabled"} />;
  }

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
