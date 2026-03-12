import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

/**
 * HistoryHero
 * ─────────────────────────────────────────────────────
 * Left-aligned headline + subtitle + CTAs.
 * Right side has floating circular images and comment bubbles
 * that create a playful, dynamic visual (matching the reference).
 */
export function HistoryHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white px-6 pt-28 pb-20 lg:px-12 lg:pt-48 lg:pb-32 xl:px-20">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* ── Left: Text ── */}
          <div className="max-w-2xl">
            <h1 className="font-bold text-[#1d1c1d] text-[1rem] leading-[1.05] tracking-tight sm:text-6xl lg:text-[5rem] xl:text-[5.5rem]">
              Access Your Complete Message History
            </h1>
            <p className="mt-6 max-w-lg text-[#1d1c1d] text-xl leading-8 lg:text-2xl">
              Never lose an important conversation again. Instantly search,
              filter, and revisit past messages to keep your team informed and
              productive.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Button className="h-14 rounded bg-[#611f69] px-8 font-bold text-sm text-white uppercase tracking-[0.1em] hover:bg-[#4a154b]">
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button
                className="h-14 px-4 font-bold text-[#611f69] text-sm uppercase tracking-[0.1em] hover:bg-transparent hover:text-[#4a154b]"
                variant="ghost"
              >
                Talk to Sales
              </Button>
            </div>
          </div>

          {/* ── Right: Floating visuals ── */}
          <div className="relative ml-auto hidden aspect-square w-full max-w-[600px] lg:block xl:max-w-[700px]">
            {/* Circular images */}
            {/* Top Forest Image */}
            <div className="absolute top-[5%] left-[15%] z-10 size-[180px] overflow-hidden rounded-full border-[8px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] xl:size-[240px]">
              <img
                alt="Forest"
                className="size-full object-cover"
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80"
              />
            </div>

            {/* Center Mountain Image */}
            <div className="absolute top-[25%] right-[0%] z-20 size-[260px] overflow-hidden rounded-full border-[8px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] xl:size-[320px]">
              <div className="absolute inset-0 z-30 rounded-full border-[#e01e5a] border-[6px]" />
              <img
                alt="Mountain"
                className="size-full object-cover"
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
              />
            </div>

            {/* Bottom Dog Image */}
            <div className="absolute bottom-[5%] left-[25%] z-30 size-[160px] overflow-hidden rounded-full border-[8px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] xl:size-[220px]">
              <img
                alt="Dog"
                className="size-full object-cover"
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80"
              />
            </div>

            {/* Floating comment bubbles */}
            <div className="absolute top-[45%] left-[0%] z-40 rounded-full bg-[#ecb22e] px-5 py-2 font-bold text-[#1d1c1d] text-sm shadow-lg xl:px-6 xl:py-3 xl:text-base">
              Added some comments!
            </div>
            <div className="absolute right-[5%] bottom-[10%] z-40 flex items-center gap-2 rounded-full bg-[#00badb] px-5 py-2 font-bold text-[#1d1c1d] text-sm shadow-lg xl:px-6 xl:py-3 xl:text-base">
              Looks good!
            </div>

            {/* Reaction badge */}
            <div className="absolute top-[65%] left-[30%] z-40 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[#1d1c1d] text-xs shadow-lg ring-1 ring-black/5 xl:px-4 xl:py-2 xl:text-sm">
              <span>👀</span> <span className="font-bold">2</span>
            </div>

            {/* Document badge */}
            <div className="absolute top-[12%] right-[15%] z-40 flex items-start gap-2 rounded-xl bg-white p-3 shadow-lg ring-1 ring-black/5 xl:gap-3 xl:p-4">
              <div className="flex size-7 shrink-0 items-center justify-center rounded bg-[#1264a3] xl:size-8">
                <span className="font-bold text-[10px] text-white xl:text-xs">
                  W
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#616061] text-[9px] uppercase tracking-widest xl:text-[10px]">
                  Document from OneDrive
                </span>
                <span className="mt-0.5 font-bold text-[#1d1c1d] text-xs xl:text-sm">
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
