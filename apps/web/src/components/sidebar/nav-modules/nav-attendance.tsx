import { IconCalendarEvent } from "@tabler/icons-react";
import { Link, linkOptions, useParams } from "@tanstack/react-router";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavAttendance() {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const attendanceLinks = linkOptions([
    {
      params: { slug },
      to: "/org/$slug/attendance",
      label: "Attendance",
      icon: IconCalendarEvent,
    },
  ]);

  return attendanceLinks.map((link) => (
    <SidebarMenuItem key={link.label}>
      <SidebarMenuButton asChild tooltip={link.label}>
        <Link {...link}>
          {link.icon && <link.icon />}
          <span>{link.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));
}
