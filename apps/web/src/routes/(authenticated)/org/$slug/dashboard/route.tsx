import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/(authenticated)/org/$slug/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <h1 className="font-medium text-base">Admin Dashboard</h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6">
          <Outlet />
        </div>
      </main>
    </>
  );
}
