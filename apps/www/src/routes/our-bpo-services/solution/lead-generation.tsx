import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/lead-generation"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Lead Generation",
    headlineLine1: "Lead Generation",
    headlineAccent: "Call Center Solutions",
    description:
      "Generating leads is at the core of any sales team — before you can kick start the sales process, you need to find people who could be interested in hearing your pitch.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/lead-generation-01.jpg",
      alt: "Lead generation specialists",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Talk to Our Experts",
  },
  stats: [
    {
      label: "Qualified Leads",
      value: "85%",
    },
    {
      label: "Conversion Rate",
      value: "30%",
    },
    {
      label: "Campaign Success",
      value: "92%",
    },
    {
      label: "Cost Reduction",
      value: "-50%",
    },
  ],
  services: {
    subtitle: "Core Tasks",
    title: "What Does a Lead Generation Call Center Do?",
    description:
      "Identifying potential prospects is a multi-step operation that can encompass several core tasks.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Market research",
        description:
          "BPO vendor will conduct market research to hone in on your ideal customer and determine the best ways to reach out.",
        features: [
          "Identify potential customers",
          "Ideal customer profile",
          "Determine outreach methods",
        ],
        icon: "chart",
      },
      {
        id: "s2",
        number: "02",
        title: "Targeted outreach campaigns",
        description:
          "Knowledgeable agents gather contact information and reach out directly to potential clients using personalized information.",
        features: [
          "Gather information",
          "Direct outreach",
          "Qualify prospects",
        ],
        icon: "users",
      },
      {
        id: "s3",
        number: "03",
        title: "Appointment setting",
        description:
          "Call center reps coordinate with potential clients to schedule appointments with your internal sales team.",
        features: [
          "Schedule appointments",
          "Liaison service",
          "Close more deals",
        ],
        icon: "zap",
      },
    ],
  },
  workflow: {
    subtitle: "Main Benefits",
    title: "Benefits of Hiring a Lead Generation BPO",
    features: [
      {
        icon: "globe",
        title: "Scaling your consumer outreach",
        description:
          "Build contact lists and reach out to clients at scale to grow your business effectively.",
      },
      {
        icon: "shield",
        title: "Improving your vetting process",
        description:
          "Ensure only qualified, interested prospects are put in contact with your team, saving time and effort.",
      },
      {
        icon: "zap",
        title: "Proactively addressing concerns",
        description:
          "Identify potential roadblocks and objections during initial calls and handle them directly.",
      },
    ],
    showcaseImage: {
      src: "/assets/lead-generation-01.jpg",
      alt: "Team collaborating in a modern office environment",
    },
    terminal: {
      initCommand: "npm start",
      preparingMessage: "Initializing outreach campaign...",
      optimizingLabel: "Vetting leads",
      successLines: ["Campaign active", "qualified_leads_synced"],
      latencyLabel: "Response",
      latencyValue: "0.8",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle: "Frequently Asked Questions",
    title: "About Generating Leads Through Outsourcing",
    items: [
      {
        id: 1,
        question: "How Do Call Center Reps Generate Leads?",
        answer:
          "Reps use market research and targeted outreach to find and qualify potential prospects for sales teams.",
      },
      {
        id: 2,
        question: "How Are BPO Teams Trained?",
        answer:
          "BPO teams are trained to leverage advanced tech tools and interactive systems to maximize prospecting impact.",
      },
      {
        id: 3,
        question: "How Can You Measure Outsourcing Success?",
        answer:
          "Success can be measured by the stream of qualified, incoming clients and long-term profitability.",
      },
      {
        id: 4,
        question: "What industries do you support for lead generation?",
        answer:
          "We support a wide range of industries including technology, healthcare, finance, real estate, and eCommerce with tailored lead generation strategies.",
      },
      {
        id: 5,
        question: "How do you ensure lead quality?",
        answer:
          "We use multi-step qualification processes, data validation, and real-time screening to ensure only high-intent prospects are passed to your sales team.",
      },
      {
        id: 6,
        question: "Can your team integrate with our CRM?",
        answer:
          "Yes, our systems integrate seamlessly with popular CRMs like Salesforce, HubSpot, and custom platforms to sync data in real time.",
      },
      {
        id: 7,
        question: "How quickly can campaigns be launched?",
        answer:
          "Most campaigns can be launched within days depending on complexity, with onboarding, script preparation, and targeting handled efficiently.",
      },
      {
        id: 8,
        question: "Do you provide reporting and analytics?",
        answer:
          "Yes, we provide detailed performance reports including lead quality, conversion rates, and campaign insights to help optimize results.",
      },
    ],
  },
  cta: {
    headlineLine1: "We Will Help You Grow Your Business Through",
    headlineAccent: "Outsourcing Your Lead Generation Services",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "See Our FAQ",
    footnote:
      "This is an advertisement. Restrictions apply. All rights reserved.",
  },
  imageSections: [
    {
      title: "The Confie BPO Difference",
      description:
        "Tap into an advanced lead generation machine that supports ongoing growth through advanced tech tools and analytics.",
      bullets: [
        {
          label: "Automated call distribution",
          detail: "Streamlined routing for efficiency.",
        },
        {
          label: "Interactive voice response",
          detail: "Enhanced customer experience.",
        },
      ],
      closingText: "Maximize the impact of each and every prospecting call.",
      imageSrc: "/assets/lead-generation.webp",
      imageAlt: "Professional overlooking sunset view",
      imagePosition: "left",
    },
    {
      title: "How To Choose a Lead Generation Call Center",
      description:
        "Experience is key. Look for organizations with advanced infrastructure and a commitment to data security.",
      bullets: [
        {
          label: "Advanced infrastructure",
          detail: "Automated tools and analytics.",
        },
        {
          label: "Data security",
          detail: "Protecting customer information.",
        },
      ],
      closingText:
        "Review testimonials to learn about each provider's communication skills.",
      imageSrc: "/assets/lead-generation-02.jpg",
      imageAlt: "Digital connectivity concept",
      imagePosition: "right",
      cta: {
        label: "Book Your Consultation",
        href: "/contact-us",
      },
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
