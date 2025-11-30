import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format, subDays } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { AttendanceInsights } from "@/components/member/attendance/analytics-insights";
import { AttendanceStatusBreakdown } from "@/components/member/attendance/analytics-status-breakdown";
import { AttendanceAnalyticsSummary } from "@/components/member/attendance/analytics-summary";
import { AttendanceTrendChart } from "@/components/member/attendance/analytics-trend-chart";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/(member)/(base-modules)/attendance/analytics"
)({
  beforeLoad: ({ context: { queryClient, queryUtils } }) => {
    queryClient.prefetchQuery(
      queryUtils.member.attendance.getAnalytics.queryOptions({
        input: rangeToInput(RANGE_OPTIONS[0].value),
      })
    );
  },
  component: AnalyticsPage,
});

export const RANGE_OPTIONS = [
  { value: "30", label: "Last 30 days", days: 30 },
  { value: "60", label: "Last 60 days", days: 60 },
  { value: "90", label: "Last 90 days", days: 90 },
] as const;

export type RangeOptionValue = (typeof RANGE_OPTIONS)[number]["value"];

export function rangeToInput(value: RangeOptionValue) {
  const option = RANGE_OPTIONS.find((item) => item.value === value);
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = subDays(endDate, (option?.days ?? 30) - 1);
  startDate.setHours(0, 0, 0, 0);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

function AnalyticsPage() {
  const [range, setRange] = useState<RangeOptionValue>(RANGE_OPTIONS[0].value);

  const input = useMemo(() => rangeToInput(range), [range]);

  const { data: analytics } = useSuspenseQuery(
    queryUtils.member.attendance.getAnalytics.queryOptions({
      input,
    })
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl">Attendance analytics</h1>
          <p className="text-muted-foreground text-sm">
            Track your attendance quality, punctuality, and working patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            onValueChange={(value) => setRange(value as RangeOptionValue)}
            value={range}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge className="gap-2" variant="outline">
            <CalendarDays className="h-4 w-4" />
            {format(new Date(analytics.range.startDate), "MMM d")} -{" "}
            {format(new Date(analytics.range.endDate), "MMM d")}
          </Badge>
        </div>
      </div>

      <AttendanceAnalyticsSummary
        punctuality={analytics.punctuality}
        summary={analytics.summary}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceTrendChart dailyTrends={analytics.dailyTrends} />
        </div>
        <AttendanceStatusBreakdown
          statusBreakdown={analytics.statusBreakdown}
          summary={analytics.summary}
        />
      </div>

      <AttendanceInsights
        punctuality={analytics.punctuality}
        streaks={analytics.streaks}
        summary={analytics.summary}
      />
    </div>
  );
}
