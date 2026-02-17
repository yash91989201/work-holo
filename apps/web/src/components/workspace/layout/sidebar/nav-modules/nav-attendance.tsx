import { IconChartBar, IconLayoutDashboard } from "@tabler/icons-react";
import { Link, linkOptions, useParams } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavAttendance() {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const attendanceLinks = linkOptions([
    {
      params: { slug },
      to: "/org/$slug/workspace/attendance",
      label: "Overview",
      icon: IconLayoutDashboard,
    },
    {
      params: { slug },
      to: "/org/$slug/workspace/attendance/analytics",
      label: "Analytics",
      icon: IconChartBar,
    },
  ]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
        Attendance
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {attendanceLinks.map((link) => (
            <SidebarMenuItem key={link.label}>
              <SidebarMenuButton asChild tooltip={link.label}>
                <Link {...link}>
                  {link.icon && <link.icon />}
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
