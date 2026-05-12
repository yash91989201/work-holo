import {
  IconBrain,
  IconBrandAndroid,
  IconBrandFlutter,
  IconBrandReact,
  IconBuildingBank,
  IconCloud,
  IconCloudComputing,
  IconCode,
  IconDeviceMobile,
  IconRobot,
} from "@tabler/icons-react";

export interface ProjectFAQ {
  answer: string;
  question: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectResult {
  description: string;
  stat: string;
  title: string;
}

export interface TimelinePhase {
  description: string;
  label: string;
  title: string;
}

export interface ProjectPageData {
  category: string;
  challenge: string;
  client: string;
  description: string;
  duration: string;
  faqs: ProjectFAQ[];
  features: string[];
  galleryImages: string[];
  heroImage: string;
  metrics: ProjectMetric[];
  overview: string;
  results: ProjectResult[];
  slug: string;
  solution: string;
  subtitle: string;
  techStack: string[];
  timeline: TimelinePhase[];
  title: string;
}

export interface ProjectListItem {
  category: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  image?: string;
  isActive: boolean;
  slug: string;
  subtitle: string;
  title: string;
}

const projectList = [
  {
    slug: "health-track-pro",
    title: "HealthTrack Pro",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "finflow-dashboard",
    title: "FinFlow Dashboard",
    icon: <IconBuildingBank className="size-6" />,
  },
  {
    slug: "ai-support-bot",
    title: "AI Support Bot",
    icon: <IconRobot className="size-6" />,
  },
  {
    slug: "cloud-sync-platform",
    title: "CloudSync Platform",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "ecommerce-replatform",
    title: "E-Commerce Replatform",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "ml-prediction-engine",
    title: "ML Prediction Engine",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "real-time-collaboration",
    title: "Real-Time Collaboration",
    icon: <IconBrandReact className="size-6" />,
  },
  {
    slug: "datapulse-saas",
    title: "DataPulse SaaS",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "healthconnect-enterprise-portal",
    title: "HealthConnect Portal",
    icon: <IconCloudComputing className="size-6" />,
  },
  {
    slug: "fooddash-flutter",
    title: "FoodDash",
    icon: <IconBrandFlutter className="size-6" />,
  },
  {
    slug: "paymate-react-native",
    title: "PayMate",
    icon: <IconBuildingBank className="size-6" />,
  },
  {
    slug: "fitforce-android",
    title: "FitForce",
    icon: <IconBrandAndroid className="size-6" />,
  },
  {
    slug: "devops-pipeline-pro",
    title: "DevOps Pipeline Pro",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "cloudwatch-pro",
    title: "CloudWatch Pro",
    icon: <IconCloudComputing className="size-6" />,
  },
];

export function getProjectList(currentSlug?: string) {
  return projectList.map((p) => ({
    ...p,
    href: `/projects/${p.slug}`,
    isActive: p.slug === currentSlug,
    category: getProjectData(p.slug)?.category ?? "",
    subtitle: getProjectData(p.slug)?.subtitle ?? "",
    description: getProjectData(p.slug)?.description ?? "",
    image: getProjectData(p.slug)?.heroImage ?? "",
  }));
}

const projectsData: Record<string, ProjectPageData> = {
  "health-track-pro": {
    slug: "health-track-pro",
    title: "HealthTrack Pro",
    subtitle: "Health Monitoring Mobile Platform",
    category: "Mobile Development",
    client: "VitaCare Health",
    duration: "4 months",
    description:
      "A HIPAA-inspired mobile platform enabling real-time health monitoring, wearable device integration, and AI-powered health insights for clinics and diagnostic centres across Tier 1 Indian cities.",
    heroImage: "/assets/health-track-pro.png",
    overview:
      "HealthTrack Pro is a health monitoring platform designed for mid-sized healthcare providers in India. It integrates with common wearables, provides real-time health metrics, and uses AI to flag anomalies early. The platform currently serves 1,200+ patients across 3 clinic networks in Bengaluru and Hyderabad.",
    challenge:
      "VitaCare Health needed to consolidate fragmented patient data from various wearables and clinic systems into a unified, secure platform. Real-time data synchronisation and legacy system integration posed significant technical challenges on a lean budget.",
    solution:
      "Built a React Native cross-platform app with a Node.js backend. Implemented end-to-end encryption, OAuth 2.0 for authentication, and a FHIR-inspired API layer for clinic EHR integration. The AI engine processes 18,000+ data points daily using TensorFlow Lite on-device inference.",
    galleryImages: [
      "/assets/health-track-pro.png",
      "/assets/health-track-pro.png",
    ],
    features: [
      "Real-time wearable integration (Apple Watch, Mi Band, boAt)",
      "AI-powered anomaly detection with 88% accuracy",
      "Clinic EHR data synchronisation",
      "End-to-end encryption for patient data",
      "Customisable health dashboards for clinical staff",
      "Offline-first architecture with background sync",
      "Multi-language support (Hindi, Telugu, Kannada, English)",
      "Teleconsultation video integration",
    ],
    metrics: [
      { label: "Active Users", value: "1.2K+" },
      { label: "Data Points / Day", value: "18K+" },
      { label: "Uptime", value: "99.2%" },
      { label: "Anomaly Detection", value: "88%" },
    ],
    results: [
      {
        stat: "22%",
        title: "Reduction in Missed Follow-ups",
        description:
          "Early anomaly detection enabled proactive interventions, reducing missed follow-up appointments by 22% across participating clinic networks.",
      },
      {
        stat: "40%",
        title: "Faster Clinical Decision Making",
        description:
          "Unified dashboards gave clinicians instant access to patient history, reducing average consultation prep time from 20 minutes to 12 minutes.",
      },
      {
        stat: "₹3.2L",
        title: "Annual Savings in Admin Overhead",
        description:
          "Digitising patient record management eliminated manual paperwork, saving ₹3.2L annually in administrative costs across 3 clinic locations.",
      },
    ],
    techStack: [
      "React Native",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "TensorFlow Lite",
      "AWS Lambda",
      "CloudFront",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Mapped existing clinic workflows, identified integration points, and documented patient data management requirements across 3 clinic networks.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed offline-first architecture with real-time sync, built API layer for clinic EHR integration, and prototyped AI anomaly detection pipeline.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built React Native app with TensorFlow Lite on-device inference. Ran data security audits and clinical user acceptance testing.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 3 clinic networks. Scaled to 1.2K+ active users within 6 weeks of launch.",
      },
    ],
    faqs: [
      {
        question: "How does the wearable device integration work?",
        answer:
          "Our platform uses Bluetooth Low Energy (BLE) to connect with compatible wearables. We support Apple HealthKit, Google Fit, and common Indian fitness bands, normalising all data into our unified schema regardless of the source device.",
      },
      {
        question: "Is patient data kept secure?",
        answer:
          "Yes, all patient data is encrypted end-to-end. We implement role-based access controls, audit logging, and regular security reviews. Our infrastructure is hosted on AWS with data residency in the ap-south-1 (Mumbai) region.",
      },
      {
        question: "Can it integrate with our existing clinic software?",
        answer:
          "We have built integrations for common Indian clinic management systems. For legacy or custom setups, our team can build a tailored integration through our professional services offering.",
      },
      {
        question: "How does the AI anomaly detection work?",
        answer:
          "The AI engine uses a combination of rule-based thresholds and machine learning models trained on anonymised health data. It runs on-device using TensorFlow Lite for privacy, with cloud fallback for complex cases.",
      },
      {
        question: "What is the typical deployment timeline?",
        answer:
          "A standard deployment for a clinic network takes 4–6 weeks. This includes environment setup, EHR integration, staff training, and phased rollout.",
      },
    ],
  },
  "finflow-dashboard": {
    slug: "finflow-dashboard",
    title: "FinFlow Dashboard",
    subtitle: "Financial Analytics & Reporting Platform",
    category: "Web Development",
    client: "Meridian Capital Partners",
    duration: "5 months",
    description:
      "A financial analytics dashboard processing ₹45L+ in daily transactions, featuring real-time charts, risk scoring, and automated reporting for a Bengaluru-based investment advisory firm.",
    heroImage: "/assets/finflow.webp",
    overview:
      "FinFlow Dashboard replaced manual Excel-based reporting for a growing Bengaluru investment advisory firm. It processes ₹45L+ in daily transactions, delivers sub-300ms latency, and provides portfolio managers with real-time visibility across domestic equity and debt instruments.",
    challenge:
      "The client relied on nightly Excel reports, causing advisors to miss critical intraday movements. Fragmented data sources and the need for SEBI-aligned reporting made modernisation complex on a startup-friendly budget.",
    solution:
      "Designed a modular React + WebSocket architecture streaming data from a Node.js backend. Built custom Recharts visualisations optimised for 1,000+ data points. Implemented role-based access and audit trails for regulatory alignment, achieving sub-300ms end-to-end latency.",
    galleryImages: ["/assets/finflow.webp", "/assets/finflow.webp"],
    features: [
      "Real-time data streaming via WebSocket (sub-300ms latency)",
      "Interactive charts with 1,000+ point rendering",
      "Custom risk scoring with explainable outputs",
      "Multi-asset portfolio management (Equity, MF, Bonds)",
      "Automated SEBI-aligned reporting templates",
      "Role-based dashboards for advisors and compliance",
      "Full audit trail and data lineage tracking",
      "Mobile-responsive design for on-the-go access",
    ],
    metrics: [
      { label: "Daily Volume", value: "₹45L+" },
      { label: "Latency", value: "<300ms" },
      { label: "Data Points Live", value: "1K+" },
      { label: "Uptime", value: "99.1%" },
    ],
    results: [
      {
        stat: "70%",
        title: "Faster Decision Making",
        description:
          "Real-time dashboards reduced the time from data availability to advisory decision from 90 minutes to 25 minutes on average.",
      },
      {
        stat: "₹8.5L",
        title: "Annual Cost Reduction",
        description:
          "Replaced manual processes and legacy spreadsheet workflows, delivering ₹8.5L in annual operational savings across the advisory desk.",
      },
      {
        stat: "SEBI Ready",
        title: "Reporting Compliance Achieved",
        description:
          "Automated reporting reduced compliance preparation time from 2 weeks to 4 days while achieving full alignment with SEBI reporting standards.",
      },
    ],
    techStack: [
      "React",
      "TypeScript",
      "Recharts",
      "Node.js",
      "PostgreSQL",
      "WebSocket",
      "Redis",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed legacy reporting workflows, identified data sources, and mapped reporting requirements for SEBI alignment.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed modular React + WebSocket architecture, built custom chart components, and implemented role-based security model.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Node.js backend with real-time data streaming, implemented audit trails, and ran performance tests for sub-300ms latency.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across advisory teams. Achieved SEBI-aligned reporting compliance. Scaled to ₹45L+ daily volume.",
      },
    ],
    faqs: [
      {
        question: "How does the real-time data streaming work?",
        answer:
          "Data flows from source systems through a Node.js processing layer and is pushed to the client via WebSocket connections. We use Redis for in-memory caching and PostgreSQL for persistent storage.",
      },
      {
        question: "What is the data latency from source to dashboard?",
        answer:
          "End-to-end latency is under 300ms from data ingestion to display on the dashboard, achieved through optimised WebSocket push, in-memory caching, and efficient query design.",
      },
      {
        question: "Is the platform scalable as our AUM grows?",
        answer:
          "Yes, the architecture is designed for horizontal scaling via Docker containers. Adding new data sources or user roles requires minimal configuration changes.",
      },
      {
        question: "What regulatory reporting standards are supported?",
        answer:
          "We support SEBI MF reporting, PMS disclosure formats, and customisable templates for internal compliance reporting. New formats can be added through configuration.",
      },
      {
        question: "Can we self-host this platform?",
        answer:
          "Yes, the entire stack can be deployed on your own AWS or Azure infrastructure in the Mumbai region for data sovereignty compliance.",
      },
    ],
  },
  "ai-support-bot": {
    slug: "ai-support-bot",
    title: "AI Support Bot",
    subtitle: "Intelligent Customer Service Platform",
    category: "AI & Automation",
    client: "LuxeCart",
    duration: "3 months",
    description:
      "An LLM-powered customer service platform handling 500+ daily conversations with 84% resolution rate, integrating with existing CRM and knowledge bases for seamless human handoff.",
    heroImage: "/assets/ai-support-bot.jpg",
    overview:
      "LuxeCart, a growing D2C fashion brand in India, needed to scale customer support without adding headcount. We built an AI agent platform that handles 500+ daily conversations across WhatsApp, email, and live chat. The system achieves 84% first-contact resolution while maintaining a 4.3/5 customer satisfaction score.",
    challenge:
      "LuxeCart faced rapid support ticket growth during festive season sales. Their small team couldn't scale, response times exceeded 18 hours, and customer satisfaction dropped. They needed AI that could understand context, maintain brand voice, and escalate gracefully to human agents.",
    solution:
      "Built a multi-agent system with LLMs for intent detection, response generation, and sentiment analysis. Implemented RAG pipelines over their existing Freshdesk and Shopify data. Designed a human-in-the-loop escalation system with full conversation context transfer.",
    galleryImages: ["/assets/ai-support-bot.jpg", "/assets/ai-support-bot.jpg"],
    features: [
      "Multi-channel support (Email, WhatsApp, Live Chat)",
      "RAG-powered responses from CRM and knowledge bases",
      "Intent classification with 92% accuracy",
      "Sentiment detection with escalation triggers",
      "Real-time human agent handoff with context preservation",
      "Custom brand voice training on company data",
      "Analytics dashboard with CSAT and resolution metrics",
      "Multi-language support (Hindi, English, Tamil)",
    ],
    metrics: [
      { label: "Daily Conversations", value: "500+" },
      { label: "Resolution Rate", value: "84%" },
      { label: "Avg Response Time", value: "<90s" },
      { label: "Customer CSAT", value: "4.3/5" },
    ],
    results: [
      {
        stat: "3x",
        title: "Support Volume Handled, Same Team Size",
        description:
          "AI handled 70% of incoming tickets, allowing the 3-person support team to focus on complex cases while volume tripled during festive sales without new hires.",
      },
      {
        stat: "90 seconds",
        title: "Response Time Reduced from 18hrs",
        description:
          "Instant AI responses eliminated the backlog, improving customer experience and reducing escalation rates by 40%.",
      },
      {
        stat: "₹6.2L",
        title: "Annual Savings in Support Costs",
        description:
          "Automating routine inquiries delivered ₹6.2L in annual cost savings through reduced agent hours and faster resolution.",
      },
    ],
    techStack: [
      "Python",
      "LangChain",
      "OpenAI GPT-4",
      "Pinecone",
      "Redis",
      "FastAPI",
      "Next.js",
      "Freshdesk API",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed support ticket patterns, identified knowledge gaps, and mapped existing Freshdesk and Shopify data sources.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed multi-agent system, built RAG pipelines over existing data, and created human-in-the-loop escalation workflow.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built LLM-powered agents with intent detection and sentiment analysis. Ran A/B tests on response quality and resolution rates.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Rolled out across WhatsApp, email, and live chat. Achieved 84% first-contact resolution. Scaled through festive season peak traffic.",
      },
    ],
    faqs: [
      {
        question: "How does the AI maintain brand voice?",
        answer:
          "We fine-tune the model on your historical support conversations and brand guidelines. It learns your terminology, tone, and response patterns, ensuring consistency across all AI-generated responses.",
      },
      {
        question: "How does the human handoff work?",
        answer:
          "When confidence drops below threshold or sentiment indicates frustration, the conversation is escalated to a human agent with full conversation history, customer profile, and suggested responses — so no context is lost.",
      },
      {
        question: "Can it integrate with our existing tools?",
        answer:
          "Yes, we have built connectors for Freshdesk, Zoho CRM, Shopify, and WooCommerce. For custom systems, we provide REST API and webhook support.",
      },
      {
        question: "How do you handle sensitive customer data?",
        answer:
          "We implement PII detection and redaction in real-time. All data is encrypted at rest and in transit. Deployment can be done on AWS Mumbai region for data localisation compliance.",
      },
      {
        question: "How long does implementation take?",
        answer:
          "A typical implementation takes 3–5 weeks. The first week is data audit and RAG pipeline setup. Week 2–3 covers model training and integration. Week 4–5 is testing and phased rollout.",
      },
    ],
  },
  "cloud-sync-platform": {
    slug: "cloud-sync-platform",
    title: "CloudSync Platform",
    subtitle: "Cloud Migration & Data Sync Solution",
    category: "Cloud & DevOps",
    client: "NexaBridge Tech",
    duration: "4 months",
    description:
      "A cloud sync platform enabling real-time data synchronisation across hybrid cloud environments with conflict resolution, monitoring, and automated failover for an Indian SaaS company.",
    heroImage: "/assets/cloudsync-platform.webp",
    overview:
      "CloudSync Platform is a migration and synchronisation solution built for a mid-sized Indian SaaS company managing data across AWS and on-premise infrastructure. It handles 500GB+ daily data transfers with real-time conflict detection, automated failover, and monitoring dashboards.",
    challenge:
      "NexaBridge Tech needed to migrate 8TB of legacy on-premise data to AWS while maintaining live operations. They faced data integrity risks, compliance requirements under India's data localisation norms, and zero-downtime constraints their existing tools couldn't address.",
    solution:
      "Built a distributed sync engine with custom conflict resolution algorithms. Implemented a blue-green migration strategy with automated rollback. Created a real-time monitoring system using Prometheus and Grafana with SLA tracking dashboards.",
    galleryImages: [
      "/assets/cloudsync-platform.webp",
      "/assets/cloudsync-platform.webp",
    ],
    features: [
      "Real-time sync between AWS and on-premise infrastructure",
      "Conflict detection and resolution algorithms",
      "Automated failover with <10min recovery time",
      "End-to-end data encryption with customer-managed keys",
      "Real-time monitoring and alerting via Prometheus/Grafana",
      "Audit logging and compliance reporting",
      "Bandwidth throttling and scheduling",
      "Data transformation and filtering pipelines",
    ],
    metrics: [
      { label: "Daily Transfer", value: "500GB+" },
      { label: "Failover Time", value: "<10min" },
      { label: "Data Integrity", value: "99.97%" },
      { label: "Uptime", value: "99.5%" },
    ],
    results: [
      {
        stat: "8TB",
        title: "Migrated with Zero Downtime",
        description:
          "Successfully completed the migration 5 days ahead of schedule with no service interruption to production systems.",
      },
      {
        stat: "99.97%",
        title: "Data Integrity Achieved",
        description:
          "Comprehensive validation and checksum verification ensured zero data loss across 4 billion+ records during migration.",
      },
      {
        stat: "₹4.8L",
        title: "Reduction in Annual Infrastructure Costs",
        description:
          "Intelligent data tiering and bandwidth optimisation reduced monthly cloud spend by ₹40K while improving overall system performance.",
      },
    ],
    techStack: [
      "Go",
      "Kubernetes",
      "Terraform",
      "Prometheus",
      "Grafana",
      "Redis",
      "PostgreSQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed legacy data sources, mapped governance requirements, and identified hybrid cloud architecture constraints.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed distributed sync engine, built conflict resolution algorithms, and created blue-green migration strategy.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built sync engine with custom conflict resolution. Ran validation tests for data integrity and failover scenarios.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across production systems. Achieved 99.97% data integrity. Completed full migration on schedule.",
      },
    ],
    faqs: [
      {
        question: "How does the conflict resolution work?",
        answer:
          "We use a combination of timestamp-based last-write-wins and custom business rules. Conflicts are detected in real-time and either auto-resolved or flagged for manual review depending on your configuration.",
      },
      {
        question: "What happens during a cloud provider outage?",
        answer:
          "Our automated failover system detects outages within 60 seconds and switches to the pre-configured standby environment. The sync engine queues incoming changes and replays them once the primary is restored.",
      },
      {
        question: "Can we use our own encryption keys?",
        answer:
          "Yes, we support customer-managed encryption keys (CMEK) on AWS. Your keys never leave your cloud environment, giving you full control over data access.",
      },
      {
        question: "How do you ensure data security during transfer?",
        answer:
          "All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We also support VPN tunnels for organisations with strict network security requirements.",
      },
      {
        question: "What monitoring and reporting is available?",
        answer:
          "We provide Grafana dashboards showing sync status, throughput, latency, errors, and SLA compliance. Reports can be exported as PDF or consumed via REST API.",
      },
    ],
  },
  "ecommerce-replatform": {
    slug: "ecommerce-replatform",
    title: "E-Commerce Replatform",
    subtitle: "High-Performance Headless Commerce Platform",
    category: "Web Development",
    client: "Urban Threads Co",
    duration: "5 months",
    description:
      "A headless commerce platform delivering 4x faster page loads and improved conversion rates for an Indian D2C fashion brand processing 80,000+ monthly visitors.",
    heroImage: "/assets/e-commerce-platform.png",
    overview:
      "Urban Threads Co migrated from a slow WooCommerce setup to a modern headless architecture. The new platform delivers 4x faster page loads through edge caching, 25% higher conversion rates through an optimised checkout flow, and unified inventory across 4 retail locations and a 3PL partner.",
    challenge:
      "Urban Threads' legacy WooCommerce store struggled during sale events, with 5-second page loads causing high cart abandonment. They needed a better mobile experience, faster iterations, and integrated inventory management — all within a startup budget.",
    solution:
      "Built a Next.js + REST API headless frontend with Cloudflare edge caching, achieving sub-1.5s page loads. Integrated Shopify backend for inventory and orders with custom POS and 3PL sync. Optimised checkout flow reduced steps from 6 to 3, increasing completion rates by 22%.",
    galleryImages: [
      "/assets/e-commerce-platform.png",
      "/assets/e-commerce-platform.png",
    ],
    features: [
      "Sub-1.5s page loads via edge caching and ISR",
      "Personalised product recommendations",
      "Optimised checkout flow (6 to 3 steps)",
      "Real-time inventory across 4+ locations",
      "Multi-currency support (INR, USD)",
      "A/B testing framework for continuous optimisation",
      "Integrated loyalty and rewards program",
      "Mobile-first design with offline browsing",
    ],
    metrics: [
      { label: "Monthly Visitors", value: "80K+" },
      { label: "Page Load", value: "<1.5s" },
      { label: "Conversion Lift", value: "+25%" },
      { label: "Cart Abandonment", value: "-40%" },
    ],
    results: [
      {
        stat: "4x",
        title: "Performance Improvement",
        description:
          "Page load times reduced from 5 seconds to under 1.5 seconds, directly correlating with 25% higher conversion and lower bounce rates on mobile.",
      },
      {
        stat: "₹18L+",
        title: "Revenue Increase in Year One",
        description:
          "Faster performance and streamlined checkout delivered ₹18L+ in additional revenue through higher conversion rates and reduced abandonment.",
      },
      {
        stat: "45%",
        title: "Faster Feature Delivery",
        description:
          "Headless architecture reduced deployment cycles from 2 weeks to 5 days, allowing the team to ship new features twice as fast.",
      },
    ],
    techStack: [
      "Next.js",
      "REST API",
      "Shopify",
      "Cloudflare",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed legacy WooCommerce performance, identified traffic bottlenecks, and mapped inventory management requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed Next.js headless architecture, built edge caching strategy, and created checkout flow optimisation plan.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Next.js frontend with Cloudflare edge caching. Implemented Shopify backend integrations and ran load tests for peak sale traffic.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across retail channels. Achieved 4x performance improvement. Scaled through festive season with zero downtime.",
      },
    ],
    faqs: [
      {
        question: "Why did you choose a headless architecture?",
        answer:
          "Headless commerce decouples the frontend from the backend, allowing independent scaling and faster iteration. For Urban Threads, this meant 4x faster performance through edge caching and the flexibility to add new touchpoints without backend changes.",
      },
      {
        question: "How does inventory synchronisation work?",
        answer:
          "We built a real-time inventory sync connecting Shopify with their POS systems and 3PL partner via webhooks and API integrations, handling concurrent updates with conflict resolution for oversells.",
      },
      {
        question: "Can the platform handle sale event traffic spikes?",
        answer:
          "Yes. Edge caching and auto-scaling handle traffic spikes gracefully. During the first Big Billion Days after launch, the site served peak traffic with zero downtime and sub-1.5s response times.",
      },
      {
        question: "What is the migration approach?",
        answer:
          "We use a parallel migration strategy with feature flags. Traffic is gradually shifted from the legacy store to the new platform, with instant rollback capability. Data migration runs in batches with validation at each step.",
      },
      {
        question: "Can you support regional languages?",
        answer:
          "Yes, the platform supports Hindi and other regional languages through i18n configuration. Language preference is stored per user and syncs across sessions.",
      },
    ],
  },
  "ml-prediction-engine": {
    slug: "ml-prediction-engine",
    title: "ML Prediction Engine",
    subtitle: "Real-Time Machine Learning Inference Platform",
    category: "AI & Data",
    client: "VantageMetrics",
    duration: "4 months",
    description:
      "A real-time ML inference platform enabling sub-50ms predictions at 2,000 requests/second, powering demand forecasting and fraud detection for a Pune-based fintech startup.",
    heroImage: "/assets/ml-prediction-engine.jpg",
    overview:
      "VantageMetrics had excellent ML models but no reliable way to serve them in production. We built a distributed inference system that processes 2,000 predictions per second with sub-50ms latency, achieving 99.5% availability across their fraud detection and demand forecasting use cases.",
    challenge:
      "VantageMetrics' batch prediction approach caused 12-hour delays, missing critical fraud events and inventory stockouts. They needed real-time inference at a budget that made sense for an early-stage fintech startup.",
    solution:
      "Built a model serving platform using FastAPI with custom batching strategies. Deployed models on AWS with automatic load balancing. Implemented model versioning and A/B testing infrastructure for continuous improvement.",
    galleryImages: [
      "/assets/ml-prediction-engine.jpg",
      "/assets/ml-prediction-engine.jpg",
    ],
    features: [
      "Sub-50ms inference latency at 2K requests/second",
      "Multi-model serving with automatic load balancing",
      "Model versioning with zero-downtime deployments",
      "A/B testing and champion-challenger frameworks",
      "Real-time feature store with low-latency lookup",
      "Automatic model drift detection and alerting",
      "CPU inference optimisation",
      "Model monitoring and explainability dashboards",
    ],
    metrics: [
      { label: "Requests/Second", value: "2K+" },
      { label: "Latency", value: "<50ms" },
      { label: "Availability", value: "99.5%" },
      { label: "Models in Production", value: "5+" },
    ],
    results: [
      {
        stat: "89%",
        title: "Fraud Detection Rate, <50ms Response",
        description:
          "Real-time fraud scoring enabled detection and blocking of fraudulent transactions in under 50ms, catching 89% of fraud attempts and saving ₹12L monthly.",
      },
      {
        stat: "18%",
        title: "Reduction in Inventory Costs",
        description:
          "Accurate demand forecasting reduced overstock and stockouts by 18%, freeing up ₹8L in working capital previously tied up in excess inventory.",
      },
      {
        stat: "ML Lifecycle",
        title: "from Weeks to Days",
        description:
          "Self-service deployment tools reduced time-to-production for new models from 2 weeks to 3 days, accelerating data science iteration speed.",
      },
    ],
    techStack: [
      "Python",
      "FastAPI",
      "TensorFlow",
      "scikit-learn",
      "Kubernetes",
      "Redis",
      "PostgreSQL",
      "Grafana",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed existing models, identified production serving bottlenecks, and mapped real-time inference requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed distributed inference system using FastAPI, built model versioning strategy, and created A/B testing infrastructure.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built model serving platform with custom batching strategies. Ran load tests for sub-50ms latency and availability.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across fraud detection and forecasting use cases. Achieved 99.5% availability. Scaled to 2K+ requests/second.",
      },
    ],
    faqs: [
      {
        question: "How do you achieve sub-50ms latency?",
        answer:
          "We use several techniques: optimised model serving with intelligent batching, feature store with in-memory caching for common features, and pre-warming to eliminate cold start delays.",
      },
      {
        question: "How do you handle model versioning and rollback?",
        answer:
          "Every model deployment gets a versioned endpoint. Traffic can be split between versions for A/B testing or instantly shifted back with a single API call. Rollback completes in under 60 seconds.",
      },
      {
        question: "Can you explain model predictions for compliance?",
        answer:
          "Yes, we integrate SHAP for model explainability. Every prediction includes feature importance scores explaining which inputs drove the output, supporting RBI and audit requirements.",
      },
      {
        question: "How do you detect and handle model drift?",
        answer:
          "We continuously monitor prediction distributions and business KPIs. When drift is detected using statistical tests and custom thresholds, alerts fire and optional automatic rollback can trigger.",
      },
      {
        question: "What monitoring is available?",
        answer:
          "Grafana dashboards show request volume, latency percentiles, error rates, and model accuracy metrics. Custom alerts can be configured with integrations to Slack and email.",
      },
    ],
  },
  "real-time-collaboration": {
    slug: "real-time-collaboration",
    title: "Real-Time Collaboration",
    subtitle: "Team Collaborative Workspace Platform",
    category: "Web Development",
    client: "Synapse Workspace",
    duration: "4 months",
    description:
      "A real-time collaborative workspace enabling 5,000+ concurrent users to co-edit documents and manage projects simultaneously, built for a Chennai-based SaaS startup.",
    heroImage: "/assets/real-time-collaboration.png",
    overview:
      "Synapse Workspace needed a real-time collaboration platform for distributed Indian teams. The platform supports 5,000+ concurrent users with CRDT-based conflict resolution, sub-200ms sync latency, and enterprise SSO — all delivered within a lean startup timeline.",
    challenge:
      "Synapse's existing tools couldn't scale beyond 20 simultaneous editors without severe lag. Their document sync broke down with complex edits. They needed a solution reliable enough for their enterprise clients but buildable within a 4-month window.",
    solution:
      "Implemented Yjs CRDT for conflict-free real-time editing. Built a WebSocket-based presence and sync infrastructure. Used JWT-based auth with Google Workspace SSO integration, keeping infrastructure costs low by deploying on AWS Mumbai.",
    galleryImages: [
      "/assets/real-time-collaboration.png",
      "/assets/real-time-collaboration.png",
    ],
    features: [
      "CRDT-based real-time document editing (5K+ concurrent users)",
      "Sub-200ms sync latency",
      "Real-time cursors and presence indicators",
      "Version history with instant rollback",
      "Google Workspace and Microsoft SSO integration",
      "Offline-first with automatic conflict resolution",
      "Integrated task management and comments",
      "Role-based access with team permissions",
    ],
    metrics: [
      { label: "Concurrent Users", value: "5K+" },
      { label: "Sync Latency", value: "<200ms" },
      { label: "Availability", value: "99.5%" },
      { label: "Document Edits", value: "120K+/day" },
    ],
    results: [
      {
        stat: "45%",
        title: "Faster Team Collaboration",
        description:
          "Real-time editing reduced document review cycles from 3 days to under 1 day, saving teams significant back-and-forth communication overhead.",
      },
      {
        stat: "Zero",
        title: "Sync Conflicts in First 6 Months",
        description:
          "CRDT-based architecture ensured 100% conflict-free collaboration across 120K+ daily edits with zero data loss incidents.",
      },
      {
        stat: "₹5.4L",
        title: "Annual Savings vs SaaS Alternatives",
        description:
          "Building a custom platform eliminated per-seat SaaS licensing fees, saving ₹5.4L annually compared to equivalent third-party tools.",
      },
    ],
    techStack: [
      "React",
      "Yjs",
      "WebSocket",
      "Node.js",
      "Redis",
      "PostgreSQL",
      "Cloudflare",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed existing collaboration pain points, identified scaling bottlenecks, and mapped enterprise deployment requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed CRDT-based architecture, built WebSocket presence infrastructure, and created SSO integration workflow.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Yjs CRDT editor with WebSocket sync. Ran load tests for 5K+ concurrent users and security review.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across enterprise teams. Scaled to 5K+ concurrent users with sub-200ms sync latency.",
      },
    ],
    faqs: [
      {
        question: "How does CRDT-based collaboration work?",
        answer:
          "CRDTs allow multiple users to edit simultaneously without coordination. Each user's changes are merged deterministically, ensuring all clients converge to the same state regardless of network delays. We use Yjs for text and custom CRDTs for structured data.",
      },
      {
        question: "What happens offline?",
        answer:
          "The platform works offline with local changes stored in the browser. When connectivity returns, changes sync automatically using the CRDT merge algorithm. Conflict resolution happens seamlessly without user intervention.",
      },
      {
        question: "How do you handle SSO integration?",
        answer:
          "We support Google Workspace OAuth and Microsoft Azure AD OIDC out of the box. Custom SAML integrations for enterprise clients can be added within 1–2 weeks.",
      },
      {
        question: "What is the data residency?",
        answer:
          "By default, all data is stored on AWS Mumbai (ap-south-1) for compliance with Indian data localisation requirements.",
      },
      {
        question: "Can we self-host this platform?",
        answer:
          "Yes, the entire platform can be self-hosted on your own infrastructure. We provide Docker Compose and Kubernetes deployment manifests with documentation.",
      },
    ],
  },
  "datapulse-saas": {
    slug: "datapulse-saas",
    title: "DataPulse SaaS",
    subtitle: "B2B Analytics & Business Intelligence Platform",
    category: "Web Development",
    client: "InsightFlow Analytics",
    duration: "6 months",
    description:
      "A multi-tenant SaaS analytics platform enabling 32+ enterprise clients to unify, visualise, and share business data across teams with real-time dashboards and white-label reporting.",
    heroImage: "/assets/data-pulse.png",
    overview:
      "DataPulse SaaS is a white-label business intelligence platform for Indian SaaS companies and SMEs. It supports 32+ concurrent tenants with row-level security, custom branding, and embedded analytics. The platform processes 120M+ events daily and serves insights to 8,000+ end users across finance, sales, and operations teams.",
    challenge:
      "InsightFlow Analytics needed to replace fragmented reporting tools with a unified platform that could handle growing data volumes while allowing each client to maintain data isolation and custom branding — all within a competitive per-seat pricing model.",
    solution:
      "Built a React + TypeScript frontend with a REST API over PostgreSQL + ClickHouse. Implemented row-level security and tenant isolation at the database level. Created a white-label theming engine with CSS variable injection and custom domain support. Used materialized views and intelligent caching for sub-2s queries on large datasets.",
    galleryImages: ["/assets/data-pulse.png", "/assets/data-pulse.png"],
    features: [
      "Multi-tenant architecture with complete data isolation",
      "White-label branding engine with custom CSS injection",
      "Sub-2s query performance on large datasets",
      "Real-time data pipelines via Kafka",
      "Custom dashboard builder with drag-and-drop widgets",
      "Embedded analytics with iframe and API modes",
      "SSO integration (Google Workspace, Microsoft)",
      "Role-based access with row and column-level security",
    ],
    metrics: [
      { label: "Enterprise Clients", value: "32+" },
      { label: "Daily Events", value: "120M+" },
      { label: "End Users", value: "8K+" },
      { label: "Query Latency", value: "<2s" },
    ],
    results: [
      {
        stat: "₹38L+",
        title: "ARR Growth in Year One",
        description:
          "White-label offering unlocked 8 new enterprise deals worth ₹38L+ in ARR, growing the customer base by 110% without expanding the sales team.",
      },
      {
        stat: "99.5%",
        title: "Multi-Tenant Uptime",
        description:
          "Isolated tenant architecture with dedicated connection pools ensured 99.5% uptime even during peak query loads across 32+ clients.",
      },
      {
        stat: "65%",
        title: "Faster Report Generation",
        description:
          "Materialised views and intelligent caching reduced average report generation from 25 seconds to under 9 seconds, improving user adoption significantly.",
      },
    ],
    techStack: [
      "React",
      "TypeScript",
      "REST API",
      "Node.js",
      "PostgreSQL",
      "ClickHouse",
      "Kafka",
      "Redis",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed data warehouse architecture, identified multi-tenancy requirements, and mapped security and branding needs for enterprise clients.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed multi-tenant PostgreSQL schema with row-level security, built REST API layer, and created white-label theming engine.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built React dashboard builder with drag-and-drop widgets. Implemented Kafka data pipelines. Ran multi-tenant load tests.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 32+ enterprise clients. Scaled to 8K+ end users with 99.5% uptime.",
      },
    ],
    faqs: [
      {
        question: "How does multi-tenancy work in the platform?",
        answer:
          "Each tenant gets a dedicated schema with row-level security policies. Connection pools are partitioned per tenant to prevent noisy neighbour issues. Data is never shared between tenants — even at the caching layer.",
      },
      {
        question: "Can we embed analytics in our own product?",
        answer:
          "Yes, we offer both iframe embedding and REST API modes. You can embed entire dashboards or individual widgets with SSO shared from your parent application.",
      },
      {
        question: "How do you handle data freshness?",
        answer:
          "We use Kafka for near-real-time data ingestion with materialised view refreshes. Typical data freshness is under 60 seconds from source system change to dashboard update.",
      },
      {
        question: "What database systems are supported?",
        answer:
          "The platform connects to PostgreSQL, MySQL, ClickHouse, and any system with a REST or JDBC interface. We provide pre-built connectors with automatic schema discovery.",
      },
      {
        question: "What is the typical onboarding timeline?",
        answer:
          "A new tenant can be onboarded in under 3 hours including SSO configuration, data source connection, and initial dashboard setup via our self-service onboarding wizard.",
      },
    ],
  },
  "healthconnect-enterprise-portal": {
    slug: "healthconnect-enterprise-portal",
    title: "HealthConnect Portal",
    subtitle: "Healthcare Provider Collaboration Platform",
    category: "Web Development",
    client: "CareNet Health Systems",
    duration: "5 months",
    description:
      "A secure provider portal enabling 3,200+ doctors, nurses, and administrators to share patient records and coordinate care across 12 hospital networks in South India.",
    heroImage: "/assets/health-connect-portal.png",
    overview:
      "HealthConnect Portal is a secure web platform for a South Indian hospital network. It enables real-time patient record sharing, care coordination, and referral management across 12 hospitals serving 3,200+ clinicians. Built with zero-trust security and designed for Indian healthcare compliance, the platform handles 85,000+ daily clinical document exchanges.",
    challenge:
      "CareNet Health Systems operated 12 independent hospitals with incompatible systems. Clinicians shared patient records via fax and WhatsApp, causing care delays and data risks. They needed a secure, compliant platform that worked across all their hospitals on a realistic budget.",
    solution:
      "Built a secure API gateway that normalises data from existing clinic systems. Implemented role-based access with mTLS and continuous re-authentication. Created a document sharing system with full audit trails and consent management.",
    galleryImages: [
      "/assets/health-connect-portal.png",
      "/assets/health-connect-portal.png",
    ],
    features: [
      "Secure API gateway for existing hospital systems",
      "Real-time patient record sharing across hospital networks",
      "Care coordination with task management and notifications",
      "Referral management with automated routing",
      "Role-based access with continuous authentication",
      "Consent management with patient-controlled data sharing",
      "Full audit trail and document versioning",
      "Mobile-responsive design for bedside access",
    ],
    metrics: [
      { label: "Active Clinicians", value: "3.2K+" },
      { label: "Hospital Networks", value: "12" },
      { label: "Daily Exchanges", value: "85K+" },
      { label: "Care Delays Reduced", value: "55%" },
    ],
    results: [
      {
        stat: "55%",
        title: "Reduction in Care Coordination Delays",
        description:
          "Digital record sharing eliminated fax and WhatsApp-based communication delays, reducing average care coordination time from 2 days to 6 hours.",
      },
      {
        stat: "₹9.6L+",
        title: "Annual Savings in Admin Costs",
        description:
          "Automated referral routing and digital document exchange eliminated thousands of monthly fax transactions, saving ₹9.6L+ annually in administrative overhead.",
      },
      {
        stat: "Zero",
        title: "Data Breaches in First Year",
        description:
          "Zero-trust architecture and continuous security monitoring ensured zero data breaches since launch, with regular third-party security reviews.",
      },
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Kubernetes",
      "Vault",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed all 12 hospital systems, mapped existing data flows, and identified security and compliance requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed secure API gateway, built role-based access architecture, and created consent management and audit trail systems.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built secure API layer for existing systems. Implemented role-based access and audit trails. Ran security reviews and user acceptance testing.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 12 hospital networks. Scaled to 3.2K+ active clinicians with 85K+ daily exchanges.",
      },
    ],
    faqs: [
      {
        question: "Which hospital systems does the platform integrate with?",
        answer:
          "We have built integrations for common Indian HIS systems. For legacy or custom setups, our team builds tailored integrations through our professional services offering.",
      },
      {
        question: "How does the role-based access model work?",
        answer:
          "Every request is authenticated with short-lived JWTs, authorised based on role and context. Sessions timeout after 15 minutes of inactivity, and all data access is logged to immutable audit trails.",
      },
      {
        question: "Can patients control who sees their records?",
        answer:
          "Yes, we implement a granular consent management system where patients specify which providers can access specific record types. Consent is enforced at the gateway level and can be updated in real-time.",
      },
      {
        question: "How do you handle data residency?",
        answer:
          "All data is stored on AWS Mumbai (ap-south-1) by default. We support bring-your-own-infrastructure deployment for hospitals with strict on-premise requirements.",
      },
      {
        question: "What happens during an outage?",
        answer:
          "The platform is deployed with multi-AZ failover on AWS. During an outage, traffic automatically routes to the standby instance. Critical coordination features have offline capability with local caching for essential clinical documents.",
      },
    ],
  },
  "fooddash-flutter": {
    slug: "fooddash-flutter",
    title: "FoodDash",
    subtitle: "Multi-Vendor Food Delivery Platform",
    category: "Mobile Development",
    client: "FlavorFleet",
    duration: "4 months",
    description:
      "A Flutter-powered food delivery app connecting 320,000+ users with 2,800+ restaurants, featuring real-time order tracking, smart recommendations, and multi-vendor cart support across iOS and Android.",
    heroImage: "/assets/food-dash.webp",
    overview:
      "FoodDash is a Flutter cross-platform app for a growing food delivery startup operating across 4 Tier 2 Indian cities. It serves 320K+ monthly active users ordering from 2,800+ restaurant partners. Key features include real-time driver tracking with live map, group ordering with multi-vendor cart, and ML-powered recommendations that increase average order value by 22%.",
    challenge:
      "FlavorFleet needed to launch a multi-vendor delivery platform and compete in their cities within 4 months. They needed iOS and Android coverage while supporting real-time tracking and multi-vendor carts. Their earlier React Native prototype had performance issues during peak hours.",
    solution:
      "Built a Flutter app with BLoC architecture. Implemented real-time order tracking using Firebase Realtime Database. Created a multi-vendor cart engine with split delivery options. Used Cloud Functions for order processing and Razorpay for Indian payment methods.",
    galleryImages: ["/assets/food-dash.webp", "/assets/food-dash.webp"],
    features: [
      "Real-time driver tracking with live map and ETA",
      "Multi-vendor cart with split delivery options",
      "ML-powered restaurant and menu recommendations",
      "Group ordering with shared cart",
      "In-app chat between customers and delivery agents",
      "Push notifications with deep linking",
      "UPI, cards, and COD payment integration",
      "Offline menu browsing and saved addresses",
    ],
    metrics: [
      { label: "Monthly Active Users", value: "320K+" },
      { label: "Restaurant Partners", value: "2.8K+" },
      { label: "Avg Order Value Lift", value: "+22%" },
      { label: "App Store Rating", value: "4.6/5" },
    ],
    results: [
      {
        stat: "22%",
        title: "Higher Order Value vs Baseline",
        description:
          "ML recommendations and multi-vendor cart features drove 22% higher average order value, with 18% of orders spanning multiple restaurants.",
      },
      {
        stat: "4.6/5",
        title: "App Store Rating Across 15K+ Reviews",
        description:
          "Smooth animations, instant search, and reliable real-time tracking earned 4.6/5 stars from over 15,000 App Store and Play Store reviews.",
      },
      {
        stat: "<5min",
        title: "Average Driver Assignment Time",
        description:
          "Intelligent driver matching with proximity algorithms reduced average assignment time from 9 minutes to under 5 minutes, improving customer satisfaction.",
      },
    ],
    techStack: [
      "Flutter",
      "Dart",
      "Firebase",
      "Cloud Functions",
      "Google Maps API",
      "Razorpay",
      "TensorFlow Lite",
      "BLoC",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed competitor apps, identified multi-vendor cart requirements, and mapped real-time tracking and payment integration needs.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed BLoC architecture for Flutter, built multi-vendor cart engine, and created real-time tracking pipeline with Firebase.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Flutter app with real-time tracking and ML recommendations. Ran performance profiling for smooth animations. Published to App Store and Play Store.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 4 cities. Scaled to 320K+ MAU. Achieved 4.6/5 app store rating.",
      },
    ],
    faqs: [
      {
        question: "Why did you choose Flutter over React Native?",
        answer:
          "Flutter's native rendering engine provided consistent 60fps performance across all UI elements, especially for map animations and real-time tracking. We also saw smaller app bundle sizes compared to the React Native build.",
      },
      {
        question: "How does the multi-vendor cart work?",
        answer:
          "Our cart engine groups items by restaurant and coordinates delivery scheduling. You can order from multiple restaurants in one checkout — items from each are packed and delivered separately by the assigned delivery agent.",
      },
      {
        question: "How does real-time driver tracking work?",
        answer:
          "Driver locations are pushed via Firebase Realtime Database. The Flutter app subscribes to location updates and renders them on Google Maps with smooth interpolation between updates.",
      },
      {
        question: "Which payment methods are supported?",
        answer:
          "We integrate Razorpay, supporting UPI, credit/debit cards, net banking, wallets, and cash on delivery — covering all major Indian payment preferences.",
      },
      {
        question: "How does the recommendation engine work?",
        answer:
          "We use TensorFlow Lite for on-device inference, analysing order history, browsing patterns, time of day, and location. Recommendations update in real-time based on in-session interactions.",
      },
    ],
  },
  "paymate-react-native": {
    slug: "paymate-react-native",
    title: "PayMate",
    subtitle: "Mobile Banking & Payments App",
    category: "Mobile Development",
    client: "NovaPay",
    duration: "5 months",
    description:
      "A React Native mobile banking app serving 850,000+ users with instant UPI transfers, biometric authentication, AI-powered fraud detection, and real-time spend analytics across iOS and Android.",
    heroImage: "/assets/paymate.avif",
    overview:
      "PayMate is a modern mobile banking app built for NovaPay, a Hyderabad-based fintech startup. It serves 850K+ users with instant UPI and P2P transfers, biometric authentication, AI-powered fraud detection, and real-time spend analytics. The app achieved a 4.7/5 rating with zero critical security incidents since launch.",
    challenge:
      "NovaPay's initial app had a 2.8/5 rating and was losing users to competitors. Security relied only on OTP, the UX required 18 steps to complete a transfer, and technical debt slowed new feature development to a crawl. They needed a complete rewrite aligned with RBI guidelines.",
    solution:
      "Built a React Native app with clean architecture. Implemented biometric authentication (Face ID, fingerprint, PIN fallback) with device-bound key storage. Created an ML fraud detection engine running on-device for privacy. Streamlined UX reduced transfer flow to 5 steps.",
    galleryImages: ["/assets/paymate.avif", "/assets/paymate.avif"],
    features: [
      "Biometric authentication (Face ID, fingerprint, PIN)",
      "Instant UPI and P2P transfers",
      "AI-powered on-device fraud detection",
      "Real-time spend analytics with category insights",
      "Digital card management with instant block/unblock",
      "Bill pay with automatic reminders",
      "Mutual fund and FD tracking",
      "Multilingual support (Hindi, Telugu, Tamil, English)",
    ],
    metrics: [
      { label: "Active Users", value: "850K+" },
      { label: "App Store Rating", value: "4.7/5" },
      { label: "Transfer Completion Rate", value: "97%" },
      { label: "Fraud Prevention Rate", value: "97.5%" },
    ],
    results: [
      {
        stat: "4.7/5",
        title: "App Store Rating (from 2.8)",
        description:
          "Complete UX redesign with streamlined flows (5 steps vs 18) drove the app store rating from 2.8 to 4.7, becoming the top-rated app in NovaPay's category within 3 months.",
      },
      {
        stat: "85%",
        title: "Increase in Monthly Transactions",
        description:
          "Frictionless UX and instant UPI transfers drove monthly transaction volume from ₹4.2Cr to ₹7.8Cr within 5 months of launch.",
      },
      {
        stat: "97.5%",
        title: "Fraud Prevention Rate",
        description:
          "On-device ML fraud detection prevented ₹18L+ in fraudulent transactions in the first year while maintaining a sub-0.5% false positive rate.",
      },
    ],
    techStack: [
      "React Native",
      "TypeScript",
      "TensorFlow Lite",
      "Secure Enclave",
      "Firebase",
      "GraphQL",
      "Node.js",
      "PostgreSQL",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed existing app pain points, mapped RBI compliance requirements, and identified security and UX improvement priorities.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed clean architecture with domain-driven layers, built biometric auth pipeline with Secure Enclave, and created on-device ML fraud detection.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built React Native app with streamlined UX and AI fraud detection. Ran security and penetration testing with a third-party firm.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout with feature flags. Scaled to 850K+ users. Achieved 4.7/5 app store rating with zero critical security incidents.",
      },
    ],
    faqs: [
      {
        question: "How does on-device fraud detection work?",
        answer:
          "We use TensorFlow Lite models running entirely on the device. The model analyses transaction patterns, device behaviour, and contextual signals without sending raw data to the cloud, providing privacy-first fraud prevention with sub-50ms inference time.",
      },
      {
        question: "What happens if biometric authentication fails?",
        answer:
          "We implement a fallback chain: biometric → device PIN → OTP via registered mobile number. All fallbacks trigger additional verification to maintain security.",
      },
      {
        question: "How do you ensure RBI compliance?",
        answer:
          "Card data is tokenised immediately using device-bound tokens aligned with RBI tokenisation guidelines. We undergo regular security audits and penetration testing.",
      },
      {
        question: "Can the app work offline?",
        answer:
          "Balance viewing and transaction history work offline with locally cached data. UPI transfers require connectivity for security verification. Card block/unblock queues offline and executes on reconnection.",
      },
      {
        question: "How do you handle multi-language support?",
        answer:
          "We use i18n with react-intl, supporting Hindi, Telugu, Tamil, and English. Language preference syncs across devices via the backend.",
      },
    ],
  },
  "fitforce-android": {
    slug: "fitforce-android",
    title: "FitForce",
    subtitle: "AI Fitness Platform",
    category: "Mobile Development",
    client: "PulseFit",
    duration: "4 months",
    description:
      "A Jetpack Compose Android app with 180,000+ downloads, featuring AI pose detection for real-time workout feedback, personalised training plans, and social challenges with leaderboards.",
    heroImage: "/assets/fit-force.png",
    overview:
      "FitForce is a native Android fitness app built with Jetpack Compose for PulseFit, a Pune-based health startup. It uses ML Kit for real-time pose detection, generates personalised training plans, and gamifies fitness with social challenges and leaderboards. The app has 180K+ downloads with a 4.6/5 Play Store rating.",
    challenge:
      "PulseFit's existing app had high churn — 65% of users stopped exercising within 30 days. Generic workout plans, no form feedback, and no social accountability were the primary culprits. They needed a smarter, more engaging experience built natively for Android.",
    solution:
      "Built a native Android app with Jetpack Compose and MVVM architecture. Integrated ML Kit for real-time pose detection with fast inference providing visual form corrections. Created a dynamic training plan engine adapting to user progress. Designed social features with group challenges and streak-based gamification.",
    galleryImages: ["/assets/fit-force.png", "/assets/fit-force.png"],
    features: [
      "Real-time AI pose detection with form feedback",
      "Dynamic workout plans that adapt to user progress",
      "Heart rate zone tracking via wearable integration",
      "Social challenges with team leaderboards",
      "Streak system with milestone rewards",
      "Workout sharing with video recording",
      "Offline workout downloads for gym use",
      "Calorie and macro tracking integration",
    ],
    metrics: [
      { label: "Downloads", value: "180K+" },
      { label: "App Rating", value: "4.6/5" },
      { label: "30-Day Retention", value: "58%" },
      { label: "Pose Detection Latency", value: "18ms" },
    ],
    results: [
      {
        stat: "58%",
        title: "30-Day Retention (from 35%)",
        description:
          "Personalised AI workout plans and social accountability features increased 30-day retention from 35% to 58%, one of the highest retention rates in the Indian fitness app category.",
      },
      {
        stat: "4.6/5",
        title: "Play Store Rating with 15K+ Reviews",
        description:
          "Native Jetpack Compose UI with smooth animations and intuitive navigation achieved 4.6/5 stars from 15,000+ reviews, outperforming cross-platform alternatives in the same category.",
      },
      {
        stat: "25%",
        title: "Reduction in Workout-Related Injuries",
        description:
          "AI pose detection providing real-time form feedback reduced reported workout injuries by 25%, with users reporting higher confidence in their exercise technique.",
      },
    ],
    techStack: [
      "Jetpack Compose",
      "Kotlin",
      "ML Kit Pose Detection",
      "Room Database",
      "Hilt DI",
      "Coroutines + Flow",
      "Firebase",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed existing fitness app pain points, identified AI pose detection requirements, and mapped social feature and gamification needs.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed MVVM architecture with Jetpack Compose, built ML Kit pose detection pipeline, and created dynamic training plan engine.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built native Android app with real-time pose detection. Ran user testing for form feedback accuracy. Published to Play Store with staged rollout.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Achieved 180K+ downloads in 4 months. Maintained 4.6/5 rating with 15K+ reviews.",
      },
    ],
    faqs: [
      {
        question: "How accurate is the AI pose detection?",
        answer:
          "ML Kit achieves 93%+ joint detection accuracy in standard lighting. We validate exercises against certified personal trainer guidance and provide confidence scores so users know when detection is reliable.",
      },
      {
        question: "How does the dynamic workout plan adaptation work?",
        answer:
          "Our algorithm analyses completion rate, self-reported exertion, and optional heart rate data to adjust workout difficulty weekly. The system learns your recovery patterns over time for increasingly personalised plans.",
      },
      {
        question: "Does the app work without internet?",
        answer:
          "Yes — downloaded workout plans, exercise videos, and tracking data are all available offline. Social features require connectivity. Data syncs automatically when connection is restored.",
      },
      {
        question: "Can I use the app with a fitness tracker?",
        answer:
          "Yes, we integrate with Google Fit for importing data from Garmin, Mi Band, boAt, and other platforms, providing a unified view of your fitness activity.",
      },
      {
        question: "How do team challenges and leaderboards work?",
        answer:
          "You can create or join teams of up to 30 members. Challenges are time-bounded with goals like total workout minutes or streak days. Leaderboards update in real-time during active challenges.",
      },
    ],
  },
  "devops-pipeline-pro": {
    slug: "devops-pipeline-pro",
    title: "DevOps Pipeline Pro",
    subtitle: "CI/CD & DevOps Automation Platform",
    category: "Cloud & DevOps",
    client: "DriftLine",
    duration: "5 months",
    description:
      "A DevOps platform automating 85+ daily deployments across 45+ microservices, with a visual pipeline builder, GitOps deployment, and intelligent rollback with ML-powered anomaly detection.",
    heroImage: "/assets/devops-pipeline.webp",
    overview:
      "DevOps Pipeline Pro is an internal developer platform built for DriftLine's 50+ engineering team. It automates 85+ daily deployments across 45+ microservices with zero-downtime blue-green deployments. The platform includes a visual pipeline builder, GitOps workflow management, and ML-powered anomaly detection that reduces failed deployments by 65%.",
    challenge:
      "DriftLine's teams used 5 different CI/CD tools with no standardisation, causing 2-hour average deployment times and frequent manual rollbacks. Each team had different security configurations, slowing down compliance. They needed a unified platform without the cost of enterprise SaaS tools.",
    solution:
      "Built a unified DevOps platform with a visual pipeline builder (React + Go backend), GitOps workflow engine using ArgoCD, and blue-green/canary deployment strategies. Implemented ML-powered anomaly detection on Prometheus metrics. Reduced deployment time from 2 hours to 15 minutes.",
    galleryImages: [
      "/assets/devops-pipeline.webp",
      "/assets/devops-pipeline.webp",
    ],
    features: [
      "Visual CI/CD pipeline builder with 30+ pre-built steps",
      "GitOps workflow management with ArgoCD integration",
      "Blue-green and canary deployment strategies",
      "ML-powered deployment anomaly detection",
      "Automatic rollback with health check gates",
      "Self-service environment provisioning",
      "Policy-as-code with OPA integration",
      "Deployment analytics and cost attribution",
    ],
    metrics: [
      { label: "Daily Deployments", value: "85+" },
      { label: "Microservices Managed", value: "45+" },
      { label: "Deployment Time", value: "15min" },
      { label: "Failed Deployment Reduction", value: "65%" },
    ],
    results: [
      {
        stat: "87%",
        title: "Reduction in Deployment Time",
        description:
          "Visual pipeline builder and self-service environments reduced average deployment time from 2 hours to 15 minutes, saving 30+ hours of engineering time weekly.",
      },
      {
        stat: "65%",
        title: "Fewer Failed Deployments",
        description:
          "ML-powered anomaly detection and automatic rollback reduced failed deployment rate from 14% to 4.9%, reducing on-call incidents significantly.",
      },
      {
        stat: "₹12L",
        title: "Annual Infrastructure Savings",
        description:
          "Intelligent resource scaling and rightsizing recommendations delivered ₹12L in annual cloud infrastructure savings across 45+ microservices.",
      },
    ],
    techStack: [
      "Go",
      "React",
      "TypeScript",
      "ArgoCD",
      "Kubernetes",
      "Helm",
      "Prometheus",
      "OPA",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Audited 5 existing CI/CD tools, mapped 45+ microservice deployment patterns, and identified ML anomaly detection requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed unified pipeline builder, built GitOps workflow engine with ArgoCD, and created ML anomaly detection pipeline using Prometheus metrics.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built visual pipeline builder with Go backend. Implemented blue-green and canary deployment strategies. Ran deployment stress tests across 45+ microservices.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across all engineering teams. Achieved 85+ daily deployments with 65% fewer failures. Delivered ₹12L in annual infrastructure savings.",
      },
    ],
    faqs: [
      {
        question: "How does the ML anomaly detection work?",
        answer:
          "We collect 30+ metrics per deployment using Prometheus. Our ML model learns normal deployment patterns per service and flags deviations in real-time, triggering automatic health checks and rollback if checks fail.",
      },
      {
        question: "Can we migrate from our existing CI/CD tools?",
        answer:
          "Yes, we provide migration tooling that converts Jenkins, GitHub Actions, and GitLab CI configs to our platform format. Migration can be done service by service with parallel runs to validate behaviour.",
      },
      {
        question: "How does GitOps integration work?",
        answer:
          "We integrate with ArgoCD. Your deployment manifests live in Git, and our platform syncs them to your clusters with full diff visibility and rollback capability.",
      },
      {
        question: "What security controls are built in?",
        answer:
          "We implement policy-as-code using OPA with pre-built policies for common compliance needs. All secrets are managed through HashiCorp Vault with automatic rotation.",
      },
      {
        question: "How do you handle deployment rollbacks?",
        answer:
          "Rollbacks trigger automatically when health checks fail or ML anomaly score exceeds threshold. Rollback completes in under 90 seconds using our blue-green strategy. All rollbacks are logged with a full audit trail.",
      },
    ],
  },
  "cloudwatch-pro": {
    slug: "cloudwatch-pro",
    title: "CloudWatch Pro",
    subtitle: "Unified Cloud Observability Platform",
    category: "Cloud & DevOps",
    client: "SwiftBridge Cloud",
    duration: "4 months",
    description:
      "A unified observability platform ingesting 85GB/day of metrics, logs, and traces across AWS and on-premise infrastructure, with ML-powered root cause analysis and intelligent alerting that reduced alert fatigue by 75%.",
    heroImage: "/assets/amazon-cloudwatch.png",
    overview:
      "CloudWatch Pro is a centralised observability platform built for SwiftBridge Cloud, a Bengaluru-based SaaS company. It ingests 85GB/day of metrics, logs, and traces, providing unified dashboards, ML-powered root cause analysis, and intelligent alerting. The platform serves 320+ engineers across 8 teams, reducing alert fatigue by 75%.",
    challenge:
      "SwiftBridge's engineers used 4 different monitoring tools, causing context-switching and missed correlations. Alert fatigue was severe — 1,200+ daily alerts with an 80% false positive rate. Critical incidents were often detected by customers first, damaging reputation and causing churn.",
    solution:
      "Built a unified observability platform with OpenTelemetry-native ingestion, storing data in ClickHouse for high-cardinality metrics and Elasticsearch for log analysis. Implemented ML-powered root cause analysis using distributed trace correlation. Created an intelligent alert engine with dynamic thresholds and noise reduction.",
    galleryImages: [
      "/assets/amazon-cloudwatch.png",
      "/assets/amazon-cloudwatch.png",
    ],
    features: [
      "Unified metrics, logs, and traces across AWS and on-premise",
      "OpenTelemetry-native ingestion with auto-instrumentation",
      "ML-powered root cause analysis with trace correlation",
      "Intelligent alerting with dynamic thresholds and noise reduction",
      "Distributed tracing with flame graph visualisation",
      "Real-time log aggregation with full-text search",
      "SLO tracking with burn rate alerting",
      "Custom dashboards with drag-and-drop widgets",
    ],
    metrics: [
      { label: "Daily Data Ingest", value: "85GB+" },
      { label: "Alert Reduction", value: "75%" },
      { label: "Engineers Served", value: "320+" },
      { label: "MTTR Reduction", value: "55%" },
    ],
    results: [
      {
        stat: "75%",
        title: "Reduction in Alert Volume",
        description:
          "Intelligent alert engine with ML noise reduction cut daily alert volume from 1,200+ to under 300 while maintaining 100% coverage of genuine incidents, eliminating alert fatigue.",
      },
      {
        stat: "55%",
        title: "Faster Incident Resolution",
        description:
          "ML-powered root cause analysis reduced MTTR from 38 minutes to under 17 minutes, preventing an estimated ₹32L in annual incident-related losses.",
      },
      {
        stat: "100%",
        title: "Real Incident Detection",
        description:
          "Zero customer-reported incidents without internal detection in the first 12 months, compared to 5 per month before the platform.",
      },
    ],
    techStack: [
      "Go",
      "React",
      "TypeScript",
      "ClickHouse",
      "Elasticsearch",
      "Kafka",
      "OpenTelemetry",
      "Kubernetes",
      "Grafana",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Audited 4 existing monitoring tools, mapped alert noise patterns, and identified ML root cause analysis requirements across 8 engineering teams.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed OpenTelemetry ingestion pipeline, built ClickHouse + Elasticsearch storage layer, and created ML alert noise reduction engine.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built unified observability platform with trace correlation. Implemented ML root cause analysis. Ran false positive rate benchmarking against existing tools.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 8 teams. Scaled to 85GB+ daily ingest. Achieved 75% alert reduction with 100% real incident coverage.",
      },
    ],
    faqs: [
      {
        question: "How does ML-powered root cause analysis work?",
        answer:
          "When an incident triggers, our system correlates metric anomalies with distributed trace spans and log events using a multi-stage ML pipeline. It identifies the most probable root cause by analysing temporal correlations and error propagation patterns, presented as a ranked list with supporting evidence.",
      },
      {
        question: "How does the intelligent alert engine reduce noise?",
        answer:
          "We use three techniques: dynamic thresholds that adapt to traffic patterns, multi-signal correlation requiring multiple signals to agree before alerting, and automatic alert grouping that clusters related alerts into single incidents.",
      },
      {
        question: "Can we migrate from our existing monitoring tools?",
        answer:
          "Yes, we provide migration tooling for Datadog, Prometheus, and CloudWatch. We can import dashboards, alerts, and historical data incrementally with parallel operation to validate consistency.",
      },
      {
        question: "What is the data retention policy?",
        answer:
          "Default retention is 30 days for high-resolution metrics and 60 days for logs. We offer configurable retention tiers with long-term archival to S3 for compliance. Data can be downsampled over time to reduce storage costs.",
      },
      {
        question: "How do you handle data sovereignty?",
        answer:
          "All data is stored on AWS Mumbai (ap-south-1) by default. For strict on-premise requirements, we support fully self-hosted deployment where data never leaves your infrastructure.",
      },
    ],
  },
  "bpifrance-emergency-funding": {
    slug: "bpifrance-emergency-funding",
    title: "Bpifrance: National Crisis Response Platform",
    subtitle: "Deploying €115B in critical state-backed funding in 5 days.",
    category: "Web Development",
    client: "Bpifrance",
    duration: "5 Days",
    description:
      "In the wake of the global economic crisis, Bpifrance required a high-capacity platform to distribute emergency state-guaranteed loans. Theodo architected and launched the entire system in under a week, saving thousands of businesses from insolvency.",
    heroImage: "/assets/bpifrance-hero.png",
    overview:
      "When the French government announced an unprecedented economic relief package, Bpifrance faced the monumental task of processing loan applications for over 100,000 SMEs simultaneously. Traditional systems would have buckled under the load, requiring a ground-up rebuild of the application and approval workflow using modern, resilient cloud technology.",
    challenge:
      "The primary obstacle was the absolute non-negotiable deadline of 5 days, combined with the requirement for bank-grade security and the ability to scale from zero to millions of requests instantly. The system also had to integrate seamlessly with existing legacy government databases to verify business eligibility in real-time.",
    solution:
      "We deployed an elite squad of engineers to build a Serverless architecture on AWS. By utilizing Lambda functions and DynamoDB, we ensured the platform could scale horizontally without manual intervention. Our team utilized a custom UI component library to accelerate development while ensuring full accessibility and mobile responsiveness.",
    galleryImages: [
      "/assets/bpifrance-dashboard.png",
      "/assets/bpifrance-architecture.png",
    ],
    features: [
      "Automated Eligibility Verification",
      "Serverless Cloud Infrastructure",
      "Bank-Grade Data Encryption",
      "High-Concurrency Load Balancing",
      "Real-time Application Tracking",
      "Secure Document Upload Portal",
      "Automated Decision Engine",
      "Multi-Agency Integration Layer",
    ],
    metrics: [
      {
        label: "Total Capital Deployed",
        value: "€115B",
      },
      {
        label: "Launch Lead Time",
        value: "5 Days",
      },
      {
        label: "Successful Applications",
        value: "50k+",
      },
      {
        label: "Platform Uptime",
        value: "99.99%",
      },
    ],
    results: [
      {
        stat: "€115B+",
        title: "Total Impact",
        description:
          "Successfully facilitated the largest economic relief package in French history without a single second of downtime.",
      },
      {
        stat: "100%",
        title: "Security Accuracy",
        description:
          "Zero data breaches or fraudulent applications despite high-profile target status during a national emergency.",
      },
      {
        stat: "85%",
        title: "Efficiency Gain",
        description:
          "Reduced average loan processing time from weeks to under 24 hours through intelligent automation.",
      },
    ],
    techStack: [
      "AWS Lambda",
      "Node.js",
      "React",
      "DynamoDB",
      "Terraform",
      "TypeScript",
      "Python",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Strategic Discovery",
        description:
          "Identified core requirements and mapped integration points with government datasets within 6 hours.",
      },
      {
        label: "Phase 2",
        title: "Architecture Design",
        description:
          "Finalised serverless blueprint to ensure infinite scalability and absolute data security.",
      },
      {
        label: "Phase 3",
        title: "Sprint Delivery",
        description:
          "Continuous deployment over 72 hours, building the engine, UI, and verification APIs in parallel.",
      },
      {
        label: "Phase 4",
        title: "National Launch",
        description:
          "Successful production deployment with live monitoring and real-time scaling adjustments.",
      },
    ],
    faqs: [
      {
        question: "How did you manage a 5-day deadline for a national project?",
        answer:
          "We used a Serverless-first approach and parallelized work between infrastructure, frontend, and backend squads, utilizing pre-vetted security modules.",
      },
      {
        question: "Can the system handle future peak traffic events?",
        answer:
          "Yes, the AWS-based architecture is designed to scale horizontally to handle millions of simultaneous users without performance degradation.",
      },
      {
        question: "How was data security maintained during rapid deployment?",
        answer:
          "We implemented automated security scans and utilized peer-reviewed encryption protocols from the first line of code.",
      },
      {
        question: "What happens if external government APIs fail?",
        answer:
          "The platform includes a robust queuing system (SQS) that stores applications and retries verification when external systems are back online.",
      },
      {
        question: "Is the platform adaptable for other financial products?",
        answer:
          "The modular architecture allows Bpifrance to add new loan types and financial instruments with minimal development overhead.",
      },
    ],
  },
  "healthhero-scaling-telehealth": {
    slug: "healthhero-scaling-telehealth",
    title: "HealthHero: Global Telemedicine Ecosystem",
    subtitle:
      "Modernising legacy infrastructure for a multi-million user healthcare provider.",
    category: "Web Development",
    client: "HealthHero",
    duration: "6 Months",
    description:
      "HealthHero needed to unify multiple acquired legacy platforms into a cohesive, high-performance microservices architecture. We led the digital transformation that enabled them to scale across Europe and handle millions of patient consultations.",
    heroImage: "/assets/healthhero-hero.png",
    overview:
      "As Europe's leading telehealth provider, HealthHero faced significant 'technical debt' from several acquisitions. Each entity used different technologies and data structures. We were tasked with creating a unified Practice Management System (PMS) that could support rapid international expansion and varying medical regulations.",
    challenge:
      "The core challenge was migrating live patient data and critical consultation workflows from monolithic legacy systems to a modern microservices architecture without any service interruption. We had to ensure 100% compliance with GDPR and local medical data residency laws in multiple countries.",
    solution:
      "We designed a GraphQL-driven federated architecture that allows different teams to manage specific domains (e.g., prescriptions, scheduling, billing) independently. This transition decoupled the frontend from the legacy backends, allowing for a phased migration and immediate improvements in user experience.",
    galleryImages: [
      "/assets/healthhero-app.png",
      "/assets/healthhero-microservices.png",
    ],
    features: [
      "Federated GraphQL API",
      "Microservices Architecture",
      "HIPAA & GDPR Compliance",
      "Cross-Platform Video Consulting",
      "Automated Doctor Scheduling",
      "e-Prescription Management",
      "Multi-Language Support",
      "Unified Patient Health Records",
    ],
    metrics: [
      {
        label: "Total Patient Reach",
        value: "5M+",
      },
      {
        label: "Infrastructure Savings",
        value: "40%",
      },
      {
        label: "Deployment Velocity",
        value: "5x",
      },
      {
        label: "System Latency",
        value: "<120ms",
      },
    ],
    results: [
      {
        stat: "5x",
        title: "Release Frequency",
        description:
          "Teams can now deploy features independently, increasing the overall speed of innovation five-fold.",
      },
      {
        stat: "40%",
        title: "Operational Savings",
        description:
          "Reduced hosting and maintenance costs by consolidating legacy infrastructure into efficient cloud-native services.",
      },
      {
        stat: "100%",
        title: "Zero Downtime",
        description:
          "Successfully migrated over 1 million patient records to the new architecture without a single minute of service loss.",
      },
    ],
    techStack: [
      "NestJS",
      "React",
      "GraphQL",
      "AWS",
      "Kubernetes",
      "PostgreSQL",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Audit & Blueprinting",
        description:
          "Mapped every legacy system and defined the microservices boundary map for the new ecosystem.",
      },
      {
        label: "Phase 2",
        title: "Core Infrastructure",
        description:
          "Established the Kubernetes cluster and GraphQL gateway to begin service decoupling.",
      },
      {
        label: "Phase 3",
        title: "Domain Migration",
        description:
          "Migrated high-impact services like scheduling and patient records using a 'strangler' pattern.",
      },
      {
        label: "Phase 4",
        title: "Global Optimisation",
        description:
          "Rolled out the unified platform to all European regions with localized compliance modules.",
      },
    ],
    faqs: [
      {
        question: "How did you handle medical data privacy?",
        answer:
          "We implemented strict data-at-rest encryption and utilized region-specific cloud nodes to ensure data residency compliance.",
      },
      {
        question: "What is the benefit of the GraphQL gateway?",
        answer:
          "It allows the frontend to fetch precisely the data it needs from multiple microservices in a single, efficient request.",
      },
      {
        question: "Did you use any specific patient intake algorithm?",
        answer:
          "Yes, we implemented a custom triage engine that automatically prioritizes emergency cases for immediate doctor attention.",
      },
      {
        question: "How long can the system scale up during pandemics?",
        answer:
          "The Kubernetes-based infrastructure auto-scales horizontally, capable of handling a 10x surge in traffic within minutes.",
      },
      {
        question: "Can new healthcare partners be integrated easily?",
        answer:
          "The modular microservices design allows for new API integrations in weeks rather than months.",
      },
    ],
  },
  "vueling-serverless-transformation": {
    slug: "vueling-serverless-transformation",
    title: "Vueling: Cloud-Native Airline Platform",
    subtitle:
      "Revolutionising the booking experience with Serverless technology.",
    category: "Cloud & DevOps",
    client: "Vueling",
    duration: "4 Months",
    description:
      "Vueling, a leading European airline, needed to modernize its digital heart to handle massive surges during flight booking windows. We transitioned their core booking APIs to a Serverless architecture, significantly reducing costs and improving performance.",
    heroImage: "/assets/vueling-hero.png",
    overview:
      "Commercial airlines face extremely spiky traffic patterns—low at night and massive during summer sales. Vueling's traditional server-based infrastructure was expensive to maintain and slow to scale. We implemented a cloud-native strategy to ensure their platform was always available, regardless of sudden traffic bursts.",
    challenge:
      "The challenge was to migrate high-traffic booking paths from a restrictive, on-premise environment to AWS. This required re-architecting legacy logic into event-driven functions while ensuring absolute consistency for flight availability and pricing during high-concurrency events.",
    solution:
      "We adopted a Serverless-first approach using AWS Lambda and API Gateway. This allowed the infrastructure to scale automatically based on request volume. We also optimized the frontend with a modern React framework to provide a faster, more intuitive booking flow for over 12 million monthly users.",
    galleryImages: ["/assets/vueling-mobile.png", "/assets/vueling-cloud.png"],
    features: [
      "Auto-Scaling Booking Engine",
      "Event-Driven Architecture",
      "Infrastructure as Code (CDK)",
      "High-Performance API Gateway",
      "Real-time Fare Monitoring",
      "Serverless Side Rendering",
      "Deterministic Scaling Logic",
      "Multi-Region Failover",
    ],
    metrics: [
      {
        label: "Feature Velocity",
        value: "3x Faster",
      },
      {
        label: "Peak Capacity",
        value: "Infinite",
      },
      {
        label: "Operational Costs",
        value: "-50%",
      },
      {
        label: "Customer Users",
        value: "12M/Mo",
      },
    ],
    results: [
      {
        stat: "50%",
        title: "Cost Reduction",
        description:
          "Switched to a pay-per-request model, eliminating the cost of idle servers during low-traffic periods.",
      },
      {
        stat: "0",
        title: "Service Outages",
        description:
          "Achieved zero downtime during the highest traffic booking events in the company's history.",
      },
      {
        stat: "300%",
        title: "Developer Speed",
        description:
          "Reduced development and deployment cycles from weeks to days using automated cloud-native pipelines.",
      },
    ],
    techStack: [
      "AWS Lambda",
      "TypeScript",
      "React",
      "CDK",
      "DynamoDB",
      "S3",
      "CloudFront",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Legacy Audit",
        description:
          "Performance profiling of existing booking APIs to identify bottlenecks and migration targets.",
      },
      {
        label: "Phase 2",
        title: "POC Validation",
        description:
          "Developing a Serverless Proof of Concept to prove low-latency booking at scale.",
      },
      {
        label: "Phase 3",
        title: "Full Migration",
        description:
          "Rolling out the serverless booking path to millions of users in production.",
      },
      {
        label: "Phase 4",
        title: "CI/CD Automation",
        description:
          "Implementing advanced automated testing and deployment pipelines for continuous innovation.",
      },
    ],
    faqs: [
      {
        question: "Why choose Serverless for an airline?",
        answer:
          "Airlines have highly variable traffic. Serverless allows them to pay only for what they use while scaling instantly to meet demand.",
      },
      {
        question: "How do you handle long-running transactions?",
        answer:
          "We use Step Functions to manage state across multiple Lambda calls, ensuring booking integrity even for complex itineraries.",
      },
      {
        question: "What about 'Cold Starts' in Lambda?",
        answer:
          "We use Provisioned Concurrency and optimized bundles to ensure sub-second response times for every user.",
      },
      {
        question: "Is the system secure?",
        answer:
          "Yes, we follow the AWS Well-Architected Framework and implement strict IAM roles for every individual function.",
      },
      {
        question: "Can legacy systems still communicate with the new platform?",
        answer:
          "Yes, we built custom bridge APIs to ensure the new cloud-native services could sync with on-premise flight databases.",
      },
    ],
  },
  "colas-logistics-optimisation": {
    slug: "colas-logistics-optimisation",
    title: "Colas: Smart Logistics Framework",
    subtitle:
      "Optimising global construction supply chains through real-time tracking.",
    category: "Mobile Development",
    client: "Colas",
    duration: "5 Months",
    description:
      "Colas, a world leader in transport infrastructure, needed a way to manage material logistics across thousands of global sites. We built a mission-critical mobile application that reduced waste and significantly increased site manager efficiency.",
    heroImage: "/assets/colas-hero.png",
    overview:
      "Site managers at Colas previously relied on manual paperwork and radio calls to coordinate the delivery of materials like asphalt. This led to significant idle time and material wastage. We developed a robust mobile solution that provides real-time GPS tracking and automated delivery scheduling across their fleet.",
    challenge:
      "The application had to work flawlessly in harsh construction environments with intermittent internet connectivity and on a wide range of ruggedized and consumer mobile devices. It also needed to process complex data from thousands of vehicles simultaneously without lag.",
    solution:
      "We developed a React Native mobile application with sophisticated offline-first capabilities. Utilizing an Azure IoT-driven backend, the system synchronizes data as soon as a connection is established. A high-performance Mapbox-based UI ensures managers can see every vehicle in their sector in real-time.",
    galleryImages: [
      "/assets/colas-tablet-ui.png",
      "/assets/colas-site-manager.png",
    ],
    features: [
      "Offline-First Data Sync",
      "Real-time GPS Fleet Tracking",
      "Automated Delivery Queueing",
      "IoT Device Integration",
      "Custom Mapbox Visualisation",
      "Material Temperature Monitoring",
      "Dynamic Rerouting Engine",
      "Automated Shift Reporting",
    ],
    metrics: [
      {
        label: "Active Vehicles Tracked",
        value: "10k+",
      },
      {
        label: "Waste Reduction",
        value: "15%",
      },
      {
        label: "Site Manager Efficiency",
        value: "+25%",
      },
      {
        label: "Active Daily Sites",
        value: "2,000+",
      },
    ],
    results: [
      {
        stat: "25%",
        title: "Productivity Increase",
        description:
          "Site managers can now coordinate 25% more deliveries per day through automated queueing and real-time alerts.",
      },
      {
        stat: "15%",
        title: "Material Savings",
        description:
          "Reduced material waste by optimizing delivery times to ensure materials like asphalt stay at the required temperatures.",
      },
      {
        stat: "100%",
        title: "Paperless Operation",
        description:
          "Completely digitised the site's logistical records, saving thousands of hours in administrative overhead.",
      },
    ],
    techStack: [
      "React Native",
      "Node.js",
      "Azure IoT Hub",
      "CosmosDB",
      "Redis",
      "Mapbox",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Field Research",
        description:
          "Shadowing site managers on active construction projects to understand real-world workflows.",
      },
      {
        label: "Phase 2",
        title: "Prototype Testing",
        description:
          "Developing and testing an offline-capable MVP with a small cohort of drivers and managers.",
      },
      {
        label: "Phase 3",
        title: "Back-end Integration",
        description:
          "Connecting the mobile app with massive Azure IoT streams and legacy ERP systems.",
      },
      {
        label: "Phase 4",
        title: "Global Fleet Rollout",
        description:
          "Phased deployment to 10,000+ vehicles across multiple countries with localized fleet settings.",
      },
    ],
    faqs: [
      {
        question: "How does the app work without a signal?",
        answer:
          "All data is stored locally in a high-performance SQLite database and synchronized with the cloud using a custom 'Replay-Log' logic once signal returns.",
      },
      {
        question: "Can it integrate with existing truck hardware?",
        answer:
          "Yes, it connects via Bluetooth or Azure IoT Hub to a wide variety of existing vehicle telemetry units.",
      },
      {
        question: "How complex is the map interface?",
        answer:
          "Highly optimized; it can display 1,000+ moving items in a single view with sub-second position updates.",
      },
      {
        question: "Is training required for workers?",
        answer:
          "The UI was designed for extreme simplicity, requiring less than 15 minutes of training for new site managers.",
      },
      {
        question: "What IoT insights are provided?",
        answer:
          "Beyond location, we track engine health, fuel consumption, and the internal temperature of transported materials.",
      },
    ],
  },
  "simon-kucher-partners": {
    slug: "simon-kucher-partners",
    title: "Global Profit & Pricing Intelligence Engine",
    subtitle: "Enterprise Decision-Support Platform for Strategic Pricing",
    category: "AI & Data",
    client: "Simon-Kucher & Partners",
    duration: "18 Months",
    description:
      "Limeup developed a sophisticated, scalable pricing optimization software for Simon-Kucher, a global leading strategy and marketing consulting firm, enabling real-time margin simulations and unified data analysis.",
    heroImage: "/assets/simon-kucher-partners.png",
    overview:
      "The project involved building a mission-critical platform for consultants to analyze complex market data and optimize pricing strategies for Fortune 500 clients. The goal was to replace legacy spreadsheet models with a robust, cloud-native enterprise application.",
    challenge:
      "Simon-Kucher needed to unify hundreds of disparate data sources and modeling techniques into a single, high-performance environment that could be accessed by consultants across 25+ global offices without compromising on speed or security.",
    solution:
      "A custom-built analytics engine utilizing React and a distributed Node.js backend. We implemented advanced data visualization layers and a high-concurrency simulation engine that allows for instant 'what-if' pricing scenario testing.",
    galleryImages: [
      "/assets/simon-kucher-dashboard.png",
      "/assets/simon-kucher-analytics.png",
    ],
    features: [
      "Real-time margin impact simulator",
      "Dynamic price elasticity modeling",
      "Customizable consultant dashboards",
      "Global multi-currency support",
      "Automated reporting and PPT export",
      "Enterprise-grade role-based access",
      "Cross-regional data synchronization",
      "Legacy ERP data connectors",
    ],
    metrics: [
      {
        label: "Analysis Speed",
        value: "40% Increase",
      },
      {
        label: "Global Users",
        value: "2,500+",
      },
      {
        label: "Daily Data Points",
        value: "1B+",
      },
      {
        label: "Margin Impact",
        value: "+15% Avg",
      },
    ],
    results: [
      {
        stat: "25+",
        title: "Offices Connected",
        description:
          "Successfully deployed across all global consulting hubs with zero downtime during migration.",
      },
      {
        stat: "99.9%",
        title: "Uptime Reliability",
        description:
          "Maintained enterprise-standard availability for critical strategy sessions.",
      },
      {
        stat: "2x",
        title: "Consultant Efficiency",
        description:
          "Reduced manual data preparation time from days to minutes through automation.",
      },
    ],
    techStack: [
      "React",
      "TypeScript",
      "Node.js",
      "AWS",
      "PostgreSQL",
      "Redis",
      "Python",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Architecture",
        description:
          "Extensive deep-dive into existing financial models and definition of the technical blueprint.",
      },
      {
        label: "Phase 2",
        title: "Engine Development",
        description:
          "Core logic implementation for simulation and large-scale data processing.",
      },
      {
        label: "Phase 3",
        title: "UI/UX & Visualization",
        description:
          "Perfecting the interface for high-stakes professional environments.",
      },
      {
        label: "Phase 4",
        title: "Scale & Deployment",
        description:
          "Global rollout and integration with legacy reporting systems.",
      },
    ],
    faqs: [
      {
        question: "How does the real-time simulation work?",
        answer:
          "It uses advanced financial modelling algorithms to calculate margin impacts instantly based on price changes.",
      },
      {
        question: "Is the data secure across global offices?",
        answer:
          "Yes, we implemented SOC2-compliant enterprise security and end-to-end data encryption.",
      },
      {
        question: "Can it handle extremely large datasets?",
        answer:
          "The architecture was built to process billions of data points using distributed compute clusters.",
      },
      {
        question: "Was it integrated with existing ERPs?",
        answer:
          "Yes, we developed custom connectors for SAP, Oracle, and proprietary consultant databases.",
      },
      {
        question: "Does it support offline working sessions?",
        answer:
          "The platform features a robust sync mechanism for consultants working on-site without reliable internet.",
      },
    ],
  },
  "connecterra": {
    slug: "connecterra",
    title: "Ida: AI-Powered Agricultural Intelligence",
    subtitle: "Revolutionizing Dairy Farming with Predictive Insights",
    category: "AI & Data",
    client: "Connecterra",
    duration: "24 Months",
    description:
      "Limeup partnered with Connecterra to develop 'Ida', building a highly scalable cloud infrastructure and mobile platform that processes sensor data to provide predictive health alerts for livestock.",
    heroImage: "/assets/connecterra.png",
    overview:
      "Agriculture is undergoing a digital revolution. Connecterra aimed to empower farmers with 'Ida'—an AI companion that turns sensor data into actionable insights to increase yield and improve animal welfare.",
    challenge:
      "Processing massive streams of real-time sensor data from thousands of farms and converting irregular biological patterns into 95%+ accurate health and fertility predictions.",
    solution:
      "A multi-platform ecosystem powered by a robust microservices backend. We utilized machine learning to identify behavioral anomalies and delivered those insights through an intuitive mobile-first experience.",
    galleryImages: [
      "/assets/connecterra-app.png",
      "/assets/connecterra-insights.png",
    ],
    features: [
      "Automated heat detection alerts",
      "Health and welfare monitoring",
      "Herd behavior analysis",
      "Milk yield prediction engine",
      "Bluetooth sensor integration",
      "Multi-farm management dashboard",
      "Localized climate adaptation",
      "Predictive veterinary scheduling",
    ],
    metrics: [
      {
        label: "Milk Yield",
        value: "10% Increase",
      },
      {
        label: "Antibiotic Use",
        value: "30% Decrease",
      },
      {
        label: "Accuracy Rate",
        value: "96%",
      },
      {
        label: "Global Deployment",
        value: "15+ Countries",
      },
    ],
    results: [
      {
        stat: "24/7",
        title: "Autonomous Monitoring",
        description:
          "Eliminated the need for constant manual observation through automated alert systems.",
      },
      {
        stat: "15%",
        title: "ROI Increase",
        description:
          "Farmers saw an immediate return on investment through optimized breeding and health management.",
      },
      {
        stat: "1M+",
        title: "Cows Monitored",
        description:
          "Scaled the infrastructure to handle data from over a million active sensors globally.",
      },
    ],
    techStack: [
      "React Native",
      "Node.js",
      "TensorFlow",
      "Google Cloud",
      "BigQuery",
      "BLE",
      "Go",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Hardware Integration",
        description:
          "Bridging the gap between physical neck-sensors and cloud-based data ingestion.",
      },
      {
        label: "Phase 2",
        title: "ML Model Training",
        description:
          "Aggregating historical farm data to train the predictive AI behavior clusters.",
      },
      {
        label: "Phase 3",
        title: "Mobile App Development",
        description:
          "Craftive a rugged, accessible UX for farmers working in demanding field environments.",
      },
      {
        label: "Phase 4",
        title: "Cloud Scalability",
        description:
          "Optimizing the backend to handle global traffic spikes and automated data cleaning.",
      },
    ],
    faqs: [
      {
        question: "What hardware sensors are required?",
        answer:
          "The platform integrates with proprietary wearable neck tags that track movement and rumination.",
      },
      {
        question: "How does the AI detect illness?",
        answer:
          "It identifies subtle deviations in activity that precede clinical symptoms of illness.",
      },
      {
        question: "Is it compatible with multiple cow breeds?",
        answer:
          "Yes, the AI models were trained on global datasets to account for breed and climate variations.",
      },
      {
        question: "Can farmers access data in low-signal areas?",
        answer:
          "The mobile app features local caching to ensure data is accessible even in remote farm locations.",
      },
      {
        question: "How accurate is the heat detection?",
        answer:
          "The heat detection system maintains a verified accuracy of over 95% in real-world conditions.",
      },
    ],
  },
  "raccoon-recovery": {
    slug: "raccoon-recovery",
    title: "Digital Physical Therapy Platform",
    subtitle: "Gamified Post-Operative Recovery with Motion Tracking",
    category: "Healthcare",
    client: "Raccoon Recovery",
    duration: "12 Months",
    description:
      "Limeup built a groundbreaking telerehabilitation platform that combines physical sensors with a gamified digital experience to accelerate patient recovery after orthopedic surgeries.",
    heroImage: "/assets/raccoon-recovery.png",
    overview:
      "Patient adherence to at-home physical therapy is notoriously low. Raccoon Recovery transforms boring exercises into an engaging game that tracks every movement with medical-grade precision.",
    challenge:
      "Mapping subtle physical movements from wearable sensors to digital actions in real-time with zero latency, while providing clinically valid data to medical professionals.",
    solution:
      "We developed a cross-platform application that uses Unity and React to create a gamified recovery environment. A secure healthcare portal allows therapists to remotely adjust programs based on motion data.",
    galleryImages: [
      "/assets/raccoon-patient-ui.png",
      "/assets/raccoon-therapist-portal.png",
    ],
    features: [
      "Real-time motion tracking",
      "Gamified exercise protocols",
      "Clinical progress reports",
      "Remote treatment adjustment",
      "Video consultation module",
      "Patient compliance tracking",
      "Wearable sensor sync",
      "Personalized rehab pathways",
    ],
    metrics: [
      {
        label: "Recovery Speed",
        value: "50% Faster",
      },
      {
        label: "Patient Adherence",
        value: "90%",
      },
      {
        label: "Active Patients",
        value: "12,000+",
      },
      {
        label: "CSAT Score",
        value: "4.8/5",
      },
    ],
    results: [
      {
        stat: "60%",
        title: "Clinic Time Saved",
        description:
          "Reduced the frequency of in-person visits required by providing high-fidelity remote data.",
      },
      {
        stat: "HIPAA",
        title: "Fully Compliant",
        description:
          "Architected a zero-trust security model ensuring absolute patient data privacy.",
      },
      {
        stat: "100%",
        title: "Data Precision",
        description:
          "Achieved sub-millimeter tracking accuracy for joint angle and range of motion.",
      },
    ],
    techStack: [
      "React",
      "Unity",
      "C#",
      "Node.js",
      "MongoDB",
      "Azure",
      "Bluetooth SDK",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Medical Validation",
        description:
          "Working with orthopedic surgeons to define accurate range-of-motion benchmarks.",
      },
      {
        label: "Phase 2",
        title: "Game Engine Build",
        description:
          "Developing the physics-based exercise games that respond to sensor input.",
      },
      {
        label: "Phase 3",
        title: "Therapist Dashboard",
        description:
          "Building the clinical visualization tools for data monitoring and analysis.",
      },
      {
        label: "Phase 4",
        title: "Pilot Launch",
        description:
          "Deployment in selected rehabilitation clinics to gather real-world patient feedback.",
      },
    ],
    faqs: [
      {
        question: "Does it replace an actual therapist?",
        answer:
          "No, it acts as a digital bridge between clinical visits, helping therapists monitor home progress.",
      },
      {
        question: "What sensors are needed?",
        answer:
          "The platform uses lightweight, wearable IMU sensors provided by Raccoon Recovery.",
      },
      {
        question: "How is patient privacy handled?",
        answer:
          "We use hospital-grade encryption and satisfy all HIPAA and GDPR health data requirements.",
      },
      {
        question: "Can it be used for any injury?",
        answer:
          "It is currently optimized for knee, hip, and shoulder recovery post-surgery.",
      },
      {
        question: "Does it work on mobile devices?",
        answer:
          "Yes, the ecosystem supports iOS, Android, and web-based therapist portals.",
      },
    ],
  },
  "apotka-pharmacy": {
    slug: "apotka-pharmacy",
    title: "Enterprise Healthcare Retail Ecosystem",
    subtitle: "Digital Transformation for a Major Pharmacy Network",
    category: "Web Development",
    client: "Apotka",
    duration: "10 Months",
    description:
      "Limeup executed a complete digital overhaul of a major pharmacy chain's e-commerce presence, integrating complex inventory systems and prescription management across 450+ physical stores.",
    heroImage: "/assets/apotka-pharmacy.png",
    overview:
      "Transitioning a traditional pharmacy network to a digital leader. The goal was to create a seamless omnichannel experience where patients could easily find and order medications with professional guidance.",
    challenge:
      "Managing a catalogue of 50,000+ SKUs with strict regulatory requirements, real-time local store stock levels, and a complex prescription-verified checkout process.",
    solution:
      "A high-performance Next.js frontend integrated with an ElasticSearch-powered search engine and a custom GraphQL layer that bridges multiple legacy ERP and logistics systems.",
    galleryImages: [
      "/assets/apotka-storefront.png",
      "/assets/apotka-checkout.png",
    ],
    features: [
      "Intelligent medicine search",
      "E-prescription upload & verify",
      "Omnichannel loyalty program",
      "Real-time store stock locator",
      "Automated medication reminders",
      "Pharmacist chat integration",
      "B2B hospital supply portal",
      "Click & Collect logistics",
    ],
    metrics: [
      {
        label: "Online Sales",
        value: "200% Growth",
      },
      {
        label: "Monthly Users",
        value: "1M+",
      },
      {
        label: "Load Time",
        value: "<1.2s",
      },
      {
        label: "Store Sync",
        value: "<60s",
      },
    ],
    results: [
      {
        stat: "450+",
        title: "Stores Integrated",
        description:
          "Successfully unified the inventory of every physical location into a single digital platform.",
      },
      {
        stat: "35%",
        title: "Basket Value",
        description:
          "Increased average order value through intelligent AI-driven product recommendations.",
      },
      {
        stat: "92%",
        title: "Mobile Traffic",
        description:
          "The mobile-first design led to a massive shift in how customers interact with the brand.",
      },
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "GraphQL",
      "NestJS",
      "ElasticSearch",
      "Docker",
      "Kubernetes",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "System Mapping",
        description:
          "Analyzing legacy ERP systems and planning the data migration strategy.",
      },
      {
        label: "Phase 2",
        title: "Core Platform Build",
        description:
          "Development of the high-speed catalog engine and checkout infrastructure.",
      },
      {
        label: "Phase 3",
        title: "Third-Party Integrations",
        description:
          "Connecting payment gateways, loyalty providers, and e-prescription databases.",
      },
      {
        label: "Phase 4",
        title: "Performance Tuning",
        description:
          "Optimizing for peak traffic loads and implementing global edge caching.",
      },
    ],
    faqs: [
      {
        question: "Is prescription data handled securely?",
        answer:
          "Absolutely, we use multi-layered encryption and meet all local health regulatory standards.",
      },
      {
        question: "Can customers return orders at physical stores?",
        answer:
          "Yes, the system enables 'Buy Online, Return In-Store' (BORIS) workflows via unified data.",
      },
      {
        question: "How accurate is the 'In Stock' indicators?",
        answer:
          "Our system syncs with the central ERP every 60 seconds to ensure near-live accuracy.",
      },
      {
        question: "Is there a B2B hospital portal?",
        answer:
          "Yes, a separate interface was developed specifically for bulk procurement and institutional billing.",
      },
      {
        question: "How fast is same-day delivery?",
        answer:
          "Orders are algorithmically routed to the nearest store to enable delivery within 2-4 hours.",
      },
    ],
  },
  "costa-express": {
slug: "costa-express",
title: "Costa Express",
subtitle: "Agile Development for the World’s Leading Coffee Brand",
category: "IoT & Automation",
client: "Costa Coffee",
duration: "Ongoing Partnership",
description: "One Beyond provides dedicated Continuous Development Teams to fuel Costa Express’s rapid innovation cycle for their global network of 13,000+ self-service coffee bars.",
heroImage: "/assets/costa-express.png",
overview: "Costa Express needed to scale their digital infrastructure and kiosk software but faced challenges in recruiting high-level tech talent to match their growth. One Beyond stepped in to provide a Continuous Development Team model, ensuring a constant flow of innovation and technical excellence.",
challenge: "The primary challenge was the speed of recruitment versus the speed of business growth. Costa needed to modernize their legacy kiosk systems, integrate real-time IoT monitoring, and expand their cloud footprint while maintaining 100% system reliability for customers worldwide.",
solution: "We established a multi-disciplinary augmented team of senior engineers who integrated directly into Costa's internal processes. This team focused on re-architecting the kiosk software, enhancing the IoT data pipeline, and building robust API layers for remote diagnostics and stock management.",
galleryImages: [
"/assets/costa-express-gallery-1.png",
"/assets/costa-express-gallery-2.png",
],
features: [
"Real-time IoT Telemetry Tracking",
"Predictive Maintenance Algorithms",
"Automated Inventory Management",
"Global Cloud Sync Architecture",
"Secure Payment Gateway Integration",
"Remote Diagnostic Dashboard",
"Multi-language Deployment Engine",
"Onyx Operating System Optimization",
],
metrics: [
{
label: "Global Units",
value: "13,000+",
},
{
label: "Dev Velocity",
value: "+45%",
},
{
label: "System Uptime",
value: "99.98%",
},
{
label: "Scale Capacity",
value: "10x",
},
],
results: [
{
stat: "40%",
title: "Increased Throughput",
description: "Successfully accelerated the deployment of new software features across the entire global estate.",
},
{
stat: "£250k",
title: "Recruitment Savings",
description: "Significant reduction in overhead costs by utilizing One Beyond’s flexible team augmentation model.",
},
{
stat: "Intelligent",
title: "Stock Control",
description: "Reduced waste and stock-outs via automated real-time monitoring and reporting systems.",
},
],
techStack: [
".NET 8",
"Azure IoT Hub",
"React",
"TypeScript",
"Docker",
"Redis",
"Azure Cosmos DB",
],
timeline: [
{
label: "Phase 1",
title: "Discovery & Integration",
description: "Deep dive into existing kiosk architecture and alignment with Costa's internal development standards.",
},
{
label: "Phase 2",
title: "Cloud Infrastructure Setup",
description: "establishing a secure, scalable Azure environment capable of handling millions of daily IoT events.",
},
{
label: "Phase 3",
title: "Feature Sprints",
description: "Iterative development cycles focusing on payment security, remote diagnostics, and UI/UX enhancements.",
},
{
label: "Phase 4",
title: "Global Rollout",
description: "Over-the-air (OTA) deployment of new software components to the global coffee bar network.",
},
],
faqs: [
{
question: "How did the teams collaborate?",
answer: "The teams worked as a single unit using Agile methodologies, participating in joint sprints and daily standups.",
},
{
question: "What was the biggest technical hurdle?",
answer: "Ensuring synchronization across thousands of kiosks with varying connectivity strengths in different global regions.",
},
{
question: "Was recruitment speed improved?",
answer: "Yes, One Beyond provided senior engineers within weeks, compared to the months-long traditional hiring cycle.",
},
{
question: "How is security handled?",
answer: "All systems use enterprise-grade encryption and comply with global payment security standards (PCI-DSS).",
},
{
question: "Is the partnership ongoing?",
answer: "Yes, we continue to provide support and new feature development as Costa expands into new markets.",
},
],
},
"smith-nephew": {
slug: "smith-nephew",
title: "Smith+Nephew",
subtitle: "Digital Healthcare & Surgical Data Visualization",
category: "AI & Data",
client: "Smith & Nephew PLC",
duration: "12 Months",
description: "A complex surgical procedural data dashboard designed to provide clinical staff and administrators with deep insights into hospital workspace performance.",
heroImage: "/assets/smith-nephew.png",
overview: "Smith+Nephew needed a way to translate massive amounts of surgical procedural data into actionable insights. One Beyond built an intuitive dashboard system that helps healthcare providers optimize surgical outcomes and improve operational efficiencies across hospitals.",
challenge: "The complexity lay in the fragmentation of surgical data. The client required a system that could aggregate multi-source data, maintain strict HIPAA compliance, and present high-level KPIs in a format that surgeons could interpret instantly in high-pressure environments.",
solution: "We developed a suite of high-performance analytics dashboards using .NET and Power BI embedded, featuring advanced data anonymization and real-time processing capabilities for surgical procedural tracking and cost-analysis.",
galleryImages: [
"/assets/smith-nephew-gallery-1.png",
"/assets/smith-nephew-gallery-2.png",
],
features: [
"Surgical KPI Tracking",
"Clinical Outcome Analytics",
"Advanced Data Anonymization",
"Multi-hospital Data Sync",
"Regulatory Compliance Filter",
"Dynamic Reporting Engine",
"Role-based Access Control",
"Mobile Responsive View",
],
metrics: [
{
label: "Data Points",
value: "50M+",
},
{
label: "Load Time",
value: "<2s",
},
{
label: "Compliance",
value: "SOC2/GDPR",
},
{
label: "ROI Period",
value: "18 Mo",
},
],
results: [
{
stat: "30%",
title: "Clinical Efficiency",
description: "Significant improvements in procedural planning through better data visualization.",
},
{
stat: "Real-time",
title: "Cost Insights",
description: "Administrators now have instant access to cost-per-procedure metrics for budgeting.",
},
{
stat: "Grant",
title: "Innovation Funding",
description: "The project's success helped secure additional government R&D grants for digital healthcare.",
},
],
techStack: [
"Power BI",
".NET Core",
"Azure SQL",
"React",
"Azure Data Factory",
"TypeScript",
"D3.js",
],
timeline: [
{
label: "Phase 1",
title: "Regulatory Audit",
description: "Comprehensive review of medical data security requirements and privacy lockdowns.",
},
{
label: "Phase 2",
title: "Data Architecture",
description: "Building the backend ETL processes to clean and aggregate hospital data streams.",
},
{
label: "Phase 3",
title: "UI/UX Modeling",
description: "Collaborating with clinicians to design intuitive, high-contrast dashboards for fast interpretation.",
},
{
label: "Phase 4",
title: "Production Launch",
description: "Deployment to the global cloud infrastructure with multi-hospital pilot testing.",
},
],
faqs: [
{
question: "Is the data HIPAA compliant?",
answer: "Yes, the system employs military-grade encryption and strict anonymization protocols.",
},
{
question: "Can it handle real-time data?",
answer: "The platform supports near real-time updates for active surgical procedural tracking.",
},
{
question: "Who are the primary users?",
answer: "Hospital administrators, unit managers, and specialized surgical teams.",
},
{
question: "Does it integrate with EMRs?",
answer: "It features a flexible API layer designed to securely interface with major electronic medical record systems.",
},
{
question: "How scalable is the system?",
answer: "The Azure-based architecture allows for the addition of hundreds of new hospital sites with minimal latency.",
},
],
},
"infinitas-learning": {
slug: "infinitas-learning",
title: "Infinitas Learning",
subtitle: "Massive Team Augmentation for EdTech Transformation",
category: "Web Development",
client: "Infinitas Learning",
duration: "18 Months",
description: "One Beyond helped Infinitas Learning transform the landscape of education by launching three landmark digital projects simultaneously through large-scale team augmentation.",
heroImage: "/assets/infinitas-learning.png",
overview: "Infinitas Learning needed to launch a central Learning Management System, a new E-commerce engine, and an integrated payments platform all at once. One Beyond scaled a team of 40+ engineers to meet this critical academic deadline.",
challenge: "The challenge was the scale and the deadline. Infinitas needed to migrate decades of legacy learning content while building a modern, cloud-native ecosystem that could support over 500,000 concurrent students and educators across multiple countries.",
solution: "We deployed a dedicated team of engineers, testers, and architects who worked as 'one team' with Infinitas. We utilized a microservices architecture to build a scalable LMS and integrated a high-performance e-commerce engine with multi-currency payment support.",
galleryImages: [
"/assets/infinitas-gallery-1.png",
"/assets/infinitas-gallery-2.png",
],
features: [
"Enterprise Learning Management (LMS)",
"Omni-channel E-commerce",
"Integrated Multi-currency Payments",
"Student Progress Analytics",
"Classroom Management Tools",
"Content Authoring Pipeline",
"Legacy Data Migration Engine",
"Single Sign-On (SSO)",
],
metrics: [
{
label: "Student Users",
value: "500k+",
},
{
label: "Team Size",
value: "40+ Eng.",
},
{
label: "Uptime",
value: "99.95%",
},
{
label: "Platform Count",
value: "3 Major",
},
],
results: [
{
stat: "100%",
title: "On-time Delivery",
description: "All platforms were live and tested ahead of the new academic year start date.",
},
{
stat: "Unified",
title: "Data Ecosystem",
description: "Created a single source of truth for student data and content across three countries.",
},
{
stat: "Scalable",
title: "Revenue Engine",
description: "The new E-commerce platform dramatically improved the digital sales conversion rate.",
},
],
techStack: [
".NET Core 8",
"React",
"TypeScript",
"Kubernetes",
"Stripe API",
"ElasticSearch",
"Azure DevOps",
],
timeline: [
{
label: "Phase 1",
title: "Strategic Scaling",
description: "Rapid onboarding of 40+ engineers to create a cohesive delivery engine.",
},
{
label: "Phase 2",
title: "Architecture Design",
description: "Designing a microservices-based API layer to connect the LMS and Commerce platforms.",
},
{
label: "Phase 3",
title: "Parallel Sprints",
description: "Concurrent development of the primary learning tools and the payment gateway.",
},
{
label: "Phase 4",
title: "Academic Go-Live",
description: "Stress testing and final deployment before the high-traffic back-to-school period.",
},
],
faqs: [
{
question: "How was such a large team managed?",
answer: "Using a Pod-based structure where small, cross-functional teams focused on specific value streams.",
},
{
question: "What happened to the legacy data?",
answer: "We built custom migration scripts that successfully transitioned over 15 years of learning content.",
},
{
question: "Can it handle 500k students?",
answer: "Yes, the Kubernetes-based infrastructure auto-scales during peak exam and enrollment periods.",
},
{
question: "Is the system multi-lingual?",
answer: "Absolutely, it supports multiple European languages and localized curricula.",
},
{
question: "How are payments secured?",
answer: "Through fully integrated Stripe and specialized European payment providers (Adyen).",
},
],
},
"fine-rare": {
slug: "fine-rare",
title: "Fine+Rare",
subtitle: "Luxury E-commerce Platform for Rare Wine & Spirits",
category: "Web Development",
client: "Fine+Rare Wines Ltd",
duration: "14 Months",
description: "Modernization of a legacy platform for a specialist luxury retailer, enabling massive scalability and a premium user experience for high-net-worth collectors.",
heroImage: "/assets/fine-rare.png",
overview: "Fine+Rare needed to replace an aging, restrictive tech stack to unlock their growth potential. One Beyond delivered a brand-new, high-performance platform that resulted in an online sales increase of over 400%.",
challenge: "The primary challenge was modernizing a complex business logic layer that handles high-value transactions, auctions, and global logistics for rare assets. The old system was slow, difficult to update, and couldn't support modern SEO or mobile experiences.",
solution: "We designed a bespoke headless e-commerce architecture using Node.js and React. The solution included a high-speed search engine, real-time inventory synchronization with global warehouses, and a personalized member portal for collectors.",
galleryImages: [
"/assets/fine-rare-gallery-1.png",
"/assets/fine-rare-gallery-2.png",
],
features: [
"Headless E-commerce Engine",
"Real-time Inventory Sync",
"Personalized Member Portal",
"Advanced ElasticSearch",
"Auction Management System",
"Secure Payment Vault",
"Logistics & CRM Integration",
"Optimized SEO Architecture",
],
metrics: [
{
label: "Growth",
value: "403%",
},
{
label: "Conversions",
value: "+65%",
},
{
label: "Page Load",
value: "-1.2s",
},
{
label: "Mobile Traffic",
value: "+80%",
},
],
results: [
{
stat: "400%+",
title: "Revenue Increase",
description: "Direct online growth result within months of the new platform launch.",
},
{
stat: "Premium",
title: "User Experience",
description: "Enhanced brand perception through a luxury-focused, high-performance UI.",
},
{
stat: "Scalable",
title: "Tech Stack",
description: "Reduced technical debt and enabled the internal marketing team to execute campaigns faster.",
},
],
techStack: [
"Node.js",
"React",
"Next.js",
"AWS",
"PostgreSQL",
"Redis",
"ElasticSearch",
],
timeline: [
{
label: "Phase 1",
title: "Brand Strategy",
description: "Defining the premium digital experience and luxury visual language.",
},
{
label: "Phase 2",
title: "Core Development",
description: "Building the bespoke e-commerce engine and inventory logic.",
},
{
label: "Phase 3",
title: "Search & UI",
description: "Implementing high-speed ElasticSearch and the responsive frontend portals.",
},
{
label: "Phase 4",
title: "Migration & Launch",
description: "Securely transferring high-value customer records and opening the new storefront.",
},
],
faqs: [
{
question: "Is it integrated with logistics?",
answer: "Yes, it is fully synced with worldwide bonded warehouses for real-time availability.",
},
{
question: "Does it support auctions?",
answer: "Yes, we built custom auction modules for live and timed bidding on rare spirits.",
},
{
question: "What tech stack was used?",
answer: "A modern headless stack using Node.js, React, and AWS for maximum scalability.",
},
{
question: "How did it impact SEO?",
answer: "Search rankings improved significantly due to the high-speed Next.js architecture.",
},
{
question: "Who manages the platform now?",
answer: "The platform was built for easy maintenance by its internal team with ongoing One Beyond support.",
},
],
},
"david-lloyd-leisure": {
slug: "david-lloyd-leisure",
title: "David Lloyd Leisure Mobile App",
subtitle: "Transforming the fitness experience for over 600,000 members.",
category: "Mobile Development",
client: "David Lloyd Leisure",
duration: "12 Months",
description: "Softwire partnered with David Lloyd to rebuild their mobile presence from the ground up, focusing on booking efficiency and high-performance member engagement across their European clubs.",
heroImage: "/assets/david-lloyd-leisure.png",
overview: "David Lloyd required a unified, high-performance mobile application to replace a fragmented legacy system. The goal was to provide a seamless booking experience for gym slots, classes, and courts, while integrating loyalty features and personalized workout tracking.",
challenge: "The existing legacy infrastructure struggled with peak-time traffic spikes during class release windows, leading to frequent app crashes and member frustration. Additionally, the UI felt outdated compared to premium boutique fitness offerings.",
solution: "We implemented a scalable React Native application backed by a Node.js microservices architecture on AWS. By utilizing GraphQL, we optimized data fetching, ensuring the UI remains responsive even under heavy load during 'booking rushes'.",
galleryImages: [
"/assets/dl-app-interface.png",
"/assets/dl-class-booking.png",
],
features: [
"One-tap class and court booking system",
"Real-time gym capacity monitoring",
"Personalized workout recommendations",
"Integrated loyalty and rewards hub",
"In-app QR code for contactless club entry",
"Seamless Apple Health and Google Fit sync",
"Push notification engine for class reminders",
"Secure guest pass management",
],
metrics: [
{
label: "App Store Rating",
value: "4.8/5",
},
{
label: "Member Adoption",
value: "85%",
},
{
label: "Booking Speed",
value: "50% faster",
},
{
label: "Monthly Sessions",
value: "2M+",
},
],
results: [
{
stat: "99.99%",
title: "Uptime During Peak",
description: "Successfully handled 100x traffic spikes during weekly class releases.",
},
{
stat: "220k",
title: "Active Daily Users",
description: "Significant increase in daily digital interaction compared to the previous app.",
},
{
stat: "£1.2M",
title: "Operational Savings",
description: "Reduced pressure on club reception staff via automated self-service tools.",
}
],
techStack: [
"React Native",
"Node.js",
"AWS Lambda",
"GraphQL",
"Terraform",
"PostgreSQL",
"Redis",
],
timeline: [
{
label: "Phase 1",
title: "Strategic Discovery",
description: "Comprehensive member journey mapping and legacy system audit.",
},
{
label: "Phase 2",
title: "Architecture Design",
description: "Designing a high-availability cloud infrastructure and API layer.",
},
{
label: "Phase 3",
title: "Agile Development",
description: "Sprints focused on core booking engines and UI/UX refinement.",
},
{
label: "Phase 4",
title: "Beta & Launch",
description: "Club-by-club rollout and final performance optimization.",
},
],
faqs: [
{
question: "How did you handle the booking spikes?",
answer: "We utilized AWS serverless technologies and Redis caching to ensure consistent performance during high-demand windows.",
},
{
question: "Is the app available in multiple languages?",
answer: "Yes, we implemented a robust localization framework supporting English, French, and Spanish markets.",
},
{
question: "Did you integrate with on-site club hardware?",
answer: "Yes, the app integrates with club turnstiles via encrypted QR codes generated in real-time.",
},
{
question: "How was member data secured?",
answer: "We implemented enterprise-grade OAuth2 and AES-256 encryption for all PII and payment data.",
},
{
question: "Can members track their progress visually?",
answer: "The app features interactive charts using D3 to visualize workout consistency and health metrics.",
},
],
},
"rspb-digital-transformation": {
slug: "rspb-digital-transformation",
title: "RSPB Nature on Your Doorstep",
subtitle: "Engaging a new generation of conservationists via digital innovation.",
category: "Web Development",
client: "RSPB",
duration: "18 Months",
description: "Softwire lead a large-scale digital transformation to modernize the RSPB’s online presence, creating an interactive platform to encourage biodiversity in UK gardens.",
heroImage: "/assets/rspb-digital-transformation.png",
overview: "The RSPB needed to move beyond traditional donor management into a mission-driven digital platform. 'Nature on Your Doorstep' was designed to provide personalized, localized advice to millions of UK citizens.",
challenge: "The organization had multiple siloed databases and an aging CMS that made personalization impossible and data management inefficient.",
solution: "We built a centralized data platform and a modern web experience using Python/Django and React. The system utilizes geolocation to provide weather-dependent gardening tips tailored to the user's specific region.",
galleryImages: [
"/assets/rspb-dashboard.png",
"/assets/rspb-activity-tracker.png",
],
features: [
"Localized biodiversity activity engine",
"Personalized impact dashboard for members",
"Interactive wildlife tracking tools",
"Centralized CRM and data lake integration",
"Automated outreach and email campaigns",
"Mobile-first responsive design",
"Secure donation and subscription portal",
"User-generated content hub for nature photos",
],
metrics: [
{
label: "User Signups",
value: "1M+",
},
{
label: "Engagement",
value: "+40%",
},
{
label: "Activity Completion",
value: "150k+",
},
{
label: "Platform Uptime",
value: "99.9%",
},
],
results: [
{
stat: "2.5M",
title: "Unique Page Views",
description: "Massive reach for the seasonal 'Big Garden Birdwatch' campaigns.",
},
{
stat: "65%",
title: "Donor Retention",
description: "Improved retention through personalized digital storytelling.",
},
{
stat: "£800k",
title: "Cost Reduction",
description: "Savings achieved through cloud migration and automated data processing.",
}
],
techStack: [
"Python",
"Django",
"React",
"AWS",
"PostgreSQL",
"Elasticsearch",
"Docker",
],
timeline: [
{
label: "Phase 1",
title: "Data Audit",
description: "Identifying and consolidating fragmented member data sources.",
},
{
label: "Phase 2",
title: "Platform MVP",
description: "Building the core advocacy engine and personalized activity algorithm.",
},
{
label: "Phase 3",
title: "Scaling & CRM",
description: "Integrating the web platform with the central RSPB CRM system.",
},
{
label: "Phase 4",
title: "Nationwide Launch",
description: "Rolling out the platform ahead of peak spring conservation season.",
},
],
faqs: [
{
question: "How does the localization work?",
answer: "The platform uses IP-based geolocation and postcode lookup to fetch local environmental data.",
},
{
question: "Is the platform accessible to all users?",
answer: "Absolutely, it was built to meet WCAG 2.1 AA standards for maximum inclusion.",
},
{
question: "Can users upload their own data?",
answer: "Yes, members can record sightings and activity completion which contributes to national research.",
},
{
question: "How is donor privacy handled?",
answer: "All data is managed in accordance with GDPR and Cyber Essentials Plus certifications.",
},
{
question: "Is the tech stack scalable for TV campaigns?",
answer: "Yes, the AWS infrastructure auto-scales to handle massive spikes during live broadcasts.",
},
],
},
"bbc-academy-platform": {
slug: "bbc-academy-platform",
title: "BBC Academy Learning Platform",
subtitle: "A professional educational ecosystem for global content creators.",
category: "Web Development",
client: "BBC",
duration: "10 Months",
description: "Softwire engineered a scalable, highly accessible learning management system to host the BBC's internal and partner training content across video, text, and interactive assessments.",
heroImage: "/assets/bbc-academy-platform.png",
overview: "The BBC Academy required a modern digital hub to deliver training to staff and external partners. The platform needed to be robust enough to serve thousands of concurrent users while maintaining strict accessibility standards.",
challenge: "The previous system was difficult to navigate on mobile devices and struggled with high-bitrate video delivery across disparate global networks.",
solution: "We developed a serverless architecture using AWS and a React-based frontend. We leveraged AWS CloudFront and Elemental MediaConvert to ensure smooth video delivery regardless of user location or bandwidth.",
galleryImages: [
"/assets/bbc-learning-portal.png",
"/assets/bbc-video-player.png",
],
features: [
"Adaptive bitrate video streaming",
"Interactive quiz and assessment engine",
"SCORM and xAPI content compatibility",
"Multilingual support for global partners",
"Detailed learning analytics for management",
"Fully WCAG 2.2 compliant interface",
"Offline-first mobile learning capabilities",
"Social learning and discussion forums",
],
metrics: [
{
label: "Active Learners",
value: "50k+",
},
{
label: "Courses Hosted",
value: "200+",
},
{
label: "Load Times",
value: "30% faster",
},
{
label: "Accessibility",
value: "100%",
},
],
results: [
{
stat: "15k",
title: "Monthly Certifications",
description: "Significant throughput of staff completing regulated training.",
},
{
stat: "78%",
title: "Mobile Engagement",
description: "Drastic increase in training completed on mobile devices via the new UI.",
},
{
stat: "Zero",
title: "Downtime Incidents",
description: "Maintained perfect availability since the migration to serverless.",
}
],
techStack: [
"React",
"Java",
"Spring Boot",
"AWS Lambda",
"Elemental Media",
"CloudFront",
"S3",
],
timeline: [
{
label: "Phase 1",
title: "User Research",
description: "In-depth workshops with BBC trainers and global staff members.",
},
{
label: "Phase 2",
title: "UI Implementation",
description: "Developing an accessible, high-performance frontend components library.",
},
{
label: "Phase 3",
title: "Media Backend",
description: "Engineering the video transcoding and delivery pipeline on AWS.",
},
{
label: "Phase 4",
title: "Content Migration",
description: "Migrating over 10 years of training content into the new system.",
},
],
faqs: [
{
question: "How do you handle high-definition video?",
answer: "We use AWS Elemental to transcode video into multiple formats, serving the best one for the user's connection.",
},
{
question: "Is the platform accessible to screen readers?",
answer: "Yes, the entire platform is optimized for AT users and adheres to triple-A accessibility standards where possible.",
},
{
question: "Can external partners access the training?",
answer: "Yes, we implemented a tiered authentication system for internal and external users.",
},
{
question: "How is progress tracked?",
answer: "We use a custom xAPI implementation to track granular learning actions across the site.",
},
{
question: "Does it support live webinars?",
answer: "The platform integrates with major live-streaming tools for real-time educational events.",
},
],
},
"moj-claims-digitisation": {
slug: "moj-claims-digitisation",
title: "Ministry of Justice Claims Portal",
subtitle: "Digitising the UK justice system for efficient, secure public service.",
category: "Cloud & DevOps",
client: "Ministry of Justice",
duration: "24 Months",
description: "Softwire spearheaded the digital transformation of a critical legal claims portal, replacing legacy paper processes with a secure, user-centric cloud platform.",
heroImage: "/assets/moj-claims-digitisation.png",
overview: "The Ministry of Justice (MoJ) sought to modernize the way legal claims are submitted and processed. The goal was to reduce administrative overhead and increase transparency for both citizens and legal professionals.",
challenge: "The system required extreme security due to the sensitive nature of legal data, along with strict adherence to GDS (Government Digital Service) standards.",
solution: "We deployed a Ruby on Rails application using a robust microservices architecture. By implementing Infrastructure as Code (IaC) with Terraform, we created a repeatable, highly secure environment across several AWS regions.",
galleryImages: [
"/assets/moj-portal-ui.png",
"/assets/moj-data-security.png",
],
features: [
"GDS-compliant web interface",
"Secure document upload and encryption",
"Real-time case status tracking",
"Automated legal rule-engine validation",
"Multi-factor authentication for legal pros",
"Integrated digital signature support",
"Comprehensive audit logging and reporting",
"High-availability multi-region active/active setup",
],
metrics: [
{
label: "Cases Processed",
value: "200k+",
},
{
label: "Processing Speed",
value: "60% faster",
},
{
label: "Admin Savings",
value: "£10M+",
},
{
label: "Security Level",
value: "Highest",
},
],
results: [
{
stat: "4.5/5",
title: "Citizen Feedback Score",
description: "Record-high satisfaction ratings for a UK government digital service.",
},
{
stat: "£3.5M",
title: "Annual Cloud Tech Savings",
description: "Significant reduction in infrastructure costs via optimized cloud usage.",
},
{
stat: "90%",
title: "Reduced Error Rate",
description: "Validation engines significantly reduced the number of invalid claim submissions.",
}
],
techStack: [
"Ruby on Rails",
"Terraform",
"AWS",
"Docker",
"Kubernetes",
"Redis",
"Sidekiq",
],
timeline: [
{
label: "Phase 1",
title: "Alpha Phase",
description: "Prototyping and testing core concepts with real users and legal experts.",
},
{
label: "Phase 2",
title: "Beta Development",
description: "Building the full claims engine and implementing Gov.UK Design System.",
},
{
label: "Phase 3",
title: "Security Hardening",
description: "Rigorous penetration testing and compliance auditing for legal data.",
},
{
label: "Phase 4",
title: "National Launch",
description: "Successfully transitioning all live claims to the new digital platform.",
},
],
faqs: [
{
question: "How is the sensitive legal data secured?",
answer: "We use field-level encryption and strict IAM policies combined with continuous automated scanning.",
},
{
question: "Does it follow GDS design standards?",
answer: "Yes, every component is mapped directly to the Gov.UK design patterns for consistency.",
},
{
question: "How do legal pros verify their identity?",
answer: "The platform integrates with several identity providers including secure government gateways.",
},
{
question: "Can the system handle surges in litigation?",
answer: "The Kubernetes-based infrastructure scales automatically based on queue depth and CPU usage.",
},
{
question: "Is there an API for law firms?",
answer: "Yes, we provide a RESTful API with automated documentation for large-scale legal integrations.",
},
],
}
};

export function getProjectData(slug: string) {
  return projectsData[slug] ?? null;
}
