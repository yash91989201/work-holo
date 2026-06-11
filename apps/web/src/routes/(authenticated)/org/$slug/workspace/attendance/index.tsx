import { IconCalendarWeekFilled } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@work-holo/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@work-holo/ui/components/select";
import { format, subDays } from "date-fns";
import { Suspense, useMemo, useState } from "react";
import { AttendanceAnalyticsSummary } from "@/components/modules/attendance/analytics-summary";
import { MarkAttendance } from "@/components/modules/attendance/mark-attendance";
import { WorkBlocksList } from "@/components/modules/attendance/work-blocks-list";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/workspace/attendance/"
)({
  staticData: { crumb: "Attendance" },
  component: RouteComponent,
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

function RouteComponent() {
  const [range, setRange] = useState<RangeOptionValue>(RANGE_OPTIONS[0].value);

  const input = useMemo(() => rangeToInput(range), [range]);

  const { data: analytics } = useSuspenseQuery(
    queryUtils.attendance.analytics.getAnalytics.queryOptions({
      input,
    })
  );

  const rangeItems = RANGE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <section className="page-gradient space-y-6 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl">Attendance</h1>
          <p className="text-muted-foreground text-sm">
            Track your attendance quality, punctuality, and working patterns.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select
            items={rangeItems}
            onValueChange={(value) => setRange(value as RangeOptionValue)}
            value={range}
          >
            <SelectTrigger>
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
            <IconCalendarWeekFilled />
            {format(new Date(analytics.range.startDate), "MMM d")} -{" "}
            {format(new Date(analytics.range.endDate), "MMM d")}
          </Badge>
        </div>
      </div>

      <div className="flex gap-12 p-6">
        <Suspense fallback={<MarkAttendance.Fallback />}>
          <MarkAttendance />
        </Suspense>

        <Suspense fallback={<WorkBlocksList.Fallback />}>
          <WorkBlocksList />
        </Suspense>
      </div>

      <AttendanceAnalyticsSummary
        punctuality={analytics.punctuality}
        summary={analytics.summary}
      />
    </section>
  );
}
