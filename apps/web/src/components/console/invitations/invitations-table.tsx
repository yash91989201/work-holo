import {
  IconArrowAutofitHeightFilled,
  IconCalendarEventFilled,
  IconCircleCheckFilled,
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconCircleChevronsLeftFilled,
  IconCircleChevronsRightFilled,
  IconCircleLetterXFilled,
  IconClockHour4Filled,
  IconCopyCheckFilled,
  IconCrownFilled,
  IconDots,
  IconExclamationCircleFilled,
  IconMailFilled,
  IconSearch,
  IconShieldFilled,
  IconUserFilled,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { InvitationSelectSchema } from "@work-holo/api/lib/schemas/admin-invitation";
import { env } from "@work-holo/env/web";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import { Calendar } from "@work-holo/ui/components/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@work-holo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@work-holo/ui/components/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@work-holo/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@work-holo/ui/components/select";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@work-holo/ui/components/table";
import { format } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import type { z } from "zod";
import { InvitationForm } from "@/components/console/invitations/invitation-form";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { authClient } from "@/lib/auth-client";
import { getRoleBadgeVariant, getStatusBadgeVariant } from "@/lib/org";
import { queryClient, queryUtils } from "@/utils/orpc";

type InvitationRecord = z.infer<typeof InvitationSelectSchema>;

interface TableMeta {
  cancelPending: boolean;
  onCancel: (invitationId: string) => void;
  onCopy: (invitation: InvitationRecord) => void;
  onResend: (invitation: InvitationRecord) => void;
  resendPending: boolean;
}

// Helper Functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <IconClockHour4Filled className="h-3 w-3 text-yellow-600" />;
    case "accepted":
      return <IconCircleCheckFilled className="h-3 w-3 text-green-600" />;
    case "rejected":
      return <IconCircleLetterXFilled className="h-3 w-3 text-red-600" />;
    case "expired":
      return <IconExclamationCircleFilled className="h-3 w-3 text-gray-600" />;
    default:
      return <IconClockHour4Filled className="h-3 w-3 text-gray-600" />;
  }
};

const getRoleIcon = (role: string | null) => {
  switch (role) {
    case "admin":
      return <IconCrownFilled className="h-3 w-3 text-red-600" />;
    case "manager":
      return <IconShieldFilled className="h-3 w-3 text-blue-600" />;
    case "team-lead":
      return <IconUserFilled className="h-3 w-3 text-green-600" />;
    default:
      return <IconUserFilled className="h-3 w-3 text-gray-600" />;
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
        <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
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
        <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
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
        <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
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
        <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
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
          <DropdownMenuTrigger
            render={
              <Button className="h-8 w-8 p-0" variant="ghost">
                <IconDots className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onCopy(invitation)}>
              <IconCopyCheckFilled className="mr-2 h-4 w-4" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={resendPending}
              onClick={() => onResend(invitation)}
            >
              <IconMailFilled className="mr-2 h-4 w-4" />
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

export const InvitationsTable = () => {
  const { session } = useAuthedSession();
  const orgId = session.activeOrganizationId ?? "";

  const search = useSearch({
    from: "/(authenticated)/org/$slug/console/members/invitations",
  });
  const navigate = useNavigate({
    from: "/org/$slug/console/members/invitations",
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState(search.search ?? "");

  const debouncedNavigate = useDebouncedCallback(
    (value: string) => {
      navigate({
        search: (prev) => ({
          ...prev,
          search: value || undefined,
          page: 1,
        }),
      });
    },
    { wait: 500 }
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedNavigate(value);
  };

  const pagination: PaginationState = {
    pageIndex: (search.page ?? 1) - 1,
    pageSize: search.perPage ?? 10,
  };

  const roleFilter = search.role ?? "all";
  const statusFilter = search.status ?? "all";

  const roleItems = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "team-lead", label: "Team Lead" },
    { value: "member", label: "Member" },
  ];

  const statusItems = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "expired", label: "Expired" },
  ];

  const pageSizeItems = [10, 20, 30, 40, 50].map((size) => ({
    value: `${size}`,
    label: `${size}`,
  }));

  let expiryDateRange: DateRange | undefined;
  if (search.expiryStartDate && search.expiryEndDate) {
    expiryDateRange = {
      from: new Date(search.expiryStartDate),
      to: new Date(search.expiryEndDate),
    };
  } else if (search.expiryStartDate) {
    expiryDateRange = { from: new Date(search.expiryStartDate), to: undefined };
  }

  // Data Fetching
  const {
    data: { invitations, total, pageCount },
  } = useSuspenseQuery(
    queryUtils.org.invitation.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        search: search.search || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        expiryStartDate: expiryDateRange?.from?.toISOString(),
        expiryEndDate: expiryDateRange?.to?.toISOString(),
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
        queryKey: queryUtils.org.invitation.list.queryKey({
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
        queryKey: queryUtils.org.invitation.list.queryKey({
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
    columns,
    state: {
      sorting,
      pagination,
    },
    pageCount,
    rowCount: total,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      navigate({
        search: (prev) => ({
          ...prev,
          page: newPagination.pageIndex + 1,
          perPage: newPagination.pageSize,
        }),
      });
    },
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
    <Card variant="neumorphic">
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b py-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <InputGroup className="w-full max-w-xs">
            <InputGroupAddon>
              <IconSearch className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              className="bg-background"
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Filter invitations..."
              value={searchTerm}
            />
            {searchTerm && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => setSearchTerm("")}
                  variant="ghost"
                >
                  <IconX className="h-4 w-4" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>

          <Select
            items={roleItems}
            onValueChange={(value) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  role: value as
                    | "all"
                    | "admin"
                    | "manager"
                    | "team-lead"
                    | "member",
                  page: 1,
                }),
              });
            }}
            value={roleFilter}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="team-lead">Team Lead</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>

          <Select
            items={statusItems}
            onValueChange={(value) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  status: value as
                    | "all"
                    | "pending"
                    | "accepted"
                    | "rejected"
                    | "expired",
                  page: 1,
                }),
              });
            }}
            value={statusFilter}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger
              render={
                <Button
                  className={expiryDateRange ? "" : "text-muted-foreground"}
                  variant="outline"
                >
                  <IconCalendarEventFilled className="mr-2 h-4 w-4" />
                  {!expiryDateRange?.from && <span>Expiry date</span>}
                  {expiryDateRange?.from &&
                    !expiryDateRange.to &&
                    format(expiryDateRange.from, "LLL dd, y")}
                  {expiryDateRange?.from && expiryDateRange.to && (
                    <>
                      {format(expiryDateRange.from, "LLL dd, y")} -{" "}
                      {format(expiryDateRange.to, "LLL dd, y")}
                    </>
                  )}
                </Button>
              }
            />
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                defaultMonth={expiryDateRange?.from}
                mode="range"
                numberOfMonths={2}
                onSelect={(range) => {
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      expiryStartDate: range?.from?.toISOString(),
                      expiryEndDate: range?.to?.toISOString(),
                      page: 1,
                    }),
                  });
                }}
                selected={expiryDateRange}
              />
            </PopoverContent>
          </Popover>

          {(expiryDateRange ||
            searchTerm ||
            roleFilter !== "all" ||
            statusFilter !== "all") && (
            <Button
              onClick={() => {
                setSearchTerm("");
                navigate({
                  search: {
                    page: 1,
                    perPage: search.perPage ?? 10,
                    role: "all",
                    status: "all",
                  },
                });
              }}
              variant="ghost"
            >
              Reset
            </Button>
          )}
        </div>

        <div className="shrink-0">
          <InvitationForm />
        </div>
      </CardHeader>

      <CardContent className="py-0">
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
                    <IconMailFilled className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                      No invitations found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <p className="hidden sm:block">Rows per page</p>
            <Select
              items={pageSizeItems}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              value={`${table.getState().pagination.pageSize}`}
            >
              <SelectTrigger className="h-8 w-18">
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
            <IconCircleChevronsLeftFilled />
          </Button>
          <Button
            className="h-8 px-2 lg:px-3"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            variant="outline"
          >
            <span className="sr-only">Go to previous page</span>
            <IconCircleChevronLeftFilled />
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
            <IconCircleChevronRightFilled />
          </Button>
          <Button
            className="h-8 px-2 lg:px-3"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            variant="outline"
          >
            <span className="sr-only">Go to last page</span>
            <IconCircleChevronsRightFilled />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const InvitationsTableSkeleton = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="ml-auto h-10 w-32" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-25">Actions</TableHead>
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
    </CardContent>
  </Card>
);

InvitationsTable.Fallback = InvitationsTableSkeleton;
