export function ListsHeroMockup() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-2xl">
      <div className="flex h-full w-full overflow-hidden rounded-lg border border-gray-100 bg-[#f8f9fa]">
        {/* Sidebar mockup */}
        <div className="flex w-1/4 flex-col gap-4 bg-[#3E113C] p-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="mt-4 flex flex-col gap-2 opacity-50">
            <div className="h-3 w-3/4 rounded-full bg-white/20" />
            <div className="h-3 w-5/6 rounded-full bg-white/20" />
            <div className="h-3 w-2/3 rounded-full bg-white/20" />
          </div>
          <div className="mt-6 flex flex-col gap-2 opacity-50">
            <span className="font-bold text-[10px] text-white/50 uppercase">
              Channels
            </span>
            <div className="mt-2 h-3 w-full rounded-full bg-white/20" />
          </div>
        </div>

        {/* Main content mockup */}
        <div className="flex flex-1 flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-gray-100 border-b px-6 py-4">
            <span className="font-bold text-gray-900"># project-launch</span>
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded bg-gray-100" />
              <div className="h-6 w-6 rounded bg-gray-100" />
            </div>
          </div>

          {/* Chat/List area */}
          <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex gap-3">
              <div className="h-8 w-8 shrink-0 rounded bg-[#FFD18B]" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">
                    Madhu Sharma
                  </span>
                  <span className="text-gray-400 text-xs">10:42 AM</span>
                </div>
                <p className="mt-1 text-gray-600 text-sm">
                  Add a new task to the list here 👇 here!
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#FFD18B] text-white">
                    <svg
                      fill="none"
                      height="12"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      width="12"
                    >
                      <title>Add</title>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900 text-sm">
                      Create new task
                    </span>
                    <span className="block text-[10px] text-gray-500">
                      List
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-8 w-8 shrink-0 rounded bg-[#B1C3FF]" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">
                    Fathima Parveen
                  </span>
                  <span className="text-gray-400 text-xs">10:45 AM</span>
                </div>
                <p className="mt-1 text-gray-600 text-sm">
                  Task successfully added!
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2 py-1">
                  <span aria-label="thumbs up" className="text-xs" role="img">
                    👍
                  </span>
                  <span className="font-medium text-gray-600 text-xs">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListsTemplatesSection() {
  return (
    <section className="w-full bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-extrabold text-3xl text-gray-900 tracking-tight sm:text-5xl">
            Simplify project administration
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500 text-lg">
            Use predefined list templates to quickly configure tasks, projects,
            and contact lists.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Mockup UI */}
          <div className="relative w-full rounded-2xl bg-[#FDF7EA] p-6 lg:p-8">
            <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
              <div className="flex items-center justify-between border-gray-100 border-b px-6 py-4">
                <span className="font-bold text-gray-900"># feedback</span>
                <div className="flex gap-2">
                  <div className="h-5 w-5 rounded bg-gray-100" />
                  <div className="h-5 w-5 rounded bg-gray-100" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-xl">
                  Feedback tracker
                </h3>
                <p className="mt-1 mb-6 text-gray-400 text-sm">
                  Describe how your team plans to use this list
                </p>

                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 border-gray-100 border-b pb-3 font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                  <div className="col-span-1">Feedback</div>
                  <div className="col-span-1">Details</div>
                  <div className="col-span-1 text-center">Type</div>
                  <div className="col-span-1 text-center">Severity</div>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-4 items-center gap-4 border-gray-50 border-b py-4 text-sm">
                  <div className="col-span-1 truncate pr-4 font-medium text-gray-900">
                    Button is confusing
                  </div>
                  <div className="col-span-1 truncate pr-4 text-gray-500">
                    The button says 'Confirm' and...
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 font-medium text-red-600 text-xs">
                      ❤️ Pain point
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className="mx-2 inline-flex flex-1 items-center justify-center rounded bg-purple-100 px-2 py-1 font-medium text-purple-700 text-xs">
                      Medium
                    </span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-4 items-center gap-4 border-gray-50 border-b py-4 text-sm">
                  <div className="col-span-1 truncate pr-4 font-medium text-gray-900">
                    Colours are too similar
                  </div>
                  <div className="col-span-1 truncate pr-4 text-gray-500">
                    The orange and yellow status...
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 font-medium text-xs text-yellow-600">
                      ✏️ Design i...
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className="mx-2 inline-flex flex-1 items-center justify-center rounded bg-blue-100 px-2 py-1 font-medium text-blue-700 text-xs">
                      Low
                    </span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-4 items-center gap-4 py-4 text-sm">
                  <div className="col-span-1 truncate pr-4 font-medium text-gray-900">
                    Love the new update!
                  </div>
                  <div className="col-span-1 truncate pr-4 text-gray-500">
                    It's made it so much easier for m...
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 font-medium text-green-600 text-xs">
                      💚 Praise
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className="mx-2 inline-flex flex-1 items-center justify-center rounded bg-blue-100 px-2 py-1 font-medium text-blue-700 text-xs">
                      Low
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Templates List */}
          <div className="flex flex-col space-y-2">
            <button
              className="rounded-xl px-6 py-5 text-left transition hover:bg-gray-50"
              type="button"
            >
              <span className="mb-1 block font-bold text-gray-900">
                Project management starter kit
              </span>
              <span className="block text-gray-500 text-sm">
                Essentials for keeping projects on track.
              </span>
            </button>

            {/* Active Template */}
            <div className="flex flex-col rounded-xl border border-gray-100 bg-white px-6 py-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
              <span className="mb-2 font-bold text-gray-900">
                Task feedback tracker
              </span>
              <p className="mb-4 text-gray-500 text-sm">
                Organize and prioritize task feedback and requests efficiently
              </p>
              <a
                className="inline-flex items-center gap-1.5 font-bold text-gray-900 text-sm hover:underline"
                href="/features/lists"
              >
                See template
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <title>Arrow Right</title>
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>

            <button
              className="rounded-xl px-6 py-5 text-left transition hover:bg-gray-50"
              type="button"
            >
              <span className="mb-1 block font-bold text-gray-900">
                Contact list manager
              </span>
              <span className="block text-gray-500 text-sm">
                Essentials for keeping projects on track.
              </span>
            </button>
            <button
              className="rounded-xl px-6 py-5 text-left transition hover:bg-gray-50"
              type="button"
            >
              <span className="mb-1 block font-bold text-gray-900">
                Project dashboard checklist
              </span>
              <span className="block text-gray-500 text-sm">
                Essentials for keeping projects on track.
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
