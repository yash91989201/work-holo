import { IconPaperclip } from "@tabler/icons-react";
import { Link, useLocation, useParams } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@work-holo/ui/components/sidebar";

export const DEFAULT_FILE_SEARCH = {
  page: 1,
  perPage: 20,
  onlyMine: false,
  type: "all" as const,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
  view: "table" as const,
};

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
            <SidebarMenuButton
              isActive={isActive}
              render={
                <Link
                  params={{ slug }}
                  search={DEFAULT_FILE_SEARCH}
                  to="/org/$slug/workspace/communication/channels/files"
                >
                  <IconPaperclip />
                  <span>Files</span>
                </Link>
              }
              tooltip="Files"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
