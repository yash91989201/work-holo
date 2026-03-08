/**
 * UserManagementMockups
 * ─────────────────────────────────────────────────────
 * Coded UI panels used as visuals in the User Management
 * feature sections and interactive templates list.
 * Each mimics a Workholo workspace view.
 */

/**
 * UserChatMockup — Panel 1 (COLLABORATING section)
 */
export function UserChatMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="flex h-full min-h-[340px]">
        {/* Purple Sidebar */}
        <div className="w-32 shrink-0 bg-[#3b1f5e] p-3 flex flex-col gap-3">
          <div className="mt-1 flex gap-1">
            <div className="size-2.5 rounded-full bg-red-400" />
            <div className="size-2.5 rounded-full bg-yellow-400" />
            <div className="size-2.5 rounded-full bg-green-400" />
          </div>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-purple-300">
            CHANNELS
          </p>
          {["# general", "# product-launch", "# marketing", "# hr-team", "# support"].map((ch, i) => (
            <div
              key={ch}
              className={`rounded px-2 py-1 text-[9px] ${i === 1 ? "bg-purple-700 font-semibold text-white" : "text-purple-200"}`}
            >
              {ch}
            </div>
          ))}
          <div className="mt-auto space-y-2">
            <div className="h-2 rounded bg-purple-700/50 w-full" />
            <div className="h-2 rounded bg-purple-700/50 w-3/4" />
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
            <span className="text-sm font-bold text-gray-900"># project-launch</span>
            <div className="ml-auto flex gap-2">
              <div className="size-4 rounded bg-gray-200" />
              <div className="size-4 rounded bg-gray-200" />
            </div>
          </div>
          <div className="flex-1 space-y-4 px-4 py-4 overflow-hidden">
            <div className="flex gap-3 items-start">
              <div className="size-7 shrink-0 rounded-md bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-800">
                MS
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-gray-900">Madhu Sharma</span>
                  <span className="text-[10px] text-gray-400">10:42 AM</span>
                </div>
                <p className="mt-0.5 text-xs text-gray-600 leading-4">
                  Add a new user to the system here 👋 here! 👋
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 w-fit">
                  <div className="size-5 rounded bg-yellow-100 flex items-center justify-center text-[9px]">👤</div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-800">Create new user</p>
                    <p className="text-[9px] text-gray-400">list</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="size-7 shrink-0 rounded-md bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-800">
                FP
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-gray-900">Fathima Parveen</span>
                  <span className="text-[10px] text-gray-400">10:45 AM</span>
                </div>
                <p className="mt-0.5 text-xs text-gray-600 leading-4">User successfully added!</p>
                <div className="mt-1.5 flex gap-1">
                  <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px]">👍 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * UserPermissionsMockup — Panel 2 (MANAGING PERMISSIONS section)
 */
export function UserPermissionsMockup() {
  const milestones = [
    { text: "14/10: Hold kick-off meeting", status: "Done", color: "bg-green-100 text-green-700" },
    { text: "20/10: Secure budget", status: "In progress", color: "bg-blue-100 text-blue-700" },
    { text: "27/10: Finalise creative", status: "In progress", color: "bg-blue-100 text-blue-700" },
  ];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="flex h-full min-h-[340px]">
        <div className="w-12 shrink-0 bg-[#3b1f5e] flex flex-col gap-3 py-4 px-2 items-center">
          <div className="size-5 rounded bg-purple-400/30" />
          <div className="size-5 rounded bg-purple-400/30" />
          <div className="size-5 rounded bg-purple-700" />
          <div className="size-5 rounded bg-purple-400/30" />
          <div className="size-5 rounded bg-purple-400/30" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
            <span className="text-sm font-bold text-gray-900"># marketing-campaign</span>
            <div className="ml-auto"><div className="size-4 rounded bg-gray-200" /></div>
          </div>
          <div className="flex-1 px-4 py-4 overflow-hidden">
            <div className="mb-4 flex items-center gap-2">
              <div className="size-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-600">K</div>
              <span className="text-xs text-gray-600 font-medium">Kriti</span>
            </div>
            <p className="text-xs font-bold text-gray-800 mb-3">Milestones:</p>
            <div className="space-y-2.5">
              {milestones.map((m) => (
                <div key={m.text} className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] leading-4 text-gray-600 ${m.status === "Done" ? "line-through text-gray-400" : ""}`}>
                    {m.text}
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium ${m.color}`}>{m.status}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-1.5">
              <div className="h-4 w-8 rounded-full bg-red-300" />
              <div className="h-4 w-8 rounded-full bg-green-300" />
              <div className="h-4 w-8 rounded-full bg-yellow-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * UserCanvasMockup — Panel 3 (ORGANISING section)
 */
export function UserCanvasMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="flex h-full min-h-[340px]">
        <div className="w-32 shrink-0 bg-[#3b1f5e] p-3 flex flex-col gap-3">
          <div className="mt-1 flex gap-1">
            <div className="size-2.5 rounded-full bg-red-400" />
            <div className="size-2.5 rounded-full bg-yellow-400" />
            <div className="size-2.5 rounded-full bg-green-400" />
          </div>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-purple-300">CHANNELS</p>
          {["# project-alpha", "# project-beta", "# project-galaxy", "# project-omega"].map((ch, i) => (
            <div key={ch} className={`rounded px-2 py-1.5 text-[9px] ${i === 2 ? "bg-purple-700 font-semibold text-white" : "text-purple-200"}`}>
              {ch}
            </div>
          ))}
          <div className="mt-2 space-y-1.5">
            <div className="h-2 w-full rounded bg-purple-700/40" />
            <div className="h-2 w-3/4 rounded bg-purple-700/40" />
            <div className="h-2 w-1/2 rounded bg-purple-700/40" />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
            <span className="text-sm font-bold text-gray-900"># project-galaxy</span>
          </div>
          <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden">
            <div className="w-fit text-[10px] text-gray-400 font-medium uppercase tracking-wider">Canvas</div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
              <p className="text-xs font-bold text-gray-800">🌐 Welcome to Project Galaxy</p>
              <p className="text-[10px] text-gray-500 leading-4">
                This canvas will be your single source of truth for all information about the project.
              </p>
              <div className="flex items-center gap-2 rounded bg-white border border-gray-100 px-2 py-1.5 w-fit">
                <span className="text-[10px]">📄</span>
                <span className="text-[10px] font-medium text-gray-700">Project.m</span>
              </div>
            </div>
            <div className="space-y-1.5 mt-2">
              <div className="h-2 w-full rounded bg-gray-200" />
              <div className="h-2 w-4/5 rounded bg-gray-200" />
              <div className="h-2 w-3/5 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * FeedbackTrackerMockup — Interactive Template Panel
 * Matches the screenshot: "# feedback" with a table: Feedback | Details | Type | Severity
 */
export function FeedbackTrackerMockup() {
  const rows = [
    {
      feedback: "Button is confusing",
      details: "The button says 'Confirm and...",
      type: { label: "Pinpoint", bg: "bg-pink-100 text-pink-700" },
      severity: { label: "Medium", bg: "bg-blue-100 text-blue-700" },
    },
    {
      feedback: "Colours are too similar",
      details: "The orange and yellow status...",
      type: { label: "Design n...", bg: "bg-yellow-50 text-yellow-700" },
      severity: { label: "Low", bg: "bg-blue-50 text-blue-600" },
    },
    {
      feedback: "Love the new update!",
      details: "I would recommend be...",
      type: { label: "Bonus", bg: "bg-purple-100 text-purple-700" },
      severity: { label: "Low", bg: "bg-blue-50 text-blue-600" },
    },
  ];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="flex h-full min-h-[340px]">
        <div className="w-10 shrink-0 bg-[#3b1f5e] flex flex-col gap-3 py-4 px-2 items-center">
          <div className="size-4 rounded bg-purple-400/20" />
          <div className="size-4 rounded bg-purple-400/20" />
          <div className="size-4 rounded bg-purple-700" />
          <div className="size-4 rounded bg-purple-400/20" />
          <div className="size-4 rounded bg-purple-400/20" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
            <span className="text-xs font-bold text-gray-900"># feedback</span>
            <div className="ml-auto flex gap-1.5">
              <div className="size-3.5 rounded bg-gray-200" />
              <div className="size-3.5 rounded bg-gray-200" />
            </div>
          </div>
          <div className="flex-1 px-4 py-3 overflow-hidden">
            <p className="text-sm font-bold text-gray-900 mb-0.5">Feedback tracker</p>
            <p className="text-[9px] text-gray-400 mb-3">Describe how your team plans to use this list</p>
            <div className="grid grid-cols-4 gap-1 mb-1.5 px-1">
              {["Feedback", "Details", "Type", "Severity"].map((h) => (
                <span key={h} className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">{h}</span>
              ))}
            </div>
            <div className="h-px bg-gray-100 mb-2" />
            <div className="space-y-2.5">
              {rows.map((row) => (
                <div key={row.feedback} className="grid grid-cols-4 gap-1 items-center">
                  <span className="text-[9px] font-semibold text-gray-800 truncate">{row.feedback}</span>
                  <span className="text-[9px] text-gray-400 truncate">{row.details}</span>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full truncate ${row.type.bg}`}>
                    {row.type.label}
                  </span>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${row.severity.bg}`}>
                    {row.severity.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * StarterKitMockup — Template Panel for "User management starter kit"
 */
export function StarterKitMockup() {
  const tasks = [
    { label: "Invite new team members", done: true },
    { label: "Set default permissions", done: true },
    { label: "Configure channel access", done: false },
    { label: "Review admin roles", done: false },
  ];
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="flex h-full min-h-[340px]">
        <div className="w-10 shrink-0 bg-[#3b1f5e] flex flex-col gap-3 py-4 px-2 items-center">
          <div className="size-4 rounded bg-purple-700" />
          <div className="size-4 rounded bg-purple-400/20" />
          <div className="size-4 rounded bg-purple-400/20" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="border-b border-gray-200 px-4 py-3">
            <span className="text-xs font-bold text-gray-900"># onboarding</span>
          </div>
          <div className="flex-1 px-4 py-3 space-y-3">
            <p className="text-sm font-bold text-gray-900">User management starter kit</p>
            <p className="text-[9px] text-gray-400">Essentials for keeping your team organised from day one.</p>
            <div className="space-y-2.5 mt-1">
              {tasks.map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <div className={`size-3.5 rounded-full border flex items-center justify-center shrink-0 ${t.done ? "bg-purple-600 border-purple-600" : "border-gray-300"}`}>
                    {t.done && <div className="size-1.5 rounded-full bg-white" />}
                  </div>
                  <span className={`text-[10px] ${t.done ? "line-through text-gray-400" : "text-gray-700"}`}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * RoleManagerMockup — Template Panel for "Role permission manager"
 */
export function RoleManagerMockup() {
  const roles = [
    { role: "Admin", read: true, write: true, del: true },
    { role: "Manager", read: true, write: true, del: false },
    { role: "Member", read: true, write: false, del: false },
    { role: "Guest", read: true, write: false, del: false },
  ];
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="flex h-full min-h-[340px]">
        <div className="w-10 shrink-0 bg-[#3b1f5e] flex flex-col gap-3 py-4 px-2 items-center">
          <div className="size-4 rounded bg-purple-400/20" />
          <div className="size-4 rounded bg-purple-700" />
          <div className="size-4 rounded bg-purple-400/20" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="border-b border-gray-200 px-4 py-3">
            <span className="text-xs font-bold text-gray-900"># permissions</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <p className="text-sm font-bold text-gray-900 mb-0.5">Role permission manager</p>
            <p className="text-[9px] text-gray-400 mb-3">Control what each role can access.</p>
            <div className="grid grid-cols-4 gap-1 mb-2 px-1">
              {["Role", "Read", "Write", "Del"].map((h) => (
                <span key={h} className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">{h}</span>
              ))}
            </div>
            <div className="h-px bg-gray-100 mb-2" />
            <div className="space-y-2.5">
              {roles.map((r) => (
                <div key={r.role} className="grid grid-cols-4 gap-1 items-center">
                  <span className="text-[10px] font-semibold text-gray-700">{r.role}</span>
                  {[r.read, r.write, r.del].map((v, i) => (
                    <div key={`${r.role}-${i}`} className={`size-3 rounded-full ${v ? "bg-green-400" : "bg-red-200"}`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * AdminDashboardMockup — Template Panel for "Admin dashboard checklist"
 */
export function AdminDashboardMockup() {
  const items = [
    { label: "Review pending invites", count: "3", color: "bg-amber-100 text-amber-700" },
    { label: "Audit inactive accounts", count: "12", color: "bg-red-100 text-red-600" },
    { label: "Update security policies", count: "1", color: "bg-blue-100 text-blue-700" },
    { label: "Export user report", count: null, color: "" },
  ];
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="flex h-full min-h-[340px]">
        <div className="w-10 shrink-0 bg-[#3b1f5e] flex flex-col gap-3 py-4 px-2 items-center">
          <div className="size-4 rounded bg-purple-400/20" />
          <div className="size-4 rounded bg-purple-400/20" />
          <div className="size-4 rounded bg-purple-700" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="border-b border-gray-200 px-4 py-3">
            <span className="text-xs font-bold text-gray-900"># admin-hub</span>
          </div>
          <div className="flex-1 px-4 py-3 space-y-3">
            <p className="text-sm font-bold text-gray-900">Admin dashboard checklist</p>
            <p className="text-[9px] text-gray-400">Keep your workspace healthy and secure.</p>
            <div className="space-y-2.5 mt-1">
              {items.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-gray-700">{item.label}</span>
                  {item.count !== null && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.color}`}>{item.count}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
