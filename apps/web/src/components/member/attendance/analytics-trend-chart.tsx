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
        {!hasDays ? (
          <EmptyState />
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart accessibilityLayer data={data}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />

              <YAxis
                width={40}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => `${value}h`}
              />

              <ChartTooltip
                cursor={{ strokeDasharray: "4 4" }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelClassName="font-medium"
                    labelFormatter={(label) => `Day ${label}`}
                  />
                }
              />

              <Area
                dataKey="hours"
                type="monotone"
                stroke="var(--color-hours)"
                fill="var(--color-hours)"
                fillOpacity={0.12}
                strokeWidth={2}
                activeDot={{ r: 3 }}
              />

              <Area
                dataKey="breaks"
                type="monotone"
                stroke="var(--color-breaks)"
                fill="var(--color-breaks)"
                fillOpacity={0.08}
                strokeWidth={2}
                activeDot={{ r: 3 }}
              />

              <ReferenceLine
                y={8}
                strokeDasharray="5 5"
                stroke="hsl(0, 0%, 65%)"
                label={{
                  value: "Target 8h",
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />

              <ChartLegend
                verticalAlign="bottom"
                content={<ChartLegendContent />}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[260px] flex-col justify-center rounded-lg border bg-muted/40 p-6 text-center">
      <p className="text-sm font-medium">No data available</p>
      <p className="mt-1 text-muted-foreground text-sm">
        No working hours recorded for this range. Try a different timeframe or
        start logging attendance to see trends.
      </p>
    </div>
  );
}
