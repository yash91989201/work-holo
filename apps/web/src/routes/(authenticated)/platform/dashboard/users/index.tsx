<<<<<<< HEAD
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { UsersTable } from "@/components/platform/users/users-table";

const UsersSearchSchema = z.object({
  search: z.string().optional(),
});
=======
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, MoreHorizontal, Search } from "lucide-react";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { queryUtils } from "@/utils/orpc";
>>>>>>> 9a25431 (fix: add missing newline at end of _journal.json file)

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/users/"
)({
<<<<<<< HEAD
  validateSearch: UsersSearchSchema,
  staticData: { crumb: "Users" },
  component: RouteComponent,
});

function RouteComponent() {
  const { adminRole } = Route.useRouteContext();

  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<UsersTable.Fallback />}>
        <UsersTable adminRole={adminRole} />
      </Suspense>
    </section>
=======
  component: UsersPage,
});

function platformRoleBadgeVariant(role: string | null) {
  if (role === "super_admin") return "destructive" as const;
  if (role === "admin") return "default" as const;
  if (role === "support") return "secondary" as const;
  return "outline" as const;
}

function orgRoleBadgeVariant(role: string) {
  if (role === "owner") return "destructive" as const;
  if (role === "admin") return "default" as const;
  return "secondary" as const;
}

function UsersPage() {
  const [search, setSearch] = useState("");
  const { adminRole } = Route.useRouteContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Users</h1>
        <div className="relative w-64">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            value={search}
          />
        </div>
      </div>
      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersTable adminRole={adminRole} search={search} />
      </Suspense>
    </div>
  );
}

function UsersTable({
  search,
  adminRole,
}: {
  search: string;
  adminRole: string;
}) {
  const { data: users, refetch } = useSuspenseQuery(
    queryUtils.admin.listUsers.queryOptions({
      input: {
        page: 1,
        limit: 50,
        search: search || undefined,
      },
    })
  );

  const banMutation = useMutation(
    queryUtils.admin.banUser.mutationOptions({ onSuccess: () => refetch() })
  );
  const unbanMutation = useMutation(
    queryUtils.admin.unbanUser.mutationOptions({ onSuccess: () => refetch() })
  );
  const setRoleMutation = useMutation(
    queryUtils.admin.setUserRole.mutationOptions({ onSuccess: () => refetch() })
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Platform Role</TableHead>
          <TableHead>Organizations</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell className="font-medium">{u.name}</TableCell>
            <TableCell className="text-muted-foreground">{u.email}</TableCell>
            <TableCell>
              <Badge variant={platformRoleBadgeVariant(u.role)}>
                {u.role ?? "user"}
              </Badge>
            </TableCell>
            <TableCell>
              {u.organizations.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {u.organizations.map((org) => (
                    <Tooltip key={org.orgSlug}>
                      <TooltipTrigger asChild>
                        <Badge
                          className="gap-1"
                          variant={orgRoleBadgeVariant(org.orgRole)}
                        >
                          <Building2 className="size-3" />
                          {org.orgName}
                          <span className="text-[10px] opacity-70">
                            ({org.orgRole})
                          </span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {org.orgRole} in {org.orgName}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">None</span>
              )}
            </TableCell>
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
              {adminRole !== "support" && u.role !== "super_admin" && (
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
                        Unban User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => banMutation.mutate({ userId: u.id })}
                      >
                        Ban User
                      </DropdownMenuItem>
                    )}
                    {adminRole === "super_admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            setRoleMutation.mutate({
                              userId: u.id,
                              role: "admin",
                            })
                          }
                        >
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setRoleMutation.mutate({
                              userId: u.id,
                              role: "support",
                            })
                          }
                        >
                          Make Support Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setRoleMutation.mutate({
                              userId: u.id,
                              role: "user",
                            })
                          }
                        >
                          Remove Role
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function UsersTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Platform Role</TableHead>
          <TableHead>Organizations</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
          <TableRow key={i}>
            {Array.from({ length: 6 }).map((__, j) => (
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
>>>>>>> 9a25431 (fix: add missing newline at end of _journal.json file)
  );
}
