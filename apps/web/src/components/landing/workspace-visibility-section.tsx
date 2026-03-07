import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import { FeatureItem } from "./feature-item";
import { useState } from "react";

const features = [
  {
    title: "Admin Controls & Analytics",
    description:
      "Utilize the Admin Dashboard for channel creation, team moderation, and user activity control. Access usage reports and communication analytics to track productivity.",
    linkText: "Explore admin features",
    linkHref: "/",
  },
  {
    title: "Enable / Disable 1-on-1 Chat.",
    description:
      "Give administrators control over direct messaging availability to align with your organization's communication policies.",
  },
  {
    title: "Admin Insights Dashboard.",
    description:
      "Monitor team activity, track usage patterns, and generate reports to make data-driven decisions about your workspace.",
  },
];

export function WorkspaceVisibilitySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SectionWrapper>
      <SectionHeader
        title="Complete visibility and control over your workspace."
        subtitle="Equip your administrators with powerful tools to manage channels, monitor activity, and track productivity through detailed analytics."
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Feature list */}
        <div className="space-y-1">
          {features.map((feature, i) => (
            <button
              key={feature.title}
              type="button"
              className="w-full text-left"
              onClick={() => setActiveIndex(i)}
            >
              <FeatureItem
                title={feature.title}
                description={feature.description}
                linkText={feature.linkText}
                linkHref={feature.linkHref}
                active={activeIndex === i}
              />
            </button>
          ))}
        </div>

        {/* Placeholder image */}
        <div className="overflow-hidden rounded-xl">
          <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-muted to-muted/50">
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-muted-foreground">
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
                <p className="text-base">Feature Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
