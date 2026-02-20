import {
  IconChevronDown,
  IconRefresh,
  IconUserFilled,
  IconUsers,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { withForm } from "@/components/ui/form/hooks";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import { cn } from "@/lib/utils";
import { channelFormOpts } from "./form-options";

export const MembersSelect = withForm({
  ...channelFormOpts,
  render({ form }) {
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
      <form.Subscribe selector={(state) => state.values.type}>
        {(channelType) => (
          <form.AppField mode="array" name="memberIds">
            {(field) => (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex-1 font-medium text-sm">Members</span>
                  <Badge className="ml-2" variant="secondary">
                    {channelType === "direct" ? (
                      <>
                        <span>1</span>
                        <IconUserFilled />
                      </>
                    ) : (
                      <>
                        <span>1+</span>
                        <IconUsers />
                      </>
                    )}
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
        )}
      </form.Subscribe>
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
