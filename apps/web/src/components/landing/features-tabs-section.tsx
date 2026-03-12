import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureItem } from "./feature-item";
import { SectionHeader } from "./section-header";
import { SectionWrapper } from "./section-wrapper";

interface TabData {
  features: Array<{
    title: string;
    description: string;
    linkText?: string;
    linkHref?: string;
  }>;
  heading: string;
  label: string;
  subtitle: string;
  value: string;
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

function TabPreview({ tabValue }: { tabValue: string }) {
  if (tabValue === "communication") {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
        <div className="flex items-center justify-between border-zinc-100 border-b px-3 py-2 sm:px-4 sm:py-2.5">
          <span className="font-bold text-[10px] text-zinc-800 sm:text-sm">
            # general
          </span>
          <div className="flex gap-2">
            <span className="text-[6px] text-zinc-400 sm:text-[9px]">
              📌 2 pinned
            </span>
            <span className="text-[6px] text-zinc-400 sm:text-[9px]">
              👥 12
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2 overflow-hidden p-3 sm:space-y-3 sm:p-4">
          <div className="flex gap-1.5 sm:gap-2.5">
            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-[6px] text-blue-600 sm:size-8 sm:text-[10px]">
              AC
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-semibold text-[7px] text-zinc-800 sm:text-[13px]">
                  Alex Chen
                </span>
                <span className="text-[5px] text-zinc-400 sm:text-[9px]">
                  10:32 AM
                </span>
              </div>
              <p className="text-[7px] text-zinc-700 sm:text-[12px]">
                <span className="font-medium text-[#7C5CFF]">@Sarah</span> can
                you review the Q3 report before EOD?
              </p>
              <div className="mt-0.5 flex gap-1">
                <span className="inline-flex items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-[5px] sm:text-[9px]">
                  👀 2
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 sm:gap-2.5">
            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-[6px] text-green-600 sm:size-8 sm:text-[10px]">
              SK
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-semibold text-[7px] text-zinc-800 sm:text-[13px]">
                  Sarah K
                </span>
                <span className="text-[5px] text-zinc-400 sm:text-[9px]">
                  10:34 AM
                </span>
              </div>
              <p className="text-[7px] text-zinc-700 sm:text-[12px]">
                Sure! Will take a look this afternoon 👍
              </p>
              <div className="mt-0.5 flex gap-1">
                <span className="inline-flex items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-[5px] sm:text-[9px]">
                  ✅ 1
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-[5px] sm:text-[9px]">
                  🎉 3
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-2 py-1 sm:py-1.5">
            <span className="text-[8px] sm:text-sm">📌</span>
            <div>
              <p className="font-semibold text-[5px] text-amber-700 sm:text-[9px]">
                Pinned
              </p>
              <p className="text-[5px] text-amber-600 sm:text-[9px]">
                Q3 Report Draft.pdf
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tabValue === "media") {
    const files = [
      {
        ext: "PDF",
        name: "Q3-Report-Final.pdf",
        size: "2.4 MB",
        author: "Alex Chen",
        extClass: "bg-red-50 text-red-600",
      },
      {
        ext: "XLS",
        name: "Budget-2026.xlsx",
        size: "1.1 MB",
        author: "Sarah K",
        extClass: "bg-green-50 text-green-600",
      },
      {
        ext: "MP4",
        name: "Product-Demo.mp4",
        size: "45 MB",
        author: "Madhu S.",
        extClass: "bg-blue-50 text-blue-600",
      },
    ];
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
        <div className="flex items-center justify-between border-zinc-100 border-b px-3 py-2 sm:px-4 sm:py-2.5">
          <span className="font-bold text-[10px] text-zinc-800 sm:text-sm">
            Shared Files
          </span>
          <span className="text-[6px] text-zinc-400 sm:text-[10px]">
            14 files
          </span>
        </div>
        <div className="flex-1 overflow-hidden p-3 sm:p-4">
          <div className="mb-2 grid grid-cols-3 gap-1 sm:mb-3 sm:gap-1.5">
            <div className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 to-sky-200 text-base sm:text-2xl">
              🏔️
            </div>
            <div className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-violet-200 text-base sm:text-2xl">
              📊
            </div>
            <div className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-rose-100 to-rose-200 text-base sm:text-2xl">
              🎨
            </div>
          </div>
          <div className="space-y-1 sm:space-y-1.5">
            {files.map((f) => (
              <div
                className="flex items-center gap-1.5 rounded-lg border border-zinc-100 bg-zinc-50 px-2 py-1 sm:py-1.5"
                key={f.name}
              >
                <div
                  className={`flex size-5 shrink-0 items-center justify-center rounded font-bold text-[5px] sm:size-7 sm:text-[9px] ${f.extClass}`}
                >
                  {f.ext}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[6px] text-zinc-800 sm:text-[10px]">
                    {f.name}
                  </p>
                  <p className="text-[5px] text-zinc-400 sm:text-[8px]">
                    {f.size} · {f.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tabValue === "productivity") {
    const points = [
      { icon: "📌", text: "Feature deployment confirmed for Friday" },
      { icon: "✅", text: "3 action items assigned to team" },
      { icon: "👥", text: "8 members discussed the launch plan" },
    ];
    const replies = ["Sounds good!", "Checking now", "On it!"];
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
        <div className="flex items-center gap-1.5 border-zinc-100 border-b px-3 py-2 sm:px-4 sm:py-2.5">
          <span className="text-[9px] sm:text-sm">✨</span>
          <span className="font-bold text-[#7C5CFF] text-[10px] sm:text-sm">
            AI Summary
          </span>
          <span className="ml-1 text-[6px] text-zinc-400 sm:text-[10px]">
            · #project-launch
          </span>
        </div>
        <div className="flex-1 space-y-2 overflow-hidden p-3 sm:space-y-3 sm:p-4">
          <p className="text-[6px] text-zinc-400 sm:text-[10px]">
            Last 2 hours · 24 messages
          </p>
          <div className="space-y-1 rounded-xl bg-[#F5F2FF] p-2 sm:space-y-1.5 sm:p-3">
            {points.map((item) => (
              <div className="flex items-start gap-1" key={item.text}>
                <span className="mt-0.5 shrink-0 text-[7px] sm:text-[11px]">
                  {item.icon}
                </span>
                <p className="text-[6px] text-zinc-700 sm:text-[11px]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <div>
            <p className="font-semibold text-[5px] text-zinc-400 uppercase tracking-wider sm:text-[8px]">
              Smart Replies
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {replies.map((r) => (
                <span
                  className="rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/5 px-1.5 py-0.5 text-[#7C5CFF] text-[5px] sm:text-[9px]"
                  key={r}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // management
  const members = [
    {
      init: "JD",
      name: "John Doe",
      role: "Owner",
      avatarBg: "bg-[#7C5CFF]",
      roleCls: "text-[#7C5CFF] bg-[#7C5CFF]/10",
    },
    {
      init: "MS",
      name: "Madhu Sharma",
      role: "Admin",
      avatarBg: "bg-blue-500",
      roleCls: "text-blue-600 bg-blue-50",
    },
    {
      init: "AL",
      name: "Amy Liu",
      role: "Team Lead",
      avatarBg: "bg-emerald-500",
      roleCls: "text-emerald-600 bg-emerald-50",
    },
    {
      init: "FP",
      name: "Fathima P.",
      role: "Member",
      avatarBg: "bg-pink-400",
      roleCls: "text-zinc-500 bg-zinc-100",
    },
  ];
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
      <div className="flex items-center justify-between border-zinc-100 border-b px-3 py-2 sm:px-4 sm:py-2.5">
        <span className="font-bold text-[10px] text-zinc-800 sm:text-sm">
          Members <span className="font-normal text-zinc-400">12</span>
        </span>
        <span className="rounded-lg bg-[#7C5CFF] px-2 py-0.5 font-medium text-[5px] text-white sm:text-[9px]">
          + Invite
        </span>
      </div>
      <div className="flex-1 divide-y divide-zinc-50 overflow-hidden">
        {members.map((m) => (
          <div
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2.5"
            key={m.name}
          >
            <div
              className={`flex size-5 shrink-0 items-center justify-center rounded-full font-bold text-[5px] text-white sm:size-7 sm:text-[9px] ${m.avatarBg}`}
            >
              {m.init}
            </div>
            <span className="flex-1 truncate font-medium text-[7px] text-zinc-800 sm:text-[12px]">
              {m.name}
            </span>
            <span
              className={`rounded-full px-1.5 py-0.5 font-semibold text-[5px] sm:text-[8px] ${m.roleCls}`}
            >
              {m.role}
            </span>
            <span className="text-[7px] text-zinc-300 sm:text-[10px]">
              &middot;&middot;&middot;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        className="w-full"
        onValueChange={handleTabChange}
        value={activeTab}
      >
        <div className="flex justify-center">
          <TabsList
            className="mb-10 gap-1 border border-1 bg-[#F2EFFF] px-1.5 py-2"
            style={{ height: "52px" }}
          >
            {tabsData.map((tab) => (
              <TabsTrigger
                className="rounded-full border border-transparent px-7 text-base data-[state=active]:border-[#D8D5E8]"
                key={tab.value}
                style={{ height: "38px" }}
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabsData.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <SectionHeader subtitle={tab.subtitle} title={tab.heading} />

            <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              {/* Feature list */}
              <div className="space-y-1">
                {tab.features.map((feature, i) => (
                  <button
                    className="w-full text-left"
                    key={feature.title}
                    onClick={() => handleFeatureClick(tab.value, i)}
                    type="button"
                  >
                    <FeatureItem
                      active={activeFeatureIndex[tab.value] === i}
                      description={feature.description}
                      linkHref={feature.linkHref}
                      linkText={feature.linkText}
                      title={feature.title}
                    />
                  </button>
                ))}
              </div>

              {/* Feature mockup */}
              <div className="overflow-hidden rounded-xl">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <TabPreview tabValue={tab.value} />
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </SectionWrapper>
  );
}
