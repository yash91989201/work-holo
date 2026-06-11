import { Badge } from "@work-holo/ui/components/badge";
import { Checkbox } from "@work-holo/ui/components/checkbox";
import {
  FieldError,
  FieldLegend,
  FieldSet,
} from "@work-holo/ui/components/field";
import { withForm } from "@work-holo/ui/components/form/hooks";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import { withFallback } from "@/types/component-fallback";
import { createTeamFormOpts } from "./form-options";

const MembersSelectBase = withForm({
  ...createTeamFormOpts,
  render({ form }) {
    // biome-ignore lint/correctness/useHookAtTopLevel: render() inside withForm is a valid React component context
    const { members } = useListOrgMembers();

    return (
      <form.AppField mode="array" name="memberIds">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          const selectedIds = field.state.value ?? [];

          return (
            <FieldSet data-invalid={isInvalid}>
              <FieldLegend variant="label">Members</FieldLegend>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {members.length > 0 ? (
                  members.map((member) => (
                    <div
                      className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted"
                      key={member.userId}
                    >
                      <Checkbox
                        checked={selectedIds.includes(member.userId)}
                        id={`create-team-member-${member.userId}`}
                        onCheckedChange={(checked) => {
                          const next = checked
                            ? [...selectedIds, member.userId]
                            : selectedIds.filter((id) => id !== member.userId);
                          field.handleChange(next);
                        }}
                      />
                      <label
                        className="flex flex-1 cursor-pointer items-center space-x-2"
                        htmlFor={`create-team-member-${member.userId}`}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted font-medium text-xs">
                          {member.user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium text-sm">
                            {member.user.name}
                          </div>
                          <div className="truncate text-muted-foreground text-xs">
                            {member.user.email}
                          </div>
                        </div>
                        <Badge className="text-xs capitalize" variant="outline">
                          {member.role}
                        </Badge>
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No members available
                  </p>
                )}
              </div>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          );
        }}
      </form.AppField>
    );
  },
});

function MembersSelectSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-24 w-full rounded-md" />
    </div>
  );
}

export const MembersSelect = withFallback(
  MembersSelectBase,
  MembersSelectSkeleton
);
