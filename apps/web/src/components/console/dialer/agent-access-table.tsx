import {
  IconPhone,
  IconPhoneIncoming,
  IconPhoneOutgoing,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@work-holo/ui/components/table";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { queryUtils } from "@/utils/orpc";
import { AssignDidDialog } from "./assign-did-dialog";

type AgentRow = {
  memberId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null | undefined;
  memberRole: string;
  access: {
    accessId: string;
    canMakeCalls: boolean;
    canReceiveCalls: boolean;
    assignedDidId: string | null;
    assignedDidNumber: string | null;
    isActive: boolean;
  } | null;
};

function AgentAccessTableInner() {
  const [configAgent, setConfigAgent] = useState<AgentRow | null>(null);

  const { data: agents, refetch } = useSuspenseQuery(
    queryUtils.org.dialer.listAgentAccess.queryOptions({})
  );

  const revokeMutation = useMutation(
    queryUtils.org.dialer.revokeAgentAccess.mutationOptions({
      onSuccess: () => {
        toast.success("Access revoked");
        refetch();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  if (agents.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconPhone className="size-6" />
          </EmptyMedia>
          <EmptyTitle>No members</EmptyTitle>
          <EmptyDescription>
            Invite members to the organization first.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>DID</TableHead>
            <TableHead>Outbound</TableHead>
            <TableHead>Inbound</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.userId}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-7">
                    <AvatarImage src={agent.userImage ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {agent.userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{agent.userName}</p>
                    <p className="text-muted-foreground text-xs">
                      {agent.userEmail}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className="text-xs capitalize" variant="outline">
                  {agent.memberRole}
                </Badge>
              </TableCell>
              <TableCell>
                {agent.access?.assignedDidNumber ? (
                  <span className="font-mono text-sm">
                    {agent.access.assignedDidNumber}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell>
                {agent.access?.canMakeCalls ? (
                  <IconPhoneOutgoing className="size-4 text-green-600" />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {agent.access?.canReceiveCalls ? (
                  <IconPhoneIncoming className="size-4 text-blue-600" />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {agent.access ? (
                  agent.access.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )
                ) : (
                  <Badge variant="secondary">No access</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => setConfigAgent(agent)}
                    size="xs"
                    variant="outline"
                  >
                    <IconSettings className="size-3.5" />
                    Configure
                  </Button>
                  {agent.access && (
                    <Button
                      disabled={revokeMutation.isPending}
                      onClick={() =>
                        revokeMutation.mutate({
                          accessId: agent.access!.accessId,
                        })
                      }
                      size="xs"
                      variant="ghost"
                    >
                      <IconX className="size-3.5" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {configAgent && (
        <Suspense fallback={null}>
          <AssignDidDialog
            currentAccess={configAgent.access}
            onOpenChange={(open) => {
              if (!open) setConfigAgent(null);
            }}
            onSuccess={() => {
              setConfigAgent(null);
              refetch();
            }}
            open={true}
            userId={configAgent.userId}
            userName={configAgent.userName}
          />
        </Suspense>
      )}
    </>
  );
}

function AgentAccessTableFallback() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
        <Skeleton className="h-14 w-full" key={i} />
      ))}
    </div>
  );
}

export function AgentAccessTable() {
  return (
    <Suspense fallback={<AgentAccessTableFallback />}>
      <AgentAccessTableInner />
    </Suspense>
  );
}
