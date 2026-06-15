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
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import type { ChannelFileOutput } from "@work-holo/api/lib/schemas/attachment";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@work-holo/ui/components/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@work-holo/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@work-holo/ui/components/select";
import { Separator } from "@work-holo/ui/components/separator";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { format } from "date-fns";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { Image } from "@/components/shared/image";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { queryUtils } from "@/utils/orpc";
import {
  formatFileSize,
  getAttachmentTypeFromMime,
  getFileIcon,
  getFileTypeColor,
  getFileTypeLabel,
  MAX_FILE_SIZE,
} from "./file-utils";

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
  const isImage = file.type === "image" && file.url;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        <DialogClose
          render={
            <Button
              className="absolute top-3 right-3 z-10"
              size="icon"
              variant="secondary"
            >
              <IconX className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          }
        />

        <div className="relative h-44 w-full overflow-hidden bg-muted">
          {isImage ? (
            <Image
              alt={file.originalName}
              className="h-full w-full"
              effect="blur"
              objectFit="cover"
              src={file.thumbnailUrl || file.url || ""}
              wrapperClassName="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileIcon className="h-14 w-14 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
        </div>

        <div className="flex items-start gap-3 px-4 pt-4 pb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted">
            <FileIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className="truncate font-semibold text-sm leading-tight"
              title={file.originalName}
            >
              {file.originalName}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge
                className={`border-0 px-2 py-0 font-medium text-[10px] ${getFileTypeColor(file.type)}`}
                variant="outline"
              >
                {getFileTypeLabel(file.type)}
              </Badge>
              <span className="text-[10px] text-muted-foreground/50">·</span>
              <span className="truncate text-[11px] text-muted-foreground">
                {file.mimeType}
              </span>
            </div>
          </div>
        </div>

        <Separator className="mx-4 w-auto" />

        <div className="px-4 py-3">
          <p className="mb-2.5 font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
            Details
          </p>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground text-xs">File size</span>
              <span className="font-medium text-sm">
                {formatFileSize(file.fileSize)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground text-xs">Uploaded</span>
              <span className="font-medium text-sm">
                {format(new Date(file.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>
        </div>

        <Separator className="mx-4 w-auto" />

        <div className="px-4 py-3">
          <p className="mb-2.5 font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
            Source
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-7 w-7 shrink-0">
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

            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                <IconHash className="h-3.5 w-3.5 text-muted-foreground" />
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
  const queryClient = useQueryClient();
  const { user } = useAuthedSession();
  const navigate = useNavigate({
    from: "/org/$slug/workspace/communication/channels/files/",
  });
  const search = useSearch({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/files/",
  });
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/files/",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isUpdatingFile, setIsUpdatingFile] = useState(false);

  const getUpdateUploadUrl = useMutation(
    queryUtils.communication.attachment.getUpdateUploadUrl.mutationOptions()
  );

  const updateFile = useMutation(
    queryUtils.communication.attachment.update.mutationOptions({
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: queryUtils.communication.attachment.list.queryKey({
            input: {
              page: search.page ?? 1,
              perPage: search.perPage ?? 20,
              search: search.search,
              onlyMine: search.onlyMine,
              type: search.type === "all" ? undefined : search.type,
              channelId: search.channelId,
              sortBy:
                (search.sortBy as "name" | "size" | "createdAt" | "type") ??
                "createdAt",
              sortOrder: search.sortOrder ?? "desc",
            },
          }),
        });
      },
    })
  );

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
    } catch (error) {
      console.error("Failed to download file:", error);
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

  const canUpdateFile = file.uploadedBy === user.id;

  const handleUpdateClick = () => {
    if (!canUpdateFile || isUpdatingFile) return;

    fileInputRef.current?.click();
  };

  const handleUpdateFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!(selectedFile && canUpdateFile)) {
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`);
      return;
    }

    setIsUpdatingFile(true);

    try {
      const contentType = selectedFile.type || "application/octet-stream";
      const uploadData = await getUpdateUploadUrl.mutateAsync({
        attachmentId: file.id,
        contentType,
        fileSize: selectedFile.size,
      });

      const uploadResponse = await fetch(uploadData.uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      await updateFile.mutateAsync({
        attachmentId: file.id,
        originalName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: contentType,
        type: getAttachmentTypeFromMime(contentType),
      });

      toast.success("File updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update file"
      );
    } finally {
      event.target.value = "";
      setIsUpdatingFile(false);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger
          render={
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
          }
        />

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
          {canUpdateFile && (
            <ContextMenuItem
              disabled={isUpdatingFile}
              onClick={handleUpdateClick}
            >
              <IconUpload />
              {isUpdatingFile ? "Updating..." : "Update"}
            </ContextMenuItem>
          )}
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

      <input
        className="hidden"
        onChange={handleUpdateFileChange}
        ref={fileInputRef}
        type="file"
      />

      <FileInfoDialog file={file} onOpenChange={setInfoOpen} open={infoOpen} />
    </>
  );
};

export const FilesGrid = () => {
  const search = useSearch({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/files/",
  });

  const navigate = useNavigate({
    from: "/org/$slug/workspace/communication/channels/files/",
  });

  const pageIndex = (search.page ?? 1) - 1;
  const pageSize = search.perPage ?? 20;
  const hasActiveFilters =
    Boolean(search.search) ||
    Boolean(search.onlyMine) ||
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
        onlyMine: false,
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
            <Select disabled items={[{ value: "20", label: "20" }]} value="20">
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
