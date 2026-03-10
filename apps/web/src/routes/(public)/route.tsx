import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LandingHeader } from "@/components/landing/landing-header";

export const Route = createFileRoute("/(public)")({
  component: RouteComponent,
});

import { Footer } from "@/components/landing/footer";

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
