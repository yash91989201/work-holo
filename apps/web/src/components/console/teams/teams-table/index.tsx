import {
  IconArrowAutofitHeightFilled,
  IconBuilding,
  IconCalendarEventFilled,
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconCircleChevronsLeftFilled,
  IconCircleChevronsRightFilled,
  IconDots,
  IconSearch,
  IconTrashFilled,
  IconUsers,
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
  type VisibilityState,
} from "@tanstack/react-table";
import type { TeamMemberType } from "@work-holo/db/lib/types";
import { format } from "date-fns";
import { Suspense, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

function getDateRangeDisplay(
  dateRange: DateRange | undefined
): React.ReactNode {
  if (!dateRange?.from) {
    return <span>Filter by date</span>;
  }

  if (dateRange.to) {
    return (
      <>
        {format(dateRange.from, "LLL dd, y")} -{" "}
        {format(dateRange.to, "LLL dd, y")}
      </>
    );
  }

  return format(dateRange.from, "LLL dd, y");
}

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
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { queryClient, queryUtils } from "@/utils/orpc";
import { CreateTeamForm } from "../create-team-form";
import {
  AddTeamMemberDialog,
  RemoveTeamMemberDialog,
} from "./member-management-dialogs";

type Team = {
  id: string;
  name: string;
  createdAt: Date;
  teamMembers: TeamMemberType[];
};

export const TeamsTable = () => {
  const search = useSearch({
    from: "/(authenticated)/org/$slug/console/teams/",
  });

  const navigate = useNavigate({
    from: "/org/$slug/console/teams/",
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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

  const dateRange: DateRange | undefined = useMemo(() => {
    if (search.startDate && search.endDate) {
      return {
        from: new Date(search.startDate),
        to: new Date(search.endDate),
      };
    }
    return;
  }, [search.startDate, search.endDate]);

  const {
    data: { teams, pageCount, total },
  } = useSuspenseQuery(
    queryUtils.team.manage.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search.search || undefined,
        filters: dateRange
          ? {
              dateRange: {
                from: dateRange.from?.toISOString(),
                to: dateRange.to?.toISOString(),
              },
            }
          : undefined,
        sorting: sorting.map((s) => ({
          id: s.id,
          desc: s.desc,
        })),
      },
    })
  );

  const { mutateAsync: deleteTeam } = useMutation({
    mutationKey: ["delete-team"],
    mutationFn: async ({ teamId }: { teamId: string }) => {
      await authClient.organization.removeTeam({
        teamId,
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: queryUtils.team.manage.list.queryKey({
          input: {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: search.search || undefined,
            filters: dateRange
              ? {
                  dateRange: {
                    from: dateRange.from?.toISOString(),
                    to: dateRange.to?.toISOString(),
                  },
                }
              : undefined,
            sorting: sorting.map((s) => ({
              id: s.id,
              desc: s.desc,
            })),
          },
        }),
      });
    },
  });

  const columns = useMemo<ColumnDef<Team>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            <span>Team Name</span>
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "teamMembers",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            <IconUsers className="mr-2 h-4 w-4" />
            Members
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const members = row.getValue("teamMembers") as unknown[];
          return (
            <div className="flex items-center gap-2">
              <Badge className="rounded-sm font-normal" variant="secondary">
                {members.length} {members.length === 1 ? "Member" : "Members"}
              </Badge>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            <IconCalendarEventFilled className="mr-2 h-4 w-4" />
            Created At
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="mr-10 text-muted-foreground">
            {new Date(row.getValue("createdAt")).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const team = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button className="h-8 w-8 p-0" variant="ghost">
                      <span className="sr-only">Open menu</span>
                      <IconDots className="h-4 w-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    render={
                      <Suspense fallback={<AddTeamMemberDialog.Fallback />}>
                        <AddTeamMemberDialog teamId={team.id} />
                      </Suspense>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Suspense fallback={<RemoveTeamMemberDialog.Fallback />}>
                        <RemoveTeamMemberDialog teamId={team.id} />
                      </Suspense>
                    }
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => deleteTeam({ teamId: team.id })}
                  >
                    <IconTrashFilled className="mr-2 h-4 w-4" />
                    <span>Delete Team</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [deleteTeam]
  );

  const table = useReactTable({
    data: teams,
    columns,
    state: {
      sorting,
      columnVisibility,
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
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  if (teams.length === 0 && !search.search && !dateRange) {
    return (
      <div className="rounded-lg border bg-card py-12 text-center text-card-foreground shadow-sm">
        <IconBuilding className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 font-medium text-lg">No teams found</h3>
        <p className="mb-4 text-muted-foreground">
          Get started by creating your first team.
        </p>
        <CreateTeamForm />
      </div>
    );
  }

  return (
    <Card className="w-full" variant="neumorphic">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b py-4">
        <div className="flex flex-1 items-center gap-2">
          <InputGroup className="w-full max-w-sm">
            <InputGroupAddon>
              <IconSearch className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search teams..."
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

          <Popover>
            <PopoverTrigger
              render={
                <Button
                  className={cn(
                    "max-w-72 justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                  variant={"outline"}
                >
                  <IconCalendarEventFilled className="mr-2 h-4 w-4" />
                  {getDateRangeDisplay(dateRange)}
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

          {/* Reset filter button if filters are active */}
          {(dateRange || searchTerm) && (
            <Button
              className="h-9 px-2 lg:px-3"
              onClick={() => {
                setSearchTerm("");
                navigate({
                  search: {
                    page: 1,
                    perPage: search.perPage ?? 10,
                  },
                });
              }}
              variant="ghost"
            >
              Reset
            </Button>
          )}
        </div>
        <div className="ml-auto">
          <CreateTeamForm />
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
                  No results.
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
              items={[10, 20, 30, 40, 50].map((size) => ({
                value: `${size}`,
                label: `${size}`,
              }))}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              value={`${table.getState().pagination.pageSize}`}
            >
              <SelectTrigger className="h-8 w-17.5">
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

const TeamsTableSkeleton = () => (
  <Card className="w-full" variant="neumorphic">
    <CardHeader className="flex flex-row items-center justify-between gap-4 border-b py-4">
      <Skeleton className="h-9 w-75" />
      <Skeleton className="h-9 w-37" />
    </CardHeader>
    <CardContent className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: 4 }).map((_, i) => (
              <TableHead key={i.toString()}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i.toString()}>
              {Array.from({ length: 4 }).map((_, j) => (
                <TableCell key={j.toString()}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
    <CardFooter className="flex items-center justify-between border-t pt-4">
      <Skeleton className="h-8 w-50" />
      <Skeleton className="h-8 w-75" />
    </CardFooter>
  </Card>
);

TeamsTable.Fallback = TeamsTableSkeleton;
