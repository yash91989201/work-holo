import {
  IconBuildingCommunity,
  IconMailFilled,
  IconShieldFilled,
  IconUsers,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@work-holo/ui/components/card";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Suspense } from "react";

export const Route = createFileRoute("/(authenticated)/org/$slug/console/")({
  staticData: { crumb: "Console" },
  component: RouteComponent,
});

interface AdminStatItem {
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string | number;
}

// TODO: Replace with actual API data
const adminStats: AdminStatItem[] = [
  {
    title: "TOTAL MEMBERS",
    value: 124,
    icon: IconUsers,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    description: "Active organization members",
  },
  {
    title: "PENDING INVITES",
    value: 8,
    icon: IconMailFilled,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    description: "Awaiting acceptance",
  },
  {
    title: "ACTIVE TEAMS",
    value: 48,
    icon: IconBuildingCommunity,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    description: "Teams across organization",
  },
  {
    title: "ADMIN USERS",
    value: 12,
    icon: IconShieldFilled,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    description: "Organization administrators",
  },
];

function AdminStatCard({ stat }: { stat: AdminStatItem }) {
  const Icon = stat.icon;

  return (
    <Card className="gap-4 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
          <Icon className={`h-5 w-5 ${stat.iconColor}`} />
        </div>
      </div>
      <div>
        <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
          {stat.title}
        </p>
        <p className="mt-1 font-bold text-3xl tracking-tight">{stat.value}</p>
        <p className="mt-1 text-muted-foreground text-xs">{stat.description}</p>
      </div>
    </Card>
  );
}

function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[...new Array(4)].map((_, i) => (
        <Card className="gap-4 rounded-2xl p-5 shadow-sm" key={i.toString()}>
          <div className="flex items-start justify-between">
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function AdminStats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {adminStats.map((stat, index) => (
        <AdminStatCard key={index.toString()} stat={stat} />
      ))}
    </div>
  );
}

AdminStats.Fallback = AdminStatsSkeleton;
function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <Suspense fallback={<AdminStats.Fallback />}>
        <AdminStats />
      </Suspense>
    </section>
  );
}
