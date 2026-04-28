import { IconChartDonut, IconLayoutDashboard } from "@tabler/icons-react";
import {
  Link,
  linkOptions,
  useLocation,
  useParams,
} from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@work-holo/ui/components/sidebar";

export function AttendanceGroup() {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });
  const location = useLocation();

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
      icon: IconChartDonut,
    },
  ]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Attendance</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {attendanceLinks.map((link) => {
            const isActive =
              location.pathname === link.to.replace("$slug", slug);
            return (
              <SidebarMenuItem key={link.label}>
                <SidebarMenuButton
                  isActive={isActive}
                  render={
                    <Link {...link}>
                      {link.icon && <link.icon />}
                      <span>{link.label}</span>
                    </Link>
                  }
                  tooltip={link.label}
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
