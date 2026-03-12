import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ChangelogContinuousInnovation,
  ChangelogHeroPillsMockup,
  ChangelogReleaseHistory,
} from "@/components/landing/changelog-mockups";
import { FeatureCardContentLeft } from "@/components/landing/Features/TeamChannel/feature-card-content-left";
import { FeatureCardImageLeft } from "@/components/landing/Features/TeamChannel/feature-card-image-left";
import { FeatureFaqSection } from "@/components/landing/Features/TeamChannel/feature-faq-section";

export const Route = createFileRoute("/(public)/changelog")({
  component: ChangelogPage,
});

function ChangelogPage() {
  const faqData = {
    heading: "Frequently asked questions about updates",
    items: [
      {
        question: "How do I update to the latest version?",
        answer:
          "If you are using the WebApp, updates happen automatically under the hood without any required action. For desktop apps, you will be prompted to restart when a new update downloads.",
      },
      {
        question: "Where can I see the full list of bug fixes?",
        answer:
          "Every major release includes a detailed changelog accessible from the 'Recent Release History' section. We also publish minor patch notes in our community forum.",
      },
      {
        question: "How do I enable browser notifications?",
        answer:
          "Navigate to Settings > Notifications inside your workspace. From there, your browser will ask you to 'Allow' notifications for the WorkHolo URL.",
      },
      {
        question: "Are security updates automatic?",
        answer:
          "Yes. Security patches are applied server-side immediately. You do not need to take any action to remain protected.",
      },
      {
        question: "Can I revert to a previous version?",
        answer:
          "Currently, we do not support rolling back to earlier versions of the web application in order to maintain security and database compatibility.",
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#faf8f5] font-sans selection:bg-[#7C5CFF]/20">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
              <div className="max-w-2xl">
                <span className="mb-6 inline-block font-bold text-gray-500 text-sm uppercase tracking-widest">
                  PRODUCT UPDATES
                </span>
                <h1 className="text-balance font-bold text-4xl text-gray-900 tracking-tight sm:text-6xl">
                  What's New in Dialer WebApp
                </h1>
                <p className="mt-6 max-w-lg text-balance text-gray-600 text-lg leading-8">
                  Stay updated with our latest software improvements, bug fixes,
                  and feature releases. We're constantly evolving to provide the
                  best calling experience.
                </p>
                <div className="mt-10 flex items-center gap-x-4">
                  <a
                    className="rounded-md bg-[#7C5CFF] px-8 py-3.5 font-bold text-sm text-white tracking-wide shadow-sm transition hover:bg-[#6b4de0]"
                    href="#"
                  >
                    VIEW LATEST
                  </a>
                  <a
                    className="rounded-md bg-transparent px-8 py-3.5 font-bold text-[#7C5CFF] text-sm tracking-wide ring-1 ring-gray-300 ring-inset transition hover:bg-gray-50"
                    href="#"
                  >
                    SUBSCRIBE
                  </a>
                </div>
              </div>

              <div className="relative w-full">
                <ChangelogHeroPillsMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Alternating Feature Sections */}
        <div className="bg-white">
          <FeatureCardImageLeft
            badge=""
            bgVariant="white"
            description="Stay on top of your communication with instant alerts. Our new notification system ensures you're notified of incoming calls and messages, even if Dialer is running in the background."
            // Starry sky image
            heading="Real-time Browser Notifications"
            imageSrc="https://images.unsplash.com/photo-1542382257-80da9fb9f5c5?w=800&q=80"
          />

          <FeatureCardContentLeft
            badge=""
            bgVariant="white"
            description="We've implemented end-to-end encryption enhancements and improved our session management to ensure your business calls remain private and protected from unauthorized access."
            heading="Hardened Security Infrastructure"
            imageSrc="https://images.unsplash.com/photo-1517486808506-29fa8804cbbe?w=800&q=80"
            // Tall grass image
            linkHref="/changelog"
            linkText="Read our Security Whitepaper"
          />

          <FeatureCardImageLeft
            badge=""
            bgVariant="white"
            className="pb-32"
            // Black and white ocean pier image
            description="Experience a completely redesigned call interface. We've optimized the layout for faster access to dial pads, contact lists, and call history, reducing clicks and increasing efficiency."
            heading="Refined User Interface v2.0"
            imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" // Extra padding before the next block
          />
        </div>

        {/* Continuous Innovation 3-Col Block */}
        <ChangelogContinuousInnovation />

        {/* Recent Release History 3-Col Block */}
        <ChangelogReleaseHistory />

        {/* FAQ Section */}
        <div className="bg-white pt-10">
          <FeatureFaqSection heading={faqData.heading} items={faqData.items} />
        </div>

        {/* Bottom CTA Banner */}
        <section className="w-full bg-[#7C5CFF] py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="font-bold text-3xl text-white tracking-tight sm:text-5xl">
              Stay Ahead with the Latest Updates
            </h2>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                className="rounded-md bg-white px-8 py-3.5 font-bold text-[#7C5CFF] text-sm uppercase tracking-wider shadow-sm transition hover:bg-gray-100"
                to="/contact"
              >
                CONTACT US
              </Link>
              <a
                className="rounded-md bg-transparent px-8 py-3.5 font-bold text-sm text-white uppercase tracking-wider ring-1 ring-white/50 ring-inset transition hover:bg-white/10"
                href="#"
              >
                LEARN MORE
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
