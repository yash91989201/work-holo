import { IconSearch, IconUserPlus } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
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
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
import { Spinner } from "@work-holo/ui/components/spinner";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import { getInitials } from "@/utils";
import { orpcClient, queryUtils } from "@/utils/orpc";

interface AddParticipantDialogProps {
  callId: string;
  /** userIds already in the call — exclude from the invite list */
  existingParticipantIds: string[];
}

function MemberList({
  callId,
  existingParticipantIds,
  query,
  onInvited,
}: {
  callId: string;
  existingParticipantIds: string[];
  query: string;
  onInvited: (userId: string) => void;
}) {
  const { user: me } = useAuthedSession();
  const { members } = useListOrgMembers();
  const [inviting, setInviting] = useState<string | null>(null);

  const { data: allowedData } = useSuspenseQuery(
    queryUtils.org.moduleConfig.listAllowedUsers.queryOptions({
      input: { module: "calling" },
    })
  );
  const allowedSet =
    allowedData?.userIds === null ? null : new Set(allowedData?.userIds ?? []);
  const excludeSet = new Set(existingParticipantIds);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter(
      (m) =>
        m.userId !== me.id &&
        !excludeSet.has(m.userId) &&
        (allowedSet === null || allowedSet.has(m.userId)) &&
        (!q || (m.user.name ?? "").toLowerCase().includes(q))
    );
  }, [members, me.id, excludeSet, allowedSet, query]);

  const handleInvite = async (userId: string, name: string) => {
    setInviting(userId);
    try {
      await orpcClient.communication.call.addParticipant({ callId, userId });
      toast.success(`Invited ${name} to the call`);
      onInvited(userId);
    } catch {
      toast.error("Failed to invite participant");
    } finally {
      setInviting(null);
    }
  };

  if (filtered.length === 0) {
    return (
      <p className="py-4 text-center text-muted-foreground text-sm">
        {query ? "No members found" : "No more members to invite"}
      </p>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto">
      {filtered.map((m) => (
        <div
          className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted/40"
          key={m.userId}
        >
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={m.user.image ?? undefined} />
            <AvatarFallback className="text-[10px]">
              {getInitials(m.user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1 truncate text-sm">
            {m.user.name ?? m.user.email}
          </span>
          <Button
            className="h-7 px-2.5 text-xs"
            disabled={inviting === m.userId}
            onClick={() => handleInvite(m.userId, m.user.name ?? m.user.email)}
            size="sm"
            variant="outline"
          >
            {inviting === m.userId ? <Spinner className="size-3" /> : "Invite"}
          </Button>
        </div>
      ))}
    </div>
  );
}

export function AddParticipantDialog({
  callId,
  existingParticipantIds,
}: AddParticipantDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [invited, setInvited] = useState<string[]>([]);

  const allExcluded = useMemo(
    () => [...existingParticipantIds, ...invited],
    [existingParticipantIds, invited]
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <button
            aria-label="Add participant"
            className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/70"
            title="Add participant"
            type="button"
          >
            <IconUserPlus className="size-5" />
          </button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add participant</DialogTitle>
          <DialogDescription>
            Invite a team member to join this call.
          </DialogDescription>
        </DialogHeader>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <IconSearch className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members…"
            value={query}
          />
        </InputGroup>
        <Suspense
          fallback={
            <div className="flex justify-center py-6">
              <Spinner className="size-5" />
            </div>
          }
        >
          <MemberList
            callId={callId}
            existingParticipantIds={allExcluded}
            onInvited={(id) => setInvited((prev) => [...prev, id])}
            query={query}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
