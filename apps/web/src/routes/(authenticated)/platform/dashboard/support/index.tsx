import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/support/"
)({
  beforeLoad: ({ context }) => {
    if ((context as Record<string, unknown>).adminRole !== "super_admin") {
      throw redirect({ to: "/platform/dashboard" });
    }
  },
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-semibold text-2xl">Support Agents</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Support agents have read-only access to users and sessions. Promote
          users from the Users page.
        </p>
      </div>
      <Suspense fallback={<SupportTableSkeleton />}>
        <SupportTable />
      </Suspense>
    </div>
  );
}

function SupportTable() {
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
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
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

function SupportTableSkeleton() {
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
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
