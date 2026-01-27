import type { AttendanceAnalyticsOutput } from "@work-holo/api/lib/schemas/attendance";
import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import type { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type AttendanceAnalytics = z.infer<typeof AttendanceAnalyticsOutput>;

type Props = {
  dailyTrends: AttendanceAnalytics["dailyTrends"];
};

const chartConfig = {
  hours: {
    label: "Hours worked",
    color: "hsl(217, 91%, 60%)",
  },
  breaks: {
    label: "Breaks",
    color: "hsl(12, 86%, 63%)",
  },
} satisfies ChartConfig;

export function AttendanceTrendChart({ dailyTrends }: Props) {
  const hasDays = dailyTrends.length > 0;

  const data = dailyTrends.map((item) => ({
    label: format(new Date(item.date), "MM/dd"),
    hours: item.totalHours ?? 0,
    breaks: item.breakMinutes ? Number(item.breakMinutes) / 60 : 0,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-base">
          Productivity trend
          <span className="text-muted-foreground text-xs">Viewed by day</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {hasDays ? (
          <ChartContainer config={chartConfig}>
            <AreaChart accessibilityLayer data={data}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />

              <XAxis
                axisLine={false}
                dataKey="label"
                tickLine={false}
                tickMargin={8}
              />

              <YAxis
                axisLine={false}
                tickFormatter={(value: number) => `${value}h`}
                tickLine={false}
                width={40}
              />

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelClassName="font-medium"
                    labelFormatter={(label) => `Day ${label}`}
                  />
                }
                cursor={{ strokeDasharray: "4 4" }}
              />

              <Area
                activeDot={{ r: 3 }}
                dataKey="hours"
                fill="var(--color-hours)"
                fillOpacity={0.12}
                stroke="var(--color-hours)"
                strokeWidth={2}
                type="monotone"
              />

              <Area
                activeDot={{ r: 3 }}
                dataKey="breaks"
                fill="var(--color-breaks)"
                fillOpacity={0.08}
                stroke="var(--color-breaks)"
                strokeWidth={2}
                type="monotone"
              />

              <ReferenceLine
                label={{
                  value: "Target 8h",
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
                stroke="hsl(0, 0%, 65%)"
                strokeDasharray="5 5"
                y={8}
              />

              <ChartLegend
                content={<ChartLegendContent payload={data} />}
                verticalAlign="bottom"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex h-65 flex-col justify-center rounded-lg border bg-muted/40 p-6 text-center">
      <p className="font-medium text-sm">No data available</p>
      <p className="mt-1 text-muted-foreground text-sm">
        No working hours recorded for this range. Try a different timeframe or
        start logging attendance to see trends.
      </p>
    </div>
  );
}
