import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type * as React from "react";
import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveMemberRole } from "@/hooks/use-active-member-role";
import { useActiveOrgSlug } from "@/hooks/use-active-org-slug";
import { getOrgRouteByRole } from "@/utils";
import { NavMain } from "./nav-main";

export function SettingsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Suspense fallback={<BackToOrgButton.Fallback />}>
            <BackToOrgButton />
          </Suspense>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function BackToOrgButton() {
  const activeOrg = useActiveOrgSlug();
  const role = useActiveMemberRole();

  if (activeOrg === null || !role) {
    return null;
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link {...getOrgRouteByRole(role, activeOrg)}>
          <IconArrowLeft />
          <span>Back to Org</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function BackToOrgButtonSkeleton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton disabled>
        <IconArrowLeft />
        <Skeleton className="h-4 w-24" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

BackToOrgButton.Fallback = BackToOrgButtonSkeleton;
