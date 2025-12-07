import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
