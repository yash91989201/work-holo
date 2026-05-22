import {
  IconAdjustmentsHorizontal,
  IconChartDonut,
  IconDownload,
} from "@tabler/icons-react";
import type { AttendanceAnalyticsOutput } from "@work-holo/api/lib/schemas/attendance";
import { Button } from "@work-holo/ui/components/button";
import { Card } from "@work-holo/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@work-holo/ui/components/chart";
import { format, getDay } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { z } from "zod";

type AttendanceAnalytics = z.infer<typeof AttendanceAnalyticsOutput>;

type Props = {
  dailyTrends: AttendanceAnalytics["dailyTrends"];
};

const chartConfig = {
  hours: {
    label: "Hours Worked",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function AttendanceTrendChart({ dailyTrends }: Props) {
  const hasDays = dailyTrends.length > 0;

  const data = dailyTrends.map((item) => {
    const date = new Date(item.date);
    return {
      day: dayNames[getDay(date)],
      fullDate: format(date, "MMM d"),
      hours: item.totalHours ?? 0,
    };
  });

  return (
    <Card
      className="flex h-full flex-col gap-4 rounded-2xl p-6"
      variant="neumorphic"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-2.5 dark:bg-violet-900/30">
            <IconChartDonut className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Productivity Trend</h3>
            <p className="text-muted-foreground text-sm">
              Daily hours worked this period
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button className="gap-2 rounded-lg" size="sm" variant="outline">
            <IconAdjustmentsHorizontal className="h-4 w-4" />
            <span className="xs:inline hidden">Filter</span>
          </Button>
          <Button
            className="gap-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
            size="sm"
          >
            <IconDownload className="h-4 w-4" />
            <span className="xs:inline hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Chart */}
      {hasDays ? (
        <ChartContainer
          className="h-[220px] w-full sm:h-[280px]"
          config={chartConfig}
        >
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              className="font-medium text-muted-foreground text-xs tracking-wider"
              dataKey="day"
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              className="text-muted-foreground text-xs"
              tickFormatter={(value) => `${value}h`}
              tickLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value}h`, "Hours Worked"]}
                  labelFormatter={(_label, payload) => {
                    if (payload?.[0]?.payload?.fullDate) {
                      return payload[0].payload.fullDate;
                    }
                    return _label;
                  }}
                />
              }
              cursor={false}
            />
            <Bar
              dataKey="hours"
              fill="var(--color-hours)"
              maxBarSize={48}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      ) : (
        <EmptyState />
      )}
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center gap-3 rounded-xl p-6 text-center sm:h-[280px]">
      <div className="rounded-2xl bg-violet-100/60 p-4 dark:bg-violet-900/20">
        <IconChartDonut className="h-8 w-8 text-violet-400" />
      </div>
      <div>
        <p className="font-medium text-sm">No data available</p>
        <p className="mt-0.5 text-muted-foreground text-sm">
          No working hours recorded for this range.
        </p>
      </div>
    </div>
  );
}
