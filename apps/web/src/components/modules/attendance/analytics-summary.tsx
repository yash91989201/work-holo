import {
  IconAward,
  IconBolt,
  IconClockHour4Filled,
  IconCoffee,
  IconDeviceLaptop,
  IconFlame,
} from "@tabler/icons-react";
import type { AttendanceAnalyticsOutput } from "@work-holo/api/lib/schemas/attendance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import { Progress } from "@work-holo/ui/components/progress";
import type React from "react";
import type { z } from "zod";
import { cn } from "@/lib/utils";

type AttendanceAnalytics = z.infer<typeof AttendanceAnalyticsOutput>;

type Props = {
  summary: AttendanceAnalytics["summary"];
  punctuality: AttendanceAnalytics["punctuality"];
};

const metrics = [
  {
    key: "attendance",
    title: "Attendance rate",
    icon: IconAward,
    accent: "text-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/60",
  },
  {
    key: "hours",
    title: "Avg. hours / day",
    icon: IconClockHour4Filled,
    accent: "text-sky-600",
    iconBg: "bg-sky-100 dark:bg-sky-950/60",
  },
  {
    key: "overtime",
    title: "Overtime",
    icon: IconFlame,
    accent: "text-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-950/60",
  },
  {
    key: "breaks",
    title: "Avg. break",
    icon: IconCoffee,
    accent: "text-rose-600",
    iconBg: "bg-rose-100 dark:bg-rose-950/60",
  },
] as const;

export function AttendanceAnalyticsSummary({ summary, punctuality }: Props) {
  const items = [
    {
      key: metrics[0].key,
      title: metrics[0].title,
      icon: metrics[0].icon,
      accent: metrics[0].accent,
      iconBg: metrics[0].iconBg,
      primary: `${summary.attendanceRate.toFixed(1)}%`,
      hint: `${summary.presentDays + summary.excusedDays} of ${
        summary.totalDays
      } days attended`,
      progress: summary.attendanceRate,
    },
    {
      key: metrics[1].key,
      title: metrics[1].title,
      icon: metrics[1].icon,
      accent: metrics[1].accent,
      iconBg: metrics[1].iconBg,
      primary: `${summary.averageDailyHours.toFixed(1)}h`,
      hint: `${summary.totalHours.toFixed(1)}h this period`,
    },
    {
      key: metrics[2].key,
      title: metrics[2].title,
      icon: metrics[2].icon,
      accent: metrics[2].accent,
      iconBg: metrics[2].iconBg,
      primary: `${summary.overtimeHours.toFixed(1)}h`,
      hint: "Extra hours logged",
    },
    {
      key: metrics[3].key,
      title: metrics[3].title,
      icon: metrics[3].icon,
      accent: metrics[3].accent,
      iconBg: metrics[3].iconBg,
      primary: `${Math.round(summary.averageBreakMinutes)}m`,
      hint: "Average break per shift",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card className="h-full" key={item.key} variant="neumorphic">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="font-medium text-muted-foreground text-xs uppercase leading-relaxed tracking-widest">
                {item.title}
              </CardTitle>
              <span
                className={cn(
                  "shrink-0 rounded-xl p-2",
                  item.iconBg,
                  item.accent
                )}
              >
                <item.icon className="h-4 w-4" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-4xl tabular-nums tracking-tight">
                  {item.primary}
                </span>
              </div>
              {item.key === "hours" && punctuality.averageCheckInTime ? (
                <p className="text-muted-foreground text-xs">
                  Avg check-in {punctuality.averageCheckInTime}
                </p>
              ) : null}
              {item.key === "overtime" && punctuality.averageCheckOutTime ? (
                <p className="text-muted-foreground text-xs">
                  Avg check-out {punctuality.averageCheckOutTime}
                </p>
              ) : null}
              <p className="text-muted-foreground text-xs">{item.hint}</p>
            </div>
            {item.key === "attendance" ? (
              <div className="space-y-1">
                <Progress
                  className="h-1.5"
                  max={100}
                  value={summary.attendanceRate}
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2 xl:col-span-4" variant="neumorphic">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-semibold text-base">
              Participation Highlights
            </CardTitle>
            <div className="rounded-xl bg-primary/10 p-2">
              <IconBolt className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <Insight
            color="bg-sky-500"
            icon={<IconDeviceLaptop className="h-4 w-4 text-white" />}
            label="Remote days"
            value={summary.remoteDays}
          />
          <Insight
            color="bg-amber-500"
            icon={<IconClockHour4Filled className="h-4 w-4 text-white" />}
            label="Late arrivals"
            value={summary.lateDays}
          />
          <Insight
            color="bg-emerald-500"
            icon={<IconAward className="h-4 w-4 text-white" />}
            label="Excused days"
            value={summary.excusedDays}
          />
          <Insight
            color="bg-red-500"
            icon={<IconFlame className="h-4 w-4 text-white" />}
            label="Absences"
            value={summary.absentDays}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Insight({
  label,
  value,
  icon,
  color = "bg-gray-800",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/30 bg-muted/20 px-4 py-4 transition-colors hover:bg-muted/30">
      <div className={cn("shrink-0 rounded-xl p-2.5", color)}>{icon}</div>
      <div className="min-w-0">
        <div className="font-bold text-2xl tabular-nums leading-none">
          {value}
        </div>
        <div className="mt-1 font-medium text-[10px] text-muted-foreground uppercase tracking-widest">
          {label}
        </div>
      </div>
    </div>
  );
}
