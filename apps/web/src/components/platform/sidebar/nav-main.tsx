import {
  IconBuilding,
  IconCrown,
  IconHeadphones,
  IconLayoutDashboard,
  IconPhone,
  IconPhoneCall,
  IconServer,
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

const platformNavItems = [
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

const dialerNavItems = [
  {
    to: "/platform/dashboard/dialer/trunks",
    label: "SIP Trunks",
    icon: IconPhone,
  },
  {
    to: "/platform/dashboard/dialer/dids",
    label: "DID Inventory",
    icon: IconPhoneCall,
  },
  {
    to: "/platform/dashboard/dialer/extensions",
    label: "Agent Extensions",
    icon: IconUsers,
  },
  {
    to: "/platform/dashboard/dialer/status",
    label: "Server Status",
    icon: IconServer,
  },
];

type NavMainProps = {
  adminRole: string;
};

export function NavMain({ adminRole }: NavMainProps) {
  const location = useLocation();

  const visiblePlatformItems = platformNavItems.filter(
    (item) => !item.superAdminOnly || adminRole === "super_admin"
  );

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {visiblePlatformItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Dialer</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {dialerNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <Link to={item.to as string}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
