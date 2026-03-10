/**
 * RbacMockups
 * ─────────────────────────────────────────────────────
 * Coded UI panels for the Role-Based Access Control feature page.
 */

/**
 * RbacPermissionsMockup — Hero right side
 * Photo + floating "Permission updated by Admin" notification card
 */
export function RbacHeroMockup() {
  return (
    <div className="relative w-full">
      {/* Main image */}
      <div className="overflow-hidden rounded-2xl shadow-xl">
        <img
          alt="Role-based access control"
          className="h-[360px] w-full object-cover"
          src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80"
        />
      </div>
      {/* Floating notification card */}
      <div className="absolute -bottom-5 -left-4 z-10 min-w-[220px] rounded-xl border border-gray-100 bg-white px-5 py-3.5 shadow-xl">
        <p className="font-bold text-gray-900 text-xs">
          Permission updated by Admin
        </p>
        <p className="mt-0.5 font-medium text-[10px] text-purple-500">
          Access modified • Just now
        </p>
      </div>
    </div>
  );
}

/**
 * RbacUpdatingMockup — Section 1 "Just press record"
 * Teal/green background card with "Updating permissions..." loader + Save button
 */
export function RbacUpdatingMockup() {
  return (
    <div className="flex min-h-[280px] w-full flex-col justify-center overflow-hidden rounded-2xl bg-[#2aa8a0] p-8 shadow-xl">
      {/* Centre card */}
      <div className="mx-auto w-full max-w-sm rounded-xl bg-white px-5 pt-4 pb-5 shadow-md">
        {/* Avatar + text + Save */}
        <div className="flex items-center gap-3 border-gray-100 border-b pb-3">
          <div className="size-9 shrink-0 overflow-hidden rounded-full bg-gray-200">
            <img
              alt="User"
              className="size-full object-cover"
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80"
            />
          </div>
          <span className="flex-1 font-medium text-gray-700 text-sm">
            Updating permissions...
          </span>
          <button className="shrink-0 font-bold text-gray-800 text-sm hover:text-black">
            Save
          </button>
        </div>
        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-gray-400"
              style={{ width: "55%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * RbacChannelMockup — Section 3 "Play 'em your way"
 * Dark-bordered card with "# team-permissions" channel + Fathima + audio UI
 */
export function RbacChannelMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border-2 border-gray-900 bg-white shadow-xl">
      {/* Channel header */}
      <div className="flex items-center justify-between border-gray-200 border-b px-4 py-3">
        <span className="font-bold text-gray-900 text-sm">
          # team-permissions
        </span>
        <div className="flex gap-2">
          <div className="size-4 rounded bg-gray-200" />
          <div className="size-4 rounded bg-gray-200" />
          <div className="size-4 rounded bg-gray-200" />
        </div>
      </div>

      {/* Message */}
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="size-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
            <img
              alt="Fathima"
              className="size-full object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-gray-900 text-sm">Fathima</span>
              <span className="text-[10px] text-gray-400">
                Role update • Just now
              </span>
            </div>
            {/* Audio player UI */}
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-900">
                <svg
                  aria-hidden="true"
                  fill="white"
                  height="10"
                  viewBox="0 0 24 24"
                  width="10"
                >
                  <path d="M5 3L19 12L5 21V3Z" />
                </svg>
              </div>
              {/* Waveform bars */}
              <div className="flex h-5 flex-1 items-end gap-0.5">
                {[3, 8, 5, 12, 7, 10, 6, 14, 9, 5, 11, 8, 4, 12, 7].map(
                  (h, i) => (
                    <div
                      className="w-1 rounded-sm"
                      key={`${h}-${i}`}
                      style={{
                        height: `${h}px`,
                        backgroundColor: i < 8 ? "#1f2937" : "#d1d5db",
                      }}
                    />
                  )
                )}
              </div>
              <span className="shrink-0 font-medium text-[10px] text-gray-500">
                1x
              </span>
            </div>
          </div>
        </div>

        {/* System message */}
        <p className="mt-3 text-[10px] text-gray-400 leading-4">
          Admin has updated access permissions for the marketing team members.{" "}
          <a className="font-semibold text-purple-600 underline" href="#">
            View permission details
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * RbacVideoMockup — Section 4 (right side)
 * Film reel illustration on a warm beige circle background
 */
export function RbacVideoMockup() {
  return (
    <div className="flex min-h-[280px] w-full items-center justify-center">
      <style>
        {`
          @keyframes oscillateRotate {
            0% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
            100% { transform: rotate(-10deg); }
          }
          .animate-oscillate {
            animation: oscillateRotate 4s ease-in-out infinite;
          }
        `}
      </style>
      <div className="relative flex size-96 items-center justify-center rounded-full bg-[#f5ede3]">
        {/* Film reel icon */}
        <div className="relative flex size-48 animate-oscillate items-center justify-center">
          {/* Outer filmstrip frame */}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border-[#2d4a7a] border-[6px] bg-[#e85d2f]">
            {/* Sprocket holes top */}
            <div className="absolute -top-2 flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div className="size-3 rounded-sm bg-[#2d4a7a]" key={i} />
              ))}
            </div>
            {/* Sprocket holes bottom */}
            <div className="absolute -bottom-2 flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div className="size-3 rounded-sm bg-[#2d4a7a]" key={i} />
              ))}
            </div>
            {/* Play button */}
            <div className="flex size-16 items-center justify-center rounded-full bg-white/90 shadow-md">
              <svg
                aria-hidden="true"
                fill="#e85d2f"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M5 3L19 12L5 21V3Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * RbacTabletImageMockup — Section 2 "Sync on any schedule" (right side)
 * Forest image inside a dark rounded tablet device frame.
 */
export function RbacTabletImageMockup() {
  return (
    <div className="w-full overflow-hidden rounded-[2rem] border-[6px] border-gray-900 shadow-2xl">
      <img
        alt="Forest path"
        className="aspect-[4/3] w-full object-cover"
        loading="lazy"
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"
      />
    </div>
  );
}
