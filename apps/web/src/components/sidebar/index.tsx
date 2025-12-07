import type * as React from "react";
import { Suspense } from "react";
import {
  OrgMenuButton,
  OrgMenuButtonSkeleton,
} from "@/components/shared/org-menu-button";
import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavModules } from "./nav-modules";
import { NavOrg } from "./nav-org";
import { NavQuickActions } from "./nav-quick-actions";
import { NavUser } from "./nav-user";

export function Sidebar({
  ...props
}: React.ComponentProps<typeof BaseSidebar>) {
  return (
    <BaseSidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Suspense fallback={<OrgMenuButtonSkeleton />}>
            <OrgMenuButton />
          </Suspense>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavQuickActions />
        <NavModules />
        <NavOrg />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </BaseSidebar>
  );
}
