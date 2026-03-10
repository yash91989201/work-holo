import { createFileRoute } from "@tanstack/react-router";
import { FeatureHero } from "@/components/landing/Features/TeamChannel/feature-hero";
import { FeatureCardImageLeft } from "@/components/landing/Features/TeamChannel/feature-card-image-left";
import { FeatureCardContentLeft } from "@/components/landing/Features/TeamChannel/feature-card-content-left";
import { FeatureFaqSection } from "@/components/landing/Features/TeamChannel/feature-faq-section";
import { Footer } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/landing-header";
import {
  PricingHeroMockup,
  PricingChannelsMockup,
  PricingStorageMockup,
  PricingSecurityMockup,
  PricingAdminDashboardMockup,
} from "@/components/landing/pricing-mockups";

export const Route = createFileRoute("/(public)/pricing")({
  component: PricingPage,
});

/* ─── Hero Data ─── */
const heroData = {
  category: "",
  headingBefore: "Premium Dialer\nfor Modern Teams",
  headingHighlight: "₹149 / user / month",
  subtitle: "Minimum 10 users per workspace\n\nEmpower your team with a secure, high-performance dialer. Built for scale, security, and seamless collaboration.",
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
      answer: "The plan includes unlimited channels, messaging, search, 100 GB storage, file sharing, full admin control, and secure workspace features.",
    },
    {
      question: "Is there a minimum user requirement?",
      answer: "Yes, there is a minimum requirement of 10 users per workspace to access the premium dialer features.",
    },
    {
      question: "How secure is the dialer?",
      answer: "We use enterprise-grade encryption for all communications. Role-based access and admin controls ensure your data remains secure.",
    },
  ],
};

function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <FeatureHero
          category={heroData.category}
          headingBefore={heroData.headingBefore}
          headingHighlight={heroData.headingHighlight}
          subtitle={heroData.subtitle}
          ctaPrimary={heroData.ctaPrimary}
          ctaSecondary={heroData.ctaSecondary}
          layout={heroData.layout}
          heroLinksTitle={heroData.heroLinksTitle}
          heroLinks={heroData.heroLinks}
          heroMockup={<PricingHeroMockup />}
          bgClass="bg-white"
        />

        <div className="flex flex-col gap-12 py-16 sm:py-24">
          <FeatureCardImageLeft
            badge="UNLIMITED COMMUNICATION"
            heading="Unlimited Channels & Messaging"
            description="Break down silos with unlimited channels for every project, topic, or team. Message without limits and keep everyone in the loop with real-time sync across all devices."
            mockup={<PricingChannelsMockup />}
            bgVariant="white"
          />

          <FeatureCardContentLeft
            badge="ORGANIZATION STORAGE"
            heading="100 GB File & Media Sharing"
            description="Store and share your important documents, images, and videos with 100 GB of secure organization storage. Everything is indexed and searchable for quick access."
            mockup={<PricingStorageMockup />}
            bgVariant="white"
          />

          <FeatureCardImageLeft
            badge="SECURITY & CONTROL"
            heading="Full Admin Control & Role-Based Access"
            description="Maintain complete control over your workspace with advanced administrative tools. Define roles, manage permissions, and ensure your data stays within the secure workspace."
            mockup={<PricingSecurityMockup />}
            bgVariant="white"
          />
        </div>

        {/* Custom Stats Section */}
        <section className="w-full bg-white py-16 sm:py-24">
          <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-balance font-bold text-3xl tracking-tight text-foreground sm:text-4xl">
                Built for Secure Collaboration
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                Everything you need to manage a high-performing team in a single, secure workspace.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="w-full">
                <PricingAdminDashboardMockup />
              </div>
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Unlimited Channels & Search</h3>
                  <p className="text-sm text-gray-600">Access every conversation and file without limits.</p>
                </div>
                
                <div className="rounded-xl border-2 border-purple-200 bg-white p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#7C5CFF]" />
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Full Admin Chat Control</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage your workspace with granular role-based access.</p>
                  <a href="#" className="text-sm font-semibold text-[#7C5CFF] hover:text-[#6a4de6]">Learn more &rarr;</a>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">100 GB Organization Storage</h3>
                  <p className="text-sm text-gray-600">Store all your media and files securely in one place.</p>
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
