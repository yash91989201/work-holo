import { IconHomeFilled } from "@tabler/icons-react";
import { Link, useLocation, useParams } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function OverviewGroup() {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });
  const location = useLocation();
  const isActive = location.pathname === `/org/${slug}/workspace`;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive} tooltip="Home">
              <Link params={{ slug }} to="/org/$slug/workspace">
                <IconHomeFilled />
                <span>Workspace</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
