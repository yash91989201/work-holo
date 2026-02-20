import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { withForm } from "@/components/ui/form/hooks";
import { SelectItem } from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { inviteFormOpts } from "./form-options";

export const TeamsDropdown = withForm({
  ...inviteFormOpts,
  render({ form }) {
    const { slug } = useParams({
      from: "/(authenticated)/org/$slug",
    });

    const { data: teams } = useSuspenseQuery({
      queryKey: ["teams"],
      queryFn: async () => {
        const { data, error } = await authClient.organization.listTeams();

        if (error !== null) {
          return [];
        }

        return data;
      },
    });

    if (teams.length === 0) {
      return (
        <div className="space-y-3">
          <span className="font-medium text-sm">Team</span>
          <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed p-4 text-muted-foreground text-sm">
            <span>No teams yet</span>
            <span className="text-xs">
              Create your first team to get started
            </span>
          </div>

          <Button asChild className="h-11 w-full" variant="outline">
            <Link params={{ slug }} to="/org/$slug/workspace/teams">
              Create Team
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <form.AppField name="teamId">
        {(field) => (
          <field.Select label="Team" placeholder="Select a team">
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </field.Select>
        )}
      </form.AppField>
    );
  },
});
