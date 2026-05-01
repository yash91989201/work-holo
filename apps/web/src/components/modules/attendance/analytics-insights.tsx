import {
  IconBolt,
  IconFlame,
  IconMoonFilled,
  IconSparkles,
  IconSunFilled,
  IconTrophy,
} from "@tabler/icons-react";
import type { AttendanceAnalyticsOutput } from "@work-holo/api/lib/schemas/attendance";
import { Badge } from "@work-holo/ui/components/badge";
import { Card } from "@work-holo/ui/components/card";
import type { z } from "zod";

type AttendanceAnalytics = z.infer<typeof AttendanceAnalyticsOutput>;

type Props = {
  punctuality: AttendanceAnalytics["punctuality"];
  streaks: AttendanceAnalytics["streaks"];
  summary: AttendanceAnalytics["summary"];
};

export function AttendanceInsights({ punctuality, streaks, summary }: Props) {
  const punctualityRows = [
    {
      label: "Average check-in",
      value: punctuality.averageCheckInTime ?? "—",
      icon: <IconSunFilled className="h-5 w-5 text-amber-500" />,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Average check-out",
      value: punctuality.averageCheckOutTime ?? "—",
      icon: <IconMoonFilled className="h-5 w-5 text-indigo-500" />,
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      label: "Earliest check-in",
      value: punctuality.earliestCheckIn
        ? new Date(punctuality.earliestCheckIn).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—",
      icon: <IconBolt className="h-5 w-5 text-sky-500" />,
      iconBg: "bg-sky-100 dark:bg-sky-900/30",
    },
  ];

  return (
    <Card className="rounded-2xl p-6" variant="neumorphic">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-2.5 dark:bg-violet-900/30">
            <IconSparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Insights</h3>
            <p className="text-muted-foreground text-sm">
              Punctuality and streaks from your history
            </p>
          </div>
        </div>
        <Badge className="gap-1.5" variant="outline">
          <IconSparkles className="h-3.5 w-3.5" />
          Personalized
        </Badge>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {/* Punctuality Section */}
        <div>
          <div className="mb-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Punctuality
          </div>
          <div className="space-y-3">
            {punctualityRows.map((row) => (
              <div
                className="flex items-center justify-between rounded-xl bg-white/70 p-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-white/5 dark:shadow-none"
                key={row.label}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2 ${row.iconBg}`}>
                    {row.icon}
                  </div>
                  <span className="text-sm">{row.label}</span>
                </div>
                <span className="font-semibold text-sm tabular-nums">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reliability Section */}
        <div>
          <div className="mb-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Reliability
          </div>
          <div className="space-y-2.5">
            {/* Current Streak */}
            <div className="flex items-center justify-between rounded-xl bg-white/70 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-white/5 dark:shadow-none">
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wide">
                  Current Streak
                </div>
                <div className="font-bold text-2xl">
                  {streaks.currentStreak} Days
                </div>
              </div>
              <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <IconFlame className="h-5 w-5 text-emerald-600" />
              </div>
            </div>

            {/* Best Streak */}
            <div className="flex items-center justify-between rounded-xl bg-white/70 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-white/5 dark:shadow-none">
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wide">
                  Best Streak
                </div>
                <div className="font-bold text-2xl">
                  {streaks.longestStreak} Days
                </div>
              </div>
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
                <IconTrophy className="h-5 w-5 text-amber-600" />
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-white/70 p-2.5 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-white/5 dark:shadow-none">
                <div className="text-muted-foreground text-xs uppercase tracking-wide">
                  Total Tracked
                </div>
                <div className="font-bold text-xl">{summary.totalDays}</div>
              </div>
              <div className="rounded-xl bg-white/70 p-2.5 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-white/5 dark:shadow-none">
                <div className="text-muted-foreground text-xs uppercase tracking-wide">
                  Late Arrivals
                </div>
                <div className="font-bold text-xl">{summary.lateDays}</div>
              </div>
              <div className="rounded-xl bg-white/70 p-2.5 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-white/5 dark:shadow-none">
                <div className="text-muted-foreground text-xs uppercase tracking-wide">
                  Sick Days
                </div>
                <div className="font-bold text-xl">{summary.excusedDays}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
