import {
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconCopy,
  IconDownload,
  IconExternalLink,
  IconHash,
  IconInfoCircle,
  IconLayoutDashboardFilled,
  IconMessageCircle,
  IconX,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useSearch } from "@tanstack/react-router";
import type { ChannelFileOutput } from "@work-holo/api/lib/schemas/attachment";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { Image } from "@/components/shared/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type FileItem = z.infer<typeof ChannelFileOutput>;

const getSenderInitials = (senderName?: string | null) => {
  if (!senderName) return "U";
  return (
    senderName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"
  );
};

const FilePreview = ({ file }: { file: FileItem }) => {
  const FileIcon = getFileIcon(file.type);
  const isImage = file.type === "image" && file.url;

  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-t-2xl ${isImage ? "bg-muted" : "bg-muted/40"}`}
    >
      {isImage ? (
        <Image
          alt={file.originalName}
          aspectRatio={1}
          className="h-full w-full"
          effect="blur"
          objectFit="cover"
          src={file.thumbnailUrl || file.url || ""}
          wrapperClassName="h-full w-full"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/50 bg-background shadow-sm">
            <FileIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <Badge
            className={`border-0 px-2.5 py-0.5 font-medium text-[11px] ${getFileTypeColor(file.type)}`}
            variant="outline"
          >
            {getFileTypeLabel(file.type)}
          </Badge>
        </div>
      )}
    </div>
  );
};

const FileInfoDialog = ({
  file,
  open,
  onOpenChange,
}: {
  file: FileItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const FileIcon = getFileIcon(file.type);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogClose asChild>
          <Button
            className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full border border-border/50 bg-background/90 shadow-sm hover:bg-background"
            size="icon"
            variant="secondary"
          >
            <IconX className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
        <div className="relative h-60 w-full overflow-hidden bg-muted">
          {file.type === "image" && file.url ? (
            <Image
              alt={file.originalName}
              className="h-full w-full"
              effect="blur"
              objectFit="cover"
              src={file.thumbnailUrl || file.url}
              wrapperClassName="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileIcon className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
        </div>

        <div className="space-y-5 p-5">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <FileIcon className="h-5 w-5 text-muted-foreground" />
              <DialogTitle className="font-semibold text-sm">
                File Information
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
              {getFileTypeLabel(file.type)}
              <span className="mx-1.5 text-border">·</span>
              {file.mimeType}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <div className="col-span-2 space-y-3 rounded-xl border border-border/50 bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Size</span>
                <span className="font-medium text-sm">
                  {formatFileSize(file.fileSize)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Uploaded</span>
                <span className="font-medium text-sm">
                  {format(new Date(file.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Time</span>
                <span className="font-medium text-sm">
                  {format(new Date(file.createdAt), "h:mm a")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={file.senderImage ?? undefined} />
                <AvatarFallback className="font-medium text-[10px]">
                  {getSenderInitials(file.senderName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium text-sm">
                  {file.senderName ?? "Unknown"}
                </p>
                <p className="text-muted-foreground text-xs">Shared by</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted">
                <IconHash className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-sm">
                  {file.channelName}
                </p>
                <p className="text-muted-foreground text-xs">Channel</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FileGridCard = ({ file }: { file: FileItem }) => {
  const navigate = routeApi.useNavigate();
  const { slug } = routeApi.useParams();
  const [infoOpen, setInfoOpen] = useState(false);

  const handlePreviewOrOpen = () => {
    if (!file.url) return;
    window.open(file.url, "_blank");
  };

  const handleDownload = async () => {
    if (!file.url) return;
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download file");
    }
  };

  const handleCopyLink = () => {
    if (!file.url) return;
    navigator.clipboard.writeText(file.url);
    toast.success("Link copied");
  };

  const handleJumpToMessage = () => {
    navigate({
      to: "/org/$slug/workspace/communication/channels/$channelId",
      params: { slug, channelId: file.channelId },
    });
  };

  const isMedia =
    file.type === "image" || file.type === "video" || file.type === "audio";

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow duration-200 hover:shadow-sm">
            <FilePreview file={file} />
            <div className="px-3 py-2.5">
              <p
                className="truncate font-medium text-sm"
                title={file.originalName}
              >
                {file.originalName}
              </p>
            </div>
          </article>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem disabled={!file.url} onClick={handlePreviewOrOpen}>
            <IconExternalLink />
            {isMedia ? "Preview" : "Open"}
          </ContextMenuItem>
          <ContextMenuItem disabled={!file.url} onClick={handleDownload}>
            <IconDownload />
            Download
          </ContextMenuItem>
          <ContextMenuItem disabled={!file.url} onClick={handleCopyLink}>
            <IconCopy />
            Copy link
          </ContextMenuItem>
          <ContextMenuItem onClick={handleJumpToMessage}>
            <IconMessageCircle />
            Jump to message
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setInfoOpen(true)}>
            <IconInfoCircle />
            File info
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <FileInfoDialog file={file} onOpenChange={setInfoOpen} open={infoOpen} />
    </>
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {skeletonKeys.map((key) => (
          <div
            className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
            key={key}
          >
            <Skeleton className="aspect-square rounded-none rounded-t-2xl" />
            <div className="px-3 py-2.5">
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-border/60 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 text-muted-foreground text-sm sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <p className="hidden sm:block">Items per page</p>
            <Select disabled value="20">
              <SelectTrigger className="h-8 w-17">
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button className="h-8 px-3" disabled size="sm" variant="outline">
            <IconCircleChevronLeftFilled className="h-4 w-4" />
          </Button>
          <Button className="h-8 px-3" disabled size="sm" variant="outline">
            <IconCircleChevronRightFilled className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

FilesGrid.Fallback = FilesGridSkeleton;
