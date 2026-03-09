import { cn } from "@/lib/utils";

/**
 * StructuredCommMockups
 * ─────────────────────────────────────────────────────
 * Fully coded UI panels for the Structured Communication feature page.
 * No external image dependencies for reliability.
 */

/* ─── Shared CSS animation injected once ─── */
const ANIM_STYLES = `
  @keyframes sc-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
  }
  @keyframes sc-float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes sc-float-mid {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .sc-float-1 { animation: sc-float 6s ease-in-out infinite; }
  .sc-float-2 { animation: sc-float-slow 8s ease-in-out infinite 1s; }
  .sc-float-3 { animation: sc-float-mid 7s ease-in-out infinite 0.5s; }
  .sc-float-4 { animation: sc-float 5.5s ease-in-out infinite 1.5s; }
  .sc-float-5 { animation: sc-float-slow 9s ease-in-out infinite 0.8s; }
`;

/**
 * StructuredCommHeroMockup
 * Matches reference: two overlapping circles (top-right large, bottom-right small)
 * with floating pill labels and white info cards positioned to the left.
 */
export function StructuredCommHeroMockup() {
  return (
    <div className="relative h-[520px] w-full select-none overflow-visible lg:h-[580px]">
      <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />

      {/* ─── Large circle (top-right) — Mountain styled coded background ─── */}
      <div
        className="sc-float-1 absolute right-[10%] top-[5%] z-20 size-56 overflow-hidden rounded-full border-4 border-white shadow-2xl sm:size-72 lg:size-72"
        style={{ background: "linear-gradient(135deg, #7aa8c4 0%, #4a7fa5 40%, #2c5f80 60%, #c8d8b8 100%)" }}
      >
        {/* Coded mountain scene */}
        <div className="relative size-full">
          {/* Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#B8CCE4] via-[#9AB8D3] to-[#D5E8C8]" />
          {/* Mountain silhouettes */}
          <svg className="absolute inset-0 size-full" viewBox="0 0 200 200">
            <polygon points="100,30 160,140 40,140" fill="#5a8fa8" opacity="0.9" />
            <polygon points="60,60 130,140 -10,140" fill="#7aaec8" opacity="0.7" />
            <polygon points="150,50 220,140 80,140" fill="#4a7a9a" opacity="0.8" />
            {/* Terrain base */}
            <rect x="0" y="130" width="200" height="70" fill="#b5c99a" />
            {/* Snow caps */}
            <polygon points="100,30 115,60 85,60" fill="white" opacity="0.9" />
          </svg>
        </div>
      </div>

      {/* ─── Small circle (bottom-right) — Flower styled coded background ─── */}
      <div
        className="sc-float-2 absolute bottom-[8%] right-[2%] z-10 size-36 overflow-hidden rounded-full border-4 border-white shadow-xl sm:size-48"
        style={{ background: "linear-gradient(135deg, #f9a8d4 0%, #fbbf24 50%, #34d399 100%)" }}
      >
        <div className="relative size-full">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-blue-100 to-sky-300" />
          {/* Stylised flower */}
          <svg className="absolute inset-0 size-full" viewBox="0 0 200 200">
            <circle cx="100" cy="200" r="80" fill="#86efac" />
            {/* Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <ellipse
                key={i}
                cx={100 + Math.sin((deg * Math.PI) / 180) * 35}
                cy={110 + Math.cos((deg * Math.PI) / 180) * 35}
                rx="18"
                ry="28"
                fill="#f9a8d4"
                opacity="0.85"
                transform={`rotate(${deg}, ${100 + Math.sin((deg * Math.PI) / 180) * 35}, ${110 + Math.cos((deg * Math.PI) / 180) * 35})`}
              />
            ))}
            <circle cx="100" cy="110" r="18" fill="#fbbf24" />
          </svg>
        </div>
      </div>

      {/* ─── Floating Pill 1: Cyan "Organize your team efficiently" ─── */}
      <div className="sc-float-3 absolute left-[5%] top-[10%] z-30">
        <div className="rounded-full bg-[#0EA5E9] px-5 py-2.5 shadow-xl">
          <span className="whitespace-nowrap text-[13px] font-bold text-white">
            Organize your team efficiently
          </span>
        </div>
      </div>

      {/* ─── White Card 1: Channel created by Admin ─── */}
      <div className="sc-float-4 absolute left-[2%] top-[34%] z-30">
        <div className="flex min-w-[230px] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <span className="text-lg font-extrabold text-[#0EA5E9]">C</span>
          </div>
          <p className="text-sm font-bold text-gray-900">Channel created by Admin</p>
        </div>
      </div>

      {/* ─── Pill: "3 members" ─── */}
      <div className="sc-float-1 absolute left-[8%] bottom-[46%] z-30">
        <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 shadow-lg">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("size-4 rounded-full border-2 border-white", ["bg-purple-300", "bg-blue-300", "bg-pink-300"][i - 1])} />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-600">3 members</span>
        </div>
      </div>

      {/* ─── Floating Pill 2: Red "Collaboration in action" ─── */}
      <div className="sc-float-5 absolute bottom-[34%] left-[18%] z-30">
        <div className="rounded-full bg-[#E11D48] px-5 py-2 shadow-lg">
          <span className="whitespace-nowrap text-[13px] font-bold text-white">
            Collaboration in action
          </span>
        </div>
      </div>

      {/* ─── White Card 2: Team updates and shared files ─── */}
      <div className="sc-float-3 absolute bottom-[5%] left-[4%] z-30">
        <div className="flex min-w-[240px] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
            <svg className="size-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-900">Team updates and shared files</p>
        </div>
      </div>
    </div>
  );
}

/**
 * StructuredChannelsMockup — For "Create channels for structured work"
 * A dark workspace panel with channel list (matches Machu Picchu section)
 */
export function StructuredChannelsMockup() {
  const channels = [
    { name: "marketing", unread: 3, active: false },
    { name: "sales", unread: 0, active: true },
    { name: "engineering", unread: 12, active: false },
    { name: "design", unread: 1, active: false },
    { name: "hr-general", unread: 0, active: false },
  ];

  return (
    <div className="w-full overflow-hidden rounded-3xl shadow-2xl bg-gray-900 flex h-[380px]">
      {/* Sidebar */}
      <div className="w-52 bg-[#1a1d2e] flex flex-col shrink-0 p-4 border-r border-gray-800">
        <div className="flex items-center gap-2 mb-8">
          <div className="size-7 rounded bg-purple-500" />
          <div className="h-2.5 w-20 rounded bg-gray-700" />
        </div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3">Channels</p>
        <div className="space-y-1">
          {channels.map((c) => (
            <div key={c.name} className={cn("flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer", c.active ? "bg-purple-600" : "hover:bg-gray-800 transition-colors")}>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">#</span>
                <span className={cn("text-xs font-semibold", c.active ? "text-white" : "text-gray-400")}>{c.name}</span>
              </div>
              {c.unread > 0 && (
                <span className="size-4 rounded-full bg-purple-500 text-white text-[8px] font-bold flex items-center justify-center">{c.unread}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-700 cursor-pointer hover:border-purple-500 transition-colors">
            <div className="size-3 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-300 text-[8px] font-bold">+</span>
            </div>
            <span className="text-[10px] text-gray-500">Add channel</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col p-5 gap-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
          <span className="text-gray-400 text-sm">#</span>
          <span className="text-white font-bold text-sm">sales</span>
          <span className="ml-2 text-[9px] text-gray-500">28 members</span>
        </div>
        <div className="space-y-4 flex-1 overflow-hidden">
          {[
            { user: "A", name: "Alice", msg: "New leads added to the pipeline!", color: "bg-blue-500" },
            { user: "B", name: "Ben", msg: "Great work team! Let's hit the targets 🚀", color: "bg-green-500" },
            { user: "C", name: "Clara", msg: "I'll send the updated deck now.", color: "bg-pink-500" },
          ].map((m) => (
            <div key={m.user} className="flex items-start gap-3">
              <div className={cn("size-7 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold", m.color)}>{m.user}</div>
              <div>
                <p className="text-[10px] font-bold text-gray-300 mb-0.5">{m.name}</p>
                <div className="bg-gray-800 text-gray-200 text-xs px-3 py-2 rounded-xl rounded-tl-none max-w-[200px]">{m.msg}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-9 w-full rounded-xl bg-gray-800 border border-gray-700 flex items-center px-4">
          <span className="text-gray-500 text-xs">Message #sales...</span>
        </div>
      </div>
    </div>
  );
}

/**
 * StructuredMembersMockup — For "Assign members to channels" (Station section)
 * Shows a member assignment panel.
 */
export function StructuredMembersMockup() {
  const members = [
    { initials: "AR", name: "Alex Rivera", channels: 5, color: "bg-indigo-500" },
    { initials: "SC", name: "Sarah Chen", channels: 3, color: "bg-pink-500" },
    { initials: "MJ", name: "Mike Jordan", channels: 7, color: "bg-amber-500" },
    { initials: "EW", name: "Emma Wilson", channels: 2, color: "bg-emerald-500" },
  ];

  return (
    <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-2.5 rounded-full bg-red-400" />
          <div className="size-2.5 rounded-full bg-yellow-400" />
          <div className="size-2.5 rounded-full bg-green-400" />
          <span className="ml-2 text-xs font-bold text-gray-400">Member Assignments</span>
        </div>
        <div className="h-6 w-20 rounded-md bg-purple-500" />
      </div>

      {/* Search */}
      <div className="px-5 py-3 border-b border-gray-50">
        <div className="h-8 w-full rounded-lg bg-gray-100 flex items-center px-3">
          <svg className="size-3 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <div className="h-2 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Member rows */}
      <div className="px-5 py-3 space-y-3">
        {members.map((m) => (
          <div key={m.name} className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className={cn("size-9 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold", m.color)}>{m.initials}</div>
              <div>
                <p className="text-sm font-bold text-gray-900">{m.name}</p>
                <p className="text-[10px] text-gray-400">{m.channels} channels</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 px-2 rounded-full bg-purple-100 text-purple-700 text-[9px] font-bold flex items-center">Edit</div>
              <div className="h-6 px-2 rounded-full bg-gray-100 text-gray-500 text-[9px] font-bold flex items-center">Assign</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * StructuredCollabMockup — For "Collaborate and manage efficiently" (Train Sunset section)
 * A "team feed" activity panel.
 */
export function StructuredCollabMockup() {
  return (
    <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100">
      {/* Title bar */}
      <div className="bg-gray-900 px-5 py-4 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-red-400" />
          <div className="size-3 rounded-full bg-yellow-400" />
          <div className="size-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs font-bold text-gray-300">Team Activity</span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 bg-gray-50 h-full">
        {[
          { icon: "📁", title: "Q1 Report.pdf", sub: "Shared by Sarah · 2m ago", color: "bg-blue-50" },
          { icon: "✅", title: "Task #142 closed", sub: "Completed by Alex · 15m ago", color: "bg-green-50" },
          { icon: "💬", title: "15 new messages", sub: "In #sales-team channel · 1h ago", color: "bg-purple-50" },
          { icon: "👥", title: "Emma added to #design", sub: "By Admin · 2h ago", color: "bg-amber-50" },
        ].map((item) => (
          <div key={item.title} className={cn("flex items-center gap-4 rounded-xl px-4 py-3 shadow-sm", item.color)}>
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{item.title}</p>
              <p className="text-[10px] text-gray-500">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
