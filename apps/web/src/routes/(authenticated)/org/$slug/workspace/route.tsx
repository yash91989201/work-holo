import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  SidebarInset,
  SidebarProvider,
} from "@work-holo/ui/components/sidebar";
import { Suspense } from "react";
import { PresenceHeartbeat } from "@/components/org/presence-heartbeat";
import { Header } from "@/components/workspace/layout/header";
import { Sidebar } from "@/components/workspace/layout/sidebar";

export const Route = createFileRoute("/(authenticated)/org/$slug/workspace")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SidebarProvider
        defaultOpen={false}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
            "--workspace-header-height": "calc(var(--spacing) * 16)",
          } as React.CSSProperties
        }
      >
        <Sidebar variant="sidebar" />
        <SidebarInset>
          <Header />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>

      <Suspense fallback={null}>
        <PresenceHeartbeat />
      </Suspense>
    </>
  );
}
