import { IconDots, IconUsers } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@work-holo/ui/components/dropdown-menu";
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
import { queryUtils } from "@/utils/orpc";

export function SupportTable() {
  const { data: agents, refetch } = useSuspenseQuery(
    queryUtils.admin.listUsers.queryOptions({
      input: {
        page: 1,
        limit: 50,
        role: "support",
      },
    })
  );

  const setRoleMutation = useMutation(
    queryUtils.admin.setUserRole.mutationOptions({
      onSuccess: () => refetch(),
    })
  );
  const banMutation = useMutation(
    queryUtils.admin.banUser.mutationOptions({ onSuccess: () => refetch() })
  );
  const unbanMutation = useMutation(
    queryUtils.admin.unbanUser.mutationOptions({ onSuccess: () => refetch() })
  );

  if (agents.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconUsers />
          </EmptyMedia>
          <EmptyTitle>No support agents</EmptyTitle>
          <EmptyDescription>
            There are no support agents in the system yet.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((u) => (
          <TableRow key={u.id}>
            <TableCell className="font-medium">{u.name}</TableCell>
            <TableCell className="text-muted-foreground">{u.email}</TableCell>
            <TableCell>
              {u.banned ? (
                <Badge variant="destructive">Banned</Badge>
              ) : (
                <Badge variant="outline">Active</Badge>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(u.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button size="icon" variant="ghost">
                      <IconDots className="size-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  {u.banned ? (
                    <DropdownMenuItem
                      onClick={() => unbanMutation.mutate({ userId: u.id })}
                    >
                      Unban
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => banMutation.mutate({ userId: u.id })}
                    >
                      Ban
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      setRoleMutation.mutate({ userId: u.id, role: "admin" })
                    }
                  >
                    Promote to Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setRoleMutation.mutate({ userId: u.id, role: "user" })
                    }
                  >
                    Revoke Support Role
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function SupportTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
          <TableRow key={i}>
            {Array.from({ length: 4 }).map((__, j) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
              <TableCell key={j}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

SupportTable.Fallback = SupportTableSkeleton;
