import {
  IconArrowAutofitHeightFilled,
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconHash,
  IconLayoutDashboardFilled,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import { Card, CardContent, CardFooter } from "@work-holo/ui/components/card";
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
import { useEffect, useMemo, useState } from "react";
import { queryUtils } from "@/utils/orpc";
import { FileActions } from "./file-actions";
import {
  formatFileSize,
  getFileIcon,
  getFileTypeColor,
  getFileTypeLabel,
} from "./file-utils";

export const FilesTable = () => {
  const search = useSearch({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/files/",
  });

  const navigate = useNavigate({
    from: "/org/$slug/workspace/communication/channels/files/",
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: search.sortBy ?? "createdAt",
      desc: search.sortOrder === "desc",
    },
  ]);

  useEffect(() => {
    setSorting([
      {
        id: search.sortBy ?? "createdAt",
        desc: search.sortOrder === "desc",
      },
    ]);
  }, [search.sortBy, search.sortOrder]);

  const pagination: PaginationState = {
    pageIndex: (search.page ?? 1) - 1,
    pageSize: search.perPage ?? 20,
  };
  const hasActiveFilters =
    Boolean(search.search) ||
    Boolean(search.onlyMine) ||
    search.type !== "all" ||
    Boolean(search.channelId);

  const resetFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: undefined,
        onlyMine: false,
        type: "all",
        channelId: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
        page: 1,
      }),
    });
  };

  const {
    data: { files, total, pageCount },
  } = useSuspenseQuery(
    queryUtils.communication.attachment.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        search: search.search,
        onlyMine: search.onlyMine,
        type: search.type === "all" ? undefined : search.type,
        channelId: search.channelId,
        sortBy:
          (search.sortBy as "name" | "size" | "createdAt" | "type") ??
          "createdAt",
        sortOrder: search.sortOrder ?? "desc",
      },
    })
  );

  type ChannelFile = (typeof files)[number];

  const columns = useMemo<ColumnDef<ChannelFile>[]>(
    () => [
      {
        accessorKey: "originalName",
        id: "name",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            File
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const file = row.original;
          const FileIcon = getFileIcon(file.type);

          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="line-clamp-1 max-w-[200px] font-medium sm:max-w-[300px]">
                  {file.originalName}
                </div>
                <div className="text-muted-foreground text-xs">
                  {formatFileSize(file.fileSize)}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        id: "type",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Type
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const type = row.original.type;
          return (
            <Badge className={getFileTypeColor(type)} variant="outline">
              {getFileTypeLabel(type)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "channelName",
        id: "channel",
        header: "Channel",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <IconHash className="h-4 w-4" />
            <span className="line-clamp-1 max-w-[150px]">
              {row.original.channelName}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "senderName",
        id: "sender",
        header: "Shared by",
        cell: ({ row }) => {
          const file = row.original;
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={file.senderImage ?? undefined} />
                <AvatarFallback className="text-[10px]">
                  {file.senderName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="line-clamp-1 max-w-[120px] text-sm">
                {file.senderName ?? "Unknown"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        id: "createdAt",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Date
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground text-sm">
            {format(new Date(row.original.createdAt), "MMM d, yyyy")}
          </div>
        ),
      },
      {
        accessorKey: "fileSize",
        id: "size",
        header: ({ column }) => (
          <Button
            className="-ml-4 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            Size
            <IconArrowAutofitHeightFilled className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground text-sm">
            {formatFileSize(row.original.fileSize)}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <FileActions file={row.original} />
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: files,
    columns,
    state: {
      sorting,
      pagination,
    },
    pageCount,
    rowCount: total,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      if (newSorting.length > 0) {
        navigate({
          search: (prev) => ({
            ...prev,
            sortBy: newSorting[0].id as "name" | "size" | "createdAt" | "type",
            sortOrder: newSorting[0].desc ? "desc" : "asc",
            page: 1,
          }),
        });
      }
    },
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
    <Card variant="neumorphic">
      <CardContent className="p-0">
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
                    className="h-32 text-center"
                    colSpan={columns.length}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <IconLayoutDashboardFilled className="h-8 w-8 text-muted-foreground/50" />
                      {hasActiveFilters ? (
                        <>
                          <p className="font-medium">
                            No files match your filters
                          </p>
                          <p className="max-w-sm text-muted-foreground text-sm">
                            Try adjusting your search or selected filters to
                            find files.
                          </p>
                          <Button
                            onClick={resetFilters}
                            size="sm"
                            variant="outline"
                          >
                            Reset
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">No files yet</p>
                          <p className="max-w-sm text-muted-foreground text-sm">
                            Files shared in your channels will appear here.
                          </p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
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
            Showing {files.length} of {total} files
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
  );
};

const FilesTableSkeleton = () => (
  <Card variant="neumorphic">
    <CardContent className="p-0">
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border border-b">
              <TableHead>File</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Shared by</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list */}
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow
                className="border-border border-b"
                key={index.toString()}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
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
    <CardFooter className="flex items-center justify-between border-t p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-12" />
      </div>
    </CardFooter>
  </Card>
);

FilesTable.Fallback = FilesTableSkeleton;
