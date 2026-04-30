import {
  IconBriefcase,
  IconClockHour4Filled,
  IconCoffee,
  IconLogout,
  IconPlayerPauseFilled,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { WorkBlockType } from "@work-holo/db/lib/types";
import { Badge } from "@work-holo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { formatDuration } from "@/utils";
import { queryUtils } from "@/utils/orpc";

const formatTime = (date: Date | string) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const endReasonIcons: Record<string, React.ReactNode> = {
  manual: <IconPlayerPauseFilled className="h-4 w-4 text-muted-foreground" />,
  break: <IconCoffee className="h-4 w-4 text-yellow-500" />,
  punch_out: <IconLogout className="h-4 w-4 text-red-500" />,
  idle_timeout: <IconClockHour4Filled className="h-4 w-4 text-gray-500" />,
};

const endReasonLabels: Record<string, string> = {
  manual: "Paused",
  break: "On Break",
  punch_out: "Punched Out",
  idle_timeout: "Idle",
};

const endReasonColors: Record<string, string> = {
  manual: "text-muted-foreground bg-muted/60",
  break:
    "text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/40",
  punch_out: "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/40",
  idle_timeout:
    "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800/60",
};

const WorkBlockItem = ({
  block,
  sessionNumber,
  isLast,
}: {
  block: WorkBlockType;
  sessionNumber: number;
  isLast: boolean;
}) => {
  const isOngoing = !block.endedAt;
  const reason = block.endReason;

  let iconComponent: React.ReactNode;

  if (isOngoing) {
    iconComponent =
      reason === null ? (
        <IconBriefcase className="h-4 w-4 text-green-500" />
      ) : (
        endReasonIcons[reason as string] || (
          <IconClockHour4Filled className="h-4 w-4" />
        )
      );
  } else {
    iconComponent =
      reason === null ? (
        <IconClockHour4Filled className="h-4 w-4" />
      ) : (
        endReasonIcons[reason as string] || (
          <IconClockHour4Filled className="h-4 w-4" />
        )
      );
  }

  return (
    <div className="relative flex items-start gap-4">
      {!isLast && (
        <div className="absolute top-8 left-4 h-full w-px bg-linear-to-b from-border to-transparent" />
      )}

      <div className="z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card shadow-sm">
        {iconComponent}
      </div>

      <div className="min-w-0 grow pb-8">
        <div className="rounded-xl border border-border/30 bg-muted/10 px-4 py-3 transition-colors hover:bg-muted/20">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">Session #{sessionNumber}</p>
              {isOngoing && (
                <Badge
                  className="animate-pulse px-1.5 py-0 text-[10px]"
                  variant="destructive"
                >
                  Live
                </Badge>
              )}
            </div>
            <p className="shrink-0 font-bold text-base tabular-nums">
              {formatDuration(block.durationMinutes)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-muted-foreground text-xs tabular-nums">
              {formatTime(block.startedAt)} →{" "}
              {isOngoing ? "Now" : formatTime(block.endedAt ?? new Date())}
            </p>
            {reason && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-[10px] ${endReasonColors[reason as string] ?? "bg-muted/60 text-muted-foreground"}`}
              >
                {endReasonLabels[reason as string]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function WorkBlocksList() {
  const { data: attendance } = useSuspenseQuery(
    queryUtils.attendance.records.getStatus.queryOptions({})
  );

  const { data: blocks } = useSuspenseQuery(
    queryUtils.attendance.workBlock.list.queryOptions({
      input: {
        attendanceId: attendance?.id ?? "",
      },
      enabled: !!attendance?.id,
    })
  );

  if (!attendance?.checkInTime) {
    return (
      <Card className="w-full" variant="neumorphic">
        <CardContent className="flex flex-col items-center justify-center gap-5 py-14">
          <div className="rounded-2xl bg-linear-to-br from-slate-100 to-slate-50 p-5 dark:from-slate-800/60 dark:to-slate-700/30">
            <IconClockHour4Filled className="h-10 w-10 text-slate-400" />
          </div>
          <div className="space-y-1.5 text-center">
            <h3 className="font-bold text-xl tracking-tight">
              Not checked in yet
            </h3>
            <p className="max-w-xs text-muted-foreground text-sm">
              Punch in to start your work session and see your timeline here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!blocks || blocks.length === 0) {
    return (
      <Card className="w-full" variant="neumorphic">
        <CardContent className="flex flex-col items-center justify-center gap-5 py-14">
          <div className="rounded-2xl bg-linear-to-br from-violet-100 to-violet-50 p-5 dark:from-violet-950/60 dark:to-violet-900/30">
            <IconBriefcase className="h-10 w-10 text-violet-400" />
          </div>
          <div className="space-y-1.5 text-center">
            <h3 className="font-bold text-xl tracking-tight">
              No sessions yet
            </h3>
            <p className="max-w-xs text-muted-foreground text-sm">
              Your work sessions will appear here as you start working.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full" variant="neumorphic">
      <CardHeader>
        <CardTitle>Work Timeline</CardTitle>
        <CardDescription>
          A timeline of your work sessions and breaks for today.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ScrollArea className="h-88 pr-2">
          <div className="relative pt-1">
            {blocks.map((block, index) => (
              <WorkBlockItem
                block={block}
                isLast={index === blocks.length - 1}
                key={block.id}
                sessionNumber={blocks.length - index}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function WorkBlocksListSkeleton() {
  return (
    <Card className="w-full" variant="neumorphic">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="mt-1.5 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-2">
          {[...new Array(3)].map((_, i) => (
            <div className="flex items-start gap-4" key={i.toString()}>
              <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-full" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

WorkBlocksList.Fallback = WorkBlocksListSkeleton;
