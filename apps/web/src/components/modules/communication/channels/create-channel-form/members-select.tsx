import { IconChevronDown, IconRefresh, IconUsers } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import { withForm } from "@work-holo/ui/components/form/hooks";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@work-holo/ui/components/multi-select";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import { cn } from "@/lib/utils";
import { withFallback } from "@/types/component-fallback";
import { channelFormOpts } from "./form-options";

const MembersSelectBase = withForm({
  ...channelFormOpts,
  render({ form }) {
    // biome-ignore lint/correctness/useHookAtTopLevel: render() inside withForm is a valid React component context
    const { members, refetchTeamMembers, isRefetching } = useListOrgMembers();

    const memberOptions: MultiSelectOption[] = members
      .filter((m) => m.role === "member")
      .map((member) => ({
        label: member.user.email,
        value: member.userId,
        disabled: member.role !== "member",
        icon: () => (
          <Avatar className="size-6">
            <AvatarImage src={member.user?.image || ""} />
            <AvatarFallback>
              {member.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ),
      }));

    return (
      <form.AppField mode="array" name="memberIds">
        {(field) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex-1 font-medium text-sm">Members</span>
              <Badge className="ml-2" variant="secondary">
                <span>1+</span>
                <IconUsers />
              </Badge>
              <Button
                className="size-6 rounded-sm"
                disabled={isRefetching}
                onClick={() => refetchTeamMembers()}
                size="icon"
                type="button"
                variant="outline"
              >
                <IconRefresh
                  className={cn("size-3", isRefetching && "animate-spin")}
                />
              </Button>
            </div>
            <MultiSelect
              className="w-full"
              maxCount={1}
              onValueChange={field.handleChange}
              options={memberOptions}
              placeholder="Select channel members"
              value={field.state.value}
            />
          </div>
        )}
      </form.AppField>
    );
  },
});

export function MembersSelectSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="flex-1 font-medium text-sm">Members</span>
        <Badge className="ml-2" variant="secondary">
          <span>1+</span>
          <IconUsers />
        </Badge>
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
        <p className="text-muted-foreground text-sm">Select channel members</p>
        <IconChevronDown className="size-4" />
      </div>
    </div>
  );
}

export const MembersSelect = withFallback(
  MembersSelectBase,
  MembersSelectSkeleton
);
