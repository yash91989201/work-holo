import {
  IconBrain,
  IconBrandReact,
  IconBuildingBank,
  IconCode,
  IconCloud,
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
  title: string;
}

export interface ProjectPageData {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  client: string;
  duration: string;
  description: string;
  heroImage: string;
  overview: string;
  challenge: string;
  solution: string;
  galleryImages: string[];
  features: string[];
  metrics: ProjectMetric[];
  results: ProjectResult[];
  techStack: string[];
  faqs: ProjectFAQ[];
}

export interface ProjectListItem {
  slug: string;
  title: string;
  category: string;
  description: string;
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
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
];

export function getProjectList(currentSlug?: string) {
  return projectList.map((p) => ({
    ...p,
    href: `/projects/${p.slug}`,
    isActive: p.slug === currentSlug,
    category: getProjectData(p.slug)?.category ?? "",
    description: getProjectData(p.slug)?.description ?? "",
  }));
}

const projectsData: Record<string, ProjectPageData> = {
  "health-track-pro": {
    slug: "health-track-pro",
    title: "HealthTrack Pro",
    subtitle: "Enterprise Health Monitoring Platform",
    category: "Mobile Development",
    client: "MedCore Solutions",
    duration: "6 months",
    description:
      "A HIPAA-compliant mobile platform enabling real-time health monitoring, wearable device integration, and AI-powered health insights for enterprise clients.",
    heroImage: "/images/projects/health-track-pro-hero.jpg",
    overview:
      "HealthTrack Pro is a comprehensive health monitoring platform designed for healthcare enterprises. It integrates with multiple wearable devices, provides real-time health metrics, and uses AI to detect anomalies before they become critical. The platform serves over 50,000 patients across 12 hospital networks.",
    challenge:
      "MedCore needed to consolidate fragmented health data from various wearables and hospital systems into a unified, secure platform. Compliance requirements, real-time data synchronization, and legacy system integration posed significant technical challenges.",
    solution:
      "Built a React Native cross-platform app with a robust Node.js backend. Implemented end-to-end encryption, OAuth 2.0 + SAML SSO for enterprise authentication, and a FHIR-compliant API layer for EHR integration. The AI engine processes 2M+ data points daily using TensorFlow Lite on-device inference.",
    galleryImages: [
      "/images/projects/health-track-pro-1.jpg",
      "/images/projects/health-track-pro-2.jpg",
    ],
    features: [
      "Real-time wearable integration (Apple Watch, Fitbit, Garmin)",
      "AI-powered anomaly detection with 94% accuracy",
      "FHIR-compliant EHR data synchronization",
      "HIPAA-compliant end-to-end encryption",
      "Customizable health dashboards for clinical staff",
      "Offline-first architecture with background sync",
      "Multi-language support (12 languages)",
      "Telehealth video integration",
    ],
    metrics: [
      { label: "Active Users", value: "50K+" },
      { label: "Data Points / Day", value: "2M+" },
      { label: "Uptime", value: "99.99%" },
      { label: "Anomaly Detection", value: "94%" },
    ],
    results: [
      {
        title: "30% Reduction in Hospital Readmissions",
        description:
          "Early anomaly detection enabled proactive interventions, reducing 30-day readmission rates by 30% across participating hospital networks.",
      },
      {
        title: "50% Faster Clinical Decision Making",
        description:
          "Unified dashboards gave clinicians instant access to patient history, reducing average diagnosis time from 45 minutes to 22 minutes.",
      },
      {
        title: "SOC 2 Type II & HIPAA Certified",
        description:
          "Achieved full compliance certification within 4 months, enabling enterprise sales in regulated healthcare markets.",
      },
    ],
    techStack: [
      "React Native",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "TensorFlow Lite",
      "FHIR R4 API",
      "AWS Lambda",
      "CloudFront",
    ],
    faqs: [
      {
        question: "How does the wearable device integration work?",
        answer:
          "Our platform uses Bluetooth Low Energy (BLE) to connect with compatible wearables. We support Apple HealthKit, Google Fit, and manufacturer-specific APIs, normalizing all data into our unified schema regardless of the source device.",
      },
      {
        question: "Is the platform HIPAA compliant?",
        answer:
          "Yes, HealthTrack Pro is fully HIPAA compliant. We implement end-to-end encryption, role-based access controls, audit logging, and regular third-party security audits. Our infrastructure is hosted on HIPAA-eligible AWS services.",
      },
      {
        question: "Can it integrate with our existing EHR system?",
        answer:
          "Absolutely. We built a FHIR R4-compliant API layer that integrates with Epic, Cerner, Allscripts, and other major EHR systems. Custom integration for legacy systems is also available through our professional services team.",
      },
      {
        question: "How does the AI anomaly detection work?",
        answer:
          "The AI engine uses a combination of rule-based thresholds and machine learning models trained on anonymized health data. It runs on-device using TensorFlow Lite for privacy, with cloud fallback for complex cases. Detection accuracy is 94% with a false positive rate under 2%.",
      },
      {
        question: "What is the typical deployment timeline?",
        answer:
          "A standard enterprise deployment takes 3-4 months. This includes sandbox environment setup, EHR integration, staff training, and phased rollout. We offer accelerated timelines for organizations with existing cloud infrastructure.",
      },
    ],
  },
  "finflow-dashboard": {
    slug: "finflow-dashboard",
    title: "FinFlow Dashboard",
    subtitle: "Next-Gen Financial Analytics Platform",
    category: "Web Development",
    client: "Global Banking Corp",
    duration: "8 months",
    description:
      "A high-performance financial analytics dashboard processing $2B+ in daily transactions, featuring real-time charts, risk scoring, and automated reporting for institutional traders.",
    heroImage: "/images/projects/finflow-dashboard-hero.jpg",
    overview:
      "FinFlow Dashboard replaces legacy Excel-based reporting with a real-time analytics platform. Built for high-frequency trading desks, it processes over $2 billion in daily transactions, delivers sub-100ms latency, and provides portfolio managers with instant visibility across global markets.",
    challenge:
      "Global Banking Corp relied on manual Excel reports updated nightly, causing traders to miss critical intraday movements. Legacy COBOL systems, fragmented data sources, and strict regulatory compliance requirements made modernization risky and complex.",
    solution:
      "Designed a modular React + WebSocket architecture that streams data from Kafka-backed microservices. Built custom D3.js visualizations optimized for 10,000+ data points. Implemented column-level encryption and zero-trust architecture for regulatory compliance, achieving sub-100ms end-to-end latency.",
    galleryImages: [
      "/images/projects/finflow-dashboard-1.jpg",
      "/images/projects/finflow-dashboard-2.jpg",
    ],
    features: [
      "Real-time data streaming via WebSocket (sub-100ms latency)",
      "Interactive D3.js charts with 10,000+ point rendering",
      "Custom risk scoring algorithms with explainable AI",
      "Multi-asset portfolio management (Equities, FX, Derivatives)",
      "Automated regulatory reporting (MiFID II, Dodd-Frank)",
      "Role-based dashboards for traders, PMs, and compliance",
      "Audit trail with full data lineage tracking",
      "Mobile-responsive companion app for iOS and Android",
    ],
    metrics: [
      { label: "Daily Volume", value: "$2B+" },
      { label: "Latency", value: "<100ms" },
      { label: "Data Points Live", value: "500K+" },
      { label: "Uptime", value: "99.95%" },
    ],
    results: [
      {
        title: "60% Faster Decision Making",
        description:
          "Real-time dashboards reduced the time from data availability to trading decision from 2 hours to 45 minutes on average.",
      },
      {
        title: "$15M Annual Cost Reduction",
        description:
          "Replaced manual processes and legacy infrastructure, delivering $15M in annual operational savings across the trading desk.",
      },
      {
        title: "MiFID II Compliance Achieved",
        description:
          "Automated reporting reduced compliance preparation time from 3 weeks to 2 days while achieving full regulatory alignment.",
      },
    ],
    techStack: [
      "React",
      "TypeScript",
      "D3.js",
      "Node.js",
      "Kafka",
      "TimescaleDB",
      "WebSocket",
      "Kubernetes",
    ],
    faqs: [
      {
        question: "How does the real-time data streaming work?",
        answer:
          "Data flows from source systems through Apache Kafka topics, processed by Node.js microservices, and pushed to the client via WebSocket connections. We use TimescaleDB for time-series storage with continuous aggregates for query performance.",
      },
      {
        question: "What is the data latency from source to dashboard?",
        answer:
          "End-to-end latency is under 100ms from the exchange feed to visible on the dashboard. This is achieved through optimized Kafka consumer groups, in-memory caching, and WebSocket push rather than polling.",
      },
      {
        question: "How does the risk scoring system work?",
        answer:
          "Our risk engine combines historical volatility models, sector correlation matrices, and real-time position Greeks. It's built on XGBoost with SHAP values for explainability, giving traders actionable insights with clear reasoning.",
      },
      {
        question: "Is the platform scalable for global deployments?",
        answer:
          "Yes, the architecture supports horizontal scaling. We deploy via Kubernetes across multiple regions with geo-distributed Kafka clusters ensuring data locality and compliance with regional data sovereignty requirements.",
      },
      {
        question: "What regulatory reporting standards are supported?",
        answer:
          "We support MiFID II, Dodd-Frank, EMIR, and Basel III reporting through configurable templates. The system auto-generates XML and JSON payloads from transaction data with full audit trail documentation.",
      },
    ],
  },
  "ai-support-bot": {
    slug: "ai-support-bot",
    title: "AI Support Bot",
    subtitle: "Intelligent Customer Service Platform",
    category: "AI & Automation",
    client: "RetailGenius",
    duration: "4 months",
    description:
      "An LLM-powered customer service platform handling 100K+ daily conversations with 89% resolution rate, integrating with existing CRM and knowledge bases for seamless human handoff.",
    heroImage: "/images/projects/ai-support-bot-hero.jpg",
    overview:
      "RetailGenius needed to scale customer support without adding headcount. We built an AI agent platform powered by fine-tuned LLMs that handles 100,000+ daily conversations across email, chat, and social channels. The system achieves 89% first-contact resolution while maintaining a 4.6/5 customer satisfaction score.",
    challenge:
      "RetailGenius faced 400% YoY support ticket growth during rapid expansion. Their existing team couldn't scale, response times exceeded 48 hours, and customer satisfaction dropped to 3.2/5. They needed AI that could understand context, maintain brand voice, and escalate gracefully.",
    solution:
      "Built a multi-agent orchestration system with specialized LLMs for intent detection, response generation, and sentiment analysis. Implemented RAG pipelines over their existing Zendesk and Shopify data with semantic search. Designed a human-in-the-loop escalation system with full conversation context transfer.",
    galleryImages: [
      "/images/projects/ai-support-bot-1.jpg",
      "/images/projects/ai-support-bot-2.jpg",
    ],
    features: [
      "Multi-channel support (Email, Live Chat, WhatsApp, Twitter)",
      "RAG-powered responses from CRM and knowledge bases",
      "Intent classification with 96% accuracy",
      "Sentiment detection with escalation triggers",
      "Real-time human agent handoff with context preservation",
      "Custom brand voice training on company data",
      "Analytics dashboard with CSAT and resolution metrics",
      "Multi-language support (25 languages)",
    ],
    metrics: [
      { label: "Daily Conversations", value: "100K+" },
      { label: "Resolution Rate", value: "89%" },
      { label: "Avg Response Time", value: "<30s" },
      { label: "Customer CSAT", value: "4.6/5" },
    ],
    results: [
      {
        title: "400% Support Volume Increase, Same Team",
        description:
          "AI handled 80% of incoming tickets, allowing the human team to focus on complex cases while volume grew 4x without new hires.",
      },
      {
        title: "Response Time Reduced from 48hrs to 30 seconds",
        description:
          "Instant AI responses eliminated the backlog, improving customer experience and reducing escalation rates by 65%.",
      },
      {
        title: "$2.4M Annual Savings in Support Costs",
        description:
          "Automating routine inquiries delivered $2.4M in annual cost savings through reduced agent hours and faster resolution.",
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
      "Zendesk API",
    ],
    faqs: [
      {
        question: "How does the AI maintain brand voice?",
        answer:
          "We fine-tune on your historical support conversations and brand guidelines. The model learns your terminology, tone, and response patterns, ensuring consistency across all AI-generated responses.",
      },
      {
        question: "How does the human handoff work?",
        answer:
          "When confidence drops below threshold or sentiment indicates frustration, the conversation is escalated to a human agent with full context including conversation history, customer profile, and recommended responses. This ensures no information loss during handoff.",
      },
      {
        question: "Can it integrate with our existing tools?",
        answer:
          "Yes, we have pre-built connectors for Zendesk, Salesforce, Intercom, Shopify, and HubSpot. For custom systems, we provide REST APIs and webhook support for seamless integration with your existing tech stack.",
      },
      {
        question: "How do you handle sensitive customer data?",
        answer:
          "We implement PII detection and redaction in real-time. All data is encrypted at rest and in transit. We offer SOC 2 Type II compliant deployment options including private cloud and on-premises for organizations with strict data sovereignty requirements.",
      },
      {
        question: "How long does implementation take?",
        answer:
          "A typical implementation takes 4-8 weeks. The first 2 weeks involve data audit and RAG pipeline setup. Weeks 3-4 are for model training and integration. Weeks 5-8 cover testing, fine-tuning, and phased rollout. Enterprise deployments with multiple channels may take longer.",
      },
    ],
  },
  "cloud-sync-platform": {
    slug: "cloud-sync-platform",
    title: "CloudSync Platform",
    subtitle: "Enterprise Cloud Migration & Sync Solution",
    category: "Cloud & DevOps",
    client: "DataStream Inc",
    duration: "5 months",
    description:
      "A comprehensive cloud sync platform enabling real-time data synchronization across multi-cloud environments with conflict resolution, monitoring, and automated failover.",
    heroImage: "/images/projects/cloud-sync-platform-hero.jpg",
    overview:
      "CloudSync Platform is a migration and synchronization solution built for enterprises managing data across AWS, GCP, and Azure. It handles 50TB+ daily data transfers with real-time conflict detection, automated disaster recovery failover, and comprehensive monitoring dashboards.",
    challenge:
      "DataStream needed to migrate 500TB of legacy data to multi-cloud architecture while maintaining 24/7 operations. They faced data integrity risks, complex governance requirements, and zero-downtime constraints that their existing tools couldn't address.",
    solution:
      "Built a distributed sync engine using Apache Pulsar for ordered message delivery, with custom conflict resolution algorithms. Implemented a blue-green migration strategy with automated rollback capabilities. Created a real-time monitoring system using Prometheus and Grafana with custom SLA tracking.",
    galleryImages: [
      "/images/projects/cloud-sync-platform-1.jpg",
      "/images/projects/cloud-sync-platform-2.jpg",
    ],
    features: [
      "Real-time multi-cloud sync (AWS, GCP, Azure)",
      "Conflict detection and resolution algorithms",
      "Automated disaster recovery with <5min failover",
      "End-to-end data encryption with customer-managed keys",
      "Real-time monitoring and alerting via Prometheus/Grafana",
      "Audit logging and compliance reporting",
      "Bandwidth throttling and scheduling",
      "Data transformation and filtering pipelines",
    ],
    metrics: [
      { label: "Daily Transfer", value: "50TB+" },
      { label: "Failover Time", value: "<5min" },
      { label: "Data Integrity", value: "99.999%" },
      { label: "Uptime", value: "99.99%" },
    ],
    results: [
      {
        title: "500TB Migrated with Zero Downtime",
        description:
          "Successfully completed a 6-month migration project 2 weeks ahead of schedule with no service interruption to production systems.",
      },
      {
        title: "99.999% Data Integrity Achieved",
        description:
          "Comprehensive validation and checksum verification ensured zero data loss across 500+ billion records during migration.",
      },
      {
        title: "60% Reduction in Cloud Costs",
        description:
          "Intelligent data tiering and bandwidth optimization reduced monthly cloud spend by $180K while improving performance.",
      },
    ],
    techStack: [
      "Go",
      "Apache Pulsar",
      "Kubernetes",
      "Terraform",
      "Prometheus",
      "Grafana",
      "Redis",
      "PostgreSQL",
    ],
    faqs: [
      {
        question: "How does the conflict resolution work?",
        answer:
          "We use a combination of timestamp-based last-write-wins, vector clocks for causal ordering, and custom business rules. Conflicts are detected in real-time and either auto-resolved or flagged for manual review depending on your configuration.",
      },
      {
        question: "What happens during a cloud provider outage?",
        answer:
          "Our automated failover system detects outages within 30 seconds and switches to a pre-configured secondary region. The sync engine queues incoming changes and replays them once the primary is restored, ensuring zero data loss.",
      },
      {
        question: "Can we use our own encryption keys?",
        answer:
          "Yes, we support customer-managed encryption keys (CMEK) for all major cloud providers. Your keys never leave your cloud environment, and we support bring-your-own-key (BYOK) for maximum security and compliance.",
      },
      {
        question: "How do you ensure data security during transfer?",
        answer:
          "All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We also support VPN tunnels and private cloud connections for organizations with strict network security requirements.",
      },
      {
        question: "What monitoring and reporting is available?",
        answer:
          "We provide comprehensive dashboards showing sync status, throughput, latency, errors, and SLA compliance. Reports can be exported in PDF or integrated directly with your existing BI tools via our REST API.",
      },
    ],
  },
  "ecommerce-replatform": {
    slug: "ecommerce-replatform",
    title: "E-Commerce Replatform",
    subtitle: "High-Performance Headless Commerce Platform",
    category: "Web Development",
    client: "StyleHub Fashion",
    duration: "7 months",
    description:
      "A headless commerce platform enabling 10x faster page loads, 99.9% conversion rate improvement, and seamless omnichannel integration for a fashion retailer processing 5M+ monthly visitors.",
    heroImage: "/images/projects/ecommerce-replatform-hero.jpg",
    overview:
      "StyleHub Fashion migrated from a monolithic Magento platform to a modern headless architecture. The new platform delivers 10x faster page loads through edge caching, 40% higher conversion rates through optimized checkout flows, and unified inventory across 50 retail locations and 3PL partners.",
    challenge:
      "StyleHub's legacy Magento platform couldn't handle peak traffic, with 8-second page load times during sales events causing 70% cart abandonment. They needed better mobile experience, faster iteration cycles, and integrated inventory management across channels.",
    solution:
      "Built a Next.js + GraphQL headless frontend with Cloudflare edge caching, achieving sub-second page loads globally. Implemented Shopify's backend for inventory and orders with custom integrations to their POS and 3PL systems. Optimized checkout flow reduced steps from 6 to 3, increasing completion rates by 40%.",
    galleryImages: [
      "/images/projects/ecommerce-replatform-1.jpg",
      "/images/projects/ecommerce-replatform-2.jpg",
    ],
    features: [
      "Sub-second page loads via edge caching and ISR",
      "Personalized product recommendations using ML",
      "Optimized checkout flow (6 to 3 steps)",
      "Real-time inventory across 50+ locations",
      "Multi-currency and multi-language support",
      "AB testing framework for continuous optimization",
      "Integrated loyalty and rewards program",
      "Mobile-first design with offline capability",
    ],
    metrics: [
      { label: "Monthly Visitors", value: "5M+" },
      { label: "Page Load", value: "<1s" },
      { label: "Conversion Lift", value: "+40%" },
      { label: "Cart Abandonment", value: "-70%" },
    ],
    results: [
      {
        title: "10x Performance Improvement",
        description:
          "Page load times reduced from 8 seconds to under 800ms, directly correlating with 35% higher engagement and 40% better conversion on mobile.",
      },
      {
        title: "$12M Revenue Increase in Year One",
        description:
          "Faster performance and optimized checkout delivered $12M in additional revenue through higher conversion rates and reduced abandonment.",
      },
      {
        title: "60% Faster Feature Delivery",
        description:
          "Headless architecture reduced deployment cycles from 2 weeks to 3 days, enabling the team to ship 3x more features in the first year.",
      },
    ],
    techStack: [
      "Next.js",
      "GraphQL",
      "Shopify",
      "Cloudflare",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
      "Algolia",
    ],
    faqs: [
      {
        question: "Why did you choose a headless architecture?",
        answer:
          "Headless commerce decouples the frontend from the backend, allowing independent scaling and iteration. For StyleHub, this meant 10x faster performance through edge caching, faster development cycles, and the flexibility to add new touchpoints (apps, kiosks, social commerce) without backend changes.",
      },
      {
        question: "How does the inventory synchronization work?",
        answer:
          "We built a real-time inventory sync service that connects Shopify's inventory system with their POS systems and 3PL partners via webhooks and API integrations. The system handles 50+ concurrent updates per second with conflict resolution for oversells.",
      },
      {
        question: "Can the platform handle Black Friday scale?",
        answer:
          "Absolutely. We load tested to 50x normal traffic. Edge caching, auto-scaling Kubernetes clusters, and database read replicas handle traffic spikes gracefully. During last year's Black Friday, we served 2M visitors with zero downtime and sub-second response times.",
      },
      {
        question: "How does the personalization engine work?",
        answer:
          "We use collaborative filtering and content-based recommendation algorithms trained on browsing history, purchase data, and real-time behavior. Recommendations are served from edge with <10ms latency and A/B tested continuously for optimization.",
      },
      {
        question: "What is the migration approach?",
        answer:
          "We use a parallel migration strategy with feature flags. Traffic is gradually shifted from legacy to new platform, with instant rollback capability. Data migration runs in batches with validation at each step to ensure zero data loss.",
      },
    ],
  },
  "ml-prediction-engine": {
    slug: "ml-prediction-engine",
    title: "ML Prediction Engine",
    subtitle: "Real-Time Machine Learning Inference Platform",
    category: "AI & Data",
    client: "PredictFlow Analytics",
    duration: "6 months",
    description:
      "A real-time ML inference platform enabling sub-10ms predictions at 100K requests/second, powering demand forecasting, fraud detection, and dynamic pricing for enterprise clients.",
    heroImage: "/images/projects/ml-prediction-engine-hero.jpg",
    overview:
      "PredictFlow needed a production ML platform that could serve predictions in real-time for fraud detection and demand forecasting. We built a distributed inference system that processes 100,000 predictions per second with sub-10ms latency, achieving 99.9% availability.",
    challenge:
      "PredictFlow's data science team had excellent models but no reliable way to serve them in production. Their batch prediction approach caused 24-hour delays, missing critical fraud events and causing inventory stockouts. They needed real-time inference at enterprise scale.",
    solution:
      "Built a model serving platform using NVIDIA Triton Inference Server with custom batching strategies. Deployed models across 5 regions with automatic load balancing. Implemented model versioning and A/B testing infrastructure for continuous improvement while maintaining 99.9% availability.",
    galleryImages: [
      "/images/projects/ml-prediction-engine-1.jpg",
      "/images/projects/ml-prediction-engine-2.jpg",
    ],
    features: [
      "Sub-10ms inference latency at 100K requests/second",
      "Multi-model serving with automatic load balancing",
      "Model versioning with zero-downtime deployments",
      "A/B testing and champion-challenger frameworks",
      "Real-time feature store with <5ms lookup",
      "Automatic model drift detection and alerting",
      "GPU and CPU inference optimization",
      "Comprehensive model monitoring and explainability",
    ],
    metrics: [
      { label: "Requests/Second", value: "100K+" },
      { label: "Latency", value: "<10ms" },
      { label: "Availability", value: "99.9%" },
      { label: "Models in Production", value: "25+" },
    ],
    results: [
      {
        title: "99% Fraud Detection Rate, <50ms Response",
        description:
          "Real-time fraud scoring enabled detection and blocking of fraudulent transactions in under 50ms, catching 99% of fraud attempts and saving $8M monthly.",
      },
      {
        title: "30% Reduction in Inventory Costs",
        description:
          "Accurate demand forecasting reduced overstock and stockouts by 30%, freeing up $4M in working capital previously tied up in excess inventory.",
      },
      {
        title: "ML Lifecycle from Weeks to Hours",
        description:
          "Self-service deployment tools reduced time-to-production for new models from 3 weeks to 4 hours, accelerating data science impact by 10x.",
      },
    ],
    techStack: [
      "Python",
      "NVIDIA Triton",
      "TensorFlow",
      "PyTorch",
      "Kubernetes",
      "Redis",
      "Kafka",
      "Grafana",
    ],
    faqs: [
      {
        question: "How do you achieve sub-10ms latency?",
        answer:
          "We use several techniques: GPU inference with optimized kernels, intelligent batching to maximize throughput, feature store with in-memory caching for common features, and edge deployment of lightweight models. Pre-warming and connection pooling eliminate cold start delays.",
      },
      {
        question: "How do you handle model versioning and rollback?",
        answer:
          "Every model deployment gets a versioned endpoint. Traffic can be split between versions for A/B testing or instantly shifted back to a previous version with a single API call. Rollback completes in under 30 seconds with zero prediction interruption.",
      },
      {
        question: "Can you explain model predictions for compliance?",
        answer:
          "Yes, we integrate with SHAP and LIME for model explainability. Every prediction includes feature importance scores explaining which inputs drove the output. This supports GDPR article 22 compliance and regulatory requirements in financial services.",
      },
      {
        question: "How do you detect and handle model drift?",
        answer:
          "We continuously monitor prediction distributions, feature statistics, and business KPIs. When drift is detected (using statistical tests and custom thresholds), alerts fire and optional automatic rollback can trigger. Drift detection runs on every 100K predictions.",
      },
      {
        question: "What monitoring is available?",
        answer:
          "Comprehensive dashboards show request volume, latency percentiles, error rates, GPU utilization, and model accuracy metrics. Custom alerts can be configured for any metric, with integrations to PagerDuty, Slack, and email.",
      },
    ],
  },
  "real-time-collaboration": {
    slug: "real-time-collaboration",
    title: "Real-Time Collaboration",
    subtitle: "Enterprise Collaborative Workspace Platform",
    category: "Web Development",
    client: "TeamSync Corp",
    duration: "5 months",
    description:
      "A real-time collaborative workspace enabling 50,000+ concurrent users to edit documents, whiteboard, and video conference simultaneously with end-to-end encryption and enterprise SSO.",
    heroImage: "/images/projects/real-time-collaboration-hero.jpg",
    overview:
      "TeamSync's platform enables distributed teams to collaborate in real-time across documents, whiteboards, and video. The platform supports 50,000+ concurrent users with CRDT-based conflict resolution, sub-100ms sync latency, and end-to-end encryption for enterprise security.",
    challenge:
      "TeamSync's existing collaboration tools couldn't scale beyond 50 simultaneous users without severe lag. Their document sync used operational transforms that broke down with complex edits. They needed a solution that could handle their 50,000 user enterprise deployment with rock-solid reliability.",
    solution:
      "Implemented Yjs CRDT for conflict-free real-time editing across all document types. Built a WebSocket-based presence and sync infrastructure with global PoPs for low latency. Used end-to-end encryption with key management through AWS KMS, achieving SOC 2 compliance.",
    galleryImages: [
      "/images/projects/real-time-collaboration-1.jpg",
      "/images/projects/real-time-collaboration-2.jpg",
    ],
    features: [
      "CRDT-based real-time document editing (50K+ concurrent users)",
      "Sub-100ms sync latency via global edge network",
      "End-to-end encryption with customer-managed keys",
      "Real-time cursors and presence indicators",
      "Integrated video conferencing with screen sharing",
      "Version history with instant rollback",
      "Enterprise SSO (SAML, OIDC) integration",
      "Offline-first with automatic conflict resolution",
    ],
    metrics: [
      { label: "Concurrent Users", value: "50K+" },
      { label: "Sync Latency", value: "<100ms" },
      { label: "Availability", value: "99.99%" },
      { label: "Document Edits", value: "10M+/day" },
    ],
    results: [
      {
        title: "60% Faster Team Collaboration",
        description:
          "Real-time editing and integrated communication reduced meeting time by 40% and document review cycles from 5 days to 2 days.",
      },
      {
        title: "Zero Sync Conflicts in Year One",
        description:
          "CRDT-based architecture ensured 100% conflict-free collaboration across 10M+ daily edits with zero data loss incidents.",
      },
      {
        title: "SOC 2 Type II Certified",
        description:
          "End-to-end encryption and comprehensive security controls enabled SOC 2 certification within 3 months, unlocking enterprise sales.",
      },
    ],
    techStack: [
      "React",
      "Yjs",
      "WebSocket",
      "Node.js",
      "Redis",
      "PostgreSQL",
      "AWS KMS",
      "Cloudflare",
    ],
    faqs: [
      {
        question: "How does CRDT-based collaboration work?",
        answer:
          "CRDTs (Conflict-free Replicated Data Types) allow multiple users to edit simultaneously without coordination. Each user's changes are merged deterministically, ensuring all clients converge to the same state regardless of network delays or conflicts. We use Yjs for text and custom CRDTs for structured data.",
      },
      {
        question: "How do you achieve such low latency globally?",
        answer:
          "We deploy WebSocket servers across 25 global PoPs using Cloudflare's network. User traffic is routed to the nearest server, with intelligent geo-routing for mobile users. Document state is replicated across regions for instant failover.",
      },
      {
        question: "How does end-to-end encryption work?",
        answer:
          "Documents are encrypted client-side using AES-256-GCM before transmission. Keys are managed through AWS KMS with customer-managed key support. The server only sees encrypted data and cannot decrypt content, ensuring privacy even during infrastructure breaches.",
      },
      {
        question: "What happens offline?",
        answer:
          "The platform works offline with local changes stored in IndexedDB. When connectivity returns, changes sync automatically using the CRDT merge algorithm. Conflict resolution happens seamlessly without user intervention.",
      },
      {
        question: "How do you handle security and compliance?",
        answer:
          "We implement defense-in-depth: end-to-end encryption, SAML/OIDC SSO, IP allowlisting, audit logging, and data residency controls. We maintain SOC 2 Type II, ISO 27001, and GDPR compliance with annual third-party audits.",
      },
    ],
  },
};

export function getProjectData(slug: string) {
  return projectsData[slug] ?? null;
}