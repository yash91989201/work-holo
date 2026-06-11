import { IconCheck, IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
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
import { useMyTeams } from "@/hooks/use-my-teams";
import { useSession } from "@/hooks/use-session";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { queryClient } from "@/utils/orpc";

export function TeamSwitcher() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const session = useSession();

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const teamIdFromSession = session?.session?.activeTeamId;
  const teamId = teamIdFromSession;

  const { teams, isRefetching } = useMyTeams();

  const selectedTeam = teams.find((team) => team.id === teamId);

  const { mutateAsync: switchTeam, isPending } = useMutation({
    mutationFn: async (newTeamId: string) => {
      const { error } = await authClient.organization.setActiveTeam({
        teamId: newTeamId,
      });
      if (error !== null) {
        throw new Error(error.message || "Failed to switch team");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getAuthQueryKey.organization.teams("current"),
      });

      await queryClient.invalidateQueries({
        queryKey: getAuthQueryKey.session.current(),
      });
      navigate({ to: "/org/$slug/workspace", params: { slug } });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to switch team:", error);
    },
  });

  if (teams.length === 0) {
    if (isRefetching) {
      return <TeamSwitcherSkeleton />;
    }
    return (
      <Button
        className="h-8 gap-2 px-2 hover:bg-accent/50"
        disabled
        role="combobox"
        variant="ghost"
      >
        <span className="truncate font-medium text-sm">No teams available</span>
        <IconChevronDown className="size-3.5 shrink-0 opacity-50" />
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
            className={cn(
              "h-8 gap-2 px-2",
              open ? "bg-accent" : "hover:bg-accent/50"
            )}
            disabled={isPending || isRefetching}
            role="combobox"
            variant="ghost"
          >
            <span className="truncate font-medium text-sm">{displayName}</span>
            <IconChevronDown className="size-3.5 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-55 p-0">
        <Command>
          <CommandInput placeholder="Search teams..." />
          <CommandList className="my-1.5 max-h-75 min-h-25">
            {isRefetching ? (
              <div className="space-y-2 p-2">
                <Skeleton className="h-8 w-full rounded-sm" />
                <Skeleton className="h-8 w-full rounded-sm" />
              </div>
            ) : (
              <>
                <CommandEmpty>No team found.</CommandEmpty>
                <CommandGroup heading="Teams">
                  {teams.map((team) => (
                    <CommandItem
                      className="cursor-pointer gap-2"
                      disabled={isPending}
                      key={team.id}
                      onSelect={() => {
                        if (team.id !== teamId && slug) {
                          switchTeam(team.id);
                        }
                      }}
                      value={team.name}
                    >
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <span className="truncate font-medium text-sm">
                          {team.name}
                        </span>
                      </div>
                      <IconCheck
                        className={cn(
                          "ml-auto size-4 shrink-0",
                          teamId === team.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
          <div className="border-t p-1">
            <Button
              className="h-9 w-full justify-start gap-2 px-2 text-muted-foreground hover:text-foreground"
              size="sm"
              variant="ghost"
            >
              <div className="flex size-5 items-center justify-center rounded-sm border bg-background">
                <IconPlus className="size-3" />
              </div>
              New Team
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function TeamSwitcherSkeleton() {
  return (
    <Button className="h-8 gap-2 px-2" disabled role="combobox" variant="ghost">
      <Skeleton className="h-4 w-20" />
      <IconChevronDown className="size-3.5 shrink-0 opacity-50" />
    </Button>
  );
}

TeamSwitcher.Fallback = TeamSwitcherSkeleton;
