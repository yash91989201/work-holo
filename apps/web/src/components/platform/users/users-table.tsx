import { IconBuilding, IconDots } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
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

function platformRoleBadgeVariant(
  role: string | null | undefined
): "default" | "secondary" | "outline" | "destructive" {
  if (role === "super_admin" || role === "admin") return "default";
  if (role === "support") return "secondary";
  return "outline";
}

function orgRoleBadgeVariant(
  role: string
): "default" | "secondary" | "outline" | "destructive" {
  if (role === "owner") return "default";
  if (role === "admin") return "secondary";
  return "outline";
}

export function UsersTable({
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
                          <IconBuilding className="size-3" />
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
                      <IconDots className="size-4" />
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

export function UsersTableSkeleton() {
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

UsersTable.Fallback = UsersTableSkeleton;
