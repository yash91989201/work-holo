import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/landing/footer";
import { HistoryHero } from "./history-hero";
import { HistoryFeatureSection } from "./history-feature-section";
import {
  ChatMockup,
  StatusMockup,
  IntegrationsMockup,
} from "./history-mockups";
import { HistoryFeaturesGrid } from "./history-features-grid";
import { HistoryResourceCards } from "./history-resource-cards";
import { HistoryFaq } from "./history-faq";
import { HistoryCta } from "./history-cta";

/**
 * MessageHistoryPage
 * ─────────────────────────────────────────────────────
 * Full page for the "Message History" feature.
 * Composed of unique sections that match the reference design.
 */
export function MessageHistoryPage() {
  return (
    <div className="w-full bg-white">

      {/* Hero — left text, floating visuals right */}
      <HistoryHero />

      {/* Section 1: Chat mockup LEFT, text RIGHT */}
      <HistoryFeatureSection
        heading="Search and review conversations instantly"
        description="Every message you send or receive is securely stored and searchable. Quickly find past discussions, shared files, and important decisions whenever you need them."
        visual={<ChatMockup />}
        layout="image-left"
      />

      {/* Section 2: Text LEFT, status mockup RIGHT */}
      <HistoryFeatureSection
        heading="Access message history from anywhere"
        description="Whether you're on desktop or mobile, your message history stays synced across all devices. Continue conversations, review previous updates, and stay aligned with your team wherever you are."
        visual={<StatusMockup />}
        layout="content-left"
      />

      {/* Section 3: Integrations LEFT, text RIGHT */}
      <HistoryFeatureSection
        heading="Keep message history connected with your tools"
        description="Message history becomes even more powerful when connected to your work tools. Search past updates, files, and discussions from apps like Google Drive, Salesforce, and project tools in one place."
        linkText="Explore integrations >"
        linkHref="/marketplace"
        visual={<IntegrationsMockup />}
        layout="image-left"
      />

      {/* 3-column features grid */}
      <HistoryFeaturesGrid />

      {/* Resource / blog cards */}
      <HistoryResourceCards />

      {/* FAQ */}
      <HistoryFaq />

      {/* Bottom CTA */}
      <HistoryCta />

    </div>
  );
}
