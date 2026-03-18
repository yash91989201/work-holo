<<<<<<< HEAD
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { StatsCards } from "@/components/platform/overview/stats-cards";

export const Route = createFileRoute("/(authenticated)/platform/dashboard/")({
  staticData: { crumb: "Overview" },
  component: RouteComponent,
});

function RouteComponent() {
  const { adminRole } = Route.useRouteContext();

  return (
    <section className="space-y-6 p-6">
      <h1 className="font-semibold text-2xl">Platform Overview</h1>
      {adminRole === "super_admin" ? (
        <Suspense fallback={<StatsCards.Fallback />}>
=======
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Ban, Building2, Headphones, ShieldCheck, Users } from "lucide-react";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute("/(authenticated)/platform/dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { adminRole } = Route.useRouteContext();

  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-2xl">Platform Overview</h1>
      {adminRole === "super_admin" ? (
        <Suspense fallback={<StatsCardsSkeleton />}>
>>>>>>> 9a25431 (fix: add missing newline at end of _journal.json file)
          <StatsCards />
        </Suspense>
      ) : (
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Use the sidebar to navigate.
        </p>
      )}
<<<<<<< HEAD
    </section>
=======
    </div>
  );
}

function StatsCards() {
  const { data: stats } = useSuspenseQuery(
    queryUtils.admin.getStats.queryOptions({})
  );

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Organizations", value: stats.totalOrgs, icon: Building2 },
    { label: "Admins", value: stats.adminUsers, icon: ShieldCheck },
    { label: "Support Agents", value: stats.supportUsers, icon: Headphones },
    { label: "Banned Users", value: stats.bannedUsers, icon: Ban },
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

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
>>>>>>> 9a25431 (fix: add missing newline at end of _journal.json file)
  );
}
