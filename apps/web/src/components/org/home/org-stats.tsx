import {
  IconActivity,
  IconBuilding,
  IconHash,
  IconUserCheck,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";

interface StatItem {
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string | number;
}
// TODO: Add actual APIs of Attendance Rate, Total teams, Active Channels
const dummyStats: StatItem[] = [
  {
    title: "ATTENDANCE RATE",
    value: "98.4%",
    icon: IconUserCheck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "+2.4%",
    badgeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "AVG. HOURS/DAY",
    value: "7.8h",
    icon: IconActivity,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    badge: "Stable",
    badgeColor: "text-orange-600 bg-orange-50",
  },
  {
    title: "TOTAL TEAMS",
    value: 48,
    icon: IconBuilding,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    badge: "12 New",
    badgeColor: "text-violet-600 bg-violet-50",
  },
  {
    title: "ACTIVE CHANNELS",
    value: 156,
    icon: IconHash,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badge: "Live",
    badgeColor: "text-emerald-600 bg-emerald-50",
  },
];

function StatCard({ stat }: { stat: StatItem }) {
  const Icon = stat.icon;

  return (
    <Card className="gap-4 rounded-t-none rounded-b-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
          <Icon className={`h-5 w-5 ${stat.iconColor}`} />
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 font-semibold text-xs ${stat.badgeColor}`}
        >
          {stat.badge}
        </span>
      </div>
      <div>
        <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
          {stat.title}
        </p>
        <p className="mt-1 font-bold text-3xl tracking-tight">{stat.value}</p>
      </div>
    </Card>
  );
}

export function OrgStats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {dummyStats.map((stat, index) => (
        <StatCard key={index.toString()} stat={stat} />
      ))}
    </div>
  );
}
