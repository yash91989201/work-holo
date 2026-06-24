import { Loader2 } from "lucide-react";

export function CallConnecting() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
      <p className="text-sm">Connecting…</p>
    </div>
  );
}
