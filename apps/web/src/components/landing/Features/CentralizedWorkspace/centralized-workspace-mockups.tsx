import { cn } from "@/lib/utils";

/**
 * CentralizedWorkspaceMockups
 * ─────────────────────────────────────────────────────
 * Fully coded UI panels for the Centralized Workspace feature page.
 * Hero reuses the WorkspaceHeroMockup pattern from WorkspaceControl.
 */

/* ─── Shared animation CSS ─── */
const ANIM_STYLES = `
  @keyframes cw-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
  }
  @keyframes cw-float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes cw-float-mid {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .cw-float-1 { animation: cw-float 6s ease-in-out infinite; }
  .cw-float-2 { animation: cw-float-slow 8s ease-in-out infinite 1s; }
  .cw-float-3 { animation: cw-float-mid 7s ease-in-out infinite 0.5s; }
  .cw-float-4 { animation: cw-float 5.5s ease-in-out infinite 1.5s; }
  .cw-float-5 { animation: cw-float-slow 9s ease-in-out infinite 0.8s; }
`;

/**
 * CentralizedWorkspaceHeroMockup
 * Matches reference: two overlapping circles (mountain top, flowers)
 * with floating pill labels and white info cards.
 */
export function CentralizedWorkspaceHeroMockup() {
  return (
    <div className="relative h-[520px] w-full select-none overflow-visible lg:h-[580px]">
      <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />

      {/* ─── Large circle (top-right) — Mountain scene ─── */}
      <div className="cw-float-1 absolute top-[5%] right-[10%] z-20 size-56 overflow-hidden rounded-full border-4 border-white shadow-2xl sm:size-72 lg:size-72">
        <div className="relative size-full">
          <div className="absolute inset-0 bg-gradient-to-b from-[#A8C4D8] via-[#88ACCB] to-[#C5D8B5]" />
          <svg className="absolute inset-0 size-full" viewBox="0 0 200 200">
            <polygon
              fill="#5a8fa8"
              opacity="0.9"
              points="100,30 160,140 40,140"
            />
            <polygon
              fill="#7aaec8"
              opacity="0.7"
              points="60,60 130,140 -10,140"
            />
            <polygon
              fill="#4a7a9a"
              opacity="0.8"
              points="150,50 220,140 80,140"
            />
            <rect fill="#b5c99a" height="70" width="200" x="0" y="130" />
            <polygon fill="white" opacity="0.9" points="100,30 115,60 85,60" />
          </svg>
        </div>
      </div>

      {/* ─── Small circle (bottom-right) — Flowers ─── */}
      <div className="cw-float-2 absolute right-[2%] bottom-[8%] z-10 size-36 overflow-hidden rounded-full border-4 border-white shadow-xl sm:size-48">
        <div className="relative size-full">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-200 to-sky-300" />
          <svg className="absolute inset-0 size-full" viewBox="0 0 200 200">
            <circle cx="100" cy="200" fill="#86efac" r="80" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <ellipse
                cx={100 + Math.sin((deg * Math.PI) / 180) * 35}
                cy={110 + Math.cos((deg * Math.PI) / 180) * 35}
                fill="#f9a8d4"
                key={i}
                opacity="0.85"
                rx="18"
                ry="28"
                transform={`rotate(${deg}, ${100 + Math.sin((deg * Math.PI) / 180) * 35}, ${110 + Math.cos((deg * Math.PI) / 180) * 35})`}
              />
            ))}
            <circle cx="100" cy="110" fill="#fbbf24" r="18" />
          </svg>
        </div>
      </div>

      {/* ─── Floating Pill 1: Cyan – "Organize your organization efficiently" ─── */}
      <div className="cw-float-3 absolute top-[10%] left-[5%] z-30">
        <div className="rounded-full bg-[#0EA5E9] px-5 py-2.5 shadow-xl">
          <span className="whitespace-nowrap font-bold text-[13px] text-white">
            Organize your organization efficiently
          </span>
        </div>
      </div>

      {/* ─── White Card 1: Organization created ─── */}
      <div className="cw-float-4 absolute top-[36%] left-[3%] z-30">
        <div className="flex min-w-[230px] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <svg
              className="size-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-bold text-gray-900 text-sm">
            Organization created
          </p>
        </div>
      </div>

      {/* ─── Pill: "5 channels" ─── */}
      <div className="cw-float-1 absolute bottom-[46%] left-[10%] z-30">
        <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 shadow-lg">
          <div className="flex -space-x-1">
            {["bg-purple-300", "bg-blue-300", "bg-pink-300"].map((c, i) => (
              <div
                className={cn("size-4 rounded-full border-2 border-white", c)}
                key={i}
              />
            ))}
          </div>
          <span className="font-bold text-gray-600 text-xs">5 channels</span>
        </div>
      </div>

      {/* ─── Floating Pill 2: Red – "Collaboration across teams" ─── */}
      <div className="cw-float-5 absolute bottom-[34%] left-[18%] z-30">
        <div className="rounded-full bg-[#E11D48] px-5 py-2 shadow-lg">
          <span className="whitespace-nowrap font-bold text-[13px] text-white">
            Collaboration across teams
          </span>
        </div>
      </div>

      {/* ─── White Card 2: Structured teams and shared resources ─── */}
      <div className="cw-float-3 absolute bottom-[5%] left-[4%] z-30">
        <div className="flex min-w-[260px] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
            <svg
              className="size-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path
                d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20M2 12h20"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-bold text-gray-900 text-sm">
            Structured teams and shared resources
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * CentralizedOrgMockup — For "Create an organization for your team"
 * Shows an organization onboarding/setup panel (like Machu Picchu section)
 */
export function CentralizedOrgMockup() {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
      <div className="flex items-center gap-2 border-gray-100 border-b bg-gray-50 px-5 py-3">
        <div className="size-2.5 rounded-full bg-red-400" />
        <div className="size-2.5 rounded-full bg-yellow-400" />
        <div className="size-2.5 rounded-full bg-green-400" />
        <span className="ml-3 font-bold text-gray-400 text-xs">
          Create Organization
        </span>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-center gap-4 rounded-2xl border border-purple-100 bg-purple-50 p-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-purple-100">
            <svg
              className="size-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Workholo Inc.</p>
            <p className="text-[10px] text-gray-500">
              42 members · 8 channels · Owner: You
            </p>
          </div>
          <div className="ml-auto rounded-full bg-green-100 px-2.5 py-1 font-bold text-[9px] text-green-600 uppercase">
            Active
          </div>
        </div>

        <div className="space-y-2">
          {[
            { label: "Channels", count: 8, color: "bg-blue-500" },
            { label: "Members", count: 42, color: "bg-purple-500" },
            { label: "Teams", count: 5, color: "bg-emerald-500" },
          ].map((item) => (
            <div
              className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
              key={item.label}
            >
              <div className="flex items-center gap-2">
                <div className={cn("size-2.5 rounded-full", item.color)} />
                <span className="font-semibold text-gray-700 text-xs">
                  {item.label}
                </span>
              </div>
              <span className="font-bold text-gray-500 text-xs">
                {item.count}
              </span>
            </div>
          ))}
        </div>

        <div className="flex h-9 w-full items-center justify-center rounded-xl bg-purple-600">
          <span className="font-bold text-white text-xs">+ Invite Members</span>
        </div>
      </div>
    </div>
  );
}

/**
 * CentralizedChannelsMockup — For "Add channels and structured teams"
 * Grand Central Station equivalent: a busy team channels panel
 */
export function CentralizedChannelsMockup() {
  const teams = [
    { name: "Sales", channels: 4, members: 12, color: "bg-blue-500" },
    { name: "Marketing", channels: 3, members: 8, color: "bg-pink-500" },
    { name: "Engineering", channels: 6, members: 20, color: "bg-indigo-500" },
    { name: "Design", channels: 2, members: 5, color: "bg-amber-500" },
    { name: "Operations", channels: 3, members: 10, color: "bg-emerald-500" },
  ];

  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-900 shadow-2xl">
      <div className="flex items-center justify-between border-gray-700 border-b bg-gray-800 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500">
            <svg
              className="size-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-bold text-sm text-white">Workholo Inc.</span>
        </div>
        <div className="rounded-full bg-purple-500 px-2.5 py-1 font-bold text-[9px] text-white">
          + Add Team
        </div>
      </div>

      <div className="space-y-3 p-4">
        {teams.map((team) => (
          <div
            className="flex items-center justify-between rounded-xl bg-gray-800 px-4 py-3 transition-colors hover:bg-gray-750"
            key={team.name}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg font-bold text-white text-xs",
                  team.color
                )}
              >
                {team.name[0]}
              </div>
              <div>
                <p className="font-bold text-sm text-white">{team.name}</p>
                <p className="text-[10px] text-gray-400">
                  {team.channels} channels · {team.members} members
                </p>
              </div>
            </div>
            <div className="flex -space-x-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  className="size-5 rounded-full border-2 border-gray-800 bg-gray-600"
                  key={i}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * CentralizedWorkMgmtMockup — For "Centralized work management"
 * Train sunset equivalent: a unified task/project management view
 */
export function CentralizedWorkMgmtMockup() {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-gray-900 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-400" />
            <div className="size-3 rounded-full bg-yellow-400" />
            <div className="size-3 rounded-full bg-green-400" />
          </div>
          <span className="font-bold text-gray-300 text-xs">
            Centralized Dashboard
          </span>
        </div>
        <div className="flex gap-2">
          {["Messages", "Files", "Tasks"].map((tab) => (
            <div
              className={cn(
                "rounded px-3 py-1 font-bold text-[10px]",
                tab === "Tasks" ? "bg-purple-600 text-white" : "text-gray-400"
              )}
              key={tab}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      <div className="grid h-[calc(100%-48px)] grid-cols-3 gap-4 bg-gray-50 p-5">
        {[
          {
            label: "To Do",
            items: ["Onboard new members", "Set up weekly sync"],
            color: "border-gray-200",
          },
          {
            label: "In Progress",
            items: ["Q1 Report draft", "Update org channels"],
            color: "border-blue-200",
          },
          {
            label: "Done",
            items: ["Team kickoff", "Role assignments"],
            color: "border-green-200",
          },
        ].map((col) => (
          <div
            className={cn(
              "space-y-2 rounded-xl border-2 bg-white p-3",
              col.color
            )}
            key={col.label}
          >
            <p className="font-bold text-[10px] text-gray-500 uppercase tracking-wider">
              {col.label}
            </p>
            {col.items.map((item) => (
              <div
                className="rounded-lg border border-gray-100 bg-gray-50 p-2 shadow-sm"
                key={item}
              >
                <p className="font-semibold text-[10px] text-gray-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
