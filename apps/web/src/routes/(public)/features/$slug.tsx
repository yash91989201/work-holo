import { createFileRoute } from "@tanstack/react-router";
import { FeaturePageTemplate } from "@/components/landing/Features/TeamChannel/feature-page-template";
import { getFeaturePageBySlug } from "@/components/landing/Features/TeamChannel/feature-page-data";
import { MessagingPage } from "@/components/landing/Features/DIrectMessaging/messaging-page";
import { RealTimePage } from "@/components/landing/Features/RealTimeMessaging/real-time-page";

export const Route = createFileRoute("/(public)/features/$slug")({
  component: FeaturePage,
});

function FeaturePage() {
  const { slug } = Route.useParams();

  // Direct Messaging has its own unique page
  if (slug === "direct-messaging" || slug === "messaging") {
    return <MessagingPage />;
  }

  // Real Time Messaging has its own unique page
  if (slug === "real-time" || slug === "real-time-messaging") {
    return <RealTimePage />;
  }

  // All other features use the TeamChannel template
  const data = getFeaturePageBySlug(slug);

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-foreground">Page Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The feature page you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return <FeaturePageTemplate data={data} />;
}
