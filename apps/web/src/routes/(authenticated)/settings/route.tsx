import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SettingsSidebar } from "@/components/settings/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/(authenticated)/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider defaultOpen={true}>
      <SettingsSidebar variant="sidebar" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
