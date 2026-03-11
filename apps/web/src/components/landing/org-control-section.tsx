import { useState } from "react";
import { FeatureItem } from "./feature-item";
import { SectionHeader } from "./section-header";
import { SectionWrapper } from "./section-wrapper";

const features = [
  {
    title: "Team & User Management",
    description:
      "Easily handle user creation, deletion, and member invitations. Implement role-based access control to ensure the right people have the right access.",
    linkText: "Learn about access controls",
    linkHref: "/",
  },
  {
    title: "Department-Based Channels.",
    description:
      "Organize your team into dedicated channels with controlled membership and admin-managed permissions.",
  },
  {
    title: "Workspace Management.",
    description:
      "Configure workspace-wide settings, branding, and policies from one centralized admin dashboard.",
  },
];

export function OrgControlSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SectionWrapper variant="gray">
      <SectionHeader
        subtitle="Manage your workspace efficiently with robust user management, role-based access controls, and comprehensive team permissions."
        title="Empower your organization with granular control."
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Feature list */}
        <div className="space-y-1">
          {features.map((feature, i) => (
            <button
              className="w-full text-left"
              key={feature.title}
              onClick={() => setActiveIndex(i)}
              type="button"
            >
              <FeatureItem
                active={activeIndex === i}
                description={feature.description}
                linkHref={feature.linkHref}
                linkText={feature.linkText}
                title={feature.title}
              />
            </button>
          ))}
        </div>

        {/* Placeholder image */}
        <div className="overflow-hidden rounded-xl">
          <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-muted to-background">
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-muted-foreground">
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
                <p className="text-base">Feature Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
