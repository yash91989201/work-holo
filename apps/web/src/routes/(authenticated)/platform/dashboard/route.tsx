import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  SidebarInset,
  SidebarProvider,
} from "@work-holo/ui/components/sidebar";
import { PlatformHeader } from "@/components/platform/header";
import { PlatformSidebar } from "@/components/platform/sidebar";

export const Route = createFileRoute("/(authenticated)/platform/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { adminRole } = Route.useRouteContext();

  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          "--platform-header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <PlatformSidebar adminRole={adminRole} />
      <SidebarInset>
        <PlatformHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
