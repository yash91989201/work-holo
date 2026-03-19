import { IconPaperclip } from "@tabler/icons-react";
import { Link, useLocation, useParams } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function FilesGroup() {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });
  const location = useLocation();

  const isActive = location.pathname.includes("/communication/channels/files");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Files</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive} tooltip="Files">
              <Link
                params={{ slug }}
                search={{
                  page: 1,
                  perPage: 20,
                  onlyMine: false,
                  type: "all",
                  sortBy: "createdAt",
                  sortOrder: "desc",
                  view: "table",
                }}
                to="/org/$slug/workspace/communication/channels/files"
              >
                <IconPaperclip />
                <span>Files</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
