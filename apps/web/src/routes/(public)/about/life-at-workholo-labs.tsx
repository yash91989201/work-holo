import { IconBook, IconCoffee, IconHeartHandshake } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AboutLayout } from "@/components/public/about/about-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/(public)/about/life-at-workholo-labs")({
  component: LifeAtWorkHoloPage,
});

const perks = [
  {
    title: "Health & Wellness",
    description: "Comprehensive health coverage and mental wellness programs.",
    icon: IconHeartHandshake,
  },
  {
    title: "Flexible Work",
    description:
      "Work from anywhere, with flexible hours tailored to your lifestyle.",
    icon: IconCoffee,
  },
  {
    title: "Continuous Learning",
    description:
      "Annual learning stipends and regular skill-building workshops.",
    icon: IconBook,
  },
];

function LifeAtWorkHoloPage() {
  return (
    <AboutLayout
      badge="Careers"
      subtitle="Join a culture of innovation, collaboration, and continuous growth."
      title="Life at WorkHolo Labs"
    >
      <div className="space-y-8">
        <section className="prose dark:prose-invert max-w-none">
          <h2 className="font-bold text-3xl tracking-tight">Our Culture</h2>
          <p className="text-lg text-muted-foreground">
            At WorkHolo Labs, we believe that great software is built by happy,
            fulfilled teams. We foster an environment of transparency,
            psychological safety, and radical collaboration.
          </p>
          <p className="text-lg text-muted-foreground">
            Whether you are working from our headquarters or halfway across the
            globe, you are an integral part of our community. We celebrate
            diversity, encourage experimentation, and embrace learning from
            failures.
          </p>
        </section>

        <section>
          <h3 className="mb-6 font-bold text-2xl tracking-tight">
            Perks & Benefits
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p) => (
              <Card className="bg-card" key={p.title}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h4 className="mb-2 font-semibold">{p.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    {p.description}
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
