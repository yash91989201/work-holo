import { Badge } from "@work-holo/ui/components/badge";
import { Separator } from "@work-holo/ui/components/separator";

export function NewMessagesSeparator() {
  return (
    <div className="relative flex items-center justify-center py-4">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full border-red-500/30" />
      </div>
      <div className="relative bg-background px-2">
        <Badge
          className="border-red-500/30 bg-red-500/10 text-red-600 uppercase tracking-wide dark:text-red-400"
          variant="secondary"
        >
          New Messages
        </Badge>
      </div>
    </div>
  );
}
