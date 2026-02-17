import { IconCheck, IconChevronDown, IconUsers } from "@tabler/icons-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveMemberRole } from "@/hooks/use-active-member-role";
import { useListOrgTeams } from "@/hooks/use-list-org-teams";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { queryClient } from "@/utils/orpc";

export function TeamSwitcher() {
  const [open, setOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const navigate = useNavigate();
  const role = useActiveMemberRole();

  const { slug, teamId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/teams/$teamId",
  });

  const { teams, isRefetching } = useListOrgTeams();

  const selectedTeam = teams.find((team) => team.id === teamId);

  if (!role) {
    return <TeamSwitcherSkeleton />;
  }

  if (role === "owner" || role === "admin") {
    return (
      <Button disabled role="combobox" variant="outline">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              <IconUsers className="size-3" />
            </AvatarFallback>
          </Avatar>
          <span className="truncate">Organization-wide</span>
        </div>
        <IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  const handleSwitchTeam = async (newTeamId: string) => {
    if (isSwitching || newTeamId === teamId) {
      return;
    }

    try {
      setIsSwitching(true);

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

      navigate({
        to: "/org/$slug/workspace/teams/$teamId",
        params: { slug, teamId: newTeamId },
      });

      setOpen(false);
    } catch (error) {
      console.error("Error switching team:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  if (teams.length === 0) {
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

  if (!selectedTeam && teams.length > 0) {
    return <TeamSwitcherSkeleton />;
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
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
            <span className="truncate">
              {selectedTeam?.name ?? "Select team"}
            </span>
          </div>
          <IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search teams..." />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              {isRefetching ? (
                <div className="space-y-2 p-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                teams.map((team) => (
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
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
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
