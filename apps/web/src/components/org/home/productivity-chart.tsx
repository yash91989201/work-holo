import { IconAdjustmentsHorizontal, IconDownload } from "@tabler/icons-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { day: "MON", productivity: 68 },
  { day: "TUE", productivity: 82 },
  { day: "WED", productivity: 60 },
  { day: "THU", productivity: 88 },
  { day: "FRI", productivity: 78 },
  { day: "SAT", productivity: 72 },
  { day: "SUN", productivity: 35 },
];

const chartConfig = {
  productivity: {
    label: "Productivity",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ProductivityChart() {
  return (
    <Card className="gap-4 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-lg">Productivity Trend</h3>
          <p className="text-muted-foreground text-sm">
            Cross-department output vs target
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
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
          />
          <ChartTooltip
            content={<ChartTooltipContent hideLabel />}
            cursor={false}
          />
          <Bar
            dataKey="productivity"
            fill="var(--color-productivity)"
            maxBarSize={48}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
