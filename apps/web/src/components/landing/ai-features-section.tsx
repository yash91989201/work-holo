import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import { FeatureListItem } from "./feature-item";

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
        title="Work smarter with AI-powered communication."
        subtitle={"Elevate your team's productivity with intelligent features designed to save time and streamline workflows. From automated summaries to smart suggestions, AI is built\ninto the core of WorkHolo."}
        light
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
                title={feature.title}
                subtitle={feature.subtitle}
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
                  xmlns="http://www.w3.org/2000/svg"
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mx-auto mb-3"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
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
