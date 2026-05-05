import { createFileRoute } from "@tanstack/react-router";
import { ProjectGrid } from "@/components/projects/project-grid";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative overflow-hidden bg-background">
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-bold font-heading text-4xl text-foreground sm:text-5xl">
            Projects
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            From AI-powered platforms to enterprise cloud migrations — explore
            our portfolio of impactful digital transformations.
          </p>
        </div>
      </section>

      <ProjectGrid />
    </div>
  );
}