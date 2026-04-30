import { IconCalendar } from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";
import { Calendar } from "@work-holo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@work-holo/ui/components/popover";
import { cn } from "@/lib/utils";

interface DmDateFilterProps {
  maxDate?: Date;
  minDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  selectedDate?: Date;
}

export function DmDateFilter({
  maxDate,
  minDate,
  onDateSelect,
  selectedDate,
}: DmDateFilterProps) {
  return (
    <div className="absolute inset-x-0 top-4 z-30 flex justify-center">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              className={cn(
                "gap-2 rounded-full bg-background/80 shadow-sm backdrop-blur-sm",
                selectedDate && "bg-primary text-primary-foreground"
              )}
              size="sm"
              variant="outline"
            >
              <IconCalendar className="h-4 w-4" />
              <span className="hidden sm:inline">
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : "Jump to date"}
              </span>
            </Button>
          }
        />
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            disabled={(date) =>
              Boolean(
                (minDate && date < minDate) || (maxDate && date > maxDate)
              )
            }
            mode="single"
            onSelect={onDateSelect}
            selected={selectedDate}
          />
          {selectedDate && (
            <div className="border-t p-2">
              <Button
                className="w-full"
                onClick={() => onDateSelect(undefined)}
                size="sm"
                variant="ghost"
              >
                Clear filter
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
