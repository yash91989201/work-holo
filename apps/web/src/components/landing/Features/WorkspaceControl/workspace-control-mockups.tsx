import { cn } from "@/lib/utils";

/**
 * WorkspaceControlMockups
 * ─────────────────────────────────────────────────────
 * Coded UI panels for the Workspace Control feature page.
 */

/**
 * WorkspaceHeroMockup — Hero right side
 * Overlapping circular images with floating pills and cards positioned OUTSIDE.
 * Everything floats up and down for a dynamic feel.
 */
export function WorkspaceHeroMockup() {
  return (
    <div className="relative flex h-[550px] w-full scale-75 items-center justify-center md:scale-90 lg:scale-[1.05]">
      <style>
        {`
          @keyframes float-hero {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes float-hero-delayed {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .animate-float-hero { animation: float-hero 6s ease-in-out infinite; }
          .animate-float-hero-slow { animation: float-hero 8s ease-in-out infinite; }
          .animate-float-hero-delayed { animation: float-hero-delayed 7s ease-in-out infinite 1s; }
        `}
      </style>

      {/* Main Container */}
      <div className="relative h-[600px] w-[800px]">
        {/* Connecting Lines SVG */}
        <svg
          className="pointer-events-none absolute inset-0 z-10 size-full"
          fill="none"
          viewBox="0 0 800 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Teal Pill Line */}
          <path
            className="animate-float-hero-slow"
            d="M 330 180 C 400 180 450 210 480 250"
            stroke="#CBD5E1"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
          {/* Organization Card Line */}
          <path
            className="animate-float-hero"
            d="M 390 290 C 450 290 500 310 520 340"
            stroke="#CBD5E1"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
          {/* Red Pill Line */}
          <path
            className="animate-float-hero-delayed"
            d="M 400 440 C 500 440 550 480 600 520"
            stroke="#CBD5E1"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
          {/* Shared Resources Line */}
          <path
            className="animate-float-hero-slow"
            d="M 380 520 C 480 520 530 550 580 570"
            stroke="#CBD5E1"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>

        {/* Top circular image - Mountains (Large) */}
        <div className="absolute top-[100px] right-[40px] z-20 size-[380px] animate-float-hero overflow-hidden rounded-full border-8 border-white shadow-2xl">
          <img
            alt="Organization environment"
            className="size-full object-cover"
            src="https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1000&q=80"
          />
        </div>

        {/* Bottom circular image - Flowers (Smaller) */}
        <div className="absolute right-[30px] bottom-[20px] z-30 size-[240px] animate-float-hero-delayed overflow-hidden rounded-full border-8 border-white shadow-2xl">
          <img
            alt="Team flowers"
            className="size-full object-cover"
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80"
          />
        </div>

        {/* Floating elements positioned OUTSIDE (to the left of circles) */}

        {/* Teal Pill */}
        <div className="absolute top-[160px] left-[130px] z-50 animate-float-hero-slow">
          <div className="whitespace-nowrap rounded-full bg-[#4ebcd5] px-5 py-2.5 font-bold text-[12px] text-white shadow-xl">
            Organize your organization efficiently
          </div>
        </div>

        {/* Organization created Card */}
        <div className="absolute top-[260px] left-[170px] z-50 animate-float-hero">
          <div className="flex min-w-[240px] items-center gap-4 rounded-xl border border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500 shadow-sm">
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="20"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div>
              <p className="mb-1.5 font-bold text-[13px] text-gray-900 leading-none">
                Organization created
              </p>
              <p className="font-medium text-[11px] text-gray-500">
                Workspace ready
              </p>
            </div>
          </div>

          {/* Channels Pill (attached to card) */}
          <div className="mt-4 ml-10">
            <div className="flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    className="size-5 overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow-sm"
                    key={i}
                  >
                    <img
                      alt="user"
                      className="size-full object-cover"
                      src={`https://i.pravatar.cc/100?u=${i + 18}`}
                    />
                  </div>
                ))}
              </div>
              <span className="font-bold text-[11px] text-gray-700">
                5 channels
              </span>
            </div>
          </div>
        </div>

        {/* Red Pill */}
        <div className="absolute bottom-[140px] left-[200px] z-50 animate-float-hero-delayed">
          <div className="whitespace-nowrap rounded-full bg-[#cc2a5d] px-5 py-2.5 font-bold text-[12px] text-white shadow-xl">
            Collaboration across teams
          </div>
        </div>

        {/* Structured teams Card */}
        <div className="absolute bottom-[40px] left-[150px] z-50 animate-float-hero-slow">
          <div className="flex min-w-[260px] items-center gap-4 rounded-xl border border-white/20 bg-white/80 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 shadow-sm">
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="20"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div>
              <p className="mb-1.5 font-bold text-[13px] text-gray-900 leading-tight">
                Structured teams and shared resources
              </p>
              <p className="font-medium text-[11px] text-gray-500">
                Enterprise ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * WorkspaceTeamsMockup — Section 2 "Add channels and structured teams"
 * A workspace sidebar with #channels and a member list panel.
 */
export function WorkspaceTeamsMockup() {
  return (
    <div className="flex h-[350px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      {/* Sidebar */}
      <div className="flex w-48 shrink-0 flex-col bg-gray-900 p-4">
        <div className="mb-8 flex items-center gap-2">
          <div className="size-6 rounded bg-blue-500" />
          <div className="h-2 w-20 rounded bg-gray-700" />
        </div>

        <div className="space-y-4">
          <div className="mb-2 h-1.5 w-12 rounded bg-gray-600" />
          {[1, 2, 3, 4].map((i) => (
            <div className="flex items-center gap-2" key={i}>
              <span className="text-gray-500 text-xs">#</span>
              <div
                className={cn(
                  "h-1.5 rounded bg-gray-700",
                  i === 2 ? "w-24 bg-gray-500" : "w-16"
                )}
              />
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex h-8 w-full items-center justify-center rounded border border-gray-700 border-dashed">
            <div className="size-3 rounded-full bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Main Content / Members Panel */}
      <div className="flex flex-1 flex-col bg-gray-50 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-gray-300" />
          <div className="h-8 w-24 rounded bg-gray-900" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
              key={i}
            >
              <div className="size-8 overflow-hidden rounded-full bg-gray-100">
                <img
                  alt="user"
                  className="size-full object-cover"
                  src={`https://i.pravatar.cc/100?u=${i + 20}`}
                />
              </div>
              <div className="flex-1">
                <div className="mb-1 h-2 w-16 rounded bg-gray-300" />
                <div className="h-1.5 w-10 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex h-12 w-full items-center rounded-lg border border-gray-200 bg-white px-4 shadow-sm">
          <div className="mr-3 size-6 rounded bg-gray-100" />
          <div className="h-2 w-48 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

/**
 * WorkspaceMembersMockup — Section 3 "Assign members effectively"
 * A member management UI with role badges.
 */
export function WorkspaceMembersMockup() {
  const members = [
    { name: "Alex Rivera", role: "Admin", avatar: "21" },
    { name: "Sarah Chen", role: "Editor", avatar: "22" },
    { name: "Mike Jordan", role: "Viewer", avatar: "23" },
    { name: "Emma Wilson", role: "Admin", avatar: "24" },
  ];

  return (
    <div className="flex aspect-video w-full flex-col gap-4 rounded-3xl border border-gray-200 bg-[#f8fafc] p-6 shadow-xl">
      <div className="flex items-center justify-between border-gray-100 border-b pb-4">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="flex size-8 items-center justify-center rounded-full bg-blue-500 font-bold text-white text-xs">
          +
        </div>
      </div>
      <div className="space-y-3">
        {members.map((m) => (
          <div
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
            key={m.name}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 overflow-hidden rounded-full bg-gray-100">
                <img
                  alt={m.name}
                  className="size-full object-cover"
                  src={`https://i.pravatar.cc/100?u=${m.avatar}`}
                />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                <p className="font-medium text-gray-500 text-xs">{m.role}</p>
              </div>
            </div>
            <div className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-[10px] text-blue-600 uppercase tracking-wider">
              {m.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
