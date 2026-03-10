import { createFileRoute } from "@tanstack/react-router";
import { FeaturePageTemplate } from "@/components/landing/Features/TeamChannel/feature-page-template";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/product/demo")({
  component: DemoPage,
});

/* ─── Icon SVG paths (reused across features) ─── */
const ICON = {
  users: [
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
    "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
    "M23 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  msg: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  layers: ["M12 2 2 7l10 5 10-5-10-5Z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
};

const demoData = {
  slug: "demo",
  category: "INTERACTIVE DEMO",
  headingBefore: "See the Dialer WebApp",
  headingHighlight: "in action",
  subtitle:
    "Explore our comprehensive communication suite. From seamless registration to advanced analytics, see how we transform team collaboration.",
  ctaPrimary: "WATCH THE DEMO",
  ctaSecondary: "EXPLORE DASHBOARDS",
  heroLayout: "user-management-hero",
  sections: [
    {
      layout: "image-left",
      heading: "Seamless Registration & Login",
      description:
        "Experience our frictionless onboarding process. Secure authentication ensures your team's data remains private from the very first click.",
      imageSrc:
        "https://images.unsplash.com/photo-1542382257-80da9fb9f5c5?w=800&q=80",
      imageAlt: "Seamless Registration",
      bgVariant: "white",
    },
    {
      layout: "content-left",
      heading: "Effortless Team Creation",
      description:
        "Build your organization's structure in seconds. Create teams, invite members, and set up your workspace with zero complexity.",
      linkText: "See Team Management \u2192",
      linkHref: "/features/user-management",
      imageSrc:
        "https://images.unsplash.com/photo-1517486808506-29fa8804cbbe?w=800&q=80",
      imageAlt: "Team Creation",
      bgVariant: "white",
    },
    {
      layout: "image-left",
      heading: "Real-time Messaging & Channels",
      description:
        "Keep the conversation flowing with direct messaging and organized channels. Share files, react to messages, and stay connected.",
      imageSrc:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
      imageAlt: "Real-time Messaging",
      bgVariant: "white",
    },
  ],
  statsHeadline: "Everything you need to manage communication",
  statsSubtitle:
    "Our interactive demo walks you through the core pillars of the Dialer WebApp, showing you exactly how to streamline your workflow.",
  stats: [
    {
      iconPaths: ICON.users,
      title: "Team Management",
      description:
        "Create teams, assign roles, and manage permissions with our intuitive administrative interface.",
      linkText: "View team features \u2192",
      linkHref: "/features/user-management",
    },
    {
      iconPaths: ICON.msg,
      title: "Direct Messaging",
      description:
        "Fast, reliable, and secure messaging for individuals and channels to keep everyone in sync.",
    },
    {
      iconPaths: ICON.layers,
      title: "Overview Dashboards",
      description:
        "Get a bird's-eye view of your entire operation with customizable real-time data visualizations.",
      linkText: "Explore analytics \u2192",
      linkHref: "/",
    },
  ],
  resourceCardsHeadline: "Deep dive into the WebApp features",
  resourceCardsBgClass: "bg-[#F3EBE1]",
  resourceCards: [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1505322022379-7c3353ee6291?w=600&q=80",
      imageAlt: "Pier",
      tag: "Tutorial",
      title: "How to set up your first team in under 5 minutes",
      linkText: "WATCH GUIDE",
      linkHref: "/",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
      imageAlt: "Trees",
      tag: "Case Study",
      title: "Scaling communication for remote-first organizations",
      linkText: "LEARN MORE",
      linkHref: "/",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
      imageAlt: "Road",
      tag: "Insights",
      title: "Maximizing productivity with channel-based messaging",
      linkText: "READ STORY",
      linkHref: "/",
    },
  ],
  faqHeadline: "Frequently asked questions about the demo",
  faq: [
    {
      question: "How do I register for the full version?",
      answer: "You can register by clicking the 'Get Started' button at the top of the page. Follow the simple onboarding steps to set up your workspace instantly.",
    },
    {
      question: "Can I invite my team to the demo?",
      answer: "The interactive demo is a guided experience, but you can share the link with your team so they can explore the features too. Once you register for a full workspace, you can invite unlimited team members.",
    },
    {
      question: "What data is included in the overview dashboards?",
      answer: "The dashboards include metrics on user engagement, message volume, channel activity, and response times. Administrators get a comprehensive view of workspace health and communication flow.",
    },
    {
      question: "How secure is the direct messaging system?",
      answer: "All direct messages are secured with enterprise-grade encryption both in transit and at rest. We comply with industry standards to ensure your private conversations stay private.",
    },
    {
      question: "Are there different channel types available?",
      answer: "Yes, you can create public channels open to anyone in the workspace, private channels for sensitive discussions, and shared channels to collaborate with external partners.",
    },
  ],
  ctaHeading: "Ready to transform your team communication?",
};

function DemoPage() {
  return (
    <FeaturePageTemplate data={demoData as any} />
  );
}
