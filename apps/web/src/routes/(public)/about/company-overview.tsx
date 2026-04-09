import {
  IconBuildingFactory2,
  IconCpu,
  IconDeviceDesktopAnalytics,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AboutLayout } from "@/components/public/about/about-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/(public)/about/company-overview")({
  component: CompanyOverviewPage,
});

const values = [
  {
    title: "Innovation First",
    description:
      "We constantly push the boundaries of what's possible in tech.",
    icon: IconCpu,
  },
  {
    title: "Enterprise Scale",
    description: "Built for robust, secure, and scalable solutions.",
    icon: IconBuildingFactory2,
  },
  {
    title: "Digital Transformation",
    description: "Empowering businesses through cutting-edge analytics.",
    icon: IconDeviceDesktopAnalytics,
  },
];

function CompanyOverviewPage() {
  return (
    <AboutLayout
      badge="About Us"
      subtitle="Pioneering digital transformation and building scalable software solutions."
      title="Company Overview"
    >
      <div className="space-y-8">
        <section className="prose dark:prose-invert max-w-none">
          <h2 className="font-bold text-3xl tracking-tight">Who We Are</h2>
          <p className="text-lg text-muted-foreground">
            WorkHolo Labs is an innovative technology company focused on
            delivering cutting-edge software solutions to enterprises globally.
            We specialize in robust, scalable architectures and digital
            transformation.
          </p>
          <p className="text-lg text-muted-foreground">
            Founded with a vision to streamline complex business workflows, we
            have grown into a multi-disciplinary team of engineers, designers,
            and strategists.
          </p>
        </section>

        <section>
          <h3 className="mb-6 font-bold text-2xl tracking-tight">
            Core Values
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <Card className="bg-card" key={v.title}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h4 className="mb-2 font-semibold">{v.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    {v.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AboutLayout>
  );
}
