import { IconChevronDown, IconPlus, IconUsersGroup } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
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
  CommandSeparator,
} from "@work-holo/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@work-holo/ui/components/popover";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { useState } from "react";
import { CreateTeamForm } from "@/components/console/teams/create-team-form";
import { useMyTeams } from "@/hooks/use-my-teams";
import { useSession } from "@/hooks/use-session";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { Can } from "@/lib/permission";
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
      <Can
        fallback={
          <Button
            className="h-8 gap-2 px-2 hover:bg-accent/50"
            disabled
            role="combobox"
            variant="ghost"
          >
            <span className="truncate font-medium text-sm">
              No teams available
            </span>
            <IconChevronDown className="size-3.5 shrink-0 opacity-50" />
          </Button>
        }
        permission={(p) => p.team.create}
      >
        <CreateTeamForm
          trigger={
            <Button
              className="h-8 gap-2 px-2 hover:bg-accent/50"
              role="combobox"
              variant="ghost"
            >
              <div className="flex size-5 items-center justify-center rounded-md border bg-background">
                <IconPlus className="size-3" />
              </div>
              <span className="truncate font-medium text-sm">Create team</span>
            </Button>
          }
        />
      </Can>
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
              "h-8 max-w-48 gap-2 px-2",
              open ? "bg-accent" : "hover:bg-accent/50"
            )}
            disabled={isPending || isRefetching}
            role="combobox"
            variant="ghost"
          >
            <Avatar size="sm">
              <AvatarFallback>
                {displayName.trim().charAt(0).toUpperCase() || "T"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate font-medium text-sm">{displayName}</span>
            <IconChevronDown
              className={cn(
                "size-3.5 shrink-0 opacity-50 transition-transform",
                open && "rotate-180"
              )}
            />
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="w-72 gap-0 overflow-hidden p-0"
        sideOffset={6}
      >
        <Command className="rounded-[inherit] bg-transparent p-0">
          <div className="flex items-center gap-3 border-border/60 border-b px-4 py-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <IconUsersGroup className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm">Switch team</p>
              <p className="text-muted-foreground text-xs">
                {teams.length} {teams.length === 1 ? "team" : "teams"} in
                workspace
              </p>
            </div>
          </div>

          <div className="px-3 pt-3 pb-2 **:data-[slot=command-input-wrapper]:p-0">
            <CommandInput className="h-10" placeholder="Search teams..." />
          </div>

          <CommandList className="max-h-64 min-h-0 px-2 pb-2">
            {isRefetching ? (
              <div className="space-y-2 p-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl px-3 py-3"
                    //biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                    key={index}
                  >
                    <Skeleton className="size-8 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <CommandEmpty className="py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <IconUsersGroup className="size-8 opacity-40" />
                    <p className="text-sm">No teams match your search</p>
                  </div>
                </CommandEmpty>
                <CommandGroup className="space-y-1 p-1">
                  {teams.map((team) => {
                    const isActive = team.id === teamId;

                    return (
                      <CommandItem
                        className={cn(
                          "gap-3 px-3 py-3",
                          isActive && "bg-accent/60 data-selected:bg-accent/60"
                        )}
                        data-checked={isActive ? true : undefined}
                        disabled={isPending}
                        key={team.id}
                        onSelect={() => {
                          if (team.id !== teamId && slug) {
                            switchTeam(team.id);
                          }
                        }}
                        value={team.name}
                      >
                        <Avatar>
                          <AvatarFallback>
                            {team.name.trim().charAt(0).toUpperCase() || "T"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="truncate font-medium text-sm">
                            {team.name}
                          </span>
                          {isActive ? (
                            <span className="text-muted-foreground text-xs">
                              Current team
                            </span>
                          ) : null}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>

          <Can permission={(p) => p.team.create}>
            <CommandSeparator className="mx-3 my-2" />
            <div className="px-3 pb-3">
              <CreateTeamForm
                onSuccess={() => setOpen(false)}
                trigger={
                  <Button
                    className="h-9 w-full justify-start gap-2.5 rounded-2xl px-3 text-muted-foreground hover:text-foreground"
                    size="sm"
                    variant="ghost"
                  >
                    <div className="flex size-7 items-center justify-center rounded-md border border-dashed bg-background">
                      <IconPlus className="size-3.5" />
                    </div>
                    <span className="font-medium text-sm">Create new team</span>
                  </Button>
                }
              />
            </div>
          </Can>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function TeamSwitcherSkeleton() {
  return (
    <Button className="h-8 gap-2 px-2" disabled role="combobox" variant="ghost">
      <Skeleton className="size-6 rounded-full" />
      <Skeleton className="h-4 w-20" />
      <IconChevronDown className="size-3.5 shrink-0 opacity-50" />
    </Button>
  );
}

TeamSwitcher.Fallback = TeamSwitcherSkeleton;
