const ANIM_STYLES = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
`;

export function PaidVsFreeHeroMockup() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-lg select-none sm:aspect-[4/3] lg:aspect-[4/3]">
      <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
      <div className="absolute inset-0 mt-6 mb-12 ml-6 overflow-hidden rounded-2xl bg-gray-100 shadow-2xl">
        <img
          alt="Cityscape"
          className="absolute inset-0 size-full object-cover"
          src="https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=800&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent mix-blend-multiply" />
      </div>

      <div className="absolute bottom-4 left-0 z-10 w-64 animate-float rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
        <div className="mb-1 flex items-start justify-between">
          <span className="font-bold text-gray-900 text-sm">Plan Upgraded</span>
        </div>
        <p className="text-gray-500 text-xs">
          All features unlocked • Just now
        </p>
      </div>
    </div>
  );
}

export function PaidVsFreeBasicMessagingMockup() {
  return (
    <div className="relative flex h-[300px] w-full select-none items-center justify-center">
      <div className="relative left-8 z-10 flex w-80 items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="size-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
            <img
              alt="Avatar"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
            />
          </div>
          <span className="font-bold text-gray-900 text-sm">
            Unlocking Paid Features...
          </span>
        </div>
        <span className="pointer-events-none font-bold text-gray-300 text-xs">
          Upgrade
        </span>
      </div>
    </div>
  );
}

export function PaidVsFreeTeamManagementMockup() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-lg select-none sm:aspect-[4/3] lg:aspect-[4/3]">
      <div className="absolute inset-0 overflow-hidden rounded-3xl border-[8px] border-gray-900 bg-gray-900 shadow-xl">
        <img
          alt="Nature"
          className="absolute inset-0 size-full object-cover"
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop"
        />
      </div>
    </div>
  );
}

export function PaidVsFreePreferencesMockup() {
  return (
    <div className="relative mx-auto aspect-[16/9] w-full max-w-lg select-none sm:aspect-[16/9] lg:aspect-[16/9]">
      <div className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border-[6px] border-gray-900 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-2">
          <span className="font-bold text-base text-gray-900">
            # team-communication
          </span>
          <div className="ml-4 flex gap-2">
            <span className="font-bold text-gray-400 text-sm">+</span>
            <span className="text-gray-400 text-xs">🔔</span>
            <span className="text-gray-400 text-xs">💬</span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="size-10 shrink-0 overflow-hidden rounded-lg">
            <img
              alt="Fathima"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80"
            />
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-baseline gap-2">
              <p className="font-bold text-gray-900 text-sm">Fathima</p>
              <p className="text-gray-400 text-xs">Status update • Just now</p>
            </div>
            <div className="mb-4 flex h-10 w-full items-center rounded-full border border-gray-100 bg-gray-50 px-4">
              <div className="flex size-6 shrink-0 items-center justify-center text-gray-300">
                ▶
              </div>
              <div className="mx-3 h-1 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[30%] bg-gray-400" />
              </div>
              <span className="shrink-0 font-bold text-gray-400 text-xs">
                1x
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Advanced communication preferences enabled.{" "}
              <span className="font-bold text-gray-900 underline">
                Configure settings
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
