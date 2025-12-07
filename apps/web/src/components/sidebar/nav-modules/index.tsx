import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { NavAttendance } from "./nav-attendance";
import { NavChannels } from "./nav-communication";

export function NavModules() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Modules</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <NavAttendance />
          <NavChannels />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
