import { createFileRoute } from "@tanstack/react-router";
import { FeatureCardContentLeft } from "@/components/landing/Features/TeamChannel/feature-card-content-left";
import { FeatureCardImageLeft } from "@/components/landing/Features/TeamChannel/feature-card-image-left";
import { FeatureFaqSection } from "@/components/landing/Features/TeamChannel/feature-faq-section";
import { FeatureHero } from "@/components/landing/Features/TeamChannel/feature-hero";
import {
  PricingAdminDashboardMockup,
  PricingChannelsMockup,
  PricingHeroMockup,
  PricingSecurityMockup,
  PricingStorageMockup,
} from "@/components/landing/pricing-mockups";

export const Route = createFileRoute("/(public)/pricing")({
  component: PricingPage,
});

/* ─── Hero Data ─── */
const heroData = {
  category: "",
  headingBefore: "Premium Dialer\nfor Modern Teams",
  headingHighlight: "₹149 / user / month",
  subtitle:
    "Minimum 10 users per workspace\n\nEmpower your team with a secure, high-performance dialer. Built for scale, security, and seamless collaboration.",
  ctaPrimary: "START YOUR TRIAL",
  ctaSecondary: "",
  layout: "user-management-hero" as const,
  heroLinksTitle: "EVERYTHING YOU NEED TO SCALE:",
  heroLinks: [
    { text: "UNLIMITED MESSAGING", href: "#" },
    { text: "SECURE WORKSPACE", href: "#" },
    { text: "ADMIN CONTROL", href: "#" },
  ],
};

/* ─── FAQ Data ─── */
const faqData = {
  heading: "Frequently asked questions",
  items: [
    {
      question: "What is included in the ₹149 plan?",
      answer:
        "The plan includes unlimited channels, messaging, search, 100 GB storage, file sharing, full admin control, and secure workspace features.",
    },
    {
      question: "Is there a minimum user requirement?",
      answer:
        "Yes, there is a minimum requirement of 10 users per workspace to access the premium dialer features.",
    },
    {
      question: "How secure is the dialer?",
      answer:
        "We use enterprise-grade encryption for all communications. Role-based access and admin controls ensure your data remains secure.",
    },
  ],
};

function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <FeatureHero
          bgClass="bg-white"
          category={heroData.category}
          ctaPrimary={heroData.ctaPrimary}
          ctaSecondary={heroData.ctaSecondary}
          headingBefore={heroData.headingBefore}
          headingHighlight={heroData.headingHighlight}
          heroLinks={heroData.heroLinks}
          heroLinksTitle={heroData.heroLinksTitle}
          heroMockup={<PricingHeroMockup />}
          layout={heroData.layout}
          subtitle={heroData.subtitle}
        />

        <div className="flex flex-col gap-12 py-16 sm:py-24">
          <FeatureCardImageLeft
            badge="UNLIMITED COMMUNICATION"
            bgVariant="white"
            description="Break down silos with unlimited channels for every project, topic, or team. Message without limits and keep everyone in the loop with real-time sync across all devices."
            heading="Unlimited Channels & Messaging"
            mockup={<PricingChannelsMockup />}
          />

          <FeatureCardContentLeft
            badge="ORGANIZATION STORAGE"
            bgVariant="white"
            description="Store and share your important documents, images, and videos with 100 GB of secure organization storage. Everything is indexed and searchable for quick access."
            heading="100 GB File & Media Sharing"
            mockup={<PricingStorageMockup />}
          />

          <FeatureCardImageLeft
            badge="SECURITY & CONTROL"
            bgVariant="white"
            description="Maintain complete control over your workspace with advanced administrative tools. Define roles, manage permissions, and ensure your data stays within the secure workspace."
            heading="Full Admin Control & Role-Based Access"
            mockup={<PricingSecurityMockup />}
          />
        </div>

        {/* Custom Stats Section */}
        <section className="w-full bg-white py-16 sm:py-24">
          <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-balance font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
                Built for Secure Collaboration
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-7 sm:text-lg">
                Everything you need to manage a high-performing team in a
                single, secure workspace.
              </p>
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="w-full">
                <PricingAdminDashboardMockup />
              </div>
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="mb-2 font-bold text-gray-900 text-lg">
                    Unlimited Channels & Search
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Access every conversation and file without limits.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 bg-white p-6 shadow-sm">
                  <div className="absolute top-0 left-0 h-full w-1 bg-[#7C5CFF]" />
                  <h3 className="mb-2 font-bold text-gray-900 text-lg">
                    Full Admin Chat Control
                  </h3>
                  <p className="mb-4 text-gray-600 text-sm">
                    Manage your workspace with granular role-based access.
                  </p>
                  <a
                    className="font-semibold text-[#7C5CFF] text-sm hover:text-[#6a4de6]"
                    href="#"
                  >
                    Learn more &rarr;
                  </a>
                </div>

                <div>
                  <h3 className="mb-2 font-bold text-gray-900 text-lg">
                    100 GB Organization Storage
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Store all your media and files securely in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeatureFaqSection heading={faqData.heading} items={faqData.items} />
      </main>
    </div>
  );
}
