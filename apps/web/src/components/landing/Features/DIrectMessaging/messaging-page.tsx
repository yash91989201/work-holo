import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/landing/footer";
import { MessagingHero } from "./messaging-hero";
import { MessagingFeatureSection } from "./messaging-feature-section";
import {
  ChatMockup,
  StatusMockup,
  IntegrationsMockup,
} from "./messaging-mockups";
import { MessagingFeaturesGrid } from "./messaging-features-grid";
import { MessagingResourceCards } from "./messaging-resource-cards";
import { MessagingFaq } from "./messaging-faq";
import { MessagingCta } from "./messaging-cta";

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
        heading="Choose the communication style that works for you"
        description="Collaboration isn't limited to just text. Use voice, video and more to help get your message across."
        visual={<ChatMockup />}
        layout="image-left"
      />

      {/* Section 2: Text LEFT, status mockup RIGHT */}
      <MessagingFeatureSection
        heading="Connect with people wherever they're working"
        description="Bring everyone in your organisation together with a place to communicate and collaborate. From one-to-ones to team chats, you'll get the in-office feeling from anywhere you work."
        visual={<StatusMockup />}
        layout="content-left"
      />

      {/* Section 3: Integrations LEFT, text RIGHT */}
      <MessagingFeatureSection
        heading="Bring context into the conversation"
        description="Get important updates, discuss them and take action — all without switching tabs. By connecting other work tools to Workholo, you can have richer, more informed conversations."
        linkText="See the Workholo Marketplace"
        linkHref="#"
        visual={<IntegrationsMockup />}
        layout="image-left"
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
