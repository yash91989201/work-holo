import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { NavAttendance } from "./nav-attendance";
import { NavChannels } from "./nav-communication";

export function NavModules() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <NavAttendance />
          <NavChannels />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
