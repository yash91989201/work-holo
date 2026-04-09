import { IconBulb, IconShieldCheck, IconUsers } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AboutLayout } from "@/components/public/about/about-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/(public)/about/nasscom-membership")({
  component: NasscomMembershipPage,
});

const benefits = [
  {
    title: "Industry Standards",
    description:
      "Adhering to the highest quality and security standards in software development.",
    icon: IconShieldCheck,
  },
  {
    title: "Global Network",
    description:
      "Part of a massive ecosystem of tech leaders, driving innovation together.",
    icon: IconUsers,
  },
  {
    title: "Continuous Innovation",
    description:
      "Access to latest industry insights, keeping our solutions ahead of the curve.",
    icon: IconBulb,
  },
];

function NasscomMembershipPage() {
  return (
    <AboutLayout
      badge="Partnership"
      subtitle="Proud members of India's premier IT trade association."
      title="NASSCOM Membership"
    >
      <div className="space-y-8">
        <section className="prose dark:prose-invert max-w-none">
          <h2 className="font-bold text-3xl tracking-tight">
            Our Commitment to Excellence
          </h2>
          <p className="text-lg text-muted-foreground">
            As a registered member of NASSCOM, WorkHolo Labs is committed to
            maintaining global standards of IT services and driving the digital
            economy forward.
          </p>
          <p className="text-lg text-muted-foreground">
            This membership reflects our dedication to ethical business
            practices, technological advancement, and contributing to the global
            tech community.
          </p>
        </section>

        <section>
          <h3 className="mb-6 font-bold text-2xl tracking-tight">
            What This Means for Our Clients
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <Card className="bg-card" key={b.title}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h4 className="mb-2 font-semibold">{b.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    {b.description}
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
