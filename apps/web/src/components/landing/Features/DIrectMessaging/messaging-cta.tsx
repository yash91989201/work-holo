import { Button } from "@/components/ui/button";

/**
 * MessagingCta
 * ─────────────────────────────────────────────────────
 * Simple bottom CTA bar with two buttons (GET STARTED / TALK TO SALES)
 * matching the reference design's minimalist style.
 */
export function MessagingCta() {
  return (
    <section className="w-full border-[#e5e7eb] border-t bg-white py-10 sm:py-14">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-6">
        <Button className="h-11 rounded bg-[#611f69] px-6 font-bold text-white text-xs uppercase tracking-[0.1em] hover:bg-[#4a154b]">
          Get Started
        </Button>
        <Button
          className="h-11 px-1 font-bold text-[#611f69] text-xs uppercase tracking-[0.1em] hover:bg-transparent hover:text-[#4a154b]"
          variant="ghost"
        >
          Talk to Sales
        </Button>
      </div>
    </section>
  );
}
