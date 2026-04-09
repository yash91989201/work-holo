import { createFileRoute } from "@tanstack/react-router";
import { AboutLayout } from "@/components/public/about/about-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/(public)/about/our-journey")({
  component: OurJourneyPage,
});

const milestones = [
  {
    year: "2018",
    title: "The Beginning",
    description: "Founded with a small team of 5 passionate engineers.",
  },
  {
    year: "2020",
    title: "First Enterprise Client",
    description: "Successfully delivered our first scalable enterprise system.",
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Opened offices in three new countries, expanding our reach.",
  },
  {
    year: "2024",
    title: "AI Integration Era",
    description: "Launched our proprietary AI-assisted workflow suite.",
  },
];

function OurJourneyPage() {
  return (
    <AboutLayout
      badge="History"
      subtitle="The milestones that define our growth and innovation."
      title="Our Journey"
    >
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-primary/20 before:to-transparent md:before:mx-auto md:before:translate-x-0">
        {milestones.map((item) => (
          <div
            className={
              "group is-active relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
            }
            key={item.year}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-background shadow md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
              <span className="font-semibold text-primary text-sm">
                {item.year.slice(2)}
              </span>
            </div>

            <Card className="w-[calc(100%-4rem)] border-primary/10 shadow-sm transition-colors hover:border-primary/30 md:w-[calc(50%-2.5rem)]">
              <CardContent className="p-6">
                <h3 className="mb-2 font-bold text-lg">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                <div className="mt-4 font-bold text-primary text-xs tracking-wider">
                  {item.year}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </AboutLayout>
  );
}
