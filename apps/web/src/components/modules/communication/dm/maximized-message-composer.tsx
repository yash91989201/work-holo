import { IconX } from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@work-holo/ui/components/dialog";
import { useEffect, useState } from "react";
import { useDmMessageMutations } from "@/hooks/communications/dm/use-dm-message-mutations";
import { useMaximizedDmMessageComposer } from "@/stores/dm-store";
import { DmMessageComposer } from "./message-composer";

export function MaximizedDmMessageComposer() {
  const {
    isOpen,
    content,
    messageId,
    parentMessageId,
    onComplete,
    closeMaximizedMessageComposer,
  } = useMaximizedDmMessageComposer();
  const { updateMessage } = useDmMessageMutations();

  const [localContent, setLocalContent] = useState(content || "");

  useEffect(() => {
    setLocalContent(content || "");
  }, [content, isOpen]);

  const handleClose = () => {
    onComplete?.({ action: "cancel", content: localContent });
    closeMaximizedMessageComposer();
  };

  const handleSubmit = () => {
    if (!localContent.trim()) return;

    if (messageId) {
      // Editing existing message
      updateMessage({
        message: {
          messageId,
          content: localContent.trim(),
        },
      });
    }

    onComplete?.({ action: "submit" });
    closeMaximizedMessageComposer();
  };

  if (!isOpen) return null;

  return (
    <Dialog onOpenChange={(open) => !open && handleClose()} open={isOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {messageId
              ? "Edit Message"
              : parentMessageId
                ? "Reply in Thread"
                : "New Message"}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-75">
          <DmMessageComposer
            conversationId="" // This is handled by the parent
            initialContent={localContent}
            onMaximize={() => {}} // No-op since we're already maximized
            onSendSuccess={handleSubmit}
            placeholder={
              parentMessageId ? "Reply in thread..." : "Type your message..."
            }
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={handleClose} variant="outline">
            <IconX className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button disabled={!localContent.trim()} onClick={handleSubmit}>
            {messageId ? "Save Changes" : "Send Message"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
