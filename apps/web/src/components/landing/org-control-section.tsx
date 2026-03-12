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

        {/* User & Role Management mockup */}
        <div className="overflow-hidden rounded-xl">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
            <div className="flex h-full flex-col bg-white">
              {/* Header */}
              <div className="flex items-center justify-between border-zinc-100 border-b px-3 py-2 sm:px-5 sm:py-3">
                <div>
                  <p className="font-bold text-[10px] text-zinc-800 sm:text-sm">
                    Workspace Members
                  </p>
                  <p className="text-[6px] text-zinc-400 sm:text-[10px]">
                    4 members · 3 roles
                  </p>
                </div>
                <span className="rounded-lg bg-[#7C5CFF] px-2 py-1 font-medium text-[6px] text-white sm:text-[10px]">
                  + Invite Member
                </span>
              </div>
              {/* Role filter */}
              <div className="flex gap-1 border-zinc-50 border-b px-3 py-1 sm:px-5 sm:py-1.5">
                <span className="rounded-full bg-[#7C5CFF] px-2 py-0.5 font-medium text-[5px] text-white sm:text-[9px]">
                  All
                </span>
                <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[5px] text-zinc-500 sm:text-[9px]">
                  Admin
                </span>
                <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[5px] text-zinc-500 sm:text-[9px]">
                  Member
                </span>
              </div>
              {/* Members list */}
              <div className="flex-1 divide-y divide-zinc-50 overflow-hidden">
                {[
                  {
                    init: "JD",
                    name: "John Doe",
                    email: "john@acme.com",
                    role: "Owner",
                    avatarBg: "bg-[#7C5CFF]",
                    roleCls: "text-[#7C5CFF] bg-[#7C5CFF]/10",
                  },
                  {
                    init: "MS",
                    name: "Madhu Sharma",
                    email: "madhu@acme.com",
                    role: "Admin",
                    avatarBg: "bg-blue-500",
                    roleCls: "text-blue-600 bg-blue-50",
                  },
                  {
                    init: "AL",
                    name: "Amy Liu",
                    email: "amy@acme.com",
                    role: "Team Lead",
                    avatarBg: "bg-emerald-500",
                    roleCls: "text-emerald-600 bg-emerald-50",
                  },
                  {
                    init: "FP",
                    name: "Fathima P.",
                    email: "fp@acme.com",
                    role: "Member",
                    avatarBg: "bg-pink-400",
                    roleCls: "text-zinc-500 bg-zinc-100",
                  },
                ].map((m) => (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5"
                    key={m.name}
                  >
                    <div
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full font-bold text-[5px] text-white sm:size-8 sm:text-[10px] ${m.avatarBg}`}
                    >
                      {m.init}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[7px] text-zinc-800 sm:text-[12px]">
                        {m.name}
                      </p>
                      <p className="truncate text-[5px] text-zinc-400 sm:text-[9px]">
                        {m.email}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-semibold text-[5px] sm:text-[9px] ${m.roleCls}`}
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
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
