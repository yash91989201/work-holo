
import React from "react";
import { ChevronDown, RefreshCw, User, Users } from "lucide-react";
import { useFormContext } from "./FormContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { MultiSelect, type MultiSelectOption } from "./ui/MultiSelect";
import { useListOrgMembers } from "../hooks/use-list-org-members";
import { cn } from "../lib/utils";

/**
 * Migration Notes:
 * 1. Replaced RHF's useFormContext with a custom TanStack Form Context provider version.
 * 2. Replaced form.watch("type") with form.useStore(state => state.values.type).
 * 3. Replaced <FormField> (RHF component) with <form.Field> (TanStack Form field primitive).
 * 4. Maintained all existing UI and logic functionalities.
 */

export const MembersSelect = () => {
  const form = useFormContext();
  
  // Use TanStack's useStore to watch specific values
  const channelType = form.useStore((state) => state.values.type);

  const { members, refetchTeamMembers, isRefetching } = useListOrgMembers();

  const memberOptions: MultiSelectOption[] = members
    .filter((m) => m.role === "member")
    .map((member) => ({
      label: member.user.email,
      value: member.userId,
      disabled: member.role !== "member",
      icon: () => (
        <Avatar className="h-5 w-5">
          <AvatarImage src={member.user?.image || ""} />
          <AvatarFallback>
            {member.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
    }));

  return (
    <form.Field
      name="memberIds"
      children={(field) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Members
              </span>
              <Badge variant="secondary" className="flex items-center gap-1">
                {channelType === "direct" ? (
                  <>
                    <span>1</span>
                    <User className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    <span>1+</span>
                    <Users className="h-3 w-3" />
                  </>
                )}
              </Badge>
            </div>
            <Button
              className="h-6 w-6 rounded-sm"
              disabled={isRefetching}
              onClick={(e) => {
                e.preventDefault();
                refetchTeamMembers();
              }}
              size="icon"
              type="button"
              variant="outline"
            >
              <RefreshCw
                className={cn("h-3 w-3", isRefetching && "animate-spin")}
              />
            </Button>
          </div>
          
          <MultiSelect
            className="w-full"
            onValueChange={(val) => field.handleChange(val)}
            options={memberOptions}
            placeholder="Select channel members"
            value={field.state.value}
          />

          {field.state.meta.errors.length > 0 && (
            <p className="text-[0.8rem] font-medium text-red-500">
              {field.state.meta.errors.join(", ")}
            </p>
          )}
        </div>
      )}
    />
  );
};

export function MembersSelectSkeleton() {
  const form = useFormContext();
  const channelType = form.useStore((state) => state.values.type);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium leading-none">Members</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {channelType === "direct" ? (
              <>
                <span>1</span>
                <User className="h-3 w-3" />
              </>
            ) : (
              <>
                <span>1+</span>
                <Users className="h-3 w-3" />
              </>
            )}
          </Badge>
        </div>
        <Button
          className="h-6 w-6 rounded-sm"
          disabled
          size="icon"
          type="button"
          variant="outline"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="animate-pulse">
        <div className="flex h-10 cursor-progress items-center justify-between rounded-md border border-slate-200 px-3">
          <p className="text-slate-400 text-sm">
            Select channel members
          </p>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
    </div>
  );
}
