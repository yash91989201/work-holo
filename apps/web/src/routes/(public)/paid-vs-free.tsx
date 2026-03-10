import { createFileRoute } from "@tanstack/react-router";
import { FeatureHero } from "@/components/landing/Features/TeamChannel/feature-hero";
import { FeatureCardImageLeft } from "@/components/landing/Features/TeamChannel/feature-card-image-left";
import { FeatureCardContentLeft } from "@/components/landing/Features/TeamChannel/feature-card-content-left";
import { FeatureFaqSection } from "@/components/landing/Features/TeamChannel/feature-faq-section";
import { Footer } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/landing-header";
import {
  PaidVsFreeHeroMockup,
  PaidVsFreeBasicMessagingMockup,
  PaidVsFreeTeamManagementMockup,
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
  subtitle: "Compare our Free and Paid plans. Unlock advanced\nfeatures, team management, and custom\ncommunication preferences as you grow.",
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
      answer: "The Free plan includes basic messaging, limited message history, and core integration features perfect for small, newly formed teams.",
    },
    {
      question: "How do I upgrade to a Paid plan?",
      answer: "You can upgrade at any time from your workspace settings dashboard. Changes take effect immediately without downtime.",
    },
    {
      question: "What are the benefits of Paid channels?",
      answer: "Paid channels offer unlimited message history, advanced permissions, guest access controls, and larger file storage capacity.",
    },
    {
      question: "Can I switch between plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes to billing will be prorated accordingly.",
    },
  ],
};

function PaidVsFreePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <main className="flex-1">
        {/* Added extra padding-bottom to the hero to match the spacing in the screenshot */}
        <div className="pb-16 sm:pb-32 bg-white rounded-b-[3rem]">
          <FeatureHero
            category={heroData.category}
            headingBefore={heroData.headingBefore}
            headingHighlight={heroData.headingHighlight}
            subtitle={heroData.subtitle}
            ctaPrimary={heroData.ctaPrimary}
            ctaSecondary={heroData.ctaSecondary}
            layout={heroData.layout}
            heroMockup={<PaidVsFreeHeroMockup />}
            bgClass="bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-12 py-16 sm:py-24 max-w-[1200px] mx-auto px-6 lg:px-8">
          
          {/* Basic vs Advanced Messaging - Right aligned text, Custom minimal mockup on left */}
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[400px]">
            <div className="w-full flex justify-center">
              <PaidVsFreeBasicMessagingMockup />
            </div>
            <div className="w-full pl-0 lg:pl-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
                Basic vs. Advanced Messaging
              </h2>
              <p className="text-base text-gray-600 leading-relaxed max-w-xl">
                Our Free plan includes basic messaging for small teams. Upgrade to Paid to unlock organized channels and threaded conversations for better collaboration.
              </p>
            </div>
          </div>

          <FeatureCardImageLeft
            badge=""
            heading="Team Management & Controls"
            description="Paid plans offer robust team management tools. Control user roles, manage workspace settings, and ensure your data stays secure with advanced administrative controls."
            bgVariant="white"
          />

          <FeatureCardContentLeft
            badge=""
            heading="Communication Preferences"
            description="Customize how your team communicates. Paid users can set advanced notification preferences, custom statuses, and integrate with their favorite tools."
            mockup={<PaidVsFreePreferencesMockup />}
            bgVariant="white"
          />
        </div>

          {/* Testimonial Section */}
          <div className="flex flex-col items-center py-20 px-6 sm:px-12 w-full max-w-5xl mx-auto">
            <div className="flex flex-col gap-8 w-full">
              <p className="text-2xl sm:text-3xl lg:text-4xl text-gray-500 font-light italic leading-snug text-center">
                'Upgrading to the Paid plan was the best decision for our growing team. The advanced channels and team management features have completely transformed our workflow.'
              </p>
              <div className="flex items-center gap-4 justify-center">
                <div className="size-12 rounded-full overflow-hidden shrink-0">
                  <img
                    alt="Product Manager avatar"
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                  />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">Product Manager</div>
                  <div className="text-gray-500 text-xs">Growth & Operations Team</div>
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
