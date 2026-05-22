import { IconPlus } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Button } from "@work-holo/ui/components/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@work-holo/ui/components/command";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Spinner } from "@work-holo/ui/components/spinner";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";

import { useDmConversations } from "@/hooks/communications/dm/use-dm-conversations";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import { getInitials } from "@/utils";
import { orpcClient, queryClient, queryUtils } from "@/utils/orpc";

type DmUserListProps = {
  onPicked: () => void;
};

function DmUserList({ onPicked }: DmUserListProps) {
  const { user } = useAuthedSession();
  const { members } = useListOrgMembers();
  const { conversations } = useDmConversations();

  const { data: allowedData } = useSuspenseQuery(
    queryUtils.org.moduleConfig.listAllowedUsers.queryOptions({
      input: { module: "direct_message" },
    })
  );
  const allowedUserIdsSet =
    allowedData?.userIds === null ? null : new Set(allowedData?.userIds ?? []);

  const { slug } = useParams({ from: "/(authenticated)/org/$slug" });
  const navigate = useNavigate();

  const { mutateAsync: createConversation, isPending } = useMutation({
    mutationFn: (participantId: string) =>
      orpcClient.communication.dm.createOrGetConversation({ participantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryUtils.communication.dm.getConversations.queryKey({
          input: {},
        }),
      });
    },
    onError: (error) => {
      toast.error("Failed to start conversation", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });

  const existingParticipantIds = useMemo(() => {
    const ids = new Set<string>();
    for (const c of conversations) {
      const id = c.otherParticipant?.id;
      if (id) ids.add(id);
    }
    return ids;
  }, [conversations]);

  const availableMembers = useMemo(
    () =>
      members.filter(
        (m) =>
          m.userId !== user.id &&
          !existingParticipantIds.has(m.userId) &&
          (allowedUserIdsSet === null || allowedUserIdsSet.has(m.userId))
      ),
    [members, user.id, existingParticipantIds, allowedUserIdsSet]
  );

  const handleSelectUser = async (participantId: string) => {
    const result = await createConversation(participantId);
    if (result?.id) {
      onPicked();
      navigate({
        to: "/org/$slug/workspace/communication/dm/$conversationId",
        params: { slug, conversationId: result.id },
      });
    }
  };

  return (
    <CommandList>
      <CommandEmpty>No members found.</CommandEmpty>
      <CommandGroup>
        {availableMembers.map((member) => (
          <CommandItem
            disabled={isPending}
            key={member.userId}
            onSelect={() => handleSelectUser(member.userId)}
            value={`${member.user.name} ${member.user.email}`}
          >
            <Avatar className="size-6">
              <AvatarImage src={member.user?.image || undefined} />
              <AvatarFallback className="text-[10px]">
                {getInitials(member.user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-1 flex-col">
              <span className="text-sm">{member.user.name}</span>
              <span className="text-muted-foreground text-xs">
                {member.user.email}
              </span>
            </div>

            {isPending && <Spinner className="size-4" />}
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  );
}

function DmUserListSkeleton() {
  return (
    <CommandList>
      <CommandEmpty>No members found.</CommandEmpty>
      <CommandGroup heading="Members">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          <CommandItem disabled key={i} value={`skeleton-${i}`}>
            <Skeleton className="size-6 rounded-full" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  );
}

DmUserList.Fallback = DmUserListSkeleton;

export function DmUserPicker() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        aria-label="New Direct Message"
        onClick={() => setOpen(true)}
        size="icon-sm"
        variant="link"
      >
        <IconPlus />
      </Button>

      <CommandDialog
        description="Select a member to start a direct message conversation."
        onOpenChange={setOpen}
        open={open}
        title="New Direct Message"
      >
        <CommandInput placeholder="Search members..." />
        <Suspense fallback={<DmUserList.Fallback />}>
          <DmUserList onPicked={() => setOpen(false)} />
        </Suspense>
      </CommandDialog>
    </>
  );
}
