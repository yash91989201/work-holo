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
      <div
        className="cw-float-1 absolute right-[10%] top-[5%] z-20 size-56 overflow-hidden rounded-full border-4 border-white shadow-2xl sm:size-72 lg:size-72"
      >
        <div className="relative size-full">
          <div className="absolute inset-0 bg-gradient-to-b from-[#A8C4D8] via-[#88ACCB] to-[#C5D8B5]" />
          <svg className="absolute inset-0 size-full" viewBox="0 0 200 200">
            <polygon points="100,30 160,140 40,140" fill="#5a8fa8" opacity="0.9" />
            <polygon points="60,60 130,140 -10,140" fill="#7aaec8" opacity="0.7" />
            <polygon points="150,50 220,140 80,140" fill="#4a7a9a" opacity="0.8" />
            <rect x="0" y="130" width="200" height="70" fill="#b5c99a" />
            <polygon points="100,30 115,60 85,60" fill="white" opacity="0.9" />
          </svg>
        </div>
      </div>

      {/* ─── Small circle (bottom-right) — Flowers ─── */}
      <div
        className="cw-float-2 absolute bottom-[8%] right-[2%] z-10 size-36 overflow-hidden rounded-full border-4 border-white shadow-xl sm:size-48"
      >
        <div className="relative size-full">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-200 to-sky-300" />
          <svg className="absolute inset-0 size-full" viewBox="0 0 200 200">
            <circle cx="100" cy="200" r="80" fill="#86efac" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <ellipse
                key={i}
                cx={100 + Math.sin((deg * Math.PI) / 180) * 35}
                cy={110 + Math.cos((deg * Math.PI) / 180) * 35}
                rx="18" ry="28"
                fill="#f9a8d4" opacity="0.85"
                transform={`rotate(${deg}, ${100 + Math.sin((deg * Math.PI) / 180) * 35}, ${110 + Math.cos((deg * Math.PI) / 180) * 35})`}
              />
            ))}
            <circle cx="100" cy="110" r="18" fill="#fbbf24" />
          </svg>
        </div>
      </div>

      {/* ─── Floating Pill 1: Cyan – "Organize your organization efficiently" ─── */}
      <div className="cw-float-3 absolute left-[5%] top-[10%] z-30">
        <div className="rounded-full bg-[#0EA5E9] px-5 py-2.5 shadow-xl">
          <span className="whitespace-nowrap text-[13px] font-bold text-white">
            Organize your organization efficiently
          </span>
        </div>
      </div>

      {/* ─── White Card 1: Organization created ─── */}
      <div className="cw-float-4 absolute left-[3%] top-[36%] z-30">
        <div className="flex min-w-[230px] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <svg className="size-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-900">Organization created</p>
        </div>
      </div>

      {/* ─── Pill: "5 channels" ─── */}
      <div className="cw-float-1 absolute left-[10%] bottom-[46%] z-30">
        <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 shadow-lg">
          <div className="flex -space-x-1">
            {["bg-purple-300", "bg-blue-300", "bg-pink-300"].map((c, i) => (
              <div key={i} className={cn("size-4 rounded-full border-2 border-white", c)} />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-600">5 channels</span>
        </div>
      </div>

      {/* ─── Floating Pill 2: Red – "Collaboration across teams" ─── */}
      <div className="cw-float-5 absolute bottom-[34%] left-[18%] z-30">
        <div className="rounded-full bg-[#E11D48] px-5 py-2 shadow-lg">
          <span className="whitespace-nowrap text-[13px] font-bold text-white">
            Collaboration across teams
          </span>
        </div>
      </div>

      {/* ─── White Card 2: Structured teams and shared resources ─── */}
      <div className="cw-float-3 absolute bottom-[5%] left-[4%] z-30">
        <div className="flex min-w-[260px] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
            <svg className="size-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20M2 12h20" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-900">Structured teams and shared resources</p>
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
    <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100">
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
        <div className="size-2.5 rounded-full bg-red-400" />
        <div className="size-2.5 rounded-full bg-yellow-400" />
        <div className="size-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-xs font-bold text-gray-400">Create Organization</span>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
          <div className="size-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <svg className="size-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Workholo Inc.</p>
            <p className="text-[10px] text-gray-500">42 members · 8 channels · Owner: You</p>
          </div>
          <div className="ml-auto px-2.5 py-1 rounded-full bg-green-100 text-[9px] font-bold text-green-600 uppercase">Active</div>
        </div>

        <div className="space-y-2">
          {[
            { label: "Channels", count: 8, color: "bg-blue-500" },
            { label: "Members", count: 42, color: "bg-purple-500" },
            { label: "Teams", count: 5, color: "bg-emerald-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2">
                <div className={cn("size-2.5 rounded-full", item.color)} />
                <span className="text-xs font-semibold text-gray-700">{item.label}</span>
              </div>
              <span className="text-xs font-bold text-gray-500">{item.count}</span>
            </div>
          ))}
        </div>

        <div className="h-9 w-full rounded-xl bg-purple-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">+ Invite Members</span>
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
    <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
      <div className="bg-gray-800 px-5 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-purple-500 flex items-center justify-center">
            <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-white text-sm font-bold">Workholo Inc.</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-purple-500 text-white text-[9px] font-bold">+ Add Team</div>
      </div>

      <div className="p-4 space-y-3">
        {teams.map((team) => (
          <div key={team.name} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-750 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn("size-8 rounded-lg flex items-center justify-center text-white text-xs font-bold", team.color)}>{team.name[0]}</div>
              <div>
                <p className="text-sm font-bold text-white">{team.name}</p>
                <p className="text-[10px] text-gray-400">{team.channels} channels · {team.members} members</p>
              </div>
            </div>
            <div className="flex -space-x-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="size-5 rounded-full bg-gray-600 border-2 border-gray-800" />
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
    <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100">
      <div className="bg-gray-900 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-400" />
            <div className="size-3 rounded-full bg-yellow-400" />
            <div className="size-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-bold text-gray-300">Centralized Dashboard</span>
        </div>
        <div className="flex gap-2">
          {["Messages", "Files", "Tasks"].map((tab) => (
            <div key={tab} className={cn("px-3 py-1 rounded text-[10px] font-bold", tab === "Tasks" ? "bg-purple-600 text-white" : "text-gray-400")}>{tab}</div>
          ))}
        </div>
      </div>

      <div className="p-5 bg-gray-50 grid grid-cols-3 gap-4 h-[calc(100%-48px)]">
        {[
          { label: "To Do", items: ["Onboard new members", "Set up weekly sync"], color: "border-gray-200" },
          { label: "In Progress", items: ["Q1 Report draft", "Update org channels"], color: "border-blue-200" },
          { label: "Done", items: ["Team kickoff", "Role assignments"], color: "border-green-200" },
        ].map((col) => (
          <div key={col.label} className={cn("rounded-xl border-2 p-3 space-y-2 bg-white", col.color)}>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{col.label}</p>
            {col.items.map((item) => (
              <div key={item} className="p-2 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-semibold text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
