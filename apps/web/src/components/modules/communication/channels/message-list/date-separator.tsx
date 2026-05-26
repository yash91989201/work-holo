import { Badge } from "@work-holo/ui/components/badge";
import { Separator } from "@work-holo/ui/components/separator";

interface DateSeparatorProps {
  displayDate: string;
}

export function DateSeparator({ displayDate }: DateSeparatorProps) {
  return (
    <div className="relative flex items-center justify-center py-4">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      <div className="relative bg-background px-2">
        <Badge className="uppercase tracking-wide" variant="secondary">
          {displayDate}
        </Badge>
      </div>
    </div>
  );
}
