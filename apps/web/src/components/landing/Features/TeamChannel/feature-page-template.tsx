import { FeatureHero } from "./feature-hero";
import { FeatureCardImageLeft } from "./feature-card-image-left";
import { FeatureCardContentLeft } from "./feature-card-content-left";
import { FeatureStatsSection } from "./feature-stats-section";
import { FeatureFaqSection } from "./feature-faq-section";
import { FeatureCtaSection } from "./feature-cta-section";
import { FeatureResourceCardsSection } from "./feature-resource-cards-section";
import { InteractiveTemplateList } from "../UserManagement/interactive-template-list";
import {
  UserChatMockup,
  UserPermissionsMockup,
  UserCanvasMockup,
  FeedbackTrackerMockup,
  StarterKitMockup,
  RoleManagerMockup,
  AdminDashboardMockup,
} from "../UserManagement/user-management-mockups";
import {
  RbacHeroMockup,
  RbacUpdatingMockup,
  RbacChannelMockup,
  RbacTabletImageMockup,
  RbacVideoMockup,
} from "../RoleBasedAccess/rbac-mockups";
import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/landing/footer";
import type { FeaturePageData } from "./feature-page-data";

interface FeaturePageTemplateProps {
  data: FeaturePageData;
}

export function FeaturePageTemplate({ data }: FeaturePageTemplateProps) {
  return (
    <div className="w-full">
      <FeatureHero
        category={data.category}
        headingBefore={data.headingBefore}
        headingHighlight={data.headingHighlight}
        subtitle={data.subtitle}
        ctaPrimary={data.ctaPrimary}
        ctaSecondary={data.ctaSecondary}
        layout={data.heroLayout}
        imageSrc={data.heroImageSrc}
        imageAlt={data.heroImageAlt}
        hasPlayButton={data.heroHasPlayButton}
        bgClass={data.heroBgClass}
        heroMockup={data.slug === "role-based-access" ? <RbacHeroMockup /> : undefined}
      />
      {data.sections.map((section, i) => {
        // Inject coded UI mockups based on slug
        const sectionMockup =
          data.slug === "user-management"
            ? i === 0
              ? <UserChatMockup />
              : i === 1
              ? <UserPermissionsMockup />
              : <UserCanvasMockup />
            : data.slug === "role-based-access"
            ? i === 0
              ? <RbacUpdatingMockup />
              : i === 1
              ? <RbacTabletImageMockup />
              : i === 2
              ? <RbacChannelMockup />
              : i === 3
              ? <RbacVideoMockup />
              : undefined
            : undefined;

        return section.layout === "image-left" ? (
          <FeatureCardImageLeft
            key={section.heading}
            badge={section.badge}
            heading={section.heading}
            description={section.description}
            linkText={section.linkText}
            linkHref={section.linkHref}
            imageSrc={sectionMockup ? undefined : section.imageSrc}
            imageAlt={section.imageAlt}
            mockup={sectionMockup}
            bgVariant={section.bgVariant}
          />
        ) : section.layout === "content-left" || section.layout === "image-right" ? (
          <FeatureCardContentLeft
            key={section.heading}
            badge={section.badge}
            heading={section.heading}
            description={section.description}
            linkText={section.linkText}
            linkHref={section.linkHref}
            imageSrc={sectionMockup ? undefined : section.imageSrc}
            imageAlt={section.imageAlt}
            mockup={sectionMockup}
            bgVariant={section.bgVariant}
            stat={section.stat}
            statLabel={section.statLabel}
            citation={section.citation}
            quote={section.quote}
            quoteAuthor={section.quoteAuthor}
            quoteRole={section.quoteRole}
            quoteTeam={section.quoteTeam}
          />
        ) : null;
      })}
      {data.statsHeadline && data.statsSubtitle && data.stats && (
        <FeatureStatsSection
          headline={data.statsHeadline}
          subtitle={data.statsSubtitle}
          stats={data.stats as [typeof data.stats[0], typeof data.stats[0], typeof data.stats[0]]}
        />
      )}
      {data.resourceCardsHeadline && data.resourceCards && data.resourceCards.length > 0 && (
        <FeatureResourceCardsSection
          heading={data.resourceCardsHeadline}
          cards={data.resourceCards}
          bgClass={data.resourceCardsBgClass}
        />
      )}
      {data.templatesSection && (
        <InteractiveTemplateList
          heading={data.templatesSection.heading}
          subtitle={data.templatesSection.subtitle}
          templates={data.templatesSection.items}
          mockupMap={
            data.slug === "user-management"
              ? {
                  "starter-kit": <StarterKitMockup />,
                  "feedback-tracker": <FeedbackTrackerMockup />,
                  "role-manager": <RoleManagerMockup />,
                  "admin-dashboard": <AdminDashboardMockup />,
                }
              : undefined
          }
        />
      )}
      <FeatureFaqSection heading={data.faqHeadline} items={data.faq} />
      <FeatureCtaSection
        heading={data.ctaHeading}
        ctaPrimary={data.ctaPrimary}
        ctaSecondary={data.ctaSecondary}
      />
    </div>
  );
}
