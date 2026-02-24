import {
  IconCheck,
  IconInnerShadowTop,
  IconPlus,
  IconSelector,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
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
import { getOrgRouteByRole } from "@/utils";
import { queryClient } from "@/utils/orpc";

const DEFAULT_LOGO = "/logo.webp";

interface OrgLogoProps {
  logo?: string | null;
  name: string;
  size: "sm" | "md";
}

const OrgLogo = ({ name, logo, size }: OrgLogoProps) => {
  const src = logo ?? DEFAULT_LOGO;

  if (size === "md") {
    return (
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
        <Image
          alt={name}
          className="size-6 rounded-sm"
          height={24}
          src={src}
          width={24}
        />
      </div>
    );
  }

  return (
    <div className="flex size-6 items-center justify-center rounded-sm border">
      <Image
        alt={name}
        className="size-4 shrink-0 rounded-sm"
        height={16}
        src={src}
        width={16}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const useOrgSwitcher = () => {
  const navigate = useNavigate();
  const { mutate: switchOrganization, isPending: isSwitching } = useMutation({
    mutationFn: async ({
      organizationId,
      organizationSlug,
    }: {
      organizationId: string;
      organizationSlug: string;
    }) => {
      const { error } = await authClient.organization.setActive({
        organizationId,
        organizationSlug,
      });
      if (error !== null) {
        throw new Error(`Failed to switch organization: ${error}`);
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

      const newRole = await authClient.organization.getActiveMemberRole();

      return { role: newRole.data?.role ?? "member", organizationSlug };
    },
    onSuccess: ({ role, organizationSlug }) => {
      const route = getOrgRouteByRole(role, organizationSlug);
      navigate(route);
    },
    onError: (err) => {
      console.error("Error switching organization:", err);
    },
  });

  const createOrganization = () => {
    navigate({ to: "/org/new" });
  };
  return { isSwitching, switchOrganization, createOrganization };
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const OrgSwitcher = () => {
  const role = useActiveMemberRole();
  const activeOrganization = useActiveOrganization();
  const { isSwitching, switchOrganization, createOrganization } =
    useOrgSwitcher();

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
            <OrgLogo
              logo={activeOrganization.logo}
              name={activeOrganization.name}
              size="md"
            />
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

          {/* Active org -- always rendered first */}
          <DropdownMenuItem className="gap-2 p-2">
            <OrgLogo
              logo={activeOrganization.logo}
              name={activeOrganization.name}
              size="sm"
            />
            <span className="flex-1 font-medium">
              {activeOrganization.name}
            </span>
            <IconCheck className="size-4" />
          </DropdownMenuItem>

          {/* Other orgs or loading skeleton */}
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
                onClick={() =>
                  switchOrganization({
                    organizationId: org.id,
                    organizationSlug: org.slug,
                  })
                }
              >
                <OrgLogo logo={org.logo} name={org.name} size="sm" />
                <span className="flex-1">{org.name}</span>
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 p-2"
            disabled={isSwitching}
            onClick={createOrganization}
          >
            <IconPlus className="size-4" />
            New Organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

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
