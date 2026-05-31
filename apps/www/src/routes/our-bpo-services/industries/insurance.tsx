import { createFileRoute } from "@tanstack/react-router";
import type {
  CTAProps,
  FAQProps,
  HeroProps,
  ImageSectionProps,
  ServicesProps,
  StatItem,
  WebPageProps,
  WorkflowProps,
} from "@/components/our-bpo-services/bpo-detail-page";
import BPOPage from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute("/our-bpo-services/industries/insurance")({
  component: RouteComponent,
});

const hero: HeroProps = {
  badge: "Trusted BPO for Insurance Call Center Services",
  headlineLine1: "Call Center for Insurance",
  headlineAccent: "Services.",
  description:
    "As the owner of a young insurance company or one with a few more years of experience, you know the challenges of a constantly evolving industry.",
  primaryCta: {
    label: "Book Your Consultation",
    href: "/contact-us",
  },
  image: {
    src: "/assets/insurance.jpg",
    alt: "Insurance industry specialists",
  },
  terminalCommand: "$ nexus deploy --region insurance-bpo",
  terminalMessage: "Active nodes",
};

const stats: StatItem[] = [
  { label: "Trained Agents", value: "200+" },
  { label: "Uptime SLA", value: "24/7" },
  { label: "Global Regions", value: "42" },
  { label: "Years Leading", value: "6+" },
];

const services: ServicesProps = {
  subtitle: "Capabilities",
  title:
    "Maximize Your Insurance Company Potential with Insurance Call Center Services.",
  description:
    "Confie insurance BPO can help you roll out new insurance products more easily and quickly than before. Whether you want direct-to-consumer sales or seamless customer support, we make the transition smooth.",
  items: [
    {
      id: "s1",
      number: "01",
      title: "Insurance Claims Handling",
      description:
        "We pride ourselves on having dedicated teams of trained agents with a sophisticated understanding of insurance regulations and claims processing. We offer accurate handling of claims, decreased errors and expedited processes.",
      features: [
        "Accurate claims processing",
        "Error reduction protocols",
        "Expedited resolution workflows",
      ],
      icon: "shield",
    },
    {
      id: "s2",
      number: "02",
      title: "Inbound & Outbound Sales",
      description:
        "Lead generation is crucial to keep your agency growing and thriving. With call center outbound and inbound services, you'll have agents who understand how to upsell, cross-sell and work with potential customers.",
      features: [
        "Quote information delivery",
        "Policy explanation & upselling",
        "Pre-screening & underwriting support",
      ],
      icon: "users",
    },
    {
      id: "s3",
      number: "03",
      title: "Customer Service & Retention",
      description:
        "Most customers only talk to their insurance company when they're already having a bad day. Confie BPO helps you make sure your customers remain strong and loyal with 24/7 expert support.",
      features: [
        "Omni-channel communications",
        "Policy servicing & changes",
        "Customer survey & feedback loops",
      ],
      icon: "infinity",
    },
  ],
};

const workflow: WorkflowProps = {
  subtitle: "The Experience",
  title: "Complexity made simple.",
  features: [
    {
      icon: "zap",
      title: "Zero Config Onboarding",
      description:
        "Our one-click migration suite containerizes your legacy operations and provides an intelligent proxy layer to move traffic gradually without downtime or configuration changes.",
    },
    {
      icon: "globe",
      title: "Application Processing",
      description:
        "You and your sales team can focus on the next lead while our team handles your applications process — from gathering client information, verifying data and managing pre-screening.",
    },
    {
      icon: "chart",
      title: "Unified KPI Insights",
      description:
        "Real-time observability across your entire call center stack. Monitor first call resolution rate, call handle time and all key performance indicators from a single pane.",
    },
  ],
  showcaseImage: {
    src: "/assets/insurance.jpg",
    alt: "Insurance BPO team at work",
  },
  terminal: {
    initCommand: "$ confiebpo init --industry insurance",
    preparingMessage: "⚡ Preparing global agent infrastructure...",
    optimizingLabel: "Optimizing:",
    successLines: [
      "✓ 200+ trained agents active",
      "✓ Compliance layer hardened",
    ],
    latencyLabel: "First call resolution",
    latencyValue: "94",
    latencyUnit: "%",
  },
};

const faq: FAQProps = {
  subtitle: "Support",
  title: "Insurance Call Center FAQs",
  items: [
    {
      id: 1,
      question: "How Will Using an Insurance Services BPO Save Me Money?",
      answer:
        "By outsourcing to Confie BPO, you eliminate overhead costs associated with hiring, training, and managing an in-house team. Your return-on-investment is fully illustrated through reductions in staffing, training and infrastructure balanced with the competitive cost of our services.",
    },
    {
      id: 2,
      question: "How Much Control Will an Insurance Services BPO Want?",
      answer:
        "We work seamlessly alongside your current staff. Our job is simple: to take care of all the routine tasks so that you and your best employees can focus on the big picture. You retain full visibility and control through our KPI dashboards.",
    },
    {
      id: 3,
      question:
        "How Do You Choose Which Applicants are Moved into BPO Insurance Services?",
      answer:
        "We use many different KPIs and customer interaction data to assess which applicants and processes are best handled by our agents. Our structured 5-stage training program ensures agents are ready for your specific brand and products.",
    },
    {
      id: 4,
      question: "Will I Have to Train BPO Insurance Services Agents?",
      answer:
        "No. We ensure our agents are highly trained to handle your company's brand, products and services. Our agents are well versed in handling difficult customer interactions and receive comprehensive and ongoing training about insurance products and claims.",
    },
  ],
};

const cta: CTAProps = {
  headlineLine1: "Find Out What Others Already Know About the Benefits",
  headlineAccent: "of Confie BPO.",
  primaryLabel: "Calculate your Cost",
  secondaryLabel: "Contact Sales",
  footnote:
    "Ranked #1 Personal Lines Leader in Insurance Journal for 6 Straight Years.",
};

// ── Image Sections ──────────────────────────────────────────────────────────
// Section 1: Appears after Stats — explains what an Insurance Call Center is
// Section 2: Appears after Workflow — explains how to choose the right BPO partner
const imageSections: ImageSectionProps[] = [
  {
    title: "What is a Call Center for Insurance Services?",
    description:
      "An insurance call center BPO handles many of the tasks in an insurance company not associated with direct policy writing or underwriting. Today's insurance professionals spend an excessive amount of time on administrative work and non-core activities. Modern BPO call centers take that load off your team so you can focus on growing your book of business — by handling incoming and outgoing calls, policy servicing, claims intake, data entry, and much more.",
    bullets: [
      {
        label: "Policy & Claims Support",
        detail:
          "Handle renewals, endorsements, cancellations and first-notice-of-loss calls with trained specialists.",
      },
      {
        label: "Sales & Lead Qualification",
        detail:
          "Inbound quote requests and outbound cross-sell campaigns managed by agents fluent in insurance products.",
      },
      {
        label: "Compliance & Documentation",
        detail:
          "Accurate data entry, transcript storage and audit trails that keep you aligned with state regulations.",
      },
    ],
    closingText:
      "Paperwork and compliance are always the hardest parts of running an insurance operation. Imagine your team focused entirely on closing new business while a dedicated BPO partner handles the rest.",
    // Royalty-free Unsplash image of a professional call center / insurance office
    imageSrc: "/assets/insurance-03.jpg",
    imageAlt: "Insurance BPO call center agents at work",
    imagePosition: "right",
  },
  {
    title: "How to Choose the Right Insurance BPO Partner",
    description:
      "There are some important factors you should consider before committing to a long-term insurance BPO relationship. The best partners are confident enough in their work to offer a trial period — that should always be on the table. Here's how to evaluate your options:",
    bullets: [
      {
        label: "Understand your needs",
        detail:
          "Have your stakeholders map out which workflows you want to hand off, your expected call volumes, and a working budget before any conversation.",
      },
      {
        label: "Insurance industry experience",
        detail:
          "Target BPOs with a proven track record in P&C, life, or health insurance — not just generic call center vendors.",
      },
      {
        label: "Ask for custom quotes",
        detail:
          "Request quotation models adapted to your specific agency size, product mix, and compliance requirements.",
      },
    ],
    closingText:
      "Once you've received quotes from targeted BPO partners, follow up with discovery calls to customize your package and select the one that fits your growth strategy.",
    // Royalty-free Unsplash image of a professional woman working at a laptop (similar to the Confie screenshot)
    imageSrc: "/assets/insurance-02.jpg",
    imageAlt: "Insurance professional evaluating BPO options on laptop",
    imagePosition: "left",
    cta: {
      label: "Book a Free Consultation",
      href: "/contact-us",
    },
  },
];

export const bpoPageProps: WebPageProps = {
  hero,
  stats,
  services,
  workflow,
  faq,
  cta,
  imageSections,
};

function RouteComponent() {
  return <BPOPage {...bpoPageProps} />;
}
