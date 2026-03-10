import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * AdminDashboardMockups
 * ─────────────────────────────────────────────────────
 * Coded UI panels for the Admin Dashboard feature page.
 * These are fully coded (No external images) for reliability.
 */

interface MockupContainerProps {
  bgColor: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

function MockupContainer({
  children,
  bgColor,
  className,
  innerClassName,
}: MockupContainerProps) {
  return (
    <div
      className={cn(
        "flex aspect-square w-full items-center justify-center rounded-3xl p-6 sm:p-10 lg:p-14",
        bgColor,
        className
      )}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-100/50 bg-white shadow-2xl",
          innerClassName
        )}
      >
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
    <div className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-3xl border-8 border-[#D8C6E0] bg-gradient-to-br from-[#f8f6f9] to-[#ece9f0] shadow-2xl">
      {/* Coded UI placeholder instead of Unsplash */}
      <div className="absolute inset-0 flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-purple-100" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-32 rounded bg-gray-200" />
            <div className="h-2 w-20 rounded bg-gray-100" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              className="aspect-square rounded-xl border border-purple-100/50 bg-purple-50/50"
              key={i}
            />
          ))}
        </div>
        <div className="flex-1 space-y-3 rounded-xl border border-gray-100 bg-white/60 p-4">
          <div className="h-3 w-1/2 rounded bg-gray-200" />
          <div className="h-3 w-3/4 rounded bg-gray-100" />
          <div className="h-3 w-2/3 rounded bg-gray-100" />
        </div>
      </div>
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/5 transition-colors group-hover:bg-black/10">
        <div className="flex size-20 items-center justify-center rounded-full bg-white shadow-2xl transition-transform group-hover:scale-110">
          <svg
            className="ml-1 text-purple-600"
            fill="currentColor"
            height="32"
            viewBox="0 0 24 24"
            width="32"
          >
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
      <div className="flex items-center gap-2 border-gray-100 border-b bg-gray-50 px-4 py-3">
        <div className="size-2 rounded-full bg-red-400" />
        <div className="size-2 rounded-full bg-amber-400" />
        <div className="size-2 rounded-full bg-green-400" />
        <span className="ml-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest">
          Workspace Channels
        </span>
      </div>
      <div className="flex-1 space-y-4 p-4">
        {channels.map((chan) => (
          <div
            className="flex items-center justify-between rounded-xl border border-gray-50 bg-gray-50/30 p-2.5"
            key={chan.name}
          >
            <div className="flex items-center gap-3">
              <div className={cn("size-2 rounded-full", chan.color)} />
              <span className="font-semibold text-[11px] text-gray-700">
                #{chan.name}
              </span>
            </div>
            <span className="font-bold text-[9px] text-gray-400">
              {chan.members} Members
            </span>
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
      <div className="flex items-center justify-between border-gray-100 border-b bg-gray-50 px-4 py-3">
        <span className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">
          Team Members
        </span>
        <div className="flex size-6 items-center justify-center rounded-lg bg-green-100">
          <div className="size-3 rounded bg-green-500 shadow-sm" />
        </div>
      </div>
      <div className="flex-1 space-y-3 p-4">
        {members.map((m) => (
          <div
            className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
            key={m.name}
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full border border-gray-200 bg-gray-100" />
              <div className="space-y-0.5">
                <p className="font-bold text-[11px] text-gray-800">{m.name}</p>
                <p className="text-[9px] text-gray-400">{m.role}</p>
              </div>
            </div>
            <div
              className={cn(
                "rounded-full px-2 py-0.5 font-bold text-[8px] uppercase tracking-wider",
                m.status === "Active"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              )}
            >
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
    {
      id: "T-1284",
      tag: "Bug",
      label: "Praise",
      color: "bg-red-400",
      emoji: "❤️",
    },
    {
      id: "T-1285",
      tag: "Feature",
      label: "Pain point",
      color: "bg-purple-400",
      emoji: "💔",
    },
    {
      id: "T-1286",
      tag: "Task",
      label: "Praise",
      color: "bg-blue-400",
      emoji: "❤️",
    },
  ];

  return (
    <MockupContainer bgColor="bg-[#fffbeb]">
      <div className="border-amber-100 border-b bg-amber-50/50 px-4 py-3">
        <span className="font-bold text-[10px] text-amber-600 uppercase leading-none tracking-widest">
          Triage Queue
        </span>
      </div>
      <div className="flex-1 space-y-4 p-4">
        {requests.map((r) => (
          <div
            className="space-y-2 rounded-xl border border-amber-100/30 bg-white p-3 shadow-sm"
            key={r.id}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-gray-400">
                ID: {r.id}
              </span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-bold text-[8px] text-white uppercase",
                  r.color
                )}
              >
                {r.tag}
              </span>
            </div>
            <div className="h-2 w-3/4 rounded bg-gray-100" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs">{r.emoji}</span>
              <span className="font-medium text-[10px] text-gray-600">
                {r.label}
              </span>
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
    <div className="flex h-full w-full flex-col gap-4 bg-gradient-to-br from-[#f8f6f9] to-[#ece9f0] p-6">
      <div className="h-8 w-1/3 rounded-lg bg-white shadow-sm" />
      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="space-y-2 rounded-xl bg-white p-3 shadow-sm">
          <div className="size-6 rounded-full bg-purple-100" />
          <div className="h-2 w-full rounded bg-gray-100" />
          <div className="h-2 w-2/3 rounded bg-gray-100" />
        </div>
        <div className="space-y-2 rounded-xl bg-white p-3 shadow-sm">
          <div className="size-6 rounded-full bg-blue-100" />
          <div className="h-2 w-full rounded bg-gray-100" />
          <div className="h-2 w-2/3 rounded bg-gray-100" />
        </div>
        <div className="col-span-2 flex items-center justify-between rounded-xl bg-purple-600 p-3 shadow-lg">
          <div className="h-2 w-1/3 rounded bg-white/40" />
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
    <div className="flex h-full w-full flex-col gap-3 bg-[#f0fdf4] p-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm"
          key={i}
        >
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-full bg-green-100" />
            <div className="h-2 w-24 rounded bg-gray-100" />
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
    <div className="flex h-full w-full flex-col gap-3 bg-[#fffbeb] p-6">
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-4 border-amber-200 border-dashed p-6 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-amber-100">
          <div className="size-6 rounded-sm border-2 border-amber-400" />
        </div>
        <div className="h-2 w-32 rounded bg-amber-200/50" />
      </div>
    </div>
  );
}
