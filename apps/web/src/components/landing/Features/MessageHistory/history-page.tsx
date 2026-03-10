import { HistoryCta } from "./history-cta";
import { HistoryFaq } from "./history-faq";
import { HistoryFeatureSection } from "./history-feature-section";
import { HistoryFeaturesGrid } from "./history-features-grid";
import { HistoryHero } from "./history-hero";
import {
  ChatMockup,
  IntegrationsMockup,
  StatusMockup,
} from "./history-mockups";
import { HistoryResourceCards } from "./history-resource-cards";

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
        description="Every message you send or receive is securely stored and searchable. Quickly find past discussions, shared files, and important decisions whenever you need them."
        heading="Search and review conversations instantly"
        layout="image-left"
        visual={<ChatMockup />}
      />

      {/* Section 2: Text LEFT, status mockup RIGHT */}
      <HistoryFeatureSection
        description="Whether you're on desktop or mobile, your message history stays synced across all devices. Continue conversations, review previous updates, and stay aligned with your team wherever you are."
        heading="Access message history from anywhere"
        layout="content-left"
        visual={<StatusMockup />}
      />

      {/* Section 3: Integrations LEFT, text RIGHT */}
      <HistoryFeatureSection
        description="Message history becomes even more powerful when connected to your work tools. Search past updates, files, and discussions from apps like Google Drive, Salesforce, and project tools in one place."
        heading="Keep message history connected with your tools"
        layout="image-left"
        linkHref="/marketplace"
        linkText="Explore integrations >"
        visual={<IntegrationsMockup />}
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
