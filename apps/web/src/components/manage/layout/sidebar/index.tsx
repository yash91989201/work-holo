import { IconBuildingCommunity } from "@tabler/icons-react";
import { Link, useLocation, useParams } from "@tanstack/react-router";
import type * as React from "react";
import { Suspense } from "react";
import { OrgSwitcher } from "@/components/org/org-switcher";
import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function Sidebar({
  ...props
}: React.ComponentProps<typeof BaseSidebar>) {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });
  const location = useLocation();

  const isActive = location.pathname === `/org/${slug}/workspace`;

  return (
    <BaseSidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Suspense fallback={<OrgSwitcher.Fallback />}>
            <OrgSwitcher />
          </Suspense>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel>Manage organization</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip="Organization Overview"
                >
                  <Link params={{ slug }} to="/org/$slug/workspace">
                    <IconBuildingCommunity />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </BaseSidebar>
  );
}
