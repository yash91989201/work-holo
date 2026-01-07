import { IconBrandTeams, IconBroadcast } from "@tabler/icons-react";
import { Link, useLoaderData, useParams } from "@tanstack/react-router";
import { Calendar, Users } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function NavOps() {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const { role } = useLoaderData({
    from: "/(authenticated)/org/$slug",
  });

  if (role === "member") {
    return null;
  }

  return (
    <>
      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>Ops</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <Link
                    params={{ slug }}
                    search={{ page: 1 }}
                    to="/org/$slug/dashboard/attendance"
                  />
                }
                tooltip="View Attendance"
              >
                <Calendar />
                <span>Attendance</span>
              </SidebarMenuButton>
              <SidebarMenuButton
                render={
                  <Link
                    params={{ slug }}
                    to="/org/$slug/dashboard/communication/channels"
                  />
                }
                tooltip="Manage Communication Channels"
              >
                <IconBroadcast />
                <span>Channels</span>
              </SidebarMenuButton>
              <SidebarMenuButton
                render={
                  <Link params={{ slug }} to="/org/$slug/dashboard/teams" />
                }
                tooltip="Teams Management"
              >
                <IconBrandTeams />
                <span>Teams</span>
              </SidebarMenuButton>
              <SidebarMenuButton
                render={
                  <Link params={{ slug }} to="/org/$slug/dashboard/members" />
                }
                tooltip="Members Management"
              >
                <Users />
                <span>Members</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
