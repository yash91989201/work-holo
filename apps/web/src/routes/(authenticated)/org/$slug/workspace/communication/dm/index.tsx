import { IconMessageCircle } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { DmBlocked } from "@/components/modules/communication/dm/dm-blocked";
import { useCheckModuleAccess } from "@/hooks/use-module-access";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/communication/dm/"
)({
  staticData: { crumb: "Direct Messages" },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: accessData } = useCheckModuleAccess("direct_message");

  if (accessData?.allowed === false) {
    return <DmBlocked reason={accessData.reason ?? "org_disabled"} />;
  }

  return (
    <div className="flex h-[calc(100dvh-var(--workspace-header-height))] flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <IconMessageCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h2 className="font-semibold text-lg">Direct Messages</h2>
        <p className="max-w-sm text-muted-foreground text-sm">
          Select a conversation from the sidebar or start a new one to begin
          messaging.
        </p>
      </div>
    </div>
  );
}
