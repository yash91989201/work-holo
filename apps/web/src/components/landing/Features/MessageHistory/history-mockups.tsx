/**
 * ChatMockup
 * ─────────────────────────────────────────────────────
 * A dark-themed workspace/chat UI mockup used as a visual
 * in the messaging feature sections.
 * Shows a sidebar with channels + a message area with a file attachment.
 */
export function ChatMockup() {
  return (
    <div className="min-h-[400px] w-full overflow-hidden rounded-xl border border-[#3f3f46] bg-[#1a1d21] shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[260px] border-[#3f3f46] border-r bg-[#19171d] p-5">
          <div className="mb-6 flex items-center gap-2">
            <div className="size-3 rounded-full bg-red-400" />
            <div className="size-3 rounded-full bg-yellow-400" />
            <div className="size-3 rounded-full bg-green-400" />
          </div>
          <div className="mb-5 flex items-center justify-between">
            <span className="font-bold text-base text-white">A1 Marketing</span>
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              stroke="#9ca3af"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <p className="mb-3 font-semibold text-[#9ca3af] text-xs uppercase tracking-wider">
            Channels
          </p>
          <div className="space-y-0.5">
            {[
              "# announcements",
              "# cs-marketing",
              "# cs-sales",
              "# feedback",
              "# product",
              "# proj-billing",
              "# proj-vouchers",
              "# team-cs",
            ].map((ch) => (
              <div
                className="rounded-md px-3 py-1.5 text-[#d1d5db] text-sm hover:bg-[#27242e]"
                key={ch}
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
                alt="Sandeep"
                className="size-full object-cover"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2.5">
                <span className="font-bold text-base text-white">
                  Sandeep Mishra
                </span>
                <span className="text-[#9ca3af] text-xs">12:35</span>
              </div>
              <p className="mt-1 text-[#d1d5db] text-sm leading-6">
                Hey @channel, quick update: Q4 proposal is done! Let me know if
                I've missed anything.
              </p>
              {/* File attachment */}
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#3f3f46] bg-[#27242e] px-4 py-3">
                <div className="flex size-10 items-center justify-center rounded bg-[#1264a3]">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="18"
                    stroke="white"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="18"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">
                    Q4 A1 Sites Proposal
                  </p>
                  <p className="mt-0.5 text-[#9ca3af] text-xs">
                    Spreadsheet from Google Drive
                  </p>
                </div>
              </div>
              {/* Reactions */}
              <div className="mt-3 flex gap-2.5">
                <span className="rounded-full border border-[#3f3f46] bg-[#27242e] px-3 py-1 font-medium text-[#d1d5db] text-xs">
                  👀 5
                </span>
                <span className="rounded-full border border-[#3f3f46] bg-[#27242e] px-3 py-1 font-medium text-[#d1d5db] text-xs">
                  🎉 2
                </span>
              </div>
            </div>
          </div>

          {/* Second message */}
          <div className="mt-6 flex items-start gap-4">
            <div className="size-12 shrink-0 overflow-hidden rounded-md">
              <img
                alt="Fathima"
                className="size-full object-cover"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2.5">
                <span className="font-bold text-base text-white">
                  Fathima Parveen
                </span>
                <span className="text-[#9ca3af] text-xs">12:35</span>
              </div>
              <p className="mt-1 text-[#d1d5db] text-sm leading-6">
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
      <div className="border-[#e5e7eb] border-b px-6 py-4">
        <span className="font-bold text-[#1d1c1d] text-base">
          #support-status
        </span>
      </div>
      <div className="space-y-6 p-6 lg:space-y-8 lg:p-8">
        {/* Person 1 */}
        <div className="flex items-start gap-4">
          <div className="size-12 shrink-0 overflow-hidden rounded-md">
            <img
              alt="Madhu"
              className="size-full object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-bold text-[#1d1c1d] text-base">
                Madhu Sharma
              </span>
              <span className="text-[#616061] text-xs">15:24</span>
            </div>
            <div className="mt-1.5 text-[#616061] text-sm">
              <p className="font-semibold text-[#1d1c1d]">Yesterday</p>
              <ul className="mt-1 mb-3 list-inside list-disc">
                <li>Bank holiday here in Scotland!</li>
              </ul>
              <p className="font-semibold text-[#1d1c1d]">Today</p>
              <ul className="mt-1 list-inside list-disc">
                <li>Voucher code audit</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Person 2 */}
        <div className="flex items-start gap-4">
          <div className="size-12 shrink-0 overflow-hidden rounded-md">
            <img
              alt="Faisal"
              className="size-full object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-bold text-[#1d1c1d] text-base">
                Faisal Hasan
              </span>
              <span className="text-[#616061] text-xs">15:24</span>
            </div>
            <div className="mt-1.5 text-[#616061] text-sm">
              <p className="font-semibold text-[#1d1c1d]">Yesterday</p>
              <ul className="mt-1 mb-3 list-inside list-disc">
                <li>Not a bank holiday, apparently</li>
                <li>Field marketing survey results</li>
              </ul>
              <p className="font-semibold text-[#1d1c1d]">Today</p>
              <ul className="mt-1 list-inside list-disc">
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
    {
      name: "Salesforce (Legacy)",
      tag: "Customer Support",
      color: "#00A1E0",
      icon: "☁️",
    },
    { name: "Asana", tag: "Productivity", color: "#F06A6A", icon: "📋" },
    {
      name: "Mystery App",
      tag: "Customer Support",
      color: "#6B7280",
      icon: "🔮",
    },
  ];

  return (
    <div className="space-y-5">
      {integrations.map((app) => (
        <div
          className="flex items-center gap-5 rounded-xl border border-[#e5e7eb] bg-white px-6 py-5 shadow-md"
          key={app.name}
        >
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-xl text-3xl"
            style={{ backgroundColor: `${app.color}20` }}
          >
            {app.icon}
          </div>
          <div>
            <p className="font-bold text-[#1d1c1d] text-base">{app.name}</p>
            <p className="mt-1 font-medium text-[#616061] text-xs uppercase tracking-wide">
              {app.tag}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
