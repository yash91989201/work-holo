import { IconTarget, IconTelescope } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AboutLayout } from "@/components/public/about/about-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/(public)/about/vision-mission")({
  component: VisionMissionPage,
});

function VisionMissionPage() {
  return (
    <AboutLayout
      badge="Our Purpose"
      subtitle="Guiding principles that drive our innovation and impact."
      title="Vision & Mission"
    >
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconTelescope className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              To be the global catalyst for digital transformation, empowering
              businesses to thrive in an interconnected, data-driven world
              through scalable, intuitive, and future-ready technology
              solutions.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconTarget className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              To build exceptional software that bridges the gap between complex
              problems and elegant solutions. We are committed to fostering a
              culture of continuous learning, delivering uncompromised quality,
              and driving measurable success for our clients.
            </p>
          </CardContent>
        </Card>
      </div>
    </AboutLayout>
  );
}
