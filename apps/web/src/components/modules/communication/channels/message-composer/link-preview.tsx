import { IconX } from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";
import { Card, CardContent } from "@work-holo/ui/components/card";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LinkPreviewData {
  description: string;
  favicon: string;
  image: string;
  title: string;
  url: string;
}

interface LinkPreviewProps {
  onClose?: () => void;
  showCloseButton?: boolean;
  url: string;
}

export function LinkPreview({
  url,
  onClose,
  showCloseButton = false,
}: LinkPreviewProps) {
  const [linkPreview, setLinkPreview] = useState<LinkPreviewData | null>(null);

  useEffect(() => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace("www.", "");

      setLinkPreview({
        title: domain,
        description: url,
        image: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        url: domain,
      });
    } catch {
      setLinkPreview(null);
    }
  }, [url]);

  if (!linkPreview) {
    return null;
  }

  const handleClick = () => {
    // Don't open link in editor mode
    if (showCloseButton) {
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      className={cn(
        "my-2 w-80 py-3 shadow-lg",
        !showCloseButton && "cursor-pointer transition-shadow hover:shadow-xl"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-3">
        <div className="relative">
          {showCloseButton && onClose && (
            <Button
              className="absolute top-0 right-0 h-5 w-5"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              size="icon"
              type="button"
              variant="ghost"
            >
              <IconX className="h-3 w-3" />
            </Button>
          )}

          <div className="flex gap-3">
            {linkPreview.image && (
              <img
                alt={linkPreview.title}
                className="h-12 w-12 shrink-0 rounded object-cover"
                height={48}
                src={linkPreview.image}
                width={48}
              />
            )}

            <div
              className={`flex min-w-0 flex-1 flex-col gap-1.5 ${showCloseButton ? "pr-6" : ""}`}
            >
              <div className="flex items-center gap-1.5">
                <p className="truncate font-semibold text-sm">
                  {linkPreview.title}
                </p>
              </div>
              <p className="line-clamp-1 text-muted-foreground text-xs">
                {linkPreview.description}
              </p>
              <p className="truncate text-muted-foreground text-xs">
                {linkPreview.url}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
