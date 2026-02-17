import {
  IconCheck,
  IconInnerShadowTop,
  IconPlus,
  IconSelector,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Image } from "@/components/shared/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveMemberRole } from "@/hooks/use-active-member-role";
import { useActiveOrganization } from "@/hooks/use-active-organization";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/orpc";

export const OrgSwitcher = () => {
  const role = useActiveMemberRole();
  const activeOrganization = useActiveOrganization();
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState(false);

  const { data: organizations, isPending: isLoadingOrgs } =
    authClient.useListOrganizations();

  if (activeOrganization === null || role === undefined) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton disabled>
          <IconInnerShadowTop className="size-5!" />
          <span className="font-semibold text-base">Loading...</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  const logo = activeOrganization.logo ?? "/logo.webp";

  const handleSwitchOrganization = async (
    organizationId: string,
    organizationSlug: string
  ) => {
    if (isSwitching || organizationId === activeOrganization.id) {
      return;
    }

    try {
      setIsSwitching(true);

      const { error } = await authClient.organization.setActive({
        organizationId,
        organizationSlug,
      });

      if (error !== null) {
        console.error("Failed to switch organization:", error);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: getAuthQueryKey.invalidation.allOrganizations(),
      });

      await queryClient.invalidateQueries({
        queryKey: getAuthQueryKey.user.activeMemberRole(),
      });

      await queryClient.invalidateQueries({
        queryKey: ["active-organization"],
      });

      navigate({
        to: "/org/$slug",
        params: { slug: organizationSlug },
      });
    } catch (error) {
      console.error("Error switching organization:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleCreateOrganization = () => {
    navigate({ to: "/org/new" });
  };

  const otherOrganizations =
    organizations?.filter((org) => org.id !== activeOrganization.id) ?? [];

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            disabled={isSwitching}
            size="lg"
            tooltip={activeOrganization.name}
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <Image
                alt={activeOrganization.name}
                className="size-6 rounded-sm"
                height={24}
                src={logo}
                width={24}
              />
            </div>
            <span className="truncate font-semibold">
              {activeOrganization.name}
            </span>
            <IconSelector className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="right"
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Organizations
          </DropdownMenuLabel>
          <DropdownMenuItem className="gap-2 p-2">
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <Image
                alt={activeOrganization.name}
                className="size-4 shrink-0 rounded-sm"
                height={16}
                src={logo}
                width={16}
              />
            </div>
            <span className="flex-1 font-medium">
              {activeOrganization.name}
            </span>
            <IconCheck className="size-4" />
          </DropdownMenuItem>

          {isLoadingOrgs ? (
            <DropdownMenuItem className="gap-2 p-2" disabled>
              <Skeleton className="size-6" />
              <Skeleton className="h-4 flex-1" />
            </DropdownMenuItem>
          ) : (
            otherOrganizations.map((org) => (
              <DropdownMenuItem
                className="gap-2 p-2"
                disabled={isSwitching}
                key={org.id}
                onClick={() => handleSwitchOrganization(org.id, org.slug)}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Image
                    alt={org.name}
                    className="size-4 shrink-0 rounded-sm"
                    height={16}
                    src={org.logo ?? "/logo.webp"}
                    width={16}
                  />
                </div>
                <span className="flex-1">{org.name}</span>
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 p-2"
            disabled={isSwitching}
            onClick={handleCreateOrganization}
          >
            <IconPlus className="size-4" />
            New Organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export const OrgSwitcherSkeleton = () => (
  <SidebarMenuItem>
    <SidebarMenuButton disabled size="lg">
      <Skeleton className="size-8" />
      <div className="grid flex-1 gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </SidebarMenuButton>
  </SidebarMenuItem>
);
