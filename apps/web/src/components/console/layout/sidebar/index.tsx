import {
  IconDeviceLaptop,
  IconMailFilled,
  IconPuzzle,
  IconSitemapFilled,
  IconUsers,
} from "@tabler/icons-react";
import { Link, useLocation, useParams } from "@tanstack/react-router";
import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@work-holo/ui/components/sidebar";
import type * as React from "react";
import { Suspense } from "react";
import { OrgSwitcher } from "@/components/org/org-switcher";

export function Sidebar({
  ...props
}: React.ComponentProps<typeof BaseSidebar>) {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });
  const location = useLocation();

  const isConsoleActive = location.pathname === `/org/${slug}/console`;
  const isMembersActive = location.pathname === `/org/${slug}/console/members`;
  const isInvitationsActive =
    location.pathname === `/org/${slug}/console/members/invitations`;
  const isTeamsActive = location.pathname === `/org/${slug}/console/teams`;

  return (
    <BaseSidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Suspense fallback={<OrgSwitcher.Fallback />}>
            <OrgSwitcher />
          </Suspense>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isConsoleActive}
                  render={
                    <Link params={{ slug }} to="/org/$slug/console">
                      <IconDeviceLaptop />
                      <span>Console</span>
                    </Link>
                  }
                  tooltip="Console"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isMembersActive}
                  render={
                    <Link params={{ slug }} to="/org/$slug/console/members">
                      <IconUsers />
                      <span>Members</span>
                    </Link>
                  }
                  tooltip="Members"
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isInvitationsActive}
                  render={
                    <Link
                      params={{ slug }}
                      to="/org/$slug/console/members/invitations"
                    >
                      <IconMailFilled />
                      <span>Invitations</span>
                    </Link>
                  }
                  tooltip="Invitations"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isTeamsActive}
                  render={
                    <Link params={{ slug }} to="/org/$slug/console/teams">
                      <IconSitemapFilled />
                      <span>Teams</span>
                    </Link>
                  }
                  tooltip="Teams"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.startsWith(
                    `/org/${slug}/console/modules/communication`
                  )}
                  render={
                    <Link
                      params={{ slug }}
                      to="/org/$slug/console/modules/communication"
                    >
                      <IconPuzzle />
                      <span>Communication</span>
                    </Link>
                  }
                  tooltip="Communication"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </BaseSidebar>
  );
}
