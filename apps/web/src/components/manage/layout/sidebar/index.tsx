import { IconBuildingCommunity } from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import type * as React from "react";
import { Suspense } from "react";
import {
  OrgSwitcher,
  OrgSwitcherSkeleton,
} from "@/components/org/org-switcher";
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

  return (
    <BaseSidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Suspense fallback={<OrgSwitcherSkeleton />}>
            <OrgSwitcher />
          </Suspense>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Organization Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Organization Overview">
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
