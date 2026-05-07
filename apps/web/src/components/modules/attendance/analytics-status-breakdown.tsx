import { IconChartDonut } from "@tabler/icons-react";
import type { AttendanceAnalyticsOutput } from "@work-holo/api/lib/schemas/attendance";
import { Card } from "@work-holo/ui/components/card";
import { Cell, Pie, PieChart } from "recharts";
import type { z } from "zod";

type AttendanceAnalytics = z.infer<typeof AttendanceAnalyticsOutput>;

type Props = {
  statusBreakdown: AttendanceAnalytics["statusBreakdown"];
  summary: AttendanceAnalytics["summary"];
};

const statusColors: Record<string, string> = {
  present: "#22c55e",
  late: "#f97316",
  partial: "#0ea5e9",
  work_from_home: "#a855f7",
  excused: "#06b6d4",
  holiday: "#94a3b8",
  sick_leave: "#ef4444",
  absent: "#1f2937",
};

export function AttendanceStatusBreakdown({ statusBreakdown, summary }: Props) {
  const total = summary.totalDays || 1;
  const data = statusBreakdown.filter((item) => item.count > 0);

  // Find the dominant status for center display
  const dominantStatus =
    data.length > 0 ? data.reduce((a, b) => (a.count > b.count ? a : b)) : null;
  const dominantPercentage = dominantStatus
    ? Math.round((dominantStatus.count / total) * 100)
    : 0;

  // Get main 4 statuses to display
  const displayStatuses = ["present", "late", "absent", "holiday"];
  const statsToShow = displayStatuses.map((status) => {
    const found = statusBreakdown.find((s) => s.status === status);
    return {
      status,
      count: found?.count ?? 0,
      color: statusColors[status] ?? "#334155",
    };
  });

  return (
    <Card className="flex h-full flex-col rounded-2xl p-6" variant="neumorphic">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-sky-100 p-2.5 dark:bg-sky-900/30">
          <IconChartDonut className="h-5 w-5 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Status Breakdown</h3>
          <p className="text-muted-foreground text-sm">
            Distribution across this period
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl p-6 text-center">
          <div className="rounded-2xl bg-sky-100/60 p-4 dark:bg-sky-900/20">
            <IconChartDonut className="h-8 w-8 text-sky-400" />
          </div>
          <div>
            <p className="font-medium text-sm">No data yet</p>
            <p className="mt-0.5 text-muted-foreground text-sm">
              No attendance records found for this period.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-6">
          {/* Donut Chart with Center Label */}
          <div className="relative flex items-center justify-center">
            <PieChart height={180} width={180}>
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey="count"
                endAngle={-270}
                innerRadius={60}
                nameKey="status"
                outerRadius={80}
                paddingAngle={2}
                startAngle={90}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell
                    fill={statusColors[entry.status] ?? "#334155"}
                    key={entry.status}
                  />
                ))}
              </Pie>
            </PieChart>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-bold text-3xl text-emerald-500">
                {dominantPercentage}%
              </span>
              <span className="mt-0.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                {dominantStatus ? formatStatus(dominantStatus.status) : ""}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {statsToShow.map((stat) => (
              <StatusCard
                color={stat.color}
                count={stat.count}
                key={stat.status}
                label={formatStatus(stat.status)}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function StatusCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white/70 p-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:bg-white/5 dark:shadow-none dark:hover:bg-white/8">
      <span
        aria-hidden
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <div className="min-w-0">
        <div className="truncate text-muted-foreground text-xs">{label}</div>
        <div className="font-semibold text-sm">
          {count} Day{count === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}
