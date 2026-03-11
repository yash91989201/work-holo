import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureListItem } from "./feature-item";
import { SectionHeader } from "./section-header";
import { SectionWrapper } from "./section-wrapper";

const aiFeatures = [
  { title: "AI Message Summaries", subtitle: "Catch up instantly" },
  { title: "Smart Reply Suggestions", subtitle: "Respond faster" },
  {
    title: "Automated Meeting Notes",
    subtitle: "Focus on the discussion",
  },
  { title: "AI-Powered Search", subtitle: "Find exactly what you need" },
];

export function AiFeaturesSection() {
  return (
    <SectionWrapper variant="purple">
      <SectionHeader
        light
        subtitle={
          "Elevate your team's productivity with intelligent features designed to save time and streamline workflows. From automated summaries to smart suggestions, AI is built\ninto the core of WorkHolo."
        }
        title="Work smarter with AI-powered communication."
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Feature list card */}
        <Card className="border-0 bg-white/95 shadow-xl dark:bg-card">
          <CardHeader>
            <CardTitle className="text-primary text-xl">
              Smart &amp; AI Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiFeatures.map((feature) => (
              <FeatureListItem
                key={feature.title}
                subtitle={feature.subtitle}
                title={feature.title}
              />
            ))}
          </CardContent>
        </Card>

        {/* Placeholder image */}
        <div className="overflow-hidden rounded-xl">
          <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-white/20 to-white/5">
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-white/60">
                <svg
                  className="mx-auto mb-3"
                  fill="none"
                  height="56"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="56"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="text-base">Feature Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
