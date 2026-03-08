import { Button } from "@/components/ui/button";

/**
 * HistoryCta
 * ─────────────────────────────────────────────────────
 * Simple bottom CTA bar with two buttons (GET STARTED / TALK TO SALES)
 * matching the reference design's minimalist style.
 */
export function HistoryCta() {
  return (
    <section className="w-full border-t border-[#e5e7eb] bg-white py-10 sm:py-14">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-6">
        <Button className="h-11 rounded bg-[#611f69] px-6 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-[#4a154b]">
          Get Started
        </Button>
        <Button
          variant="ghost"
          className="h-11 px-1 text-xs font-bold uppercase tracking-[0.1em] text-[#611f69] hover:bg-transparent hover:text-[#4a154b]"
        >
          Talk to Sales
        </Button>
      </div>
    </section>
  );
}
