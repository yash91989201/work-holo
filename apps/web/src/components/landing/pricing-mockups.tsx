const ANIM_STYLES = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
`;

export function PricingHeroMockup() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-lg select-none sm:aspect-[4/3] lg:aspect-auto lg:h-[400px]">
      <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
      <div className="absolute inset-0 flex flex-col gap-4 overflow-hidden rounded-2xl bg-[#8b5cf6] p-6 shadow-2xl">
        {/* Fake window controls */}
        <div className="mb-2 flex gap-2">
          <div className="size-3 rounded-full bg-white/20" />
          <div className="size-3 rounded-full bg-white/20" />
          <div className="size-3 rounded-full bg-white/20" />
          <span className="ml-2 font-mono text-white/50 text-xs">
            # dialer-active
          </span>
        </div>

        {/* Card 1 */}
        <div className="w-full animate-float rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
          <div className="mb-2 flex items-start justify-between">
            <span className="font-bold text-sm text-white">Active Call</span>
            <span className="text-white/60 text-xs">Connected</span>
          </div>
          <p className="mb-3 text-white/80 text-xs">
            Secure line established. Encryption active. 🔒
          </p>
          <div className="flex w-max items-center gap-2 rounded-lg bg-white px-3 py-2">
            <div className="flex size-5 items-center justify-center rounded-full bg-purple-500">
              <svg
                fill="none"
                height="12"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="12"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[10px] text-gray-900 leading-tight">
                Verified Connection
              </p>
              <p className="text-[8px] text-gray-500 leading-tight">Secure</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="w-full animate-float-delayed rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
          <div className="mb-2 flex items-start justify-between">
            <span className="font-bold text-sm text-white">Workspace Bot</span>
            <span className="text-white/60 text-xs">Just now</span>
          </div>
          <p className="mb-3 text-white/80 text-xs">
            All systems operational. Unlimited messaging enabled.
          </p>
          <div className="flex w-max items-center gap-1 rounded bg-white/20 px-2 py-1">
            <span className="text-[10px]">🛡️</span>
            <span className="font-bold text-[10px] text-white">1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingChannelsMockup() {
  return (
    <div className="flex aspect-[4/3] w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="flex w-16 shrink-0 flex-col items-center gap-3 border-gray-100 border-r bg-gray-50 py-4">
          <div className="size-8 rounded-lg bg-purple-400" />
          <div className="size-8 rounded-lg bg-purple-500 shadow-sm ring-2 ring-purple-500 ring-offset-2" />
          <div className="size-8 rounded-lg bg-purple-400" />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-6 flex items-center gap-2">
            <span className="font-bold text-lg text-purple-500">#</span>
            <span className="font-bold text-gray-800 text-sm">
              general-chat
            </span>
          </div>
          <div className="flex-1 space-y-5">
            <div className="flex gap-3">
              <div className="size-8 shrink-0 rounded bg-gray-100" />
              <div>
                <p className="mb-0.5 font-bold text-[11px] text-gray-900">
                  Team Lead
                </p>
                <p className="text-[11px] text-gray-500">
                  Unlimited messaging is live!
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="size-8 shrink-0 rounded bg-gray-100" />
              <div>
                <p className="mb-0.5 font-bold text-[11px] text-gray-900">
                  Manager
                </p>
                <p className="text-[11px] text-gray-500">
                  Search through all history instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingStorageMockup() {
  return (
    <div className="flex aspect-[4/3] w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="flex w-16 shrink-0 flex-col items-center gap-3 border-gray-100 border-r bg-gray-50 py-4">
          <div className="size-8 rounded-lg bg-purple-500 shadow-sm ring-2 ring-purple-500 ring-offset-2" />
          <div className="size-8 rounded-lg bg-purple-400" />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col justify-center p-6">
          <div className="mb-8 flex items-center gap-2">
            <span className="font-bold text-lg text-purple-500">#</span>
            <span className="font-bold text-gray-800 text-sm">
              storage-vault
            </span>
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between">
              <span className="font-bold text-[10px] text-gray-500 uppercase tracking-wider">
                Storage Usage
              </span>
            </div>
            <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[33%] bg-purple-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">
                33 GB of 100 GB used
              </span>
              <span className="rounded bg-green-50 px-2 py-0.5 font-bold text-[9px] text-green-600">
                Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingSecurityMockup() {
  return (
    <div className="flex aspect-[4/3] w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="flex w-16 shrink-0 flex-col items-center gap-3 border-gray-100 border-r bg-gray-50 py-4">
          <div className="size-8 rounded-lg bg-purple-400" />
          <div className="size-8 rounded-lg bg-purple-500 shadow-sm ring-2 ring-purple-500 ring-offset-2" />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col justify-center p-6">
          <div className="mb-6 flex items-center gap-2">
            <span className="font-bold text-lg text-purple-500">#</span>
            <span className="font-bold text-gray-800 text-sm">
              security-settings
            </span>
          </div>

          <div className="space-y-4 font-bold text-[11px] text-gray-700">
            <div className="flex items-center gap-3">
              <div className="size-3 rounded-full bg-purple-500" />
              <span>Role-Based Access Enabled</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-3 rounded-full bg-purple-500" />
              <span>Admin Chat Control Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-3 rounded-full bg-purple-500" />
              <span>Secure Workspace Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingAdminDashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-500 text-sm">#</span>
          <span className="font-mono text-gray-400 text-xs">
            workspace-settings
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="size-3 rounded bg-gray-100" />
          <div className="size-3 rounded bg-gray-100" />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Admin Dashboard</h3>
        <p className="text-[11px] text-gray-500">
          Manage users and permissions
        </p>
      </div>

      <div className="w-full">
        <div className="mb-3 grid grid-cols-4 gap-4 border-gray-100 border-b pb-2 font-bold text-[9px] text-gray-400 uppercase tracking-wider">
          <div className="col-span-1">Feature</div>
          <div className="text-center">Status</div>
          <div className="text-center">Access</div>
          <div className="text-right">Limit</div>
        </div>

        <div className="space-y-3 font-bold text-[10px] text-gray-800">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-1">Unlimited Messaging</div>
            <div className="text-center">
              <span className="rounded bg-green-50 px-2 py-0.5 text-green-600">
                Active
              </span>
            </div>
            <div className="text-center">
              <span className="rounded bg-purple-50 px-2 py-0.5 text-purple-600">
                All Users
              </span>
            </div>
            <div className="text-right text-gray-500">None</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-1">File Sharing</div>
            <div className="text-center">
              <span className="rounded bg-green-50 px-2 py-0.5 text-green-600">
                Active
              </span>
            </div>
            <div className="text-center">
              <span className="rounded bg-purple-50 px-2 py-0.5 text-purple-600">
                All Users
              </span>
            </div>
            <div className="text-right text-gray-500">100 GB</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-1">Admin Control</div>
            <div className="text-center">
              <span className="rounded bg-green-50 px-2 py-0.5 text-green-600">
                Active
              </span>
            </div>
            <div className="text-center">
              <span className="rounded rounded-tl-none bg-gray-900 px-2 py-0.5 text-white">
                Admin Only
              </span>
            </div>
            <div className="text-right text-gray-500">Full</div>
          </div>
        </div>
      </div>
    </div>
  );
}
