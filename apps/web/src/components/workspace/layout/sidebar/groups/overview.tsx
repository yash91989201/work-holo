import { IconHomeFilled } from "@tabler/icons-react";
import { Link, useLocation, useParams } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@work-holo/ui/components/sidebar";

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
            <SidebarMenuButton
              isActive={isActive}
              render={
                <Link params={{ slug }} to="/org/$slug/workspace">
                  <IconHomeFilled />
                  <span>Workspace</span>
                </Link>
              }
              tooltip="Home"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
