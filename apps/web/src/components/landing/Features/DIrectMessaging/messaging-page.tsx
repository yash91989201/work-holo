import { MessagingCta } from "./messaging-cta";
import { MessagingFaq } from "./messaging-faq";
import { MessagingFeatureSection } from "./messaging-feature-section";
import { MessagingFeaturesGrid } from "./messaging-features-grid";
import { MessagingHero } from "./messaging-hero";
import {
  ChatMockup,
  IntegrationsMockup,
  StatusMockup,
} from "./messaging-mockups";
import { MessagingResourceCards } from "./messaging-resource-cards";

/**
 * MessagingPage
 * ─────────────────────────────────────────────────────
 * Full page for the "Direct Messaging / Messaging" feature.
 * Composed of unique sections that match the reference design.
 */
export function MessagingPage() {
  return (
    <div className="w-full bg-white">
      {/* Hero — left text, floating visuals right */}
      <MessagingHero />

      {/* Section 1: Chat mockup LEFT, text RIGHT */}
      <MessagingFeatureSection
        description="Collaboration isn't limited to just text. Use voice, video and more to help get your message across."
        heading="Choose the communication style that works for you"
        layout="image-left"
        visual={<ChatMockup />}
      />

      {/* Section 2: Text LEFT, status mockup RIGHT */}
      <MessagingFeatureSection
        description="Bring everyone in your organisation together with a place to communicate and collaborate. From one-to-ones to team chats, you'll get the in-office feeling from anywhere you work."
        heading="Connect with people wherever they're working"
        layout="content-left"
        visual={<StatusMockup />}
      />

      {/* Section 3: Integrations LEFT, text RIGHT */}
      <MessagingFeatureSection
        description="Get important updates, discuss them and take action — all without switching tabs. By connecting other work tools to Workholo, you can have richer, more informed conversations."
        heading="Bring context into the conversation"
        layout="image-left"
        linkHref="#"
        linkText="See the Workholo Marketplace"
        visual={<IntegrationsMockup />}
      />

      {/* 3-column features grid */}
      <MessagingFeaturesGrid />

      {/* Resource / blog cards */}
      <MessagingResourceCards />

      {/* FAQ */}
      <MessagingFaq />

      {/* Bottom CTA */}
      <MessagingCta />
    </div>
  );
}
