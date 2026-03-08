import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * AdminDashboardMockups
 * ─────────────────────────────────────────────────────
 * Coded UI panels for the Admin Dashboard feature page.
 * These are fully coded (No external images) for reliability.
 */

interface MockupContainerProps {
  children: ReactNode;
  bgColor: string;
  className?: string;
  innerClassName?: string;
}

function MockupContainer({ children, bgColor, className, innerClassName }: MockupContainerProps) {
  return (
    <div className={cn("w-full aspect-square rounded-3xl flex items-center justify-center p-6 sm:p-10 lg:p-14", bgColor, className)}>
      <div className={cn("w-full h-full rounded-2xl bg-white shadow-2xl border border-gray-100/50 overflow-hidden flex flex-col", innerClassName)}>
        {children}
      </div>
    </div>
  );
}

/**
 * AdminHeroMockup — Large media preview with play button
 * Matches the first screenshot.
 */
export function AdminHeroMockup() {
  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-[#D8C6E0] group cursor-pointer bg-gradient-to-br from-[#f8f6f9] to-[#ece9f0]">
      {/* Coded UI placeholder instead of Unsplash */}
      <div className="absolute inset-0 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-purple-100" />
          <div className="space-y-1.5 flex-1">
            <div className="h-2.5 w-32 bg-gray-200 rounded" />
            <div className="h-2 w-20 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-purple-50/50 border border-purple-100/50" />
          ))}
        </div>
        <div className="flex-1 rounded-xl bg-white/60 border border-gray-100 p-4 space-y-3">
          <div className="h-3 w-1/2 bg-gray-200 rounded" />
          <div className="h-3 w-3/4 bg-gray-100 rounded" />
          <div className="h-3 w-2/3 bg-gray-100 rounded" />
        </div>
      </div>
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/5 transition-colors group-hover:bg-black/10">
        <div className="size-20 rounded-full bg-white shadow-2xl flex items-center justify-center transition-transform group-hover:scale-110">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-purple-600 ml-1">
            <path d="m7 4 12 8-12 8V4z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * AdminChannelsMockup — Channel list UI (Coded)
 */
export function AdminChannelsMockup() {
  const channels = [
    { name: "general", members: 42, color: "bg-blue-400" },
    { name: "marketing-ops", members: 12, color: "bg-pink-400" },
    { name: "sales-team", members: 28, color: "bg-emerald-400" },
    { name: "customer-success", members: 15, color: "bg-purple-400" },
  ];

  return (
    <MockupContainer bgColor="bg-[#f0f9ff]">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
        <div className="size-2 rounded-full bg-red-400" />
        <div className="size-2 rounded-full bg-amber-400" />
        <div className="size-2 rounded-full bg-green-400" />
        <span className="ml-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workspace Channels</span>
      </div>
      <div className="flex-1 p-4 space-y-4">
        {channels.map((chan) => (
          <div key={chan.name} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className={cn("size-2 rounded-full", chan.color)} />
              <span className="text-[11px] font-semibold text-gray-700">#{chan.name}</span>
            </div>
            <span className="text-[9px] font-bold text-gray-400">{chan.members} Members</span>
          </div>
        ))}
      </div>
    </MockupContainer>
  );
}

/**
 * AdminMembersMockup — Member list with roles (Coded)
 */
export function AdminMembersMockup() {
  const members = [
    { name: "Alex Rivera", role: "Admin", status: "Active" },
    { name: "Sarah Chen", role: "Editor", status: "Active" },
    { name: "Mike Jordan", role: "Viewer", status: "Away" },
    { name: "Emma Wilson", role: "Admin", status: "Active" },
  ];

  return (
    <MockupContainer bgColor="bg-[#f0fdf4]">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Members</span>
        <div className="size-6 rounded-lg bg-green-100 flex items-center justify-center">
          <div className="size-3 rounded shadow-sm bg-green-500" />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3">
        {members.map((m) => (
          <div key={m.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-gray-100 border border-gray-200" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-gray-800">{m.name}</p>
                <p className="text-[9px] text-gray-400">{m.role}</p>
              </div>
            </div>
            <div className={cn(
              "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider",
              m.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
            )}>
              {m.status}
            </div>
          </div>
        ))}
      </div>
    </MockupContainer>
  );
}

/**
 * AdminTriageMockup — Triage request UI (Coded)
 */
export function AdminTriageMockup() {
  const requests = [
    { id: "T-1284", tag: "Bug", label: "Praise", color: "bg-red-400", emoji: "❤️" },
    { id: "T-1285", tag: "Feature", label: "Pain point", color: "bg-purple-400", emoji: "💔" },
    { id: "T-1286", tag: "Task", label: "Praise", color: "bg-blue-400", emoji: "❤️" },
  ];

  return (
    <MockupContainer bgColor="bg-[#fffbeb]">
      <div className="bg-amber-50/50 border-b border-amber-100 px-4 py-3">
        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">Triage Queue</span>
      </div>
      <div className="flex-1 p-4 space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="p-3 rounded-xl border border-amber-100/30 bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-gray-400">ID: {r.id}</span>
              <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold text-white uppercase", r.color)}>{r.tag}</span>
            </div>
            <div className="h-2 w-3/4 bg-gray-100 rounded" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs">{r.emoji}</span>
              <span className="text-[10px] font-medium text-gray-600">{r.label}</span>
            </div>
          </div>
        ))}
      </div>
    </MockupContainer>
  );
}

/**
 * AdminCreateChannelMockup — Coded UI for Templates
 */
export function AdminCreateChannelMockup() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#f8f6f9] to-[#ece9f0] p-6 flex flex-col gap-4">
      <div className="h-8 w-1/3 bg-white rounded-lg shadow-sm" />
      <div className="grid grid-cols-2 gap-3 flex-1">
        <div className="rounded-xl bg-white shadow-sm p-3 space-y-2">
           <div className="size-6 rounded-full bg-purple-100" />
           <div className="h-2 w-full bg-gray-100 rounded" />
           <div className="h-2 w-2/3 bg-gray-100 rounded" />
        </div>
        <div className="rounded-xl bg-white shadow-sm p-3 space-y-2">
           <div className="size-6 rounded-full bg-blue-100" />
           <div className="h-2 w-full bg-gray-100 rounded" />
           <div className="h-2 w-2/3 bg-gray-100 rounded" />
        </div>
        <div className="col-span-2 rounded-xl bg-purple-600 shadow-lg p-3 flex items-center justify-between">
           <div className="h-2 w-1/3 bg-white/40 rounded" />
           <div className="size-4 rounded-full bg-white transition-transform hover:scale-110" />
        </div>
      </div>
    </div>
  );
}

/**
 * AdminAddMembersTemplateMockup
 */
export function AdminAddMembersTemplateMockup() {
  return (
    <div className="w-full h-full bg-[#f0fdf4] p-6 flex flex-col gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
           <div className="flex items-center gap-3">
             <div className="size-7 rounded-full bg-green-100" />
             <div className="h-2 w-24 bg-gray-100 rounded" />
           </div>
           <div className="size-4 rounded border-2 border-green-200" />
        </div>
      ))}
    </div>
  );
}

/**
 * AdminRemoveMembersTemplateMockup
 */
export function AdminRemoveMembersTemplateMockup() {
  return (
    <div className="w-full h-full bg-[#fffbeb] p-6 flex flex-col gap-3">
       <div className="flex-1 rounded-2xl border-4 border-dashed border-amber-200 flex flex-col items-center justify-center p-6 text-center">
          <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
            <div className="size-6 border-2 border-amber-400 rounded-sm" />
          </div>
          <div className="h-2 w-32 bg-amber-200/50 rounded" />
       </div>
    </div>
  );
}
