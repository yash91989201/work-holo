import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@work-holo/ui/components/sidebar";
import { Image } from "@/components/shared/image";
import { NavMain } from "./nav-main";

type PlatformSidebarProps = React.ComponentProps<typeof BaseSidebar> & {
  adminRole: string;
};

export function PlatformSidebar({ adminRole, ...props }: PlatformSidebarProps) {
  return (
    <BaseSidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Work Holo">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image
                  alt="Work Holo"
                  className="size-6 rounded-sm"
                  height={24}
                  src="/logo.webp"
                  width={24}
                />
              </div>
              <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
                Work Holo
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain adminRole={adminRole} />
      </SidebarContent>
      <SidebarRail />
    </BaseSidebar>
  );
}
