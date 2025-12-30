import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import type { InvitationSelectSchema } from "@work-holo/api/lib/schemas/admin-invitation";
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Copy,
  Crown,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { env } from "@/env";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { authClient } from "@/lib/auth-client";
import { getRoleBadgeVariant, getStatusBadgeVariant } from "@/lib/org";
import { queryClient, queryUtils } from "@/utils/orpc";

// Helper for type safety
type InvitationRecord = z.infer<typeof InvitationSelectSchema>;

interface TableMeta {
  onCopy: (invitation: InvitationRecord) => void;
  onResend: (invitation: InvitationRecord) => void;
  onCancel: (invitationId: string) => void;
  resendPending: boolean;
  cancelPending: boolean;
}

// Helper Functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-3 w-3 text-yellow-600" />;
    case "accepted":
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    case "rejected":
      return <XCircle className="h-3 w-3 text-red-600" />;
    case "expired":
      return <AlertCircle className="h-3 w-3 text-gray-600" />;
    default:
      return <Clock className="h-3 w-3 text-gray-600" />;
  }
};

const getRoleIcon = (role: string | null) => {
  switch (role) {
    case "admin":
      return <Crown className="h-3 w-3 text-red-600" />;
    case "manager":
      return <Shield className="h-3 w-3 text-blue-600" />;
    case "team-lead":
      return <UserPlus className="h-3 w-3 text-green-600" />;
    default:
      return <UserPlus className="h-3 w-3 text-gray-600" />;
  }
};

const columns: ColumnDef<InvitationRecord>[] = [
  {
    accessorKey: "email",
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
      const invitation = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>
              {invitation.email.split("@")[0].charAt(0).toUpperCase()}
              {invitation.email
                .split("@")[0]
                .split(".")
                .pop()
                ?.charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">
              {invitation.email.split("@")[0].charAt(0).toUpperCase() +
                invitation.email.split("@")[0].slice(1).replace(".", " ")}
            </p>
            <p className="text-muted-foreground text-xs">{invitation.email}</p>
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
      const invitation = row.original;
      return (
        <div className="flex items-center gap-2">
          {getRoleIcon(invitation.role)}
          <Badge
            className="capitalize"
            variant={getRoleBadgeVariant(invitation.role || "member")}
          >
            {invitation.role || "member"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        className="-ml-4 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const invitation = row.original;
      return (
        <div className="flex items-center gap-2">
          {getStatusIcon(invitation.status)}
          <Badge
            className="capitalize"
            variant={getStatusBadgeVariant(invitation.status)}
          >
            {invitation.status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <Button
        className="-ml-4 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        Expires
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const invitation = row.original;
      if (invitation.status === "accepted")
        return <div className="text-muted-foreground text-sm">N/A</div>;

      const isExpired = new Date(invitation.expiresAt) < new Date();
      return (
        <div className="text-sm">
          <p className={isExpired ? "text-red-600" : ""}>
            {new Date(invitation.expiresAt).toLocaleDateString()}
          </p>
          <p
            className={`text-xs ${isExpired ? "text-red-600" : "text-muted-foreground"}`}
          >
            {isExpired
              ? "Expired"
              : `${Math.ceil((new Date(invitation.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left`}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const invitation = row.original;

      // Access meta handlers
      const { onCopy, onResend, onCancel, resendPending, cancelPending } = table
        .options.meta as unknown as TableMeta;

      if (invitation.status === "accepted")
        return <div className="text-muted-foreground text-sm">N/A</div>;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onCopy(invitation)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={resendPending}
              onClick={() => onResend(invitation)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Resend email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              disabled={cancelPending}
              onClick={() => onCancel(invitation.id)}
            >
              Cancel invitation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const InvitationListTable = () => {
  const { session } = useAuthedSession();
  const orgId = session.activeOrganizationId ?? "";

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
    data: { invitations, total, pageCount },
  } = useSuspenseQuery(
    queryUtils.admin.invitation.listInvitations.queryOptions({
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

  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data, error } = await authClient.organization.cancelInvitation({
        invitationId,
      });

      if (error !== null) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Invitation cancelled successfully");
      queryClient.invalidateQueries({
        queryKey: queryUtils.admin.invitation.listInvitations.queryKey({
          input: {},
        }),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resendInvitationMutation = useMutation({
    mutationFn: async (invitation: InvitationRecord) => {
      const { data, error } = await authClient.organization.inviteMember({
        email: invitation.email,
        role: invitation.role,
        organizationId: orgId,
        resend: true,
      });

      if (error !== null) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Invitation resent successfully");
      queryClient.invalidateQueries({
        queryKey: queryUtils.admin.invitation.listInvitations.queryKey({
          input: {},
        }),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCancelInvitation = (invitationId: string) => {
    cancelInvitationMutation.mutate(invitationId);
  };

  const handleResendInvitation = (invitation: InvitationRecord) => {
    resendInvitationMutation.mutate(invitation);
  };

  const handleCopyInvitationLink = (invitation: InvitationRecord) => {
    const invitationLink = `${env.VITE_WEB_URL}/accept-invitation/${invitation.id}?email=${invitation.email}`;
    navigator.clipboard.writeText(invitationLink);
    toast.success("Invitation link copied to clipboard");
  };

  const table = useReactTable({
    data: invitations,
    columns, // Use the static columns
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
    meta: {
      onCopy: handleCopyInvitationLink,
      onResend: handleResendInvitation,
      onCancel: handleCancelInvitation,
      resendPending: resendInvitationMutation.isPending,
      cancelPending: cancelInvitationMutation.isPending,
    },
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
              placeholder="Search invitations..."
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
                    <Mail className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                      No invitations found
                    </p>
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
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
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
            {table.getState().pagination.pageIndex + 1} /{" "}
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

export const InvitationListTableSkeleton = () => (
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
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index.toString()}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);
