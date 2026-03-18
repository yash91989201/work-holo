import {
  IconCopy,
  IconDots,
  IconDownload,
  IconExternalLink,
  IconMessageCircle,
} from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import type { ChannelFileOutput } from "@work-holo/api/lib/schemas/attachment";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { Image } from "@/components/shared/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatFileSize, getFileTypeLabel } from "./file-utils";

type FileType = z.infer<typeof ChannelFileOutput>;

interface FileActionsProps {
  file: FileType;
  trigger?: React.ReactNode;
}

const routeApi = getRouteApi(
  "/(authenticated)/org/$slug/workspace/communication/files/"
);

export const FileActions = ({ file, trigger }: FileActionsProps) => {
  const navigate = routeApi.useNavigate();
  const { slug } = routeApi.useParams();
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDownload = () => {
    if (!file.url) return;
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.originalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  const handlePreviewOrOpen = () => {
    if (!file.url) return;
    if (
      file.type === "image" ||
      file.type === "video" ||
      file.type === "audio"
    ) {
      setPreviewOpen(true);
    } else {
      window.open(file.url, "_blank");
    }
  };

  const isMedia =
    file.type === "image" || file.type === "video" || file.type === "audio";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger || (
            <Button className="h-8 w-8 p-0" variant="ghost">
              <span className="sr-only">Open menu</span>
              <IconDots className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleJumpToMessage}>
            <IconMessageCircle className="mr-2 h-4 w-4" />
            Jump to message
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
