import { createFileRoute } from "@tanstack/react-router";
import { getServiceData } from "@/components/services/service-data";
import { ServiceDetailPage } from "@/components/services/service-detail-page";

export const Route = createFileRoute("/services/cloud-engineering-devops")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = getServiceData("cloud-engineering-devops");

  if (!data) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-background">
        <div className="text-center">
          <h1 className="font-bold font-heading text-4xl text-foreground">
            Service Not Found
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The requested service page does not exist.
          </p>
        </div>
      </div>
    );
  }

  return <ServiceDetailPage data={data} />;
}
