import { IconCheck, IconPlus, IconSelector } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@work-holo/ui/components/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@work-holo/ui/components/sidebar";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Image } from "@/components/shared/image";
import { useActiveOrganization } from "@/hooks/use-active-organization";
import { useOrgSwitcher } from "@/hooks/use-org-switcher";
import { authClient } from "@/lib/auth-client";
import { Can } from "@/lib/permission";

const OrgLogo = ({
  name,
  logo,
  size,
}: {
  logo?: string | null;
  name: string;
  size: "sm" | "md";
}) => {
  const src = logo ?? "/logo.webp";
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

export const OrgSwitcher = () => {
  const activeOrganization = useActiveOrganization();
  const { isSwitching, switchOrganization, createOrganization } =
    useOrgSwitcher();

  const { data: organizations, isPending: isLoadingOrgs } =
    authClient.useListOrganizations();

  if (activeOrganization === null) {
    return null;
  }

  const otherOrganizations =
    organizations?.filter((org) => org.id !== activeOrganization.id) ?? [];

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
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
              <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
                {activeOrganization.name}
              </span>
              <IconSelector className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          }
        />

        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="right"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>

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
          </DropdownMenuGroup>

          <Can permission={(p) => p.org.create}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              disabled={isSwitching}
              onClick={createOrganization}
            >
              <IconPlus className="size-4" />
              New Organization
            </DropdownMenuItem>
          </Can>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

const OrgSwitcherSkeleton = () => (
  <SidebarMenuItem>
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton disabled size="lg">
            <Skeleton className="size-8" />
            <Skeleton className="h-4 w-32 group-data-[collapsible=icon]:hidden" />
            <IconSelector className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        }
      />

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="right"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Organizations
          </DropdownMenuLabel>

          {/* Active org placeholder */}
          <DropdownMenuItem className="gap-2 p-2" disabled>
            <Skeleton className="size-6" />
            <Skeleton className="h-4 flex-1" />
            <IconCheck className="size-4" />
          </DropdownMenuItem>

          {/* Loading skeleton for other orgs */}
          <DropdownMenuItem className="gap-2 p-2" disabled>
            <Skeleton className="size-6" />
            <Skeleton className="h-4 flex-1" />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2" disabled>
          <IconPlus className="size-4" />
          New Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
);

OrgSwitcher.Fallback = OrgSwitcherSkeleton;
