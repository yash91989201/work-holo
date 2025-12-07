import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ChannelHeader } from "@/components/member/communication/channels/channel-header";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/(modules)/communication/channels"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex h-screen min-h-0 flex-col">
      <ChannelHeader />
      <Outlet />
    </section>
  );
}
