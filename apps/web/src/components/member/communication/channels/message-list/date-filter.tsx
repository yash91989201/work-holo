import { CalendarIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateFilterProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DateFilter({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
}: DateFilterProps) {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onDateSelect(date);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateSelect(undefined);
  };

  return (
    <div className="absolute inset-x-0 top-4 z-30 flex justify-center">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "gap-2 rounded-full shadow-lg",
              selectedDate && "pr-2"
            )}
            variant="secondary"
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="text-sm">
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Jump to date"}
            </span>
            {selectedDate && (
              <Button
                className="ml-1 h-5 w-5 rounded-full p-0 hover:bg-muted"
                onClick={handleClear}
                size="icon"
                variant="ghost"
              >
                <XIcon className="h-3 w-3" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-auto p-0">
          <Calendar
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            mode="single"
            onSelect={handleDateSelect}
            selected={selectedDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
