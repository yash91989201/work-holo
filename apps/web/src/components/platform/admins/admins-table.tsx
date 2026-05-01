import { IconDots, IconSearch, IconX } from "@tabler/icons-react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@work-holo/ui/components/table";
import { useState } from "react";
import { queryUtils } from "@/utils/orpc";

export function AdminsTable() {
  const search = useSearch({
    from: "/(authenticated)/platform/dashboard/admins/",
  });

  const navigate = useNavigate({
    from: "/platform/dashboard/admins/",
  });

  const [query, setQuery] = useState(search.search ?? "");

  const debouncedNavigate = useDebouncedCallback(
    (value: string) => {
      navigate({
        search: { search: value || undefined },
        replace: true,
      });
    },
    { wait: 300 }
  );

  const { data: admins, refetch } = useSuspenseQuery(
    queryUtils.admin.listUsers.queryOptions({
      input: {
        page: 1,
        limit: 50,
        role: "admin",
        search: search.search || undefined,
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

  const handleQueryChange = (value: string) => {
    setQuery(value);
    debouncedNavigate(value);
  };

  const handleClear = () => {
    setQuery("");
    debouncedNavigate("");
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full max-w-sm">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <IconSearch className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search admins..."
            value={query}
          />
          {query && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label="Clear search"
                onClick={handleClear}
                size="icon-xs"
              >
                <IconX className="size-3" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      {admins.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconSearch className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No admins found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search terms to find what you're looking for.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
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
            {admins.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {u.email}
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
                          setRoleMutation.mutate({
                            userId: u.id,
                            role: "support",
                          })
                        }
                      >
                        Demote to Support Agent
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setRoleMutation.mutate({
                            userId: u.id,
                            role: "user",
                          })
                        }
                      >
                        Revoke Admin
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export function AdminsTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search input skeleton - static structure */}
      <div className="flex w-full max-w-sm">
        <div className="group/input-group relative flex h-9 w-full min-w-0 items-center rounded-4xl border border-input bg-input/30">
          <div className="order-first flex h-auto cursor-text items-center justify-center gap-2 py-2 pr-3 pl-3 font-medium text-muted-foreground text-sm">
            <IconSearch className="size-4 text-muted-foreground" />
          </div>
          <p className="flex-1 text-muted-foreground text-sm">
            Search admins...
          </p>
        </div>
      </div>

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
    </div>
  );
}

AdminsTable.Fallback = AdminsTableSkeleton;
