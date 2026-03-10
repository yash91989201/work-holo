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
        className="sc-float-1 absolute top-[5%] right-[10%] z-20 size-56 overflow-hidden rounded-full border-4 border-white shadow-2xl sm:size-72 lg:size-72"
        style={{
          background:
            "linear-gradient(135deg, #7aa8c4 0%, #4a7fa5 40%, #2c5f80 60%, #c8d8b8 100%)",
        }}
      >
        {/* Coded mountain scene */}
        <div className="relative size-full">
          {/* Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#B8CCE4] via-[#9AB8D3] to-[#D5E8C8]" />
          {/* Mountain silhouettes */}
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
            {/* Terrain base */}
            <rect fill="#b5c99a" height="70" width="200" x="0" y="130" />
            {/* Snow caps */}
            <polygon fill="white" opacity="0.9" points="100,30 115,60 85,60" />
          </svg>
        </div>
      </div>

      {/* ─── Small circle (bottom-right) — Flower styled coded background ─── */}
      <div
        className="sc-float-2 absolute right-[2%] bottom-[8%] z-10 size-36 overflow-hidden rounded-full border-4 border-white shadow-xl sm:size-48"
        style={{
          background:
            "linear-gradient(135deg, #f9a8d4 0%, #fbbf24 50%, #34d399 100%)",
        }}
      >
        <div className="relative size-full">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-blue-100 to-sky-300" />
          {/* Stylised flower */}
          <svg className="absolute inset-0 size-full" viewBox="0 0 200 200">
            <circle cx="100" cy="200" fill="#86efac" r="80" />
            {/* Petals */}
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

      {/* ─── Floating Pill 1: Cyan "Organize your team efficiently" ─── */}
      <div className="sc-float-3 absolute top-[10%] left-[5%] z-30">
        <div className="rounded-full bg-[#0EA5E9] px-5 py-2.5 shadow-xl">
          <span className="whitespace-nowrap font-bold text-[13px] text-white">
            Organize your team efficiently
          </span>
        </div>
      </div>

      {/* ─── White Card 1: Channel created by Admin ─── */}
      <div className="sc-float-4 absolute top-[34%] left-[2%] z-30">
        <div className="flex min-w-[230px] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <span className="font-extrabold text-[#0EA5E9] text-lg">C</span>
          </div>
          <p className="font-bold text-gray-900 text-sm">
            Channel created by Admin
          </p>
        </div>
      </div>

      {/* ─── Pill: "3 members" ─── */}
      <div className="sc-float-1 absolute bottom-[46%] left-[8%] z-30">
        <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 shadow-lg">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                className={cn(
                  "size-4 rounded-full border-2 border-white",
                  ["bg-purple-300", "bg-blue-300", "bg-pink-300"][i - 1]
                )}
                key={i}
              />
            ))}
          </div>
          <span className="font-bold text-gray-600 text-xs">3 members</span>
        </div>
      </div>

      {/* ─── Floating Pill 2: Red "Collaboration in action" ─── */}
      <div className="sc-float-5 absolute bottom-[34%] left-[18%] z-30">
        <div className="rounded-full bg-[#E11D48] px-5 py-2 shadow-lg">
          <span className="whitespace-nowrap font-bold text-[13px] text-white">
            Collaboration in action
          </span>
        </div>
      </div>

      {/* ─── White Card 2: Team updates and shared files ─── */}
      <div className="sc-float-3 absolute bottom-[5%] left-[4%] z-30">
        <div className="flex min-w-[240px] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
            <svg
              className="size-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-bold text-gray-900 text-sm">
            Team updates and shared files
          </p>
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
    <div className="flex h-[380px] w-full overflow-hidden rounded-3xl bg-gray-900 shadow-2xl">
      {/* Sidebar */}
      <div className="flex w-52 shrink-0 flex-col border-gray-800 border-r bg-[#1a1d2e] p-4">
        <div className="mb-8 flex items-center gap-2">
          <div className="size-7 rounded bg-purple-500" />
          <div className="h-2.5 w-20 rounded bg-gray-700" />
        </div>
        <p className="mb-3 font-bold text-[9px] text-gray-500 uppercase tracking-widest">
          Channels
        </p>
        <div className="space-y-1">
          {channels.map((c) => (
            <div
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2",
                c.active
                  ? "bg-purple-600"
                  : "transition-colors hover:bg-gray-800"
              )}
              key={c.name}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">#</span>
                <span
                  className={cn(
                    "font-semibold text-xs",
                    c.active ? "text-white" : "text-gray-400"
                  )}
                >
                  {c.name}
                </span>
              </div>
              {c.unread > 0 && (
                <span className="flex size-4 items-center justify-center rounded-full bg-purple-500 font-bold text-[8px] text-white">
                  {c.unread}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 border-dashed px-3 py-2 transition-colors hover:border-purple-500">
            <div className="flex size-3 items-center justify-center rounded-full bg-gray-700">
              <span className="font-bold text-[8px] text-gray-300">+</span>
            </div>
            <span className="text-[10px] text-gray-500">Add channel</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center gap-2 border-gray-800 border-b pb-4">
          <span className="text-gray-400 text-sm">#</span>
          <span className="font-bold text-sm text-white">sales</span>
          <span className="ml-2 text-[9px] text-gray-500">28 members</span>
        </div>
        <div className="flex-1 space-y-4 overflow-hidden">
          {[
            {
              user: "A",
              name: "Alice",
              msg: "New leads added to the pipeline!",
              color: "bg-blue-500",
            },
            {
              user: "B",
              name: "Ben",
              msg: "Great work team! Let's hit the targets 🚀",
              color: "bg-green-500",
            },
            {
              user: "C",
              name: "Clara",
              msg: "I'll send the updated deck now.",
              color: "bg-pink-500",
            },
          ].map((m) => (
            <div className="flex items-start gap-3" key={m.user}>
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full font-bold text-[10px] text-white",
                  m.color
                )}
              >
                {m.user}
              </div>
              <div>
                <p className="mb-0.5 font-bold text-[10px] text-gray-300">
                  {m.name}
                </p>
                <div className="max-w-[200px] rounded-xl rounded-tl-none bg-gray-800 px-3 py-2 text-gray-200 text-xs">
                  {m.msg}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex h-9 w-full items-center rounded-xl border border-gray-700 bg-gray-800 px-4">
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
    {
      initials: "AR",
      name: "Alex Rivera",
      channels: 5,
      color: "bg-indigo-500",
    },
    { initials: "SC", name: "Sarah Chen", channels: 3, color: "bg-pink-500" },
    { initials: "MJ", name: "Mike Jordan", channels: 7, color: "bg-amber-500" },
    {
      initials: "EW",
      name: "Emma Wilson",
      channels: 2,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-gray-100 border-b bg-gray-50 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="size-2.5 rounded-full bg-red-400" />
          <div className="size-2.5 rounded-full bg-yellow-400" />
          <div className="size-2.5 rounded-full bg-green-400" />
          <span className="ml-2 font-bold text-gray-400 text-xs">
            Member Assignments
          </span>
        </div>
        <div className="h-6 w-20 rounded-md bg-purple-500" />
      </div>

      {/* Search */}
      <div className="border-gray-50 border-b px-5 py-3">
        <div className="flex h-8 w-full items-center rounded-lg bg-gray-100 px-3">
          <svg
            className="mr-2 size-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <div className="h-2 w-32 rounded bg-gray-200" />
        </div>
      </div>

      {/* Member rows */}
      <div className="space-y-3 px-5 py-3">
        {members.map((m) => (
          <div
            className="flex items-center justify-between border-gray-50 border-b py-2"
            key={m.name}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full font-extrabold text-[11px] text-white",
                  m.color
                )}
              >
                {m.initials}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                <p className="text-[10px] text-gray-400">
                  {m.channels} channels
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex h-6 items-center rounded-full bg-purple-100 px-2 font-bold text-[9px] text-purple-700">
                Edit
              </div>
              <div className="flex h-6 items-center rounded-full bg-gray-100 px-2 font-bold text-[9px] text-gray-500">
                Assign
              </div>
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
    <div className="aspect-video w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-3 bg-gray-900 px-5 py-4">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-red-400" />
          <div className="size-3 rounded-full bg-yellow-400" />
          <div className="size-3 rounded-full bg-green-400" />
        </div>
        <span className="font-bold text-gray-300 text-xs">Team Activity</span>
      </div>

      {/* Body */}
      <div className="h-full space-y-4 bg-gray-50 p-5">
        {[
          {
            icon: "📁",
            title: "Q1 Report.pdf",
            sub: "Shared by Sarah · 2m ago",
            color: "bg-blue-50",
          },
          {
            icon: "✅",
            title: "Task #142 closed",
            sub: "Completed by Alex · 15m ago",
            color: "bg-green-50",
          },
          {
            icon: "💬",
            title: "15 new messages",
            sub: "In #sales-team channel · 1h ago",
            color: "bg-purple-50",
          },
          {
            icon: "👥",
            title: "Emma added to #design",
            sub: "By Admin · 2h ago",
            color: "bg-amber-50",
          },
        ].map((item) => (
          <div
            className={cn(
              "flex items-center gap-4 rounded-xl px-4 py-3 shadow-sm",
              item.color
            )}
            key={item.title}
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-bold text-gray-900 text-sm">{item.title}</p>
              <p className="text-[10px] text-gray-500">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
