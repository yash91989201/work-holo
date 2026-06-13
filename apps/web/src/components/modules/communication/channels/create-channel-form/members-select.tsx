import {
  IconChevronDown,
  IconRefresh,
  IconSearch,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import { FieldError, FieldSet } from "@work-holo/ui/components/field";
import { withForm } from "@work-holo/ui/components/form/hooks";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@work-holo/ui/components/popover";
import { useState } from "react";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import { cn } from "@/lib/utils";
import { withFallback } from "@/types/component-fallback";
import { channelFormOpts } from "./form-options";

const MembersSelectBase = withForm({
  ...channelFormOpts,
  render({ form }) {
    // biome-ignore lint/correctness/useHookAtTopLevel: render() inside withForm is a valid React component context
    const { members, refetchTeamMembers, isRefetching } = useListOrgMembers();
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebouncedValue(search, { wait: 300 });
    const [open, setOpen] = useState(false);

    const memberOnlyList = members.filter((m) => m.role === "member");
    const filtered = debouncedSearch.trim()
      ? memberOnlyList.filter(
          (m) =>
            m.user.name
              ?.toLowerCase()
              .includes(debouncedSearch.toLowerCase()) ||
            m.user.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      : memberOnlyList;

    return (
      <form.AppField mode="array" name="memberIds">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          const selectedIds = field.state.value ?? [];

          return (
            <FieldSet className="gap-2" data-invalid={isInvalid}>
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

              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger
                  render={
                    <Button
                      className="h-auto min-h-10 w-full items-center justify-between px-3 py-2"
                      type="button"
                      variant="outline"
                    >
                      {selectedIds.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1">
                          {selectedIds.slice(0, 3).map((id) => {
                            const member = memberOnlyList.find(
                              (m) => m.userId === id
                            );
                            return (
                              <Badge
                                className="gap-1 text-xs"
                                key={id}
                                variant="outline"
                              >
                                <Avatar className="size-4 shrink-0">
                                  <AvatarImage
                                    src={member?.user?.image || ""}
                                  />
                                  <AvatarFallback className="bg-primary/10 text-[8px] text-primary">
                                    {member?.user.name
                                      ?.charAt(0)
                                      ?.toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                {member?.user.name || member?.user.email || id}
                              </Badge>
                            );
                          })}
                          {selectedIds.length > 3 && (
                            <Badge className="text-xs" variant="outline">
                              +{selectedIds.length - 3}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Select channel members
                        </span>
                      )}
                      <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
                    </Button>
                  }
                />

                <PopoverContent
                  align="start"
                  className="w-(--anchor-width) min-w-(--anchor-width) p-3"
                  side="bottom"
                  sideOffset={4}
                >
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <IconSearch className="size-3.5 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search members..."
                      value={search}
                    />
                    {search && (
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={() => setSearch("")}
                          size="icon-xs"
                        >
                          <IconX className="size-3" />
                        </InputGroupButton>
                      </InputGroupAddon>
                    )}
                  </InputGroup>

                  <div className="mt-2 max-h-64 overflow-y-auto">
                    {filtered.length === 0 ? (
                      <p className="py-4 text-center text-muted-foreground text-sm">
                        {memberOnlyList.length === 0
                          ? "No members available"
                          : "No members match your search"}
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {filtered.map((member) => {
                          const isSelected = selectedIds.includes(
                            member.userId
                          );

                          return (
                            <div
                              className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 hover:bg-muted"
                              key={member.userId}
                              onClick={() => {
                                const next = isSelected
                                  ? selectedIds.filter(
                                      (id) => id !== member.userId
                                    )
                                  : [...selectedIds, member.userId];
                                field.handleChange(next);
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <div
                                className={cn(
                                  "flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/30"
                                )}
                              >
                                {isSelected && (
                                  <svg
                                    className="size-3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      d="M5 12l5 5L20 7"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </div>
                              <Avatar className="size-6 shrink-0">
                                <AvatarImage src={member.user?.image || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {member.user.name?.charAt(0)?.toUpperCase() ||
                                    "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex min-w-0 flex-1 items-center gap-2">
                                <span className="truncate font-medium text-sm">
                                  {member.user.name}
                                </span>
                                <span className="truncate text-muted-foreground text-xs">
                                  {member.user.email}
                                </span>
                              </div>
                              <Badge
                                className="shrink-0 text-xs capitalize"
                                variant="outline"
                              >
                                {member.role}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t pt-2">
                    <Button
                      className="h-7 text-xs"
                      onClick={() => setOpen(false)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      Close
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        className="h-7 text-xs"
                        disabled={selectedIds.length === 0}
                        onClick={() => field.handleChange([])}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        Clear
                      </Button>
                      <Button
                        className="h-7 text-xs"
                        disabled={selectedIds.length === memberOnlyList.length}
                        onClick={() =>
                          field.handleChange(
                            memberOnlyList.map((m) => m.userId)
                          )
                        }
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        Select All
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
