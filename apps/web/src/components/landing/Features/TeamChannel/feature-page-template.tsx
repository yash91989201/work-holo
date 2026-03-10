import {
  AdminAddMembersTemplateMockup,
  AdminChannelsMockup,
  AdminCreateChannelMockup,
  AdminHeroMockup,
  AdminMembersMockup,
  AdminRemoveMembersTemplateMockup,
  AdminTriageMockup,
} from "../AdminDashboard/admin-dashboard-mockups";
import {
  CentralizedChannelsMockup,
  CentralizedOrgMockup,
  CentralizedWorkMgmtMockup,
  CentralizedWorkspaceHeroMockup,
} from "../CentralizedWorkspace/centralized-workspace-mockups";
import {
  RbacChannelMockup,
  RbacHeroMockup,
  RbacUpdatingMockup,
  RbacVideoMockup,
} from "../RoleBasedAccess/rbac-mockups";
import {
  StructuredChannelsMockup,
  StructuredCollabMockup,
  StructuredCommHeroMockup,
  StructuredMembersMockup,
} from "../StructuredComm/structured-comm-mockups";
import { InteractiveTemplateList } from "../UserManagement/interactive-template-list";
import {
  AdminDashboardMockup,
  FeedbackTrackerMockup,
  RoleManagerMockup,
  StarterKitMockup,
  UserCanvasMockup,
  UserChatMockup,
  UserPermissionsMockup,
} from "../UserManagement/user-management-mockups";
import {
  WorkspaceHeroMockup,
  WorkspaceMembersMockup,
  WorkspaceTeamsMockup,
} from "../WorkspaceControl/workspace-control-mockups";
import { FeatureCardContentLeft } from "./feature-card-content-left";
import { FeatureCardImageLeft } from "./feature-card-image-left";
import { FeatureCtaSection } from "./feature-cta-section";
import { FeatureFaqSection } from "./feature-faq-section";
import { FeatureHero } from "./feature-hero";
import type { FeaturePageData } from "./feature-page-data";
import { FeatureResourceCardsSection } from "./feature-resource-cards-section";
import { FeatureStatsSection } from "./feature-stats-section";

interface FeaturePageTemplateProps {
  data: FeaturePageData;
}

export function FeaturePageTemplate({ data }: FeaturePageTemplateProps) {
  return (
    <div className="w-full">
      <FeatureHero
        bgClass={data.heroBgClass}
        category={data.category}
        ctaPrimary={data.ctaPrimary}
        ctaSecondary={data.ctaSecondary}
        hasPlayButton={data.heroHasPlayButton}
        headingBefore={data.headingBefore}
        headingHighlight={data.headingHighlight}
        heroLinks={data.heroLinks}
        heroLinksTitle={data.heroLinksTitle}
        heroMockup={
          data.slug === "role-based-access" ? (
            <RbacHeroMockup />
          ) : data.slug === "workspace-control" ? (
            <WorkspaceHeroMockup />
          ) : data.slug === "admin-dashboard" ? (
            <AdminHeroMockup />
          ) : data.slug === "structured-comm" ? (
            <StructuredCommHeroMockup />
          ) : data.slug === "centralized-workspace" ? (
            <CentralizedWorkspaceHeroMockup />
          ) : data.slug === "demo" ? (
            <StructuredCommHeroMockup />
          ) : undefined
        }
        imageAlt={data.heroImageAlt}
        imageSrc={data.heroImageSrc}
        layout={data.heroLayout}
        subtitle={data.subtitle}
      />
      {data.sections.map((section, i) => {
        // Inject coded UI mockups based on slug
        const sectionMockup = (() => {
          if (data.slug === "user-management") {
            if (i === 0) return <UserChatMockup />;
            if (i === 1) return <UserPermissionsMockup />;
            if (i === 2) return <UserCanvasMockup />;
          }
          if (data.slug === "role-based-access") {
            if (i === 0) return <RbacUpdatingMockup />;
            if (i === 1) return <RbacChannelMockup />; // Changed from RbacTabletImageMockup based on instruction's implied change
            if (i === 2) return <RbacVideoMockup />;
          }
          if (data.slug === "workspace-control") {
            if (i === 0) return <WorkspaceTeamsMockup />; // Changed from i === 1 based on instruction's implied change
            if (i === 1) return <WorkspaceMembersMockup />; // Added based on instruction's implied change
          }
          if (data.slug === "admin-dashboard") {
            if (i === 0) return <AdminChannelsMockup />;
            if (i === 1) return <AdminMembersMockup />;
            if (i === 2) return <AdminTriageMockup />;
          }
          if (data.slug === "structured-comm") {
            if (i === 0) return <StructuredChannelsMockup />;
            if (i === 1) return <StructuredMembersMockup />;
            if (i === 2) return <StructuredCollabMockup />;
          }
          if (data.slug === "centralized-workspace") {
            if (i === 0) return <CentralizedOrgMockup />;
            if (i === 1) return <CentralizedChannelsMockup />;
            if (i === 2) return <CentralizedWorkMgmtMockup />;
          }
          if (data.slug === "demo") {
            if (i === 0) return <CentralizedOrgMockup />;
            if (i === 1) return <WorkspaceTeamsMockup />;
            if (i === 2) return <StructuredChannelsMockup />;
          }
          return undefined;
        })();

        return section.layout === "image-left" ? (
          <FeatureCardImageLeft
            badge={section.badge}
            bgVariant={section.bgVariant}
            description={section.description}
            heading={section.heading}
            imageAlt={section.imageAlt}
            imageSrc={sectionMockup ? undefined : section.imageSrc}
            key={section.heading}
            linkHref={section.linkHref}
            linkText={section.linkText}
            mockup={sectionMockup}
          />
        ) : section.layout === "content-left" ||
          section.layout === "image-right" ? (
          <FeatureCardContentLeft
            badge={section.badge}
            bgVariant={section.bgVariant}
            citation={section.citation}
            description={section.description}
            heading={section.heading}
            imageAlt={section.imageAlt}
            imageSrc={sectionMockup ? undefined : section.imageSrc}
            key={section.heading}
            linkHref={section.linkHref}
            linkText={section.linkText}
            mockup={sectionMockup}
            quote={section.quote}
            quoteAuthor={section.quoteAuthor}
            quoteRole={section.quoteRole}
            quoteTeam={section.quoteTeam}
            stat={section.stat}
            statLabel={section.statLabel}
          />
        ) : null;
      })}
      {data.statsHeadline && data.statsSubtitle && data.stats && (
        <FeatureStatsSection
          headline={data.statsHeadline}
          stats={
            data.stats as [
              (typeof data.stats)[0],
              (typeof data.stats)[0],
              (typeof data.stats)[0],
            ]
          }
          subtitle={data.statsSubtitle}
        />
      )}
      {data.resourceCardsHeadline &&
        data.resourceCards &&
        data.resourceCards.length > 0 && (
          <FeatureResourceCardsSection
            bgClass={data.resourceCardsBgClass}
            cards={data.resourceCards}
            heading={data.resourceCardsHeadline}
          />
        )}
      {data.templatesSection && (
        <InteractiveTemplateList
          heading={data.templatesSection.heading}
          mockupMap={
            data.slug === "user-management"
              ? {
                  "starter-kit": <StarterKitMockup />,
                  "feedback-tracker": <FeedbackTrackerMockup />,
                  "role-manager": <RoleManagerMockup />,
                  "admin-dashboard": <AdminDashboardMockup />,
                }
              : data.slug === "admin-dashboard"
                ? {
                    "create-channel": <AdminCreateChannelMockup />,
                    "add-members": <AdminAddMembersTemplateMockup />,
                    "remove-members": <AdminRemoveMembersTemplateMockup />,
                  }
                : undefined
          }
          subtitle={data.templatesSection.subtitle}
          templates={data.templatesSection.items}
        />
      )}
      <FeatureFaqSection heading={data.faqHeadline} items={data.faq} />
      <FeatureCtaSection
        ctaPrimary={data.ctaPrimary}
        ctaSecondary={data.ctaSecondary}
        heading={data.ctaHeading}
      />
    </div>
  );
}
