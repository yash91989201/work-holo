import type * as React from "react";
import { Suspense } from "react";
import {
  OrgSwitcher,
  OrgSwitcherSkeleton,
} from "@/components/org/org-switcher";
import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavAttendance } from "./nav-modules/nav-attendance";
import { NavChannels } from "./nav-modules/nav-communication";
import { NavOverview } from "./nav-modules/nav-overview";
import { NavQuickActions } from "./nav-quick-actions";

export function Sidebar({
  ...props
}: React.ComponentProps<typeof BaseSidebar>) {
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
        <NavQuickActions />
        <NavOverview />
        <NavAttendance />
        <NavChannels />
      </SidebarContent>
      <SidebarRail />
    </BaseSidebar>
  );
}
