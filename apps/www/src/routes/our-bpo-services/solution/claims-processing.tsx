import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/claims-processing"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Home | Call Center Services | Claims Processing",
    headlineLine1: "Call Center for",
    headlineAccent: "Claims Processing",
    description:
      "Processing insurance or healthcare claims is a complex task. By working with a BPO call center that specializes in case handling, you can forego the lengthy claims management process entirely and reinvest that time and energy right back into your business.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/claim-processing-01.webp",
      alt: "Claims processing specialists",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Talk to Our Experts",
  },
  stats: [
    {
      label: "Error Reduction",
      value: "-60%",
    },
    {
      label: "Cost Reduction",
      value: "-35%",
    },
    {
      label: "Claims Accuracy",
      value: "99%",
    },
    {
      label: "Average Processing Time",
      value: "-50%",
    },
  ],
  services: {
    subtitle: "BPO Services",
    title: "Claims Processing Solutions",
    description:
      "When outsourcing your claims handling tasks, you need a provider that can handle each step, from the initial claim to the final payout.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Handling initial reports",
        description:
          "When someone first calls to kickstart a claim, call center agents will answer to guide them through the process.",
        features: ["Initial report guidance", "24/7 Availability"],
        icon: "users",
      },
      {
        id: "s2",
        number: "02",
        title: "Documenting evidence",
        description:
          "Case processing representatives will determine what type of documentation is necessary to proceed with the claim.",
        features: ["Information gathering", "Case management"],
        icon: "chart",
      },
      {
        id: "s3",
        number: "03",
        title: "Verifying coverage",
        description:
          "Agents will review policy information to ensure the claimant has active coverage that applies to their situation.",
        features: ["Policy reviews", "Coverage checks"],
        icon: "shield",
      },
    ],
  },
  workflow: {
    subtitle: "Assess & Inquire",
    title: "How To Choose the Best BPO Provider",
    features: [
      {
        icon: "chart",
        title: "Assess their experience",
        description:
          "Research your provider’s experience in both general claims processing and your specific industry.",
      },
      {
        icon: "shield",
        title: "Discuss data security",
        description:
          "Talk to your provider about how they comply with data privacy regulations and cybersecurity measures.",
      },
      {
        icon: "users",
        title: "Inquire about training",
        description:
          "Research how the call center hires and trains its agents to ensure employees and customers work with qualified representatives.",
      },
    ],
    showcaseImage: {
      src: "/assets/claim-processing-01.webp",
      alt: "Insurance industry experts working together",
    },
    terminal: {
      initCommand: "npm run start",
      preparingMessage: "Starting consultation...",
      optimizingLabel: "Efficiency",
      successLines: ["ROI calculation complete", "BPO workflow integrated"],
      latencyLabel: "Support",
      latencyValue: "24/7",
      latencyUnit: "hours",
    },
  },
  faq: {
    subtitle: "FAQ",
    title: "Frequently Asked Questions",
    items: [
      {
        id: 1,
        question: "Why Outsource Claims Processing?",
        answer:
          "Case handling is complex and tedious. BPO providers have reliable systems to maintain quality standards, eliminate errors, and handle increased demand without slowing internal processes.",
      },
      {
        id: 2,
        question: "How long does it take to process a claim?",
        answer:
          "Processing time depends on complexity, but BPO solutions significantly reduce turnaround time through automation and experienced agents.",
      },
      {
        id: 3,
        question: "What industries benefit from claims processing BPO?",
        answer:
          "Industries like insurance, healthcare, finance, and logistics benefit greatly from outsourced claims handling services.",
      },
      {
        id: 4,
        question: "How do BPO providers ensure accuracy in claims?",
        answer:
          "They use trained specialists, verification processes, and advanced software systems to minimize errors and ensure compliance.",
      },
      {
        id: 5,
        question: "Can claims processing be scaled during peak demand?",
        answer:
          "Yes, BPO providers offer scalable solutions to handle increased claim volumes without compromising speed or quality.",
      },
    ],
  },
  cta: {
    headlineLine1: "Start Your Journey to Savings & Growth with",
    headlineAccent: "Confie BPO Today",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Improve your ROI",
    footnote: "Customizable, Fast, and Accurate Claims Processing!",
  },
  imageSections: [
    {
      title: "What Sets Confie Claims Processing Apart?",
      description:
        "People usually have to file insurance cases after a stressful experience. At Confie BPO, we understand what your customers are going through, which is why we use our expertise to guide them.",
      bullets: [
        {
          label: "Highly trained staff",
          detail:
            "Experienced, trained team members who know the ins and outs of processing claims in a variety of industries.",
        },
        {
          label: "Thorough documentation practices",
          detail:
            "Systems that keep you organized and on track, even with the most complicated situations.",
        },
        {
          label: "Bilingual support",
          detail:
            "A majority of our team members speak both English and Spanish to offer translation services for your customers.",
        },
      ],
      closingText:
        "We tirelessly work on the administrative tasks necessary to get their claims approved.",
      imageSrc: "/assets/claim-processing.png",
      imageAlt: "Customer service agent processing insurance documents",
      imagePosition: "right",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
