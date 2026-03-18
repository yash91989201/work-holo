import { IconCalendar } from "@tabler/icons-react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useCurrentTime } from "@/hooks/use-current-time";

export function Greeting() {
  const { user } = useAuthedSession();
  const { formattedDate, timeOfDay } = useCurrentTime();

  return (
    <div className="space-y-1">
      <h1 className="font-bold text-3xl tracking-tight">
        {timeOfDay.greeting}, {user.name}!
      </h1>
      <p className="flex items-center gap-2 text-muted-foreground text-sm">
        <IconCalendar className="h-4 w-4" />
        {formattedDate}
      </p>
    </div>
  );
}
