import { Button } from "@/components/ui/button";

/**
 * HistoryHero
 * ─────────────────────────────────────────────────────
 * Left-aligned headline + subtitle + CTAs.
 * Right side has floating circular images and comment bubbles
 * that create a playful, dynamic visual (matching the reference).
 */
export function HistoryHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white px-6 pb-20 pt-28 lg:px-12 lg:pb-32 lg:pt-48 xl:px-20">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* ── Left: Text ── */}
          <div className="max-w-2xl">
            <h1 className="font-bold text-[1rem] leading-[1.05] tracking-tight text-[#1d1c1d] sm:text-6xl lg:text-[5rem] xl:text-[5.5rem]">
              Access Your Complete Message History
            </h1>
            <p className="mt-6 max-w-lg text-xl leading-8 text-[#1d1c1d] lg:text-2xl">
              Never lose an important conversation again. Instantly search, filter, and revisit past messages to keep your team informed and productive.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Button className="h-14 rounded bg-[#611f69] px-8 text-sm font-bold uppercase tracking-[0.1em] text-white hover:bg-[#4a154b]">
                Get Started
              </Button>
              <Button
                variant="ghost"
                className="h-14 px-4 text-sm font-bold uppercase tracking-[0.1em] text-[#611f69] hover:bg-transparent hover:text-[#4a154b]"
              >
                Talk to Sales
              </Button>
            </div>
          </div>

          {/* ── Right: Floating visuals ── */}
          <div className="relative hidden w-full ml-auto max-w-[600px] xl:max-w-[700px] aspect-square lg:block">
            {/* Circular images */}
            {/* Top Forest Image */}
            <div className="absolute left-[15%] top-[5%] z-10 size-[180px] overflow-hidden rounded-full border-[8px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] xl:size-[240px]">
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80"
                alt="Forest"
                className="size-full object-cover"
              />
            </div>
            
            {/* Center Mountain Image */}
            <div className="absolute right-[0%] top-[25%] z-20 size-[260px] overflow-hidden rounded-full border-[8px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] xl:size-[320px]">
              <div className="absolute inset-0 z-30 rounded-full border-[6px] border-[#e01e5a]" />
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
                alt="Mountain"
                className="size-full object-cover"
              />
            </div>
            
            {/* Bottom Dog Image */}
            <div className="absolute bottom-[5%] left-[25%] z-30 size-[160px] overflow-hidden rounded-full border-[8px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] xl:size-[220px]">
              <img
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80"
                alt="Dog"
                className="size-full object-cover"
              />
            </div>

            {/* Floating comment bubbles */}
            <div className="absolute left-[0%] top-[45%] z-40 rounded-full bg-[#ecb22e] px-5 py-2 text-sm font-bold text-[#1d1c1d] shadow-lg xl:px-6 xl:py-3 xl:text-base">
              Added some comments!
            </div>
            <div className="absolute bottom-[10%] right-[5%] z-40 flex items-center gap-2 rounded-full bg-[#00badb] px-5 py-2 text-sm font-bold text-[#1d1c1d] shadow-lg xl:px-6 xl:py-3 xl:text-base">
              Looks good!
            </div>

            {/* Reaction badge */}
            <div className="absolute left-[30%] top-[65%] z-40 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs text-[#1d1c1d] shadow-lg ring-1 ring-black/5 xl:px-4 xl:py-2 xl:text-sm">
              <span>👀</span> <span className="font-bold">2</span>
            </div>

            {/* Document badge */}
            <div className="absolute right-[15%] top-[12%] z-40 flex items-start gap-2 rounded-xl bg-white p-3 shadow-lg ring-1 ring-black/5 xl:gap-3 xl:p-4">
              <div className="flex size-7 shrink-0 items-center justify-center rounded bg-[#1264a3] xl:size-8">
                <span className="text-[10px] font-bold text-white xl:text-xs">W</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#616061] xl:text-[10px]">
                  Document from OneDrive
                </span>
                <span className="mt-0.5 text-xs font-bold text-[#1d1c1d] xl:text-sm">
                  Here's the plan for Q3.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
