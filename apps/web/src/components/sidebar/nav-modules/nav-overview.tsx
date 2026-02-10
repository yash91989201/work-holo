import { Link, useParams } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavOverview() {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
        Overview
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-10 rounded-lg bg-violet-600 font-medium text-white hover:bg-violet-700 hover:text-white active:bg-violet-700 active:text-white"
              tooltip="Dashboard"
            >
              <Link params={{ slug }} to="/org/$slug">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
