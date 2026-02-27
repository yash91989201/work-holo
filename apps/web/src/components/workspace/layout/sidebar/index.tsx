import { Suspense } from "react";
import { OrgSwitcher } from "@/components/org/org-switcher";
import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AttendanceGroup } from "./groups/attendance";
import { ChannelGroup } from "./groups/channel";
import { OverviewGroup } from "./groups/overview";
import { QuickActionGroup } from "./groups/quick-action";

export function Sidebar({
  ...props
}: React.ComponentProps<typeof BaseSidebar>) {
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
        <QuickActionGroup />
        <OverviewGroup />
        <AttendanceGroup />
        <Suspense fallback={<ChannelGroup.Fallback />}>
          <ChannelGroup />
        </Suspense>
      </SidebarContent>
      <SidebarRail />
    </BaseSidebar>
  );
}
