import {
  IconBellRinging,
  IconColorSwatch,
  IconKey,
  IconLock,
  IconUserFilled,
} from "@tabler/icons-react";
import { Link, linkOptions } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@work-holo/ui/components/sidebar";

const items = linkOptions([
  {
    label: "Preferences",
    to: "/settings/account/preferences",
    icon: IconColorSwatch,
  },
  {
    label: "Profile",
    to: "/settings/account/profile",
    icon: IconUserFilled,
  },
  {
    label: "Notifications",
    to: "/settings/account/notifications",
    icon: IconBellRinging,
  },
  {
    label: "Security & access",
    to: "/settings/account/security",
    icon: IconLock,
  },
  {
    label: "Sessions",
    to: "/settings/account/sessions",
    icon: IconKey,
  },
]);

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.to}>
              <Link {...item}>
                {({ isActive }) => (
                  <SidebarMenuButton
                    isActive={isActive}
                    render={
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon />}
                        <span>{item.label}</span>
                      </div>
                    }
                    tooltip={item.label}
                  />
                )}
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
