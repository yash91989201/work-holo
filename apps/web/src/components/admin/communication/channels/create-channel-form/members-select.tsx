"use client";

import { ChevronDown, RefreshCw, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import type { CreateChannelFormType } from "@/lib/types";
import { cn } from "@/lib/utils";

export const MembersSelect = ({
  form,
}: {
  form: AppFormApi<CreateChannelFormType>;
}) => {
  const channelType = form.store.useSelector((state) => state.values.type);

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
    <form.AppField name="memberIds">
      {(field) => (
        <div className="space-y-1">
          <label className="flex items-center justify-between gap-2 font-medium text-sm">
            <span className="flex-1">Members</span>
            <Badge className="flex items-center gap-1" variant="secondary">
              {channelType === "direct" ? (
                <>
                  <span>1</span>
                  <User className="size-3" />
                </>
              ) : (
                <>
                  <span>1+</span>
                  <Users className="size-3" />
                </>
              )}
            </Badge>
            <Button
              className="size-6 rounded-sm"
              disabled={isRefetching}
              onClick={refetchTeamMembers}
              size="icon"
              type="button"
              variant="outline"
            >
              <RefreshCw
                className={cn("size-3", isRefetching && "animate-spin")}
              />
            </Button>
          </label>

          <MultiSelect
            className="w-full"
            maxCount={1}
            onValueChange={field.handleChange}
            options={memberOptions}
            placeholder="Select channel members"
            value={field.state.value}
          />

          {field.state.meta.errors?.[0] && (
            <div className="text-red-500 text-sm">
              {field.state.meta.errors[0]}
            </div>
          )}
        </div>
      )}
    </form.AppField>
  );
};

export const MembersSelectSkeleton = ({
  form,
}: {
  form: AppFormApi<CreateChannelFormType>;
}) => {
  const channelType = form.store.useSelector((state) => state.values.type);

  return (
    <div className="animate-pulse space-y-1">
      <label className="flex items-center justify-between gap-2 font-medium text-sm">
        <span className="flex-1">Members</span>
        <Badge className="flex items-center gap-1" variant="secondary">
          {channelType === "direct" ? (
            <>
              <span>1</span>
              <User className="size-3" />
            </>
          ) : (
            <>
              <span>1+</span>
              <Users className="size-3" />
            </>
          )}
        </Badge>
        <Button
          className="size-6 rounded-sm"
          disabled
          size="icon"
          type="button"
          variant="outline"
        >
          <RefreshCw className="size-3" />
        </Button>
      </label>

      <div className="flex h-10 items-center justify-between rounded-md border px-3">
        <p className="text-muted-foreground text-sm">Select channel members</p>
        <ChevronDown className="size-4" />
      </div>
    </div>
  );
};
