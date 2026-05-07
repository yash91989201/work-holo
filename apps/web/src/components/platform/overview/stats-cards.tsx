import {
  IconBan,
  IconBuilding,
  IconHeadphones,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { queryUtils } from "@/utils/orpc";

export function StatsCards() {
  const { data: stats } = useSuspenseQuery(
    queryUtils.admin.getStats.queryOptions({})
  );

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: IconUsers },
    { label: "Organizations", value: stats.totalOrgs, icon: IconBuilding },
    { label: "Admins", value: stats.adminUsers, icon: IconShieldCheck },
    {
      label: "Support Agents",
      value: stats.supportUsers,
      icon: IconHeadphones,
    },
    { label: "Banned Users", value: stats.bannedUsers, icon: IconBan },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              {card.label}
            </CardTitle>
            <card.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-bold text-3xl">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

StatsCards.Fallback = StatsCardsSkeleton;
