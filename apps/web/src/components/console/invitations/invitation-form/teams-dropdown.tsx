import { IconUsers } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@work-holo/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";
import { withForm } from "@work-holo/ui/components/form/hooks";
import { SelectItem } from "@work-holo/ui/components/select";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { authClient } from "@/lib/auth-client";
import { withFallback } from "@/types/component-fallback";
import { inviteFormOpts } from "./form-options";

const TeamsDropdownBase = withForm({
  ...inviteFormOpts,
  render({ form }) {
    // biome-ignore lint/correctness/useHookAtTopLevel: render() inside withForm is a valid React component context
    const { slug } = useParams({
      from: "/(authenticated)/org/$slug",
    });

    // biome-ignore lint/correctness/useHookAtTopLevel: render() inside withForm is a valid React component context
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
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconUsers />
            </EmptyMedia>
            <EmptyTitle className="text-base">No teams yet</EmptyTitle>
            <EmptyDescription>
              Create your first team to get started
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              className={buttonVariants({
                variant: "secondary",
                className: "w-full",
              })}
              params={{ slug }}
              to="/org/$slug/console/teams"
            >
              Create Team
            </Link>
          </EmptyContent>
        </Empty>
      );
    }

    return (
      <form.AppField name="teamId">
        {(field) => (
          <field.Select
            items={teams.map((team) => ({
              value: team.id,
              label: team.name,
            }))}
            label="Team"
            placeholder="Select a team"
          >
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

function TeamsDropdownSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-10" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export const TeamsDropdown = withFallback(
  TeamsDropdownBase,
  TeamsDropdownSkeleton
);
