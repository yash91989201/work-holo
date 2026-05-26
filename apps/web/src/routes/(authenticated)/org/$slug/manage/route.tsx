import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  SidebarInset,
  SidebarProvider,
} from "@work-holo/ui/components/sidebar";
import { Suspense } from "react";
import { Header } from "@/components/manage/layout/header";
import { Sidebar } from "@/components/manage/layout/sidebar";
import { PresenceHeartbeat } from "@/components/org/presence-heartbeat";

export const Route = createFileRoute("/(authenticated)/org/$slug/manage")({
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
