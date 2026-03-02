import { IconMessageCircle } from "@tabler/icons-react";

export function DmEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <IconMessageCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-foreground">No messages yet</h3>
        <p className="max-w-xs text-muted-foreground text-sm">
          Start the conversation by sending a message below.
        </p>
      </div>
    </div>
  );
}
