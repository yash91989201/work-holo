import { createFileRoute } from "@tanstack/react-router";
import { ServiceGrid } from "@/components/services/service-grid";

export const Route = createFileRoute("/services/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Page header */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-bold font-heading text-4xl text-foreground sm:text-5xl">
            Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We build, scale, and optimize digital products with AI-first
            engineering.
          </p>
        </div>
      </section>

      <ServiceGrid />
    </div>
  );
}
