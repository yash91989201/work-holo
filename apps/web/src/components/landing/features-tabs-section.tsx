import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import { FeatureItem } from "./feature-item";

interface TabData {
  value: string;
  label: string;
  heading: string;
  subtitle: string;
  features: Array<{
    title: string;
    description: string;
    linkText?: string;
    linkHref?: string;
  }>;
}

const tabsData: TabData[] = [
  {
    value: "communication",
    label: "Communication",
    heading: "Structured communication for focused teams.",
    subtitle:
      "Organize your work with dedicated channels, direct messaging, and rich media sharing capabilities designed for modern collaboration.",
    features: [
      {
        title: "Core Communication & Channels",
        description:
          "Keep conversations organized with department-based channels and 1-on-1 direct messaging. Utilize @mentions, emoji reactions, and pinned messages to keep everyone aligned.",
        linkText: "Explore communication features",
        linkHref: "/",
      },
      {
        title: "Rich Media & File Sharing.",
        description:
          "Share images, videos, and documents seamlessly within channels and direct messages.",
      },
      {
        title: "Instant Notifications & Search.",
        description:
          "Never miss a message with real-time notifications and powerful search across all conversations.",
      },
    ],
  },
  {
    value: "media",
    label: "Media",
    heading: "Share and collaborate on media seamlessly.",
    subtitle:
      "Upload, preview, and share images, videos, and files directly in your conversations with built-in media management.",
    features: [
      {
        title: "Image & Video Sharing",
        description:
          "Share rich media directly in channels and DMs with inline previews, full-screen viewing, and easy downloading.",
        linkText: "Explore media features",
        linkHref: "/",
      },
      {
        title: "File Management.",
        description:
          "Organize and access shared files with a centralized file manager across channels.",
      },
      {
        title: "Media Gallery.",
        description:
          "Browse all shared media in a visual gallery view for quick reference.",
      },
    ],
  },
  {
    value: "productivity",
    label: "Productivity",
    heading: "Boost team productivity with smart tools.",
    subtitle:
      "Leverage AI-powered features and workflow automations to help your team work faster and more efficiently.",
    features: [
      {
        title: "AI Message Summaries",
        description:
          "Catch up on missed conversations instantly with AI-generated summaries of channel activity and direct messages.",
        linkText: "Explore productivity features",
        linkHref: "/",
      },
      {
        title: "Smart Reply Suggestions.",
        description:
          "Respond faster with AI-powered reply suggestions tailored to conversation context.",
      },
      {
        title: "Automated Meeting Notes.",
        description:
          "Focus on the discussion while AI captures key points and action items automatically.",
      },
    ],
  },
  {
    value: "management",
    label: "Management",
    heading: "Empower your organization with granular control.",
    subtitle:
      "Manage your workspace efficiently with robust user management, role-based access controls, and comprehensive team permissions.",
    features: [
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
          "Organize teams into dedicated channels with admin-managed permissions and membership.",
      },
      {
        title: "Workspace Management.",
        description:
          "Configure workspace-wide settings, branding, and policies from a centralized admin dashboard.",
      },
    ],
  },
];

export function FeaturesTabsSection() {
  const [activeTab, setActiveTab] = useState("communication");
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<
    Record<string, number>
  >({
    communication: 0,
    media: 0,
    productivity: 0,
    management: 0,
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleFeatureClick = (tabValue: string, index: number) => {
    setActiveFeatureIndex((prev) => ({ ...prev, [tabValue]: index }));
  };

  return (
    <SectionWrapper>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex justify-center">
          <TabsList
            className="mb-10 gap-1 bg-[#F2EFFF] px-1.5 py-2 border border-1"
            style={{ height: "52px" }}
          >
            {tabsData.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="px-7 text-base rounded-full border border-transparent data-[state=active]:border-[#D8D5E8]"
                style={{ height: "38px" }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabsData.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <SectionHeader title={tab.heading} subtitle={tab.subtitle} />

            <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              {/* Feature list */}
              <div className="space-y-1">
                {tab.features.map((feature, i) => (
                  <button
                    key={feature.title}
                    type="button"
                    className="w-full text-left"
                    onClick={() => handleFeatureClick(tab.value, i)}
                  >
                    <FeatureItem
                      title={feature.title}
                      description={feature.description}
                      linkText={feature.linkText}
                      linkHref={feature.linkHref}
                      active={activeFeatureIndex[tab.value] === i}
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
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p className="text-base">Feature Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </SectionWrapper>
  );
}
