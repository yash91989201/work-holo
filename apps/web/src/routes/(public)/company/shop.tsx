import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(public)/company/shop")({
  component: ShopPage,
});

const highlights = [
  {
    badge: "New Arrival",
    title: "WorkHolo Branded T-shirts: Limited Edition",
    cta: "SHOP NOW",
  },
  {
    badge: "Software",
    title: "New Advanced Reporting Dashboard Extension",
    cta: "LEARN MORE",
  },
  {
    badge: "Guide",
    title: "Free vs Paid: Unlocking the best of WorkHolo",
    cta: "READ STORY",
  },
];

const faqs = [
  {
    question: "What branded merchandise is available?",
    answer:
      "We offer a range of branded merchandise including t-shirts, hoodies, mugs, stickers, laptop sleeves, and notebooks. All items feature the WorkHolo logo and brand colors.",
  },
  {
    question: "How do I install software add-ons?",
    answer:
      "Software add-ons can be installed directly from your WorkHolo dashboard. Navigate to Settings > Integrations > Add-ons and click 'Install' on the add-on you want to add.",
  },
  {
    question: "Are add-ons available for free users?",
    answer:
      "Some basic add-ons are available for free users, while premium add-ons require a paid subscription. Check each add-on's details page for pricing information.",
  },
  {
    question: "Is there a discount for bulk orders?",
    answer:
      "Yes! We offer discounts for bulk merchandise orders of 10+ items. Contact our sales team for enterprise pricing on team merchandise packages.",
  },
  {
    question: "How do I upgrade to a premium plan?",
    answer:
      "You can upgrade to a premium plan from your account settings. We offer monthly and annual billing options, with discounts available for annual subscriptions.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-border border-b last:border-b-0">
      <details className="group">
        <summary className="flex w-full cursor-pointer items-center justify-between py-5 text-left">
          <span className="font-semibold text-base text-foreground">
            {question}
          </span>
          <svg
            className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
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
        </summary>
        <p className="pb-5 text-muted-foreground text-sm leading-relaxed">
          {answer}
        </p>
      </details>
    </div>
  );
}

function ShopPage() {
  return (
    <div className="w-full">
      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 font-bold text-foreground/50 text-xs uppercase tracking-widest">
              WORKHOLO SHOP
            </p>
            <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight sm:text-5xl lg:text-5xl lg:leading-[1.1]">
              Elevate Your Workspace with WorkHolo Shop
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
              Discover branded merchandise, powerful software add-ons, and
              premium features designed to enhance your productivity.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="rounded-md bg-[#7C5CFF] px-7 font-semibold text-sm text-white uppercase tracking-wide hover:bg-[#6B4CE6]"
                size="lg"
              >
                <Link to="/">SHOP NOW</Link>
              </Button>
              <Button
                asChild
                className="rounded-md border-[#7C5CFF] px-7 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-[#7C5CFF]/5"
                size="lg"
                variant="outline"
              >
                <Link to="/">VIEW ADD-ONS</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/60 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#7C5CFF]/10">
                <svg
                  className="text-[#7C5CFF]"
                  fill="none"
                  height="28"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="28"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className="font-semibold">Branded Mugs & T-shirts</p>
            </div>

            <div className="rounded-2xl border border-border/60 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#7C5CFF]/10">
                <svg
                  className="text-[#7C5CFF]"
                  fill="none"
                  height="28"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="28"
                >
                  <rect height="16" rx="2" ry="2" width="20" x="2" y="4" />
                  <path d="M6 20h12" />
                </svg>
              </div>
              <p className="font-semibold">New Laptop Stickers</p>
            </div>

            <div className="rounded-2xl border border-border/60 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#7C5CFF]/10">
                <svg
                  className="text-[#7C5CFF]"
                  fill="none"
                  height="28"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="28"
                >
                  <rect height="14" rx="2" ry="2" width="20" x="2" y="3" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
              </div>
              <p className="font-semibold">Advanced Reporting Dashboards</p>
            </div>

            <div className="rounded-2xl border border-border/60 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#7C5CFF]/10">
                <svg
                  className="text-[#7C5CFF]"
                  fill="none"
                  height="28"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="28"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="font-semibold">Team Management Modules</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background p-8">
              <h2 className="font-bold text-2xl">Branded Merchandise</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Show your WorkHolo pride with our exclusive collection of mugs,
                T-shirts, and laptop stickers. High-quality gear for the modern
                professional.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-8">
              <h2 className="font-bold text-2xl">
                Software Add-ons & Extensions
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Supercharge your WebApp with extra reporting dashboards and
                advanced team management modules. Built to scale with your
                business.
              </p>
              <a
                className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                href="#"
              >
                Explore Extensions <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex items-center justify-center">
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 via-[#7C5CFF]/10 to-background">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#7C5CFF] shadow-lg">
                    <svg
                      className="text-white"
                      fill="none"
                      height="40"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="40"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="h-2 w-32 rounded-full bg-[#7C5CFF]/30" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                Unlock Premium Features
              </h2>
              <p className="mt-4 text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                Paid users get exclusive access to advanced communication tools
                and priority support. Upgrade your plan to unlock the full
                potential of WorkHolo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="mb-4 text-center font-bold text-3xl tracking-tight sm:text-4xl">
            WorkHolo Shop at a glance
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Quickly access and purchase everything you need to make WorkHolo
            your own. From physical gear to digital power-ups, we&apos;ve got
            you covered.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background p-8">
              <h3 className="font-bold text-lg">Branded Gear</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Show your WorkHolo pride with our exclusive collection of mugs,
                T-shirts, and laptop stickers. High-quality gear for the modern
                professional.
              </p>
              <a
                className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                href="#"
              >
                Browse Merchandise <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-8">
              <h3 className="font-bold text-lg">Software Extensions</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Supercharge your WebApp with extra reporting dashboards and
                advanced team management modules. Built to scale with your
                business.
              </p>
              <a
                className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                href="#"
              >
                Explore Add-ons <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-8">
              <h3 className="font-bold text-lg">Premium Access</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Unlock additional features and tools based on your subscription
                plan. Free users can purchase individual add-ons to enhance
                their workflow.
              </p>
              <a
                className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                href="#"
              >
                Compare Plans <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="mb-12 text-center font-bold text-3xl tracking-tight sm:text-4xl">
            Discover WorkHolo Shop Highlights
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <div
                className="flex flex-col rounded-2xl border border-border/60 bg-muted/40 p-8"
                key={item.title}
              >
                <span className="mb-3 w-fit rounded-full bg-[#7C5CFF]/10 px-3 py-1 font-semibold text-[#7C5CFF] text-xs">
                  {item.badge}
                </span>
                <h3 className="flex-1 font-bold text-base leading-snug">
                  {item.title}
                </h3>
                <div className="mt-6 flex items-center justify-between border-border border-t pt-4">
                  <a
                    className="font-semibold text-[#7C5CFF] text-xs uppercase tracking-wider transition-colors hover:text-[#6B4CE6]"
                    href="#"
                  >
                    {item.cta} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
          <h2 className="mb-10 text-center font-bold text-3xl tracking-tight sm:text-4xl">
            Frequently asked questions about WorkHolo Shop
          </h2>
          <div className="divide-y-0 rounded-2xl border border-border/60 bg-background px-8">
            {faqs.map((faq) => (
              <FaqItem
                answer={faq.answer}
                key={faq.question}
                question={faq.question}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#7C5CFF] py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-12">
          <h2 className="mx-auto max-w-3xl font-bold text-3xl text-white leading-tight tracking-tight sm:text-4xl">
            Ready to upgrade your experience?
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="rounded-md bg-white px-8 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-white/90"
              size="lg"
            >
              <Link to="/">START SHOPPING</Link>
            </Button>
            <Button
              asChild
              className="rounded-md border-2 border-white bg-transparent px-8 font-semibold text-sm text-white uppercase tracking-wide hover:bg-white/10"
              size="lg"
              variant="outline"
            >
              <Link to="/">UPGRADE PLAN</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
