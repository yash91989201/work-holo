import { IconAdjustmentsHorizontal, IconDownload } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@work-holo/ui/components/button";
import { Card } from "@work-holo/ui/components/card";
import type { ChartConfig } from "@work-holo/ui/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@work-holo/ui/components/chart";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { queryUtils } from "@/utils/orpc";

const chartConfig = {
  hours: {
    label: "Hours Worked",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ProductivityChart() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);

  const { data: analytics } = useSuspenseQuery(
    queryUtils.attendance.analytics.getAnalytics.queryOptions({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    })
  );

  const chartData = analytics.dailyTrends.map(
    (trend: {
      date: string;
      status: string;
      totalHours: number | null;
      breakMinutes: number | null;
      checkInTime: string | null;
      checkOutTime: string | null;
    }) => ({
      day: new Date(trend.date)
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase(),
      hours: trend.totalHours ?? 0,
    })
  );

  if (chartData.length === 0) {
    return (
      <Card className="gap-4 rounded-2xl p-6" variant="neumorphic">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-semibold text-lg">Attendance Hours</h3>
            <p className="text-muted-foreground text-sm">
              Daily hours worked — last 7 days
            </p>
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
        <div className="flex h-[220px] items-center justify-center text-muted-foreground text-sm sm:h-[280px]">
          No attendance data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="gap-4 rounded-2xl p-6" variant="neumorphic">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-lg">Attendance Hours</h3>
          <p className="text-muted-foreground text-sm">
            Daily hours worked — last 7 days
          </p>
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
      <ChartContainer
        className="h-[220px] w-full sm:h-[280px]"
        config={chartConfig}
      >
        <BarChart
          data={chartData}
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
            content={<ChartTooltipContent hideLabel />}
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
    </Card>
  );
}

export function ProductivityChartSkeleton() {
  return (
    <Card className="gap-4 rounded-2xl p-6" variant="neumorphic">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-lg">Attendance Hours</h3>
          <p className="text-muted-foreground text-sm">
            Daily hours worked — last 7 days
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            className="gap-2 rounded-lg"
            disabled
            size="sm"
            variant="outline"
          >
            <IconAdjustmentsHorizontal className="h-4 w-4" />
            <span className="xs:inline hidden">Filter</span>
          </Button>
          <Button
            className="gap-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
            disabled
            size="sm"
          >
            <IconDownload className="h-4 w-4" />
            <span className="xs:inline hidden">Export</span>
          </Button>
        </div>
      </div>

      <Skeleton className="h-[220px] w-full rounded-xl sm:h-[280px]" />
    </Card>
  );
}

ProductivityChart.Fallback = ProductivityChartSkeleton;
