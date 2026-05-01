import {
  IconCheck,
  IconChevronDown,
  IconPlus,
  IconUsers,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@work-holo/ui/components/avatar";
import { Button } from "@work-holo/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@work-holo/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@work-holo/ui/components/popover";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { useState } from "react";
import { useActiveMemberRole } from "@/hooks/use-active-member-role";
import { useMyTeams } from "@/hooks/use-my-teams";
import { useSession } from "@/hooks/use-session";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { queryClient, queryUtils } from "@/utils/orpc";

export function TeamSwitcher() {
  const [open, setOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const navigate = useNavigate();
  const role = useActiveMemberRole();
  const session = useSession();

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const teamIdFromSession = session?.session?.activeTeamId;
  const teamId = teamIdFromSession;

  const { teams, isRefetching } = useMyTeams(role);
  const isOwnerOrAdmin = role === "owner" || role === "admin";

  const selectedTeam = teams.find((team) => team.id === teamId);

  if (!role) {
    return <TeamSwitcherSkeleton />;
  }

  // Only show team switcher for non-owner/admin roles
  // or when a team is selected
  if (isOwnerOrAdmin && !teamId) {
    return null;
  }

  const handleSwitchTeam = async (newTeamId: string) => {
    if (isSwitching || newTeamId === teamId || !slug) {
      return;
    }

    try {
      setIsSwitching(true);

      if (!isOwnerOrAdmin) {
        const { error } = await authClient.organization.setActiveTeam({
          teamId: newTeamId,
        });

        if (error !== null) {
          console.error("Failed to switch team:", error);
          return;
        }

        await queryClient.invalidateQueries({
          queryKey: getAuthQueryKey.organization.teams("current"),
        });

        await queryClient.invalidateQueries({
          queryKey: getAuthQueryKey.session.current(),
        });
      }

      await queryClient.invalidateQueries({
        queryKey: queryUtils.user.permission.key(),
      });

      // Navigate to workspace home after switching team
      navigate({
        to: "/org/$slug/workspace",
        params: { slug },
      });

      setOpen(false);
    } catch (error) {
      console.error("Error switching team:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  if (teams.length === 0) {
    if (isRefetching) {
      return <TeamSwitcherSkeleton />;
    }
    return (
      <Button disabled role="combobox" variant="outline">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              <IconUsers className="size-3" />
            </AvatarFallback>
          </Avatar>
          <span className="truncate">No teams available</span>
        </div>
        <IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  const displayName = selectedTeam?.name ?? "Select team";

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            aria-expanded={open}
            disabled={isSwitching || isRefetching}
            role="combobox"
            variant="outline"
          >
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>
                  <IconUsers className="size-3" />
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{displayName}</span>
            </div>
            <IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search teams..." />
          <CommandList className="my-1.5 min-h-40">
            {isRefetching ? (
              <div className="space-y-1.5 p-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <>
                <CommandEmpty>No team found.</CommandEmpty>
                <CommandGroup>
                  {teams.map((team) => (
                    <CommandItem
                      className="gap-2"
                      disabled={isSwitching}
                      key={team.id}
                      onSelect={() => handleSwitchTeam(team.id)}
                      value={team.name}
                    >
                      <Avatar size="sm">
                        <AvatarFallback>
                          <IconUsers className="size-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium text-sm">{team.name}</span>
                      </div>
                      <IconCheck
                        className={cn(
                          "ml-auto size-4",
                          teamId === team.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
        <div className="border-t p-1.5">
          <Button className="w-full justify-start gap-2" variant="ghost">
            <IconPlus className="size-4" />
            New Team
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TeamSwitcherSkeleton() {
  return (
    <Button disabled role="combobox" variant="outline">
      <div className="flex items-center gap-2">
        <Skeleton className="size-5 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
    </Button>
  );
}
