import { IconBrandTeams } from "@tabler/icons-react";
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
              <SidebarMenuButton asChild tooltip="Teams Management">
                <Link params={{ slug }} to="/org/$slug/dashboard/teams">
                  <IconBrandTeams />
                  <span>Teams</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild tooltip="Members Management">
                <Link params={{ slug }} to="/org/$slug/dashboard/members">
                  <Users />
                  <span>Members</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild tooltip="View Attendance">
                <Link
                  params={{ slug }}
                  search={{ page: 1 }}
                  to="/org/$slug/dashboard/attendance"
                >
                  <Calendar />
                  <span>Attendance</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton
                asChild
                tooltip="Manage Communication Channels"
              >
                <Link
                  params={{ slug }}
                  to="/org/$slug/dashboard/communication/channels"
                >
                  <Users />
                  <span>Channels</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
