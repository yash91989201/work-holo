import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/(authenticated)/org/$slug")({
  loader: async () => {
    const activeOrganization =
      await authClient.organization.getFullOrganization();

    const { data, error } = await authClient.organization.getActiveMemberRole();

    if (error !== null) {
      throw new Error("Failed to load member role");
    }

    return {
      logoSrc: activeOrganization.data?.logo ?? undefined,
      role: data.role,
    };
  },
  head: ({ loaderData }) => ({
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: loaderData?.logoSrc,
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
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
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
