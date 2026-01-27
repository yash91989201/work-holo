import { ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withForm } from "@/components/ui/form/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListOrgTeams } from "@/hooks/use-list-org-teams";
import { cn } from "@/lib/utils";
import { channelFormOpts } from "./form-options";

export const TeamSelect = withForm({
  ...channelFormOpts,
  render({ form }) {
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
                <RefreshCw
                  className={cn("size-3", {
                    "animate-spin": isRefetching,
                  })}
                />
              </Button>
            </div>
            <Select
              onValueChange={(value) => field.handleChange(value ?? undefined)}
              value={field.state.value ?? ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select team">
                  {teams.find((t) => t.id === field.state.value)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
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
          <RefreshCw className="size-3" />
        </Button>
      </div>
      <div className="flex h-10 animate-pulse cursor-progress items-center justify-between rounded-md border px-3">
        <p className="text-muted-foreground text-sm">Select a team</p>
        <ChevronDown className="size-4" />
      </div>
    </div>
  );
}
