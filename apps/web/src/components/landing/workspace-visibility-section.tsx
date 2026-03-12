import { useState } from "react";
import { FeatureItem } from "./feature-item";
import { SectionHeader } from "./section-header";
import { SectionWrapper } from "./section-wrapper";

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
        subtitle="Equip your administrators with powerful tools to manage channels, monitor activity, and track productivity through detailed analytics."
        title="Complete visibility and control over your workspace."
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

        {/* Admin Analytics mockup */}
        <div className="overflow-hidden rounded-xl">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
            <div className="flex h-full flex-col bg-white">
              {/* Header */}
              <div className="flex items-center justify-between border-zinc-100 border-b px-3 py-2 sm:px-5 sm:py-3">
                <span className="font-bold text-[10px] text-zinc-800 sm:text-sm">
                  Admin Dashboard
                </span>
                <span className="text-[6px] text-zinc-400 sm:text-[10px]">
                  Last 7 days
                </span>
              </div>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 border-zinc-50 border-b px-3 py-2 sm:px-5 sm:py-3">
                {[
                  { label: "Messages", value: "2.4k", trend: "+12%" },
                  { label: "Active Users", value: "18", trend: "+3" },
                  { label: "Channels", value: "8", trend: "Active" },
                ].map((stat) => (
                  <div className="text-center" key={stat.label}>
                    <p className="font-bold text-[11px] text-zinc-800 sm:text-base">
                      {stat.value}
                    </p>
                    <p className="text-[5px] text-zinc-400 sm:text-[9px]">
                      {stat.label}
                    </p>
                    <p className="font-medium text-[5px] text-emerald-500 sm:text-[9px]">
                      {stat.trend}
                    </p>
                  </div>
                ))}
              </div>
              {/* Bar chart */}
              <div className="px-3 py-2 sm:px-5 sm:py-3">
                <p className="mb-1.5 font-semibold text-[5px] text-zinc-400 uppercase tracking-wider sm:text-[8px]">
                  Activity this week
                </p>
                <div className="flex h-8 items-end gap-0.5 sm:h-14 sm:gap-1">
                  {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                    <div
                      className="flex-1 rounded-t-sm"
                      key={`bar-${i}`}
                      style={{
                        height: `${h}%`,
                        backgroundColor: i === 6 ? "#7C5CFF" : "#E9E4FF",
                      }}
                    />
                  ))}
                </div>
                <div className="mt-0.5 flex justify-between">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span
                      className="flex-1 text-center text-[4px] text-zinc-400 sm:text-[8px]"
                      key={`day-${i}`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              {/* Channel activity */}
              <div className="flex-1 overflow-hidden px-3 pb-2 sm:px-5 sm:pb-3">
                <p className="mb-1 font-semibold text-[5px] text-zinc-400 uppercase tracking-wider sm:mb-1.5 sm:text-[8px]">
                  Most Active Channels
                </p>
                <div className="space-y-1">
                  {[
                    { name: "#general", msgs: 47, pct: 80 },
                    { name: "#project-launch", msgs: 31, pct: 55 },
                    { name: "#hr-team", msgs: 18, pct: 32 },
                  ].map((ch) => (
                    <div className="flex items-center gap-1.5" key={ch.name}>
                      <span className="w-14 shrink-0 truncate text-[5px] text-zinc-500 sm:w-24 sm:text-[9px]">
                        {ch.name}
                      </span>
                      <div className="h-1 flex-1 rounded-full bg-zinc-100 sm:h-1.5">
                        <div
                          className="h-full rounded-full bg-[#7C5CFF]"
                          style={{ width: `${ch.pct}%` }}
                        />
                      </div>
                      <span className="w-4 text-right text-[5px] text-zinc-400 sm:text-[8px]">
                        {ch.msgs}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
