interface DateSeparatorProps {
  displayDate: string;
}

export function DateSeparator({ displayDate }: DateSeparatorProps) {
  return (
    <div className="relative flex items-center justify-center py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-border/40 border-t" />
      </div>
      <div className="relative bg-background px-4">
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          {displayDate}
        </span>
      </div>
    </div>
  );
}
