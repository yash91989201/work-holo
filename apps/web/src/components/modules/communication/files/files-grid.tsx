import {
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconDots,
  IconHash,
  IconLayoutDashboardFilled,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useSearch } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";

import { Image } from "@/components/shared/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { queryUtils } from "@/utils/orpc";

import {
  formatFileSize,
  getFileIcon,
  getFileTypeColor,
  getFileTypeLabel,
} from "./file-utils";

const routeApi = getRouteApi(
  "/(authenticated)/org/$slug/workspace/communication/files/"
);

export const FilesGrid = () => {
  const search = useSearch({
    from: "/(authenticated)/org/$slug/workspace/communication/files/",
  });

  const navigate = routeApi.useNavigate();

  const pageIndex = (search.page ?? 1) - 1;
  const pageSize = search.perPage ?? 20;
  const hasActiveFilters =
    Boolean(search.search) ||
    search.type !== "all" ||
    Boolean(search.channelId);

  const {
    data: { files, total, pageCount },
  } = useSuspenseQuery(
    queryUtils.communication.attachment.list.queryOptions({
      input: {
        page: pageIndex + 1,
        perPage: pageSize,
        search: search.search,
        type: search.type !== "all" ? search.type : undefined,
        channelId: search.channelId,
        sortBy:
          (search.sortBy as "name" | "size" | "createdAt" | "type") ??
          "createdAt",
        sortOrder: search.sortOrder ?? "desc",
      },
    })
  );

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const previousPage = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: Math.max(1, (prev.page ?? 1) - 1),
      }),
    });
  };

  const nextPage = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: Math.min(pageCount, (prev.page ?? 1) + 1),
      }),
    });
  };

  const resetFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: undefined,
        type: "all",
        channelId: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
        page: 1,
      }),
    });
  };

  return (
    <Card data-testid="files-grid" variant="neumorphic">
      <CardContent className="p-4 sm:p-6">
        {files.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const isImage = file.type === "image" && file.url;

              return (
                <Card
                  className="group relative flex flex-col overflow-hidden transition-all hover:shadow-md"
                  key={file.id}
                >
                  <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="h-8 w-8 bg-background/80 p-0 backdrop-blur-sm hover:bg-background"
                          variant="ghost"
                        >
                          <span className="sr-only">Open menu</span>
                          <IconDots className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>
                          Actions coming soon
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    {isImage ? (
                      <Image
                        alt={file.originalName}
                        aspectRatio={1}
                        className="h-full w-full"
                        effect="blur"
                        objectFit="cover"
                        src={file.url || ""}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FileIcon className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3">
                    <div
                      className="mb-2 line-clamp-1 font-medium text-sm"
                      title={file.originalName}
                    >
                      {file.originalName}
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        className={getFileTypeColor(file.type)}
                        variant="outline"
                      >
                        {getFileTypeLabel(file.type)}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {formatFileSize(file.fileSize)}
                      </span>
                    </div>

                    <div className="mt-auto flex flex-col gap-2 border-t pt-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <IconHash className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{file.channelName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={file.senderImage ?? undefined} />
                            <AvatarFallback className="text-[8px]">
                              {file.senderName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="line-clamp-1 text-muted-foreground text-xs">
                            {file.senderName ?? "Unknown"}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(file.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <IconLayoutDashboardFilled className="h-8 w-8 text-muted-foreground/50" />
            {hasActiveFilters ? (
              <>
                <p className="font-medium">No files match your filters</p>
                <p className="max-w-sm text-muted-foreground text-sm">
                  Try adjusting your search or selected filters to find files.
                </p>
                <Button onClick={resetFilters} size="sm" variant="outline">
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
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <p className="hidden sm:block">Items per page</p>
            <Select
              onValueChange={(value) => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    perPage: Number(value),
                    page: 1,
                  }),
                });
              }}
              value={`${pageSize}`}
            >
              <SelectTrigger className="h-8 w-17">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            Showing {files.length} of {total} files
          </div>
        </div>
        <div
          className="flex items-center space-x-2"
          data-testid="files-pagination"
        >
          <Button
            className="h-8 px-3"
            disabled={!canPreviousPage}
            onClick={previousPage}
            size="sm"
            variant="outline"
          >
            <IconCircleChevronLeftFilled className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 px-3"
            disabled={!canNextPage}
            onClick={nextPage}
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

const FilesGridSkeleton = () => (
  <Card variant="neumorphic">
    <CardContent className="p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card
            className="flex flex-col overflow-hidden"
            key={index.toString()}
          >
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="flex flex-1 flex-col p-3">
              <Skeleton className="mb-2 h-4 w-3/4" />
              <div className="mb-3 flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="mt-auto flex flex-col gap-2 border-t pt-3">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3.5 w-3.5" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-2 w-12" />
                </div>
              </div>
            </div>
          </Card>
        ))}
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

FilesGrid.Fallback = FilesGridSkeleton;
