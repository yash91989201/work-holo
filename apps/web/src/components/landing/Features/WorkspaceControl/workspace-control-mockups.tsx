import type { ReactNode } from "react";
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
    <div className="relative w-full h-[550px] flex items-center justify-center scale-75 md:scale-90 lg:scale-[1.05]">
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
      <div className="relative w-[800px] h-[600px]">
        
        {/* Connecting Lines SVG */}
        <svg
          className="absolute inset-0 size-full pointer-events-none z-10"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Teal Pill Line */}
          <path d="M 330 180 C 400 180 450 210 480 250" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" className="animate-float-hero-slow" />
          {/* Organization Card Line */}
          <path d="M 390 290 C 450 290 500 310 520 340" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" className="animate-float-hero" />
          {/* Red Pill Line */}
          <path d="M 400 440 C 500 440 550 480 600 520" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" className="animate-float-hero-delayed" />
          {/* Shared Resources Line */}
          <path d="M 380 520 C 480 520 530 550 580 570" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" className="animate-float-hero-slow" />
        </svg>

        {/* Top circular image - Mountains (Large) */}
        <div className="absolute top-[100px] right-[40px] size-[380px] rounded-full overflow-hidden border-8 border-white shadow-2xl z-20 animate-float-hero">
          <img
            src="https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1000&q=80"
            alt="Organization environment"
            className="size-full object-cover"
          />
        </div>

        {/* Bottom circular image - Flowers (Smaller) */}
        <div className="absolute bottom-[20px] right-[30px] size-[240px] rounded-full overflow-hidden border-8 border-white shadow-2xl z-30 animate-float-hero-delayed">
          <img
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80"
            alt="Team flowers"
            className="size-full object-cover"
          />
        </div>

        {/* Floating elements positioned OUTSIDE (to the left of circles) */}
        
        {/* Teal Pill */}
        <div className="absolute top-[160px] left-[130px] z-50 animate-float-hero-slow">
           <div className="bg-[#4ebcd5] text-white px-5 py-2.5 rounded-full text-[12px] font-bold shadow-xl whitespace-nowrap">
             Organize your organization efficiently
           </div>
        </div>

        {/* Organization created Card */}
        <div className="absolute top-[260px] left-[170px] z-50 animate-float-hero">
           <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl flex items-center gap-4 border border-white/20 min-w-[240px]">
             <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
               </svg>
             </div>
             <div>
               <p className="text-[13px] font-bold text-gray-900 leading-none mb-1.5">Organization created</p>
               <p className="text-[11px] text-gray-500 font-medium">Workspace ready</p>
             </div>
           </div>

           {/* Channels Pill (attached to card) */}
           <div className="mt-4 ml-10">
              <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20 self-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="size-5 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?u=${i + 18}`} alt="user" className="size-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-gray-700">5 channels</span>
              </div>
           </div>
        </div>

        {/* Red Pill */}
        <div className="absolute bottom-[140px] left-[200px] z-50 animate-float-hero-delayed">
          <div className="bg-[#cc2a5d] text-white px-5 py-2.5 rounded-full text-[12px] font-bold shadow-xl whitespace-nowrap">
            Collaboration across teams
          </div>
        </div>

        {/* Structured teams Card */}
        <div className="absolute bottom-[40px] left-[150px] z-50 animate-float-hero-slow">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-2xl flex items-center gap-4 border border-white/20 min-w-[260px]">
             <div className="size-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 shadow-sm">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                 <circle cx="12" cy="12" r="10" />
                 <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                 <path d="M2 12h20" />
               </svg>
             </div>
             <div>
               <p className="text-[13px] font-bold text-gray-900 leading-tight mb-1.5">Structured teams and shared resources</p>
               <p className="text-[11px] text-gray-500 font-medium">Enterprise ready</p>
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
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl flex h-[350px]">
      {/* Sidebar */}
      <div className="w-48 bg-gray-900 flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="size-6 rounded bg-blue-500" />
          <div className="h-2 w-20 rounded bg-gray-700" />
        </div>
        
        <div className="space-y-4">
          <div className="h-1.5 w-12 rounded bg-gray-600 mb-2" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">#</span>
              <div className={cn("h-1.5 rounded bg-gray-700", i === 2 ? "w-24 bg-gray-500" : "w-16")} />
            </div>
          ))}
        </div>
        
        <div className="mt-auto">
          <div className="h-8 w-full rounded border border-gray-700 border-dashed flex items-center justify-center">
            <div className="size-3 rounded-full bg-gray-700" />
          </div>
        </div>
      </div>
      
      {/* Main Content / Members Panel */}
      <div className="flex-1 p-6 flex flex-col bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div className="h-4 w-32 rounded bg-gray-300" />
          <div className="h-8 w-24 rounded bg-gray-900" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3">
              <div className="size-8 rounded-full bg-gray-100 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="user" className="size-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="h-2 w-16 rounded bg-gray-300 mb-1" />
                <div className="h-1.5 w-10 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-auto h-12 w-full rounded-lg border border-gray-200 bg-white shadow-sm flex items-center px-4">
          <div className="size-6 rounded bg-gray-100 mr-3" />
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
    <div className="w-full aspect-video rounded-3xl bg-[#f8fafc] border border-gray-200 shadow-xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="size-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">+</div>
      </div>
      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.name} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full overflow-hidden bg-gray-100">
                <img src={`https://i.pravatar.cc/100?u=${m.avatar}`} alt={m.name} className="size-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-500 font-medium">{m.role}</p>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              {m.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
