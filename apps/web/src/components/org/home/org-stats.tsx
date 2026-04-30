import {
  IconActivity,
  IconBuilding,
  IconHash,
  IconUserCheck,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@work-holo/ui/components/card";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { queryUtils } from "@/utils/orpc";

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string | number;
}

function StatCard({ stat }: { stat: StatItem }) {
  const Icon = stat.icon;

  return (
    <Card variant="neumorphic">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
            <Icon className={`h-5 w-5 ${stat.iconColor}`} />
          </div>
        </div>
        <div>
          <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
            {stat.title}
          </p>
          <p className="mt-1 font-bold text-3xl tracking-tight">{stat.value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrgStats() {
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const endDate = new Date();

  const { data: analytics } = useSuspenseQuery(
    queryUtils.attendance.analytics.getAnalytics.queryOptions({
      startDate,
      endDate,
    })
  );

  const { data: teamData } = useSuspenseQuery(
    queryUtils.org.dashboard.getTeamCount.queryOptions({})
  );

  const { data: channelData } = useSuspenseQuery(
    queryUtils.communication.channel.listOwn.queryOptions({})
  );

  const stats: StatItem[] = [
    {
      title: "ATTENDANCE RATE",
      value: `${analytics.summary.attendanceRate.toFixed(1)}%`,
      icon: IconUserCheck,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "AVG. HOURS/DAY",
      value: `${analytics.summary.averageDailyHours.toFixed(1)}h`,
      icon: IconActivity,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "TOTAL TEAMS",
      value: teamData,
      icon: IconBuilding,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "ACTIVE CHANNELS",
      value: channelData.channels.length,
      icon: IconHash,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}

export function OrgStatsSkeleton() {
  const stats: Omit<StatItem, "value">[] = [
    {
      title: "ATTENDANCE RATE",
      icon: IconUserCheck,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "AVG. HOURS/DAY",
      icon: IconActivity,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "TOTAL TEAMS",
      icon: IconBuilding,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "ACTIVE CHANNELS",
      icon: IconHash,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} variant="neumorphic">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div>
                <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </p>
                <Skeleton className="mt-1 h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

OrgStats.Fallback = OrgStatsSkeleton;
