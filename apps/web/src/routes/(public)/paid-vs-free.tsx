import { createFileRoute } from "@tanstack/react-router";
import { FeatureCardContentLeft } from "@/components/landing/Features/TeamChannel/feature-card-content-left";
import { FeatureCardImageLeft } from "@/components/landing/Features/TeamChannel/feature-card-image-left";
import { FeatureFaqSection } from "@/components/landing/Features/TeamChannel/feature-faq-section";
import { FeatureHero } from "@/components/landing/Features/TeamChannel/feature-hero";
import {
  PaidVsFreeBasicMessagingMockup,
  PaidVsFreeHeroMockup,
  PaidVsFreePreferencesMockup,
} from "@/components/landing/paid-vs-free-mockups";

export const Route = createFileRoute("/(public)/paid-vs-free")({
  component: PaidVsFreePage,
});

/* ─── Hero Data ─── */
const heroData = {
  category: "PLAN COMPARISON",
  headingBefore: "Choose the plan\nthat's right for\nyour team",
  headingHighlight: "",
  subtitle:
    "Compare our Free and Paid plans. Unlock advanced\nfeatures, team management, and custom\ncommunication preferences as you grow.",
  ctaPrimary: "TALK TO SALES",
  ctaSecondary: "",
  layout: "user-management-hero" as const, // Reusing this layout as it fits the left-aligned text + right-aligned image
};

/* ─── FAQ Data ─── */
const faqData = {
  heading: "Frequently asked questions",
  items: [
    {
      question: "What's included in the Free plan?",
      answer:
        "The Free plan includes basic messaging, limited message history, and core integration features perfect for small, newly formed teams.",
    },
    {
      question: "How do I upgrade to a Paid plan?",
      answer:
        "You can upgrade at any time from your workspace settings dashboard. Changes take effect immediately without downtime.",
    },
    {
      question: "What are the benefits of Paid channels?",
      answer:
        "Paid channels offer unlimited message history, advanced permissions, guest access controls, and larger file storage capacity.",
    },
    {
      question: "Can I switch between plans?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes to billing will be prorated accordingly.",
    },
  ],
};

function PaidVsFreePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <main className="flex-1">
        {/* Added extra padding-bottom to the hero to match the spacing in the screenshot */}
        <div className="rounded-b-[3rem] bg-white pb-16 sm:pb-32">
          <FeatureHero
            bgClass="bg-transparent"
            category={heroData.category}
            ctaPrimary={heroData.ctaPrimary}
            ctaSecondary={heroData.ctaSecondary}
            headingBefore={heroData.headingBefore}
            headingHighlight={heroData.headingHighlight}
            heroMockup={<PaidVsFreeHeroMockup />}
            layout={heroData.layout}
            subtitle={heroData.subtitle}
          />
        </div>

        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 py-16 sm:py-24 lg:px-8">
          {/* Basic vs Advanced Messaging - Right aligned text, Custom minimal mockup on left */}
          <div className="grid min-h-[400px] items-center gap-12 lg:grid-cols-2">
            <div className="flex w-full justify-center">
              <PaidVsFreeBasicMessagingMockup />
            </div>
            <div className="w-full pl-0 lg:pl-12">
              <h2 className="mb-4 font-bold text-3xl text-gray-900 leading-tight tracking-tight sm:text-4xl">
                Basic vs. Advanced Messaging
              </h2>
              <p className="max-w-xl text-base text-gray-600 leading-relaxed">
                Our Free plan includes basic messaging for small teams. Upgrade
                to Paid to unlock organized channels and threaded conversations
                for better collaboration.
              </p>
            </div>
          </div>

          <FeatureCardImageLeft
            badge=""
            bgVariant="white"
            description="Paid plans offer robust team management tools. Control user roles, manage workspace settings, and ensure your data stays secure with advanced administrative controls."
            heading="Team Management & Controls"
          />

          <FeatureCardContentLeft
            badge=""
            bgVariant="white"
            description="Customize how your team communicates. Paid users can set advanced notification preferences, custom statuses, and integrate with their favorite tools."
            heading="Communication Preferences"
            mockup={<PaidVsFreePreferencesMockup />}
          />
        </div>

        {/* Testimonial Section */}
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-20 sm:px-12">
          <div className="flex w-full flex-col gap-8">
            <p className="text-center font-light text-2xl text-gray-500 italic leading-snug sm:text-3xl lg:text-4xl">
              'Upgrading to the Paid plan was the best decision for our growing
              team. The advanced channels and team management features have
              completely transformed our workflow.'
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="size-12 shrink-0 overflow-hidden rounded-full">
                <img
                  alt="Product Manager avatar"
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-sm">
                  Product Manager
                </div>
                <div className="text-gray-500 text-xs">
                  Growth & Operations Team
                </div>
              </div>
            </div>
          </div>
          {/* Background SVG Shield decoration */}
        </div>

        <FeatureFaqSection heading={faqData.heading} items={faqData.items} />
      </main>
    </div>
  );
}
