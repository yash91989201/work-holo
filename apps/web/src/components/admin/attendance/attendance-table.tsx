import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDownload,
  IconFilter,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import type { AttendanceStatus } from "@work-holo/api/lib/schemas/attendance";
import type { AttendanceRecordWithUserType } from "@work-holo/api/lib/types";
import { startOfMonth, subDays } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { queryUtils } from "@/utils/orpc";
import { AttendanceDetailsSheet } from "./attendance-details-sheet";

export function AttendanceTable() {
  const searchParams = useSearch({
    from: "/(authenticated)/org/$slug/dashboard/attendance/",
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: (searchParams.page || 1) - 1,
    pageSize: 10,
  });

  const [searchInput, setSearchInput] = useState(searchParams.search || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (searchParams.startDate && searchParams.endDate) {
      return {
        from: new Date(searchParams.startDate),
        to: new Date(searchParams.endDate),
      };
    }

    return;
  });

  const [selectedStatus, setSelectedStatus] = useState<
    AttendanceStatus | undefined
  >(searchParams.status as AttendanceStatus);

  const [filterOpen, setFilterOpen] = useState(false);
  const [detailAttendanceId, setDetailAttendanceId] = useState<string | null>(
    null
  );

  // Data Fetching
  const { data: attendanceData } = useSuspenseQuery(
    queryUtils.attendance.records.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        search: debouncedSearch || undefined,
        filters: {
          startDate: dateRange?.from,
          endDate: dateRange?.to,
          status: selectedStatus,
        },
        sorting: sorting.map((s) => ({ id: s.id, desc: s.desc })),
      },
    })
  );

  const handleClearSearch = () => {
    setSearchInput("");
  };

  const handleApplyFilters = () => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    setFilterOpen(false);
  };

  const handleClearFilters = () => {
    setDateRange(undefined);
    setSelectedStatus(undefined);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    setFilterOpen(false);
  };

  const columns = useMemo<ColumnDef<AttendanceRecordWithUserType>[]>(
    () => [
      {
        accessorKey: "user.name",
        id: "user.name",
        header: "Member",
        cell: ({ row }) => {
          const record = row.original;
          const getInitials = (name: string | null) => {
            if (!name) return "U";
            return name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
          };
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={record.user.image ?? undefined} />
                <AvatarFallback>{getInitials(record.user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {record.user.name ?? "Unknown"}
                </div>
                <div className="text-muted-foreground text-sm">
                  {record.user.email}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) =>
          new Date(row.original.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      },
      {
        accessorKey: "checkInTime",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Check In
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const val = row.original.checkInTime;
          if (!val) return "-";
          return new Date(val).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        },
      },
      {
        accessorKey: "checkOutTime",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Check Out
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const val = row.original.checkOutTime;
          if (!val) return "-";
          return new Date(val).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        },
      },
      {
        accessorKey: "totalHours",
        header: "Total Hours",
        cell: ({ row }) =>
          row.original.totalHours ? `${row.original.totalHours}h` : "-",
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <Button
            onClick={() => setDetailAttendanceId(row.original.id)}
            size="icon"
            variant="ghost"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: attendanceData.records,
    columns,
    state: {
      sorting,
      pagination,
    },
    pageCount: attendanceData.pagination.totalPages,
    rowCount: attendanceData.pagination.total,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const activeFilterCount = [dateRange, selectedStatus].filter(Boolean).length;

  const handleExportCSV = () => {
    try {
      const headers = [
        "Member Name",
        "Email",
        "Date",
        "Check In",
        "Check Out",
        "Total Hours",
        "Break Duration (min)",
        "Status",
        "Location",
        "IP Address",
      ];
      const rows = attendanceData.records.map((record) => [
        record.user.name ?? "Unknown",
        record.user.email,
        new Date(record.date).toLocaleDateString("en-US"),
        record.checkInTime
          ? new Date(record.checkInTime).toLocaleString("en-US")
          : "-",
        record.checkOutTime
          ? new Date(record.checkOutTime).toLocaleString("en-US")
          : "-",
        record.totalHours ?? "-",
        record.breakDuration?.toString() ?? "0",
        record.status ?? "-",
        record.location ?? "-",
        record.ipAddress ?? "-",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported successfully");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-sm">
              <InputGroup>
                <InputGroupAddon>
                  <IconSearch className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search members..."
                  value={searchInput}
                />
                {searchInput && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={handleClearSearch}
                      size="icon-xs"
                      variant="ghost"
                    >
                      <IconX className="h-4 w-4" />
                    </InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Popover onOpenChange={setFilterOpen} open={filterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      activeFilterCount > 0 && "border-primary text-primary"
                    )}
                    size="sm"
                    variant="outline"
                  >
                    <IconFilter className="mr-2 h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 && (
                      <Badge className="ml-2 h-5 min-w-5 px-1">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0">
                  <div className="flex flex-col sm:flex-row">
                    <Calendar
                      mode="range"
                      numberOfMonths={1}
                      onSelect={setDateRange}
                      selected={dateRange}
                    />

                    <div className="flex w-full flex-col gap-4 border-l p-4 sm:w-64">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Filters</h4>
                        <Button
                          className="h-auto p-0 text-muted-foreground hover:text-foreground"
                          onClick={handleClearFilters}
                          variant="ghost"
                        >
                          Reset
                        </Button>
                      </div>
                      <Separator />

                      {/* Status Filter */}
                      <div className="space-y-2">
                        <Label className="text-xs">Status</Label>
                        <Select
                          onValueChange={(value) =>
                            setSelectedStatus(value as AttendanceStatus)
                          }
                          value={selectedStatus}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="excused">Excused</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="holiday">Holiday</SelectItem>
                            <SelectItem value="sick_leave">
                              Sick Leave
                            </SelectItem>
                            <SelectItem value="work_from_home">
                              Work From Home
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quick Date Filters */}
                      <div className="space-y-2">
                        <Label className="text-xs">Quick Dates</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            className="h-8 text-xs"
                            onClick={() =>
                              setDateRange({ from: new Date(), to: new Date() })
                            }
                            variant="outline"
                          >
                            Today
                          </Button>
                          <Button
                            className="h-8 text-xs"
                            onClick={() =>
                              setDateRange({
                                from: subDays(new Date(), 1),
                                to: subDays(new Date(), 1),
                              })
                            }
                            variant="outline"
                          >
                            Yesterday
                          </Button>
                          <Button
                            className="h-8 text-xs"
                            onClick={() =>
                              setDateRange({
                                from: subDays(new Date(), 7),
                                to: new Date(),
                              })
                            }
                            variant="outline"
                          >
                            Last 7 Days
                          </Button>
                          <Button
                            className="h-8 text-xs"
                            onClick={() =>
                              setDateRange({
                                from: startOfMonth(new Date()),
                                to: new Date(),
                              })
                            }
                            variant="outline"
                          >
                            This Month
                          </Button>
                        </div>
                      </div>

                      <div className="mt-auto pt-2">
                        <Button
                          className="w-full"
                          onClick={handleApplyFilters}
                          size="sm"
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button onClick={handleExportCSV} size="sm" variant="outline">
                <IconDownload className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {table.getRowModel().rows?.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center" colSpan={6}>
                    <div className="py-8 text-muted-foreground">
                      No attendance records found.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
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
              )}
            </TableBody>
          </Table>

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
              <div>{attendanceData.pagination.total} row(s) total</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                className="h-8 px-2 lg:px-3"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.setPageIndex(0)}
                variant="outline"
              >
                <IconChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First</span>
              </Button>
              <Button
                className="h-8 px-2 lg:px-3"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                variant="outline"
              >
                <IconChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()}
              </span>
              <Button
                className="h-8 px-2 lg:px-3"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                variant="outline"
              >
                <IconChevronRight className="h-4 w-4" />
              </Button>
              <Button
                className="h-8 px-2 lg:px-3"
                disabled={!table.getCanNextPage()}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                variant="outline"
              >
                <IconChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AttendanceDetailsSheet
        attendanceId={detailAttendanceId}
        onClose={() => setDetailAttendanceId(null)}
      />
    </>
  );
}
