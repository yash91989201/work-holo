import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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
import { useActiveOrgSlug } from "@/hooks/use-active-org-slug";
import { NavMain } from "./nav-main";

export function SettingsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Suspense fallback={<Skeleton className="h-9 w-full" />}>
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

  if (activeOrg === null) {
    return null;
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link params={{ slug: activeOrg }} to="/org/$slug/attendance">
          <ArrowLeft />
          <span>Back to Org</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
