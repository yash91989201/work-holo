import {
  IconCopy,
  IconDots,
  IconDownload,
  IconExternalLink,
  IconMessageCircle,
  IconUpload,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import type { ChannelFileOutput } from "@work-holo/api/lib/schemas/attachment";
import { Button } from "@work-holo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@work-holo/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@work-holo/ui/components/dropdown-menu";
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
  getFileTypeLabel,
  MAX_FILE_SIZE,
} from "./file-utils";

type FileType = z.infer<typeof ChannelFileOutput>;

interface FileActionsProps {
  file: FileType;
}

export const FileActions = ({ file }: FileActionsProps) => {
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
  const [previewOpen, setPreviewOpen] = useState(false);
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

  const handleDownload = async () => {
    if (!file.url) return;
    let blobUrl: string | undefined;
    try {
      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }
      const blob = await response.blob();
      blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download file:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to download file"
      );
    } finally {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    }
  };

  const handleCopyLink = async () => {
    if (!file.url) return;
    try {
      await navigator.clipboard.writeText(file.url);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleJumpToMessage = () => {
    navigate({
      to: "/org/$slug/workspace/communication/channels/$channelId",
      params: { slug, channelId: file.channelId },
      hash: `message-${file.messageId}`,
    });
  };

  const handlePreviewOrOpen = () => {
    if (!file.url) return;
    if (
      file.type === "image" ||
      file.type === "video" ||
      file.type === "audio"
    ) {
      setPreviewOpen(true);
    } else {
      const newWindow = window.open(file.url, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    }
  };

  const isMedia =
    file.type === "image" || file.type === "video" || file.type === "audio";

  const canUpdateFile = file.uploadedBy === user.id;

  const handleUpdateClick = () => {
    if (!canUpdateFile || isUpdatingFile) {
      return;
    }

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
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="secondary">
              <span className="sr-only">Open menu</span>
              <IconDots />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={!file.url} onClick={handlePreviewOrOpen}>
            <IconExternalLink className="mr-2 h-4 w-4" />
            {isMedia ? "Preview" : "Open in new tab"}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!file.url} onClick={handleDownload}>
            <IconDownload className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!file.url} onClick={handleCopyLink}>
            <IconCopy className="mr-2 h-4 w-4" />
            Copy link
          </DropdownMenuItem>
          {canUpdateFile && (
            <DropdownMenuItem
              disabled={isUpdatingFile}
              onClick={handleUpdateClick}
            >
              <IconUpload className="mr-2 h-4 w-4" />
              {isUpdatingFile ? "Updating..." : "Update"}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleJumpToMessage}>
            <IconMessageCircle className="mr-2 h-4 w-4" />
            Jump to message
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        className="hidden"
        onChange={handleUpdateFileChange}
        ref={fileInputRef}
        type="file"
      />

      <Dialog onOpenChange={setPreviewOpen} open={previewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="line-clamp-1">
              {file.originalName}
            </DialogTitle>
            <DialogDescription>
              {formatFileSize(file.fileSize)} • {getFileTypeLabel(file.type)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center overflow-hidden rounded-md bg-muted/50 p-4">
            {file.type === "image" && file.url && (
              <Image
                alt={file.originalName}
                className="max-h-[60vh] object-contain"
                effect="blur"
                priority
                src={file.url}
              />
            )}
            {file.type === "video" && file.url && (
              <video
                className="max-h-[60vh] w-full rounded-md"
                controls
                src={file.url}
              >
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
            )}
            {file.type === "audio" && file.url && (
              <audio className="w-full" controls src={file.url}>
                <track kind="captions" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
