import { IconBuildingCommunity } from "@tabler/icons-react";
import { Link, useLocation, useParams } from "@tanstack/react-router";
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
} from "@work-holo/ui/components/sidebar";
import type * as React from "react";
import { Suspense } from "react";
import { OrgSwitcher } from "@/components/org/org-switcher";

export function Sidebar({
  ...props
}: React.ComponentProps<typeof BaseSidebar>) {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });
  const location = useLocation();

  const isActive = location.pathname === `/org/${slug}/manage`;

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
                  isActive={isActive}
                  render={
                    <Link params={{ slug }} to="/org/$slug/manage">
                      <IconBuildingCommunity />
                      <span>Overview</span>
                    </Link>
                  }
                  tooltip="Organization Overview"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </BaseSidebar>
  );
}
