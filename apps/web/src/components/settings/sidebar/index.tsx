import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import type * as React from "react";
import { Suspense } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
          <Suspense fallback={<BackToOrgDropdown.Fallback />}>
            <BackToOrgDropdown />
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

function BackToOrgDropdown() {
  const activeOrg = useActiveOrgSlug();
  const role = useActiveMemberRole();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  if (activeOrg === null || !role) {
    return null;
  }

  const orgRoute = getOrgRouteByRole(role, activeOrg);

  const handleGoBack = () => {
    router.history.back();
  };

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton>
            <IconArrowLeft />
            <span>Back to Org</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={4}>
          <DropdownMenuItem asChild>
            <Link {...orgRoute}>
              <span>Go to Organization</span>
            </Link>
          </DropdownMenuItem>
          {canGoBack && (
            <DropdownMenuItem onClick={handleGoBack}>
              <span>Go Back</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function BackToOrgDropdownSkeleton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton disabled>
        <IconArrowLeft />
        <Skeleton className="h-4 w-24" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

BackToOrgDropdown.Fallback = BackToOrgDropdownSkeleton;
