import {
  IconArrowAutofitHeightFilled,
  IconCalendarEventFilled,
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconDots,
  IconLayoutDashboardFilled,
  IconSearch,
  IconShieldFilled,
  IconUserFilled,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { MemberWithUserType } from "@work-holo/api/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@work-holo/ui/components/alert-dialog";
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
import { Checkbox } from "@work-holo/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@work-holo/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@work-holo/ui/components/dropdown-menu";
import { FieldGroup } from "@work-holo/ui/components/field";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
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
import { Spinner } from "@work-holo/ui/components/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@work-holo/ui/components/table";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { authClient } from "@/lib/auth-client";
import { getRoleBadgeVariant, getRoleIcon } from "@/lib/org";
import { UpdateMemberRoleSchema } from "@/lib/schemas/member";
import type { UpdateMemberRoleType } from "@/lib/types";
import { queryClient, queryUtils } from "@/utils/orpc";

function UpdateMemberRole({
  member,
  open,
  onOpenChange,
}: {
  member: MemberWithUserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useAppForm({
    defaultValues: {
      role: member.role as "admin" | "member",
    } satisfies UpdateMemberRoleType as UpdateMemberRoleType,
    validators: {
      onSubmit: UpdateMemberRoleSchema,
    },
    onSubmit: async ({ value: data }) => {
      try {
        await authClient.organization.updateMemberRole({
          memberId: member.id,
          role: data.role,
        });

        queryClient.invalidateQueries({
          queryKey: queryUtils.org.member.list.queryKey(),
        });

        toast.success(`Member role updated to ${data.role}`);
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to update member role:", error);
        toast.error("Failed to update member role");
      }
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Update member role</DialogTitle>
          <DialogDescription>
            Change the role for {member.user.name}
          </DialogDescription>
        </DialogHeader>

        <form.AppForm>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField name="role">
                {(field) => (
                  <field.Select
                    items={[
                      { value: "admin", label: "Admin" },
                      { value: "member", label: "Member" },
                    ]}
                    label="Role"
                    placeholder="Select a role"
                  >
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <IconShieldFilled className="h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="member">
                      <div className="flex items-center gap-2">
                        <IconUserFilled className="h-4 w-4" />
                        Member
                      </div>
                    </SelectItem>
                  </field.Select>
                )}
              </form.AppField>
            </FieldGroup>

            <DialogFooter>
              <Button
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isValidating,
                  state.isSubmitting,
                ]}
              >
                {([canSubmit, isValidating, isSubmitting]) => (
                  <Button
                    disabled={!canSubmit || isValidating || isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Updating...
                      </>
                    ) : (
                      "Update Role"
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}

function RemoveMember({
  member,
  open,
  onOpenChange,
}: {
  member: MemberWithUserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await authClient.organization.removeMember({
        memberIdOrEmail: member.id,
      });

      queryClient.invalidateQueries({
        queryKey: queryUtils.org.member.list.queryKey(),
      });

      toast.success(
        `${member.user.name} has been removed from the organization`
      );
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {member.user.name} from the
            organization? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isRemoving}
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
          >
            {isRemoving ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const MembersTable = () => {
  const { user } = useAuthedSession();

  const search = useSearch({
    from: "/(authenticated)/org/$slug/console/members/",
  });

  const navigate = useNavigate({
    from: "/org/$slug/console/members/",
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
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
  const dateRange: DateRange | undefined = useMemo(() => {
    if (search.startDate && search.endDate) {
      return {
        from: new Date(search.startDate),
        to: new Date(search.endDate),
      };
    }
    return;
  }, [search.startDate, search.endDate]);

  const [updateRoleMember, setUpdateRoleMember] =
    useState<MemberWithUserType | null>(null);

  const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);

  const [removeMember, setRemoveMember] = useState<MemberWithUserType | null>(
    null
  );

  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);

  const {
    data: { members, total, pageCount },
  } = useSuspenseQuery(
    queryUtils.org.member.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        search: search.search || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        startDate: dateRange?.from,
        endDate: dateRange?.to,
        sorting: sorting.map((s) => ({
          id: s.id,
          desc: s.desc,
        })),
      },
    })
  );

  const columns = useMemo<ColumnDef<MemberWithUserType>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all"
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
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
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
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
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
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
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground">
            {new Date(row.original.user.createdAt).toLocaleDateString()}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const member = row.original;

          if (member.userId === user.id || member.role === "owner") {
            return <div className="text-right text-muted-foreground">-</div>;
          }

          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button className="h-8 w-8 p-0" variant="ghost">
                    <span className="sr-only">Open menu</span>
                    <IconDots className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setUpdateRoleMember(member);
                      setIsUpdateRoleOpen(true);
                    }}
                  >
                    Update role
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      setRemoveMember(member);
                      setIsRemoveMemberOpen(true);
                    }}
                  >
                    Remove member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [user.id]
  );

  const table = useReactTable({
    data: members,
    columns,
    state: {
      rowSelection,
      sorting,
      pagination,
    },
    pageCount,
    rowCount: total,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
  });

  return (
    <>
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
                placeholder="Filter members..."
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
              items={[
                { value: "all", label: "All Roles" },
                { value: "owner", label: "Owner" },
                { value: "admin", label: "Admin" },
                { value: "member", label: "Member" },
              ]}
              onValueChange={(value) => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    role: value as "all" | "owner" | "admin" | "member",
                    page: 1,
                  }),
                });
              }}
              value={roleFilter}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    className={dateRange ? "" : "text-muted-foreground"}
                    variant="outline"
                  >
                    <IconCalendarEventFilled className="mr-2 h-4 w-4" />
                    {!dateRange?.from && <span>Filter by date</span>}
                    {dateRange?.from &&
                      !dateRange.to &&
                      format(dateRange.from, "LLL dd, y")}
                    {dateRange?.from && dateRange.to && (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    )}
                  </Button>
                }
              />
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  defaultMonth={dateRange?.from}
                  mode="range"
                  numberOfMonths={2}
                  onSelect={(range) => {
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        startDate: range?.from?.toISOString(),
                        endDate: range?.to?.toISOString(),
                        page: 1,
                      }),
                    });
                  }}
                  selected={dateRange}
                />
              </PopoverContent>
            </Popover>
            {(dateRange || searchTerm || roleFilter !== "all") && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  navigate({
                    search: {
                      page: 1,
                      perPage: search.perPage ?? 10,
                      role: "all",
                    },
                  });
                }}
                variant="ghost"
              >
                Reset
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="py-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    className="border-border border-b hover:bg-transparent"
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        className="h-12 px-4 text-foreground"
                        key={header.id}
                      >
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
                      className="border-border border-b hover:bg-muted/30"
                      data-state={row.getIsSelected() && "selected"}
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="px-4 py-3" key={cell.id}>
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
                        <IconLayoutDashboardFilled className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No members found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <p className="hidden sm:block">Rows per page</p>
              <Select
                items={[10, 20, 30, 40, 50].map((size) => ({
                  value: `${size}`,
                  label: `${size}`,
                }))}
                onValueChange={(value) => {
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      perPage: Number(value),
                      page: 1,
                    }),
                  });
                }}
                value={`${pagination.pageSize}`}
              >
                <SelectTrigger className="h-8 w-17">
                  <SelectValue placeholder={pagination.pageSize} />
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
            <div>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="h-8 px-3"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="sm"
              variant="outline"
            >
              <IconCircleChevronLeftFilled className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 px-3"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              size="sm"
              variant="outline"
            >
              <IconCircleChevronRightFilled className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {updateRoleMember && (
        <UpdateMemberRole
          member={updateRoleMember}
          onOpenChange={(open) => {
            setIsUpdateRoleOpen(open);
            if (!open) {
              setUpdateRoleMember(null);
            }
          }}
          open={isUpdateRoleOpen}
        />
      )}

      {removeMember && (
        <RemoveMember
          member={removeMember}
          onOpenChange={(open) => {
            setIsRemoveMemberOpen(open);
            if (!open) {
              setRemoveMember(null);
            }
          }}
          open={isRemoveMemberOpen}
        />
      )}
    </>
  );
};

const MembersTableSkeleton = () => (
  <Card variant="neumorphic">
    <CardHeader className="flex flex-row items-start justify-between gap-4 border-b py-4">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
    </CardHeader>
    <CardContent className="py-0">
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border border-b">
              <TableHead className="w-12" />
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow
                className="border-border border-b"
                key={index.toString()}
              >
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
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
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
    <CardFooter className="flex items-center justify-between border-t pt-4">
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </CardFooter>
  </Card>
);

MembersTable.Fallback = MembersTableSkeleton;
