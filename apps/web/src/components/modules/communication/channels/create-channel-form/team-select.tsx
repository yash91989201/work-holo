import { IconChevronDown, IconRefresh } from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";
import { withForm } from "@work-holo/ui/components/form/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@work-holo/ui/components/select";
import { useListOrgTeams } from "@/hooks/use-list-org-teams";
import { cn } from "@/lib/utils";
import { withFallback } from "@/types/component-fallback";
import { channelFormOpts } from "./form-options";

const TeamSelectBase = withForm({
  ...channelFormOpts,
  render({ form }) {
    // biome-ignore lint/correctness/useHookAtTopLevel: render() inside withForm is a valid React component context
    const { teams, refetchTeams, isRefetching } = useListOrgTeams();

    return (
      <form.AppField name="teamId">
        {(field) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex-1 font-medium text-sm">Teams</span>
              <Button
                className="size-6 rounded-sm"
                disabled={isRefetching}
                onClick={() => refetchTeams()}
                size="icon"
                type="button"
                variant="outline"
              >
                <IconRefresh
                  className={cn("size-3", {
                    "animate-spin": isRefetching,
                  })}
                />
              </Button>
            </div>
            <Select
              items={teams.map((team) => ({
                label: team.name,
                value: team.id,
              }))}
              onValueChange={(value) => {
                if (value === null) return;
                field.handleChange(value);
              }}
              value={field.state.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.length === 0 ? (
                  <SelectItem disabled value="no-teams">
                    No teams available
                  </SelectItem>
                ) : (
                  teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.AppField>
    );
  },
});

export function TeamSelectSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="flex-1 font-medium text-sm">Teams</span>
        <Button
          className="size-6 rounded-sm"
          disabled
          size="icon"
          type="button"
          variant="outline"
        >
          <IconRefresh className="size-3" />
        </Button>
      </div>
      <div className="flex h-10 animate-pulse cursor-progress items-center justify-between rounded-md border px-3">
        <p className="text-muted-foreground text-sm">Select a team</p>
        <IconChevronDown className="size-4" />
      </div>
    </div>
  );
}

export const TeamSelect = withFallback(TeamSelectBase, TeamSelectSkeleton);
