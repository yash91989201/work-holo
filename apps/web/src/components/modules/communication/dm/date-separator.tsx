interface DmDateSeparatorProps {
  displayDate: string;
}

export function DmDateSeparator({ displayDate }: DmDateSeparatorProps) {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="rounded-full border bg-background/80 px-4 py-1.5 font-medium text-muted-foreground text-xs shadow-sm backdrop-blur-sm">
        {displayDate}
      </div>
    </div>
  );
}
