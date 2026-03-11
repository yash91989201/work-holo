import { createFileRoute } from "@tanstack/react-router";
import { getBpoPageBySlug } from "@/components/landing/BPO/bpo-data";
import { BpoPageTemplate } from "@/components/landing/BPO/bpo-page-template";

export const Route = createFileRoute("/(public)/bpo/$slug")({
  component: BpoPage,
});

function BpoPage() {
  const { slug } = Route.useParams();
  const data = getBpoPageBySlug(slug);

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-foreground">Page Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The BPO service page you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return <BpoPageTemplate data={data} />;
}
