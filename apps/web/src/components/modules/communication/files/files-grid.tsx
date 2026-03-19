import {
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconDots,
  IconHash,
  IconLayoutDashboardFilled,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useSearch } from "@tanstack/react-router";
import type { ChannelFileOutput } from "@work-holo/api/lib/schemas/attachment";
import { formatDistanceToNow } from "date-fns";
import type { z } from "zod";

import { Image } from "@/components/shared/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { queryUtils } from "@/utils/orpc";
import { FileActions } from "./file-actions";

import {
  formatFileSize,
  getFileIcon,
  getFileTypeColor,
  getFileTypeLabel,
} from "./file-utils";

const routeApi = getRouteApi(
  "/(authenticated)/org/$slug/workspace/communication/files/"
);

type FileItem = z.infer<typeof ChannelFileOutput>;

const getFileExtensionLabel = (filename: string) => {
  const extension = filename.split(".").pop();

  if (!extension || extension === filename) {
    return "FILE";
  }

  return extension.slice(0, 6).toUpperCase();
};

const getSenderInitials = (senderName?: string | null) => {
  if (!senderName) {
    return "U";
  }

  return (
    senderName
      .split(" ")
      .map((namePart) => namePart[0])
      .join("")
      .toUpperCase() || "U"
  );
};

const getFileSurfaceClasses = (type: string) => {
  switch (type) {
    case "image":
      return {
        icon: "text-fuchsia-500 dark:text-fuchsia-300",
        panel: "bg-muted",
      };
    case "document":
      return {
        icon: "text-sky-600 dark:text-sky-300",
        panel: "bg-sky-50/70 dark:bg-sky-950/20",
      };
    case "video":
      return {
        icon: "text-rose-600 dark:text-rose-300",
        panel: "bg-rose-50/70 dark:bg-rose-950/20",
      };
    case "audio":
      return {
        icon: "text-emerald-600 dark:text-emerald-300",
        panel: "bg-emerald-50/70 dark:bg-emerald-950/20",
      };
    case "archive":
      return {
        icon: "text-amber-600 dark:text-amber-300",
        panel: "bg-amber-50/75 dark:bg-amber-950/20",
      };
    default:
      return {
        icon: "text-slate-600 dark:text-slate-300",
        panel: "bg-slate-100/80 dark:bg-slate-900",
      };
  }
};

const FilePreview = ({
  file,
  fileExtension,
}: {
  file: FileItem;
  fileExtension: string;
}) => {
  const FileIcon = getFileIcon(file.type);
  const isImage = file.type === "image" && file.url;
  const fileSurface = getFileSurfaceClasses(file.type);

  return (
    <div
      className={`relative aspect-4/3 overflow-hidden border-border/60 border-b ${isImage ? "bg-muted" : fileSurface.panel}`}
    >
      <div className="absolute top-3 left-3 z-10">
        <Badge
          className={`${getFileTypeColor(file.type)} border-0 px-2 py-0.5 font-medium text-[10px]`}
          variant="outline"
        >
          {getFileTypeLabel(file.type)}
        </Badge>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <FileActions
          file={file}
          trigger={
            <Button
              className="h-8 w-8 rounded-full border border-border/60 bg-background/90 p-0 shadow-sm backdrop-blur-sm hover:bg-background"
              variant="ghost"
            >
              <span className="sr-only">Open menu</span>
              <IconDots className="h-4 w-4" />
            </Button>
          }
        />
      </div>

      {isImage ? (
        <Image
          alt={file.originalName}
          aspectRatio={4 / 3}
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]"
          effect="blur"
          objectFit="cover"
          src={file.thumbnailUrl || file.url || ""}
          wrapperClassName="h-full w-full"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/50 bg-background/80 shadow-sm">
            <FileIcon className={`h-6 w-6 ${fileSurface.icon}`} />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
              {fileExtension}
            </p>
            <p className="font-medium text-foreground/80 text-sm">
              {getFileTypeLabel(file.type)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const FileGridCard = ({ file }: { file: FileItem }) => {
  const fileExtension = getFileExtensionLabel(file.originalName);
  const relativeCreatedAt = formatDistanceToNow(new Date(file.createdAt), {
    addSuffix: true,
  });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-colors duration-200 hover:border-border hover:bg-muted/15">
      <FilePreview file={file} fileExtension={fileExtension} />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1.5">
          <div
            className="line-clamp-2 min-h-10 font-medium text-sm leading-snug"
            title={file.originalName}
          >
            {file.originalName}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
            <span>{formatFileSize(file.fileSize)}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{relativeCreatedAt}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-border/50 border-t pt-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar className="h-7 w-7">
              <AvatarImage src={file.senderImage ?? undefined} />
              <AvatarFallback className="font-medium text-[10px]">
                {getSenderInitials(file.senderName)}
              </AvatarFallback>
            </Avatar>
            <p
              className="truncate text-sm"
              title={file.senderName ?? "Unknown"}
            >
              {file.senderName ?? "Unknown"}
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs">
            <IconHash className="h-3.5 w-3.5 shrink-0" />
            <span className="max-w-24 truncate" title={file.channelName}>
              {file.channelName}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

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
    <>
      {files.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {files.map((file) => (
            <FileGridCard file={file} key={file.id} />
          ))}
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

      <div className="mt-6 flex flex-col gap-4 border-border/60 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 text-muted-foreground text-sm sm:flex-row sm:items-center sm:gap-4">
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

        <div className="flex items-center justify-end space-x-2">
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
      </div>
    </>
  );
};

const FilesGridSkeleton = () => {
  const skeletonKeys = Array.from(
    { length: 10 },
    (_, index) => `files-grid-skeleton-${index}`
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {skeletonKeys.map((key) => (
          <div
            className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
            key={key}
          >
            <div className="relative aspect-4/3 overflow-hidden border-border/60 border-b">
              <Skeleton className="h-full w-full rounded-none" />
              <Skeleton className="absolute top-3 left-3 h-5 w-16 rounded-full" />
              <Skeleton className="absolute top-3 right-3 h-8 w-8 rounded-full" />
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-1 w-1 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 border-border/50 border-t pt-3">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-4 w-18" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-full" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-border/60 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
    </>
  );
};

FilesGrid.Fallback = FilesGridSkeleton;
