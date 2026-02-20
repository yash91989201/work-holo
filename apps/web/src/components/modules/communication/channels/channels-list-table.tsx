import {
  IconArrowAutofitHeightFilled,
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconCircleChevronsLeftFilled,
  IconCircleChevronsRightFilled,
  IconDots,
  IconEdit,
  IconHash,
  IconLayoutDashboardFilled,
  IconLockFilled,
  IconSearch,
  IconUserMinus,
  IconUserPlus,
  IconX,
} from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import type { ListChannelsOutputType } from "@work-holo/api/lib/types";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
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
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import { queryClient, queryUtils } from "@/utils/orpc";
import { ChannelMembersPopover } from "./channel-members-popover";

export const ChannelsListTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    data: { channels, total, pageCount },
  } = useSuspenseQuery(
    queryUtils.communication.channel.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch || undefined,
        sorting: sorting.map((s) => ({
          id: s.id,
          desc: s.desc,
        })),
      },
    })
  );

  const columns = useMemo<ColumnDef<ListChannelsOutputType["channels"][0]>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            className="-ml-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Channel
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const channel = row.original;
          const isPrivate = channel.isPrivate;
          const TypeIcon = isPrivate ? IconLockFilled : IconHash;

          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <TypeIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">{channel.name}</div>

                {channel.description && (
                  <div className="text-muted-foreground text-sm">
                    {channel.description}
                  </div>
                )}

                {channel.isPrivate && (
                  <Badge className="mt-1 text-xs" variant="outline">
                    Private
                  </Badge>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Type
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <Badge>{row.original.type}</Badge>,
      },
      {
        accessorKey: "members",
        header: "Members",
        enableSorting: false,
        cell: ({ row }) => {
          const channel = row.original;
          return <ChannelMembersPopover channelId={channel.id} />;
        },
      },
      {
        accessorKey: "creator",
        header: "Created by",
        enableSorting: false,
        cell: ({ row }) => row.original.creator.name,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            className="-ml-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Created On
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const channel = row.original;
          return (
            <div className="text-muted-foreground">
              {new Date(channel.createdAt).toLocaleDateString()}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const channel = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <IconDots />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="flex flex-col items-stretch gap-1.5">
                <DropdownMenuItem asChild>
                  <Suspense fallback={<Skeleton className="h-9" />}>
                    <AddMemberDialog channelId={channel.id} />
                  </Suspense>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Suspense fallback={<Skeleton className="h-9" />}>
                    <RemoveMemberDialog channelId={channel.id} />
                  </Suspense>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Suspense fallback={<Skeleton className="h-9" />}>
                    <UpdateChannelDialog channelId={channel.id} />
                  </Suspense>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="text-destructive focus:text-destructive"
                >
                  <DeleteChannelDialog channelId={channel.id} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: channels,
    columns,
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
    pageCount,
    rowCount: total,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  if (channels.length === 0 && !debouncedSearch) {
    return (
      <div className="rounded-lg border bg-card py-12 text-center text-card-foreground shadow-sm">
        <IconLayoutDashboardFilled className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 font-medium text-lg">No channels found</h3>
        <p className="mb-4 text-muted-foreground">
          Get started by creating your first channel.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b p-4">
        <div className="flex flex-1 items-center gap-2">
          <InputGroup className="w-full max-w-sm">
            <InputGroupAddon>
              <IconSearch className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search channels..."
              value={searchTerm}
            />
          </InputGroup>
        </div>
      </div>

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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
              <SelectTrigger className="h-8 w-18">
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
      </div>
    </div>
  );
};

export function AddMemberDialog({ channelId }: { channelId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { members } = useListOrgMembers();

  const { data: currentChannelMembers } = useSuspenseQuery(
    queryUtils.communication.channel.listMembers.queryOptions({
      input: { channelId },
    })
  );

  const currentChannelMemberIds = currentChannelMembers.map(
    (member) => member.id
  );

  const availableMembers = members.filter(
    (member) => !currentChannelMemberIds.includes(member.userId)
  );

  const filteredMembers = availableMembers.filter((member) => {
    if (!debouncedSearch) return true;
    const search = debouncedSearch.toLowerCase();
    return (
      member.user.name?.toLowerCase().includes(search) ||
      member.user.email?.toLowerCase().includes(search)
    );
  });

  const { mutateAsync: addMembers, isPending } = useMutation(
    queryUtils.communication.channel.addMembers.mutationOptions({
      onSuccess: () => {
        toast.success("Members added successfully");
        setDialogOpen(false);
        queryClient.invalidateQueries({
          queryKey: queryUtils.communication.channel.listMembers.queryKey({
            input: { channelId },
          }),
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const onSubmit = async () => {
    if (selectedMemberIds.length === 0) {
      toast.error("Please select at least one member to add");
      return;
    }
    await addMembers({ channelId, memberIds: selectedMemberIds });
    setSelectedMemberIds([]);
  };

  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-start gap-1.5"
          variant="ghost"
        >
          <IconUserPlus className="size-4" />
          Add Members
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Add Members to Channel</DialogTitle>
          <DialogDescription>
            Select members to add to this channel.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <InputGroup>
            <InputGroupAddon>
              <IconSearch className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search members..."
              value={searchTerm}
            />
            {searchTerm && (
              <InputGroupAddon
                align="inline-end"
                className="cursor-pointer"
                onClick={() => setSearchTerm("")}
              >
                <IconX className="size-4" />
              </InputGroupAddon>
            )}
          </InputGroup>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div
                  className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted"
                  key={member.userId}
                >
                  <Checkbox
                    checked={selectedMemberIds.includes(member.userId)}
                    disabled={isPending}
                    id={`member-${member.userId}`}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMemberIds((prev) => [
                          ...prev,
                          member.userId,
                        ]);
                      } else {
                        setSelectedMemberIds((prev) =>
                          prev.filter((id) => id !== member.userId)
                        );
                      }
                    }}
                  />
                  <label
                    className="flex flex-1 cursor-pointer items-center space-x-2"
                    htmlFor={`member-${member.userId}`}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted font-medium text-xs">
                      {member.user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-sm">
                        {member.user.name}
                      </div>
                      <div className="truncate text-muted-foreground text-xs">
                        {member.user.email}
                      </div>
                    </div>
                    <Badge className="text-xs capitalize" variant="outline">
                      {member.role}
                    </Badge>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                {debouncedSearch ? "No members found" : "No members to add"}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setDialogOpen(false);
                setSelectedMemberIds([]);
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending || selectedMemberIds.length === 0}
              onClick={onSubmit}
              type="button"
            >
              {isPending ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Add Selected
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RemoveMemberDialog({ channelId }: { channelId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: members } = useSuspenseQuery(
    queryUtils.communication.channel.listMembers.queryOptions({
      input: { channelId, filter: { role: "member" } },
    })
  );

  const filteredMembers = members.filter((member) => {
    if (!debouncedSearch) return true;
    const search = debouncedSearch.toLowerCase();
    return (
      member.name?.toLowerCase().includes(search) ||
      member.email?.toLowerCase().includes(search)
    );
  });

  const { mutateAsync: removeMembers, isPending } = useMutation(
    queryUtils.communication.channel.removeMembers.mutationOptions({
      onSuccess: () => {
        toast.success("Members removed successfully");
        setDialogOpen(false);
        queryClient.invalidateQueries({
          queryKey: queryUtils.communication.channel.listMembers.queryKey({
            input: { channelId },
          }),
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const onSubmit = async () => {
    if (selectedMemberIds.length === 0) {
      toast.error("Please select at least one member to remove");
      return;
    }
    await removeMembers({ channelId, memberIds: selectedMemberIds });
    setSelectedMemberIds([]);
  };

  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-start gap-1.5"
          variant="ghost"
        >
          <IconUserMinus className="size-4" />
          <span>Remove Members</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Members from Channel</DialogTitle>
          <DialogDescription>
            Select members to remove from this channel.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <InputGroup>
            <InputGroupAddon>
              <IconSearch className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search members..."
              value={searchTerm}
            />
            {searchTerm && (
              <InputGroupAddon
                align="inline-end"
                className="cursor-pointer"
                onClick={() => setSearchTerm("")}
              >
                <IconX className="size-4" />
              </InputGroupAddon>
            )}
          </InputGroup>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div
                  className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted"
                  key={member.id}
                >
                  <Checkbox
                    checked={selectedMemberIds.includes(member.id)}
                    disabled={isPending}
                    id={`member-${member.id}`}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMemberIds((prev) => [...prev, member.id]);
                      } else {
                        setSelectedMemberIds((prev) =>
                          prev.filter((id) => id !== member.id)
                        );
                      }
                    }}
                  />
                  <label
                    className="flex flex-1 cursor-pointer items-center space-x-2"
                    htmlFor={`member-${member.id}`}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted font-medium text-xs">
                      {member.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-sm">
                        {member.name}
                      </div>
                      <div className="truncate text-muted-foreground text-xs">
                        {member.email}
                      </div>
                    </div>
                    <Badge className="text-xs capitalize" variant="outline">
                      {member.role}
                    </Badge>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                {debouncedSearch ? "No members found" : "No members to remove"}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setDialogOpen(false);
                setSelectedMemberIds([]);
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending || selectedMemberIds.length === 0}
              onClick={onSubmit}
              type="button"
              variant="destructive"
            >
              {isPending ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Remove Selected
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteChannelDialog({ channelId }: { channelId: string }) {
  const [dialog, toggleDialog] = useState(false);
  const { mutateAsync: deleteChannel, isPending } = useMutation(
    queryUtils.communication.channel.delete.mutationOptions({
      onSuccess: () => {
        toggleDialog(false);

        queryClient.refetchQueries({
          queryKey: queryUtils.communication.channel.list.queryKey({
            input: {},
          }),
        });
      },
    })
  );
  return (
    <AlertDialog onOpenChange={toggleDialog} open={dialog}>
      <AlertDialogTrigger
        className={buttonVariants({ variant: "destructive" })}
      >
        Delete Channel
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete this channel?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            channel and all the related resources.{" "}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteChannel({ channelId })}>
            {isPending ? <Spinner /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function UpdateChannelDialog({ channelId }: { channelId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: channel } = useSuspenseQuery(
    queryUtils.communication.channel.get.queryOptions({
      input: { channelId },
    })
  );

  const { mutateAsync: updateChannel } = useMutation(
    queryUtils.communication.channel.update.mutationOptions({
      onSuccess: () => {
        toast.success("Channel updated successfully");
        setDialogOpen(false);
        queryClient.invalidateQueries({
          queryKey: queryUtils.communication.channel.list.queryKey({
            input: {},
          }),
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useAppForm({
    defaultValues: {
      channelId,
      name: channel.name,
      description: channel.description || "",
      isPrivate: channel.isPrivate,
    },

    onSubmit: async ({ value: data }) => {
      const updateData = {
        channelId,
        ...(data.name !== undefined && data.name !== channel.name
          ? { name: data.name }
          : {}),
        ...(data.description !== undefined &&
        data.description !== channel.description
          ? { description: data.description }
          : {}),
        ...(data.isPrivate !== undefined && data.isPrivate !== channel.isPrivate
          ? { isPrivate: data.isPrivate }
          : {}),
      };

      if (Object.keys(updateData).length === 1) {
        toast.info("No changes to update");
        return;
      }

      await updateChannel(updateData);
    },
  });

  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-start gap-1.5"
          variant="ghost"
        >
          <IconEdit className="size-4" />
          Edit Channel
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Edit Channel</DialogTitle>
          <DialogDescription>
            Update the channel name, description, and privacy settings.
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
              <form.AppField name="name">
                {(field) => (
                  <field.Input
                    label="Channel Name"
                    placeholder="Enter channel name"
                  />
                )}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <field.Input
                    label="Description"
                    placeholder="Enter channel description"
                  />
                )}
              </form.AppField>
            </FieldGroup>

            <DialogFooter>
              <Button
                onClick={() => {
                  setDialogOpen(false);
                  form.reset();
                }}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button disabled={!canSubmit || isSubmitting} type="submit">
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Updating...
                      </>
                    ) : (
                      "Update Channel"
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

export const ChannelsListTableSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          className="flex items-center space-x-4 rounded-md border p-4"
          key={index.toString()}
        >
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  </div>
);
