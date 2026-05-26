import { IconSearch, IconUserPlus, IconX } from "@tabler/icons-react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useMutation } from "@tanstack/react-query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Button } from "@work-holo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@work-holo/ui/components/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import { getInitials } from "@/utils";
import { queryClient, queryUtils } from "@/utils/orpc";

interface AddChannelMemberProps {
  channelId: string;
  currentMemberIds: string[];
}

interface ContentProps {
  channelId: string;
  currentMemberIds: string[];
}

function AddChannelMemberContent({
  channelId,
  currentMemberIds,
}: ContentProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, { wait: 300 });
  const { members } = useListOrgMembers();

  const available = members.filter((m) => !currentMemberIds.includes(m.userId));

  const filtered = debouncedQuery.trim()
    ? available.filter(
        (m) =>
          m.user.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          m.user.email?.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : available;

  const { mutate: addMember, isPending } = useMutation(
    queryUtils.communication.channel.addMembers.mutationOptions({
      onSuccess: () => {
        toast.success("Member added to channel");
        queryClient.invalidateQueries({
          queryKey: queryUtils.communication.channel.listMembers.queryKey({
            input: { channelId },
          }),
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconSearch className="size-3.5" />
        </InputGroupAddon>
        <InputGroupInput
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members…"
          value={query}
        />
        {query && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Clear search"
              onClick={() => setQuery("")}
              size="icon-xs"
            >
              <IconX className="size-3" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      {filtered.length === 0 ? (
        <p className="py-6 text-center text-muted-foreground text-sm">
          {available.length === 0
            ? "All org members are already in this channel."
            : "No members match your search."}
        </p>
      ) : (
        <ItemGroup className="max-h-72 overflow-y-auto">
          {filtered.map((m) => (
            <Item key={m.userId} size="xs">
              <ItemMedia>
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    alt={m.user.name}
                    src={m.user.image ?? undefined}
                  />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(m.user.name)}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{m.user.name}</ItemTitle>
                <ItemDescription>{m.user.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  disabled={isPending}
                  onClick={() =>
                    addMember({ channelId, memberIds: [m.userId] })
                  }
                  size="sm"
                  variant="outline"
                >
                  Add
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      )}
    </div>
  );
}

function AddChannelMemberSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-full rounded-4xl" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
          <Skeleton className="h-11 w-full rounded-2xl" key={i} />
        ))}
      </div>
    </div>
  );
}

export function AddChannelMember({
  channelId,
  currentMemberIds,
}: AddChannelMemberProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button className="w-full gap-1.5" size="lg" variant="secondary">
            <IconUserPlus />
            <span>Add member</span>
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            Add an org member to this channel.
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<AddChannelMemberSkeleton />}>
          <AddChannelMemberContent
            channelId={channelId}
            currentMemberIds={currentMemberIds}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
