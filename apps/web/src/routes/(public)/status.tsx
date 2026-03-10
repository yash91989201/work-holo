import { createFileRoute } from "@tanstack/react-router";
import { FeatureCardContentLeft } from "@/components/landing/Features/TeamChannel/feature-card-content-left";
import { FeatureCardImageLeft } from "@/components/landing/Features/TeamChannel/feature-card-image-left";
import { FeatureFaqSection } from "@/components/landing/Features/TeamChannel/feature-faq-section";
import {
  StatusOperationalMockup,
  StatusTransparencyMockup,
  StatusUpdatesGridMockup,
} from "@/components/landing/status-mockups";

export const Route = createFileRoute("/(public)/status")({
  component: StatusPage,
});

function StatusPage() {
  const faqData = {
    heading: "Frequently asked questions",
    items: [
      {
        question: "How often is the status page updated?",
        answer:
          "The status page checks our core infrastructure every 60 seconds. Any disruptions are reflected here almost instantaneously.",
      },
      {
        question: "Can I get notifications for maintenance?",
        answer:
          "Yes, you can subscribe to updates via email, SMS, or webhook by clicking the 'Subscribe to updates' button at the top of the page.",
      },
      {
        question: "What features are affected during maintenance?",
        answer:
          "Unless specified in the active incident banner, minor updates usually only cause short connection drops to real-time sockets. Core data remains unaffected.",
      },
      {
        question: "Where can I find uptime history?",
        answer:
          "You can view detailed historical uptime by clicking on the 'View detailed metrics' links in the transparency section above, which hosts up to 90 days of logs.",
      },
    ],
  };

  const trustedLogos = [
    "Capital One",
    "IBM",
    "Spotify",
    "Box",
    "OpenAI",
    "Rivian",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans selection:bg-[#7C5CFF]/20">
      <main className="flex-1">
        {/* Top Hero Section */}
        <section className="relative w-full overflow-hidden bg-white pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="max-w-xl">
                <span className="mb-6 inline-block font-bold text-gray-500 text-xs uppercase tracking-widest">
                  REAL-TIME SERVICE STATUS
                </span>
                <h1 className="text-balance font-extrabold text-4xl text-gray-900 leading-tight tracking-tight sm:text-6xl">
                  All systems are
                  <br />
                  operational.
                </h1>
                <p className="mt-6 max-w-md text-balance text-gray-500 text-lg leading-8 tracking-tight">
                  Monitor our platform's real-time performance, uptime
                  statistics, and notifications about scheduled server
                  maintenance affecting messaging or team creation.
                </p>
              </div>

              <div className="relative w-full">
                <StatusOperationalMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Blocks */}
        <div className="bg-white">
          {/* 1. Monitoring */}
          <FeatureCardContentLeft
            badge="REAL-TIME MONITORING"
            bgVariant="white"
            containerClass="max-w-[1480px]"
            description="We maintain a 99.9% uptime guarantee. Track our real-time availability across all core services including messaging and team creation."
            heading="Uptime you can trust."
            imageSrc="https://images.unsplash.com/photo-1549420042-32a21b44ec43?w=800&q=80"
            linkHref="/status"
            linkText="View uptime dashboard"
          />

          {/* 2. Maintenance */}
          <FeatureCardImageLeft
            badge="SERVER MAINTENANCE"
            bgVariant="white"
            containerClass="max-w-[1480px]"
            description="Receive instant notifications about scheduled server maintenance. We plan updates during low-traffic hours to minimize impact on your team."
            heading="Stay ahead of updates."
            imageSrc="https://images.unsplash.com/photo-1517486808506-29fa8804cbbe?w=800&q=80"
            linkHref="/status"
            linkText="Maintenance schedule"
          />

          {/* 3. Incident Reporting */}
          <FeatureCardContentLeft
            badge="INCIDENT REPORTING"
            bgVariant="white"
            containerClass="max-w-[1480px]"
            description="In the rare event of a service disruption, we provide detailed real-time updates and comprehensive post-mortem reports."
            heading="Transparent communication."
            imageSrc="https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80"
            linkHref="/changelog"
            linkText="Incident archive"
          />
        </div>

        {/* Centered Testimonial */}
        <section className="w-full bg-white py-24 sm:py-32">
          <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center lg:px-8">
            <h2 className="text-balance font-extrabold text-3xl text-[#2e375b] italic leading-tight tracking-tight sm:text-5xl">
              StatusCheck+
            </h2>
            <p className="mt-8 text-balance font-medium text-2xl text-[#475467] italic leading-relaxed sm:text-3xl">
              'Our commitment to transparency ensures that every team knows
              exactly when our systems are at peak performance, allowing for
              uninterrupted collaboration.'
            </p>
            <div className="mt-8">
              <span className="block font-bold text-gray-900">
                Daniel Roberts
              </span>
              <span className="mt-1 block font-medium text-gray-500 text-sm">
                Infrastructure Lead, StatusCheck+
              </span>
            </div>
          </div>
        </section>

        {/* System transparency tabbed layout */}
        <StatusTransparencyMockup />

        {/* Trusted By Strip */}
        <section className="w-full border-gray-100 border-b bg-white py-12">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-8">
            <p className="mb-8 text-center font-bold text-gray-400 text-xs uppercase tracking-[0.2em] sm:mb-12">
              TRUSTED BY TEAMS WHO REQUIRE 100% RELIABILITY
            </p>
            <div className="flex flex-wrap items-center justify-between gap-8 opacity-40 grayscale sm:gap-12 lg:gap-16">
              {trustedLogos.map((logo) => (
                <span
                  className="font-bold font-sans text-gray-600 text-xl tracking-tight"
                  key={logo}
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Updates Grid */}
        <StatusUpdatesGridMockup />

        {/* FAQ Section */}
        <div className="bg-white pb-32">
          <FeatureFaqSection heading={faqData.heading} items={faqData.items} />
        </div>
      </main>
    </div>
  );
}
