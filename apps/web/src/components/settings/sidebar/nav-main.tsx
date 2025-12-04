import { Link, linkOptions } from "@tanstack/react-router";
import { BellDot, SwatchBook, User, UserLock } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = linkOptions([
  {
    label: "Preferences",
    to: "/settings/account/preferences",
    icon: SwatchBook,
  },
  {
    label: "Profile",
    to: "/settings/account/profile",
    icon: User,
  },
  {
    label: "Notifications",
    to: "/settings/account/notifications",
    icon: BellDot,
  },
  {
    label: "Security & access",
    to: "/settings/account/security",
    icon: UserLock,
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
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                )}
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
