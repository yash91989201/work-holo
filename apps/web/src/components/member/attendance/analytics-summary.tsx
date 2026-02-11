import type { AttendanceAnalyticsOutput } from "@work-holo/api/lib/schemas/attendance";
import { Award, Clock3, Coffee, Flame, Laptop, Zap } from "lucide-react";
import type React from "react";
import type { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    icon: Award,
    accent: "text-emerald-600",
  },
  {
    key: "hours",
    title: "Avg. hours / day",
    icon: Clock3,
    accent: "text-sky-600",
  },
  {
    key: "overtime",
    title: "Overtime",
    icon: Flame,
    accent: "text-amber-600",
  },
  {
    key: "breaks",
    title: "Avg. break",
    icon: Coffee,
    accent: "text-rose-600",
  },
] as const;

export function AttendanceAnalyticsSummary({ summary, punctuality }: Props) {
  const items = [
    {
      key: metrics[0].key,
      title: metrics[0].title,
      icon: metrics[0].icon,
      accent: metrics[0].accent,
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
      primary: `${summary.averageDailyHours.toFixed(1)}h`,
      hint: `${summary.totalHours.toFixed(1)}h this period`,
    },
    {
      key: metrics[2].key,
      title: metrics[2].title,
      icon: metrics[2].icon,
      accent: metrics[2].accent,
      primary: `${summary.overtimeHours.toFixed(1)}h`,
      hint: "Extra hours logged",
    },
    {
      key: metrics[3].key,
      title: metrics[3].title,
      icon: metrics[3].icon,
      accent: metrics[3].accent,
      primary: `${Math.round(summary.averageBreakMinutes)}m`,
      hint: "Average break per shift",
    },
  ];

  return (
    <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-4 p-6">
      {items.map((item) => (
        <Card className="h-full rounded-3xl border-white border bg-background shadow-[-4px_-4px_12px_rgba(255,255,255,0.8),4px_4px_12px_rgba(0,0,0,0.04)]" key={item.key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.title}</CardTitle>
            <span
              className={cn(
                "rounded-xl bg-muted p-2",
                item.accent
              )}
            >
              <item.icon className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-3xl">{item.primary}</span>
              {item.key === "hours" && punctuality.averageCheckInTime ? (
                <div className="text-muted-foreground text-xs">
                  Avg check-in {punctuality.averageCheckInTime}
                </div>
              ) : null}
              {item.key === "overtime" && punctuality.averageCheckOutTime ? (
                <div className="text-muted-foreground text-xs">
                  Avg check-out {punctuality.averageCheckOutTime}
                </div>
              ) : null}
            </div>
            <div className="text-muted-foreground text-xs">{item.hint}</div>
            {item.key === "attendance" ? (
              <Progress
                className="h-2"
                max={100}
                value={summary.attendanceRate}
              />
            ) : null}
          </CardContent>
        </Card>
      ))}

      <Card className="rounded-3xl border-white border bg-background shadow-[-4px_-4px_12px_rgba(255,255,255,0.8),4px_4px_12px_rgba(0,0,0,0.04)] md:col-span-2 xl:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Participation Highlights</CardTitle>
          <Zap className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <Insight
            icon={<Laptop className="h-4 w-4 text-white" />}
            label="Remote days"
            value={summary.remoteDays}
          />
          <Insight
            icon={<Clock3 className="h-4 w-4 text-white" />}
            label="Late arrivals"
            value={summary.lateDays}
          />
          <Insight
            icon={<Award className="h-4 w-4 text-white" />}
            label="Excused days"
            value={summary.excusedDays}
          />
          <Insight
            icon={<Flame className="h-4 w-4 text-white" />}
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
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-muted/30 px-4 py-3">
      <div className="rounded-xl bg-gray-800 p-2.5">{icon}</div>
      <div>
        <div className="font-bold text-lg leading-tight">{value}</div>
        <div className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}
