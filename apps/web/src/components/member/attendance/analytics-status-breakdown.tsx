import type { AttendanceAnalyticsOutput } from "@work-holo/api/lib/schemas/attendance";
import { Cell, Pie, PieChart } from "recharts";
import type { z } from "zod";
import { Card } from "@/components/ui/card";

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
    <Card className="flex h-full flex-col rounded-2xl bg-gradient-to-br from-slate-50 via-white to-violet-50/50 p-6 shadow-sm dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/30">
      {/* Title */}
      <h3 className="mb-6 text-center font-semibold text-lg">
        Status Breakdown
      </h3>

      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground text-sm">
            No attendance data available for this period.
          </p>
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
              <span className="font-bold text-2xl text-emerald-500">
                {dominantPercentage}%
              </span>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                {dominantStatus ? formatStatus(dominantStatus.status) : ""}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
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
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800/50">
      <span
        aria-hidden
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <div>
        <div className="text-muted-foreground text-xs">{label}</div>
        <div className="font-semibold">
          {count} Day{count !== 1 ? "s" : ""}
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
