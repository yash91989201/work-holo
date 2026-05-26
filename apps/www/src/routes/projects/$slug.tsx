import { createFileRoute } from "@tanstack/react-router";
import { getProjectData } from "@/components/projects/project-data";
import { ProjectDetailPage } from "@/components/projects/project-detail-page";

export const Route = createFileRoute("/projects/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const data = getProjectData(slug);

  if (!data) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-background">
        <div className="text-center">
          <h1 className="font-bold font-heading text-4xl text-foreground">
            Project Not Found
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The requested project page does not exist.
          </p>
        </div>
      </div>
    );
  }

  return <ProjectDetailPage data={data} />;
}
