/**
 * ChatMockup
 * ─────────────────────────────────────────────────────
 * A dark-themed workspace/chat UI mockup used as a visual
 * in the messaging feature sections.
 * Shows a sidebar with channels + a message area with a file attachment.
 */
export function ChatMockup() {
  return (
    <div className="w-full min-h-[400px] overflow-hidden rounded-xl border border-[#3f3f46] bg-[#1a1d21] shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[260px] border-r border-[#3f3f46] bg-[#19171d] p-5">
          <div className="mb-6 flex items-center gap-2">
            <div className="size-3 rounded-full bg-red-400" />
            <div className="size-3 rounded-full bg-yellow-400" />
            <div className="size-3 rounded-full bg-green-400" />
          </div>
          <div className="mb-5 flex items-center justify-between">
            <span className="text-base font-bold text-white">A1 Marketing</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
            Channels
          </p>
          <div className="space-y-0.5">
            {["# announcements", "# cs-marketing", "# cs-sales", "# feedback", "# product", "# proj-billing", "# proj-vouchers", "# team-cs"].map((ch) => (
              <div
                key={ch}
                className="rounded-md px-3 py-1.5 text-sm text-[#d1d5db] hover:bg-[#27242e]"
              >
                {ch}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Message */}
          <div className="flex items-start gap-4">
            <div className="size-12 shrink-0 overflow-hidden rounded-md">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80"
                alt="Sandeep"
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2.5">
                <span className="text-base font-bold text-white">Sandeep Mishra</span>
                <span className="text-xs text-[#9ca3af]">12:35</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-[#d1d5db]">
                Hey @channel, quick update: Q4 proposal is done! Let me know if
                I've missed anything.
              </p>
              {/* File attachment */}
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#3f3f46] bg-[#27242e] px-4 py-3">
                <div className="flex size-10 items-center justify-center rounded bg-[#1264a3]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 2v6h6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Q4 A1 Sites Proposal</p>
                  <p className="mt-0.5 text-xs text-[#9ca3af]">Spreadsheet from Google Drive</p>
                </div>
              </div>
              {/* Reactions */}
              <div className="mt-3 flex gap-2.5">
                <span className="rounded-full border border-[#3f3f46] bg-[#27242e] px-3 py-1 text-xs font-medium text-[#d1d5db]">
                  👀 5
                </span>
                <span className="rounded-full border border-[#3f3f46] bg-[#27242e] px-3 py-1 text-xs font-medium text-[#d1d5db]">
                  🎉 2
                </span>
              </div>
            </div>
          </div>

          {/* Second message */}
          <div className="mt-6 flex items-start gap-4">
            <div className="size-12 shrink-0 overflow-hidden rounded-md">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80"
                alt="Fathima"
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2.5">
                <span className="text-base font-bold text-white">Fathima Parveen</span>
                <span className="text-xs text-[#9ca3af]">12:35</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-[#d1d5db]">
                Brilliant work here, @Sandeep Mishra. I reckon you can probably
                cut my timeline down by a couple of weeks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * StatusMockup
 * ─────────────────────────────────────────────────────
 * A light-themed status update card showing threaded status messages.
 */
export function StatusMockup() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
      <div className="border-b border-[#e5e7eb] px-6 py-4">
        <span className="text-base font-bold text-[#1d1c1d]">#support-status</span>
      </div>
      <div className="space-y-6 lg:space-y-8 p-6 lg:p-8">
        {/* Person 1 */}
        <div className="flex items-start gap-4">
          <div className="size-12 shrink-0 overflow-hidden rounded-md">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
              alt="Madhu"
              className="size-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-base font-bold text-[#1d1c1d]">Madhu Sharma</span>
              <span className="text-xs text-[#616061]">15:24</span>
            </div>
            <div className="mt-1.5 text-sm text-[#616061]">
              <p className="font-semibold text-[#1d1c1d]">Yesterday</p>
              <ul className="list-inside list-disc mt-1 mb-3">
                <li>Bank holiday here in Scotland!</li>
              </ul>
              <p className="font-semibold text-[#1d1c1d]">Today</p>
              <ul className="list-inside list-disc mt-1">
                <li>Voucher code audit</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Person 2 */}
        <div className="flex items-start gap-4">
          <div className="size-12 shrink-0 overflow-hidden rounded-md">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
              alt="Faisal"
              className="size-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-base font-bold text-[#1d1c1d]">Faisal Hasan</span>
              <span className="text-xs text-[#616061]">15:24</span>
            </div>
            <div className="mt-1.5 text-sm text-[#616061]">
              <p className="font-semibold text-[#1d1c1d]">Yesterday</p>
              <ul className="list-inside list-disc mt-1 mb-3">
                <li>Not a bank holiday, apparently</li>
                <li>Field marketing survey results</li>
              </ul>
              <p className="font-semibold text-[#1d1c1d]">Today</p>
              <ul className="list-inside list-disc mt-1">
                <li>Wrap-up for findings from yesterday</li>
                <li>Analytics review</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * IntegrationsMockup
 * ─────────────────────────────────────────────────────
 * Stacked integration cards (Google Drive, Salesforce, Asana, etc.)
 */
export function IntegrationsMockup() {
  const integrations = [
    { name: "Google Drive", tag: "Productivity", color: "#4285F4", icon: "📎" },
    { name: "Salesforce (Legacy)", tag: "Customer Support", color: "#00A1E0", icon: "☁️" },
    { name: "Asana", tag: "Productivity", color: "#F06A6A", icon: "📋" },
    { name: "Mystery App", tag: "Customer Support", color: "#6B7280", icon: "🔮" },
  ];

  return (
    <div className="space-y-5">
      {integrations.map((app) => (
        <div
          key={app.name}
          className="flex items-center gap-5 rounded-xl border border-[#e5e7eb] bg-white px-6 py-5 shadow-md"
        >
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-xl text-3xl"
            style={{ backgroundColor: `${app.color}20` }}
          >
            {app.icon}
          </div>
          <div>
            <p className="text-base font-bold text-[#1d1c1d]">{app.name}</p>
            <p className="mt-1 text-xs font-medium text-[#616061] uppercase tracking-wide">{app.tag}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
