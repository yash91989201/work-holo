import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Shared types
───────────────────────────────────────────── */
export interface SolutionFeatureSection {
  body: string;
  /** Use gray bg? */
  gray?: boolean;
  headline: string;
  /** Optional inline link below body */
  link?: { text: string; href: string };
  /** Which side the text is on */
  textSide: "left" | "right";
  /** JSX for the visual column */
  visual: React.ReactNode;
}

export interface SolutionCard {
  body: string;
  icon: React.ReactNode;
  link?: { text: string; href: string };
  title: string;
}

export interface SolutionInsight {
  category: string;
  cta: string;
  title: string;
}

export interface SolutionFAQ {
  answer: string;
  question: string;
}

export interface SolutionPageData {
  cards?: SolutionCard[];
  /** "Unified tools" grid section */
  cardsHeadline?: string;
  cardsSubhead?: string;
  /** Pass empty string or omit to hide the entire CTA section */
  ctaHeadline?: string;
  ctaPrimary?: string;
  /** Pass empty string or omit to hide the secondary CTA button */
  ctaSecondary?: string;
  /** Eyebrow above hero headline */
  eyebrow: string;
  faqs: SolutionFAQ[];
  /** Custom FAQ section title (defaults to "Frequently asked questions") */
  faqTitle?: string;
  featureSections: SolutionFeatureSection[];
  heroCtas?: { primary: string; secondary?: string };
  heroHeadline: string;
  heroSubhead: string;
  /** JSX hero visual (right column) */
  heroVisual: React.ReactNode;
  insights?: SolutionInsight[];
  /** Insights section */
  insightsHeadline?: string;
}

/* ─────────────────────────────────────────────
   FAQ Accordion item
───────────────────────────────────────────── */
function FaqItem({ question, answer }: SolutionFAQ) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-border border-b last:border-b-0">
      <button
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="font-semibold text-base text-foreground">
          {question}
        </span>
        <svg
          aria-hidden="true"
          className={cn(
            "ml-4 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
          fill="none"
          height="20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="20"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-96 pb-5" : "max-h-0"
        )}
      >
        <p className="text-muted-foreground text-sm leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Full Solution Page
───────────────────────────────────────────── */
export function SolutionPage({
  eyebrow,
  heroHeadline,
  heroSubhead,
  heroCtas = { primary: "GET STARTED", secondary: "TALK TO SALES" },
  heroVisual,
  featureSections,
  cardsHeadline,
  cardsSubhead,
  cards,
  insightsHeadline,
  insights,
  faqs,
  faqTitle = "Frequently asked questions",
  ctaHeadline,
  ctaPrimary = "GET STARTED",
  ctaSecondary = "TALK TO SALES",
}: SolutionPageData) {
  return (
    <div className="w-full">
      {/* ── Hero ───────────────────────────────── */}
      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text */}
            <div>
              <p className="mb-4 font-bold text-foreground/50 text-xs uppercase tracking-widest">
                {eyebrow}
              </p>
              <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight sm:text-5xl lg:text-5xl lg:leading-[1.1]">
                {heroHeadline}
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                {heroSubhead}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="rounded-md bg-[#7C5CFF] px-7 font-semibold text-sm text-white uppercase tracking-wide hover:bg-[#6B4CE6]"
                  size="lg"
                >
                  <Link to="/">{heroCtas.primary}</Link>
                </Button>
                {heroCtas.secondary && (
                  <Button
                    asChild
                    className="rounded-md border-[#7C5CFF] px-7 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-[#7C5CFF]/5"
                    size="lg"
                    variant="outline"
                  >
                    <Link to="/">{heroCtas.secondary}</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Visual */}
            <div className="flex items-center justify-center">{heroVisual}</div>
          </div>
        </div>
      </section>

      {/* ── Feature Zig-Zag ─────────────────────── */}
      {featureSections.map((section) => (
        <section
          className={cn(
            "py-20 sm:py-24 lg:py-28",
            section.gray ? "bg-muted/40" : "bg-background"
          )}
          key={section.headline}
        >
          <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div
              className={cn(
                "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
                section.textSide === "right" &&
                  "lg:[&>*:first-child]:order-last"
              )}
            >
              {/* Visual */}
              <div className="flex items-center justify-center">
                {section.visual}
              </div>

              {/* Text */}
              <div>
                <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                  {section.headline}
                </h2>
                <p className="mt-4 text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                  {section.body}
                </p>
                {section.link && (
                  <a
                    className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                    href={section.link.href}
                  >
                    {section.link.text} <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Cards Section ────────────────────────── */}
      {cards && cards.length > 0 && (
        <section className="bg-background py-20 sm:py-24 lg:py-28">
          <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            {cardsHeadline && (
              <div className="mx-auto mb-14 max-w-3xl text-center">
                <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                  {cardsHeadline}
                </h2>
                {cardsSubhead && (
                  <p className="mt-4 text-pretty text-base text-muted-foreground leading-relaxed">
                    {cardsSubhead}
                  </p>
                )}
              </div>
            )}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <div
                  className="rounded-2xl border border-border/60 p-8"
                  key={card.title}
                >
                  <div className="mb-5 flex size-10 items-center justify-center text-foreground">
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-lg">{card.title}</h3>
                  <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                    {card.body}
                  </p>
                  {card.link && (
                    <a
                      className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                      href={card.link.href}
                    >
                      {card.link.text} <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Insights Section ──────────────────────── */}
      {insights && insights.length > 0 && (
        <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
          <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            {insightsHeadline && (
              <h2 className="mb-12 text-center font-bold text-3xl tracking-tight sm:text-4xl">
                {insightsHeadline}
              </h2>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {insights.map((insight) => (
                <div
                  className="flex flex-col rounded-2xl bg-background p-8 shadow-sm"
                  key={insight.title}
                >
                  <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                    {insight.category}
                  </p>
                  <h3 className="flex-1 font-bold text-base leading-snug">
                    {insight.title}
                  </h3>
                  <div className="mt-6 flex items-center justify-between border-border border-t pt-4">
                    <a
                      className="font-semibold text-[#7C5CFF] text-xs uppercase tracking-wider transition-colors hover:text-[#6B4CE6]"
                      href={
                        insight.cta.toLowerCase().includes("download")
                          ? "#download"
                          : "#"
                      }
                    >
                      {insight.cta} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ Section ──────────────────────────── */}
      {faqs.length > 0 && (
        <section className="bg-background py-20 sm:py-24 lg:py-28">
          <div className="container mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
            <h2 className="mb-10 text-center font-bold text-3xl tracking-tight sm:text-4xl">
              {faqTitle}
            </h2>
            <div className="divide-y-0 rounded-2xl border border-border/60 px-8">
              {faqs.map((faq) => (
                <FaqItem key={faq.question} {...faq} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────── */}
      {ctaHeadline && (
        <section className="bg-[#7C5CFF] py-20 sm:py-24 lg:py-28">
          <div className="container mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-12">
            <h2 className="mx-auto max-w-3xl font-bold text-3xl text-white leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {ctaHeadline}
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="rounded-md bg-white px-8 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-white/90"
                size="lg"
              >
                <Link to="/">{ctaPrimary}</Link>
              </Button>
              {ctaSecondary && (
                <Button
                  asChild
                  className="rounded-md border-2 border-white bg-transparent px-8 font-semibold text-sm text-white uppercase tracking-wide hover:bg-white/10"
                  size="lg"
                  variant="outline"
                >
                  <Link to="/">{ctaSecondary}</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
