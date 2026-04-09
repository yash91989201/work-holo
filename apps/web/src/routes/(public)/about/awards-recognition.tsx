import { IconTrophy } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AboutLayout } from "@/components/public/about/about-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/(public)/about/awards-recognition")({
  component: AwardsRecognitionPage,
});

const awards = [
  {
    title: "Best Enterprise SaaS Solution",
    organization: "Global Tech Awards",
    year: "2023",
    description: "Recognized for outstanding scalability and user experience.",
  },
  {
    title: "Top 50 Startups to Watch",
    organization: "Innovator Magazine",
    year: "2022",
    description:
      "Highlighted as a fast-growing tech innovator in B2B software.",
  },
  {
    title: "Excellence in AI Implementation",
    organization: "AI & Data Summit",
    year: "2024",
    description:
      "Awarded for seamlessly integrating AI into enterprise workflows.",
  },
];

function AwardsRecognitionPage() {
  return (
    <AboutLayout
      badge="Accolades"
      subtitle="Industry recognition for our commitment to excellence."
      title="Awards & Recognition"
    >
      <div className="grid gap-6">
        {awards.map((award) => (
          <Card className="bg-card" key={award.title}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconTrophy className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">{award.title}</CardTitle>
                <div className="font-medium text-primary text-sm">
                  {award.organization} &bull; {award.year}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{award.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AboutLayout>
  );
}
