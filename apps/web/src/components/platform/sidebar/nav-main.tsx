import {
  IconBuilding,
  IconCrown,
  IconHeadphones,
  IconLayoutDashboard,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@work-holo/ui/components/sidebar";

const navItems = [
  {
    to: "/platform/dashboard",
    label: "Overview",
    icon: IconLayoutDashboard,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/organizations",
    label: "Organizations",
    icon: IconBuilding,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/owners",
    label: "Owners",
    icon: IconCrown,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/users",
    label: "Users",
    icon: IconUsers,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/admins",
    label: "Admins",
    icon: IconShieldCheck,
    superAdminOnly: true,
  },
  {
    to: "/platform/dashboard/support",
    label: "Support Agents",
    icon: IconHeadphones,
    superAdminOnly: true,
  },
] as const;

type NavMainProps = {
  adminRole: string;
};

export function NavMain({ adminRole }: NavMainProps) {
  const location = useLocation();

  const visibleItems = navItems.filter(
    (item) => !item.superAdminOnly || adminRole === "super_admin"
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  isActive={isActive}
                  render={
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  }
                  tooltip={item.label}
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
