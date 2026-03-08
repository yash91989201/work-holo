import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { LandingHeader } from "@/components/landing/landing-header";

export const Route = createFileRoute("/(public)")({
  component: RouteComponent,
});

import { Footer } from "@/components/landing/footer";

function RouteComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  return (
    <div className="flex flex-col min-h-svh bg-background">
      <LandingHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
