import { useSuspenseQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import type { MemberWithUser } from "@work-holo/api/lib/schemas/admin-member";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Crown,
  LayoutList,
  Search,
  Shield,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { queryUtils } from "@/utils/orpc";

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "owner":
      return "default";
    case "admin":
      return "secondary";
    case "member":
      return "outline";
    default:
      return "outline";
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case "owner":
      return Crown;
    case "admin":
      return Shield;
    case "member":
      return User;
    default:
      return User;
  }
};

// Helper for type safety
type MemberRecord = z.infer<typeof MemberWithUser>;

export const MemberListTable = () => {
  const { user } = useAuthedSession();

  // State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Data Fetching
  const {
    data: { members, total, pageCount },
  } = useSuspenseQuery(
    queryUtils.admin.member.listMembers.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        search: debouncedSearch || undefined,
        sorting: sorting.map((s) => ({
          id: s.id,
          desc: s.desc,
        })),
      },
    })
  );

  const columns = useMemo<ColumnDef<MemberRecord>[]>(
    () => [
      {
        accessorKey: "user.name",
        id: "user.name",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Member
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const member = row.original;

          return (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.user.image ?? undefined} />
                <AvatarFallback>
                  {member.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {member.user.name ?? "Unknown"}
                </div>
                <div className="text-muted-foreground text-sm">
                  {member.user.email}
                </div>
                {member.userId === user.id && (
                  <Badge className="mt-1 text-xs" variant="outline">
                    You
                  </Badge>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const member = row.original;
          const RoleIcon = getRoleIcon(member.role);
          return (
            <Badge className="gap-1" variant={getRoleBadgeVariant(member.role)}>
              <RoleIcon className="h-3 w-3" />
              {member.role}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Joined
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground">
            {new Date(row.original.user.createdAt).toLocaleDateString()}
          </div>
        ),
      },
    ],
    [user.id]
  );

  const table = useReactTable({
    data: members,
    columns,
    state: {
      sorting,
      pagination,
    },
    pageCount,
    rowCount: total,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <div className="w-full rounded-md border bg-card text-card-foreground shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b p-4">
        <div className="flex flex-1 items-center gap-2">
          <InputGroup className="w-full max-w-sm">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search members..."
              value={searchTerm}
            />
          </InputGroup>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="hover:bg-muted/50"
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  <div className="flex flex-col items-center gap-2">
                    <LayoutList className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No members found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <p className="hidden sm:block">Rows per page</p>
            <Select
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              value={`${table.getState().pagination.pageSize}`}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue>
                  {table.getState().pagination.pageSize}
                </SelectValue>
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>{total} row(s) total</div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Pagination Buttons - reused logic */}
          <Button
            className="h-8 px-2 lg:px-3"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            variant="outline"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            className="h-8 px-2 lg:px-3"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            variant="outline"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <div className="flex items-center justify-center font-medium text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </div>
          <Button
            className="h-8 px-2 lg:px-3"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            variant="outline"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            className="h-8 px-2 lg:px-3"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            variant="outline"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const MemberListTableSkeleton = () => (
  <div className="w-full rounded-md border bg-card text-card-foreground shadow-sm">
    <div className="flex items-center justify-between gap-4 border-b p-4">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
      </div>
    </div>
    <div className="rounded-md border-b">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index.toString()}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);
