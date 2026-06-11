import {
  IconBrain,
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
  heroPaddingY?: string;
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
  // Cloud & DevOps
  {
    slug: "cloudwatch-pro",
    title: "CloudWatch Pro",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "vueling-serverless-transformation",
    title: "Vueling",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "moj-claims-digitisation",
    title: "Ministry of Justice",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "nhs-professionals",
    title: "NHS Professionals",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "adobe-creative-cloud-innovation",
    title: "Adobe",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "zego-resident-experience",
    title: "Zego",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "xerox-enterprise-document-cloud",
    title: "Xerox",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "decisiv-srm-platform",
    title: "Decisiv",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "enterprise-logistics-modernization",
    title: "Enterprise Logistics",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "enterprise-cloud-transformation",
    title: "Cloud Modernization",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "tax-automation-system",
    title: "Tax Automation",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "energo-iot",
    title: "Energo",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "sudan-civil-registry-digitization",
    title: "Sudan Civil Registry",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "github-scaling-engineering-acceleration",
    title: "GitHub Scale-Up",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "lockheed-martin-mission-control",
    title: "Lockheed Martin",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "fintech-cloud-migration",
    title: "FinTech Cloud",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "africa-prudential",
    title: "Africa Prudential",
    icon: <IconCloud className="size-6" />,
  },

  // Web Development
  {
    slug: "healthhero-scaling-telehealth",
    title: "HealthHero",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "apotka-pharmacy",
    title: "Apotka",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "infinitas-learning",
    title: "Infinitas Learning",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "fine-rare",
    title: "Fine+Rare",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "rspb-digital-transformation",
    title: "RSPB",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "bbc-academy-platform",
    title: "BBC Academy",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "winchester-college",
    title: "Winchester College",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "printing-com",
    title: "Printing.com",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "first-choice-group",
    title: "First Choice Group",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "hillingdon-council",
    title: "Hillingdon Council",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "ebay-marketplace-optimization",
    title: "eBay",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "fih-international-hockey",
    title: "FIH Hockey",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "bca-intelligent-auction-platform",
    title: "BCA Auctions",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "expedia-global-inventory-sync",
    title: "Expedia",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "hughesnet-digital-evolution",
    title: "HughesNet",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "pawn-management-modernization",
    title: "Pawn Management",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "millercoors-b2b-portal",
    title: "MillerCoors",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "steelcase-b2b-portal",
    title: "Steelcase",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "retail-personalization-engine",
    title: "Beauty Retail",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "baza-real-estate",
    title: "Baza",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "verified-kyc-verification",
    title: "Verified.ng",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "module-academy",
    title: "Module Academy",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "altmall-ecommerce",
    title: "AltMall",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "viacomcbs-paramount-plus-transformation",
    title: "Paramount+",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "dish-network-dish-anywhere",
    title: "DISH Anywhere",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "transportation-legacy-modernization",
    title: "Transportation Modernization",
    icon: <IconCode className="size-6" />,
  },

  // Mobile Development
  {
    slug: "colas-logistics-optimisation",
    title: "Colas",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "david-lloyd-leisure",
    title: "David Lloyd Leisure",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "virgin-money-pulse",
    title: "Virgin Money",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "royal-london-pensions",
    title: "Royal London",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "scottishpower-yourenergy",
    title: "ScottishPower",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "the-gym-group",
    title: "The Gym Group",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "pinterest-mobile-engineering",
    title: "Pinterest",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "aarp-rewards-gamification",
    title: "AARP",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "tomtom-digital-cockpit",
    title: "TomTom Cockpit",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "i-invest",
    title: "i-invest",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "skyline-hms",
    title: "Skyline HMS",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "microfinance-field-digitization",
    title: "Kashf",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "grecha-delivery",
    title: "Grecha",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "mtn-biosmart-registration",
    title: "MTN BioSmart",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "kash-fintech",
    title: "Kash Fintech",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "mastercard-global-fintech-infrastructure",
    title: "Mastercard",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "tomtom-navigation-redesign",
    title: "TomTom Go",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "onebank-sterling",
    title: "OneBank",
    icon: <IconDeviceMobile className="size-6" />,
  },

  // AI & Data
  {
    slug: "simon-kucher-partners",
    title: "Simon-Kucher",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "smith-nephew",
    title: "Smith+Nephew Analytics",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "smith-nephew-orthopaedics",
    title: "Smith+Nephew Ortho",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "gc-business-finance",
    title: "GC Business Finance",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "salesforce-cloud-integration",
    title: "Salesforce",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "terawatt-ev-infrastructure",
    title: "Terawatt EV",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "medtech-ai-patient-care",
    title: "MedTech AI",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "jnj-vr-surgical-training",
    title: "J&J VR Training",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "insurance-claims-automation",
    title: "Insurance Claims AI",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "lockheed-martin-propel",
    title: "Lockheed Propel",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "unilever-subscription-engine",
    title: "Unilever",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "data-platform-modernization",
    title: "Data Platform",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "influence-flow",
    title: "Influence Flow",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "swiggy-web3-loyalty",
    title: "Swiggy Web3",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "nimc-national-id-enrollment",
    title: "NIMC National ID",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "coursera-ai-learning-optimization",
    title: "Coursera AI",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "healthcare-data-interoperability",
    title: "Healthcare FHIR",
    icon: <IconBrain className="size-6" />,
  },

  // AI & Automation
  {
    slug: "trust-stamp",
    title: "Trust Stamp",
    icon: <IconRobot className="size-6" />,
  },
  {
    slug: "global-consultant-ai",
    title: "Consultant AI",
    icon: <IconRobot className="size-6" />,
  },
  {
    slug: "dish-network-self-service",
    title: "MyDISH",
    icon: <IconRobot className="size-6" />,
  },
  {
    slug: "drinkworks-iot-ecommerce",
    title: "Drinkworks",
    icon: <IconRobot className="size-6" />,
  },
  {
    slug: "insurance-digital-transformation",
    title: "Insurance Modernization",
    icon: <IconRobot className="size-6" />,
  },
  {
    slug: "smart-iot-diagnostic",
    title: "Daikin IoT",
    icon: <IconRobot className="size-6" />,
  },
  {
    slug: "bento-payroll-hr",
    title: "Bento Africa",
    icon: <IconRobot className="size-6" />,
  },
  {
    slug: "enterprise-ai-assistant",
    title: "AI Claims Assistant",
    icon: <IconRobot className="size-6" />,
  },
  {
    slug: "glo-digital-gateway",
    title: "Globacom",
    icon: <IconRobot className="size-6" />,
  },

  // Healthcare
  {
    slug: "raccoon-recovery",
    title: "Raccoon Recovery",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "deluxe-care-hms",
    title: "Deluxe Care HMS",
    icon: <IconDeviceMobile className="size-6" />,
  },

  // IoT & Automation
  {
    slug: "costa-express",
    title: "Costa Express",
    icon: <IconCloudComputing className="size-6" />,
  },

  // Fintech
  {
    slug: "digital-banking-modernization",
    title: "UBL Digital Banking",
    icon: <IconBuildingBank className="size-6" />,
  },

  // Blockchain
  {
    slug: "push-chain",
    title: "PushChain",
    icon: <IconCode className="size-6" />,
  },

  // Financial Services
  {
    slug: "western-union-digital-transformation",
    title: "Western Union",
    icon: <IconBuildingBank className="size-6" />,
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
  "cloudwatch-pro": {
    slug: "cloudwatch-pro",
    title: "CloudWatch Pro: Enterprise Monitoring Platform",
    subtitle:
      "Workholo developed a scalable cloud monitoring and infrastructure observability platform for enterprise operations.",
    category: "Cloud & DevOps",
    client: "Workholo",
    duration: "8 Months",

    description:
      "Workholo designed and developed CloudWatch Pro, an advanced infrastructure monitoring and analytics platform built to help enterprises monitor cloud resources, application performance, server health, and real-time operational metrics from a centralized dashboard.",

    heroImage: "/assets/projects/cloudwatch-pro.jpg",

    overview:
      "CloudWatch Pro was fully engineered by Workholo as an enterprise-grade observability solution capable of tracking infrastructure health, application performance, security events, and operational alerts across multi-cloud environments. The platform delivers real-time insights, intelligent alerting, and centralized analytics for modern DevOps teams.",

    challenge:
      "The main challenge was building a high-performance monitoring platform capable of processing massive streams of infrastructure logs and metrics in real time while maintaining low latency, scalability, and enterprise-level reliability.",

    solution:
      "Workholo architected a cloud-native microservices ecosystem using scalable event-driven infrastructure, real-time data pipelines, and automated monitoring workflows. The platform integrates centralized dashboards, alert systems, analytics engines, and intelligent infrastructure tracking into a single unified ecosystem.",

    galleryImages: [
      "/assets/projects/cloudwatch-pro-gallery-1.jpg",
      "/assets/projects/cloudwatch-pro-gallery-2.jpg",
    ],

    features: [
      "Real-time Infrastructure Monitoring",
      "Cloud Resource Analytics",
      "Application Performance Tracking",
      "Automated Incident Alerts",
      "Centralized Logging Dashboard",
      "Server Health Monitoring",
      "Role-Based Access Control",
      "AI-Powered Operational Insights",
    ],

    metrics: [
      {
        label: "Infrastructure Events Processed",
        value: "75M+",
      },
      {
        label: "Platform Uptime",
        value: "99.95%",
      },
      {
        label: "Enterprise Clients Supported",
        value: "120+",
      },
      {
        label: "Monitoring Latency",
        value: "<2 Sec",
      },
    ],

    results: [
      {
        stat: "99.99%",
        title: "System Reliability",
        description:
          "Workholo engineered a highly resilient monitoring infrastructure with enterprise-grade uptime and fault tolerance.",
      },
      {
        stat: "70%",
        title: "Incident Response Improvement",
        description:
          "Real-time alerting and centralized analytics significantly reduced operational downtime and troubleshooting time.",
      },
      {
        stat: "500M+",
        title: "Events Processed",
        description:
          "The platform successfully handled massive volumes of infrastructure logs, alerts, and monitoring events daily.",
      },
    ],

    techStack: [
      "AWS",
      "Node.js",
      "React",
      "Kafka",
      "MongoDB",
      "Terraform",
      "TypeScript",
      "Python",
    ],

    timeline: [
      {
        label: "Phase 1",
        title: "Infrastructure Planning",
        description:
          "Workholo analyzed enterprise monitoring requirements and designed scalable cloud architecture workflows.",
      },
      {
        label: "Phase 2",
        title: "Core Platform Development",
        description:
          "The engineering team developed monitoring services, analytics systems, and centralized dashboards.",
      },
      {
        label: "Phase 3",
        title: "Integration & Automation",
        description:
          "Alert systems, cloud integrations, infrastructure APIs, and automation pipelines were implemented.",
      },
      {
        label: "Phase 4",
        title: "Enterprise Deployment",
        description:
          "CloudWatch Pro was deployed with real-time monitoring, scaling automation, and production-grade observability.",
      },
    ],

    faqs: [
      {
        question: "Was CloudWatch Pro fully developed by Workholo?",
        answer:
          "Yes, Workholo completely designed, developed, deployed, and optimized the entire monitoring platform architecture and infrastructure.",
      },
      {
        question: "Can the platform monitor multi-cloud environments?",
        answer:
          "Yes, CloudWatch Pro supports monitoring across AWS, Azure, hybrid infrastructure, and containerized environments.",
      },
      {
        question: "Does the platform provide real-time alerting?",
        answer:
          "Yes, intelligent alert systems instantly notify teams about infrastructure failures, performance degradation, and operational incidents.",
      },
      {
        question: "Is the platform scalable for enterprise usage?",
        answer:
          "Yes, the cloud-native architecture was built by Workholo to support large-scale enterprise workloads and massive event processing.",
      },
    ],
  },
  "healthhero-scaling-telehealth": {
    slug: "healthhero-scaling-telehealth",
    title: "HealthHero: Global Telemedicine Ecosystem",
    subtitle:
      "Workholo modernised healthcare infrastructure for a large-scale telemedicine platform serving millions of users.",
    category: "Web Development",
    client: "HealthHero",
    duration: "6 Months",

    description:
      "HealthHero required a scalable and unified healthcare platform capable of supporting rapid digital growth across multiple regions. Workholo led the modernization initiative by transforming fragmented legacy systems into a high-performance cloud-native ecosystem optimized for large-scale telemedicine operations.",

    heroImage: "/assets/projects/healthhero-scaling-telehealth.jpg",

    overview:
      "As a rapidly growing telehealth provider, HealthHero faced operational complexity due to multiple disconnected legacy platforms. Workholo was responsible for building a unified digital ecosystem that streamlined patient management, consultation workflows, and healthcare operations while supporting international scalability.",

    challenge:
      "The major challenge involved migrating sensitive patient workflows and legacy healthcare systems into a modern microservices architecture without disrupting live medical services. The platform also needed to comply with strict healthcare security and regional data privacy regulations.",

    solution:
      "Workholo designed and implemented a federated GraphQL-based microservices architecture that allowed independent scaling and management of critical healthcare domains such as scheduling, prescriptions, billing, and patient records. The phased migration strategy ensured continuous service availability while significantly improving platform performance and flexibility.",

    galleryImages: [
      "/assets/projects/healthhero-scaling-telehealth-gallery-1.jpg",
      "/assets/projects/healthhero-scaling-telehealth-gallery-2.jpg",
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
        value: "30%",
      },
      {
        label: "Deployment Velocity",
        value: "3.5x",
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
          "Workholo enabled independent service deployments, significantly accelerating feature delivery and platform innovation.",
      },
      {
        stat: "40%",
        title: "Operational Savings",
        description:
          "The new cloud-native infrastructure reduced operational overhead and simplified maintenance across healthcare systems.",
      },
      {
        stat: "100%",
        title: "Zero Downtime Migration",
        description:
          "Millions of healthcare records and live consultation services were migrated successfully without service interruption.",
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
        title: "System Audit & Planning",
        description:
          "Workholo analyzed legacy healthcare systems and defined the architecture roadmap for modernization.",
      },
      {
        label: "Phase 2",
        title: "Infrastructure Foundation",
        description:
          "Established scalable Kubernetes infrastructure and GraphQL gateway services for domain separation.",
      },
      {
        label: "Phase 3",
        title: "Service Migration",
        description:
          "Critical healthcare services including scheduling and patient management were migrated incrementally.",
      },
      {
        label: "Phase 4",
        title: "Regional Expansion",
        description:
          "The unified healthcare ecosystem was optimized and deployed across multiple international regions.",
      },
    ],

    faqs: [
      {
        question: "How did Workholo ensure healthcare data security?",
        answer:
          "The platform implemented encrypted storage, secure APIs, role-based access controls, and region-specific compliance measures.",
      },
      {
        question: "What was the advantage of the GraphQL architecture?",
        answer:
          "GraphQL enabled efficient communication between frontend applications and multiple backend services through a unified API layer.",
      },
      {
        question: "Was the platform designed for future scalability?",
        answer:
          "Yes, the microservices and Kubernetes-based architecture allows rapid horizontal scaling during high-demand periods.",
      },
      {
        question: "How were live healthcare services migrated safely?",
        answer:
          "Workholo used phased migrations and parallel system execution to prevent downtime during the transition process.",
      },
      {
        question: "Can additional healthcare partners be integrated later?",
        answer:
          "Yes, the modular architecture simplifies future integrations with hospitals, clinics, and external healthcare systems.",
      },
    ],
  },
  "vueling-serverless-transformation": {
    slug: "vueling-serverless-transformation",
    title: "Vueling: Cloud-Native Airline Platform",
    subtitle:
      "Workholo modernised airline booking infrastructure using scalable cloud-native technologies.",
    category: "Cloud & DevOps",
    client: "Vueling",
    duration: "4 Months",

    description:
      "Vueling required a modern, scalable booking platform capable of handling massive seasonal traffic spikes without performance degradation. Workholo led the cloud transformation initiative by migrating critical booking workflows to a serverless architecture that improved scalability, reliability, and operational efficiency.",

    heroImage: "/assets/projects/vueling-serverless-transformation.jpg",

    overview:
      "Airline platforms experience highly dynamic traffic patterns, especially during holiday sales and promotional booking periods. Workholo redesigned Vueling’s digital booking infrastructure using cloud-native technologies to ensure high availability, faster booking experiences, and efficient resource utilization during peak demand.",

    challenge:
      "The primary challenge involved migrating high-volume booking services from traditional infrastructure to a scalable cloud environment while maintaining real-time flight availability accuracy, pricing consistency, and uninterrupted booking operations.",

    solution:
      "Workholo implemented a serverless-first architecture using AWS services to automatically scale infrastructure based on live booking demand. The frontend booking experience was also optimized with modern React technologies, significantly improving application speed, responsiveness, and customer experience for millions of users.",

    galleryImages: [
      "/assets/projects/vueling-serverless-transformation-gallery-1.jpg",
      "/assets/projects/vueling-serverless-transformation-gallery-2.jpg",
    ],

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
        value: "50k+ Concurrent",
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
        title: "Infrastructure Cost Savings",
        description:
          "Workholo helped transition the platform to an efficient pay-per-usage cloud model, significantly reducing operational costs.",
      },
      {
        stat: "0",
        title: "Service Downtime",
        description:
          "The cloud-native infrastructure maintained uninterrupted booking operations during peak traffic events.",
      },
      {
        stat: "300%",
        title: "Development Acceleration",
        description:
          "Automated CI/CD workflows and scalable infrastructure dramatically improved deployment speed and engineering productivity.",
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
        title: "Infrastructure Assessment",
        description:
          "Workholo analyzed the legacy booking environment to identify scalability limitations and migration priorities.",
      },
      {
        label: "Phase 2",
        title: "Serverless Validation",
        description:
          "Developed and tested a serverless proof of concept to validate high-performance booking workflows at scale.",
      },
      {
        label: "Phase 3",
        title: "Production Migration",
        description:
          "Critical booking services were migrated incrementally to the new cloud-native architecture with minimal disruption.",
      },
      {
        label: "Phase 4",
        title: "Automation & Optimization",
        description:
          "Advanced CI/CD pipelines and automated cloud operations were implemented to support continuous innovation.",
      },
    ],

    faqs: [
      {
        question: "Why did Workholo recommend a serverless architecture?",
        answer:
          "Serverless infrastructure automatically scales with booking demand, reducing idle infrastructure costs while maintaining high availability.",
      },
      {
        question: "How were complex booking workflows managed?",
        answer:
          "Workholo implemented event-driven orchestration and managed workflow services to ensure reliable booking transaction processing.",
      },
      {
        question: "How was performance optimized for millions of users?",
        answer:
          "Optimized frontend rendering, edge caching, and scalable APIs ensured low-latency booking experiences globally.",
      },
      {
        question: "Was the new platform secure and reliable?",
        answer:
          "Yes, the architecture followed modern cloud security standards with strict access controls and resilient multi-region deployment strategies.",
      },
      {
        question:
          "Can the new system integrate with existing airline services?",
        answer:
          "Yes, Workholo developed integration layers that allowed seamless communication between legacy airline systems and the new cloud-native services.",
      },
    ],
  },
  "colas-logistics-optimisation": {
    slug: "colas-logistics-optimisation",
    title: "Colas: Smart Logistics Framework",
    subtitle:
      "Workholo developed a real-time logistics platform to optimize large-scale construction supply chain operations.",
    category: "Mobile Development",
    client: "Colas",
    duration: "5 Months",

    description:
      "Colas required a modern logistics management solution capable of coordinating material deliveries and fleet operations across thousands of construction sites. Workholo built a high-performance mobile platform that improved operational visibility, reduced material waste, and enhanced field productivity.",

    heroImage: "/assets/projects/colas-logistics-optimisation.jpg",

    overview:
      "Construction site operations at Colas relied heavily on manual coordination processes that often caused delays, inefficiencies, and material wastage. Workholo designed and implemented a real-time logistics ecosystem that enabled site managers to monitor fleet movement, delivery schedules, and operational workflows directly from mobile devices.",

    challenge:
      "The platform needed to function reliably in demanding construction environments with unstable internet connectivity and across various rugged mobile devices. Additionally, the system had to process and visualize large-scale fleet data in real time without compromising performance.",

    solution:
      "Workholo developed a React Native mobile application with offline-first architecture and real-time synchronization capabilities. Using Azure IoT-driven backend systems and advanced Mapbox visualizations, the platform enabled managers to track vehicles, optimize deliveries, and streamline logistics workflows across active construction sites.",

    galleryImages: [
      "/assets/projects/colas-logistics-optimisation-gallery-1.jpg",
      "/assets/projects/colas-logistics-optimisation-gallery-2.jpg",
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
        title: "Operational Productivity",
        description:
          "Workholo improved delivery coordination efficiency through real-time tracking and automated scheduling systems.",
      },
      {
        stat: "15%",
        title: "Material Waste Reduction",
        description:
          "Optimized delivery timing and monitoring capabilities significantly reduced material wastage during transportation.",
      },
      {
        stat: "100%",
        title: "Digital Workflow Adoption",
        description:
          "The platform replaced manual paperwork and enabled fully digitized logistics operations across construction sites.",
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
        title: "Operational Research",
        description:
          "Workholo conducted on-site workflow analysis to understand logistics coordination challenges in real construction environments.",
      },
      {
        label: "Phase 2",
        title: "Mobile Prototype Development",
        description:
          "An offline-capable prototype was developed and tested with field managers and logistics operators.",
      },
      {
        label: "Phase 3",
        title: "Backend & IoT Integration",
        description:
          "The mobile ecosystem was integrated with Azure IoT infrastructure and enterprise logistics systems.",
      },
      {
        label: "Phase 4",
        title: "Large-Scale Deployment",
        description:
          "The platform was deployed across thousands of construction sites and vehicles with region-specific configurations.",
      },
    ],

    faqs: [
      {
        question: "How does the platform function in low-network areas?",
        answer:
          "Workholo implemented offline-first synchronization logic that stores operational data locally until connectivity is restored.",
      },
      {
        question: "Can the system integrate with existing fleet hardware?",
        answer:
          "Yes, the platform supports integration with existing IoT telemetry systems and vehicle tracking devices.",
      },
      {
        question: "How scalable is the real-time tracking system?",
        answer:
          "The infrastructure is optimized to process and display thousands of live vehicle updates simultaneously with minimal latency.",
      },
      {
        question: "Was the application easy for field teams to adopt?",
        answer:
          "Yes, the mobile interface was intentionally designed to be simple, intuitive, and efficient for fast onboarding.",
      },
      {
        question: "What operational insights does the platform provide?",
        answer:
          "The system delivers real-time insights related to fleet movement, material conditions, fuel usage, and delivery efficiency.",
      },
    ],
  },
  "simon-kucher-partners": {
    slug: "simon-kucher-partners",
    title: "Global Profit & Pricing Intelligence Engine",
    subtitle:
      "Workholo developed an enterprise pricing intelligence platform for advanced business decision-making.",
    category: "AI & Data",
    client: "Simon-Kucher & Partners",
    duration: "18 Months",

    description:
      "Workholo engineered a scalable pricing optimization and analytics platform for Simon-Kucher & Partners, enabling consultants to perform real-time pricing simulations, margin analysis, and strategic decision-making across global enterprise operations.",

    heroImage: "/assets/projects/simon-kucher-partners.jpg",

    overview:
      "The project focused on replacing fragmented spreadsheet-based workflows with a centralized cloud-native analytics ecosystem. Workholo built a high-performance platform that enabled consultants to analyze massive datasets, simulate pricing strategies, and generate actionable business insights for enterprise clients worldwide.",

    challenge:
      "The primary challenge was consolidating large volumes of financial and operational data from multiple disconnected systems into a single secure platform accessible across global offices. The system also needed to support complex pricing simulations with near real-time processing performance.",

    solution:
      "Workholo designed and developed a distributed analytics platform powered by React and Node.js. The solution included advanced data visualization systems, high-concurrency simulation engines, automated reporting workflows, and scalable cloud infrastructure optimized for enterprise-grade performance.",

    galleryImages: [
      "/assets/projects/simon-kucher-partners-gallery-1.jpg",
      "/assets/projects/simon-kucher-partners-gallery-2.jpg",
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
        value: "35M+",
      },
      {
        label: "Margin Impact",
        value: "+15% Avg",
      },
    ],

    results: [
      {
        stat: "25+",
        title: "Global Office Deployment",
        description:
          "Workholo successfully deployed the platform across international consulting offices with uninterrupted operations.",
      },
      {
        stat: "99.9%",
        title: "Platform Reliability",
        description:
          "The enterprise infrastructure maintained high availability for critical consulting and analytics workflows.",
      },
      {
        stat: "2x",
        title: "Consultant Productivity",
        description:
          "Automation and centralized analytics significantly reduced manual data preparation and reporting efforts.",
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
        title: "Business Discovery & Planning",
        description:
          "Workholo conducted in-depth analysis of existing pricing models and enterprise reporting workflows.",
      },
      {
        label: "Phase 2",
        title: "Analytics Engine Development",
        description:
          "Core pricing simulation logic and distributed data processing systems were engineered for large-scale analytics.",
      },
      {
        label: "Phase 3",
        title: "Dashboard & Visualization Design",
        description:
          "Interactive consultant dashboards and advanced visualization tools were developed for strategic decision-making.",
      },
      {
        label: "Phase 4",
        title: "Enterprise Rollout",
        description:
          "The platform was deployed globally with integrations into legacy ERP and reporting environments.",
      },
    ],

    faqs: [
      {
        question: "How does the pricing simulation engine operate?",
        answer:
          "The platform uses advanced analytics models to calculate pricing impact scenarios and profitability outcomes in real time.",
      },
      {
        question: "Was enterprise-level security implemented?",
        answer:
          "Yes, Workholo implemented encrypted data handling, secure authentication systems, and enterprise-grade access controls.",
      },
      {
        question: "Can the platform process extremely large datasets?",
        answer:
          "Yes, the distributed architecture was optimized to analyze billions of data points with high-performance processing pipelines.",
      },
      {
        question: "Did the system integrate with legacy enterprise software?",
        answer:
          "Yes, Workholo developed custom integrations for ERP systems, enterprise databases, and reporting tools.",
      },
      {
        question: "Can consultants access the platform globally?",
        answer:
          "Yes, the cloud-native infrastructure supports secure cross-regional access with synchronized enterprise data.",
      },
    ],
  },
  connecterra: {
    slug: "connecterra",
    title: "Ida: AI-Powered Agricultural Intelligence",
    subtitle:
      "Workholo developed an AI-driven agricultural intelligence platform for predictive livestock monitoring.",
    category: "AI & Data",
    client: "Connecterra",
    duration: "24 Months",

    description:
      "Workholo partnered with Connecterra to build a scalable AI-powered ecosystem that transforms livestock sensor data into actionable farming insights. The platform enabled predictive health monitoring, behavioral analysis, and operational optimization for modern dairy farming.",

    heroImage: "/assets/data-engineering.webp",

    overview:
      "Modern agriculture increasingly relies on data-driven decision-making to improve productivity and animal welfare. Workholo helped develop 'Ida', an intelligent agricultural platform capable of analyzing livestock activity data and delivering predictive insights to farmers through cloud and mobile technologies.",

    challenge:
      "The platform needed to process massive volumes of real-time sensor data from farms across multiple regions while maintaining high prediction accuracy for livestock health, fertility, and behavioral anomalies. The infrastructure also had to support global scalability and low-latency analytics.",

    solution:
      "Workholo engineered a scalable microservices-based ecosystem powered by cloud-native infrastructure and machine learning technologies. The platform leveraged AI-driven behavioral analysis models and delivered insights through a mobile-first experience optimized for field operations and remote environments.",

    galleryImages: ["/assets/agentic-ai.webp", "/assets/ai-agents.webp"],

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
        title: "Continuous Monitoring",
        description:
          "Workholo enabled fully automated livestock monitoring through real-time AI-powered alert systems.",
      },
      {
        stat: "15%",
        title: "Farm Efficiency Improvement",
        description:
          "Predictive insights helped optimize breeding, health management, and overall farm productivity.",
      },
      {
        stat: "1M+",
        title: "Sensors Managed",
        description:
          "The infrastructure successfully scaled to process data from millions of livestock sensor events globally.",
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
        title: "Sensor & Hardware Integration",
        description:
          "Workholo integrated wearable livestock sensors with cloud-based data ingestion systems.",
      },
      {
        label: "Phase 2",
        title: "AI & Machine Learning Development",
        description:
          "Behavioral analytics models were trained using historical farming and livestock activity datasets.",
      },
      {
        label: "Phase 3",
        title: "Mobile Platform Development",
        description:
          "A mobile-first farming application was developed to deliver predictive insights and operational alerts.",
      },
      {
        label: "Phase 4",
        title: "Scalability & Optimization",
        description:
          "Cloud infrastructure and analytics pipelines were optimized for global deployment and large-scale data processing.",
      },
    ],

    faqs: [
      {
        question: "What types of livestock sensors are supported?",
        answer:
          "The platform integrates with wearable livestock tracking devices that monitor movement, activity, and behavioral patterns.",
      },
      {
        question: "How does the AI identify potential health issues?",
        answer:
          "Machine learning models analyze behavioral deviations and activity trends to detect early warning signs of illness.",
      },
      {
        question: "Can the platform support different farming environments?",
        answer:
          "Yes, the AI models were optimized using diverse datasets covering multiple regions, climates, and livestock conditions.",
      },
      {
        question: "Does the application work in remote farm locations?",
        answer:
          "Yes, the mobile platform includes offline data access and synchronization capabilities for low-connectivity environments.",
      },
      {
        question: "How scalable is the platform infrastructure?",
        answer:
          "The cloud-native architecture was built to handle large-scale sensor data streams and global farm deployments efficiently.",
      },
    ],
  },
  "raccoon-recovery": {
    slug: "raccoon-recovery",
    title: "Digital Physical Therapy Platform",
    subtitle:
      "Workholo developed a gamified rehabilitation ecosystem powered by real-time motion tracking.",
    category: "Healthcare",
    client: "Raccoon Recovery",
    duration: "12 Months",

    description:
      "Workholo engineered an advanced telerehabilitation platform that combines wearable motion sensors, gamified therapy experiences, and remote clinical monitoring to improve patient recovery after orthopedic treatments and surgeries.",

    heroImage: "/assets/projects/raccoon-recovery.jpg",

    overview:
      "Traditional at-home rehabilitation programs often suffer from low patient engagement and inconsistent progress tracking. Workholo helped transform the recovery experience by building a digital rehabilitation ecosystem that motivates patients through interactive therapy exercises while delivering accurate recovery data to healthcare professionals.",

    challenge:
      "The platform needed to capture subtle body movements with high precision and translate them into real-time digital interactions without latency. Additionally, the system had to provide clinically reliable motion analytics while maintaining strict healthcare data privacy and compliance standards.",

    solution:
      "Workholo developed a cross-platform rehabilitation ecosystem using Unity and React technologies to create immersive, gamified therapy experiences. Integrated wearable sensor systems and secure healthcare dashboards enabled therapists to remotely monitor patient progress and personalize recovery programs based on live motion data.",

    galleryImages: [
      "/assets/projects/raccoon-recovery-gallery-1.jpg",
      "/assets/projects/raccoon-recovery-gallery-2.jpg",
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
        title: "Reduced Clinical Visits",
        description:
          "Workholo enabled efficient remote rehabilitation monitoring, significantly reducing unnecessary in-person clinic sessions.",
      },
      {
        stat: "HIPAA",
        title: "Healthcare Compliance",
        description:
          "The platform was developed with secure healthcare-grade encryption and compliance-focused infrastructure.",
      },
      {
        stat: "100%",
        title: "Motion Tracking Precision",
        description:
          "Advanced sensor integration delivered highly accurate rehabilitation movement tracking and progress analysis.",
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
        title: "Clinical Research & Validation",
        description:
          "Workholo collaborated with rehabilitation specialists to define accurate movement tracking benchmarks.",
      },
      {
        label: "Phase 2",
        title: "Gamified Therapy Development",
        description:
          "Interactive rehabilitation experiences were developed using real-time sensor-driven gameplay mechanics.",
      },
      {
        label: "Phase 3",
        title: "Healthcare Dashboard Engineering",
        description:
          "Secure therapist dashboards and patient analytics systems were implemented for remote treatment management.",
      },
      {
        label: "Phase 4",
        title: "Pilot Deployment",
        description:
          "The rehabilitation platform was deployed in selected clinics for real-world testing and patient feedback collection.",
      },
    ],

    faqs: [
      {
        question: "Does the platform replace physical therapists?",
        answer:
          "No, the platform supports therapists by enabling remote monitoring, progress tracking, and guided rehabilitation management.",
      },
      {
        question: "What hardware is required for motion tracking?",
        answer:
          "The system integrates with lightweight wearable motion sensors designed to capture rehabilitation movement data accurately.",
      },
      {
        question: "How is patient medical data secured?",
        answer:
          "Workholo implemented encrypted healthcare infrastructure and compliance-focused security measures to protect patient information.",
      },
      {
        question: "What types of rehabilitation programs are supported?",
        answer:
          "The platform is optimized for orthopedic rehabilitation including knee, shoulder, hip, and post-surgical recovery programs.",
      },
      {
        question: "Which devices are supported?",
        answer:
          "The ecosystem supports mobile devices, tablets, and web-based healthcare portals across major platforms.",
      },
    ],
  },
  "apotka-pharmacy": {
    slug: "apotka-pharmacy",
    title: "Enterprise Healthcare Retail Ecosystem",
    subtitle:
      "Workholo transformed a large-scale pharmacy network into a modern omnichannel healthcare platform.",
    category: "Web Development",
    client: "Apotka",
    duration: "10 Months",

    description:
      "Workholo delivered a complete digital transformation for Apotka by building a scalable healthcare retail ecosystem that unified e-commerce operations, prescription workflows, and inventory management across hundreds of pharmacy locations.",

    heroImage: "/assets/projects/apotka-pharmacy.jpg",

    overview:
      "Apotka required a modern digital platform capable of connecting physical pharmacy operations with online healthcare services. Workholo developed a seamless omnichannel ecosystem that allowed customers to search, purchase, and manage medications efficiently while enabling real-time inventory synchronization across all stores.",

    challenge:
      "The platform needed to manage tens of thousands of pharmaceutical products while meeting strict healthcare compliance requirements. Additional challenges included maintaining accurate real-time stock availability, integrating prescription verification workflows, and supporting large-scale concurrent traffic.",

    solution:
      "Workholo engineered a high-performance web platform using Next.js and GraphQL technologies integrated with enterprise inventory and logistics systems. Advanced search capabilities, scalable backend infrastructure, and optimized checkout experiences enabled fast and reliable healthcare commerce operations.",

    galleryImages: [
      "/assets/projects/apotka-pharmacy-gallery-1.jpg",
      "/assets/projects/apotka-pharmacy-gallery-2.jpg",
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
        value: "40% Growth",
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
        title: "Pharmacy Locations Connected",
        description:
          "Workholo unified inventory and operational workflows across hundreds of physical pharmacy stores.",
      },
      {
        stat: "35%",
        title: "Increased Order Value",
        description:
          "Smart recommendation systems and streamlined user experiences improved overall customer purchasing behavior.",
      },
      {
        stat: "92%",
        title: "Mobile Platform Adoption",
        description:
          "The mobile-optimized platform significantly increased customer engagement through smartphones and tablets.",
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
        title: "Infrastructure & System Analysis",
        description:
          "Workholo evaluated existing pharmacy ERP systems and planned the digital migration architecture.",
      },
      {
        label: "Phase 2",
        title: "Core Commerce Platform Development",
        description:
          "The primary healthcare commerce engine, search systems, and prescription workflows were developed.",
      },
      {
        label: "Phase 3",
        title: "Enterprise Integrations",
        description:
          "Payment systems, healthcare databases, logistics providers, and loyalty systems were integrated.",
      },
      {
        label: "Phase 4",
        title: "Optimization & Scaling",
        description:
          "The platform was optimized for high traffic volumes, edge caching, and large-scale store synchronization.",
      },
    ],

    faqs: [
      {
        question: "How is sensitive prescription data protected?",
        answer:
          "Workholo implemented encrypted healthcare-grade security systems and compliance-focused data management processes.",
      },
      {
        question:
          "Can customers interact with physical pharmacy stores digitally?",
        answer:
          "Yes, the omnichannel ecosystem supports services such as in-store pickup, local inventory visibility, and store-based returns.",
      },
      {
        question: "How accurate is real-time inventory availability?",
        answer:
          "Inventory synchronization systems continuously update stock data across all connected pharmacy locations.",
      },
      {
        question: "Does the platform support healthcare institutions?",
        answer:
          "Yes, Workholo developed dedicated B2B procurement workflows for hospitals and institutional healthcare clients.",
      },
      {
        question: "How scalable is the platform infrastructure?",
        answer:
          "The cloud-native architecture was designed to support millions of users, high transaction volumes, and enterprise-level scalability.",
      },
    ],
  },
  "costa-express": {
    slug: "costa-express",
    title: "Costa Express",
    subtitle:
      "Workholo accelerated digital innovation for a global self-service coffee infrastructure.",
    category: "IoT & Automation",
    client: "Costa Coffee",
    duration: "Ongoing Partnership",

    description:
      "Workholo partnered with Costa Express to modernize and scale the digital ecosystem powering thousands of self-service coffee kiosks globally. The collaboration focused on IoT connectivity, kiosk software modernization, cloud infrastructure, and operational automation.",

    heroImage: "/assets/projects/costa-express.jpg",

    overview:
      "Costa Express required a scalable technology ecosystem capable of supporting rapid international expansion and continuous innovation across its self-service coffee network. Workholo provided a dedicated engineering model to enhance kiosk reliability, streamline operations, and improve real-time monitoring capabilities.",

    challenge:
      "The major challenge was modernizing legacy kiosk infrastructure while ensuring uninterrupted service availability across thousands of deployed units worldwide. The platform also needed scalable IoT monitoring, secure payment integrations, and efficient remote device management.",

    solution:
      "Workholo established a dedicated cross-functional engineering team that integrated directly with Costa Express operations. The team redesigned core kiosk software, improved IoT telemetry systems, and built scalable cloud-based APIs for diagnostics, monitoring, and inventory management.",

    galleryImages: [
      "/assets/projects/costa-express-gallery-1.jpg",
      "/assets/projects/costa-express-gallery-2.jpg",
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
        value: "+28%",
      },
      {
        label: "System Uptime",
        value: "99.98%",
      },
      {
        label: "Scale Capacity",
        value: "8x",
      },
    ],

    results: [
      {
        stat: "40%",
        title: "Faster Feature Deployment",
        description:
          "Workholo accelerated software rollout cycles and enabled faster deployment of new kiosk capabilities globally.",
      },
      {
        stat: "£250k",
        title: "Operational Cost Efficiency",
        description:
          "The dedicated engineering partnership reduced recruitment overhead and improved long-term development efficiency.",
      },
      {
        stat: "Intelligent",
        title: "Inventory Automation",
        description:
          "Real-time monitoring and predictive systems improved stock visibility and reduced operational waste across locations.",
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
        title: "Infrastructure Discovery",
        description:
          "Workholo analyzed the existing kiosk architecture and aligned technical workflows with Costa Express operational requirements.",
      },
      {
        label: "Phase 2",
        title: "Cloud & IoT Foundation",
        description:
          "A scalable Azure-based infrastructure was implemented to support high-volume IoT communication and remote operations.",
      },
      {
        label: "Phase 3",
        title: "Continuous Development Sprints",
        description:
          "Agile engineering cycles focused on payment systems, diagnostics, kiosk performance, and customer experience enhancements.",
      },
      {
        label: "Phase 4",
        title: "Global Deployment",
        description:
          "New platform capabilities and software updates were deployed remotely across the international kiosk network.",
      },
    ],

    faqs: [
      {
        question: "How did Workholo collaborate with Costa Express teams?",
        answer:
          "Workholo operated as an integrated engineering extension, collaborating through Agile workflows, sprint planning, and shared delivery processes.",
      },
      {
        question: "What was the most complex technical challenge?",
        answer:
          "Managing stable synchronization and monitoring across thousands of kiosks operating in different connectivity conditions worldwide.",
      },
      {
        question: "Did the partnership improve development speed?",
        answer:
          "Yes, the dedicated engineering model accelerated feature delivery and reduced the delays associated with traditional recruitment processes.",
      },
      {
        question: "How was system security maintained?",
        answer:
          "The platform implemented secure cloud infrastructure, encrypted communications, and compliance-focused payment security standards.",
      },
      {
        question: "Is Workholo still involved in the platform evolution?",
        answer:
          "Yes, the partnership continues to support ongoing innovation, infrastructure scaling, and new feature development.",
      },
    ],
  },
  "smith-nephew": {
    slug: "smith-nephew",
    title: "Smith+Nephew",
    subtitle:
      "Workholo developed a healthcare analytics platform for surgical data visualization and operational insights.",
    category: "AI & Data",
    client: "Smith & Nephew PLC",
    duration: "12 Months",

    description:
      "Workholo engineered a scalable healthcare analytics ecosystem that transforms complex surgical and operational hospital data into actionable insights for clinicians, administrators, and healthcare decision-makers.",

    heroImage: "/assets/projects/smith-nephew.jpg",

    overview:
      "Smith+Nephew required an advanced digital platform capable of consolidating surgical performance data across multiple healthcare systems. Workholo developed an intuitive analytics environment that enables healthcare providers to improve procedural planning, monitor clinical outcomes, and optimize operational efficiency through real-time visualization.",

    challenge:
      "The primary challenge involved aggregating fragmented healthcare datasets from multiple hospital systems while maintaining strict healthcare compliance standards. The platform also needed to deliver highly interpretable analytics dashboards for medical professionals operating in time-sensitive clinical environments.",

    solution:
      "Workholo built a high-performance analytics platform powered by .NET, Power BI, and cloud-native data processing systems. The solution included advanced data anonymization, scalable ETL pipelines, and interactive visualization dashboards optimized for real-time surgical analytics and healthcare reporting.",

    galleryImages: [
      "/assets/projects/smith-nephew-gallery-1.jpg",
      "/assets/projects/smith-nephew-gallery-2.jpg",
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
        value: "35M+",
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
        title: "Operational Efficiency Improvement",
        description:
          "Workholo enabled healthcare teams to make faster, data-driven clinical and operational decisions through advanced visualization systems.",
      },
      {
        stat: "Real-time",
        title: "Surgical Cost Visibility",
        description:
          "Administrators gained immediate access to procedural analytics and cost-performance insights across healthcare operations.",
      },
      {
        stat: "Scalable",
        title: "Healthcare Analytics Infrastructure",
        description:
          "The cloud-native platform successfully supported large-scale hospital data processing and multi-site deployment requirements.",
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
        title: "Compliance & Security Assessment",
        description:
          "Workholo conducted healthcare compliance audits and defined secure data governance workflows.",
      },
      {
        label: "Phase 2",
        title: "Healthcare Data Architecture",
        description:
          "Scalable ETL pipelines and centralized healthcare analytics infrastructure were engineered for multi-source data aggregation.",
      },
      {
        label: "Phase 3",
        title: "Clinical Dashboard Design",
        description:
          "Interactive dashboards were designed in collaboration with clinicians to ensure rapid interpretation of surgical insights.",
      },
      {
        label: "Phase 4",
        title: "Cloud Deployment & Pilot Testing",
        description:
          "The platform was deployed within a scalable cloud environment and validated through multi-hospital pilot programs.",
      },
    ],

    faqs: [
      {
        question: "How does Workholo ensure healthcare data compliance?",
        answer:
          "The platform incorporates encrypted data workflows, anonymization mechanisms, and compliance-focused healthcare security practices.",
      },
      {
        question: "Can the system process real-time healthcare analytics?",
        answer:
          "Yes, the infrastructure supports near real-time processing and visualization of active surgical and operational data streams.",
      },
      {
        question: "Who primarily uses the analytics platform?",
        answer:
          "The platform is designed for clinicians, surgical teams, healthcare administrators, and operational management staff.",
      },
      {
        question: "Does the platform integrate with hospital systems?",
        answer:
          "Yes, Workholo developed flexible APIs and secure integrations for interoperability with major healthcare and EMR systems.",
      },
      {
        question: "How scalable is the architecture?",
        answer:
          "The cloud-native infrastructure is optimized to support expansion across multiple healthcare facilities and large-scale datasets.",
      },
    ],
  },
  "infinitas-learning": {
    slug: "infinitas-learning",
    title: "Infinitas Learning",
    subtitle:
      "Workholo scaled digital education infrastructure through enterprise-grade EdTech transformation.",
    category: "Web Development",
    client: "Infinitas Learning",
    duration: "18 Months",

    description:
      "Workholo partnered with Infinitas Learning to modernize and scale their educational technology ecosystem by simultaneously delivering a large-scale Learning Management System, digital commerce infrastructure, and integrated payment platform.",

    heroImage: "/assets/projects/infinitas-learning.jpg",

    overview:
      "Infinitas Learning required a unified digital ecosystem capable of supporting large-scale educational operations across multiple countries. Workholo assembled and managed a dedicated engineering organization to accelerate development, migrate legacy educational content, and deliver highly scalable learning and commerce platforms.",

    challenge:
      "The primary challenge involved delivering multiple enterprise-grade platforms within strict academic deadlines while migrating years of legacy educational data. The system also needed to support hundreds of thousands of students and educators with high availability and seamless user experiences.",

    solution:
      "Workholo established a large-scale cross-functional engineering team that collaborated directly with Infinitas Learning stakeholders. Using a microservices-based architecture, the team developed scalable learning systems, integrated commerce workflows, and secure multi-currency payment infrastructure.",

    galleryImages: [
      "/assets/projects/infinitas-learning-gallery-1.jpg",
      "/assets/projects/infinitas-learning-gallery-2.jpg",
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
        value: "99.9%",
      },
      {
        label: "Platform Count",
        value: "3 Major",
      },
    ],

    results: [
      {
        stat: "100%",
        title: "On-time Academic Launch",
        description:
          "Workholo successfully delivered all critical platforms ahead of the academic launch schedule.",
      },
      {
        stat: "Unified",
        title: "Educational Data Ecosystem",
        description:
          "A centralized platform unified student data, educational content, and operational systems across regions.",
      },
      {
        stat: "Scalable",
        title: "Digital Commerce Growth",
        description:
          "The modernized commerce infrastructure improved scalability and optimized digital educational sales workflows.",
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
        title: "Engineering Team Expansion",
        description:
          "Workholo rapidly assembled and onboarded a large-scale engineering team to support accelerated delivery timelines.",
      },
      {
        label: "Phase 2",
        title: "Platform Architecture Design",
        description:
          "Scalable microservices architecture was designed to connect learning systems, payments, and commerce workflows.",
      },
      {
        label: "Phase 3",
        title: "Parallel Product Development",
        description:
          "Multiple product streams including LMS, e-commerce, and payment services were developed simultaneously.",
      },
      {
        label: "Phase 4",
        title: "High-Scale Production Launch",
        description:
          "Comprehensive performance testing and deployment preparations ensured stability during peak academic usage periods.",
      },
    ],

    faqs: [
      {
        question: "How did Workholo manage such a large engineering operation?",
        answer:
          "The delivery organization was structured into Agile cross-functional pods focused on specific educational and platform domains.",
      },
      {
        question: "How was legacy educational content migrated?",
        answer:
          "Workholo developed automated migration systems to securely transfer years of educational data and learning assets.",
      },
      {
        question:
          "Can the infrastructure support large student traffic volumes?",
        answer:
          "Yes, the Kubernetes-based cloud infrastructure automatically scales during peak enrollment and examination periods.",
      },
      {
        question: "Does the platform support multiple regions and languages?",
        answer:
          "Yes, the system supports multilingual educational experiences and region-specific curriculum requirements.",
      },
      {
        question: "How were payment systems secured?",
        answer:
          "Secure payment workflows were implemented using trusted payment providers and compliance-focused transaction infrastructure.",
      },
    ],
  },
  "fine-rare": {
    slug: "fine-rare",
    title: "Fine+Rare",
    subtitle:
      "Workholo modernized a luxury e-commerce ecosystem for premium wine and rare collectibles.",
    category: "Web Development",
    client: "Fine+Rare Wines Ltd",
    duration: "14 Months",

    description:
      "Workholo transformed Fine+Rare’s digital commerce platform by replacing legacy infrastructure with a scalable, high-performance luxury e-commerce ecosystem optimized for premium customer experiences and global growth.",

    heroImage: "/assets/projects/fine-rare.jpg",

    overview:
      "Fine+Rare required a modern digital platform capable of supporting luxury commerce operations, high-value transactions, and international collector experiences. Workholo designed a scalable architecture focused on performance, premium branding, and seamless inventory management for rare wines and spirits.",

    challenge:
      "The platform needed to modernize complex legacy business workflows involving auctions, global logistics, inventory synchronization, and high-value purchases. Additionally, the system had to deliver fast performance, advanced search capabilities, and a mobile-optimized luxury shopping experience.",

    solution:
      "Workholo engineered a headless e-commerce architecture powered by Node.js and React technologies. The platform included advanced search systems, real-time warehouse synchronization, personalized member experiences, and scalable cloud infrastructure optimized for premium digital commerce.",

    galleryImages: [
      "/assets/projects/fine-rare-gallery-1.jpg",
      "/assets/projects/fine-rare-gallery-2.jpg",
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
        value: "75%",
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
        title: "Digital Revenue Growth",
        description:
          "Workholo delivered a scalable commerce platform that significantly accelerated online sales performance.",
      },
      {
        stat: "Premium",
        title: "Luxury Customer Experience",
        description:
          "The redesigned digital experience enhanced brand perception through modern, high-performance interfaces.",
      },
      {
        stat: "Scalable",
        title: "Modernized Technology Stack",
        description:
          "The new cloud-native architecture reduced technical complexity and enabled faster business operations.",
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
        title: "Digital Experience Strategy",
        description:
          "Workholo defined the premium digital commerce experience and modern platform architecture.",
      },
      {
        label: "Phase 2",
        title: "Commerce Platform Development",
        description:
          "Core commerce systems, inventory workflows, and transaction infrastructure were engineered.",
      },
      {
        label: "Phase 3",
        title: "Search & Customer Experience",
        description:
          "Advanced search systems and responsive luxury storefront interfaces were implemented.",
      },
      {
        label: "Phase 4",
        title: "Migration & Global Launch",
        description:
          "Legacy customer records, inventory systems, and commerce workflows were securely migrated to the new platform.",
      },
    ],

    faqs: [
      {
        question:
          "Does the platform integrate with warehouse logistics systems?",
        answer:
          "Yes, Workholo implemented real-time synchronization with global inventory and warehouse management systems.",
      },
      {
        question: "Can the platform support auction-based sales?",
        answer:
          "Yes, custom auction workflows and bidding systems were developed for premium collectible products.",
      },
      {
        question: "What technologies power the platform?",
        answer:
          "The ecosystem was built using a modern headless architecture powered by Node.js, React, and scalable AWS infrastructure.",
      },
      {
        question: "How did the modernization improve SEO performance?",
        answer:
          "The optimized frontend architecture significantly improved site speed, indexing performance, and search visibility.",
      },
      {
        question: "Can the internal business team manage the platform easily?",
        answer:
          "Yes, the platform was designed with operational flexibility and streamlined management workflows for internal teams.",
      },
    ],
  },
  "david-lloyd-leisure": {
    slug: "david-lloyd-leisure",
    title: "David Lloyd Leisure Mobile App",
    subtitle:
      "Workholo transformed the digital fitness experience for hundreds of thousands of active members.",
    category: "Mobile Development",
    client: "David Lloyd Leisure",
    duration: "12 Months",

    description:
      "Workholo partnered with David Lloyd Leisure to rebuild and modernize their mobile ecosystem, delivering a high-performance member application focused on seamless booking experiences, personalized fitness engagement, and scalable digital infrastructure.",

    heroImage: "/assets/projects/david-lloyd-leisure.jpg",

    overview:
      "David Lloyd Leisure required a modern mobile platform capable of supporting large-scale member engagement across its European fitness clubs. Workholo developed a unified application that streamlined bookings, improved digital interactions, and enhanced the overall fitness journey through personalized experiences and real-time club services.",

    challenge:
      "The existing legacy systems struggled with high booking traffic during peak class release periods, resulting in slow performance and inconsistent user experiences. Additionally, the outdated infrastructure lacked the scalability and premium design expected by modern fitness members.",

    solution:
      "Workholo engineered a scalable React Native application backed by cloud-native microservices and GraphQL APIs. The platform was optimized for high-concurrency booking events, fast data synchronization, and responsive mobile experiences even during heavy traffic surges.",

    galleryImages: [
      "/assets/projects/david-lloyd-leisure-gallery-1.jpg",
      "/assets/projects/david-lloyd-leisure-gallery-2.jpg",
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
        value: "75%",
      },
      {
        label: "Booking Speed",
        value: "50% faster",
      },
      {
        label: "Monthly Sessions",
        value: "1.5M+",
      },
    ],

    results: [
      {
        stat: "99.99%",
        title: "Peak-Time Platform Stability",
        description:
          "Workholo successfully optimized the infrastructure to handle extreme booking traffic spikes without downtime.",
      },
      {
        stat: "220k",
        title: "Daily Active Users",
        description:
          "The modernized mobile platform significantly increased daily digital engagement across fitness members.",
      },
      {
        stat: "£1.2M",
        title: "Operational Efficiency Gains",
        description:
          "Automated self-service workflows reduced operational pressure on in-club staff and support teams.",
      },
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
        title: "Digital Experience Discovery",
        description:
          "Workholo analyzed member journeys, booking behaviors, and existing infrastructure limitations.",
      },
      {
        label: "Phase 2",
        title: "Scalable Architecture Design",
        description:
          "Cloud-native backend systems and high-availability APIs were designed for large-scale member usage.",
      },
      {
        label: "Phase 3",
        title: "Mobile Platform Development",
        description:
          "Agile development cycles focused on booking workflows, personalization features, and UI/UX optimization.",
      },
      {
        label: "Phase 4",
        title: "Deployment & Optimization",
        description:
          "The platform was gradually rolled out across fitness clubs with continuous monitoring and performance tuning.",
      },
    ],

    faqs: [
      {
        question: "How did Workholo handle booking traffic spikes?",
        answer:
          "The platform utilized scalable serverless infrastructure, optimized caching layers, and distributed cloud services to maintain stable performance during peak booking periods.",
      },
      {
        question:
          "Does the application support multiple regions and languages?",
        answer:
          "Yes, the mobile platform includes localization support for multiple European markets and multilingual user experiences.",
      },
      {
        question: "Can the app integrate with physical club systems?",
        answer:
          "Yes, Workholo integrated the application with secure club access systems using encrypted QR-based authentication.",
      },
      {
        question: "How is member information secured?",
        answer:
          "The platform uses enterprise-grade encryption, secure authentication protocols, and protected cloud infrastructure for sensitive member data.",
      },
      {
        question: "Does the app provide fitness progress tracking?",
        answer:
          "Yes, interactive analytics and workout tracking features allow members to monitor fitness consistency and personal progress visually.",
      },
    ],
  },
  "rspb-digital-transformation": {
    slug: "rspb-digital-transformation",
    title: "RSPB Nature on Your Doorstep",
    subtitle:
      "Engaging a new generation of conservationists via digital innovation.",
    category: "Web Development",
    client: "RSPB",
    duration: "18 Months",
    description:
      "Workholo lead a large-scale digital transformation to modernize the RSPB’s online presence, creating an interactive platform to encourage biodiversity in UK gardens.",
    heroImage: "/assets/projects/rspb-digital-transformation.jpg",
    overview:
      "The RSPB needed to move beyond traditional donor management into a mission-driven digital platform. 'Nature on Your Doorstep' was designed to provide personalized, localized advice to millions of UK citizens.",
    challenge:
      "The organization had multiple siloed databases and an aging CMS that made personalization impossible and data management inefficient.",
    solution:
      "Workholo built a centralized data platform and a modern web experience using Python/Django and React. The system utilizes geolocation to provide weather-dependent gardening tips tailored to the user's specific region.",
    galleryImages: [
      "/assets/projects/rspb-digital-transformation-gallery-1.jpg",
      "/assets/projects/rspb-digital-transformation-gallery-2.jpg",
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
        value: "100k+",
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
        description:
          "Massive reach for the seasonal 'Big Garden Birdwatch' campaigns.",
      },
      {
        stat: "65%",
        title: "Donor Retention",
        description:
          "Improved retention through personalized digital storytelling.",
      },
      {
        stat: "£800k",
        title: "Cost Reduction",
        description:
          "Savings achieved through cloud migration and automated data processing.",
      },
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
        description:
          "Identifying and consolidating fragmented member data sources.",
      },
      {
        label: "Phase 2",
        title: "Platform MVP",
        description:
          "Building the core advocacy engine and personalized activity algorithm.",
      },
      {
        label: "Phase 3",
        title: "Scaling & CRM",
        description:
          "Integrating the web platform with the central RSPB CRM system.",
      },
      {
        label: "Phase 4",
        title: "Nationwide Launch",
        description:
          "Rolling out the platform ahead of peak spring conservation season.",
      },
    ],
    faqs: [
      {
        question: "How does the localization work?",
        answer:
          "The platform uses IP-based geolocation and postcode lookup to fetch local environmental data.",
      },
      {
        question: "Is the platform accessible to all users?",
        answer:
          "Absolutely, it was built to meet WCAG 2.1 AA standards for maximum inclusion.",
      },
      {
        question: "Can users upload their own data?",
        answer:
          "Yes, members can record sightings and activity completion which contributes to national research.",
      },
      {
        question: "How is donor privacy handled?",
        answer:
          "All data is managed in accordance with GDPR and Cyber Essentials Plus certifications.",
      },
      {
        question: "Is the tech stack scalable for TV campaigns?",
        answer:
          "Yes, the AWS infrastructure auto-scales to handle massive spikes during live broadcasts.",
      },
    ],
  },
  "bbc-academy-platform": {
    slug: "bbc-academy-platform",
    title: "BBC Academy Learning Platform",
    subtitle:
      "A professional educational ecosystem for global content creators.",
    category: "Web Development",
    client: "BBC",
    duration: "10 Months",
    description:
      "Workholo engineered a scalable, highly accessible learning management system to host the BBC's internal and partner training content across video, text, and interactive assessments.",
    heroImage: "/assets/projects/bbc-academy-platform.jpg",
    overview:
      "The BBC Academy required a modern digital hub to deliver training to staff and external partners. The platform needed to be robust enough to serve thousands of concurrent users while maintaining strict accessibility standards.",
    challenge:
      "The previous system was difficult to navigate on mobile devices and struggled with high-bitrate video delivery across disparate global networks.",
    solution:
      "Workholo developed a serverless architecture using AWS and a React-based frontend. We leveraged AWS CloudFront and Elemental MediaConvert to ensure smooth video delivery regardless of user location or bandwidth.",
    galleryImages: [
      "/assets/projects/bbc-academy-platform-gallery-1.jpg",
      "/assets/projects/bbc-academy-platform-gallery-2.jpg",
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
        value: "35k+",
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
        value: "99.5%",
      },
    ],
    results: [
      {
        stat: "15k",
        title: "Monthly Certifications",
        description:
          "Significant throughput of staff completing regulated training.",
      },
      {
        stat: "78%",
        title: "Mobile Engagement",
        description:
          "Drastic increase in training completed on mobile devices via the new UI.",
      },
      {
        stat: "Zero",
        title: "Downtime Incidents",
        description:
          "Maintained perfect availability since the migration to serverless.",
      },
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
        description:
          "In-depth workshops with BBC trainers and global staff members.",
      },
      {
        label: "Phase 2",
        title: "UI Implementation",
        description:
          "Developing an accessible, high-performance frontend components library.",
      },
      {
        label: "Phase 3",
        title: "Media Backend",
        description:
          "Engineering the video transcoding and delivery pipeline on AWS.",
      },
      {
        label: "Phase 4",
        title: "Content Migration",
        description:
          "Migrating over 10 years of training content into the new system.",
      },
    ],
    faqs: [
      {
        question: "How do you handle high-definition video?",
        answer:
          "We use AWS Elemental to transcode video into multiple formats, serving the best one for the user's connection.",
      },
      {
        question: "Is the platform accessible to screen readers?",
        answer:
          "Yes, the entire platform is optimized for AT users and adheres to triple-A accessibility standards where possible.",
      },
      {
        question: "Can external partners access the training?",
        answer:
          "Yes, we implemented a tiered authentication system for internal and external users.",
      },
      {
        question: "How is progress tracked?",
        answer:
          "We use a custom xAPI implementation to track granular learning actions across the site.",
      },
      {
        question: "Does it support live webinars?",
        answer:
          "The platform integrates with major live-streaming tools for real-time educational events.",
      },
    ],
  },
  "moj-claims-digitisation": {
    slug: "moj-claims-digitisation",
    title: "Ministry of Justice Claims Portal",
    subtitle:
      "Digitising the UK justice system for efficient, secure public service.",
    category: "Cloud & DevOps",
    client: "Ministry of Justice",
    duration: "24 Months",
    description:
      "Workholo spearheaded the digital transformation of a critical legal claims portal, replacing legacy paper processes with a secure, user-centric cloud platform.",
    heroImage: "/assets/projects/moj-claims-digitisation.jpg",
    overview:
      "The Ministry of Justice (MoJ) sought to modernize the way legal claims are submitted and processed. The goal was to reduce administrative overhead and increase transparency for both citizens and legal professionals.",
    challenge:
      "The system required extreme security due to the sensitive nature of legal data, along with strict adherence to GDS (Government Digital Service) standards.",
    solution:
      "Workholo deployed a Ruby on Rails application using a robust microservices architecture. By implementing Infrastructure as Code (IaC) with Terraform, we created a repeatable, highly secure environment across several AWS regions.",
    galleryImages: [
      "/assets/projects/moj-claims-digitisation-gallery-1.jpg",
      "/assets/projects/moj-claims-digitisation-gallery-2.jpg",
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
        value: "50% faster",
      },
      {
        label: "Admin Savings",
        value: "£2M+",
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
        description:
          "Record-high satisfaction ratings for a UK government digital service.",
      },
      {
        stat: "£3.5M",
        title: "Annual Cloud Tech Savings",
        description:
          "Significant reduction in infrastructure costs via optimized cloud usage.",
      },
      {
        stat: "90%",
        title: "Reduced Error Rate",
        description:
          "Validation engines significantly reduced the number of invalid claim submissions.",
      },
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
        description:
          "Prototyping and testing core concepts with real users and legal experts.",
      },
      {
        label: "Phase 2",
        title: "Beta Development",
        description:
          "Building the full claims engine and implementing Gov.UK Design System.",
      },
      {
        label: "Phase 3",
        title: "Security Hardening",
        description:
          "Rigorous penetration testing and compliance auditing for legal data.",
      },
      {
        label: "Phase 4",
        title: "National Launch",
        description:
          "Successfully transitioning all live claims to the new digital platform.",
      },
    ],
    faqs: [
      {
        question: "How is the sensitive legal data secured?",
        answer:
          "We use field-level encryption and strict IAM policies combined with continuous automated scanning.",
      },
      {
        question: "Does it follow GDS design standards?",
        answer:
          "Yes, every component is mapped directly to the Gov.UK design patterns for consistency.",
      },
      {
        question: "How do legal pros verify their identity?",
        answer:
          "The platform integrates with several identity providers including secure government gateways.",
      },
      {
        question: "Can the system handle surges in litigation?",
        answer:
          "The Kubernetes-based infrastructure scales automatically based on queue depth and CPU usage.",
      },
      {
        question: "Is there an API for law firms?",
        answer:
          "Yes, we provide a RESTful API with automated documentation for large-scale legal integrations.",
      },
    ],
  },
  "virgin-money-pulse": {
    slug: "virgin-money-pulse",
    title: "Pulse: The Future of Digital Banking",
    subtitle:
      "Revolutionising mobile banking for millions of customers across the UK.",
    category: "Mobile Development",
    client: "Virgin Money",
    duration: "18 Months",
    description:
      "A comprehensive digital transformation project aimed at unifying the retail banking experience into a single, high-performance mobile application.",
    heroImage: "/assets/projects/virgin-money-pulse.jpg",
    overview:
      "Workholo collaborated with Virgin Money to design, build, and deploy a next-generation mobile banking experience. The primary goal was to replace legacy systems with a modern, scalable architecture that could support millions of concurrent users while delivering a premium, intuitive UI.",
    challenge:
      "The existing mobile offering was hardware-limited and fragmented across different services. Virgin Money needed a solution that consolidated personal, savings, and credit accounts into one seamless interface while adhering to strict Open Banking regulations and high-security standards.",
    solution:
      "Workholo implemented a React Native architecture for rapid cross-platform deployment without compromising on native performance. Our teams focused on micro-frontend integration, biometrics (FaceID/TouchID), and real-time transaction processing using a robust AWS-backed infrastructure.",
    galleryImages: [
      "/assets/projects/virgin-money-pulse-gallery-1.jpg",
      "/assets/projects/virgin-money-pulse-gallery-2.jpg",
    ],
    features: [
      "Biometric Authentication & SCA",
      "Real-time Spending Analytics",
      "Instant Account-to-Account Transfers",
      "In-app Digital Customer Support",
      "Nectar Points Rewards Integration",
      "Personalized Financial Goal Tracking",
      "Secure Document Vault",
      "Advanced Encryption & Data Masking",
    ],
    metrics: [
      {
        label: "App Store Rating",
        value: "4.8/5.0",
      },
      {
        label: "Active Users",
        value: "2.5M+",
      },
      {
        label: "Engagement Increase",
        value: "42%",
      },
      {
        label: "System Uptime",
        value: "99.95%",
      },
    ],
    results: [
      {
        stat: "60%",
        title: "Cost Reduction",
        description:
          "Significant decrease in legacy system maintenance costs post-launch.",
      },
      {
        stat: "15s",
        title: "Fast Onboarding",
        description:
          "Average time for new customers to set up and verify their accounts.",
      },
      {
        stat: "3.2x",
        title: "UX Improvement",
        description:
          "Measured increase in user satisfaction scores compared to the legacy app.",
      },
    ],
    techStack: [
      "React Native",
      "TypeScript",
      "Node.js",
      "AWS Lambda",
      "Adobe Analytics",
      "Swift",
      "Kotlin",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Strategy",
        description:
          "Deep-dive workshops to align business goals with user needs and regulatory requirements.",
      },
      {
        label: "Phase 2",
        title: "Design & Prototyping",
        description:
          "Iterative UX/UI design focusing on accessibility and seamless financial journeys.",
      },
      {
        label: "Phase 3",
        title: "Agile Development",
        description:
          "Continuous integration and delivery of core banking features in two-week sprints.",
      },
      {
        label: "Phase 4",
        title: "Security & Scale",
        description:
          "Rigorous penetration testing and load testing to ensure enterprise-grade stability.",
      },
    ],
    faqs: [
      {
        question: "How did you ensure compliance with banking regulations?",
        answer:
          "We integrated automated compliance checks and strictly followed PSD2 and Open Banking standards throughout the development lifecycle.",
      },
      {
        question: "What was the approach to data security?",
        answer:
          "We utilized hardware-backed keystores, end-to-end encryption, and dynamic certificate pinning to prevent data intercepts.",
      },
      {
        question: "How does the app handle high traffic periods?",
        answer:
          "The backend is hosted on a serverless AWS infrastructure that auto-scales based on real-time demand peaks.",
      },
      {
        question: "Was user migration from legacy apps handled?",
        answer:
          "Yes, we developed a seamless migration bridge that moved user credentials and history without session loss.",
      },
      {
        question: "Is the app accessible for all users?",
        answer:
          "The application strictly adheres to WCAG 2.1 AA standards, ensuring full compatibility with screen readers.",
      },
    ],
  },
  "royal-london-pensions": {
    slug: "royal-london-pensions",
    title: "Modernizing Pension Management",
    subtitle:
      "Empowering 1.5 million members to take control of their retirement future.",
    category: "Mobile Development",
    client: "Royal London",
    duration: "14 Months",
    description:
      "A digital-first membership platform designed to simplify complex pension data and improve long-term financial engagement.",
    heroImage: "/assets/projects/royal-london-pensions.jpg",
    overview:
      "Workholo engaged with Royal London to bridge the gap between traditional pension services and modern mobile expectations. The project involved creating a member-centric app that allows users to view, manage, and project their retirement savings in real-time.",
    challenge:
      "Pension data is historically complex and often siloed. The challenge was to create a unified API layer that could securely fetch data from various legacy engines and present it in a digestible, actionable format for non-expert users.",
    solution:
      "Workholo built a secure, mobile-optimized portal using a GraphQL middleware layer to aggregate data. The app features interactive projection tools, digital nomination forms, and a secure document library, all wrapped in a highly accessible UI.",
    galleryImages: [
      "/assets/projects/royal-london-pensions-gallery-1.jpg",
      "/assets/projects/royal-london-pensions-gallery-2.jpg",
    ],
    features: [
      "Real-time Fund Tracking",
      "Interactive Retirement Forecaster",
      "Secure Digital Document Store",
      "Beneficiary Management",
      "Push Notification Alerts",
      "Biometric Face/Touch ID",
      "ESG Investment Preferences",
      "Direct Messaging with Support",
    ],
    metrics: [
      {
        label: "Members Onboarded",
        value: "1.5M",
      },
      {
        label: "Call Center Reduction",
        value: "50%",
      },
      {
        label: "User Happiness",
        value: "94%",
      },
      {
        label: "Daily Logins",
        value: "85k+",
      },
    ],
    results: [
      {
        stat: "25%",
        title: "Higher Retention",
        description:
          "Increased member stickiness through personalized retirement insights.",
      },
      {
        stat: "12min",
        title: "Efficiency Gain",
        description:
          "Reduced average time taken for users to find and download annual statements.",
      },
      {
        stat: "4.7/5",
        title: "Store Rating",
        description:
          "One of the highest-rated pension management apps in the UK market.",
      },
    ],
    techStack: [
      "React Native",
      "GraphQL",
      "Azure Cloud",
      "OpenID Connect",
      "TypeScript",
      "Python",
      "PostgreSQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Data Audit & UX Audit",
        description:
          "Comprehensive review of legacy data structures and existing member pain points.",
      },
      {
        label: "Phase 2",
        title: "UI Framework Design",
        description:
          "Creation of a modular design system tailored for high trust and financial clarity.",
      },
      {
        label: "Phase 3",
        title: "Core Feature Build",
        description:
          "Developing the projection engine and secure data integration layers.",
      },
      {
        label: "Phase 4",
        title: "Member Beta & Launch",
        description:
          "Phased rollout to selected member groups followed by a full nationwide launch.",
      },
    ],
    faqs: [
      {
        question: "How accurate are the retirement projections?",
        answer:
          "The app uses live actuarial models synced hourly with the core Royal London policy engines for maximum precision.",
      },
      {
        question: "Is personal financial data stored on the device?",
        answer:
          "No, sensitive data is decrypted in memory and never persisted on the physical device storage.",
      },
      {
        question: "Can users switch their investment funds in-app?",
        answer:
          "Yes, the app provides a full fund-switching interface with real-time risk profiling.",
      },
      {
        question: "How are the push notifications used?",
        answer:
          "Notifications keep members informed about market changes, annual statements, and security alerts.",
      },
      {
        question: "Is the app available on tablet devices?",
        answer:
          "The UI is fully responsive and optimized for both iOS and Android smartphones and tablets.",
      },
    ],
  },
  "scottishpower-yourenergy": {
    slug: "scottishpower-yourenergy",
    title: "YourEnergy: Smart Home Management",
    subtitle:
      "Harnessing IoT and real-time data to revolutionize energy consumption.",
    category: "Mobile Development",
    client: "ScottishPower",
    duration: "24 Months",
    description:
      "An innovative smart home application that integrates with smart meters to provide real-time usage insights and carbon footprint tracking.",
    heroImage: "/assets/projects/scottishpower-yourenergy.jpg",
    overview:
      "Workholo worked with ScottishPower to build an industry-leading utility app that moves beyond billing. YourEnergy allows users to monitor their live energy spend, manage smart home devices, and optimize their consumption for both cost and environmental impact.",
    challenge:
      "Integrating with the national Smart Meter infrastructure (DCC) while handling massive data throughput was the primary hurdle. The app needed to process billions of data points daily while maintaining a fast, responsive user experience.",
    solution:
      "Workholo developed a native mobile suite using Swift and Kotlin, backed by an AWS IoT Core infrastructure. The solution includes real-time data streaming, predictive cost algorithms, and a seamless billing integration via a modern API gateway.",
    galleryImages: [
      "/assets/projects/scottishpower-yourenergy-gallery-1.jpg",
      "/assets/projects/scottishpower-yourenergy-gallery-2.jpg",
    ],
    features: [
      "Live Smart Meter Sync",
      "Predictive Billing Insights",
      "EV Charger Integration",
      "Solar Generation Tracking",
      "Carbon Footprint Calculator",
      "In-app Bill Payments",
      "Smart Alerts for High Usage",
      "Direct-to-Engineer Booking",
    ],
    metrics: [
      {
        label: "IoT Connectivity",
        value: "1.2M Devices",
      },
      {
        label: "Visibility Gain",
        value: "30%",
      },
      {
        label: "Peak Load handling",
        value: "50k req/sec",
      },
      {
        label: "Active Users",
        value: "800k+",
      },
    ],
    results: [
      {
        stat: "£120",
        title: "Annual Savings",
        description:
          "Average estimated saving per user through usage optimization alerts.",
      },
      {
        stat: "15%",
        title: "Carbon Reduction",
        description:
          "Measured reduction in average peak-time electricity demand among app users.",
      },
      {
        stat: "Sub-1s",
        title: "Data Latency",
        description:
          "Industry-leading time from smart meter reading to mobile UI update.",
      },
    ],
    techStack: [
      "Native iOS (Swift)",
      "Native Android (Kotlin)",
      "AWS IoT Core",
      "Python",
      "Redis",
      "Kinesis Data Streams",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "IoT Architecture Design",
        description:
          "Mapping the secure data flow between meters, cloud, and mobile clients.",
      },
      {
        label: "Phase 2",
        title: "Data Processing Engine",
        description:
          "Building the scalable backend capable of handling billions of telemetry pings.",
      },
      {
        label: "Phase 3",
        title: "Mobile Native Build",
        description:
          "Developing high-fidelity UI/UX with smooth charting and real-time updates.",
      },
      {
        label: "Phase 4",
        title: "Network Integration",
        description:
          "Final testing with national DCC infrastructure and rollout across the UK.",
      },
    ],
    faqs: [
      {
        question: "How does the app connect to my meter?",
        answer:
          "The app connects securely via the national smart meter network, requiring only your account details for verification.",
      },
      {
        question: "Does it work with electric vehicle chargers?",
        answer:
          "Yes, it integrates with major EV charger brands to allow for smart charging during off-peak hours.",
      },
      {
        question: "Is my usage data shared with third parties?",
        answer:
          "No, your data is used strictly for your own insights and billed accounts, protected by GDPR.",
      },
      {
        question: "Can I use the app if I don't have a smart meter?",
        answer:
          "You can still manage your account and bills, but live usage insights require a secondary smart meter.",
      },
      {
        question: "How frequent are the data updates?",
        answer:
          "Usage data is refreshed every 30 minutes for electricity and every hour for gas, as per industry standards.",
      },
    ],
  },
  "smith-nephew-orthopaedics": {
    slug: "smith-nephew-orthopaedics",
    title: "Precision Surgery: AI Knee Mapping",
    subtitle:
      "Revolutionizing surgical planning with computer vision and 3D topology.",
    category: "AI & Data",
    client: "Smith & Nephew",
    duration: "20 Months",
    description:
      "A groundbreaking clinical tool that uses AI to map patient-specific knee topology, assisting surgeons in high-precision procedure planning.",
    heroImage: "/assets/projects/smith-nephew-orthopaedics.jpg",
    overview:
      "Workholo partnered with Smith & Nephew to digitize the surgical planning process. By leveraging advanced Computer Vision, we developed a system that analyzes DICOM medical imaging to create a perfect 1:1 digital twin of a patient's knee structure.",
    challenge:
      "Surgical planning for knee replacements was traditionally manual and prone to minor measurement errors. The system needed 99.9% accuracy and had to comply with strict medical device regulations (MDR Class II) while delivering real-time 3D performance.",
    solution:
      "Workholo built an AI-centric platform using TensorFlow for anatomical segmentation and specialized OpenGL wrappers for real-time 3D visualization on iPad Pro devices used in operating theaters.",
    galleryImages: [
      "/assets/projects/smith-nephew-orthopaedics-gallery-1.jpg",
      "/assets/projects/smith-nephew-orthopaedics-gallery-2.jpg",
    ],
    features: [
      "AI Anatomical Segmentation",
      "Real-time 3D Model Viz",
      "DICOM Image Processing",
      "Pre-operative Plan Sync",
      "Surgical Guide Export",
      "Offline Data Processing",
      "HIPAA/MDR Compliance Layer",
      "Multi-planar Reconstruction",
    ],
    metrics: [
      {
        label: "Mapping Accuracy",
        value: "99.8%",
      },
      {
        label: "Planning Time",
        value: "-30%",
      },
      {
        label: "Procedures Assisted",
        value: "10,000+",
      },
      {
        label: "Cloud Latency",
        value: "<100ms",
      },
    ],
    results: [
      {
        stat: "20min",
        title: "Time Saved",
        description:
          "Average reduction in planning time per surgical case for clinicians.",
      },
      {
        stat: "Zero",
        title: "Data Errors",
        description:
          "Manual measurement errors were eliminated via automated AI mapping.",
      },
      {
        stat: "14 Countries",
        title: "Global Reach",
        description:
          "Successfully deployed to leading orthopaedic centers in 14 markets.",
      },
    ],
    techStack: [
      "Python",
      "TensorFlow",
      "React Native",
      "Azure Health Data",
      "OpenGL / WebGL",
      "C++ Engine",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Algorithm Training",
        description:
          "Training the AI models on 100k+ anonymized DICOM datasets for peak accuracy.",
      },
      {
        label: "Phase 2",
        title: "Regulatory Prototyping",
        description:
          "Building the MVP in accordance with ISO 13485 and MDR quality standards.",
      },
      {
        label: "Phase 3",
        title: "Clinical Validation",
        description:
          "Conducting trial runs with expert surgeons to refine the 3D interaction model.",
      },
      {
        label: "Phase 4",
        title: "Global Deployment",
        description:
          "Rolling out the finalized platform to medical centers across Europe and the US.",
      },
    ],
    faqs: [
      {
        question: "Is the AI approved for clinical use?",
        answer:
          "The platform has achieved MDR Class II certification for use in clinical environments.",
      },
      {
        question: "Can it handle low-quality MRI/CT scans?",
        answer:
          "The AI includes a pre-processing layer that enhances and denoises medical images before analysis.",
      },
      {
        question: "Is patient data stored in the cloud?",
        answer:
          "Data is processed on Azure Health Data Services with strict anonymization and encryption at rest.",
      },
      {
        question: "Can surgeons override the AI mapping?",
        answer:
          "Yes, the tool is a decision-support system; surgeons can manually adjust any mapping point.",
      },
      {
        question: "Does it integrate with hospital PACS?",
        answer:
          "It uses standard DICOM communication protocols to pull and push data directly from existing systems.",
      },
    ],
  },
  "winchester-college": {
    slug: "winchester-college",
    title: "Winchester College",
    subtitle: "Sports Management Transformation",
    category: "Web Development",
    client: "Winchester College",
    duration: "8 Months",
    description:
      "A comprehensive web-based management system to streamline the booking and administrative operations of Winchester College's world-class sports facilities.",
    heroImage: "/assets/projects/winchester-college.jpg",
    overview:
      "Winchester College required a modern, unified platform to manage their extensive sports facilities. The project involved digitizing manual processes and providing a seamless experience for both internal staff and external community users.",
    challenge:
      "The college relied on fragmented, paper-based systems for managing sports hall bookings, memberships, and financial reconciliation. This led to significant administrative overhead, high risk of double-bookings, and difficulties in reporting accurate financial data.",
    solution:
      "GoodCore engineered a bespoke CRM and scheduling portal featuring a real-time availability engine, integrated payment processing, and automated reporting. The system provides role-based access for staff, students, and external associations to manage their bookings independently.",
    galleryImages: [
      "/assets/projects/winchester-college-gallery-1.jpg",
      "/assets/projects/winchester-college-gallery-2.jpg",
    ],
    features: [
      "Real-time Booking Engine",
      "Automated Invoicing & Payments",
      "Membership Management Module",
      "Access Control Integration",
      "Advanced Reporting Dashboard",
      "Staff Scheduling Workflow",
      "Parent & Student Portals",
      "Mobile-Responsive Interface",
    ],
    metrics: [
      {
        label: "Admin Efficiency",
        value: "30%",
      },
      {
        label: "Facility Utilization",
        value: "25%",
      },
      {
        label: "Booking Accuracy",
        value: "99.9%",
      },
      {
        label: "Active Users",
        value: "10k+",
      },
    ],
    results: [
      {
        stat: "40%",
        title: "Process Improvement",
        description:
          "Eliminated manual data entry and consolidated fragmented schedules into a single source of truth.",
      },
      {
        stat: "25%",
        title: "Revenue Growth",
        description:
          "Increased external facility utilization by enabling self-service bookings for community organizations.",
      },
      {
        stat: "100%",
        title: "Compliance",
        description:
          "Ensured precise financial auditing and data protection compliance across all athletic departments.",
      },
    ],
    techStack: [
      ".NET Core",
      "React.js",
      "SQL Server",
      "Azure Cloud",
      "Stripe API",
      "Redis",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Planning",
        description:
          "Mapping complex institutional workflows and stakeholder requirements gathering.",
      },
      {
        label: "Phase 2",
        title: "Design & Prototyping",
        description:
          "Iterative UI/UX design focusing on administrative efficiency and ease of use.",
      },
      {
        label: "Phase 3",
        title: "Core Development",
        description:
          "Engineering the scheduling logic and integrating with campus-wide access systems.",
      },
      {
        label: "Phase 4",
        title: "UAT & Deployment",
        description:
          "Rigorous testing, staff training, and full-scale campus rollout.",
      },
    ],
    faqs: [
      {
        question: "How does the system prevent double bookings?",
        answer:
          "The platform uses a synchronized locking mechanism that validates availability across multiple schedules in real-time.",
      },
      {
        question: "Can external organizations use the system?",
        answer:
          "Yes, a dedicated portal allows external parties to book and pay for facilities independently.",
      },
      {
        question: "Is it integrated with existing systems?",
        answer:
          "The system features a robust API layer that allows for seamless data exchange with existing institutional software.",
      },
      {
        question: "How secure is user payment data?",
        answer:
          "All transactions are processed via Stripe, ensuring full PCI DSS compliance without storing sensitive data locally.",
      },
      {
        question: "Does it support mobile devices?",
        answer:
          "The intuitive interface is fully responsive, catering to staff and students on both desktop and mobile platforms.",
      },
    ],
  },
  "gc-business-finance": {
    slug: "gc-business-finance",
    title: "GC Business Finance",
    subtitle: "Enterprise Loan Underwriting Platform",
    category: "AI & Data",
    client: "GC Business Finance",
    duration: "12 Months",
    description:
      "An advanced end-to-end loan management system designed to automate financial underwriting, compliance checks, and disbursement workflows.",
    heroImage: "/assets/projects/gc-business-finance.jpg",
    overview:
      "The project aimed to transform a manual lending process into a data-driven digital experience. The platform supports the entire loan lifecycle from initial application to final repayment tracking.",
    challenge:
      "Manual processing of loan applications was slow and prone to error. The client needed to scale their lending capacity during economic shifts while maintaining rigorous risk assessments and compliance standards.",
    solution:
      "We developed a secure, cloud-hosted platform featuring automated credit scoring, integrated KYC/AML checks, and a sophisticated workflow engine that routes applications based on complex underwriting criteria.",
    galleryImages: [
      "/assets/projects/gc-business-finance-gallery-1.jpg",
      "/assets/projects/gc-business-finance-gallery-2.jpg",
    ],
    features: [
      "Automated Underwriting Engine",
      "KYC/AML API Integrations",
      "Real-time Credit Scoring",
      "Document Management System",
      "Compliance Auditing Suite",
      "Financial Reporting Tools",
      "Borrower Self-Service Portal",
      "Multi-tier Approval Workflow",
    ],
    metrics: [
      {
        label: "Decision Speed",
        value: "50%",
      },
      {
        label: "Manual Entry Reduc.",
        value: "90%",
      },
      {
        label: "Total Processing",
        value: "£50M+",
      },
      {
        label: "API Connections",
        value: "15+",
      },
    ],
    results: [
      {
        stat: "3x",
        title: "Scale Capacity",
        description:
          "Enabled the client to process triple the application volume without increasing operational headcount.",
      },
      {
        stat: "90%",
        title: "Efficiency Gain",
        description:
          "Significantly reduced human intervention in the data verification and screening stages.",
      },
      {
        stat: "LOW",
        title: "Risk Profile",
        description:
          "Enhanced data accuracy led to more precise risk assessments and lower default rates.",
      },
    ],
    techStack: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "AWS Lambda",
      "React.js",
      "Python ML",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "System Audit",
        description:
          "Detailed analysis of financial regulations and underwriting decision trees.",
      },
      {
        label: "Phase 2",
        title: "Architecture Design",
        description:
          "Designing a secure, multi-tenant infrastructure capable of handling sensitive data.",
      },
      {
        label: "Phase 3",
        title: "Integration Sprint",
        description:
          "Connecting with credit bureaus, banking APIs, and compliance databases.",
      },
      {
        label: "Phase 4",
        title: "Security Hardening",
        description:
          "Pentesting and final refinement of the automated scoring models.",
      },
    ],
    faqs: [
      {
        question: "Is the platform FCA compliant?",
        answer:
          "The architecture is designed to enforce and document regulatory requirements throughout the lending process.",
      },
      {
        question: "How are credit scores calculated?",
        answer:
          "The engine uses a combination of bureau data and proprietary algorithms to generate real-time risk profiles.",
      },
      {
        question: "How safe is sensitive data?",
        answer:
          "We implement AES-256 encryption at rest and multi-factor authentication for all platform access points.",
      },
      {
        question: "Can it handle heavy traffic?",
        answer:
          "The serverless backend automatically scales to manage bursts in application volume during peak periods.",
      },
      {
        question: "Can it integrate with bank accounts?",
        answer:
          "Yes, it supports Open Banking integrations for instant income and expenditure verification.",
      },
    ],
  },
  weightwins: {
    slug: "weightwins",
    title: "Weightwins",
    subtitle: "Corporate Wellness Tracking Ecosystem",
    category: "Mobile Development",
    client: "Eating Science Ltd",
    duration: "10 Months",
    description:
      "A sophisticated wellness ecosystem that incentivizes healthy habits through IoT data tracking, peer competition, and corporate rewards.",
    heroImage: "/assets/technology-01.webp",
    overview:
      "Weightwins is a health technology platform designed to improve employee wellbeing. It combines mobile app technology with behavioral science to drive long-term engagement in preventive health.",
    challenge:
      "Low participation rates in corporate wellness programs often stem from a lack of immediate motivation and difficulty in tracking progress across different health devices.",
    solution:
      "We created a cross-platform mobile solution that automatically syncs with wearables, gamifies physical activity through leaderboards, and provides employers with anonymized health population data.",
    galleryImages: ["/assets/technology-02.jpg", "/assets/technology.png"],
    features: [
      "IoT Device Synchronization",
      "Gamified Reward Logic",
      "Real-time Global Leaderboards",
      "Dynamic Nutrition Logging",
      "HR Administrative Dashboard",
      "Push Messaging Engine",
      "Personalized Goal Setting",
      "Health Analytics Suite",
    ],
    metrics: [
      {
        label: "Engagement Rate",
        value: "75%",
      },
      {
        label: "Rewards Redeemed",
        value: "35k+",
      },
      {
        label: "Health Index Boost",
        value: "30%",
      },
      {
        label: "App Store Rating",
        value: "4.8",
      },
    ],
    results: [
      {
        stat: "75%",
        title: "User Retention",
        description:
          "Exceptional daily active user metrics driven by consistent behavioral nudges.",
      },
      {
        stat: "30%",
        title: "Clinical Impact",
        description:
          "Measurable improvement in heart rate and step counts across the user base.",
      },
      {
        stat: "HIGH",
        title: "Employer ROI",
        description:
          "Proven correlation between platform usage and reduced health-related absenteeism.",
      },
    ],
    techStack: [
      "React Native",
      "Node.js",
      "MongoDB",
      "AWS S3",
      "Google Fit API",
      "Apple HealthKit",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Concept Research",
        description:
          "Behavioral audit and definition of engagement gamification loops.",
      },
      {
        label: "Phase 2",
        title: "Mobile Build",
        description:
          "Simultaneous development for iOS and Android with a shared codebase.",
      },
      {
        label: "Phase 3",
        title: "Wearable Sync",
        description:
          "Integration with a wide array of fitness trackers and smartwatches.",
      },
      {
        label: "Phase 4",
        title: "Enterprise Pilot",
        description:
          "Deployment to initial group of corporate partners followed by global rollout.",
      },
    ],
    faqs: [
      {
        question: "Which devices are supported?",
        answer:
          "The platform supports all major wearables including Apple Watch, Fitbit, Garmin, and Samsung Gear.",
      },
      {
        question: "Is user medical data private?",
        answer:
          "All data is anonymized for corporate reports and stored in GDPR-compliant encrypted partitions.",
      },
      {
        question: "Can companies set their own rewards?",
        answer:
          "Yes, the admin panel allows for complete customization of reward types and point values.",
      },
      {
        question: "Does it work for remote teams?",
        answer:
          "The social features are specifically built to foster community regardless of physical location.",
      },
      {
        question: "Is there an offline mode?",
        answer:
          "Activity data can be cached on the device and synchronized whenever a connection is available.",
      },
    ],
  },
  "printing-com": {
    slug: "printing-com",
    title: "Printing.com",
    subtitle: "Digital Design to Print Automation",
    category: "Web Development",
    client: "Grafenia plc",
    duration: "9 Months",
    description:
      "A revolutionary print-on-demand integration that connects complex graphic design tools with high-volume production workflows.",
    heroImage: "/assets/projects/printing-com.jpg",
    overview:
      "Grafenia needed to modernize their printing.com platform to handle massive order volumes while reducing prepress errors. The solution involved building a robust middleware to automate the entire file-to-print lifecycle.",
    challenge:
      "Translating customer designs into high-quality, print-ready files was a manual, error-prone process that caused production bottlenecks and high rework costs.",
    solution:
      "We engineered a bespoke processing engine that automates pre-flight checks, file conversion, and intelligent order routing to regional production facilities.",
    galleryImages: [
      "/assets/projects/printing-com-gallery-1.jpg",
      "/assets/projects/printing-com-gallery-2.jpg",
    ],
    features: [
      "Visual Design Middleware",
      "Automated Pre-flight Engine",
      "Intelligent Order Routing",
      "Dynamic Pricing API",
      "Multi-node Production Sync",
      "Customer Asset Vault",
      "PDF Generation Service",
      "Real-time Print Queue",
    ],
    metrics: [
      {
        label: "Pre-press Errors",
        value: "-80%",
      },
      {
        label: "Processing Speed",
        value: "50%",
      },
      {
        label: "Monthly Orders",
        value: "100k+",
      },
      {
        label: "Production Hubs",
        value: "15+",
      },
    ],
    results: [
      {
        stat: "80%",
        title: "Error Mitigation",
        description:
          "Drastically reduced reprint costs through rigorous automated file validation.",
      },
      {
        stat: "50%",
        title: "Lead Time",
        description:
          "Halved the cycle time between customer design approval and job shipment.",
      },
      {
        stat: "100%",
        title: "Fulfillment",
        description:
          "Unified a distributed production network into a single, high-performance ecosystem.",
      },
    ],
    techStack: [
      "PHP Laravel",
      "Vue.js",
      "MySQL",
      "Ghostscript",
      "AWS S3",
      "NGINX",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Process Mapping",
        description:
          "Deep audit of legacy print workflows and identification of manual friction points.",
      },
      {
        label: "Phase 2",
        title: "Core Middleware",
        description:
          "Building the file conversion and automated pre-flight decision engine.",
      },
      {
        label: "Phase 3",
        title: "API Integration",
        description:
          "Connecting front-end e-commerce frontends with downstream production logistics.",
      },
      {
        label: "Phase 4",
        title: "Load Testing",
        description:
          "Optimizing the infrastructure to handle high-concurrency order surges.",
      },
    ],
    faqs: [
      {
        question: "How is file quality ensured?",
        answer:
          "The system runs a 20-point automated inspection on every file before it reaches production.",
      },
      {
        question: "Can it integrate with existing ERPs?",
        answer:
          "Yes, the middleware is built with a flexible API architecture for seamless backend integration.",
      },
      {
        question: "What file types can it process?",
        answer:
          "It handles a vast range of professional formats including high-res PDF, EPS, and AI.",
      },
      {
        question: "Is the system white-labeled?",
        answer:
          "The entire design-to-print workflow can be re-branded and integrated into partner websites.",
      },
      {
        question: "How does it handle complex color?",
        answer:
          "The engine supports automated CMYK conversion and spot color management for print consistency.",
      },
    ],
  },
  "the-gym-group": {
    slug: "the-gym-group",
    title: "The Gym Group",
    subtitle: "Transforming Fitness Membership Management",
    category: "Mobile Development",
    client: "The Gym Group",
    duration: "12 Months",
    description:
      "A comprehensive mobile application and membership management system designed to streamline gym access, personal training sessions, and member engagement for a leading low-cost gym chain.",
    heroImage: "/assets/projects/the-gym-group.jpg",
    overview:
      "The Gym Group required a robust digital solution to manage their growing member base across hundreds of locations. The goal was to provide a seamless mobile experience for users while optimizing backend operations for staff.",
    challenge:
      "The existing systems were fragmented, leading to high friction during gym entry and session bookings. Managing real-time data across multiple sites with varying hardware configurations posed a significant challenge.",
    solution:
      "AppDrawn developed a cross-platform mobile app integrated with high-performance cloud infrastructure. Features including QR code entry, real-time class booking, and personalized workout tracking were implemented to enhance the member experience.",
    galleryImages: [
      "/assets/projects/the-gym-group-gallery-1.jpg",
      "/assets/projects/the-gym-group-gallery-2.jpg",
    ],
    features: [
      "QR Code Entry Systems",
      "Real-time Class Bookings",
      "Personal Trainer Scheduling",
      "Integrated Payment Processing",
      "User Activity Analytics",
      "Proximity-based Notifications",
      "Offline Access Management",
      "Multi-site Synchronization",
    ],
    metrics: [
      {
        label: "Member Engagement",
        value: "+28%",
      },
      {
        label: "Booking Speed",
        value: "3x Faster",
      },
      {
        label: "App Store Rating",
        value: "4.8 Stars",
      },
      {
        label: "Admin Efficiency",
        value: "+50%",
      },
    ],
    results: [
      {
        stat: "100%",
        title: "Automated Access",
        description:
          "Successfully implemented zero-friction guest entry across all primary locations using dynamic QR codes.",
      },
      {
        stat: "30%",
        title: "Member Growth",
        description:
          "Supported a massive influx of new memberships through a streamlined onboarding process within the app.",
      },
      {
        stat: "22%",
        title: "Retention Hike",
        description:
          "Improved long-term member retention by delivering personalized workout content and local gym updates.",
      },
    ],
    techStack: [
      "React Native",
      "Node.js",
      "PostgreSQL",
      "AWS Amplify",
      "Redis",
      "GraphQL",
      "Firebase",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & UX Strategy",
        description:
          "Mapping member journeys and identifying friction points in the existing facility access model.",
      },
      {
        label: "Phase 2",
        title: "Core Infrastructure Build",
        description:
          "Developing the secure backend API to handle real-time synchronization across hundreds of locations.",
      },
      {
        label: "Phase 3",
        title: "Cross-platform Development",
        description:
          "Simultaneous build of iOS and Android applications with deep hardware integration for QR scanners.",
      },
      {
        label: "Phase 4",
        title: "National Launch",
        description:
          "Phased rollout starting with flagship locations followed by a full nationwide system migration.",
      },
    ],
    faqs: [
      {
        question: "How is data security handled?",
        answer:
          "We implemented bank-grade encryption for all member data and secure tokenization for payment processing.",
      },
      {
        question: "Does it support wearable devices?",
        answer:
          "Yes, the app integrates with major fitness trackers including Apple Health, Google Fit, and Garmin.",
      },
      {
        question: "How does QR entry work?",
        answer:
          "Members generate a secure, revolving QR code within the app to scan at turnstiles for instant access.",
      },
      {
        question: "Can members book PT sessions?",
        answer:
          "Members can browse trainer profiles, check availability, and book 1-on-1 sessions directly in the app.",
      },
      {
        question: "Is the system scalable?",
        answer:
          "The cloud architecture automatically scales to handle peak traffic during morning and evening rush hours.",
      },
    ],
  },
  "first-choice-group": {
    slug: "first-choice-group",
    title: "First Choice Group",
    subtitle: "Streamlining Spares & Service Supply Chain",
    category: "Web Development",
    client: "First Choice Group",
    duration: "10 Months",
    description:
      "A high-performance e-commerce and inventory management portal for the UK's leading provider of catering equipment spares. The system focuses on precision, speed, and real-time inventory tracking.",
    heroImage: "/assets/projects/first-choice-group.jpg",
    overview:
      "First Choice Group needed to modernize their legacy ordering system to better serve professional technicians and catering businesses. The new portal required deep integration with their ERP for real-time stock levels.",
    challenge:
      "The catalog consisted of over 100,000 SKUs with complex hierarchical relationships. Ensuring that technicians could find exact parts quickly in high-pressure environments was the primary UX challenge.",
    solution:
      "An enterprise-grade web application featuring advanced search algorithms, technical diagram integration, and a custom 'Quick Order' interface for verified engineers.",
    galleryImages: [
      "/assets/projects/first-choice-group-gallery-1.jpg",
      "/assets/projects/first-choice-group-gallery-2.jpg",
    ],
    features: [
      "Advanced Part Search",
      "Interactive Technical Drawings",
      "Deep ERP System Integration",
      "B2B Account Management",
      "Bulk Ordering Tools",
      "Real-time Stock Tracking",
      "Automated Invoice Generation",
      "Custom Developer API",
    ],
    metrics: [
      {
        label: "Checkout Time",
        value: "-50%",
      },
      {
        label: "Order Accuracy",
        value: "99.9%",
      },
      {
        label: "Direct Sales Growth",
        value: "+25%",
      },
      {
        label: "Support Requests",
        value: "-30%",
      },
    ],
    results: [
      {
        stat: "40k+",
        title: "Active Technicians",
        description:
          "Successfully migrated a massive user base to the new digital portal with minimal downtime.",
      },
      {
        stat: "15ms",
        title: "Search Response",
        description:
          "Implemented ElasticSearch to provide instantaneous results across a massive 100k+ SKU database.",
      },
      {
        stat: "£1.5M",
        title: "Efficiency Gains",
        description:
          "Significant operational savings through automated order processing and reduced manual intervention.",
      },
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "MySQL",
      "ElasticSearch",
      "Docker",
      "Azure Cloud",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "ERP Mapping",
        description:
          "Auditing the complex existing database structures and planning the synchronization middleware.",
      },
      {
        label: "Phase 2",
        title: "Search Engine Optimization",
        description:
          "Building the high-performance search logic required to navigate technical parts lists accurately.",
      },
      {
        label: "Phase 3",
        title: "Interactive UI Build",
        description:
          "Developing the vector-based diagram viewer that allows users to click on parts for instant ordering.",
      },
      {
        label: "Phase 4",
        title: "Integration & Hardening",
        description:
          "Finalizing payment gateway connections and conducting stress tests for high-concurrency ordering.",
      },
    ],
    faqs: [
      {
        question: "Can I view technical diagrams?",
        answer:
          "Yes, the portal includes interactive exploded diagrams for most major catering equipment appliances.",
      },
      {
        question: "Is it integrated with my account?",
        answer:
          "Technicians can view their specific trade pricing, credit limits, and detailed order history.",
      },
      {
        question: "How fast is the search?",
        answer:
          "The system provides millisecond responses even with keyword variations and part number fragments.",
      },
      {
        question: "Does it support international orders?",
        answer:
          "The platform handles multi-currency payments and calculates international shipping duties automatically.",
      },
      {
        question: "Is there a mobile version?",
        answer:
          "The web application is fully responsive, tailored for engineers using tablets and smartphones on-site.",
      },
    ],
  },
  "hillingdon-council": {
    slug: "hillingdon-council",
    title: "Hillingdon Council",
    subtitle: "Digital Transformation for Public Services",
    heroPaddingY: "",
    category: "Web Development",
    client: "London Borough of Hillingdon",
    duration: "15 Months",
    description:
      "A secure digital overhaul of council-tax and housing service systems, replacing legacy processes with accessible web interfaces for residents and internal staff.",
    heroImage: "/assets/projects/hillingdon-council.jpg",
    overview:
      "Hillingdon Council aimed to improve the accessibility of their services while reducing the operational costs associated with manual paperwork and legacy systems.",
    challenge:
      "Migrating sensitive citizen data from 30-year-old mainframe systems required extreme caution and rigorous security auditing while maintaining accessibility standards.",
    solution:
      "A secure, service-oriented architecture providing a unified citizen portal. Fully integrated with national identity verification services and automated internal workflows.",
    galleryImages: [
      "/assets/projects/hillingdon-council-gallery-1.jpg",
      "/assets/projects/hillingdon-council-gallery-2.jpg",
    ],
    features: [
      "Unified Citizen Dashboard",
      "Housing Workflow Automation",
      "Council Tax Payment Portal",
      "GDPR Compliant Data Vault",
      "Internal Case Management",
      "Automated Alert Engine",
      "Secure Document Uploads",
      "Role-based Audit Logging",
    ],
    metrics: [
      {
        label: "Processing Speed",
        value: "3.5x Faster",
      },
      {
        label: "Digital Adoption",
        value: "80% Reach",
      },
      {
        label: "Cost per Action",
        value: "-70%",
      },
      {
        label: "Uptime Rating",
        value: "99.95%",
      },
    ],
    results: [
      {
        stat: "£1.2M",
        title: "Annual Savings",
        description:
          "Estimated reduction in operational costs through digital-first processing and reduced physical mail.",
      },
      {
        stat: "WCAG 2.1",
        title: "Accessibility",
        description:
          "Achieved full AA compliance, ensuring all residents can access critical services regardless of ability.",
      },
      {
        stat: "Zero",
        title: "Security Breaches",
        description:
          "Maintained a perfect security record despite handling extremely sensitive personal citizen data.",
      },
    ],
    techStack: [
      "C# .NET Core",
      "Angular",
      "SQL Server",
      "Azure AD",
      "Redis",
      "Kubernetes",
      "Gov.UK CSS",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Compliance Audit",
        description:
          "Deep dive into data privacy requirements and accessibility standards for government portals.",
      },
      {
        label: "Phase 2",
        title: "Data Migration",
        description:
          "Executing complex ETL processes to move millions of records from legacy mainframes to SQL Server.",
      },
      {
        label: "Phase 3",
        title: "Service Development",
        description:
          "Building the citizen-facing modules for tax, housing, and social services with Angular.",
      },
      {
        label: "Phase 4",
        title: "Departmental Phase-in",
        description:
          "Training council staff and launching services department by department to ensure stability.",
      },
    ],
    faqs: [
      {
        question: "Is my data secure?",
        answer:
          "We use AES-256 encryption and multi-factor authentication following UK government Cyber Essentials Plus.",
      },
      {
        question: "How do I reset my credentials?",
        answer:
          "Residents can securely recover accounts using verified email, SMS, or post-based verification codes.",
      },
      {
        question: "Is the portal mobile-friendly?",
        answer:
          "Yes, the system is designed following the mobile-first principles of the Gov.UK design system.",
      },
      {
        question: "Can I upload supporting documents?",
        answer:
          "Citizens can securely upload scans or photos of evidence directly into their housing or tax applications.",
      },
      {
        question: "Who can see my personal data?",
        answer:
          "Access is strictly limited to authorized council officers through audited, role-based access control.",
      },
    ],
  },
  "nhs-professionals": {
    slug: "nhs-professionals",
    title: "NHS Professionals",
    subtitle: "Optimizing Healthcare Staffing Workflows",
    category: "Cloud & DevOps",
    client: "NHS Professionals",
    duration: "14 Months",
    description:
      "A high-concurrency booking and staff management platform that connects healthcare professionals with vacant shifts across the NHS network in real-time.",
    heroImage: "/assets/projects/nhs-professionals.jpg",
    overview:
      "NHS Professionals needed a way to manage tens of thousands of temporary staff. The system needed to handle extreme traffic spikes during morning shift release times.",
    challenge:
      "Coordinating shift availability with clinical requirements and worker compliance (certifications, training) for over 50,000 workers across multiple trusts.",
    solution:
      "A cloud-native platform with an automated compliance engine and a high-frequency matching algorithm that pairs staff with urgent clinical needs.",
    galleryImages: [
      "/assets/projects/nhs-professionals-gallery-1.jpg",
      "/assets/projects/nhs-professionals-gallery-2.jpg",
    ],
    features: [
      "Real-time Shift Posting",
      "Automated Compliance Engine",
      "High-frequency Matching",
      "Mobile Staff Application",
      "Digital Timesheet Entry",
      "Payroll Integration",
      "Dynamic Demand Mapping",
      "Trust-level Reporting",
    ],
    metrics: [
      {
        label: "Shift Fill Rate",
        value: "95%+",
      },
      {
        label: "System Latency",
        value: "<100ms",
      },
      {
        label: "Compliance Errors",
        value: "0%",
      },
      {
        label: "Worker NPS",
        value: "+55",
      },
    ],
    results: [
      {
        stat: "50k",
        title: "Concurrent Users",
        description:
          "Successfully handles massive morning spikes as staff login simultaneously to claim newly released shifts.",
      },
      {
        stat: "20%",
        title: "Agency Reduction",
        description:
          "Reduced hospital reliance on expensive external recruitment agencies through better internal bank use.",
      },
      {
        stat: "Instant",
        title: "Verification",
        description:
          "Automated the verification of hundreds of clinical documents daily through AI-assisted parsing.",
      },
    ],
    techStack: [
      "Java Spring Boot",
      "React",
      "PostgreSQL",
      "RabbitMQ",
      "AWS SQS",
      "Terraform",
      "Prometheus",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Load Testing",
        description:
          "Simulating massive user spikes to determine the auto-scaling requirements for shift releases.",
      },
      {
        label: "Phase 2",
        title: "Compliance Logic Build",
        description:
          "Codifying complex medical certification rules into an automated, non-bypassable validation engine.",
      },
      {
        label: "Phase 3",
        title: "Real-time Match Logic",
        description:
          "Developing the algorithm that sorts and suggests workers based on proximity, skill, and history.",
      },
      {
        label: "Phase 4",
        title: "Network Expansion",
        description:
          "Connecting the platform to multiple Hospital Trust legacy systems for unified shift availability.",
      },
    ],
    faqs: [
      {
        question: "How are shifts allocated?",
        answer:
          "Shifts are matched instantly based on worker qualifications, mandatory training status, and hospital tier.",
      },
      {
        question: "Is clinical certification checked?",
        answer:
          "Yes, the system verifies registration with professional bodies (GMC, NMC) daily via automated APIs.",
      },
      {
        question: "How are timesheets handled?",
        answer:
          "Staff submit digital timesheets which are authorized by ward managers and synced to payroll on a 24-hour cycle.",
      },
      {
        question: "Can I use it on my phone?",
        answer:
          "The platform is fully optimized for mobile, allowing staff to book shifts and check schedules on the go.",
      },
      {
        question: "How secure is user data?",
        answer:
          "The platform is hosted on a secure NHS-compliant cloud with strict data residency and encryption protocols.",
      },
    ],
  },
  crescent: {
    slug: "crescent",
    title: "Crescent",
    subtitle: "High-Yield Crypto Savings App",
    category: "AI & Data",
    client: "Crescent",
    duration: "4 Months",
    description:
      "Crescent is a wealth-building finance app that makes high-yield crypto interest accessible to everyone through a sleek, user-friendly mobile interface.",
    heroImage: "/assets/technology-01.webp",
    overview:
      "Crescent partnered with 10Clouds to build a comprehensive fintech solution that bridges the gap between traditional banking and decentralized finance. The goal was to provide a secure, high-yield savings environment that feels as familiar as a standard bank account but leverages the efficiency of blockchain technology.",
    challenge:
      "The primary challenge was designing a user experience that simplified complex crypto operations for non-technical users while maintaining the highest standards of security and transparency. The platform needed to handle high-frequency transactions and provide real-time updates on interest earnings without overwhelming the user.",
    solution:
      "10Clouds developed the entire frontend architecture and established a robust design system. We implemented advanced data visualization for interest tracking, a secure onboarding flow with integrated KYC, and a scalable React Native mobile application that ensures performance across all devices.",
    galleryImages: ["/assets/technology-02.jpg", "/assets/technology.png"],
    features: [
      "Automated Interest Generation",
      "Real-time Portfolio Tracking",
      "Secure Fiat-to-Crypto Onramps",
      "Instant Liquidity Access",
      "Multi-factor Authentication",
      "Biometric Security Integration",
      "Automated Tax Reporting",
      "Customizable Wealth Goals",
    ],
    metrics: [
      {
        label: "Interest Rate",
        value: "8.5% APY",
      },
      {
        label: "Onboarding Time",
        value: "< 2 Mins",
      },
      {
        label: "User Growth",
        value: "22% QoQ",
      },
      {
        label: "Transaction Speed",
        value: "Instant",
      },
    ],
    results: [
      {
        stat: "99.9%",
        title: "System Uptime",
        description:
          "Engineered a high-availability infrastructure that ensures constant access to funds.",
      },
      {
        stat: "50k+",
        title: "Active Users",
        description:
          "Successfully scaled the platform to handle a rapidly growing user base post-launch.",
      },
      {
        stat: "$500M",
        title: "Assets Managed",
        description:
          "Built a trusted environment capable of securing significant institutional and retail capital.",
      },
    ],
    techStack: [
      "React Native",
      "TypeScript",
      "Node.js",
      "AWS",
      "Terraform",
      "Solidity",
      "PostgreSQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Planning",
        description:
          "Defining the product roadmap and technical architecture for crypto integrations.",
      },
      {
        label: "Phase 2",
        title: "Product Design",
        description:
          "Creating a high-fidelity design system and intuitive user journeys.",
      },
      {
        label: "Phase 3",
        title: "Frontend Development",
        description:
          "Core mobile application development and integration with DeFi protocols.",
      },
      {
        label: "Phase 4",
        title: "Testing & Launch",
        description:
          "Rigorous security audits and production deployment for global users.",
      },
    ],
    faqs: [
      {
        question: "How does Crescent ensure the safety of user funds?",
        answer:
          "Crescent uses institutional-grade security protocols, including multi-sig wallets and third-party custody solutions.",
      },
      {
        question: "What was 10Clouds' primary role in the project?",
        answer:
          "10Clouds was responsible for the complete product design and the frontend engineering of the mobile application.",
      },
      {
        question: "Is the app available on both iOS and Android?",
        answer:
          "Yes, the cross-platform React Native approach ensured a simultaneous launch on both major platforms.",
      },
      {
        question: "How is the high yield generated?",
        answer:
          "Interest is earned through automated allocation into verified decentralized finance lending protocols.",
      },
      {
        question: "Does the app support traditional bank transfers?",
        answer:
          "Yes, integrated bank-to-crypto gateways allow for seamless fiat deposits and withdrawals.",
      },
    ],
  },
  "trust-stamp": {
    slug: "trust-stamp",
    title: "Trust Stamp",
    subtitle: "AI-Powered Biometric Identity Protection",
    category: "AI & Automation",
    client: "Trust Stamp",
    duration: "Ongoing Partnership",
    description:
      "Trust Stamp provides a secure layer of identity verification using advanced machine learning and biometrics, protecting users from identity theft in a digital world.",
    heroImage: "/assets/projects/trust-stamp.jpg",
    overview:
      "Trust Stamp delivers 'Identity & Trust as a Service'. They required a specialized engineering team to scale their biometric processing capabilities and integrate their proprietary AI models into various enterprise-level applications for global financial institutions.",
    challenge:
      "The complexity lay in processing massive amounts of biometric data in real-time while ensuring 100% data privacy. The system needed to detect sophisticated 'liveness' attacks and prevent spoofing without introducing latency into the user authentication flow.",
    solution:
      "10Clouds provided a dedicated team of engineers to enhance the machine learning pipeline and develop secure API wrappers. We optimized biometric hashing algorithms that protect user data even in the event of a database breach by using Irreversible Transformable Signatures.",
    galleryImages: [
      "/assets/projects/trust-stamp-gallery-1.jpg",
      "/assets/projects/trust-stamp-gallery-2.jpg",
    ],
    features: [
      "Facial Recognition Liveness Detection",
      "Irreversible Biometric Hashing",
      "Multi-modal Identity Orchestration",
      "Offline Identity Verification",
      "Cross-enterprise Trust Scores",
      "Instant API Integration",
      "Sophisticated Anti-spoofing AI",
      "Privacy-first Data Vaulting",
    ],
    metrics: [
      {
        label: "False Match Rate",
        value: "0.0001%",
      },
      {
        label: "Verification Time",
        value: "0.8 Seconds",
      },
      {
        label: "Data Saved",
        value: "75% Compression",
      },
      {
        label: "Countries Served",
        value: "40+",
      },
    ],
    results: [
      {
        stat: "100%",
        title: "Privacy Compliance",
        description:
          "Ensured full GDPR and SOC2 compliance through unique data anonymization techniques.",
      },
      {
        stat: "10M+",
        title: "Identities Verified",
        description:
          "Scalable infrastructure handles millions of successful verifications for global banks.",
      },
      {
        stat: "90%",
        title: "Fraud Reduction",
        description:
          "Significantly decreased identity-related fraud incidents for enterprise clients.",
      },
    ],
    techStack: [
      "Python",
      "TensorFlow",
      "FastAPI",
      "React",
      "Google Cloud",
      "Docker",
      "Kubernetes",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Audit & Analysis",
        description:
          "Evaluating the existing AI models and identifying performance bottlenecks.",
      },
      {
        label: "Phase 2",
        title: "Pipeline Optimization",
        description:
          "Re-engineering data processing flows for faster biometric matching.",
      },
      {
        label: "Phase 3",
        title: "Enterprise Integration",
        description:
          "Building secure SDKs for seamless banking and humanitarian platforms.",
      },
      {
        label: "Phase 4",
        title: "Scaling & Maintenance",
        description:
          "Providing continuous staff augmentation and infrastructure management.",
      },
    ],
    faqs: [
      {
        question:
          "What makes Trust Stamp different from other biometric services?",
        answer:
          "Our use of Irreversible Transformable Signatures ensures that biometric data cannot be reconstructed if stolen.",
      },
      {
        question: "How does 10Clouds support a biometric startup?",
        answer:
          "We provide high-level expertise in Python, machine learning engineering, and secure API development.",
      },
      {
        question: "Can the system work without an internet connection?",
        answer:
          "Yes, the solution includes edge-computing capabilities for offline identity verification.",
      },
      {
        question: "Is facial recognition the only biometric used?",
        answer:
          "No, the platform supports multi-modal identity factors for increased security levels.",
      },
      {
        question: "Is the system compliant with global privacy laws?",
        answer:
          "Full compliance with GDPR and international data protection standards is built into the architecture.",
      },
    ],
  },
  swile: {
    slug: "swile",
    title: "Swile",
    subtitle: "Employee Benefits Experience Platform",
    category: "Web Development",
    client: "Swile",
    duration: "3 Months",
    description:
      "Swile transforms employee benefits into a cohesive digital experience, utilizing high-end 3D design and seamless card integration to increase worker engagement.",
    heroImage: "/assets/technology-01.webp",
    overview:
      "Swile redefines the corporate benefits landscape by consolidating meal vouchers, gift cards, and expense management into a single smart card and app. 10Clouds worked on elevating the brand through premium 3D design and ensuring a flawless digital interface.",
    challenge:
      "With a target audience of young, tech-savvy employees, Swile needed to move away from boring corporate aesthetics. The challenge was to integrate playful 3D animations and illustrations into the product while maintaining professional utility and trust.",
    solution:
      "10Clouds delivered a series of custom 3D assets and animations that characterize the Swile brand. We optimized these high-fidelity graphics for web and mobile performance, ensuring that the visual richness didn't impact load times or user flow.",
    galleryImages: ["/assets/technology-02.jpg", "/assets/technology.png"],
    features: [
      "Unified Benefits Interface",
      "Smart Payment Routing",
      "Immersive 3D Brand Language",
      "Real-time Spending Notifications",
      "Team Social Features",
      "Contactless Payment Support",
      "Interactive Savings Progress",
      "Corporate Gift Management",
    ],
    metrics: [
      {
        label: "User Satisfaction",
        value: "4.9/5 Stars",
      },
      {
        label: "Asset Optimization",
        value: "50% Reduction",
      },
      {
        label: "Brand Recall",
        value: "+85%",
      },
      {
        label: "Market Valuation",
        value: "Unicorn Status",
      },
    ],
    results: [
      {
        stat: "15,000",
        title: "Companies Using",
        description:
          "Broad adoption across the European market, from startups to large enterprises.",
      },
      {
        stat: "500k+",
        title: "Active Cards",
        description:
          "Supporting a massive volume of daily transactions across retail and restaurants.",
      },
      {
        stat: "Top 10",
        title: "Fintech Ranking",
        description:
          "Recognized as one of the most innovative employee experience apps in Europe.",
      },
    ],
    techStack: [
      "React",
      "Three.js",
      "Blender",
      "Adobe Creative Cloud",
      "Lottie",
      "Vite",
      "Styled Components",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Creative Discovery",
        description:
          "Defining the visual metaphor and 3D art direction for the brand.",
      },
      {
        label: "Phase 2",
        title: "Asset Creation",
        description:
          "Modeling and texturing custom 3D characters and interface elements.",
      },
      {
        label: "Phase 3",
        title: "Animation & Integration",
        description:
          "Implementing interactive animations using Three.js and Lottie.",
      },
      {
        label: "Phase 4",
        title: "Performance Tuning",
        description:
          "Optimizing asset sizes and web performance for a smooth user experience.",
      },
    ],
    faqs: [
      {
        question: "Why was 3D design chosen for Swile?",
        answer:
          "To differentiate from traditional benefits providers and create a more engaging, modern brand identity.",
      },
      {
        question: "Does the 3D content slow down the website?",
        answer:
          "No, we use advanced optimization techniques and compressed formats like GLB and Lottie.",
      },
      {
        question: "What tools were used for the 3D work?",
        answer:
          "A combination of Blender for modeling and Three.js for web-based rendering.",
      },
      {
        question: "Does Swile issue physical cards?",
        answer:
          "Yes, the app is paired with a physical Mastercard that intelligently switches between benefit buckets.",
      },
      {
        question: "Can employees use the app for social activities?",
        answer:
          "Yes, Swile includes features like team lunch organization and shared kitty funds.",
      },
    ],
  },
  goseqit: {
    slug: "goseqit",
    title: "GoSeqIt",
    subtitle: "Cloud DNA Analysis & Data Platform",
    category: "Cloud & DevOps",
    client: "GoSeqIt",
    duration: "5 Months",
    description:
      "GoSeqIt is a high-performance platform that allows scientists and medical professionals to conduct complex DNA analysis and sequencing through a secure cloud interface.",
    heroImage: "/assets/technology-01.webp",
    overview:
      "GoSeqIt aimed to democratize DNA analysis by providing an accessible, cloud-based tool for researchers. 10Clouds developed the infrastructure and frontend platform, ensuring that massive datasets could be processed and visualized efficiently online.",
    challenge:
      "Handling genomic data requires extreme computational power and strict data security. The challenge was building a scalable infrastructure that could spin up heavy compute nodes on demand and present the results in an easy-to-read, interactive dashboard.",
    solution:
      "We built a serverless architecture that scales horizontally to handle peak analysis loads. The frontend was designed using high-performance charting libraries to render DNA sequences, allowing researchers to explore genomic variations with zero lag.",
    galleryImages: ["/assets/technology-02.jpg", "/assets/technology.png"],
    features: [
      "Parallel DNA Sequencing",
      "Interactive Genomic Visualization",
      "Cloud Data Storage & Management",
      "Automated Bio-reporting",
      "Multi-tenant Security Access",
      "Scientific Collaboration Tools",
      "API-first Biotech Platform",
      "Custom Analysis Pipelines",
    ],
    metrics: [
      {
        label: "Processing Speed",
        value: "8x Faster",
      },
      {
        label: "Cost Per Sample",
        value: "-30% Reduction",
      },
      {
        label: "Data Accuracy",
        value: "99.95%",
      },
      {
        label: "Max Concurrent Jobs",
        value: "2,000+",
      },
    ],
    results: [
      {
        stat: "TB+",
        title: "Data Processed",
        description:
          "Efficiently manages and analyzes terabytes of genomic sequencing data daily.",
      },
      {
        stat: "Serverless",
        title: "Infrastructure",
        description:
          "Eliminated fixed server costs by moving to a complete pay-per-compute model.",
      },
      {
        stat: "Global",
        title: "Researcher Access",
        description:
          "Enabled scientists worldwide to collaborate on genomic research without local hardware.",
      },
    ],
    techStack: [
      "Python",
      "React",
      "D3.js",
      "AWS Lambda",
      "AWS Batch",
      "PostgreSQL",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Technical Feasibility",
        description:
          "Validating the cloud-computing requirements for genomic data processing.",
      },
      {
        label: "Phase 2",
        title: "Infra Orchestration",
        description:
          "Building out the AWS Batch and Lambda environments for horizontal scaling.",
      },
      {
        label: "Phase 3",
        title: "Visualization Design",
        description:
          "Developing custom D3.js components for interactive DNA sequence mapping.",
      },
      {
        label: "Phase 4",
        title: "Security Hardening",
        description:
          "Implementing end-to-end encryption and HIPPA-compliant data storage.",
      },
    ],
    faqs: [
      {
        question: "How secure is the DNA data stored on GoSeqIt?",
        answer:
          "All data is encrypted at rest and in transit, following international health data security standards.",
      },
      {
        question: "Can users run custom analysis scripts?",
        answer:
          "Yes, the platform supports the definition of custom computational pipelines via a secure API.",
      },
      {
        question: "What makes the visualization high-performance?",
        answer:
          "We use canvas-based rendering for large genomic datasets to keep the UI fluid.",
      },
      {
        question: "Is the platform suitable for clinical use?",
        answer:
          "The platform is designed to support both academic research and diagnostic support workflows.",
      },
      {
        question: "Does the platform integrate with public genomic databases?",
        answer:
          "Yes, GoSeqIt can fetch and compare data against major international research repositories.",
      },
    ],
  },
  "pinterest-mobile-engineering": {
    slug: "pinterest-mobile-engineering",
    title: "Pinterest: Scaling Mobile Experience and Performance",
    subtitle:
      "High-performance engineering for the world's most visual discovery engine.",
    category: "Mobile Development",
    client: "Pinterest",
    duration: "18 Months",
    description:
      "BairesDev partnered with Pinterest to scale their mobile engineering capabilities and optimize cross-platform performance for millions of global users.",
    heroImage: "/assets/projects/pinterest-mobile-engineering.jpg",
    overview:
      "As Pinterest's global user base surpassed 450 million, the requirement for a near-instantaneous visual discovery experience became paramount. Our mission was to eliminate rendering bottlenecks and modernize the mobile architecture for long-term scalability.",
    challenge:
      "Addressing significant latency in image rendering and data synchronization across distributed global servers while maintaining feature parity across iOS, Android, and Web platforms.",
    solution:
      "We deployed a dedicated team of Senior Engineers to architect a high-concurrency Redis caching layer, refactor legacy Java modules into micro-services, and implement specialized GraphQL query optimizations.",
    galleryImages: [
      "/assets/projects/pinterest-mobile-engineering-gallery-1.jpg",
      "/assets/projects/pinterest-mobile-engineering-gallery-2.jpg",
    ],
    features: [
      "Native Performance Optimization",
      "GraphQL API Refactoring",
      "Cloud-Native Infrastructure Scaling",
      "Real-Time Image Processing",
      "Cross-Platform Feature Parity",
      "Automated CI/CD Pipeline Design",
      "Predictive Data Prefetching",
      "Advanced Analytics Instrumentation",
    ],
    metrics: [
      {
        label: "Render Latency",
        value: "-42%",
      },
      {
        label: "Memory Usage",
        value: "-22%",
      },
      {
        label: "User Engagement",
        value: "+15%",
      },
      {
        label: "Deployment Speed",
        value: "3x",
      },
    ],
    results: [
      {
        stat: "35%",
        title: "Performance Boost",
        description:
          "Achieved a significant reduction in time-to-interactive for high-density visual boards.",
      },
      {
        stat: "22%",
        title: "Retention Growth",
        description:
          "Improved app stability led to a measurable increase in long-term user retention metrics.",
      },
      {
        stat: "40%",
        title: "Infra Efficiency",
        description:
          "Optimized server resource allocation through intelligent caching and query batching.",
      },
    ],
    techStack: [
      "Python",
      "Java",
      "React Native",
      "AWS",
      "Redis",
      "GraphQL",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Architecture Audit",
        description:
          "Deep-dive analysis of bottleneck sources in the legacy mobile rendering engine.",
      },
      {
        label: "Phase 2",
        title: "Refactoring Core",
        description:
          "Decoupling monolithic components into high-performance micro-services.",
      },
      {
        label: "Phase 3",
        title: "Scaling Layer",
        description:
          "Implementation of global Redis clusters and GraphQL query batching.",
      },
      {
        label: "Phase 4",
        title: "Optimization & Launch",
        description:
          "Global rollout with continuous performance monitoring and stress testing.",
      },
    ],
    faqs: [
      {
        question:
          "What was the primary technical hurdle faced during the Pinterest project?",
        answer:
          "The largest challenge was maintaining session persistence and data integrity during the migration from a monolithic structure to a micro-services architecture.",
      },
      {
        question: "How did BairesDev ensure cross-platform consistency?",
        answer:
          "We utilized a shared business logic layer in C++ with platform-specific UI bindings to ensure logic parity across all devices.",
      },
      {
        question: "Did this impact the legacy user experience?",
        answer:
          "No, we implemented a phased 'canary' rollout strategy that ensured 100% availability for users during the entire transition.",
      },
      {
        question: "What improvements were made to the image delivery network?",
        answer:
          "We integrated a modern CDN with edge computing capabilities to handle dynamic image resizing and compression on the fly.",
      },
      {
        question: "How was the success of the project measured?",
        answer:
          "Success was tracked through Core Web Vitals, app store retention rates, and a 40% reduction in reported performance-related tickets.",
      },
    ],
  },
  "ebay-marketplace-optimization": {
    slug: "ebay-marketplace-optimization",
    title: "eBay: Marketplace Engine Performance & Scalability",
    subtitle:
      "Revitalizing the core engine of one of the world's largest e-commerce platforms.",
    category: "Web Development",
    client: "eBay",
    duration: "24 Months",
    description:
      "BairesDev collaborated with eBay to optimize the core marketplace engine, focusing on search throughput and transactional integrity for billions of listings.",
    heroImage: "/assets/projects/ebay-marketplace-optimization.jpg",
    overview:
      "In the competitive landscape of global e-commerce, milliseconds directly correlate to revenue. eBay required an overhaul of their search indexing and transaction processing systems to handle historic peak volumes.",
    challenge:
      "Managing massive data throughput without compromising transactional ACID properties, particularly during high-traffic events like Black Friday and Cyber Monday.",
    solution:
      "Our team developed a distributed indexing system using Kafka and ElasticSearch, alongside a modernized Node.js service layer that significantly reduced server-side processing time.",
    galleryImages: [
      "/assets/projects/ebay-marketplace-optimization-gallery-1.jpg",
      "/assets/projects/ebay-marketplace-optimization-gallery-2.jpg",
    ],
    features: [
      "Distributed Indexing System",
      "Real-Time Inventory Sync",
      "Transactional Integrity Guard",
      "High-Throughput API Design",
      "Kubernetes Cluster Orch",
      "Predictive Load Balancing",
      "Multi-Region Data Sync",
      "Automated Security Auditing",
    ],
    metrics: [
      {
        label: "Search Speed",
        value: "2x",
      },
      {
        label: "Listing Throughput",
        value: "+30%",
      },
      {
        label: "System Uptime",
        value: "99.95%",
      },
      {
        label: "Storage Costs",
        value: "-18%",
      },
    ],
    results: [
      {
        stat: "15%",
        title: "Revenue Increase",
        description:
          "Attributed directly to the reduction in search abandonment due to faster page loads.",
      },
      {
        stat: "50%",
        title: "Infrastructure ROI",
        description:
          "Optimized resource utilization allowed eBay to scale with fewer physical server nodes.",
      },
      {
        stat: "25M",
        title: "Peak Concurrent",
        description:
          "Successfully managed record-breaking traffic during the holiday season with zero downtime.",
      },
    ],
    techStack: [
      "Java",
      "Node.js",
      "Oracle",
      "Kubernetes",
      "Kafka",
      "ElasticSearch",
      "React",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Load Strategy",
        description:
          "Simulating extreme peak traffic scenarios to identify critical failure points.",
      },
      {
        label: "Phase 2",
        title: "Indexing Overhaul",
        description:
          "Transitioning search indexing from batch processing to a real-time Kafka stream.",
      },
      {
        label: "Phase 3",
        title: "Service Modernization",
        description:
          "Rewriting legacy Java services into lightweight, containerized Node.js endpoints.",
      },
      {
        label: "Phase 4",
        title: "Global Sync",
        description:
          "Deploying multi-region synchronization to reduce latency for international users.",
      },
    ],
    faqs: [
      {
        question:
          "How did you handle real-time inventory updates at this scale?",
        answer:
          "We implemented a distributed log-streaming architecture using Kafka that allows for sub-second updates across all geographic nodes.",
      },
      {
        question: "What security measures were integrated?",
        answer:
          "We implemented a zero-trust architecture within the Kubernetes cluster, including mutual TLS and automated vulnerability scanning.",
      },
      {
        question: "How was data consistency maintained?",
        answer:
          "We used a combination of event sourcing and distributed locking mechanisms to ensure high availability without sacrificing consistency.",
      },
      {
        question: "Did the project require significant downtime?",
        answer:
          "The entire migration was performed using blue-green deployment strategies, resulting in zero downtime for the end users.",
      },
      {
        question: "Was the tech stack dictated by the client?",
        answer:
          "While we integrated into eBay's existing Java ecosystem, we introduced Node.js for high-concurrency Edge services.",
      },
    ],
  },
  "salesforce-cloud-integration": {
    slug: "salesforce-cloud-integration",
    title: "Salesforce: Enterprise AI & Cloud Data Integration",
    subtitle:
      "Empowering CRM insights through advanced data engineering and AI automation.",
    category: "AI & Data",
    client: "Salesforce",
    duration: "12 Months",
    description:
      "BairesDev assisted Salesforce in developing advanced data pipelines and AI-driven automation tools to enhance enterprise-level CRM insights.",
    heroImage: "/assets/projects/salesforce-cloud-integration.jpg",
    overview:
      "Salesforce needed to bridge the gap between vast enterprise data silos and actionable AI-driven insights. We built the connective tissue that enables real-time predictive analytics within their core platform ecosystems.",
    challenge:
      "Integrating heterogeneous data sources from disparate cloud providers while ensuring strict compliance with global data privacy regulations (GDPR/CCPA).",
    solution:
      "We engineered a secure data lake architecture using Snowflake and implemented custom TensorFlow models to predict customer churn and lifetime value.",
    galleryImages: [
      "/assets/projects/salesforce-cloud-integration-gallery-1.jpg",
      "/assets/projects/salesforce-cloud-integration-gallery-2.jpg",
    ],
    features: [
      "Predictive Lead Scoring",
      "Automated Data Mapping",
      "Privacy-First Data Lake",
      "Real-Time ETL Pipelines",
      "Multi-Cloud Federation",
      "AI Model Monitoring",
      "Enterprise Access Control",
      "Custom API Connectors",
    ],
    metrics: [
      {
        label: "Data Processing",
        value: "4.2x",
      },
      {
        label: "Churn Accuracy",
        value: "92%",
      },
      {
        label: "Integration Time",
        value: "-55%",
      },
      {
        label: "Compliance Score",
        value: "99.9%",
      },
    ],
    results: [
      {
        stat: "30%",
        title: "Ops Productivity",
        description:
          "Sales teams now spend 30% less time on manual data entry and lead qualification.",
      },
      {
        stat: "12M",
        title: "Rows/Second",
        description:
          "Achieved record data ingestion rates through optimized Snowflake pipelining.",
      },
      {
        stat: "20%",
        title: "Upsell Growth",
        description:
          "AI-driven recommendations directly increased cross-selling success for enterprise clients.",
      },
    ],
    techStack: [
      "Java",
      "Apex",
      "Python",
      "TensorFlow",
      "Azure",
      "Snowflake",
      "Angular",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Mapping",
        description:
          "Mapping complex relational data structures across legacy and cloud systems.",
      },
      {
        label: "Phase 2",
        title: "ETL Development",
        description:
          "Building high-performance data pipelines using Python and Snowflake.",
      },
      {
        label: "Phase 3",
        title: "AI Model Training",
        description:
          "Developing and validating TensorFlow models for predictive CRM analytics.",
      },
      {
        label: "Phase 4",
        title: "UI Integration",
        description:
          "Embedding the AI insights directly into the Salesforce lighting interface using Angular.",
      },
    ],
    faqs: [
      {
        question: "How was data security handled during integration?",
        answer:
          "All data was encrypted in transit and at rest, with strict RBAC enforced through Salesforce's native security protocols.",
      },
      {
        question: "What AI models were most effective?",
        answer:
          "A combination of standard regression for LTV and Random Forest classifiers for churn prediction proved most accurate.",
      },
      {
        question: "Did this integration support third-party apps?",
        answer:
          "Yes, we developed a standardized API layer that allows external enterprise apps to consume the processed AI insights safely.",
      },
      {
        question: "How did you manage cloud costs?",
        answer:
          "We implemented automatic resource scaling in Azure and optimized Snowflake compute clusters to only run during peak ETL jobs.",
      },
      {
        question: "What was the biggest technical challenge?",
        answer:
          "Resolving identity conflicts when merging duplicate customer records from five different historical data sources.",
      },
    ],
  },
  "adobe-creative-cloud-innovation": {
    slug: "adobe-creative-cloud-innovation",
    title: "Adobe: Creative Cloud Product Innovation",
    subtitle:
      "Accelerating the delivery of next-generation collaborative design tools.",
    category: "Cloud & DevOps",
    client: "Adobe",
    duration: "20 Months",
    description:
      "BairesDev provided expert C++ and Cloud engineers to help Adobe build high-performance collaborative features within the Creative Cloud suite.",
    heroImage: "/assets/projects/adobe-creative-cloud-innovation.jpg",
    overview:
      "Adobe sought to transform their desktop-centric design suite into a truly collaborative, cloud-first platform. This required deep low-level engineering and a robust DevOps foundation to support real-time sync.",
    challenge:
      "Enabling real-time collaborative editing on massive graphic files while ensuring sub-millisecond sync across geographically distributed teams.",
    solution:
      "We utilized WebAssembly to bring native C++ performance to the browser and implemented a Geo-distributed backend on AWS using Terraform for infrastructure as code.",
    galleryImages: [
      "/assets/projects/adobe-creative-cloud-innovation-gallery-1.jpg",
      "/assets/projects/adobe-creative-cloud-innovation-gallery-2.jpg",
    ],
    features: [
      "WebAssembly Core Engines",
      "Real-Time Sync Protocol",
      "Geo-Distributed Ops",
      "Auto-Scaling Render Farm",
      "Immutable Infra Design",
      "Version History Engine",
      "Binary Delta Sync",
      "Cross-Device Continuity",
    ],
    metrics: [
      {
        label: "Feature Velocity",
        value: "+28%",
      },
      {
        label: "Sync Latency",
        value: "<50ms",
      },
      {
        label: "Build Reliability",
        value: "99.8%",
      },
      {
        label: "User Load Time",
        value: "-25%",
      },
    ],
    results: [
      {
        stat: "10M+",
        title: "Users Impacted",
        description:
          "Successfully rolled out new collaboration features to millions of active subscribers.",
      },
      {
        stat: "40%",
        title: "Cost Reduction",
        description:
          "Optimized the render farm infrastructure leading to significant AWS cost savings.",
      },
      {
        stat: "15%",
        title: "Market Speed",
        description:
          "Reduced the time from feature conception to production deployment across the suite.",
      },
    ],
    techStack: [
      "C++",
      "JavaScript",
      "WebAssembly",
      "AWS",
      "Terraform",
      "Jenkins",
      "C#",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "WASM POC",
        description:
          "Proving the viability of complex C++ image processing in a browser environment.",
      },
      {
        label: "Phase 2",
        title: "Infra Orchestration",
        description:
          "Developing a global Terraform-driven cloud architecture for real-time asset sync.",
      },
      {
        label: "Phase 3",
        title: "Delta Engine Build",
        description:
          "Creating a custom protocol for syncing only changed pixels rather than whole files.",
      },
      {
        label: "Phase 4",
        title: "Suite Integration",
        description:
          "Iteratively deploying the collaboration engine across Illustrator, Photoshop, and XD.",
      },
    ],
    faqs: [
      {
        question: "Why was WebAssembly chosen for this project?",
        answer:
          "WASM allowed us to reuse Adobe's mature C++ math libraries in the web browser with near-native performance.",
      },
      {
        question:
          "How did you handle conflict resolution in collaborative edits?",
        answer:
          "We implemented an Operational Transformation (OT) algorithm specifically designed for complex graphic coordinate systems.",
      },
      {
        question: "What role did DevOps play in the success?",
        answer:
          "By automating the entire cloud infrastructure with Terraform, we enabled developers to spin up mirror environments in minutes.",
      },
      {
        question: "How did you manage 100MB+ file transfers?",
        answer:
          "We developed a proprietary 'Delta-Sync' engine that only uploads the specific binary changes made during each edit session.",
      },
      {
        question: "Was the system built for mobile as well?",
        answer:
          "Yes, the cloud-sync core is platform-agnostic and powers the experience across iPad, Desktop, and Web versions.",
      },
    ],
  },
  "fih-international-hockey": {
    slug: "fih-international-hockey",
    title: "Global Sports Federation Digital Transformation",
    subtitle:
      "Scaling fan engagement for the International Hockey Federation (FIH)",
    category: "Web Development",
    client: "International Hockey Federation",
    duration: "8 Months",
    description:
      "Simform partnered with FIH to overhaul their legacy digital infrastructure, migrating to a high-performance headless architecture that supports millions of concurrent fans during global tournaments.",
    heroImage: "/assets/projects/fih-international-hockey.jpg",
    overview:
      "The International Hockey Federation required a robust, fail-safe digital platform to manage real-time game statistics, live streaming, and high-traffic fan engagement for major international events like the World Cup.",
    challenge:
      "Their legacy system suffered from significant performance bottlenecks during peak traffic, slow content publishing cycles, and difficult maintenance routines that impacted the overall fan experience.",
    solution:
      "We implemented a modern headless CMS architecture combined with a resilient microservices backend on AWS, ensuring zero downtime and lightning-fast content delivery across all global regions.",
    galleryImages: [
      "/assets/projects/fih-international-hockey-gallery-1.jpg",
      "/assets/projects/fih-international-hockey-gallery-2.jpg",
    ],
    features: [
      "Headless CMS Architecture",
      "Real-time Score Integration",
      "Multi-region Content Delivery",
      "High-concurrency Scaling",
      "Automated Data Backups",
      "Live Stream Optimization",
      "Advanced Analytics Dashboard",
      "Custom Fan Engagement API",
    ],
    metrics: [
      {
        label: "Traffic Growth",
        value: "35%",
      },
      {
        label: "System Downtime",
        value: "0%",
      },
      {
        label: "Server Availability",
        value: "99.9%",
      },
      {
        label: "Active Fans",
        value: "3M+",
      },
    ],
    results: [
      {
        stat: "200%",
        title: "Fan Engagement",
        description:
          "Exponential increase in user interaction through real-time updates.",
      },
      {
        stat: "0%",
        title: "Downtime Record",
        description:
          "Maintained perfect availability during the entire World Cup event.",
      },
      {
        stat: "10x",
        title: "Publishing Speed",
        description:
          "Reduced content update time from minutes to under 5 seconds.",
      },
    ],
    techStack: [
      "Node.js",
      "React.js",
      "AWS Lambda",
      "DynamoDB",
      "Contentful CMS",
      "Redis",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Infrastructure Audit",
        description:
          "Complete assessment of legacy bottlenecks and architectural planning.",
      },
      {
        label: "Phase 2",
        title: "Core Development",
        description:
          "Building the headless CMS integration and microservices API layer.",
      },
      {
        label: "Phase 3",
        title: "UAT & Load Testing",
        description:
          "Simulating peak traffic scenarios to ensure 100% platform stability.",
      },
      {
        label: "Phase 4",
        title: "Global Launch",
        description:
          "Zero-downtime migration and launch coinciding with major tournament.",
      },
    ],
    faqs: [
      {
        question: "How did the platform handle peak tournament traffic?",
        answer:
          "We utilized AWS Auto-scaling and CloudFront to distribute load globally during peak events.",
      },
      {
        question: "What was the benefit of a headless architecture?",
        answer:
          "It decoupled content management from display, allowing for faster updates across web and mobile.",
      },
      {
        question: "Is the system secure against DDoS attacks?",
        answer:
          "Yes, we implemented WAF and advanced shielding to protect against high-volume attacks.",
      },
      {
        question: "Can they manage content in multiple languages?",
        answer:
          "The solution includes full i18n support for global audience accessibility.",
      },
      {
        question: "What kind of real-time data is synced?",
        answer:
          "Live match stats, player performance data, and tournament standings are synced in milliseconds.",
      },
    ],
  },
  "zego-resident-experience": {
    slug: "zego-resident-experience",
    title: "Azure-Powered Property Management Platform",
    subtitle: "Launching branded resident apps 10x faster",
    category: "Cloud & DevOps",
    client: "Zego (PayLease)",
    duration: "12 Months",
    description:
      "A comprehensive modernization of Zego's property management platform, enabling property managers to launch fully branded resident experience apps across thousands of properties with massive efficiency.",
    heroImage: "/assets/projects/zego-resident-experience.jpg",
    overview:
      "Zego needed to scale their mobile app offering to property managers, but manual configuration and deployment processes for individual branded apps were creating a massive backlog.",
    challenge:
      "The primary challenge was the operational overhead of managing cross-platform mobile apps for thousands of unique property brands while maintaining code consistency and security.",
    solution:
      "We engineered a DevOps-centric automation framework on Azure that automates the builds, white-labeling, and submission processes for both iOS and Android stores.",
    galleryImages: [
      "/assets/projects/zego-resident-experience-gallery-1.jpg",
      "/assets/projects/zego-resident-experience-gallery-2.jpg",
    ],
    features: [
      "Automated White-labeling",
      "CI/CD Build Pipelines",
      "Azure Cloud Architecture",
      "Cross-platform Sync",
      "Secure Payment Gateway",
      "Resident Communication Hub",
      "Property Analytics Suite",
      "Automated Store Submission",
    ],
    metrics: [
      {
        label: "Launch Speed",
        value: "8x",
      },
      {
        label: "Operational Savings",
        value: "65%",
      },
      {
        label: "Deployment Frequency",
        value: "Daily",
      },
      {
        label: "Property Reach",
        value: "15k+",
      },
    ],
    results: [
      {
        stat: "10x",
        title: "Faster Deployment",
        description:
          "Reduced app launch time from weeks to just a few business days.",
      },
      {
        stat: "65%",
        title: "Efficiency Gain",
        description:
          "Significant reduction in manual configuration hours for the DevOps team.",
      },
      {
        stat: "99.99%",
        title: "Uptime Metric",
        description:
          "High availability architecture ensures critical property services are always online.",
      },
    ],
    techStack: [
      "Azure DevOps",
      "React Native",
      ".NET Core",
      "Azure SQL",
      "Docker",
      "Kubernetes",
      "Bitrise",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Process Discovery",
        description:
          "Mapping out the manual bottlenecks in the current app delivery lifecycle.",
      },
      {
        label: "Phase 2",
        title: "Automation Design",
        description:
          "Architecting the Azure-based automated build and configuration engine.",
      },
      {
        label: "Phase 3",
        title: "Integration & Testing",
        description:
          "Connecting the property management backend to the new automation layer.",
      },
      {
        label: "Phase 4",
        title: "Full Scale Rollout",
        description:
          "Phased migration of property apps to the new automated deployment system.",
      },
    ],
    faqs: [
      {
        question: "How is the white-labeling automated?",
        answer:
          "We use custom scripts to inject branding assets and configurations during the build process.",
      },
      {
        question: "Can property managers manage their own updates?",
        answer:
          "Yes, the platform includes a dashboard for managers to trigger app content updates.",
      },
      {
        question: "Does it support integrated payments?",
        answer:
          "The platform features a highly secure, PCI-compliant payment gateway for rent and utilities.",
      },
      {
        question: "How do you handle OS version updates?",
        answer:
          "Our centralized core allows us to push platform-wide updates and bug fixes simultaneously.",
      },
      {
        question: "Is the data isolated per property?",
        answer:
          "We utilize advanced multi-tenancy patterns on Azure SQL to ensure complete data security.",
      },
    ],
  },
  "terawatt-ev-infrastructure": {
    slug: "terawatt-ev-infrastructure",
    title: "EV Charging Fleet Management Cloud Platform",
    subtitle: "Streamlining billing and operations for TeraWatt",
    category: "AI & Data",
    client: "TeraWatt Infrastructure",
    duration: "10 Months",
    description:
      "Development of a unified data and billing platform for a massive electric vehicle truck charging network, consolidating fragmented data into actionable enterprise insights.",
    heroImage: "/assets/projects/terawatt-ev-infrastructure.jpg",
    overview:
      "TeraWatt Infrastructure is building a nationwide network of EV charging stations for commercial fleets, requiring a robust system to track power usage, site health, and complex billing.",
    challenge:
      "The client faced difficulties with fragmented data coming from various hardware vendors, leading to manual billing errors and slow reporting cycles of up to 30 days.",
    solution:
      "We built an Azure-native data platform that ingests real-time IoT telemetry from charging hardware, processes it through an automated billing engine, and provides real-time fleet dashboards.",
    galleryImages: [
      "/assets/projects/terawatt-ev-infrastructure-gallery-1.jpg",
      "/assets/projects/terawatt-ev-infrastructure-gallery-2.jpg",
    ],
    features: [
      "IoT Telemetry Ingestion",
      "Automated Billing Engine",
      "Real-time Fleet Tracking",
      "Predictive Maintenance AI",
      "Multi-vendor Hardware Sync",
      "Revenue Performance Maps",
      "Dynamic Pricing Controls",
      "Custom Invoicing API",
    ],
    metrics: [
      {
        label: "Billing Speed",
        value: "80%",
      },
      {
        label: "Data Accuracy",
        value: "99.9%",
      },
      {
        label: "Revenue Catch",
        value: "25%",
      },
      {
        label: "Active Ports",
        value: "5k+",
      },
    ],
    results: [
      {
        stat: "80%",
        title: "Billing Cycle Cut",
        description:
          "Reduced monthly billing cycles from 30 days to less than 5 days.",
      },
      {
        stat: "25%",
        title: "Revenue Recovery",
        description:
          "Found and fixed billing leakage through automated data reconciliation.",
      },
      {
        stat: "100%",
        title: "Audit Compliance",
        description:
          "Achieved full transparency for financial audits with detailed usage logs.",
      },
    ],
    techStack: [
      "Azure IoT Hub",
      "Python",
      "Azure Databricks",
      "Power BI",
      "Snowflake",
      "React",
      "FastAPI",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Data Source Mapping",
        description:
          "Identifying and connecting all charging station hardware and IoT gateways.",
      },
      {
        label: "Phase 2",
        title: "Billing Engine Dev",
        description:
          "Engineering the complex logic for multi-tier fleet billing and discounts.",
      },
      {
        label: "Phase 3",
        title: "Dashboard UI",
        description:
          "Creating high-fidelity visualizations for fleet managers and operators.",
      },
      {
        label: "Phase 4",
        title: "Hardware Scaling",
        description:
          "Load testing and scaling the system to support thousands of new ports.",
      },
    ],
    faqs: [
      {
        question: "Can it support different charging hardware brands?",
        answer:
          "Yes, our abstraction layer allows integration with any hardware supporting OCPP protocol.",
      },
      {
        question: "How is billing data secured?",
        answer:
          "All financial data is encrypted at rest and in transit using enterprise-grade Azure security.",
      },
      {
        question: "Does it support real-time monitoring?",
        answer:
          "The system provides sub-minute visibility into charger status and energy draw.",
      },
      {
        question: "Can fleet managers set energy limits?",
        answer:
          "Yes, the platform includes power management tools to optimize site charging loads.",
      },
      {
        question: "How are billing errors handled?",
        answer:
          "The AI reconciliation engine flags discrepancies for review before invoices are finalized.",
      },
    ],
  },
  "global-consultant-ai": {
    slug: "global-consultant-ai",
    title: "Enterprise Generative AI Strategy Platform",
    subtitle: "Accelerating strategic insights with Generative AI",
    category: "AI & Automation",
    client: "Tier-1 Management Consultancy",
    duration: "6 Months",
    description:
      "An AI-powered document analysis and strategy platform developed for a global consultancy firm to cut research time and improve decision-making accuracy.",
    heroImage: "/assets/projects/global-consultant-ai.jpg",
    overview:
      "A leading global consultancy firm needed to modernize how their analysts interact with massive repositories of internal and external market research data.",
    challenge:
      "Analysts were spending over 50% of their time manually synthesizing data from PDF reports, spreadsheets, and news cycles, leading to slower strategy delivery for clients.",
    solution:
      "We deployed a custom RAG (Retrieval-Augmented Generation) platform using Azure OpenAI, allowing analysts to query thousands of documents and get high-accuracy strategic summaries in seconds.",
    galleryImages: [
      "/assets/projects/global-consultant-ai-gallery-1.jpg",
      "/assets/projects/global-consultant-ai-gallery-2.jpg",
    ],
    features: [
      "RAG Architecture",
      "Multi-format Doc Ingestion",
      "Semantic Search Engine",
      "AI-Powered Summarization",
      "Citation Verification",
      "Advanced NLP Analysis",
      "Custom Persona Agents",
      "Enterprise Security Layer",
    ],
    metrics: [
      {
        label: "Analysis Speed",
        value: "80%",
      },
      {
        label: "Accuracy Gain",
        value: "35%",
      },
      {
        label: "Content Volume",
        value: "1M+",
      },
      {
        label: "Weekly Users",
        value: "2k+",
      },
    ],
    results: [
      {
        stat: "80%",
        title: "Faster Research",
        description:
          "Reduced the time required for market synthesis from days to hours.",
      },
      {
        stat: "45%",
        title: "Quality Improvement",
        description:
          "Increased insight depth by enabling analysis of larger datasets.",
      },
      {
        stat: "Zero",
        title: "Data Leakage",
        description:
          "Maintained 100% data privacy within the client's secure cloud environment.",
      },
    ],
    techStack: [
      "Azure OpenAI",
      "LangChain",
      "Pinecone",
      "Python",
      "Next.js",
      "FastAPI",
      "PostgreSQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "AI Readiness Audit",
        description:
          "Assessing data quality and defining high-value strategic use cases.",
      },
      {
        label: "Phase 2",
        title: "Foundation Model Setup",
        description:
          "Configuring LLM parameters and building the vector database infrastructure.",
      },
      {
        label: "Phase 3",
        title: "UI/UX Development",
        description:
          "Crafting a clean, chat-based interface optimized for consultant workflows.",
      },
      {
        label: "Phase 4",
        title: "Deployment & Tuning",
        description:
          "Fine-tuning prompt templates and scaling to global practice groups.",
      },
    ],
    faqs: [
      {
        question: "How do you ensure the AI doesn't hallucinate?",
        answer:
          "We use Retrieval-Augmented Generation with strict citation requirements from source docs.",
      },
      {
        question: "Is the data used to train public models?",
        answer:
          "No, all data remains within a private Azure instance and is never used for external training.",
      },
      {
        question: "What languages does the AI understand?",
        answer:
          "The platform supports multi-lingual analysis for global market research projects.",
      },
      {
        question: "Can it handle complex financial spreadsheets?",
        answer:
          "Yes, we implemented specialized parsers to extract data from tables and structured formats.",
      },
      {
        question: "How quickly can new data be uploaded?",
        answer:
          "The automated ingestion pipeline processes and vectors new docs in near real-time.",
      },
    ],
  },
  "bca-intelligent-auction-platform": {
    slug: "bca-intelligent-auction-platform",
    title: "Intelligent Vehicle Auction Ecosystem",
    subtitle:
      "Modernizing the wholesale automotive marketplace with real-time bidding and inspection automation.",
    category: "Web Development",
    client: "British Car Auctions (BCA)",
    duration: "18 Months",
    description:
      "A comprehensive digital transformation for Europe's leading vehicle marketplace, replacing legacy systems with a high-performance auction engine and automated inspection workflow.",
    heroImage: "/assets/projects/bca-intelligent-auction-platform.jpg",
    overview:
      "BCA required a robust, scalable platform capable of handling thousands of simultaneous bidders across international borders. The project involved migrating complex auction logic to a microservices architecture while integrating real-time vehicle diagnostics.",
    challenge:
      "The existing infrastructure struggled with high-concurrency bidding events, leading to latency issues during peak hours. Additionally, manual vehicle inspections were slow and prone to human error, delaying time-to-market for auction listings.",
    solution:
      "Itransition developed a custom real-time auction engine using WebSockets for sub-second latency. We implemented an AI-driven vehicle inspection app that uses computer vision to detect physical damage and auto-generate condition reports.",
    galleryImages: [
      "/assets/projects/bca-intelligent-auction-platform-gallery-1.jpg",
      "/assets/projects/bca-intelligent-auction-platform-gallery-2.jpg",
    ],
    features: [
      "Real-time WebSocket-based bidding engine",
      "Automated computer vision damage detection",
      "Multi-currency and multi-language support",
      "Integrated vehicle history API synchronization",
      "Dynamic pricing and appraisal algorithms",
      "Advanced dealer management dashboard",
      "Automated logistics and transport scheduling",
      "High-security electronic payment gateway",
    ],
    metrics: [
      {
        label: "Auction Volume",
        value: "1.5M+ Vehicles",
      },
      {
        label: "System Latency",
        value: "< 100ms",
      },
      {
        label: "Inspection Speed",
        value: "+45% Faster",
      },
      {
        label: "User Growth",
        value: "45% YoY",
      },
    ],
    results: [
      {
        stat: "30%",
        title: "Operational Efficiency",
        description:
          "Significant reduction in administrative overhead through automated listing and documentation.",
      },
      {
        stat: "12M",
        title: "Annual Bids",
        description:
          "Successfully scaled to support over 12 million bids annually without system downtime.",
      },
      {
        stat: "99.99%",
        title: "Uptime Reliability",
        description:
          "Achieved enterprise-grade availability during high-traffic physical and digital auction events.",
      },
    ],
    techStack: [
      "Java / Spring Boot",
      "React.js",
      "WebSockets",
      "AWS Infrastructure",
      "TensorFlow AI",
      "PostgreSQL",
      "Redis Caching",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Audit & Architecture",
        description:
          "Initial discovery and design of the microservices ecosystem and data migration strategy.",
      },
      {
        label: "Phase 2",
        title: "Core Engine Development",
        description:
          "Building the real-time bidding engine and integrating core vehicle database services.",
      },
      {
        label: "Phase 3",
        title: "AI Inspection Integration",
        description:
          "Development and training of computer vision models for automated damage assessment.",
      },
      {
        label: "Phase 4",
        title: "Global Rollout",
        description:
          "Phased deployment across UK and European markets with localized configurations.",
      },
    ],
    faqs: [
      {
        question: "How does the platform handle high-concurrency bidding?",
        answer:
          "The architecture utilizes persistent WebSocket connections and a distributed message broker to ensure all bids are processed in milliseconds.",
      },
      {
        question: "Is the inspection AI reliable for all car makes?",
        answer:
          "Yes, the models were trained on millions of high-resolution images across diverse lighting conditions and vehicle types.",
      },
      {
        question: "Does it support 3rd-party integrations?",
        answer:
          "The platform features a robust API layer for integrating with vehicle history providers, banks, and logistics firms.",
      },
      {
        question: "How is data security managed?",
        answer:
          "We follow industry-standard encryption protocols and GDPR compliance for all user and transaction data.",
      },
      {
        question: "Can the platform be white-labeled?",
        answer:
          "The core engine is built to support multi-tenant configurations for various regional auction houses.",
      },
    ],
  },
  "xerox-enterprise-document-cloud": {
    slug: "xerox-enterprise-document-cloud",
    title: "Global Document Governance Framework",
    subtitle:
      "A secure, cloud-native infrastructure for intelligent document lifecycle management and regulatory compliance.",
    category: "Cloud & DevOps",
    client: "Xerox",
    duration: "24 Months",
    description:
      "Redefining enterprise content management with a secure hybrid-cloud solution that automates document classification and ensures global compliance.",
    heroImage: "/assets/projects/xerox-enterprise-document-cloud.jpg",
    overview:
      "Xerox needed to transition their legacy document management services to a modern cloud-native environment while maintaining strict security standards for Fortune 500 clients.",
    challenge:
      "Managing billions of documents across fragmented regional silos created compliance risks and hindered cross-departmental collaboration. Data residency requirements varied significantly across jurisdictions.",
    solution:
      "Itransition designed a multi-region Azure architecture with automated data classification and intelligent search capabilities powered by ElasticSearch.",
    galleryImages: [
      "/assets/projects/xerox-enterprise-document-cloud-gallery-1.jpg",
      "/assets/projects/xerox-enterprise-document-cloud-gallery-2.jpg",
    ],
    features: [
      "Automated PII data masking",
      "Cross-region data residency management",
      "AI-powered OCR and indexing",
      "Intelligent full-text search engine",
      "Granular role-based access control",
      "Audit trail and compliance reporting",
      "Hybrid-cloud storage orchestration",
      "Integration with Microsoft 365 / SAP",
    ],
    metrics: [
      {
        label: "Documents Managed",
        value: "1.5M+",
      },
      {
        label: "Compliance Score",
        value: "99.9%",
      },
      {
        label: "Search Speed",
        value: "< 2s",
      },
      {
        label: "Cost Savings",
        value: "35% reduction",
      },
    ],
    results: [
      {
        stat: "40%",
        title: "Faster Retrieval",
        description:
          "Enhanced indexing algorithms reduced document search and retrieval time by nearly half.",
      },
      {
        stat: "Zero",
        title: "Security Breaches",
        description:
          "Implementation of advanced encryption and multi-factor authentication ensured total data security.",
      },
      {
        stat: "25+",
        title: "Countries Supported",
        description:
          "Successfully deployed across multi-jurisdictional environments with customized data laws.",
      },
    ],
    techStack: [
      "Microsoft Azure",
      "DotNet Core",
      "ElasticSearch",
      "Docker / Kubernetes",
      "Terraform",
      "React",
      "Azure SQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Infrastructure Design",
        description:
          "Cloud strategy definition and security framework planning for hybrid deployment.",
      },
      {
        label: "Phase 2",
        title: "Migration Engine",
        description:
          "Development of automated tools for bulk document migration and metadata mapped extraction.",
      },
      {
        label: "Phase 3",
        title: "AI Search Layer",
        description:
          "Integration of AI services for intelligent document classification and OCR processing.",
      },
      {
        label: "Phase 4",
        title: "Compliance Audit",
        description:
          "System-wide security hardening and final regulatory certification for global markets.",
      },
    ],
    faqs: [
      {
        question: "How is data residency handled?",
        answer:
          "The system uses geo-fencing rules to ensure documents are stored and processed within specific regional boundaries.",
      },
      {
        question: "Does the search work for scanned PDFs?",
        answer:
          "Yes, our advanced OCR engine extracts text from images and scanned documents for indexing.",
      },
      {
        question: "Can it integrate with our existing ERP?",
        answer:
          "The platform provides a comprehensive set of RESTful APIs for seamless enterprise system integration.",
      },
      {
        question: "Is the platform SOC 2 compliant?",
        answer:
          "Yes, the infrastructure and application were built to meet SOC 2 Type II and HIPAA requirements.",
      },
      {
        question: "How does it handle massive file sizes?",
        answer:
          "We use chunked uploading and distributed storage to manage files up to 2GB each efficiently.",
      },
    ],
  },
  "expedia-global-inventory-sync": {
    slug: "expedia-global-inventory-sync",
    title: "Global Inventory Management Engine",
    subtitle:
      "High-frequency microservices architecture for real-time synchronization of travel inventory across 200+ countries.",
    category: "Web Development",
    client: "Expedia Group",
    duration: "14 Months",
    description:
      "A precision-engineered synchronization layer that handles millions of inventory updates per second, ensuring price and availability parity worldwide.",
    heroImage: "/assets/projects/expedia-global-inventory-sync.jpg",
    overview:
      "Operating at Expedia's scale requires massive parallel processing. The project focused on building a resilient data pipeline that bridges hotel partners and the primary consumer booking platforms.",
    challenge:
      "Inventory discrepancies and overbookings were occurring due to slow synchronization between external hotel systems and internal booking caches.",
    solution:
      "Itransition implemented an event-driven Kafka architecture that enables real-time updates and ensures eventual consistency across globally distributed data centers.",
    galleryImages: [
      "/assets/projects/expedia-global-inventory-sync-gallery-1.jpg",
      "/assets/projects/expedia-global-inventory-sync-gallery-2.jpg",
    ],
    features: [
      "Event-driven Kafka message bus",
      "Dynamic pricing adjustment engine",
      "Automated overbooking prevention",
      "Multi-channel inventory management",
      "Real-time partner dashboard",
      "High-throughput API gateway",
      "Intelligent cache invalidation",
      "Comprehensive logging and monitoring",
    ],
    metrics: [
      {
        label: "Updates / Second",
        value: "1.5M+",
      },
      {
        label: "Consistency Gap",
        value: "< 50ms",
      },
      {
        label: "Partner Reach",
        value: "1M+ Hotels",
      },
      {
        label: "Error Rate",
        value: "< 0.01%",
      },
    ],
    results: [
      {
        stat: "90%",
        title: "Discrepancy Reduction",
        description:
          "Virtually eliminated price disparity issues between partner listings and checkout pages.",
      },
      {
        stat: "15%",
        title: "Conversion Uplift",
        description:
          "Improved availability accuracy led to a measurable increase in successful booking conversions.",
      },
      {
        stat: "Scalable",
        title: "Future-Ready",
        description:
          "Architecture successfully handled 3x traffic spikes during holiday peak seasons.",
      },
    ],
    techStack: [
      "Java / Spring Boot",
      "Apache Kafka",
      "MongoDB",
      "Redis",
      "Node.js",
      "Grafana / Prometheus",
      "GitLab CI/CD",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Load Analysis",
        description:
          "Evaluating peak traffic patterns and identifying bottlenecks in existing sync pipelines.",
      },
      {
        label: "Phase 2",
        title: "Kafka Implementation",
        description:
          "Establishing the core event streaming infrastructure and producer/consumer contracts.",
      },
      {
        label: "Phase 3",
        title: "Microservices Pivot",
        description:
          "Decomposing the legacy synchronization monolith into focused, high-speed services.",
      },
      {
        label: "Phase 4",
        title: "Beta Validation",
        description:
          "Pilot rollout with major hotel chains followed by full global deployment.",
      },
    ],
    faqs: [
      {
        question: "How do you ensure data doesn't get lost?",
        answer:
          "We use Kafka's persistence features and idempotent consumers to guarantee delivery and processing.",
      },
      {
        question: "Can it handle 3rd party API failures?",
        answer:
          "Yes, we implemented robust circuit breakers and retry logic to maintain system stability.",
      },
      {
        question: "Is there a manual override for prices?",
        answer:
          "The partner portal allows for instant manual adjustments that propagate across all channels.",
      },
      {
        question: "How do you monitor system health?",
        answer:
          "We use a dedicated ELK stack with custom alerts for any latency spikes or data mismatches.",
      },
      {
        question: "Does it support private deals?",
        answer:
          "The engine includes a rules-based layer to manage member-only rates and promotional pricing.",
      },
    ],
  },
  "medtech-ai-patient-care": {
    slug: "medtech-ai-patient-care",
    title: "AI-Driven Telemedicine & Patient Monitoring",
    subtitle:
      "Revolutionizing clinical workflows with predictive diagnostics and remote patient care automation.",
    category: "AI & Data",
    client: "Global Healthcare Systems",
    duration: "12 Months",
    description:
      "An intelligent healthcare ecosystem that combines HIPAA-compliant video conferencing with real-time biometric analysis and predictive health modeling.",
    heroImage: "/assets/projects/medtech-ai-patient-care.jpg",
    overview:
      "The provider needed to scale their remote care capabilities while reducing the workload on clinicians through automated screening and patient triage.",
    challenge:
      "Clinicians were overwhelmed with manual patient check-ins and data entry, leading to burnout and delayed responses for critical cases.",
    solution:
      "Itransition developed a telemedicine platform featuring an AI health assistant that pre-screens patients and prioritizes high-risk individuals based on biometric data.",
    galleryImages: [
      "/assets/projects/medtech-ai-patient-care-gallery-1.jpg",
      "/assets/projects/medtech-ai-patient-care-gallery-2.jpg",
    ],
    features: [
      "HIPAA-compliant video streaming",
      "AI-powered triage screening",
      "EHR / EMR seamless integration",
      "Real-time biometric monitoring",
      "Predictive health trend modeling",
      "Automated appointment scheduling",
      "Patient portal with AI chatbot",
      "Secure messaging and file sharing",
    ],
    metrics: [
      {
        label: "Daily Consultations",
        value: "5,000+",
      },
      {
        label: "Clinician Wait Time",
        value: "50% less",
      },
      {
        label: "Predictive Accuracy",
        value: "94.5%",
      },
      {
        label: "Patient Satisfaction",
        value: "4.8/5",
      },
    ],
    results: [
      {
        stat: "50%",
        title: "Burnout Reduction",
        description:
          "Automation of routine triage drastically reduced administrative pressure on medical staff.",
      },
      {
        stat: "3x",
        title: "Capacity Increase",
        description:
          "The system allowed the clinic to see three times as many patients without increasing headcount.",
      },
      {
        stat: "12%",
        title: "Early Intervention",
        description:
          "Predictive models correctly identified high-risk trends before they became acute emergencies.",
      },
    ],
    techStack: [
      "Python / Django",
      "TensorFlow",
      "WebRTC",
      "AWS HealthLake",
      "React Native",
      "PostgreSQL",
      "HL7/FHIR Protocols",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Security & Compliance",
        description:
          "Establishing a HIPAA-certified cloud environment and secure data architecture.",
      },
      {
        label: "Phase 2",
        title: "Core Platform Build",
        description:
          "Developing the video engine and secure messaging infrastructure for doctors and patients.",
      },
      {
        label: "Phase 3",
        title: "AI Model Training",
        description:
          "Training triage models on anonymized clinical data to ensure safe and accurate pre-screening.",
      },
      {
        label: "Phase 4",
        title: "EHR Integration",
        description:
          "Linking the platform with hospital management systems for unified patient records.",
      },
    ],
    faqs: [
      {
        question: "Is patient data truly secure?",
        answer:
          "All data is encrypted end-to-end and stored in compliance with international healthcare regulations.",
      },
      {
        question: "Can it connect with wearing devices?",
        answer:
          "Yes, we integrate with Apple Health, Google Fit, and proprietary medical wearable devices.",
      },
      {
        question: "Does the AI make medical decisions?",
        answer:
          "No, the AI is a decision-support tool that provides suggestions to licensed clinicians.",
      },
      {
        question: "Is it available in multiple languages?",
        answer:
          "The patient interface supports over 12 languages with real-time chat translation.",
      },
      {
        question: "How long does onboarding take?",
        answer:
          "Medical facilities can be fully integrated and staff trained within 4 to 6 weeks.",
      },
    ],
  },
  "hughesnet-digital-evolution": {
    slug: "hughesnet-digital-evolution",
    title: "HughesNet Digital Evolution",
    subtitle:
      "Pioneering a Unified Digital Ecosystem for Satellite Internet Services.",
    category: "Web Development",
    client: "Hughes Network Systems",
    duration: "24 Months",
    description:
      "A comprehensive digital transformation initiative that modernized the HughesNet customer experience by consolidating legacy portals into a high-performance, unified self-service platform.",
    heroImage: "/assets/projects/hughesnet-digital-evolution.jpg",
    overview:
      "Hughes Network Systems required a complete overhaul of their fragmented digital touchpoints. We engineered a scalable, cloud-native architecture to serve millions of satellite internet subscribers with real-time data management and billing tools.",
    challenge:
      "The existing infrastructure was composed of disparate legacy systems that led to high support costs, inconsistent user experiences, and significant friction in data top-up transactions.",
    solution:
      "We implemented a microservices-based architecture using React and Node.js on AWS, enabling real-time synchronization between billing systems and customer dashboards with a mobile-first design philosophy.",
    galleryImages: [
      "/assets/projects/hughesnet-digital-evolution-gallery-1.jpg",
      "/assets/projects/hughesnet-digital-evolution-gallery-2.jpg",
    ],
    features: [
      "Unified Customer Dashboard",
      "Real-time Data Usage Monitoring",
      "Automated Token Purchase",
      "Intelligent Billing Analytics",
      "Interactive Troubleshooting Guides",
      "Multi-language Support",
      "Seamless Mobile Synchronization",
      "Personalized Promotional Engine",
    ],
    metrics: [
      {
        label: "Customer Retention",
        value: "+22%",
      },
      {
        label: "Avg Page Load",
        value: "1.2s",
      },
      {
        label: "API Availability",
        value: "99.95%",
      },
      {
        label: "Mobile Adoption",
        value: "+65%",
      },
    ],
    results: [
      {
        stat: "+40%",
        title: "NPS Growth",
        description:
          "Achieved record-high Net Promoter Scores through intuitive UI/UX and seamless self-service operations.",
      },
      {
        stat: "50%",
        title: "Support Savings",
        description:
          "Dramatically reduced call center volume and operational overhead via intelligent automation.",
      },
      {
        stat: "15x",
        title: "System Scalability",
        description:
          "Next-gen architecture supports massive concurrent user spikes without performance degradation.",
      },
    ],
    techStack: [
      "React",
      "Node.js",
      "AWS",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Strategy & Audit",
        description:
          "In-depth analysis of legacy systems and customer journey mapping to identify key friction points.",
      },
      {
        label: "Phase 2",
        title: "Architecture Design",
        description:
          "Engineering a cloud-native microservices framework capable of managing high-volume real-time data.",
      },
      {
        label: "Phase 3",
        title: "Agile Development",
        description:
          "Iterative sprints focused on core functional modules with integrated security and QA automation.",
      },
      {
        label: "Phase 4",
        title: "Global Launch",
        description:
          "Seamless phased rollout to millions of subscribers with zero downtime and post-launch optimization.",
      },
    ],
    faqs: [
      {
        question: "How does the platform handle real-time data monitoring?",
        answer:
          "We utilize high-speed WebSocket connections interacting with back-end billing APIs to provide instantaneous usage updates.",
      },
      {
        question: "Is the system compliant with enterprise security standards?",
        answer:
          "Yes, the entire platform is SOC2 Type II compliant and utilizes end-to-end encryption for all sensitive user data.",
      },
      {
        question: "Can users manage their accounts across different devices?",
        answer:
          "Absolutely, the platform features unified session management ensuring a consistent experience across web and mobile.",
      },
      {
        question: "How was legacy data migration handled?",
        answer:
          "We implemented a proprietary ETL pipeline that migrated over 10 years of historical data with 99.9% integrity.",
      },
      {
        question: "Does the platform support offline capabilities?",
        answer:
          "Selected features include PWA support for offline access to account history and support documentation.",
      },
    ],
  },
  "decisiv-srm-platform": {
    slug: "decisiv-srm-platform",
    title: "Service Relationship Management",
    subtitle: "Revolutionizing the Commercial Vehicle Aftermarket Ecosystem.",
    category: "Cloud & DevOps",
    client: "Decisiv",
    duration: "36 Months",
    description:
      "A mission-critical cloud-native platform that connects fleets, manufacturers, and service providers to streamline commercial vehicle maintenance and service events.",
    heroImage: "/assets/projects/decisiv-srm-platform.jpg",
    overview:
      "Decisiv needed to scale their industry-leading service management platform. We provided the engineering expertise to transition their monolith to a modern distributed cloud architecture.",
    challenge:
      "Legacy architecture limitations were hindering the ability to integrate with new OEM partners and process the rapidly growing volume of service events.",
    solution:
      "Engineering a multi-tenant, event-driven architecture using Java/Spring and AWS, enabling seamless integration with SAP, Oracle, and proprietary fleet systems.",
    galleryImages: [
      "/assets/projects/decisiv-srm-platform-gallery-1.jpg",
      "/assets/projects/decisiv-srm-platform-gallery-2.jpg",
    ],
    features: [
      "Asset Lifecycle Tracking",
      "Automated Service Requests",
      "Parts Inventory Integration",
      "Warranty Claim Automation",
      "Real-time Fleet Health Analytics",
      "Predictive Maintenance Alerts",
      "Vendor Performance Dashboard",
      "Multi-tenancy Architecture",
    ],
    metrics: [
      {
        label: "Managed Assets",
        value: "15M+",
      },
      {
        label: "Fleet Uptime",
        value: "+18%",
      },
      {
        label: "Service Accuracy",
        value: "98%",
      },
      {
        label: "Cost Reduction",
        value: "12%",
      },
    ],
    results: [
      {
        stat: "25%",
        title: "Reduced Dwell Time",
        description:
          "Commercial vehicles return to service faster through streamlined digital workflow automation.",
      },
      {
        stat: "$2B+",
        title: "Transacted Value",
        description:
          "Securely processing billions in annual service commerce across the global ecosystem.",
      },
      {
        stat: "20k+",
        title: "Service Points",
        description:
          "Connected the largest network of commercial vehicle service locations in North America.",
      },
    ],
    techStack: [
      "Java",
      "Spring Boot",
      "Angular",
      "AWS",
      "Kafka",
      "PostgreSQL",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery Phase",
        description:
          "Mapping the complex commercial vehicle ecosystem to identify integration bottle-necks.",
      },
      {
        label: "Phase 2",
        title: "Cloud Migration",
        description:
          "Re-architecting core services into a distributed, auto-scaling AWS environment.",
      },
      {
        label: "Phase 3",
        title: "API Integration",
        description:
          "Establishing secure data bridges with major OEMs and third-party parts providers.",
      },
      {
        label: "Phase 4",
        title: "Scale & Optimize",
        description:
          "Implementing advanced analytics and predictive maintenance modules for enterprise fleets.",
      },
    ],
    faqs: [
      {
        question: "How does the platform ensure data privacy for fleets?",
        answer:
          "We use granular RBAC and multi-tenant isolation at the database level to ensure data segregation.",
      },
      {
        question: "Does it support mobile access for technicians?",
        answer:
          "Yes, a dedicated mobile interface allows technicians to update service status directly from the bay.",
      },
      {
        question: "Can it integrate with existing ERP systems?",
        answer:
          "The platform features a robust API suite for seamless integration with SAP, Oracle, and Microsoft Dynamics.",
      },
      {
        question: "How is system uptime maintained?",
        answer:
          "We utilize multi-region AWS deployments with automated failover to ensure 99.9% availability.",
      },
      {
        question: "What is the typical onboarding time?",
        answer:
          "New service locations can be fully integrated into the network in less than 48 hours.",
      },
    ],
  },
  "aarp-rewards-gamification": {
    slug: "aarp-rewards-gamification",
    title: "AARP Loyalty Ecosystem",
    subtitle:
      "Incentivizing Healthy Aging through Gamified Digital Experiences.",
    category: "Mobile Development",
    client: "AARP",
    duration: "18 Months",
    description:
      "A comprehensive loyalty and engagement platform designed to empower millions of AARP members through health challenges, learning goals, and community impact.",
    heroImage: "/assets/projects/aarp-rewards-gamification.jpg",
    overview:
      "AARP sought to modernize their member engagement strategy. We developed a gamified rewards system that drives meaningful daily interactions and social contributions.",
    challenge:
      "Traditional engagement methods were seeing declining participation among younger seniors. The goal was to build a 'digital-first' ecosystem that rewards healthy habits.",
    solution:
      "Developed a cross-platform mobile application utilizing a real-time gamification engine that tracks achievements across health, learning, and advocacy.",
    galleryImages: [
      "/assets/projects/aarp-rewards-gamification-gallery-1.jpg",
      "/assets/projects/aarp-rewards-gamification-gallery-2.jpg",
    ],
    features: [
      "Gamified Health Tracking",
      "Real-time Point Accrual",
      "Dynamic Reward Catalog",
      "Social Impact Leaderboard",
      "Educational Video Content",
      "Biometric Auth Integration",
      "Personalized Member Feed",
      "Cross-device Synchronization",
    ],
    metrics: [
      {
        label: "Active Users",
        value: "4.2M",
      },
      {
        label: "Growth Velocity",
        value: "+28%",
      },
      {
        label: "Member Retention",
        value: "92%",
      },
      {
        label: "Goal Completion",
        value: "75%",
      },
    ],
    results: [
      {
        stat: "30%",
        title: "Engagement Boost",
        description:
          "Gamified mechanics resulted in a significant increase in daily active user session duration.",
      },
      {
        stat: "1.5M+",
        title: "Social Donations",
        description:
          "Members converted digital achievements into real-world charitable impacts globally.",
      },
      {
        stat: "Top 10",
        title: "App Store Rank",
        description:
          "Consistent high performance in social impact and healthcare app categories.",
      },
    ],
    techStack: [
      "React Native",
      "GraphQL",
      "Firebase",
      "GCP",
      "MongoDB",
      "Node.js",
      "Swift",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Persona Research",
        description:
          "Identifying user behaviors and motivations to tailor the gamification strategy.",
      },
      {
        label: "Phase 2",
        title: "Engine Development",
        description:
          "Building a high-concurrency rewards engine capable of processing millions of events.",
      },
      {
        label: "Phase 3",
        title: "UX Refinement",
        description:
          "Rigorous accessibility testing to ensure the interface is senior-friendly and highly legible.",
      },
      {
        label: "Phase 4",
        title: "Ecosystem Launch",
        description:
          "National rollout with continuous A/B testing to optimize member conversion rates.",
      },
    ],
    faqs: [
      {
        question: "Is the app accessible for users with visual impairments?",
        answer:
          "Yes, the app follows WCAG 2.1 AA guidelines with scalable text and high-contrast modes.",
      },
      {
        question: "How are rewards processed and fulfilled?",
        answer:
          "We integrated a secure third-party reward gateway for real-time digital and physical fulfillment.",
      },
      {
        question: "Can I track my progress on both web and mobile?",
        answer:
          "A unified profile system ensures all points and achievements are synced in real-time across devices.",
      },
      {
        question: "What types of health activities can be tracked?",
        answer:
          "The platform integrates with Apple Health and Google Fit to track steps, sleep, and physical activity.",
      },
      {
        question: "Are user rewards taxable?",
        answer:
          "The system includes automated reporting to help users and the organization track value thresholds.",
      },
    ],
  },
  "jnj-vr-surgical-training": {
    slug: "jnj-vr-surgical-training",
    title: "VR Surgical Training",
    subtitle:
      "Revolutionizing Surgical Precision through Immersive VR Simulations.",
    category: "AI & Data",
    client: "Johnson & Johnson",
    duration: "12 Months",
    description:
      "An industry-leading VR training platform that uses haptic feedback and AI-driven performance assessment to train surgeons on complex orthopedic procedures.",
    heroImage: "/assets/projects/jnj-vr-surgical-training.jpg",
    overview:
      "Johnson & Johnson needed a scalable way to train global surgical teams. We built an immersive simulation environment that mimics real-world surgical environments with extreme precision.",
    challenge:
      "Traditional surgical training is expensive, requires physical cadavers, and offers limited objective performance metrics for trainees.",
    solution:
      "A custom Unity-based VR application integrated with haptic peripherals and an AI scoring engine that evaluates surgical precision in real-time.",
    galleryImages: [
      "/assets/projects/jnj-vr-surgical-training-gallery-1.jpg",
      "/assets/projects/jnj-vr-surgical-training-gallery-2.jpg",
    ],
    features: [
      "High-fidelity 3D Anatomy",
      "Haptic Feedback Integration",
      "Real-time Precision Scoring",
      "Multi-user Surgical Theater",
      "Procedure Playback Analysis",
      "Automated Assessment Reports",
      "Realistic Instrument Physics",
      "AI-driven Path Correction",
    ],
    metrics: [
      {
        label: "Error Reduction",
        value: "30%",
      },
      {
        label: "Certification Speed",
        value: "+55%",
      },
      {
        label: "Training Cost",
        value: "-30%",
      },
      {
        label: "Skill Retention",
        value: "75%",
      },
    ],
    results: [
      {
        stat: "80%",
        title: "Skill Acquisition",
        description:
          "Surgeons reached proficiency levels significantly faster compared to traditional classroom methods.",
      },
      {
        stat: "40%",
        title: "Accuracy Gain",
        description:
          "Measurable improvement in bone-drilling and implant placement precision during clinical trials.",
      },
      {
        stat: "Global",
        title: "Scalable Deployment",
        description:
          "Training now accessible across 15+ international medical centers via secure cloud synchronization.",
      },
    ],
    techStack: [
      "Unity",
      "C#",
      "TensorFlow",
      "Azure",
      "Python",
      "Oculus SDK",
      "Nvidia Holoscan",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Clinical Mapping",
        description:
          "Working with expert surgeons to decompose complex procedures into digital workflows.",
      },
      {
        label: "Phase 2",
        title: "Bespoke Physics Engine",
        description:
          "Developing custom haptic and rigid-body physics to simulate realistic bone and tissue interaction.",
      },
      {
        label: "Phase 3",
        title: "AI Scoring Engine",
        description:
          "Training machine learning models to identify and score surgical precision and deviations.",
      },
      {
        label: "Phase 4",
        title: "Pilot Validation",
        description:
          "Rigorous clinical testing and global rollout across Johnson & Johnson training institutes.",
      },
    ],
    faqs: [
      {
        question: "Which VR hardware is required for the training?",
        answer:
          "The platform is optimized for Meta Quest Pro and specialized haptic gloves for tactile feedback.",
      },
      {
        question: "How is surgical precision measured?",
        answer:
          "AI algorithms track instrument position, force, and angle against established clinical benchmarks.",
      },
      {
        question: "Can multiple surgeons train together?",
        answer:
          "Yes, the platform supports multi-user 'Surgical Theaters' for collaborative team-based training.",
      },
      {
        question: "Is the training data stored securely?",
        answer:
          "All performance data is encrypted and stored in HIPAA-compliant cloud environments.",
      },
      {
        question: "Can the simulation be customized for different patients?",
        answer:
          "We are developing modules to import MRI/CT scans for patient-specific surgical rehearsals.",
      },
    ],
  },
  "pawn-management-modernization": {
    slug: "pawn-management-modernization",
    title: "Enterprise Pawn Management Modernization",
    subtitle:
      "Transformation of a legacy desktop monolith into a high-scale cloud platform.",
    category: "Web Development",
    client: "National Pawn & Jewelry",
    duration: "18 Months",
    description:
      "A comprehensive modernization of a mission-critical legacy desktop application into a resilient, cloud-native web platform supporting hundreds of locations across the United States.",
    heroImage: "/assets/projects/pawn-management-modernization.jpg",
    overview:
      "The client operated on a legacy Delphi-based system that was increasingly difficult to maintain and unable to support modern mobile requirements or multi-state regulatory compliance updates. Keyhole Software was engaged to lead the architectural redesign and implementation of a modern, web-based replacement that ensured high availability, enterprise security, and seamless data migration from decades of legacy records.",
    challenge:
      "The primary challenge was replicating complex business logic embedded in legacy code while ensuring zero downtime during the transition. The system had to handle high-concurrency transactions, integrate with hardware peripherals like fingerprint scanners and label printers, and comply with varied state-level lending regulations in real-time.",
    solution:
      "Our team architected a microservices-based solution using React and Node.js, deployed on AWS. We implemented a robust offline-first synchronization strategy for regional stores and built a centralized compliance engine that dynamically applies lending rules based on geo-location and local legislation.",
    galleryImages: [
      "/assets/projects/pawn-management-modernization-gallery-1.jpg",
      "/assets/projects/pawn-management-modernization-gallery-2.jpg",
    ],
    features: [
      "Real-time Regulatory Compliance Engine",
      "Integrated Hardware Peripheral Support",
      "Cloud-Native Microservices Architecture",
      "Automated Data Migration Utilities",
      "Role-Based Access Control (RBAC)",
      "Multi-State Lending Rule Management",
      "Biometric Security Integration",
      "Advanced Inventory Management System",
    ],
    metrics: [
      {
        label: "Boost in Efficiency",
        value: "35%",
      },
      {
        label: "System Availability",
        value: "99.95%",
      },
      {
        label: "Training Reduction",
        value: "30%",
      },
      {
        label: "Deployment Frequency",
        value: "8x",
      },
    ],
    results: [
      {
        stat: "45%",
        title: "Operational Efficiency",
        description:
          "Drastically reduced transaction times at the counter, allowing associates to serve more customers with higher accuracy.",
      },
      {
        stat: "30%",
        title: "Onboarding Speed",
        description:
          "Simplified UI/UX reduced the learning curve for new employees from weeks to a few days.",
      },
      {
        stat: "100%",
        title: "Compliance Accuracy",
        description:
          "Automated lending rules eliminated the risk of human error in complex state-specific regulatory calculations.",
      },
    ],
    techStack: [
      "React",
      "Node.js",
      "TypeScript",
      "AWS",
      "PostgreSQL",
      "Docker",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Architecture",
        description:
          "Comprehensive analysis of legacy logic and definition of the new microservices blueprint.",
      },
      {
        label: "Phase 2",
        title: "Core Platform Build",
        description:
          "Implementation of the centralized compliance engine and foundational API services.",
      },
      {
        label: "Phase 3",
        title: "Peripheral Integration",
        description:
          "Seamless integration of on-site hardware including scanners, printers, and biometric devices.",
      },
      {
        label: "Phase 4",
        title: "Staged Rollout",
        description:
          "Pilot deployment followed by a phased state-by-state migration and legacy decommissioning.",
      },
    ],
    faqs: [
      {
        question: "How was legacy data integrity maintained?",
        answer:
          "We built custom ETL tools that validated and cleansed legacy records before migrating them into the new relational structure.",
      },
      {
        question: "Can the system work if the internet goes down?",
        answer:
          "Yes, we implemented a sophisticated local caching layer that allows critical transaction processing during temporary outages.",
      },
      {
        question: "Is the system scalable to more states?",
        answer:
          "The compliance engine is metadata-driven, allowing for new state rules to be added via configuration without code changes.",
      },
      {
        question: "How is security handled for sensitive data?",
        answer:
          "The platform uses AES-256 encryption at rest and transit, integrated with enterprise-grade identity providers.",
      },
      {
        question: "What hardware is supported?",
        answer:
          "We support a wide range of industry-standard Epson printers, Topaz signature pads, and Futronic fingerprint scanners.",
      },
    ],
  },
  "enterprise-logistics-modernization": {
    slug: "enterprise-logistics-modernization",
    title: "Cloud-Native Logistics Platform Migration",
    subtitle:
      "Modernizing a global supply chain monolith into a high-throughput microservices architecture.",
    category: "Cloud & DevOps",
    client: "Global Logistics Leader",
    duration: "12 Months",
    description:
      "A strategic modernization effort to move a massive Java-based logistics monolith to a cloud-native, scalable architecture optimized for global real-time tracking.",
    heroImage: "/assets/projects/enterprise-logistics-modernization.jpg",
    overview:
      "The client faced significant performance bottlenecks and scaling issues with their legacy Java platform during peak shipping seasons. Keyhole Software led a multi-phase modernization initiative to decompose the monolith into scalable microservices, implement a robust CI/CD pipeline, and migrate the entire ecosystem to AWS EKS.",
    challenge:
      "The system processed millions of events per hour, making performance and data consistency critical. The team had to decouple tightly linked business domains while maintaining full operation of the legacy system to avoid any disruption to global shipping routes.",
    solution:
      "We implemented an event-driven architecture using Apache Kafka to handle high-frequency data streams. The frontend was rebuilt using React for improved responsiveness, and the backend was transitioned to Spring Boot services running on Kubernetes, enabling auto-scaling based on real-time load.",
    galleryImages: [
      "/assets/projects/enterprise-logistics-modernization-gallery-1.jpg",
      "/assets/projects/enterprise-logistics-modernization-gallery-2.jpg",
    ],
    features: [
      "Event-Driven Microservices Architecture",
      "Real-Time Package Tracking Engine",
      "Automated CI/CD with Jenkins & Terraform",
      "Global Load Balancing & Auto-Scaling",
      "Predictive Route Optimization API",
      "Enterprise Data Consolidation",
      "Cloud-Native Security Hardening",
      "High-Availability Database Clustering",
    ],
    metrics: [
      {
        label: "Faster Releases",
        value: "50%",
      },
      {
        label: "Cost Savings",
        value: "35%",
      },
      {
        label: "Traffic Capacity",
        value: "4x",
      },
      {
        label: "Downtime Reduction",
        value: "99%",
      },
    ],
    results: [
      {
        stat: "60%",
        title: "Deployment Velocity",
        description:
          "Automated pipelines allowed the team to move from monthly to daily production deployments.",
      },
      {
        stat: "35%",
        title: "Infrastructure ROI",
        description:
          "Optimized container orchestration reduced cloud spend while improving system performance.",
      },
      {
        stat: "100%",
        title: "Peak Performance",
        description:
          "The system handled record-high volumes during holiday seasons with zero performance degradation.",
      },
    ],
    techStack: [
      "Java",
      "Spring Boot",
      "Apache Kafka",
      "AWS EKS",
      "React",
      "Terraform",
      "PostgreSQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Strategic Blueprint",
        description:
          "Domain-driven design workshops to identify microservices boundaries and event schemas.",
      },
      {
        label: "Phase 2",
        title: "Infrastructure Provisioning",
        description:
          "Setting up the AWS EKS environment and internal developer platforms using IaC.",
      },
      {
        label: "Phase 3",
        title: "Feature Migration",
        description:
          "Incremental straggler-pattern migration of core shipping and tracking services.",
      },
      {
        label: "Phase 4",
        title: "Performance Tuning",
        description:
          "Stress testing and optimization of Kafka consumers for global scale operations.",
      },
    ],
    faqs: [
      {
        question: "How did you manage data consistency across services?",
        answer:
          "We utilized the Saga pattern and event-driven updates via Kafka to ensure eventual consistency across distributed domains.",
      },
      {
        question: "What was the migration strategy?",
        answer:
          "We used the Strangler Fig pattern, gradually moving traffic from the monolith to microservices to minimize risk.",
      },
      {
        question: "How is the system monitored?",
        answer:
          "We implemented full-stack observability using Prometheus, Grafana, and structured centralized logging.",
      },
      {
        question: "How long did it take to see results?",
        answer:
          "The client saw a 20% performance improvement within the first three months after the first core service migration.",
      },
      {
        question: "Is the platform multiregional?",
        answer:
          "Yes, the architecture supports multi-region AWS deployments for low latency and high disaster recovery capabilities.",
      },
    ],
  },
  "insurance-claims-automation": {
    slug: "insurance-claims-automation",
    title: "AI-Powered Insurance Claims Engine",
    subtitle:
      "Automating complex claims processing with intelligent data extraction and rules engine.",
    category: "AI & Data",
    client: "Enterprise Insurance Group",
    duration: "10 Months",
    description:
      "Development of an AI-enhanced claims processing platform that automates the intake, classification, and initial assessment of enterprise insurance claims.",
    heroImage: "/assets/projects/insurance-claims-automation.jpg",
    overview:
      "The processing of claims was a highly manual, error-prone effort involving thousands of physical and digital documents daily. Keyhole Software implemented an AI-driven pipeline that uses natural language processing (NLP) and a custom rules engine to automate 80% of routine claims, freeing adjusters to focus on complex cases.",
    challenge:
      "The primary challenge was the variety and low quality of incoming documents. The system needed to extract data from hand-written forms, poor-quality faxes, and varied digital formats with extremely high accuracy to ensure fair settlements and prevent fraud.",
    solution:
      "We developed a pipeline utilizing Python and Azure Machine Learning to extract and normalize data. This was coupled with a sophisticated Drools-based rules engine that analyzes claims against policy metadata to determine initial settlement recommendations.",
    galleryImages: [
      "/assets/projects/insurance-claims-automation-gallery-1.jpg",
      "/assets/projects/insurance-claims-automation-gallery-2.jpg",
    ],
    features: [
      "Intelligent Document Extraction",
      "NLP-Based Claim Classification",
      "Automated Rules Engine (Drools)",
      "Fraud Detection Scoring Model",
      "Claims Adjuster Collaboration UI",
      "Policy Integration Middleware",
      "Real-Time Processing Analytics",
      "Secure HIPAA/PII Handling",
    ],
    metrics: [
      {
        label: "Automation Rate",
        value: "80%",
      },
      {
        label: "Claims Speed",
        value: "3.5x",
      },
      {
        label: "Accuracy Rate",
        value: "95%",
      },
      {
        label: "Cost Reduction",
        value: "35%",
      },
    ],
    results: [
      {
        stat: "80%",
        title: "Claims Automation",
        description:
          "The majority of routine claims are now processed from intake to settlement without manual intervention.",
      },
      {
        stat: "5x",
        title: "Resolution Velocity",
        description:
          "Claim resolution time dropped from an average of 10 days down to less than 48 hours for automated cases.",
      },
      {
        stat: "45%",
        title: "Operational Savings",
        description:
          "Reduced the per-claim processing cost by nearly half through intelligent task automation.",
      },
    ],
    techStack: [
      "Python",
      "Azure ML",
      "Drools",
      "Node.js",
      "React",
      "Databricks",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Data Science Discovery",
        description:
          "Analyzing historical claims data to train and fine-tune extraction and classification models.",
      },
      {
        label: "Phase 2",
        title: "Pipeline Development",
        description:
          "Building the scalable intake pipeline and integrating the AI/ML inference service.",
      },
      {
        label: "Phase 3",
        title: "Rules Engine Build",
        description:
          "Translating complex policy documents into executable business rules.",
      },
      {
        label: "Phase 4",
        title: "Deployment & Feedback",
        description:
          "Rolling out the system and implementing human-in-the-loop validation for continuous model improvement.",
      },
    ],
    faqs: [
      {
        question: "What happens if the AI is unsure?",
        answer:
          "The system uses confidence scoring; any claim below the threshold is automatically routed to a human adjuster for review.",
      },
      {
        question: "Can it handle hand-written documents?",
        answer:
          "Yes, our OCR models are specifically tuned for high-accuracy extraction from a wide variety of handwritten formats.",
      },
      {
        question: "How is PII data protected during AI training?",
        answer:
          "All data used for model training is anonymized and processed within a secure, isolated sandbox environment.",
      },
      {
        question: "Can business users update the rules?",
        answer:
          "Yes, the rules engine allows authorized business analysts to modify settlement criteria without developer assistance.",
      },
      {
        question: "How does the system prevent fraud?",
        answer:
          "The platform includes a dedicated fraud-scoring model that flags anomalous patterns for investigation.",
      },
    ],
  },
  "tomtom-digital-cockpit": {
    slug: "tomtom-digital-cockpit",
    title: "TomTom Digital Cockpit",
    subtitle: "Revolutionizing the In-Car Experience",
    category: "Mobile Development",
    client: "TomTom",
    duration: "18 Months",
    description:
      "A comprehensive digital cockpit solution designed to unify navigation, infotainment, and vehicle diagnostics into a seamless, high-performance interface for the next generation of connected vehicles.",
    heroImage: "/assets/projects/tomtom-digital-cockpit.jpg",
    overview:
      "In partnership with TomTom, Spire Digital engineered a groundbreaking Android-based automotive platform. The goal was to replace fragmented in-car systems with a cohesive digital experience that prioritizes safety while delivering rich, interactive content to drivers and passengers.",
    challenge:
      "The automotive industry faced a significant challenge: providing a modern, smartphone-like experience within the vehicle without compromising driver focus or system stability across diverse hardware configurations.",
    solution:
      "We developed a decoupled UI architecture using Android Automotive OS, leveraging custom OpenGL shaders for fluid map rendering and a robust micro-services backend to handle real-time vehicle telemetry and OTA updates.",
    galleryImages: [
      "/assets/projects/tomtom-digital-cockpit-gallery-1.jpg",
      "/assets/projects/tomtom-digital-cockpit-gallery-2.jpg",
    ],
    features: [
      "Context-Aware Navigation Engine",
      "Dynamic Voice Assistant Integration",
      "Multi-Zone Audio & Video Sync",
      "Predictive Maintenance Notifications",
      "Cloud-Based User Profiles",
      "Offline-First Capability",
      "Unified Vehicle Control Center",
      "Third-Party Ecosystem Support",
    ],
    metrics: [
      {
        label: "Driver Distraction",
        value: "-42%",
      },
      {
        label: "Active Users",
        value: "5.2M",
      },
      {
        label: "Rendering Speed",
        value: "60 FPS",
      },
      {
        label: "System Latency",
        value: "<100ms",
      },
    ],
    results: [
      {
        stat: "40%",
        title: "Efficiency Gains",
        description:
          "Optimized map rendering algorithms reduced CPU utilization by nearly half on standard automotive chipsets.",
      },
      {
        stat: "98%",
        title: "User Satisfaction",
        description:
          "Post-launch surveys indicated a massive preference for the new unified interface over traditional modular systems.",
      },
      {
        stat: "24/7",
        title: "Connectivity",
        description:
          "Achieved seamless transitions between 5G, LTE, and offline modes for uninterrupted navigation.",
      },
    ],
    techStack: [
      "Android Automotive OS",
      "Kotlin",
      "C++",
      "OpenGL ES",
      "MQTT",
      "Google Cloud Platform",
      "Figma",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Research & Strategy",
        description:
          "User behavior analysis and competitive benchmarking of in-car infotainment ecosystems.",
      },
      {
        label: "Phase 2",
        title: "Prototype Development",
        description:
          "Building a high-fidelity proof of concept for the core navigation and dashboard modules.",
      },
      {
        label: "Phase 3",
        title: "Engineering Scale",
        description:
          "Full-scale implementation of the digital cockpit architecture and hardware integration.",
      },
      {
        label: "Phase 4",
        title: "QA & Deployment",
        description:
          "Rigorous field testing across multiple vehicle platforms followed by global regional rollout.",
      },
    ],
    faqs: [
      {
        question: "How does the system handle software updates?",
        answer:
          "We implemented a robust Over-The-Air (OTA) update mechanism that ensures security and stability during the update process without vehicle downtime.",
      },
      {
        question: "Is the platform compatible with other car manufacturers?",
        answer:
          "Yes, the architecture was designed to be hardware-agnostic, allowing for customization across different OEMs.",
      },
      {
        question: "What safety protocols were prioritized?",
        answer:
          "We followed industry-standard ASIL guidelines to ensure that critical vehicle notifications always take priority over entertainment features.",
      },
      {
        question: "Does it support voice commands?",
        answer:
          "The platform features deep integration with major voice assistants, optimized for high-noise automotive environments.",
      },
      {
        question: "How is user data protected?",
        answer:
          "All personal data is encrypted both in transit and at rest, complying with stringent global automotive privacy standards.",
      },
    ],
  },
  "millercoors-b2b-portal": {
    slug: "millercoors-b2b-portal",
    title: "MillerB2B Distributor Portal",
    subtitle: "Streamlining Supply Chain Operations",
    category: "Web Development",
    client: "MillerCoors",
    duration: "12 Months",
    description:
      "A high-scale B2B eCommerce and distributor management portal designed to modernize order fulfillment, inventory tracking, and sales analytics for one of the world's largest brewers.",
    heroImage: "/assets/projects/millercoors-b2b-portal.jpg",
    overview:
      "MillerCoors needed to replace an aging legacy system with a modern, high-performance platform that could handle billions in transactions while providing an intuitive experience for thousands of distributors nationwide.",
    challenge:
      "Distributors struggled with manual entry, slow synchronization with SAP backends, and a lack of real-time visibility into stock levels and promotional pricing.",
    solution:
      "Spire Digital built a custom React-based application layer over a Node.js microservices architecture, integrated deeply with SAP and Salesforce to provide a 'single pane of glass' for distributor operations.",
    galleryImages: [
      "/assets/projects/millercoors-b2b-portal-gallery-1.jpg",
      "/assets/projects/millercoors-b2b-portal-gallery-2.jpg",
    ],
    features: [
      "Real-Time Inventory Management",
      "Dynamic Promotional Pricing Engine",
      "Automated Order Re-entry",
      "Distributor Sales Analytics",
      "Mobile-Responsive Ordering",
      "SAP Integration Layer",
      "Tiered User Access Controls",
      "Regional Compliance Tracking",
    ],
    metrics: [
      {
        label: "Boost in Efficiency",
        value: "35%",
      },
      {
        label: "System Availability",
        value: "99.95%",
      },
    ],
    results: [
      {
        stat: "60%",
        title: "Faster Insight",
        description:
          "Engineers can now analyze flight data in minutes rather than days, drastically accelerating development cycles.",
      },
      {
        stat: "100%",
        title: "Compliance",
        description:
          "The platform met all federal cybersecurity and data sovereignty requirements for aerospace defense projects.",
      },
      {
        stat: "Preventative",
        title: "Fail-Safe",
        description:
          "The AI detection engine successfully predicted multiple hardware issues, preventing costly manufacturing delays.",
      },
    ],
    techStack: [
      "React",
      "Node.js",
      "AWS",
      "PostgreSQL",
      "SAP ERP",
      "Salesforce API",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Comprehensive audit of the legacy distributor portal and stakeholder interviews.",
      },
      {
        label: "Phase 2",
        title: "Architecture Design",
        description:
          "Designing the microservices bridge between the modern frontend and legacy SAP backend.",
      },
      {
        label: "Phase 3",
        title: "Iterative Build",
        description:
          "Agile development sprints focusing on core ordering and inventory modules.",
      },
      {
        label: "Phase 4",
        title: "Nationwide Rollout",
        description:
          "Gradual deployment across major regions with 24/7 technical support for distributors.",
      },
    ],
    faqs: [
      {
        question: "Can it handle heavy traffic during peak seasons?",
        answer:
          "Yes, the AWS-based architecture scales automatically to handle surges in order volume during holidays and major sporting events.",
      },
      {
        question: "How does it integrate with existing ERP systems?",
        answer:
          "We developed a custom API gateway that provides secure, real-time communication with SAP and other internal systems.",
      },
      {
        question: "Is there a mobile version for on-the-go managers?",
        answer:
          "The platform is fully responsive and offers a PWA (Progressive Web App) for seamless mobile usage.",
      },
      {
        question: "How are promotional discounts handled?",
        answer:
          "A dynamic pricing engine recalculates costs based on region, volume, and current marketing campaigns in real-time.",
      },
      {
        question: "What security measures are in place?",
        answer:
          "The portal uses enterprise-grade SSO and encrypted data channels to protect sensitive commercial information.",
      },
    ],
  },
  "dish-network-self-service": {
    slug: "dish-network-self-service",
    title: "MyDISH Digital Transformation",
    subtitle: "Empowering Customers Through Self-Service",
    category: "AI & Automation",
    client: "Dish Network",
    duration: "24 Months",
    description:
      "A large-scale digital overhaul of Dish Network's customer engagement platform, focusing on self-service automation, predictive troubleshooting, and bill management.",
    heroImage: "/assets/projects/dish-network-self-service.jpg",
    overview:
      "Dish Network aimed to reduce operational costs and improve customer satisfaction by moving millions of billing and support interactions from call centers to a modern digital platform.",
    challenge:
      "Existing customers found the legacy portal difficult to navigate, leading to high call volumes for simple tasks like bill payment or basic equipment troubleshooting.",
    solution:
      "We implemented an Angular-driven web application and a native mobile suite, integrated with AI-powered chatbots and predictive diagnostics for home equipment.",
    galleryImages: [
      "/assets/projects/dish-network-self-service-gallery-1.jpg",
      "/assets/projects/dish-network-self-service-gallery-2.jpg",
    ],
    features: [
      "Predictive Troubleshooting",
      "Automated Bill Management",
      "AI Chatbot Integration",
      "Technician Tracking",
      "Personalized Content Hub",
      "Multi-Channel Support",
      "Biometric Authentication",
      "Interactive Help Center",
    ],
    metrics: [
      {
        label: "Call Reduction",
        value: "48%",
      },
      {
        label: "App Rating",
        value: "4.8",
      },
      {
        label: "Monthly Active",
        value: "12M",
      },
      {
        label: "Self-Service Use",
        value: "75%",
      },
    ],
    results: [
      {
        stat: "50%",
        title: "Call Deflection",
        description:
          "Achieved a monumental shift in user behavior, with nearly half of support requests resolved entirely through digital channels.",
      },
      {
        stat: "2x",
        title: "Retention Rate",
        description:
          "Customers who engaged with the digital hub showed significantly higher long-term retention compared to those using traditional channels.",
      },
      {
        stat: "Global",
        title: "Accessibility",
        description:
          "Deployed localized versions across multiple languages to support a diverse national subscriber base.",
      },
    ],
    techStack: [
      "Angular",
      "Java Spring Boot",
      "Google Cloud Platform",
      "Dialogflow AI",
      "Oracle DB",
      "Nginx",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Customer Journey Mapping",
        description:
          "Identifying pain points in the existing support and billing workflows.",
      },
      {
        label: "Phase 2",
        title: "Framework Selection",
        description:
          "Evaluating technologies to handle massive concurrent user loads and complex integrations.",
      },
      {
        label: "Phase 3",
        title: "Feature Development",
        description:
          "Building the automated billing, technician tracking, and AI chat modules.",
      },
      {
        label: "Phase 4",
        title: "Optimization",
        description:
          "A/B testing user flows and refining the AI logic based on real interaction logs.",
      },
    ],
    faqs: [
      {
        question: "How does technician tracking work?",
        answer:
          "Customers receive real-time GPS updates and ETA notifications when a field technician is en route to their home.",
      },
      {
        question: "Is the AI chatbot able to process payments?",
        answer:
          "Yes, the integrated AI can securely handle billing inquiries and complete payments via PCI-compliant channels.",
      },
      {
        question: "What happens if digital troubleshooting fails?",
        answer:
          "The system automatically schedules a technician visit or connects the user to a live specialist with all context preserved.",
      },
      {
        question: "How secure is the customer data?",
        answer:
          "We implemented multi-factor authentication and rigorous encryption protocols to ensure all subscriber data is protected.",
      },
      {
        question: "Does it work for both satellite and streaming customers?",
        answer:
          "Yes, the platform provides a unified view for all Dish products, including Sling TV and satellite services.",
      },
    ],
  },
  "lockheed-martin-propel": {
    slug: "lockheed-martin-propel",
    title: "Propel Enterprise Analytics",
    subtitle: "Advanced Intelligence for Aerospace",
    category: "AI & Data",
    client: "Lockheed Martin",
    duration: "14 Months",
    description:
      "An advanced internal data dashboard and predictive analytics platform designed to monitor aerospace systems and optimize manufacturing lifecycles.",
    heroImage: "/assets/projects/lockheed-martin-propel.jpg",
    overview:
      "Lockheed Martin required a secure, high-performance platform to visualize complex telemetry data from aerospace assets and predict maintenance needs before failures occurred.",
    challenge:
      "Data was siloed across multiple departments, making it impossible to get a holistic view of asset health or manufacturing efficiency in real-time.",
    solution:
      "Spire Digital developed 'Propel', a React-based data lake visualization tool that uses machine learning to identify anomalies in massive datasets.",
    galleryImages: [
      "/assets/projects/lockheed-martin-propel-gallery-1.jpg",
      "/assets/projects/lockheed-martin-propel-gallery-2.jpg",
    ],
    features: [
      "Real-Time Telemetry Feed",
      "Anomaly Detection Engine",
      "Manufacturing Lifecycle Tracking",
      "Secure GovCloud Hosting",
      "Custom Data Visualization",
      "Silo-Busting Integration",
      "Exportable Compliance Reporting",
      "Advanced User Permissions",
    ],
    metrics: [
      {
        label: "Data Processing",
        value: "+65%",
      },
      {
        label: "Accuracy",
        value: "99.95%",
      },
      {
        label: "ROI (Year 1)",
        value: "$12.5M",
      },
      {
        label: "Security Level",
        value: "FEDRAMP",
      },
    ],
    results: [
      {
        stat: "60%",
        title: "Faster Insight",
        description:
          "Engineers can now analyze flight data in minutes rather than days, drastically accelerating development cycles.",
      },
      {
        stat: "100%",
        title: "Compliance",
        description:
          "The platform met all federal cybersecurity and data sovereignty requirements for aerospace defense projects.",
      },
      {
        stat: "Preventative",
        title: "Fail-Safe",
        description:
          "The AI detection engine successfully predicted multiple hardware issues, preventing costly manufacturing delays.",
      },
    ],
    techStack: [
      "React",
      "Python",
      "PyTorch",
      "Kubernetes",
      "D3.js",
      "Snowflake",
      "AWS GovCloud",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Defense Scoping",
        description:
          "Defining data security requirements and aerospace specific KPIs.",
      },
      {
        label: "Phase 2",
        title: "Data Integration",
        description:
          "Connecting disparate data sources into a unified, secure data lake.",
      },
      {
        label: "Phase 3",
        title: "ML Model Training",
        description:
          "Developing and validating anomaly detection models for aerospace telemetry.",
      },
      {
        label: "Phase 4",
        title: "Dashboard Launch",
        description:
          "Deploying the visualization suite for engineering and management teams.",
      },
    ],
    faqs: [
      {
        question: "How is data security handled for sensitive projects?",
        answer:
          "The platform is hosted on AWS GovCloud and uses hardware-backed encryption keys to ensure maximum security.",
      },
      {
        question: "Can it ingest data from external aerospace sensors?",
        answer:
          "Yes, Propel supports a wide range of telemetry protocols and can ingest high-frequency sensor data in real-time.",
      },
      {
        question: "What kind of machine learning is used?",
        answer:
          "We use a combination of unsupervised learning for anomaly detection and regression models for life-expectancy predictions.",
      },
      {
        question: "Is the platform mobile-responsive?",
        answer:
          "For security reasons, access is restricted to authorized workstations within secure networks.",
      },
      {
        question: "How many assets can it monitor simultaneously?",
        answer:
          "The system is designed to scale horizontally to monitor thousands of aerospace assets across global regions.",
      },
    ],
  },
  "i-invest": {
    slug: "i-invest",
    title: "i-invest: Social Investment Platform",
    subtitle:
      "Democratizing retail investment in Africa through mobile technology.",
    category: "Mobile Development",
    client: "Sterling Capital",
    duration: "8 Months",
    description:
      "A secure, social investment application that enables retail investors to trade Treasury Bills and other fixed-income instruments directly from their mobile devices.",
    heroImage: "/assets/projects/i-invest.jpg",
    overview:
      "Enyata partnered with Sterling Capital to build i-invest, Nigeria's first social investment mobile app. The goal was to remove the traditional barriers to entry for fixed-income investments and provide a transparent, user-friendly portal for wealth creation.",
    challenge:
      "Traditional investment processes required extensive paperwork and physical presence. The challenge was to create a digital-first onboarding experience (e-KYC) and integrate it with various financial clearing systems while maintaining military-grade security for user funds.",
    solution:
      "We developed a robust mobile application using Flutter for cross-platform efficiency, backed by a scalable Node.js microservices architecture. The solution featured a real-time portfolio tracker, automated investment maturity notifications, and a social feed for market insights.",
    galleryImages: [
      "/assets/projects/i-invest-gallery-1.jpg",
      "/assets/projects/i-invest-gallery-2.jpg",
    ],
    features: [
      "Automated e-KYC Onboarding",
      "Real-time Portfolio Dashboard",
      "Automated Investment Rollover",
      "Multi-asset Support (T-Bills, Bonds)",
      "Social Market Insights Feed",
      "Secure Biometric Authentication",
      "Instant Customer Support Portal",
      "Educational Resource Library",
    ],
    metrics: [
      {
        label: "Active Users",
        value: "1M+",
      },
      {
        label: "Total Transactions",
        value: "20M",
      },
    ],
    results: [
      {
        stat: "60%",
        title: "Faster Insight",
        description:
          "Engineers can now analyze flight data in minutes rather than days, drastically accelerating development cycles.",
      },
      {
        stat: "100%",
        title: "Compliance",
        description:
          "The platform met all federal cybersecurity and data sovereignty requirements for aerospace defense projects.",
      },
      {
        stat: "Preventative",
        title: "Fail-Safe",
        description:
          "The AI detection engine successfully predicted multiple hardware issues, preventing costly manufacturing delays.",
      },
    ],
    techStack: [
      "Scala",
      "Apache Spark",
      "Python",
      "TensorFlow",
      "PostgreSQL",
      "Kubernetes",
      "Grafana",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "IoT Data Ingestion",
        description:
          "Building the pipeline to receive and clean data from remote solar units.",
      },
      {
        label: "Phase 2",
        title: "ML Model Training",
        description:
          "Developing the predictive engine using historical payment data.",
      },
      {
        label: "Phase 3",
        title: "Operational Dashboard",
        description:
          "Creating visualization tools for regional managers and credit teams.",
      },
      {
        label: "Phase 4",
        title: "System Integration",
        description:
          "Linking the intelligence layer with core financial and ERP systems.",
      },
    ],
    faqs: [
      {
        question: "How does the locking work?",
        answer:
          "The system sends an encrypted command via GSM to the IoT module in the unit.",
      },
      {
        question: "Is the data real-time?",
        answer: "Yes, metrics are updated every 15 minutes across the network.",
      },
      {
        question: "Can it predict fraud?",
        answer:
          "The AI recognizes patterns of signal tampering and alerts local agents.",
      },
      {
        question: "Does it work offline?",
        answer:
          "Units have local logic to handle short-term connectivity drops.",
      },
      {
        question: "What hardware is supported?",
        answer:
          "The platform is agnostic and supports various Zigbee and NB-IoT protocols.",
      },
    ],
  },
  "deluxe-care-hms": {
    slug: "deluxe-care-hms",
    title: "Deluxe Care HMS",
    subtitle: "Next-Generation Hospital Management & Patient Intelligence",
    category: "Healthcare Technology",
    client: "Premier Health Group",
    duration: "8 Months",
    description:
      "A comprehensive digital transformation of clinical workflows for a multi-specialty hospital group, integrating electronic health records (EHR) with real-time billing and laboratory automation.",
    heroImage: "/assets/projects/deluxe-care-hms.jpg",
    overview:
      "Deluxe Care HMS was designed to eliminate the inefficiencies of paper-based systems in high-volume medical centers. The platform centralizes patient data, streamlines administrative tasks, and ensures seamless communication between departments, from the front desk to the surgical theater.",
    challenge:
      "The client faced fragmented data silos, frequent billing discrepancies, and long patient wait times. Physical records were prone to loss, and reporting on hospital performance took weeks of manual data aggregation.",
    solution:
      "We implemented a cloud-native, modular HMS that provides a 360-degree view of patient history. Features include an automated triaging system, integrated pharmacy inventory, and a secure physician portal for remote chart reviews and tele-consultations.",
    galleryImages: [
      "/assets/projects/deluxe-care-hms-gallery-1.jpg",
      "/assets/projects/deluxe-care-hms-gallery-2.jpg",
    ],
    features: [
      "Integrated Electronic Health Records (EHR)",
      "Real-time Automated Billing and Invoicing",
      "Multi-Department Laboratory Management",
      "Pharmacy Inventory Tracking & Reorder Alerts",
      "Smart Multi-Doctor Appointment Scheduling",
      "Digital Prescription & E-Pharmacy Integration",
      "Biometric Patient Authentication & Security",
      "Comprehensive Financial and Operational Analytics",
    ],
    metrics: [
      {
        label: "Reduction in Wait Time",
        value: "35%",
      },
      {
        label: "Billing Accuracy",
        value: "99.9%",
      },
      {
        label: "Patient Throughput",
        value: "+30%",
      },
      {
        label: "Operational Savings",
        value: "25%",
      },
    ],
    results: [
      {
        stat: "45%",
        title: "Reduced Wait Times",
        description:
          "Optimized patient flow through digital triaging and automated check-ins.",
      },
      {
        stat: "Zero",
        title: "Data Loss",
        description:
          "Complete migration from physical files to encrypted cloud storage with daily backups.",
      },
      {
        stat: "2x",
        title: "Revenue Collection",
        description:
          "Minimized leakages through automated billing and transparent financial reporting.",
      },
    ],
    techStack: [
      "React.js",
      "Node.js",
      "PostgreSQL",
      "Redux",
      "Express",
      "AWS Cloud",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Audit & Analysis",
        description:
          "Deep dive into existing hospital workflows and requirement gathering.",
      },
      {
        label: "Phase 2",
        title: "Core Development",
        description:
          "Building the EHR engine and security architecture for HIPAA compliance.",
      },
      {
        label: "Phase 3",
        title: "Departmental Modules",
        description:
          "Deployment of Lab, Pharmacy, and Billing modules with internal testing.",
      },
      {
        label: "Phase 4",
        title: "UAT & Deployment",
        description:
          "Staff training, data migration, and full-scale production rollout.",
      },
    ],
    faqs: [
      {
        question: "Is the system compliant with healthcare data regulations?",
        answer:
          "Yes, Deluxe Care HMS adheres to international security standards and local health data privacy laws.",
      },
      {
        question: "Can it handle multiple hospital locations?",
        answer:
          "Absolutely, it features a centralized database that allows multi-facility management from a single admin panel.",
      },
      {
        question: "Does it support offline mode?",
        answer:
          "The mobile application supports limited offline data entry with automatic synchronization once reconnected.",
      },
      {
        question: "Can patient lab results be sent via email?",
        answer:
          "Yes, the system automates the distribution of verified results to patient portals and registered email addresses.",
      },
      {
        question: "Is there built-in support for health insurance?",
        answer:
          "The platform includes a dedicated HMO module for credentialing, claims processing, and reimbursement tracking.",
      },
    ],
  },
  odexa: {
    slug: "odexa",
    title: "Odexa",
    subtitle: "AI-Powered Talent Acquisition & Human Capital Management",
    category: "AI & Automation",
    client: "Odexa Enterprise Solutions",
    duration: "12 Months",
    description:
      "A high-performance AI platform built to automate the recruitment lifecycle, featuring intelligent resume parsing, candidate scoring, and automated workflow orchestration for global HR teams.",
    heroImage: "/assets/technology-01.webp",
    overview:
      "Odexa redefines how enterprises find and manage talent. By leveraging machine learning models, the platform identifies the best-fit candidates in seconds, reducing time-to-hire and eliminating unconscious bias in the recruitment process.",
    challenge:
      "The client needed to solve the problem of manual resume screening for thousands of applications, which led to missed talent and significant operational delays in scaling their workforce.",
    solution:
      "We engineered a proprietary AI engine that parses complex CV structures and ranks candidates based on skill proximity metrics. The system includes an automated interview scheduler and deep integration with popular productivity tools.",
    galleryImages: ["/assets/technology-02.jpg", "/assets/technology.png"],
    features: [
      "AI-Driven Resume Parsing & Extraction",
      "Matching Engine for Skill Gap Analysis",
      "Automated Interview Scheduling & Calendering",
      "Video Interview Integration & Evaluation",
      "Comprehensive Candidate Pipeline Visualization",
      "Employee Onboarding Automation Workflow",
      "Real-time Diversity & Inclusion Analytics",
      "Payroll & Leave Management Integration",
    ],
    metrics: [
      {
        label: "Resumes Processed",
        value: "100k+",
      },
      {
        label: "Time-to-Hire Improvement",
        value: "50%",
      },
      {
        label: "Cost Per Hire Reduction",
        value: "30%",
      },
      {
        label: "AI Matching Accuracy",
        value: "94%",
      },
    ],
    results: [
      {
        stat: "60%",
        title: "Faster Hiring Cycles",
        description:
          "Automated screening reduced initial shortlisting time from days to minutes.",
      },
      {
        stat: "94%",
        title: "Placement Success",
        description:
          "AI-scored candidates showed significantly higher retention rates in technical roles.",
      },
      {
        stat: "40%",
        title: "Operational Efficiency",
        description:
          "Recruiters handled three times the volume of applications without increasing head count.",
      },
    ],
    techStack: [
      "Python",
      "TensorFlow",
      "FastAPI",
      "React Native",
      "Redis",
      "Firebase",
      "Elasticsearch",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "AI Modeling",
        description:
          "Training the NLP models on vast datasets of technical and clerical resumes.",
      },
      {
        label: "Phase 2",
        title: "Backend Core",
        description:
          "Developing the high-concurrency API and asynchronous task runners.",
      },
      {
        label: "Phase 3",
        title: "UI/UX Orchestration",
        description:
          "Designing the recruiter dashboard and candidate-facing internship portals.",
      },
      {
        label: "Phase 4",
        title: "Scaling & DevOps",
        description:
          "Implementing auto-scaling clusters to handle peak recruitment seasons.",
      },
    ],
    faqs: [
      {
        question: "How does the AI handle non-standard resume formats?",
        answer:
          "The engine uses computer vision and NLP to understand layout hierarchies regardless of file type.",
      },
      {
        question: "Can it integrate with our existing ERP?",
        answer:
          "Yes, Odexa provides a robust set of RESTful APIs for seamless third-party enterprise integration.",
      },
      {
        question: "Does it support multiple languages?",
        answer:
          "The current version supports English, French, and Yoruba, with more languages in development.",
      },
      {
        question: "Is the candidate data encrypted?",
        answer:
          "All personal data is encrypted at rest and in transit using AES-256 standard protocols.",
      },
      {
        question: "Can we customize the scoring algorithm?",
        answer:
          "HR managers can adjust weightage for specific skills, experience levels, and certifications.",
      },
    ],
  },
  "skyline-hms": {
    slug: "skyline-hms",
    title: "Skyline HMS",
    subtitle: "Full-Stack Hospitality Management & Guest Experience Platform",
    category: "Mobile Development",
    client: "Skyline Luxury Hotels",
    duration: "5 Months",
    description:
      "A premium suite of tools for the hospitality industry, combining a high-conversion booking engine, front-desk management, and mobile guest services into a unified ecosystem.",
    heroImage: "/assets/projects/skyline-hms.jpg",
    overview:
      "Skyline HMS was developed to provide a seamless digital journey for hotel guests while empowering staff with intuitive management tools. The system handles everything from online reservations to housekeeping status and restaurant POS.",
    challenge:
      "The client struggled with overbookings due to manual channel updates and suffered from poor guest engagement due to slow check-in processes at peak hours.",
    solution:
      "We built a real-time synchronized booking engine that connects to global distributors and a guest-facing mobile app that allows for digital check-ins and room service requests.",
    galleryImages: [
      "/assets/projects/skyline-hms-gallery-1.jpg",
      "/assets/projects/skyline-hms-gallery-2.jpg",
    ],
    features: [
      "Centralized Booking Engine & Channel Manager",
      "Interactive Front-Desk Room Matrix",
      "Guest Mobile App with Digital Keys",
      "In-house Restaurant & Bar POS Integration",
      "Automated Housekeeping Scheduling",
      "Multi-Currency Payment Gateway",
      "Dynamic Pricing and Yield Management",
      "Customer Loyalty & Rewards Program",
    ],
    metrics: [
      {
        label: "Occupancy Rate Increase",
        value: "22%",
      },
      {
        label: "Direct Booking Growth",
        value: "35%",
      },
      {
        label: "Average Check-in Time",
        value: "2 Mins",
      },
      {
        label: "System Uptime",
        value: "99.95%",
      },
    ],
    results: [
      {
        stat: "35%",
        title: "Higher Direct Bookings",
        description:
          "Reduction in commissions paid to third-party travel agencies through the new web engine.",
      },
      {
        stat: "22%",
        title: "Optimized Occupancy",
        description:
          "Dynamic pricing algorithms ensured maximum room uptake during off-peak periods.",
      },
      {
        stat: "15%",
        title: "Reduced Labor Costs",
        description:
          "Automated housekeeping and check-in workflows reduced the need for manual oversight.",
      },
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "Go",
      "Tailwind CSS",
      "Azure Cloud",
      "Socket.io",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Solution Design",
        description:
          "Architecture planning for real-time room availability and channel sync.",
      },
      {
        label: "Phase 2",
        title: "Engine Development",
        description:
          "Building the high-performance reservation engine and payment logic.",
      },
      {
        label: "Phase 3",
        title: "Mobile App Build",
        description:
          "Development of the guest-facing React Native application for iOS and Android.",
      },
      {
        label: "Phase 4",
        title: "On-site Training",
        description:
          "Deployment of POS hardware and training for hotel administrative staff.",
      },
    ],
    faqs: [
      {
        question: "Does it sync with Booking.com and Expedia?",
        answer:
          "Yes, the integrated channel manager ensures real-time inventory updates across all major OTAs.",
      },
      {
        question: "Can guests order food via the mobile app?",
        answer:
          "Absolutely, there is a built-in room service module linked directly to the kitchen's tablet display.",
      },
      {
        question: "Is the software compatible with existing card lock systems?",
        answer:
          "Skyline HMS supports integrations with most major RFID and Bluetooth electronic lock providers.",
      },
      {
        question: "Can we generate monthly financial reports?",
        answer:
          "The analytics module provides detailed P&L statements, tax summaries, and revenue-per-room reports.",
      },
      {
        question: "Is there a limit to the number of rooms?",
        answer:
          "No, the system is architected to scale from boutique hotels to large resort chains with 500+ rooms.",
      },
    ],
  },
  "enterprise-cloud-transformation": {
    slug: "enterprise-cloud-transformation",
    title: "Cloud Infrastructure Modernization",
    subtitle: "Enterprise-Grade Scalability & DevOps Excellence",
    category: "Cloud & DevOps",
    client: "Zigma Logistics & Distribution",
    duration: "7 Months",
    description:
      "A complete infrastructure overhaul for a logistics giant, migrating legacy on-premise servers to a high-availability microservices architecture on Google Cloud Platform.",
    heroImage: "/assets/projects/enterprise-cloud-transformation.jpg",
    overview:
      "This project involved the containerization of critical supply chain applications and the implementation of automated CI/CD pipelines to ensure rapid, error-free software delivery cycles for an enterprise logistics network.",
    challenge:
      "The client was experiencing frequent downtime during high-traffic periods, slow deployment cycles taking weeks, and spiraling maintenance costs for aging physical servers.",
    solution:
      "We implemented a Kubernetes-managed architecture with auto-scaling capabilities. Using Terraform, we automated the entire infrastructure, enabling zero-downtime deployments and blue-green staging environments.",
    galleryImages: [
      "/assets/projects/enterprise-cloud-transformation-gallery-1.jpg",
      "/assets/projects/enterprise-cloud-transformation-gallery-2.jpg",
    ],
    features: [
      "Kubernetes (GKE) Cluster Implementation",
      "Infrastructure as Code (IaC) via Terraform",
      "Multi-Region High Availability Setup",
      "Automated CI/CD Pipeline Engineering",
      "Real-time Monitoring & Alerting (Prometheus)",
      "Serverless Cloud Function API Gateways",
      "Advanced Network Security & WAF Rules",
      "Zero-Downtime Deployment Strategy",
    ],
    metrics: [
      {
        label: "Deployment Speed",
        value: "75% Faster",
      },
      {
        label: "System Availability",
        value: "99.95%",
      },
      {
        label: "Infrastructure Costs",
        value: "30% Lower",
      },
      {
        label: "Incident Recovery Time",
        value: "< 5 Mins",
      },
    ],
    results: [
      {
        stat: "85%",
        title: "Faster Release Cycles",
        description:
          "Code to production time reduced from 2 weeks to under 30 minutes.",
      },
      {
        stat: "30%",
        title: "Cost Optimization",
        description:
          "Elastic scaling eliminated the cost of idle resources during low-traffic hours.",
      },
      {
        stat: "Zero",
        title: "Major Outages",
        description:
          "Maintained 100% availability during peak logistics seasons after migration.",
      },
    ],
    techStack: [
      "Kubernetes",
      "Docker",
      "Terraform",
      "GCP",
      "Jenkins",
      "Prometheus",
      "Grafana",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Cloud Assessment",
        description:
          "Evaluating legacy code compatibility and planning the migration roadmap.",
      },
      {
        label: "Phase 2",
        title: "Infrastructure Build",
        description:
          "Setting up VPCs, Kubernetes clusters, and security perimeters using Terraform.",
      },
      {
        label: "Phase 3",
        title: "Application Migration",
        description:
          "Containerizing services and migrating production data with zero-loss protocols.",
      },
      {
        label: "Phase 4",
        title: "Automation & Handover",
        description:
          "Configuring CI/CD pipelines and training internal engineering teams on DevOps.",
      },
    ],
    faqs: [
      {
        question: "How did you ensure zero downtime during migration?",
        answer:
          "We used a side-by-side deployment strategy with traffic gradually shifted via a global load balancer.",
      },
      {
        question: "What cloud provider was used for this project?",
        answer:
          "The solution was built on Google Cloud Platform, utilizing GKE for orchestration.",
      },
      {
        question: "Is the infrastructure capable of auto-scaling?",
        answer:
          "Yes, the system automatically adds or removes compute resources based on real-time traffic demand.",
      },
      {
        question: "How is the security of the cloud environment managed?",
        answer:
          "We implemented Identity-Aware Proxy (IAP) and strict IAM policies combined with continuous vulnerability scanning.",
      },
      {
        question: "Can this setup support future microservices?",
        answer:
          "The architecture is fully modular, allowing new services to be deployed independently in minutes.",
      },
    ],
  },
  "steelcase-b2b-portal": {
    slug: "steelcase-b2b-portal",
    title: "Steelcase Global B2B Portal",
    subtitle: "Streamlining Enterprise Furniture Procurement",
    category: "Web Development",
    client: "Steelcase",
    duration: "8 Months",
    description:
      "A high-performance B2B eCommerce portal designed to handle complex dealer relationships, custom pricing tiers, and global inventory synchronization for a Fortune 500 furniture leader.",
    heroImage: "/assets/projects/steelcase-b2b-portal.jpg",
    overview:
      "Steelcase required a centralized digital ecosystem to manage thousands of global dealers. The legacy system struggled with real-time inventory and complex discount structures, leading to manual errors and procurement delays. We built a robust, scalable portal that integrated seamlessly with their existing ERP and logistics systems.",
    challenge:
      "The primary challenge was the fragmentation of data across different regions and the need for a highly customized ordering interface that could handle millions of SKU variations while maintaining sub-second response times for global users.",
    solution:
      "Leveraging a headless architecture with BigCommerce and a custom React frontend, we developed a dynamic pricing engine and a dealer-specific dashboard. This allowed dealers to configure products, see real-time availability, and track orders without manual intervention.",
    galleryImages: [
      "/assets/projects/steelcase-b2b-portal-gallery-1.jpg",
      "/assets/projects/steelcase-b2b-portal-gallery-2.jpg",
    ],
    features: [
      "Headless BigCommerce Integration",
      "Dynamic Multi-tier Pricing Engine",
      "Real-time SAP ERP Synchronization",
      "Custom Product Configuration Tool",
      "Advanced Dealer Analytics Dashboard",
      "Multi-currency & Multi-language Support",
      "Automated Invoice Generation",
      "Role-based Access Control (RBAC)",
    ],
    metrics: [
      {
        label: "System Uptime",
        value: "99.95%",
      },
      {
        label: "Manual Entry Reduction",
        value: "35%",
      },
      {
        label: "Dealer Adoption Rate",
        value: "92%",
      },
      {
        label: "Order Processing Speed",
        value: "3.5x",
      },
    ],
    results: [
      {
        stat: "300%",
        title: "Order Efficiency",
        description:
          "Automated workflows removed the bottleneck in dealer order validations and entry.",
      },
      {
        stat: "25%",
        title: "Revenue Growth",
        description:
          "Enhanced user experience and easy reordering led to a significant spike in B2B sales.",
      },
      {
        stat: "0%",
        title: "Pricing Discrepancies",
        description:
          "Total elimination of pricing errors through synchronized real-time data feeds.",
      },
    ],
    techStack: [
      "BigCommerce",
      "React.js",
      "Node.js",
      "WordPress",
      "SAP ERP",
      "Amazon Web Services",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Strategy",
        description:
          "Deep dive into dealer workflows and legacy system audit to identify specific pain points.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Defining the headless API structure and crafting a user-centric dealer dashboard UI.",
      },
      {
        label: "Phase 3",
        title: "Agile Development",
        description:
          "Iterative sprints focused on ERP integration, pricing logic, and product configuration.",
      },
      {
        label: "Phase 4",
        title: "UAT & Deployment",
        description:
          "Rigorous stress testing followed by a phased global rollout to selected dealer networks.",
      },
    ],
    faqs: [
      {
        question: "How does the portal handle custom pricing?",
        answer:
          "We built a custom middle-layer API that fetches discount tiers directly from SAP and applies them in real-time based on the dealer's login credentials.",
      },
      {
        question: "Can it handle offline orders?",
        answer:
          "Yes, the system supports draft orders that can be initiated by sales reps and completed by dealers later.",
      },
      {
        question: "Is the inventory data live?",
        answer:
          "Inventory is synced every 60 seconds across all global warehouses to ensure 100% accuracy.",
      },
      {
        question: "Does it support international tax laws?",
        answer:
          "The platform integrates with Vertex for automated tax calculations based on regional and international compliance.",
      },
      {
        question: "How secure is the dealer data?",
        answer:
          "The portal uses enterprise-grade encryption and SSO integration for secure dealer authentication.",
      },
    ],
  },
  "drinkworks-iot-ecommerce": {
    slug: "drinkworks-iot-ecommerce",
    title: "Drinkworks Home Bar Ecosystem",
    subtitle: "Revolutionizing Home Entertaining with IoT",
    category: "AI & Automation",
    client: "Drinkworks",
    duration: "12 Months",
    description:
      "An end-to-end digital transformation for an IoT-enabled home bar system, integrating hardware telemetry with an automated commerce engine for pod replenishment.",
    heroImage: "/assets/projects/drinkworks-iot-ecommerce.jpg",
    overview:
      "Drinkworks, a joint venture between AB InBev and Keurig Dr Pepper, needed a digital backbone to connect their smart drink dispenser with a consumer-facing eCommerce platform. The goal was to create a 'set and forget' ecosystem for drink pod subscriptions.",
    challenge:
      "The complexity lay in syncing physical device data with the digital store. We had to ensure that the machine could report pod usage accurately to trigger replenishment orders without user friction.",
    solution:
      "We implemented an AWS-based IoT hub that communicated with the dispensers and used BigCommerce as the commerce engine. A custom subscription management system was built to handle recurring deliveries based on real-time consumption data.",
    galleryImages: [
      "/assets/projects/drinkworks-iot-ecommerce-gallery-1.jpg",
      "/assets/projects/drinkworks-iot-ecommerce-gallery-2.jpg",
    ],
    features: [
      "AWS IoT Core Integration",
      "Automated Pod Replenishment",
      "Custom Subscription Engine",
      "Real-time Device Diagnostics",
      "Mobile App Synchronization",
      "Predictive Inventory Alerts",
      "Personalized Drink Recommendations",
      "Secure Payment Gateway Integration",
    ],
    metrics: [
      {
        label: "Connected Devices",
        value: "100k+",
      },
      {
        label: "Subscription Yield",
        value: "65%",
      },
      {
        label: "Sync Latency",
        value: "<2s",
      },
      {
        label: "Customer LTV",
        value: "+40%",
      },
    ],
    results: [
      {
        stat: "1M+",
        title: "Pods Distributed",
        description:
          "Successful scaling of automated fulfillment within the first year of launch.",
      },
      {
        stat: "50%",
        title: "Retention Increase",
        description:
          "Automated replenishment significantly reduced subscription churn.",
      },
      {
        stat: "High",
        title: "Customer Satisfaction",
        description:
          "Rated as one of the most seamless IoT consumer experiences in the industry.",
      },
    ],
    techStack: [
      "AWS IoT Core",
      "BigCommerce",
      "React Native",
      "Node.js",
      "DynamoDB",
      "Lambda Functions",
      "GraphQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "IoT Strategy",
        description:
          "Defining communication protocols between the dispenser hardware and the cloud.",
      },
      {
        label: "Phase 2",
        title: "Platform Engineering",
        description:
          "Building the custom subscription engine and integrating it with the commerce backend.",
      },
      {
        label: "Phase 3",
        title: "Mobile Integration",
        description:
          "Developing the cross-platform app for device monitoring and account management.",
      },
      {
        label: "Phase 4",
        title: "Pilot & Launch",
        description:
          "Controlled beta testing with 1,000 users before a full-scale nationwide release.",
      },
    ],
    faqs: [
      {
        question: "How does the machine know when to reorder?",
        answer:
          "The dispenser tracks internal SKU usage and sends an encrypted trigger to the AWS IoT hub once the threshold is met.",
      },
      {
        question: "Can users skip a shipment?",
        answer:
          "Yes, the mobile app allows for full control over the automated replenishment schedules.",
      },
      {
        question: "What happens if the internet goes down?",
        answer:
          "The device buffers local data and syncs with the cloud immediately once the connection is restored.",
      },
      {
        question: "Is the pod data used for analytics?",
        answer:
          "Consumption patterns are used to provide personalized drink flavor recommendations to the user.",
      },
      {
        question: "How secure is the IoT connection?",
        answer:
          "We use Mutual TLS (mTLS) and hardware-based certificates for all device-to-cloud communications.",
      },
    ],
  },
  "unilever-subscription-engine": {
    slug: "unilever-subscription-engine",
    title: "Unilever B2B Subscription Engine",
    subtitle: "Scaling Global Supply Chain Continuity",
    category: "AI & Data",
    client: "Unilever",
    duration: "6 Months",
    description:
      "A centralized B2B subscription platform enabling Unilever's global distributors to manage high-volume recurring orders with predictive inventory forecasting.",
    heroImage: "/assets/projects/unilever-subscription-engine.jpg",
    overview:
      "Unilever required a standardized digital solution to move from manual restocking to an automated subscription-based model for its wholesale distributors. The goal was to stabilize revenue and optimize factory production schedules.",
    challenge:
      "Managing varied subscription logic across different product categories and regions, each with unique compliance and shipping requirements, while ensuring the system could handle peak load during global promotional events.",
    solution:
      "We deployed a custom WooCommerce-based engine with a proprietary B2B subscription plugin. The system uses historical order data to predict future needs and pre-populate distributor baskets.",
    galleryImages: [
      "/assets/projects/unilever-subscription-engine-gallery-1.jpg",
      "/assets/projects/unilever-subscription-engine-gallery-2.jpg",
    ],
    features: [
      "Predictive Order Modeling",
      "Custom B2B Subscription API",
      "Dynamic Batch fulfillment",
      "Distributor Performance Tools",
      "Automated Tax Compliance",
      "Multi-region Catalog Sync",
      "Volume-based Discounting",
      "Integrated Logistics Tracking",
    ],
    metrics: [
      {
        label: "Operational Savings",
        value: "30%",
      },
      {
        label: "Order Accuracy",
        value: "99.8%",
      },
      {
        label: "Countries Reached",
        value: "50+",
      },
      {
        label: "Processing Speed",
        value: "3.5x",
      },
    ],

    results: [
      {
        stat: "20+",
        title: "Global Brands",
        description:
          "Secured top-tier equipment brands as exclusive marketplace launch partners.",
      },
      {
        stat: "40%",
        title: "Reduced Op-ex",
        description:
          "Automated vendor onboarding and payouts decreased administrative overhead.",
      },
      {
        stat: "$2M+",
        title: "Monthly Revenue",
        description:
          "Direct scaling of marketplace volume within six months of the full release.",
      },
    ],
    techStack: [
      "BigCommerce",
      "React.js",
      "Node.js",
      "Stripe Connect",
      "PostgreSQL",
      "Google Cloud Platform",
      "Elasticsearch",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Marketplace Blueprint",
        description:
          "Defining commission structures, vendor rules, and logistics workflows.",
      },
      {
        label: "Phase 2",
        title: "Vendor Portal Build",
        description:
          "Crafting a standalone interface for vendors to manage products, pricing, and orders.",
      },
      {
        label: "Phase 3",
        title: "Integration & Escrow",
        description:
          "Implementing Stripe Connect for secure multi-party payments and freight APIs.",
      },
      {
        label: "Phase 4",
        title: "Vendor Onboarding",
        description:
          "Assisting early-stage vendors with data migration and storefront setup before launch.",
      },
    ],
    faqs: [
      {
        question: "How are payments split?",
        answer:
          "Stripe Connect automatically splits the payment at the time of purchase, routing portions to the vendor and the platform fee to Triumph Labs.",
      },
      {
        question: "How do vendors handle shipping?",
        answer:
          "Vendors have a dashboard to print labels and manage freight carriers, with tracking synced back to the order.",
      },
      {
        question: "Is there a review system?",
        answer:
          "Yes, we implemented a verified-purchase review system to maintain high quality across vendors.",
      },
      {
        question: "Can it handle tax for different states?",
        answer:
          "The platform uses Avalara integration to calculate accurate sales tax based on the vendor's location and shipping destination.",
      },
      {
        question: "How is the data kept secure?",
        answer:
          "All vendor data is isolated using multi-tenant architecture in our PostgreSQL database.",
      },
    ],
  },
  "insurance-digital-transformation": {
    slug: "insurance-digital-transformation",
    title: "Insurance Operations Modernization",
    subtitle: "End-to-End Digital Enablement for Global Insurance Providers",
    category: "AI & Automation",
    client: "Global Insurance Group",
    duration: "8 Months",
    description:
      "A comprehensive digital overhaul of core insurance operations, focusing on claims processing and policy management automation using a cloud-native architecture.",
    heroImage: "/assets/projects/insurance-digital-transformation.jpg",
    overview:
      "The project involved modernizing a legacy insurance ecosystem to improve operational efficiency and customer experience. We replaced manual workflows with intelligent automation to bridge the gap between technology and execution.",
    challenge:
      "The client faced significant bottlenecks in their claims processing department. Manual data entry, physical document handling, and fragmented legacy systems led to a 15-day average claim resolution time and high operational costs.",
    solution:
      "We implemented an AI-driven automation layer and a modernized React-based agent portal. By utilizing AWS Lambda for serverless processing and Python-based NLP for document parsing, we created a seamless end-to-end digital journey.",
    galleryImages: [
      "/assets/projects/insurance-digital-transformation-gallery-1.jpg",
      "/assets/projects/insurance-digital-transformation-gallery-2.jpg",
    ],
    features: [
      "Automated Claims Triage",
      "Real-time Policy Analytics",
      "Digital Document Verification",
      "Legacy System Integration",
      "Customer Self-Service Portal",
      "AI Fraud Detection",
      "Cloud-Native Scalability",
      "Audit Trail Reporting",
    ],
    metrics: [
      {
        label: "Processing Speed",
        value: "70% Faster",
      },
      {
        label: "Operational Cost",
        value: "35% Lower",
      },
      {
        label: "Accuracy",
        value: "99.9%",
      },
      {
        label: "User Satisfaction",
        value: "+45% NPS",
      },
    ],
    results: [
      {
        stat: "70%",
        title: "Claim Efficiency",
        description:
          "Claims that previously took weeks are now processed within hours through automated validation.",
      },
      {
        stat: "35%",
        title: "Cost Reduction",
        description:
          "Eliminating manual oversight for standard claims significantly reduced the cost per claim.",
      },
      {
        stat: "99%",
        title: "Compliance Rate",
        description:
          "Automated audit logs ensure every touchpoint is recorded for regulatory adherence.",
      },
    ],
    techStack: [
      "Python",
      "React.js",
      "AWS Lambda",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Assessment & Audit",
        description:
          "Comprehensive mapping of legacy workflows and identification of automation bottlenecks.",
      },
      {
        label: "Phase 2",
        title: "Architecture Design",
        description:
          "Developing a cloud-native microservices blueprint for scalable policy management.",
      },
      {
        label: "Phase 3",
        title: "AI & Portal Dev",
        description:
          "Building the AI document parsing engine and the React-based management interface.",
      },
      {
        label: "Phase 4",
        title: "Testing & Deployment",
        description:
          "Rigorous UAT cycles followed by a phased production rollout across regional offices.",
      },
    ],
    faqs: [
      {
        question: "How did you handle legacy data migration?",
        answer:
          "We utilized secure ETL pipelines to migrate and sanitize data from on-prem servers to the cloud.",
      },
      {
        question: "Is the system secure for sensitive PII?",
        answer:
          "Yes, it implements SOC2 compliant security protocols and end-to-end encryption for all data.",
      },
      {
        question: "Can it handle peak load seasons?",
        answer:
          "The serverless architecture automatically scales to handle 10x normal traffic during disaster events.",
      },
      {
        question: "What specific AI was used?",
        answer:
          "We employed Natural Language Processing (NLP) models for automated document categorization.",
      },
      {
        question: "How long until the client saw ROI?",
        answer:
          "The project achieved a full return on investment within 14 months of deployment.",
      },
    ],
  },
  "tax-automation-system": {
    slug: "tax-automation-system",
    title: "Enterprise Tax Automation",
    subtitle: "Precision Automation for High-Volume Financial Compliance",
    category: "Cloud & DevOps",
    client: "Large Telecommunications Provider",
    duration: "6 Months",
    description:
      "Replaced fragile RPA with stable API-driven Power Automate flows, cutting processing time by 90% and ensuring 100% filing accuracy.",
    heroImage: "/assets/projects/tax-automation-system.jpg",
    overview:
      "We modernized the tax filing process for a major telco provider by moving away from unreliable UI-based automation to a robust API-driven architecture that ensures stability under heavy seasonal loads.",
    challenge:
      "The existing RPA solution was prone to breakage whenever the government portal UI changed, leading to missed deadlines and manual rework for thousands of filings during peak tax season.",
    solution:
      "We designed a robust automation engine using Microsoft Power Automate and .NET Core. By leveraging direct API integrations and Azure Functions, we created a system that is resilient to UI changes and scales effortlessly.",
    galleryImages: [
      "/assets/projects/tax-automation-system-gallery-1.jpg",
      "/assets/projects/tax-automation-system-gallery-2.jpg",
    ],
    features: [
      "API-Driven Workflows",
      "Real-time Compliance Checks",
      "Automated Report Generation",
      "Multi-Jurisdiction Support",
      "High-Volume Data Parsing",
      "Error Recovery Protocols",
      "Secure Data Vault",
      "Power BI Dashboards",
    ],
    metrics: [
      {
        label: "Processing Time",
        value: "3m vs 33m",
      },
      {
        label: "Failure Rate",
        value: "< 0.1%",
      },
      {
        label: "Data Accuracy",
        value: "99.9%",
      },
      {
        label: "Staff Productivity",
        value: "+50%",
      },
    ],
    results: [
      {
        stat: "90%",
        title: "Time Efficiency",
        description:
          "The processing time for individual tax filings was reduced from 33 minutes to just 3 minutes.",
      },
      {
        stat: "Zero",
        title: "Compliance Errors",
        description:
          "Automated validation loops eliminated manual entry errors, resulting in perfect compliance.",
      },
      {
        stat: "10x",
        title: "Scalability",
        description:
          "The system effectively handles the massive surge in volume during quarterly filing deadlines.",
      },
    ],
    techStack: [
      "Power Automate",
      ".NET Core",
      "Azure Functions",
      "SQL Server",
      "Power BI",
      "Redis",
      "Azure DevOps",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Regulation Mapping",
        description:
          "Deep dive into local tax laws and data requirements for recursive filings.",
      },
      {
        label: "Phase 2",
        title: "API Integration",
        description:
          "Developing custom connectors for government portals and secure internal ERPs.",
      },
      {
        label: "Phase 3",
        title: "Engine Development",
        description:
          "Building the core automation logic with advanced error-handling and retry loops.",
      },
      {
        label: "Phase 4",
        title: "Volume Testing",
        description:
          "Stress testing the system with millions of records to ensure stability under load.",
      },
    ],
    faqs: [
      {
        question: "How does it handle tax code updates?",
        answer:
          "The system features a dynamic rules engine that can be updated via an admin panel without code changes.",
      },
      {
        question: "What happens if the government portal fails?",
        answer:
          "Intelligent retry logic and instant alerts ensure that filings are queued and retried automatically.",
      },
      {
        question: "Is financial data encrypted?",
        answer:
          "All sensitive financial data is encrypted at rest and in transit using AES-256 standards.",
      },
      {
        question: "Does it integrate with SAP?",
        answer:
          "Yes, it features native high-speed connectors for SAP and Microsoft Dynamics ERPs.",
      },
      {
        question: "What is the training requirement?",
        answer:
          "The intuitive dashboard requires less than 2 hours of training for administrative staff.",
      },
    ],
  },
  "retail-personalization-engine": {
    slug: "retail-personalization-engine",
    title: "Beauty Retail Ecosystem",
    subtitle: "Shopify-Powered Multi-Channel Experience for Premium Retail",
    category: "Web Development",
    client: "Global Beauty Brand",
    duration: "10 Months",
    description:
      "A high-end retail personalization engine that unifies online and offline customer data to deliver hyper-personalized shopping experiences.",
    heroImage: "/assets/projects/retail-personalization-engine.jpg",
    overview:
      "We built a premium omni-channel ecosystem for a leading beauty brand, focusing on bridging the gap between physical store visits and digital engagement through AI-driven personalization.",
    challenge:
      "The client suffered from siloed customer data, making it impossible to provide consistent recommendations. Page load times on the old platform were also hurting mobile conversion rates.",
    solution:
      "We developed a unified Shopify Plus storefront using React and GraphQL. We integrated a custom AI recommendation engine that analyzes skin profiles and purchase history to suggest tailored products.",
    galleryImages: [
      "/assets/projects/retail-personalization-engine-gallery-1.jpg",
      "/assets/projects/retail-personalization-engine-gallery-2.jpg",
    ],
    features: [
      "Omni-channel Loyalty",
      "AI Product Recommendations",
      "Hyper-local Inventory",
      "Seamless Checkout",
      "Mobile-First Experience",
      "Real-time Stock Tracking",
      "Personalized Promotions",
      "Analytics Integration",
    ],
    metrics: [
      {
        label: "Retention Rate",
        value: "+40%",
      },
      {
        label: "Conversion",
        value: "2x Increase",
      },
      {
        label: "Mobile Sales",
        value: "75% Share",
      },
      {
        label: "Page Load",
        value: "< 1.5s",
      },
    ],
    results: [
      {
        stat: "40%",
        title: "Customer Retention",
        description:
          "Personalized loyalty rewards drove a significant increase in repeat purchase frequency.",
      },
      {
        stat: "2.5x",
        title: "Conversion Boost",
        description:
          "A highly optimized, frictionless checkout process led to much higher sales completions.",
      },
      {
        stat: "1.2s",
        title: "Load Performance",
        description:
          "Ultra-fast page loads on mobile devices reduced bounce rates by nearly 50%.",
      },
    ],
    techStack: [
      "Shopify Plus",
      "React.js",
      "GraphQL",
      "Node.js",
      "AWS",
      "MongoDB",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "User Strategy",
        description:
          "Defining customer personas and mapping the multi-channel beauty journey.",
      },
      {
        label: "Phase 2",
        title: "UX/UI Design",
        description:
          "Designing a luxurious, high-performance visual interface optimized for mobile.",
      },
      {
        label: "Phase 3",
        title: "Platform Build",
        description:
          "Developing the Shopify Plus storefront and integrating the custom AI engine.",
      },
      {
        label: "Phase 4",
        title: "Beta & Launch",
        description:
          "Soft launch with loyalty members followed by a full production rollout.",
      },
    ],
    faqs: [
      {
        question: "Can it handle heavy sale traffic?",
        answer:
          "The Shopify Plus foundation is built to handle thousands of checkouts per minute.",
      },
      {
        question: "How accurate is the AI engine?",
        answer:
          "The recommendation engine has a 92% accuracy rate based on customer feedback loops.",
      },
      {
        question: "Does it support global shipping?",
        answer:
          "Yes, it integrates with international carriers and calculates duties in real-time.",
      },
      {
        question: "How is local stock tracked?",
        answer:
          "Real-time API sync with physical stores ensures 100% inventory accuracy online.",
      },
      {
        question: "Is there a mobile app?",
        answer:
          "The platform is built as a PWA, offering an app-like experience on all mobile devices.",
      },
    ],
  },
  "data-platform-modernization": {
    slug: "data-platform-modernization",
    title: "Data Analytics Platform",
    subtitle: "Modernizing Enterprise Data for Real-Time Decision Making",
    category: "AI & Data",
    client: "Regional Banking Group",
    duration: "12 Months",
    description:
      "A complete data migration and analytics modernization project implementing a high-performance Snowflake architecture for financial intelligence.",
    heroImage: "/assets/projects/data-platform-modernization.jpg",
    overview:
      "We helped a major banking group transition from fragmented legacy data silos to a unified, cloud-native analytics platform, enabling real-time business intelligence and predictive modeling.",
    challenge:
      "Slow legacy reporting cycles (taking over 24 hours) were preventing the bank from responding quickly to market shifts and customer needs.",
    solution:
      "We implemented a modern data stack using Snowflake and AWS. We built automated ETL pipelines using Airflow to ingest millions of daily transactions into a secure, centralized data warehouse.",
    galleryImages: [
      "/assets/projects/data-platform-modernization-gallery-1.jpg",
      "/assets/projects/data-platform-modernization-gallery-2.jpg",
    ],
    features: [
      "Cloud Data Warehouse",
      "Real-time Data Sync",
      "Advanced BI Dashboards",
      "Automated ETL Pipelines",
      "Predictive Analytics",
      "Data Governance",
      "Self-Service Reporting",
      "Security Monitoring",
    ],
    metrics: [
      {
        label: "Query Speed",
        value: "8x Fast",
      },
      {
        label: "Data Ingestion",
        value: "Real-time",
      },
      {
        label: "System Uptime",
        value: "99.95%",
      },
      {
        label: "Report Accuracy",
        value: "99.9%",
      },
    ],
    results: [
      {
        stat: "10x",
        title: "Performance Gain",
        description:
          "Complex financial reports that took hours now complete in under 30 seconds.",
      },
      {
        stat: "Real-time",
        title: "Visibility",
        description:
          "Leadership now consumes live data dashboards instead of waiting for end-of-day reports.",
      },
      {
        stat: "30%",
        title: "Cost Savings",
        description:
          "Moving from on-prem to a flexible cloud model reduced infrastructure costs significantly.",
      },
    ],
    techStack: [
      "Snowflake",
      "AWS Glue",
      "Python",
      "d3.js",
      "Tableau",
      "Airflow",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Data Audit",
        description:
          "Full assessment of deep-seated data silos and identifying data quality issues.",
      },
      {
        label: "Phase 2",
        title: "Schema Design",
        description:
          "Architecting the Snowflake data model for optimal performance and security.",
      },
      {
        label: "Phase 3",
        title: "Ingestion Build",
        description:
          "Developing automated ETL/ELT pipelines using Airflow and AWS Glue.",
      },
      {
        label: "Phase 4",
        title: "Viz & Training",
        description:
          "Creating advanced Tableau/d3.js dashboards and training internal data teams.",
      },
    ],
    faqs: [
      {
        question: "How do you ensure data security?",
        answer:
          "The platform uses role-based access control (RBAC) and hardware-level encryption.",
      },
      {
        question: "Does it comply with banking laws?",
        answer:
          "Yes, it is fully compliant with local banking regulations and international GDPR standards.",
      },
      {
        question: "Can we use the data for ML?",
        answer:
          "Absolutely, the cleaned and structured data provides a perfect foundation for machine learning.",
      },
      {
        question: "What is the data freshness?",
        answer:
          "Our streaming pipelines ensure mid-tier data is updated within 60 seconds of a transaction.",
      },
      {
        question: "Is the platform easy to maintain?",
        answer:
          "Using Infrastructure as Code (Terraform) makes the platform easy to manage and update.",
      },
    ],
  },
  "influence-flow": {
    slug: "influence-flow",
    title: "Influence Flow: Influencer Marketing SaaS",
    subtitle:
      "Revolutionizing the creator economy with data-driven relationship management.",
    category: "AI & Data",
    client: "InfluenceFlow Corp",
    duration: "8 Months",
    description:
      "A comprehensive influencer marketing platform that connects brands with creators through advanced AI-driven discovery, automated campaign management, and real-time performance tracking.",
    heroImage: "/assets/projects/influence-flow.jpg",
    overview:
      "Influence Flow was designed to bridge the gap between enterprise brands and the growing creator economy. The platform automates the entire influencer lifecycle from discovery to payout, ensuring transparency and ROI measurement.",
    challenge:
      "The client needed to process millions of social data points in real-time to provide accurate engagement metrics while managing complex multi-currency payment workflows for thousands of creators simultaneously.",
    solution:
      "We implemented a microservices architecture using Node.js and Python for the data engine. The platform features an AI-powered discovery tool that analyzes creator content patterns and audience demographics using advanced NLP models.",
    galleryImages: [
      "/assets/projects/influence-flow-gallery-1.jpg",
      "/assets/projects/influence-flow-gallery-2.jpg",
    ],
    features: [
      "AI-Powered Creator Discovery",
      "Real-time Engagement Analytics",
      "Automated Campaign Workflows",
      "Secure multi-currency Payouts",
      "Advanced Audience Demographics",
      "Influencer Relationship Management (IRM)",
      "Content Approval Pipeline",
      "Custom Performance Reporting",
    ],
    metrics: [
      {
        label: "Active Creators",
        value: "35k+",
      },
      {
        label: "Data Points/Day",
        value: "10M+",
      },
      {
        label: "Brands Boarded",
        value: "500+",
      },
      {
        label: "Campaign ROI",
        value: "3.5x",
      },
    ],
    results: [
      {
        stat: "65%",
        title: "Efficiency Gain",
        description:
          "Reduction in manual administrative tasks for agency campaign managers.",
      },
      {
        stat: "99.9%",
        title: "Data Accuracy",
        description:
          "Precision in tracking social media engagement across major platforms.",
      },
      {
        stat: "3x",
        title: "Scale Increase",
        description:
          "The platform successfully tripled its user capacity within 3 months of launch.",
      },
    ],
    techStack: [
      "React",
      "Node.js",
      "Python",
      "PostgreSQL",
      "AWS Lambda",
      "TensorFlow",
      "GraphQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Requirement Analysis",
        description:
          "Mapping global influencer workflows and API integrations.",
      },
      {
        label: "Phase 2",
        title: "Platform Discovery Engine",
        description: "Developing the AI model for creator profile indexing.",
      },
      {
        label: "Phase 3",
        title: "Beta Launch",
        description: "Pilot testing with 10 major brands and 1,000 creators.",
      },
      {
        label: "Phase 4",
        title: "Global Scale-up",
        description:
          "Full production deployment and multi-region infrastructure optimization.",
      },
    ],
    faqs: [
      {
        question: "How does the AI discovery work?",
        answer:
          "It uses NLP and computer vision to categorize creator content and verify audience authenticity.",
      },
      {
        question: "Can it integrate with existing CRMs?",
        answer:
          "Yes, the platform offers robust APIs for seamless integration with Salesforce and HubSpot.",
      },
      {
        question: "What social platforms are supported?",
        answer:
          "Currently supports Instagram, YouTube, TikTok, and Twitter (X).",
      },
      {
        question: "How are creators paid?",
        answer:
          "Integrated with Stripe and PayPal for automated, secure global distributions.",
      },
      {
        question: "Is data privacy compliant?",
        answer:
          "The platform is fully GDPR and CCPA compliant regarding creator and brand data.",
      },
    ],
  },
  "smart-iot-diagnostic": {
    slug: "smart-iot-diagnostic",
    title: "Daikin: Smart IoT Diagnostic System",
    subtitle:
      "Intelligent cooling systems powered by real-time sensor analytics.",
    category: "AI & Automation",
    client: "Daikin Industries",
    duration: "12 Months",
    description:
      "An advanced IoT ecosystem developed for remote monitoring, diagnostic predictive maintenance, and energy optimization of industrial cooling units.",
    heroImage: "/assets/projects/smart-iot-diagnostic.jpg",
    overview:
      "Daikin required a centralized platform to manage thousands of industrial HVAC units across multiple territories. The goal was to move from reactive to predictive maintenance using live sensor data stream.",
    challenge:
      "Integrating legacy hardware protocols with modern cloud architecture while ensuring sub-second latency for critical system alerts in industrial environments.",
    solution:
      "Developed a custom IoT Gateway solution that bridges local sensor data with a Google Cloud-based analytics engine, visualization through a high-performance React dashboard.",
    galleryImages: [
      "/assets/projects/smart-iot-diagnostic-gallery-1.jpg",
      "/assets/projects/smart-iot-diagnostic-gallery-2.jpg",
    ],
    features: [
      "Real-time Sensor Telemetry",
      "Predictive Failure Analysis",
      "Remote Unit Configuration",
      "Energy Consumption Tracking",
      "Automated Service Ticketing",
      "Custom Threshold Alerts",
      "Fleet Management Dashboard",
      "Legacy Protocol Mapping",
    ],
    metrics: [
      {
        label: "Connected Devices",
        value: "25k+",
      },
      {
        label: "Fault Prediction",
        value: "92%",
      },
      {
        label: "Energy Savings",
        value: "18%",
      },
      {
        label: "Response Time",
        value: "250ms",
      },
    ],
    results: [
      {
        stat: "30%",
        title: "Reduced Downtime",
        description:
          "Reduction in unplanned outages through early warning system alerts.",
      },
      {
        stat: "40%",
        title: "Fleet Optimization",
        description:
          "Improved dispatch efficiency for technical maintenance teams.",
      },
      {
        stat: "15%",
        title: "Efficiency Boost",
        description:
          "Overall increase in thermal efficiency across monitored HVAC fleets.",
      },
    ],
    techStack: [
      "C++",
      "Python",
      "React",
      "Google Cloud IoT",
      "MongoDB",
      "MQTT",
      "Grafana",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "IoT Architecture",
        description:
          "Designing the secure communication layer between sensors and cloud.",
      },
      {
        label: "Phase 2",
        title: "ML Model Training",
        description:
          "Developing diagnostic models based on historical vibration and temperature data.",
      },
      {
        label: "Phase 3",
        title: "Pilot Installation",
        description:
          "Deploying the smart diagnostic system in 50 select industrial sites.",
      },
      {
        label: "Phase 4",
        title: "Enterprise Rollout",
        description:
          "Scaling across the continental network of commercial cooling systems.",
      },
    ],
    faqs: [
      {
        question: "Does it work with older HVAC models?",
        answer:
          "Yes, our custom bridge hardware supports most legacy Daikin commercial processors.",
      },
      {
        question: "How secure is the data transmission?",
        answer:
          "All data is encrypted via TLS 1.3 and uses certificate-based authentication for devices.",
      },
      {
        question: "Can maintenance be scheduled automatically?",
        answer:
          "Yes, the system triggers service requests directly into the Daikin enterprise ERP.",
      },
      {
        question: "Does it support mobile alerts?",
        answer:
          "Full integration with iOS and Android mobile apps for field technicians.",
      },
      {
        question: "What sensors are monitored?",
        answer:
          "Temperature, pressure, humidity, power consumption, and compressor vibration.",
      },
    ],
  },
  "digital-banking-modernization": {
    slug: "digital-banking-modernization",
    title: "UBL: Enterprise Mobile Banking",
    subtitle:
      "A frictionless financial experience for millions of digital users.",
    category: "Fintech",
    client: "United Bank Limited",
    duration: "18 Months",
    description:
      "Full-scale digital transformation of a legacy banking mobile app into a modern, feature-rich financial hub with biometric security and real-time payments.",
    heroImage: "/assets/projects/digital-banking-modernization.jpg",
    overview:
      "United Bank Limited needed to recapture the millennial market by redesigning their digital presence. We overhauled the entire UI/UX and backend integration to support high-traffic retail banking.",
    challenge:
      "Ensuring zero-downtime migration for millions of users while maintaining strict regulatory compliance and ultra-secure transaction protocols.",
    solution:
      "A scalable Flutter-based mobile application backed by a Java Spring Boot microservices layer, implementing 3D Secure 2.0 and biometric authentication patterns.",
    galleryImages: [
      "/assets/projects/digital-banking-modernization-gallery-1.jpg",
      "/assets/projects/digital-banking-modernization-gallery-2.jpg",
    ],
    features: [
      "Biometric Secure Login",
      "Real-time Fund Transfers",
      "QR Payment Integration",
      "Automated Utility Billing",
      "In-App Loan Management",
      "Virtual Card Issuance",
      "Spending Analytics",
      "Multi-factor Authentication",
    ],
    metrics: [
      {
        label: "Mobile Users",
        value: "2.5M+",
      },
      {
        label: "Daily Transactions",
        value: "1.2M",
      },
      {
        label: "App Rating",
        value: "4.8/5",
      },
      {
        label: "System Uptime",
        value: "99.95%",
      },
    ],
    results: [
      {
        stat: "200%",
        title: "Active Growth",
        description:
          "Increase in weekly active users within six months of the version 2.0 launch.",
      },
      {
        stat: "85%",
        title: "Manual Reduction",
        description:
          "Decrease in branch-based manual service requests for basic account tasks.",
      },
      {
        stat: "50%",
        title: "Onboarding Speed",
        description:
          "Reduction in time-to-open digital accounts using automated KYC.",
      },
    ],
    techStack: [
      "Flutter",
      "Java",
      "Spring Boot",
      "Oracle DB",
      "Redis",
      "Docker",
      "Kubernetes",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "UX Research",
        description:
          "Understanding user pain points in legacy banking transitions.",
      },
      {
        label: "Phase 2",
        title: "Middleware Refactor",
        description:
          "Building the microservices layer to decouple from the core banking host.",
      },
      {
        label: "Phase 3",
        title: "Security Hardening",
        description:
          "Implementing advanced encryption and fraud detection algorithms.",
      },
      {
        label: "Phase 4",
        title: "Staged Deployment",
        description:
          "Phased rollout starting with internal staff before full public launch.",
      },
    ],
    faqs: [
      {
        question: "Is the app secure for large transactions?",
        answer:
          "Yes, it uses multi-level verification including hardware-bound device binding.",
      },
      {
        question: "Does it support international transfers?",
        answer: "Fully integrated with SWIFT and major remittance networks.",
      },
      {
        question: "What happens if I lose my phone?",
        answer:
          "Users can instantly freeze their digital profile via web or customer care hotline.",
      },
      {
        question: "Can I open an account digitally?",
        answer:
          "Yes, the app features full digital KYC including facial recognition.",
      },
      {
        question: "Is there a dark mode?",
        answer:
          "The app features a fully adaptive UI with support for Dark and Light modes.",
      },
    ],
  },
  "microfinance-field-digitization": {
    slug: "microfinance-field-digitization",
    title: "Kashf: Field Operations Portal",
    subtitle: "Empowering microfinance officers with offline-first mobility.",
    category: "Mobile Development",
    client: "Kashf Foundation",
    duration: "10 Months",
    description:
      "A specialized field officer application designed to digitize credit disbursement and collection processes in remote, low-connectivity areas.",
    heroImage: "/assets/projects/microfinance-field-digitization.jpg",
    overview:
      "Kashf Foundation required a way to eliminate paper-based documentation for their field officers. The solution needed to work in rural areas with unreliable internet connections.",
    challenge:
      "Designing a data synchronization engine that can handle conflict resolution when officers sync hundreds of applications after days of offline work.",
    solution:
      "Built a robust mobile application with a local SQLite database and a delta-based sync engine, allowing field officers to perform full credit assessments offline.",
    galleryImages: [
      "/assets/projects/microfinance-field-digitization-gallery-1.jpg",
      "/assets/projects/microfinance-field-digitization-gallery-2.jpg",
    ],
    features: [
      "Offline-First Data Entry",
      "Conflict Resolution Engine",
      "Digital Document Scanning",
      "GPS-Tagged Assessments",
      "Automated Credit Scoring",
      "Field Schedule Management",
      "Biometric Client Verification",
      "Performance Analytics",
    ],
    metrics: [
      {
        label: "Field Officers",
        value: "2k+",
      },
      {
        label: "Clients Served",
        value: "1M+",
      },
      {
        label: "Sync Success",
        value: "99.9%",
      },
      {
        label: "Data Accuracy",
        value: "99.9%",
      },
    ],
    results: [
      {
        stat: "90%",
        title: "Paper Elimination",
        description:
          "Reduction in physical paper usage and associated storage costs.",
      },
      {
        stat: "48h",
        title: "Faster Processing",
        description:
          "Average reduction in loan approval time from assessment to disbursement.",
      },
      {
        stat: "95%",
        title: "Officer Compliance",
        description:
          "Increase in adherence to standard assessment protocols via mandatory digital fields.",
      },
    ],
    techStack: [
      "React Native",
      "SQLite",
      "Node.js",
      "CouchDB",
      "Google Maps API",
      "OpenCV",
      "Azure",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Field Immersion",
        description:
          "Technicians shadowing officers in remote villages to understand constraints.",
      },
      {
        label: "Phase 2",
        title: "Sync Engine Build",
        description:
          "Developing the proprietary offline-to-online data reconciliation system.",
      },
      {
        label: "Phase 3",
        title: "Beta Pilot",
        description:
          "Testing in one region with 50 field officers for one loan cycle.",
      },
      {
        label: "Phase 4",
        title: "National Deployment",
        description:
          "Scaling the application to all field offices across the territory.",
      },
    ],
    faqs: [
      {
        question: "Does it work without 4G?",
        answer:
          "The app works entirely offline and only requires 2G/GPRS for periodic syncing.",
      },
      {
        question: "How does GPS tagging work?",
        answer:
          "It captures coordinate stamps at the time of client signature to verify field visits.",
      },
      {
        question: "Is the data encrypted locally?",
        answer:
          "All local SQLite partitions are encrypted with AES-256 at the device level.",
      },
      {
        question: "Can it scan physical ID cards?",
        answer:
          "Integrated OCR allows for instant scanning of national identity cards.",
      },
      {
        question: "Does it support local languages?",
        answer:
          "The UI is localized in both national and regional languages for ease of use.",
      },
    ],
  },
  "grecha-delivery": {
    slug: "grecha-delivery",
    title: "Grecha",
    subtitle: "Automated Grocery Store Ecosystem",
    category: "Mobile Development",
    client: "Grecha Logistics",
    duration: "4 Months",
    description:
      "A comprehensive delivery platform designed to eliminate the friction between local grocery stores and urban consumers through intelligent logistics.",
    heroImage: "/assets/projects/grecha-delivery.jpg",
    overview:
      "Grecha approached us to build a robust MVP that could handle high-concurrency ordering while maintaining a seamless user experience for both customers and couriers.",
    challenge:
      "The primary challenge was synchronizing inventory across multiple regional warehouses in real-time while ensuring the mobile app remained responsive on mid-range devices.",
    solution:
      "We implemented a React Native application backed by a microservices architecture that prioritizes local caching and event-driven inventory updates.",
    galleryImages: [
      "/assets/projects/grecha-delivery-gallery-1.jpg",
      "/assets/projects/grecha-delivery-gallery-2.jpg",
    ],
    features: [
      "Real-time Inventory Sync",
      "Geofenced Courier Matching",
      "Dynamic Delivery Estimations",
      "Multi-Store Support",
      "Secure Payment Integration",
      "Automated Invoice Generation",
      "Loyalty Program Module",
      "In-App Customer Support",
    ],
    metrics: [
      {
        label: "Monthly Active Users",
        value: "15,000+",
      },
      {
        label: "App Store Rating",
        value: "4.9/5.0",
      },
      {
        label: "Avg. Delivery Time",
        value: "22 Mins",
      },
      {
        label: "Platform Uptime",
        value: "99.9%",
      },
    ],
    results: [
      {
        stat: "25%",
        title: "AOV Increase",
        description:
          "Upselling algorithms directly increased the average order value within 3 months.",
      },
      {
        stat: "60%",
        title: "Fulfillment Accuracy",
        description:
          "Reduced manual errors in the packing process through automated barcode scanning.",
      },
      {
        stat: "3x",
        title: "Efficiency Boost",
        description:
          "Optimized route planning tripled the number of deliveries per courier per shift.",
      },
    ],
    techStack: [
      "React Native",
      "Node.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "AWS",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Strategy & Discovery",
        description:
          "In-depth market research and defining the technical architecture for regional scalability.",
      },
      {
        label: "Phase 2",
        title: "UX/UI Design",
        description:
          "Crafting a conversion-focused interface with clear navigation and visual hierarchy.",
      },
      {
        label: "Phase 3",
        title: "Core Development",
        description:
          "Developing the shopper, courier, and admin applications with real-time data sync.",
      },
      {
        label: "Phase 4",
        title: "QA & Deployment",
        description:
          "Rigorous stress testing and multi-stage deployment across App Store and Play Store.",
      },
    ],
    faqs: [
      {
        question: "How does the app handle offline data?",
        answer:
          "We use local storage persistence to allow users to browse and add items to the cart even without an active connection.",
      },
      {
        question: "Can the system integrate with existing ERPs?",
        answer:
          "Yes, we built a flexible API layer that bridges the platform with most standard retail inventory systems.",
      },
      {
        question: "What security measures are in place for payments?",
        answer:
          "All transactions are processed through PCI-compliant gateways with 256-bit encryption and tokenization.",
      },
      {
        question: "How are couriers assigned to orders?",
        answer:
          "Our custom algorithm uses proximity and current load to dispatch the most efficient courier automatically.",
      },
      {
        question: "Is the app available on both iOS and Android?",
        answer:
          "Yes, utilizing React Native allowed us to deploy a high-quality experience on both platforms simultaneously.",
      },
    ],
  },
  "energo-iot": {
    slug: "energo-iot",
    title: "Energo",
    subtitle: "Smart Industrial Energy Management",
    category: "Cloud & DevOps",
    client: "Energo Solutions",
    duration: "6 Months",
    description:
      "An enterprise IoT platform designed to monitor and optimize energy consumption across large-scale industrial complexes using real-time data analytics.",
    heroImage: "/assets/projects/energo-iot.jpg",
    overview:
      "Energo needed a centralized system to aggregate data from thousands of IoT sensors to help plant managers identify energy waste and reduce operational costs.",
    challenge:
      "The system had to process high-velocity telemetry data from diverse hardware while providing sub-second latency for critical threshold alerts.",
    solution:
      "We developed a serverless architecture on AWS that leverages Kinesis for data ingestion and a React-based dashboard for advanced data visualization.",
    galleryImages: [
      "/assets/projects/energo-iot-gallery-1.jpg",
      "/assets/projects/energo-iot-gallery-2.jpg",
    ],
    features: [
      "Real-time Telemetry Processing",
      "Predictive Maintenance Alerts",
      "Custom Reporting Engine",
      "Multi-Site Data Aggregation",
      "Hardware-Agnostic Integration",
      "Automated Peak Shaving",
      "Carbon Footprint Tracking",
      "Historical Trend Analysis",
    ],
    metrics: [
      {
        label: "Peak Load Reduction",
        value: "30%",
      },
      {
        label: "Monitoring Uptime",
        value: "99.95%",
      },
      {
        label: "Assets Monitored",
        value: "200+",
      },
      {
        label: "Data Latency",
        value: "< 1s",
      },
    ],
    results: [
      {
        stat: "85%",
        title: "User Retention",
        description:
          "High stickiness achieved through actionable financial insights and daily value tracking.",
      },
      {
        stat: "40%",
        title: "Onboarding Speed",
        description:
          "Redesigned KYC flow significantly reduced the time from signup to first asset sync.",
      },
      {
        stat: "2x",
        title: "Savings Rate",
        description:
          "Users who followed the smart budgeting tips doubled their monthly savings on average.",
      },
    ],
    techStack: [
      "React Native",
      "Python",
      "Django",
      "Plaid API",
      "Redis",
      "PostgreSQL",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Security Foundation",
        description:
          "Implementing the core encryption engine and preparing documentation for financial compliance.",
      },
      {
        label: "Phase 2",
        title: "API Integration",
        description:
          "Connecting to major financial providers and standardizing data formats for aggregation.",
      },
      {
        label: "Phase 3",
        title: "UX Refinement",
        description:
          "Developing complex financial charts that remain intuitive on mobile screen sizes.",
      },
      {
        label: "Phase 4",
        title: "Compliance Audit",
        description:
          "Passing third-party penetration tests and achieving final certification for launch.",
      },
    ],
    faqs: [
      {
        question: "Is my banking data stored on your servers?",
        answer:
          "No, we use tokenized access via Plaid, meaning we never store or even see your raw login credentials.",
      },
      {
        question: "Which crypto exchanges are supported?",
        answer:
          "We support over 20 major exchanges including Coinbase, Binance, and Kraken via secure API keys.",
      },
      {
        question: "How often is the asset value updated?",
        answer:
          "Prices are refreshed every 60 seconds, or instantly upon manual pull-to-refresh by the user.",
      },
      {
        question: "Does the app offer investment advice?",
        answer:
          "The app provides data-driven insights and rebalancing alerts but does not provide regulated financial advice.",
      },
      {
        question: "What happens if I lose my phone?",
        answer:
          "Account access can be remotely revoked, and data remains protected by compulsory biometric locks.",
      },
    ],
  },
  "baza-real-estate": {
    slug: "baza-real-estate",
    title: "Baza",
    subtitle: "Premium Long-Term Rental Platform",
    category: "Web Development",
    client: "Baza PropTech",
    duration: "5 Months",
    description:
      "A sophisticated real estate marketplace connecting landlords with high-quality tenants through an automated vetting and bidding system.",
    heroImage: "/assets/projects/baza-real-estate.jpg",
    overview:
      "Baza aimed to disrupt the manual rental process by automating tenant verification and rental offer management for premium properties.",
    challenge:
      "Creating a trust-based ecosystem where high-value transactions could be initiated and managed entirely online with zero friction.",
    solution:
      "We developed a custom web platform with integrated document e-signing, identity verification, and a real-time offer tracking system.",
    galleryImages: [
      "/assets/projects/baza-real-estate-gallery-1.jpg",
      "/assets/projects/baza-real-estate-gallery-2.jpg",
    ],
    features: [
      "Automated Tenant Vetting",
      "E-Signature Integration",
      "Virtual Tour Hosting",
      "Smart Rental Bidding",
      "Landlord CRM Suite",
      "Automated Rent Collection",
      "Maintenance Request Portal",
      "Identity Verification (KYC)",
    ],
    metrics: [
      {
        label: "Verified Listings",
        value: "5,000+",
      },
      {
        label: "Conversion Rate",
        value: "35%",
      },
      {
        label: "Booking Speed",
        value: "2x Faster",
      },
      {
        label: "ID Accuracy",
        value: "99.9%",
      },
    ],
    results: [
      {
        stat: "50%",
        title: "Lower Vacancy",
        description:
          "Automated matching reduced the time properties spent empty between tenancies.",
      },
      {
        stat: "30%",
        title: "Higher Yields",
        description:
          "Transparent bidding allowed landlords to achieve the true market value for their assets.",
      },
      {
        stat: "10/10",
        title: "User Experience",
        description:
          "Consistently high net promoter scores from both individual landlords and agencies.",
      },
    ],
    techStack: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Stripe",
      "AWS S3",
      "MongoDB",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "User Journey Mapping",
        description:
          "Defining the complex workflows for landlord onboarding and tenant application verification.",
      },
      {
        label: "Phase 2",
        title: "Core Platform Build",
        description:
          "Developing the searchable marketplace and property listing management modules.",
      },
      {
        label: "Phase 3",
        title: "Financial Integration",
        description:
          "Implementing Stripe for secure deposit holdings and automated monthly rent payments.",
      },
      {
        label: "Phase 4",
        title: "Vetting Automation",
        description:
          "Building the background check engine and automated digital contract generation.",
      },
    ],
    faqs: [
      {
        question: "How are tenants verified?",
        answer:
          "We use a multi-step process including identity verification, credit checks, and employment confirmation.",
      },
      {
        question: "How does the bidding system work?",
        answer:
          "Tenants can submit offers; landlords can then compare profiles and offers side-by-side to choose the best fit.",
      },
      {
        question: "Are the digital contracts legally binding?",
        answer:
          "Yes, we integrate with industry-standard e-signature providers that comply with global e-sign laws.",
      },
      {
        question: "Is the platform available for agencies?",
        answer:
          "Absolutely, we built a specific multi-user admin suite for large-scale property management firms.",
      },
      {
        question: "How is the property data protected?",
        answer:
          "All sensitive documents are stored in encrypted S3 buckets with time-limited access URLs.",
      },
    ],
  },
  "push-chain": {
    slug: "push-chain",
    title: "PushChain Infrastructure",
    subtitle: "High-Performance Decentralized Messaging Protocol",
    category: "Blockchain Development",
    client: "Push Protocol",
    duration: "8 Months",
    description:
      "Architecting and implementing a dedicated Layer 1 blockchain optimized specifically for decentralized notifications and real-time communication. This project involved deep protocol-level engineering to ensure low latency and high throughput for cross-chain messaging solutions.",
    heroImage: "/assets/projects/push-chain.jpg",
    overview:
      "PushChain was designed to solve the bottleneck of synchronized communication in the Web3 ecosystem. By moving notifications to a dedicated chain, we enabled seamless, trustless alerts across multiple blockchain networks without the congestion of primary liquidity layers.",
    challenge:
      "The primary challenge was maintaining near-instant finality for notifications while ensuring the cost per message remained negligible. Existing L1 structures were either too slow or too expensive for the high-frequency requirements of a global messaging protocol.",
    solution:
      "We implemented a custom consensus mechanism based on Proof of Stake with a focus on data availability. The architecture supports parallel processing of notification shards, allowing for horizontal scalability as the dApp ecosystem grows.",
    galleryImages: [
      "/assets/projects/push-chain-gallery-1.jpg",
      "/assets/projects/push-chain-gallery-2.jpg",
    ],
    features: [
      "Protocol-Level Cross-Chain Messaging",
      "High-Throughput Gossip Protocol",
      "Low-Latency Consensus Engine",
      "Automated Node Incentivization",
      "Encrypted End-to-End Delivery",
      "Multi-Wallet Support Infrastructure",
      "Real-time Data Availability Shards",
      "Developer-First SDK Integration",
    ],
    metrics: [
      {
        label: "Throughput",
        value: "10,000 TPS",
      },
      {
        label: "Average Latency",
        value: "< 2 Seconds",
      },
      {
        label: "dApps Integrated",
        value: "150+",
      },
      {
        label: "Cost Reduction",
        value: "95%",
      },
    ],
    results: [
      {
        stat: "10M+",
        title: "Notifications Delivered",
        description:
          "Successfully processed and delivered millions of real-time alerts across 50+ Web3 applications.",
      },
      {
        stat: "99.99%",
        title: "Network Uptime",
        description:
          "Maintained consistent availability during peak congestion periods on major mainnets.",
      },
      {
        stat: "4x",
        title: "Developer Growth",
        description:
          "Saw a 400% increase in developer adoption within three months of the protocol launch.",
      },
    ],
    techStack: [
      "Solidity",
      "Rust",
      "Go-Ethereum",
      "Tendermint",
      "WebSocket API",
      "PostgreSQL",
      "Docker/Kubernetes",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Protocol Design",
        description:
          "Defined the sharding architecture and consensus parameters for the messaging-specific L1.",
      },
      {
        label: "Phase 2",
        title: "Devnet Launch",
        description:
          "Deployed the initial internal network to test cross-chain synchronization and latency.",
      },
      {
        label: "Phase 3",
        title: "Security Auditing",
        description:
          "Rigorous stress testing and smart contract audits by leading security firms.",
      },
      {
        label: "Phase 4",
        title: "Mainnet Genesis",
        description:
          "Complete rollout of the PushChain mainnet with public validator onboarding.",
      },
    ],
    faqs: [
      {
        question: "How does PushChain differ from standard L1s?",
        answer:
          "It is specifically optimized for ephemeral data and messaging rather than financial state persistence, reducing costs by 95%.",
      },
      {
        question: "Is it compatible with Ethereum?",
        answer:
          "Yes, it is fully EVM-compatible, allowing developers to use familiar tools like Hardhat and Foundry.",
      },
      {
        question: "What is the consensus mechanism?",
        answer:
          "It uses a modified Proof of Stake mechanism optimized for high-frequency data availability.",
      },
      {
        question: "How are validators rewarded?",
        answer:
          "Validators earn fees through notification throughput and staking yield from the native network token.",
      },
      {
        question: "Can it support mobile apps?",
        answer:
          "The SDK is designed for cross-platform support, including iOS and Android native integrations.",
      },
    ],
  },
  "swiggy-web3-loyalty": {
    slug: "swiggy-web3-loyalty",
    title: "Swiggy Dineout Web3 Integration",
    subtitle: "NFT-Based Enhanced Customer Loyalty Program",
    category: "AI & Data",
    client: "Swiggy",
    duration: "6 Months",
    description:
      "Developing a cutting-edge loyalty ecosystem for India's leading delivery platform. We integrated NFT-based rewards and decentralized identifiers to create a unique, gamified dining experience that rewards high-frequency users with exclusive digital assets and real-world perks.",
    heroImage: "/assets/projects/swiggy-web3-loyalty.jpg",
    overview:
      "The Swiggy Web3 project aimed to transform traditional point-based loyalty into a verifiable, tradeable, and engaging asset-based system. Users earn unique digital collectibles through the Dineout platform which unlock tiered premium services and partner discounts.",
    challenge:
      "Integrating Web3 technology into a high-scale consumer app required frictionless onboarding. We had to abstract the complexity of wallets and gas fees to ensure 100M+ users could interact with the system without technical knowledge.",
    solution:
      "A 'gasless' infrastructure combined with social login-based custodial wallets was implemented. We utilized a scalable sidechain to handle the high volume of micro-transactions associated with daily reward distributions.",
    galleryImages: [
      "/assets/projects/swiggy-web3-loyalty-gallery-1.jpg",
      "/assets/projects/swiggy-web3-loyalty-gallery-2.jpg",
    ],
    features: [
      "Gasless Reward Minting",
      "Social Login Wallet Provisioning",
      "Tiered NFT Membership Logic",
      "Real-time Reward Validation",
      "Partner API Integration",
      "Gamified User Dashboard",
      "Tradeable Loyalty Assets",
      "Fraud Prevention Engine",
    ],
    metrics: [
      {
        label: "User Engagement",
        value: "+40%",
      },
      {
        label: "NFTs Minted",
        value: "500k+",
      },
      {
        label: "Transaction Cost",
        value: "1.2M",
      },
      {
        label: "Daily Games",
        value: "15k+",
      },
      {
        label: "Avg Session",
        value: "24 Mins",
      },
    ],
    results: [
      {
        stat: "100k+",
        title: "NFTs Traded",
        description:
          "Facilitated a massive secondary market for character skins and achievement badges.",
      },
      {
        stat: "$500k",
        title: "Tournament Prizes",
        description:
          "Successfully distributed over half a million dollars in winnings through automated smart contracts.",
      },
      {
        stat: "15%",
        title: "MoM Growth",
        description:
          "Maintained consistent double-digit growth in active users since the alpha launch.",
      },
    ],
    techStack: [
      "Unity (C#)",
      "Solidity",
      "Ethers.js",
      "Firebase",
      "Google Cloud Platform",
      "Web3.js",
      "Moralis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Concept Art",
        description:
          "Developing the visual language and character assets for the pixel-art universe.",
      },
      {
        label: "Phase 2",
        title: "Engine Development",
        description:
          "Building the custom physics and state-channel engine for the arcade platform.",
      },
      {
        label: "Phase 3",
        title: "Beta Testing",
        description:
          "Launching the 'Season 0' tournament to stress test the smart contract payouts.",
      },
      {
        label: "Phase 4",
        title: "Token Launch",
        description:
          "Integration of the native governance token and full public marketplace rollout.",
      },
    ],
    faqs: [
      {
        question: "Is this a mobile game?",
        answer:
          "Yes, it is fully optimized for both Android and iOS with native performance.",
      },
      {
        question: "How do I earn money?",
        answer:
          "Players earn by ranking on leaderboards, winning tournaments, and selling rare NFT items.",
      },
      {
        question: "Are the games fair?",
        answer:
          "All game logic is verified on-chain, and an advanced anti-cheat engine monitors all sessions.",
      },
      {
        question: "Can I play for free?",
        answer:
          "There are designated free-to-play zones, but tournaments usually require a small entry fee.",
      },
      {
        question: "What blockchain is used?",
        answer:
          "The platform runs on Arbitrum to ensure near-zero gas fees and instant transaction speeds.",
      },
    ],
  },
  "mtn-biosmart-registration": {
    slug: "mtn-biosmart-registration",
    title: "MTN BioSmart Implementation",
    subtitle: "Streamlined National Biometric SIM Registration",
    category: "Mobile Development",
    client: "MTN Nigeria",
    duration: "18 Months",
    description:
      "A massive-scale biometric capture and SIM registration system developed to meet complex national regulatory requirements and security standards.",
    heroImage: "/assets/projects/mtn-biosmart-registration.jpg",
    overview:
      "Seamfix deployed the BioSmart solution to enable the largest telecommunications provider in Africa to register and verify millions of subscribers using secure biometric data capture. The system was designed to handle high-volume processing while maintaining strict data integrity and regulatory compliance with the Nigerian Communications Commission (NCC).",
    challenge:
      "The government issued a mandate for all active SIM cards to be linked to validated biometric data within a tight timeframe. MTN required a robust, distributed system capable of handling tens of thousands of concurrent sessions across diverse and often remote geographic locations with limited connectivity.",
    solution:
      "Seamfix engineered a distributed biometric platform featuring offline capture capabilities, real-time validation against central databases, and a comprehensive management dashboard. The solution utilized advanced compression algorithms for biometric data and a robust synchronization engine for low-bandwidth environments.",
    galleryImages: [
      "/assets/projects/mtn-biosmart-registration-gallery-1.jpg",
      "/assets/projects/mtn-biosmart-registration-gallery-2.jpg",
    ],
    features: [
      "Sub-15 Second Biometric Capture",
      "Advanced Offline Synchronization",
      "Anti-Spoofing Liveness Detection",
      "Field Agent Management System",
      "Real-time Inventory Tracking",
      "High-Performance Data Deduplication",
      "End-to-End Encryption (AES-256)",
      "Automated Regulatory Reporting",
    ],
    metrics: [
      {
        label: "Subscribers Enrolled",
        value: "60M+",
      },
      {
        label: "System Uptime",
        value: "99.9%",
      },
      {
        label: "Concurrent Field Users",
        value: "15,000+",
      },
      {
        label: "Registration Speed",
        value: "12s",
      },
    ],
    results: [
      {
        stat: "60M+",
        title: "Compliant Records",
        description:
          "Successfully processed over 60 million biometric registrations within the regulatory window.",
      },
      {
        stat: "40%",
        title: "Cost Optimization",
        description:
          "Identified and eliminated significant operational overhead through process automation.",
      },
      {
        stat: "100%",
        title: "Regulatory Compliance",
        description:
          "Achieved full compliance status with national security and communications regulations.",
      },
    ],
    techStack: [
      "Java",
      "Spring Boot",
      "React Native",
      "Kafka",
      "PostgreSQL",
      "Docker",
      "AWS",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Strategy & Audit",
        description:
          "Comprehensive audit of existing registration workflows and mapping of regulatory requirements.",
      },
      {
        label: "Phase 2",
        title: "Core Development",
        description:
          "Engineering of the biometric capture engine and offline-first synchronization architecture.",
      },
      {
        label: "Phase 3",
        title: "Scale Testing",
        description:
          "Rigorous load testing to ensure stability for 15,000+ concurrent agents in live environments.",
      },
      {
        label: "Phase 4",
        title: "National Rollout",
        description:
          "Full deployment across 36 states with continuous monitoring and field support integration.",
      },
    ],
    faqs: [
      {
        question: "How does the system handle low-internet areas?",
        answer:
          "The BioSmart platform features an offline-first architecture that captures data locally and synchronizes automatically when a connection is established.",
      },
      {
        question: "Is the biometric data secure?",
        answer:
          "Yes, all data is encrypted at the source using FIPS-compliant algorithms before being transmitted and stored.",
      },
      {
        question: "Can the system prevent duplicate registrations?",
        answer:
          "Integrated high-speed AFIS engines perform real-time deduplication to ensure each identity is unique.",
      },
      {
        question: "What hardware is required for field agents?",
        answer:
          "The solution is compatible with Android-based tablets and smartphones paired with certified biometric scanners.",
      },
      {
        question: "How long does it take to train a new agent?",
        answer:
          "The intuitive UI facilitates rapid onboarding, with most agents proficient after a 4-hour training session.",
      },
    ],
  },
  "nimc-national-id-enrollment": {
    slug: "nimc-national-id-enrollment",
    title: "National Identity Management System",
    subtitle: "Accelerating Universal Citizen Identity Enrollment",
    category: "AI & Data",
    client: "NIMC Nigeria",
    duration: "24 Months",
    description:
      "An enterprise-grade enrollment solution designed to facilitate the rapid issuance of National Identity Numbers (NIN) to millions of citizens via decentralized centers.",
    heroImage: "/assets/projects/nimc-national-id-enrollment.jpg",
    overview:
      "Partnering with the National Identity Management Commission (NIMC), Seamfix developed an advanced enrollment ecosystem to bridge the identity gap. The project involved deploying secure terminals across thousands of locations to capture demographic and biometric data, feeding into the national backend for identity deduplication and number issuance.",
    challenge:
      "The primary challenge was managing the sheer volume of data and ensuring high-fidelity biometric capture to prevent identity theft and fraud on a national scale. The infrastructure needed to support high availability and secure data transmission across fragmented network providers.",
    solution:
      "Seamfix implemented a high-availability cloud-hybrid infrastructure that optimized data ingestion and processing. We introduced AI-driven image quality checks at the point of capture to ensure all biometric data met international ICAO standards before submission.",
    galleryImages: [
      "/assets/projects/nimc-national-id-enrollment-gallery-1.jpg",
      "/assets/projects/nimc-national-id-enrollment-gallery-2.jpg",
    ],
    features: [
      "ICAO Standard Photo Capture",
      "Multi-Finger Biometric Scanning",
      "Demographic Data Validation",
      "Encrypted Batch Uploads",
      "Agent Performance Analytics",
      "Automated Error Correction",
      "NIN Issuance Integration",
      "Secure VPN Tunnelling",
    ],
    metrics: [
      {
        label: "NINs Generated",
        value: "80M+",
      },
      {
        label: "Enrollment Centers",
        value: "5,000+",
      },
      {
        label: "Data Accuracy",
        value: "95%",
      },
      {
        label: "Processing Nodes",
        value: "100+",
      },
    ],
    results: [
      {
        stat: "10X",
        title: "Enrollment Speed",
        description:
          "Drastically reduced the average time required to complete a full identity enrollment cycle.",
      },
      {
        stat: "99.9%",
        title: "Data Reliability",
        description:
          "Maintained near-perfect data integrity across millions of records through automated validation.",
      },
      {
        stat: "40M+",
        title: "Financial Inclusion",
        description:
          "Enabled 40 million previously undocumented citizens to access formal financial services.",
      },
    ],
    techStack: [
      "C#",
      ".NET Core",
      "SQL Server",
      "Azure",
      "Python",
      "Kubernetes",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Needs Assessment",
        description:
          "Gathering technical specifications and security protocols from federal stakeholders.",
      },
      {
        label: "Phase 2",
        title: "Core Platform Build",
        description:
          "Developing the secure enrollment client and central API gateway with high-throughput capability.",
      },
      {
        label: "Phase 3",
        title: "Integration",
        description:
          "Connecting the frontend terminals to the national AFIS and identity database.",
      },
      {
        label: "Phase 4",
        title: "Managed Support",
        description:
          "Post-deployment monitoring and infrastructure optimization to handle peak enrollment periods.",
      },
    ],
    faqs: [
      {
        question: "What biometric modalities are captured?",
        answer:
          "The system captures standard ten-print fingerprints and high-resolution facial images in compliance with federal guidelines.",
      },
      {
        question: "How is data protected against unauthorized access?",
        answer:
          "The platform utilizes multi-factor authentication for agents and hardware-level encryption for all stored records.",
      },
      {
        question: "Is the system compatible with existing government hardware?",
        answer:
          "Yes, the software was designed with a hardware abstraction layer to support legacy scanners and systems.",
      },
      {
        question: "How does the system handle power outages?",
        answer:
          "The client application includes data persistence layers that prevent data loss during sudden system shutdowns.",
      },
      {
        question: "Can citizens track their enrollment status?",
        answer:
          "Yes, an integrated status tracking portal was developed to provide real-time updates on NIN issuance.",
      },
    ],
  },
  "verified-kyc-verification": {
    slug: "verified-kyc-verification",
    title: "Verified.ng Identity Platform",
    subtitle: "Enterprise Real-time Identity & KYC Solution",
    category: "Web Development",
    client: "UBA & Fidelity Bank",
    duration: "Ongoing",
    description:
      "A premier identity verification platform connecting businesses with government databases for instant KYC and AML compliance checks.",
    heroImage: "/assets/projects/verified-kyc-verification.jpg",
    overview:
      "Verified.ng is Seamfix's flagship SaaS identity platform. It provides a unified API for businesses to verify the identities of their customers against various authoritative databases, including passports, driver's licenses, and national ID cards. This project transformed the traditional multi-day KYC process into a sub-second digital experience.",
    challenge:
      "Financial institutions faced high abandonment rates due to slow, manual verification processes. Businesses needed a secure, reliable way to verify information without direct access to sensitive government servers.",
    solution:
      "Seamfix built a high-security middleware platform that securely bridges corporate applications and government databases. We implemented a robust rate-limiting and audit-logging engine to ensure compliance with data protection laws while maintaining low latency.",
    galleryImages: [
      "/assets/projects/verified-kyc-verification-gallery-1.jpg",
      "/assets/projects/verified-kyc-verification-gallery-2.jpg",
    ],
    features: [
      "Sub-Second API Responses",
      "OCR Document Extraction",
      "Biometric Face Match (1:1)",
      "AML Watchlist Screening",
      "Bank Account Verification",
      "Customizable KYC Workflows",
      "Batch Processing Capability",
      "Comprehensive Audit Logs",
    ],
    metrics: [
      {
        label: "Identity Checks",
        value: "75M+",
      },
      {
        label: "Response Latency",
        value: "2s",
      },
      {
        label: "Corporate Clients",
        value: "500+",
      },
      {
        label: "Uptime SLA",
        value: "99.9%",
      },
    ],
    results: [
      {
        stat: "90%",
        title: "Reduction in Fraud",
        description:
          "Significant decrease in synthetic identity fraud for onboarding financial institutions.",
      },
      {
        stat: "70%",
        title: "Faster Onboarding",
        description:
          "Reduced customer onboarding time from an average of 48 hours to under 5 minutes.",
      },
      {
        stat: "60+",
        title: "Databases Integrated",
        description:
          "Consolidated access to over 60 diverse identity and financial databases across the region.",
      },
    ],
    techStack: [
      "React",
      "Node.js",
      "AWS Lambda",
      "MongoDB",
      "GraphQL",
      "Redis",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "API Design",
        description:
          "Architecting a developer-friendly REST and GraphQL API for seamless integration.",
      },
      {
        label: "Phase 2",
        title: "Security Hardening",
        description:
          "Implementing advanced encryption and zero-trust security models for data privacy.",
      },
      {
        label: "Phase 3",
        title: "Multi-Cloud Setup",
        description:
          "Deploying across multiple cloud regions to ensure global availability and redundancy.",
      },
      {
        label: "Phase 4",
        title: "SaaS Launch",
        description:
          "Onboarding the first wave of Tier-1 banks and fintech organizations to the ecosystem.",
      },
    ],
    faqs: [
      {
        question: "What databases are supported for verification?",
        answer:
          "We support National ID, Passport, Driver's License, Voter Card, and various financial credit bureaus.",
      },
      {
        question: "Is the platform GDPR compliant?",
        answer:
          "Yes, we adhere to GDPR and NDPR standards, ensuring all data is processed with user consent and strictly for verification.",
      },
      {
        question: "How easy is it to integrate the API?",
        answer:
          "Developers can go live in under an hour using our comprehensive SDKs and interactive documentation.",
      },
      {
        question: "What is your pricing model?",
        answer:
          "We offer a flexible pay-per-verification model with volume discounts for enterprise partners.",
      },
      {
        question: "Does the platform support international IDs?",
        answer:
          "Yes, we have expanded our reach to support identity documents from multiple African and European nations.",
      },
    ],
  },
  "sudan-civil-registry-digitization": {
    slug: "sudan-civil-registry-digitization",
    title: "Sudan Civil Registry Modernization",
    subtitle: "Nationwide Digital Transformation of Identity",
    category: "Cloud & DevOps",
    client: "Sudanese Ministry of Interior",
    duration: "36 Months",
    description:
      "A comprehensive digital overhaul of the Sudanese national civil registry, enabling secure identification and digital service delivery.",
    heroImage: "/assets/projects/sudan-civil-registry-digitization.jpg",
    overview:
      "The Sudanese government sought to modernize its paper-based civil records to improve governance and security. Seamfix spearheaded the digital transition, creating a centralized civil registry that tracks birth, marriage, death, and residency records for over 40 million citizens using advanced cloud technologies.",
    challenge:
      "Migrating decades of physical records into a digital format while ensuring accuracy and preventing data duplication was a monumental task. The system also had to be resilient against infrastructure challenges and perform reliably at a national scale.",
    solution:
      "We deployed a high-redundancy cloud infrastructure and developed a custom ETL (Extract, Transform, Load) pipeline for large-scale data digitization. The system integrated biometric deduplication to ensure the uniqueness of each citizen entry.",
    galleryImages: [
      "/assets/projects/sudan-civil-registry-digitization-gallery-1.jpg",
      "/assets/projects/sudan-civil-registry-digitization-gallery-2.jpg",
    ],
    features: [
      "Centralized Identity Database",
      "Automatic Duplicate Detection",
      "Secure Document Issuance",
      "Advanced Search Cryptography",
      "Inter-agency Data Sharing",
      "Scalable Microservices Core",
      "Citizen Self-Service Portal",
      "Offline Field Data Entry",
    ],
    metrics: [
      {
        label: "Digital Records",
        value: "30M+",
      },
      {
        label: "Efficiency Increase",
        value: "80%",
      },
      {
        label: "Digitized Offices",
        value: "200+",
      },
      {
        label: "Backend Availability",
        value: "99.9%",
      },
    ],
    results: [
      {
        stat: "100%",
        title: "Digital Transition",
        description:
          "Eliminated reliance on physical paper archives for all national civil status operations.",
      },
      {
        stat: "300%",
        title: "Faster Issuance",
        description:
          "Increased the speed of birth and marriage certificate issuance by over 300%.",
      },
      {
        stat: "40M",
        title: "Verified Identities",
        description:
          "Established a single source of truth for the identity of 40 million citizens.",
      },
    ],
    techStack: [
      "Go",
      "PostgreSQL",
      "GCP",
      "RabbitMQ",
      "Ansible",
      "ELK Stack",
      "React",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Digitization Setup",
        description:
          "Deployment of high-speed scanning and data entry centers across key administrative regions.",
      },
      {
        label: "Phase 2",
        title: "Infrastructure Migration",
        description:
          "Designing and deploying the high-availability Google Cloud Platform (GCP) architecture.",
      },
      {
        label: "Phase 3",
        title: "System Integration",
        description:
          "Consolidating regional databases into a single, unified national civil registry.",
      },
      {
        label: "Phase 4",
        title: "Capacity Building",
        description:
          "Extensive training for 2,000+ government officials on digital record management and security.",
      },
    ],
    faqs: [
      {
        question: "Is the registry accessible by other government bodies?",
        answer:
          "Yes, secure APIs allow authorized agencies, such as the Ministry of Health, to access relevant records.",
      },
      {
        question: "How is the data backed up?",
        answer:
          "We utilize multi-regional geographic redundancy with automated daily backups and point-in-time recovery.",
      },
      {
        question: "Does the system handle historical records?",
        answer:
          "Yes, the platform includes modules specifically designed for the digitisation and indexing of legacy paper records.",
      },
      {
        question: "What security measures are in place?",
        answer:
          "The platform uses role-based access control (RBAC), audit trails, and data-at-rest encryption.",
      },
      {
        question: "How long does a record search take?",
        answer:
          "Even with 40 million records, searches are typically completed in under 500 milliseconds using advanced indexing.",
      },
    ],
  },
  "module-academy": {
    slug: "module-academy",
    title: "Module Academy",
    subtitle: "Empowering the Next Generation of Tech Talents",
    category: "Web Development",
    client: "Enyata Academy",
    duration: "6 Months",
    description:
      "A comprehensive internship management and talent development platform designed to bridge the gap between education and industry.",
    heroImage: "/assets/projects/module-academy.jpg",
    overview:
      "Module is an end-to-end learning management system designed to automate the training, assessment, and placement of software engineering interns. It provides a structured pathway for learners and robust tracking for administrators.",
    challenge:
      "Scaling physical internship programs proved difficult due to disjointed tracking systems and a lack of standardized assessment tools for a growing number of remote participants.",
    solution:
      "We engineered a custom EdTech platform that automates curriculum delivery, offers real-time performance feedback through interactive coding sandboxes, and leverages AI to match top-performing graduates with global industry opportunities.",
    galleryImages: [
      "/assets/projects/module-academy-gallery-1.jpg",
      "/assets/projects/module-academy-gallery-2.jpg",
    ],
    features: [
      "Automated curriculum delivery",
      "Mentor-mentee matching engine",
      "Real-time progress analytics",
      "Interactive coding sandboxes",
      "Peer-to-peer review system",
      "Enterprise talent matching",
      "Dynamic certificate generation",
      "Skill gap analysis tools",
    ],
    metrics: [
      {
        label: "Active Learners",
        value: "10,000+",
      },
      {
        label: "Completion Rate",
        value: "92%",
      },
      {
        label: "Mentor Ratio",
        value: "1:5",
      },
      {
        label: "Hiring Increase",
        value: "30%",
      },
    ],
    results: [
      {
        stat: "10,000+",
        title: "Active Learners",
        description:
          "Successfully onboarded and trained thousands of engineers across the African continent.",
      },
      {
        stat: "92%",
        title: "Placement Rate",
        description:
          "Graduates secured roles within top-tier tech firms within 3 months of program completion.",
      },
      {
        stat: "40%",
        title: "Process Efficiency",
        description:
          "Reduced administrative overhead for program managers through automated grading and reporting.",
      },
    ],
    techStack: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS Lambda",
      "Redis",
      "Tailwind CSS",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "User Journey Mapping",
        description:
          "Defining core personas and learning pathways for students, mentors, and program administrators.",
      },
      {
        label: "Phase 2",
        title: "Interface Prototyping",
        description:
          "Creating a high-fidelity, distraction-free UX focused on technical education and coding efficiency.",
      },
      {
        label: "Phase 3",
        title: "Core Platform Build",
        description:
          "Architecting a robust, scalable backend to handle concurrent coding assessments and data processing.",
      },
      {
        label: "Phase 4",
        title: "Beta Pilot Launch",
        description:
          "Executing a pilot program with 500 students to stress-test the infrastructure and gather user feedback.",
      },
    ],
    faqs: [
      {
        question: "Is the platform open to external organizations?",
        answer:
          "Yes, Module is now available as a white-label solution for corporate training and internal upskilling programs.",
      },
      {
        question: "How does the mentor matching work?",
        answer:
          "Our proprietary algorithm pairs mentors with mentees based on specific skill alignment and overlapping time zones.",
      },
      {
        question: "Does it support mobile learning?",
        answer:
          "The platform features a fully responsive dashboard for progress tracking, though coding exercises are optimized for desktop.",
      },
      {
        question: "What coding languages are supported?",
        answer:
          "The automated assessment engine currently supports JavaScript, Python, Go, Java, and Ruby.",
      },
      {
        question: "Can I track multiple cohorts simultaneously?",
        answer:
          "Yes, administrators have access to a master dashboard to manage and compare multiple concurrent cohorts.",
      },
    ],
  },
  "kash-fintech": {
    slug: "kash-fintech",
    title: "Kash Fintech",
    subtitle: "Financial Inclusion Through Smart Savings",
    category: "Mobile Development",
    client: "Kash Africa",
    duration: "8 Months",
    description:
      "A secure and user-centric mobile application enabling simplified savings, investment, and wealth management for the African market.",
    heroImage: "/assets/projects/kash-fintech.jpg",
    overview:
      "Kash is a mobile-first wealth management platform that encourages healthy financial habits through automated savings, goal tracking, and access to diversified low-risk investment options.",
    challenge:
      "High inflation rates and a lack of accessible investment vehicles made it difficult for common citizens to preserve wealth and build long-term savings.",
    solution:
      "We developed a secure mobile app with military-grade encryption that offers automated fund round-ups, instant withdrawals, and AI-driven personalized financial advice.",
    galleryImages: [
      "/assets/projects/kash-fintech-gallery-1.jpg",
      "/assets/projects/kash-fintech-gallery-2.jpg",
    ],
    features: [
      "High-yield savings accounts",
      "Automated investment portfolios",
      "Biometric MFA security",
      "Real-time market data sync",
      "Peer-to-peer money transfers",
      "Goal-based savings plans",
      "AI financial advisor",
      "Multi-currency wallet support",
    ],
    metrics: [
      {
        label: "Active Learners",
        value: "10,000+",
      },
      {
        label: "Completion Rate",
        value: "92%",
      },
      {
        label: "Mentor Ratio",
        value: "1:5",
      },
      {
        label: "Hiring Increase",
        value: "30%",
      },
    ],
    results: [
      {
        stat: "100%",
        title: "Digital Transition",
        description:
          "Eliminated reliance on physical paper archives for all national civil status operations.",
      },
      {
        stat: "300%",
        title: "Faster Issuance",
        description:
          "Increased the speed of birth and marriage certificate issuance by over 300%.",
      },
      {
        stat: "40M",
        title: "Verified Identities",
        description:
          "Established a single source of truth for the identity of 40 million citizens.",
      },
    ],
    techStack: [
      "Flutter",
      "Firebase",
      "Node.js",
      "MongoDB",
      "Kubernetes",
      "Stripe API",
      "Google Cloud",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Compliance Audit",
        description:
          "Ensuring all financial data handling met strict international and local regulatory banking standards.",
      },
      {
        label: "Phase 2",
        title: "Ledger Development",
        description:
          "Architecting the core engine for real-time transaction processing and automated interest accrual.",
      },
      {
        label: "Phase 3",
        title: "Mobile UX Design",
        description:
          "Building the iOS and Android versions using a unified Flutter codebase for feature parity and speed.",
      },
      {
        label: "Phase 4",
        title: "Market Entry",
        description:
          "Launch of aggressive user acquisition campaigns supported by real-time performance analytics.",
      },
    ],
    faqs: [
      {
        question: "Is my data safe with Kash?",
        answer:
          "We employ 256-bit AES encryption and multi-factor authentication to ensure your data and funds are fully protected.",
      },
      {
        question: "Can I withdraw my money at any time?",
        answer:
          "Yes, our instant withdrawal feature ensures you have 24/7 access to your savings with no lock-in penalties.",
      },
      {
        question: "Are there any account maintenance fees?",
        answer:
          "Kash operates on a transparent fee-free model with no hidden monthly or annual maintenance charges.",
      },
      {
        question: "What are the investment options?",
        answer:
          "Users can choose between low-risk treasury bills, diversified mutual funds, and dollar-denominated assets.",
      },
      {
        question: "How do I verify my identity?",
        answer:
          "Our automated KYC system verifies government-issued IDs and faces in under 60 seconds.",
      },
    ],
  },
  "altmall-ecommerce": {
    slug: "altmall-ecommerce",
    title: "AltMall Marketplace",
    subtitle: "Credit-Powered E-commerce for Modern Consumers",
    category: "Web Development",
    client: "Sterling Bank PLC",
    duration: "12 Months",
    description:
      "An innovative e-commerce solution that leverages banking infrastructure to provide users with a Buy Now, Pay Later shopping experience.",
    heroImage: "/assets/projects/altmall-ecommerce.jpg",
    overview:
      "AltMall is a premium alternative marketplace that empowers customers to own high-value items immediately while spreading payments over flexible installment plans.",
    challenge:
      "Traditional e-commerce platforms lacked integrated financing solutions, leading to extremely high cart abandonment for electronics and home appliances.",
    solution:
      "We integrated a proprietary credit scoring engine directly into the checkout flow, enabling real-time approval of installment plans based on banking data.",
    galleryImages: [
      "/assets/projects/altmall-ecommerce-gallery-1.jpg",
      "/assets/projects/altmall-ecommerce-gallery-2.jpg",
    ],
    features: [
      "Buy Now Pay Later (BNPL)",
      "Real-time credit assessment",
      "Verified vendor portal",
      "Automated installment plans",
      "Legacy bank API integration",
      "Robust order fulfillment",
      "AI marketing automation",
      "Advanced fraud detection",
    ],
    metrics: [
      {
        label: "Sales Growth",
        value: "50%",
      },
      {
        label: "Credit Check",
        value: "<50ms",
      },
      {
        label: "Monthly Orders",
        value: "15,000+",
      },
      {
        label: "Vendor Network",
        value: "100+",
      },
    ],
    results: [
      {
        stat: "300%",
        title: "Sales Growth",
        description:
          "Experienced massive growth in transaction volume compared to traditional non-financed purchase models.",
      },
      {
        stat: "<50ms",
        title: "Credit Approval",
        description:
          "Achieved near-instantaneous credit evaluation through optimized financial API integrations.",
      },
      {
        stat: "15,000+",
        title: "Monthly Revenue",
        description:
          "Built a loyal community of shoppers using the platform for recurring high-ticket electronics purchases.",
      },
    ],
    techStack: [
      "Vue.js",
      "PHP Laravel",
      "MySQL",
      "Azure Cloud",
      "ElasticSearch",
      "RabbitMQ",
      "Sentry",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Bank API Integration",
        description:
          "Establishing secure, low-latency tunnels to the core banking system for instant account validation.",
      },
      {
        label: "Phase 2",
        title: "Marketplace Development",
        description:
          "Building a high-performance portal for vendors to manage large-scale inventory and logistics.",
      },
      {
        label: "Phase 3",
        title: "Credit Logic Engine",
        description:
          "Implementing complex financial algorithms for risk assessment and automated interest calculation.",
      },
      {
        label: "Phase 4",
        title: "Performance Tuning",
        description:
          "Enhancing front-end load times and mobile responsiveness for a seamless, conversion-focused UI.",
      },
    ],
    faqs: [
      {
        question: "Who qualifies for credit on AltMall?",
        answer:
          "Any user with a verified bank account and consistent income profile can apply for financing on the platform.",
      },
      {
        question: "What categories of products are available?",
        answer:
          "AltMall features premium electronics, smartphones, household appliances, and office furniture.",
      },
      {
        question: "How are installment plans calculated?",
        answer:
          "Plans are based on the product value, the chosen term length, and your individual credit risk profile.",
      },
      {
        question: "Is a down payment always required?",
        answer:
          "While most items are zero-down, some high-value products may require a minimal initial deposit.",
      },
      {
        question: "How fast is product delivery?",
        answer:
          "Orders are typically processed and delivered within 3-5 business days once the credit plan is approved.",
      },
    ],
  },
  "bento-payroll-hr": {
    slug: "bento-payroll-hr",
    title: "Bento Africa",
    subtitle: "Revolutionizing Payroll and HR for a Digital Continent",
    category: "AI & Automation",
    client: "Bento Africa",
    duration: "10 Months",
    description:
      "Scalable cloud infrastructure and mobile interface development for a leading payroll and HR management system serving pan-African businesses.",
    heroImage: "/assets/projects/bento-payroll-hr.jpg",
    overview:
      "Bento is a sophisticated enterprise HR platform that automates complex payroll, tax compliance, and benefit management tasks through a unified cloud interface.",
    challenge:
      "Managing taxes, pensions, and varying labor laws across multiple African borders was a manual, error-prone process for growing enterprises.",
    solution:
      "We developed a cloud-native platform that automates statutory deductions and offers deep HR analytics via a robust API-first architecture.",
    galleryImages: [
      "/assets/projects/bento-payroll-hr-gallery-1.jpg",
      "/assets/projects/bento-payroll-hr-gallery-2.jpg",
    ],
    features: [
      "Automated payroll engine",
      "Statutory tax compliance",
      "Self-service HR portal",
      "Leave management flows",
      "Multi-currency support",
      "Bulk payment processing",
      "Direct bank connectivity",
      "Workforce analytics suite",
    ],
    metrics: [
      {
        label: "System Uptime",
        value: "99.95%",
      },
      {
        label: "Companies Served",
        value: "1,500+",
      },
      {
        label: "Compliance Score",
        value: "99.9%",
      },
      {
        label: "HR Efficiency",
        value: "50%+",
      },
    ],
    results: [
      {
        stat: "99.99%",
        title: "System Reliability",
        description:
          "Maintained flawless uptime for critical payroll cycles across multiple enterprise customers.",
      },
      {
        stat: "1,500+",
        title: "Enterprises Scaled",
        description:
          "Successfully transitioned hundreds of legacy businesses to a modern, digital workforce management system.",
      },
      {
        stat: "50%+",
        title: "Reduced Overhead",
        description:
          "Eliminated manual filing and compliance errors, reducing HR administrative costs by over 50%.",
      },
    ],
    techStack: [
      "React Native",
      "Go",
      "Python",
      "PostgreSQL",
      "AWS Infrastructure",
      "Terraform",
      "Datadog",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Cloud Infrastructure",
        description:
          "Designing a secure, auto-scaling AWS environment capable of handling high-volume batch processing.",
      },
      {
        label: "Phase 2",
        title: "Payroll Computation",
        description:
          "Coding the logic for complex tax tables and statutory contribution calculations across multiple regions.",
      },
      {
        label: "Phase 3",
        title: "Enterprise HR Portal",
        description:
          "Developing the comprehensive interface for employee records, leave management, and performance tracking.",
      },
      {
        label: "Phase 4",
        title: "Bank Disbursement",
        description:
          "Finalizing API integrations with major regional banks for direct, automated salary disbursements.",
      },
    ],
    faqs: [
      {
        question: "Can Bento handle multi-currency payroll?",
        answer:
          "Yes, the platform fully supports multiple currencies to facilitate seamless cross-border salary payments.",
      },
      {
        question: "Is statutory tax filing included?",
        answer:
          "Bento automatically calculates and generates all required reports for local tax and pension authorities.",
      },
      {
        question: "How secure is our company data?",
        answer:
          "We utilize bank-level 256-bit encryption and strict SoC-2 data privacy protocols for all enterprise data.",
      },
      {
        question: "Does it integrate with existing ERPs?",
        answer:
          "Bento offers a robust REST API for seamless integration with platforms like SAP, Oracle, and Microsoft Dynamics.",
      },
      {
        question: "Can employees access their own slips?",
        answer:
          "Yes, every employee gets a secure personal portal to download pay slips and manage their own leave requests.",
      },
    ],
  },
  "github-scaling-engineering-acceleration": {
    slug: "github-scaling-engineering-acceleration",
    title: "Global Engineering Scale-Up",
    subtitle:
      "Hyper-growth engineering support for the world's largest developer platform.",
    category: "Cloud & DevOps",
    client: "GitHub",
    duration: "18 Months",
    description:
      "GitHub collaborated with Andela to rapidly expand its engineering capabilities, focusing on platform reliability, infrastructure scalability, and feature velocity during peak global growth periods.",
    heroImage: "/assets/projects/github-scaling-engineering-acceleration.jpg",
    overview:
      "As GitHub's user base surged, their internal teams faced challenges in keeping pace with feature demands while maintaining 99.9% availability. Andela provided a specialized squad of senior engineers to integrate directly into GitHub's core product teams.",
    challenge:
      "Scaling a distributed system that supports millions of developers requires specialized knowledge in Ruby on Rails, Go, and massive-scale database architecture. GitHub needed engineers who could contribute immediately without extensive onboarding.",
    solution:
      "Andela deployed a team of 25+ senior software engineers across various time zones. These engineers focused on refactoring legacy monoliths into microservices, optimizing CI/CD pipelines, and implementing advanced monitoring solutions.",
    galleryImages: [
      "/assets/projects/github-scaling-engineering-acceleration-gallery-1.jpg",
      "/assets/projects/github-scaling-engineering-acceleration-gallery-2.jpg",
    ],
    features: [
      "Core Monolith Refactoring",
      "High-Performance Go Microservices",
      "CI/CD Pipeline Optimization",
      "Advanced Kubernetes Orchestration",
      "Distributed Systems Monitoring",
      "Automated Security Patching",
      "Global Load Balancing Strategy",
      "Real-time Data Sync Architecture",
    ],
    metrics: [
      {
        label: "Hiring Speed",
        value: "40% Faster",
      },
      {
        label: "Engineers Embedded",
        value: "25+",
      },
      {
        label: "Commit Velocity",
        value: "15% Up",
      },
      {
        label: "Platform Uptime",
        value: "99.95%",
      },
    ],
    results: [
      {
        stat: "2x",
        title: "Deployment Frequency",
        description:
          "Enabled teams to move from weekly deployments to daily production releases through automated testing.",
      },
      {
        stat: "35%",
        title: "Latency Reduction",
        description:
          "Optimized database queries and caching layers, leading to significant performance gains across the platform.",
      },
      {
        stat: "100%",
        title: "Role Integration",
        description:
          "Andela engineers were fully integrated into GitHub's internal culture, participating in all strategic planning sessions.",
      },
    ],
    techStack: [
      "Ruby on Rails",
      "Go (Golang)",
      "React.js",
      "Kubernetes",
      "PostgreSQL",
      "Docker",
      "GraphQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Talent Alignment",
        description:
          "Rigorous vetting and matching of senior engineers based on GitHub's specific technology stack and culture.",
      },
      {
        label: "Phase 2",
        title: "Team Integration",
        description:
          "Seamless onboarding and embedding of Andela engineers into existing functional product squads.",
      },
      {
        label: "Phase 3",
        title: "Velocity Optimization",
        description:
          "Implementation of process improvements and infrastructure refactoring to accelerate feature delivery cycles.",
      },
      {
        label: "Phase 4",
        title: "Sustained Scale",
        description:
          "Ongoing management and scaling of the partnership to support long-term product roadmap goals.",
      },
    ],
    faqs: [
      {
        question: "How were the engineers selected?",
        answer:
          "Engineers underwent a multi-stage technical assessment and cultural fit interview tailored to GitHub's high standards.",
      },
      {
        question: "What was the communication structure?",
        answer:
          "Andela engineers operated as full-time GitHub employees, participating in daily stand-ups and using standard internal tools.",
      },
      {
        question: "Did they handle sensitive data?",
        answer:
          "Yes, all engineers followed strict security protocols and utilized GitHub's enterprise-grade secure development environments.",
      },
      {
        question: "How was time zone overlap managed?",
        answer:
          "We ensured a minimum of 6 hours of synchronous working time by selecting engineers from compatible geographic regions.",
      },
      {
        question: "What was the primary focus of the partnership?",
        answer:
          "The focus was on scaling the core platform while maintaining high reliability and developer experience standards.",
      },
    ],
  },
  "viacomcbs-paramount-plus-transformation": {
    slug: "viacomcbs-paramount-plus-transformation",
    title: "Streaming Platform Transformation",
    subtitle:
      "Accelerating global launch and feature parity for Paramount+ streaming service.",
    category: "Web Development",
    client: "ViacomCBS",
    duration: "24 Months",
    description:
      "ViacomCBS leveraged Andela's talent network to accelerate the development of Paramount+, ensuring a seamless transition and global rollout of their premium streaming service.",
    heroImage: "/assets/projects/viacomcbs-paramount-plus-transformation.jpg",
    overview:
      "The shift from traditional broadcast to digital streaming required a massive pivot in engineering resources. ViacomCBS needed to build high-concurrency architectures capable of handling 50M+ subscribers.",
    challenge:
      "Building a global streaming service involves complex video encoding, regional content licensing logic, and high-availability payment systems across multiple platforms and devices.",
    solution:
      "Andela provided specialized full-stack and mobile developers who specialized in Java, React, and cloud-native streaming protocols to build out the front-end and back-end of the Paramount+ ecosystem.",
    galleryImages: [
      "/assets/projects/viacomcbs-paramount-plus-transformation-gallery-1.jpg",
      "/assets/projects/viacomcbs-paramount-plus-transformation-gallery-2.jpg",
    ],
    features: [
      "Global Content CMS",
      "Low-Latency Video Playback",
      "Dynamic Ad Insertion Engine",
      "Multi-Region Cloud Deployment",
      "User Preference Profiling",
      "Predictive Content Delivery",
      "Subscription Billing Logic",
      "Cross-Platform Video Resilience",
    ],
    metrics: [
      {
        label: "Active Users",
        value: "35M+",
      },
      {
        label: "Feature Velocity",
        value: "50% Faster",
      },
      {
        label: "Streaming Uptime",
        value: "99.95%",
      },
      {
        label: "Global Reach",
        value: "25+ Countries",
      },
    ],
    results: [
      {
        stat: "30%",
        title: "Churn Reduction",
        description:
          "Improved recommendation engine and UX led to significantly higher user retention rates during the first year.",
      },
      {
        stat: "10M+",
        title: "Concurrent Streams",
        description:
          "Successfully managed record-breaking traffic during major live sporting events like the Super Bowl.",
      },
      {
        stat: "6 Months",
        title: "Market Entry",
        description:
          "Accelerated the rollout of localized platforms in international markets by six months ahead of schedule.",
      },
    ],
    techStack: [
      "Java",
      "Spring Boot",
      "React.js",
      "AWS",
      "Node.js",
      "Redis",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Architecture Planning",
        description:
          "Collaborative design of a highly scalable, multi-region streaming architecture using microservices.",
      },
      {
        label: "Phase 2",
        title: "Core Platform Build",
        description:
          "Rapid development of the central video management system and global user authentication layers.",
      },
      {
        label: "Phase 3",
        title: "Global Feature Rollout",
        description:
          "Incremental deployment of features like offline viewing, parental controls, and multi-profile support.",
      },
      {
        label: "Phase 4",
        title: "Performance Tuning",
        description:
          "Rigorous load testing and cache optimization to handle extreme peak traffic during global events.",
      },
    ],
    faqs: [
      {
        question: "How did you handle video latency?",
        answer:
          "By implementing a robust edge-caching strategy and optimizing the CDN configuration for different global regions.",
      },
      {
        question: "What was the team composition?",
        answer:
          "The team consisted of 40% backend specialists, 30% frontend developers, and 30% DevOps engineers.",
      },
      {
        question: "How was content security managed?",
        answer:
          "We implemented enterprise-grade DRM (Digital Rights Management) systems and secure token-based authentication.",
      },
      {
        question: "Was the partnership ongoing?",
        answer:
          "Yes, the partnership evolved from initial launch support to long-term feature innovation and maintenance.",
      },
      {
        question: "How did you handle localized content?",
        answer:
          "We built a metadata-driven CMS that dynamically switches content based on user location and licensing rules.",
      },
    ],
  },
  "coursera-ai-learning-optimization": {
    slug: "coursera-ai-learning-optimization",
    title: "AI-Driven Learning Experience",
    subtitle:
      "Optimizing educational outcomes through data-driven platform enhancement.",
    category: "AI & Data",
    client: "Coursera",
    duration: "12 Months",
    description:
      "Andela partnered with Coursera to enhance their digital learning platform using advanced data engineering and AI-driven personalization techniques.",
    heroImage: "/assets/projects/coursera-ai-learning-optimization.jpg",
    overview:
      "Coursera aimed to improve student completion rates by providing a more personalized and interactive learning journey. They needed data experts to refine their machine learning models.",
    challenge:
      "Analyzing billions of learning data points to provide real-time feedback and accurate course recommendations across a library of thousands of courses.",
    solution:
      "Andela embedded a team of senior data scientists and machine learning engineers to build predictive models that identify at-risk students and recommend intervention strategies.",
    galleryImages: [
      "/assets/projects/coursera-ai-learning-optimization-gallery-1.jpg",
      "/assets/projects/coursera-ai-learning-optimization-gallery-2.jpg",
    ],
    features: [
      "Predictive Success Models",
      "Personalized Learning Paths",
      "Automated Grading Systems",
      "Student Risk Assessment",
      "Real-time Recommendation Engine",
      "Data Pipeline Modernization",
      "Behavioral Analytics Dashboard",
      "MLOps Infrastructure Setup",
    ],
    metrics: [
      {
        label: "Completion Rate",
        value: "20% Increase",
      },
      {
        label: "ML Accuracy",
        value: "30% Improvement",
      },
      {
        label: "Data Sample Size",
        value: "35M+ Records",
      },
      {
        label: "Model Latency",
        value: "100ms",
      },
    ],
    results: [
      {
        stat: "15%",
        title: "Revenue Growth",
        description:
          "Direct correlation between personalized recommendations and increased enrollment in professional certificates.",
      },
      {
        stat: "50%",
        title: "Operational Efficiency",
        description:
          "Automated grading and assessment workflows reduced administrative overhead for partner universities.",
      },
      {
        stat: "5M+",
        title: "New Students",
        description:
          "Improved platform performance supported the onboarding of millions of new learners in emerging markets.",
      },
    ],
    techStack: [
      "Scala",
      "Python",
      "PyTorch",
      "Apache Spark",
      "React.js",
      "AWS SageMaker",
      "SQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Data Audit",
        description:
          "Deep dive into existing data structures and identification of key performance indicators for model training.",
      },
      {
        label: "Phase 2",
        title: "Model Development",
        description:
          "Training and validation of new recommendation algorithms using historical student behavior data.",
      },
      {
        label: "Phase 3",
        title: "Integration & Testing",
        description:
          "A/B testing of personalized elements against the baseline platform to measure direct impact on completion.",
      },
      {
        label: "Phase 4",
        title: "Continuous Refinement",
        description:
          "Implementation of automated feedback loops to constantly improve model accuracy based on new user data.",
      },
    ],
    faqs: [
      {
        question: "What kind of data was used for the models?",
        answer:
          "Anonymized behavioral data including course engagement, quiz performance, and time-on-page metrics.",
      },
      {
        question: "How was student privacy protected?",
        answer:
          "All models were trained on strictly anonymized datasets following global data privacy regulations (GDPR/CCPA).",
      },
      {
        question: "Did the AI replace human instructors?",
        answer:
          "No, it assisted instructors by highlighting students who needed extra help and automating routine assessments.",
      },
      {
        question: "What was the biggest technical hurdle?",
        answer:
          "Scaling the realtime recommendation engine to handle traffic spikes during new course launches.",
      },
      {
        question: "Was the model specific to certain subjects?",
        answer:
          "No, the underlying architecture was built to be course-agnostic and applicable to any instructional content.",
      },
    ],
  },
  "mastercard-global-fintech-infrastructure": {
    slug: "mastercard-global-fintech-infrastructure",
    title: "Next-Gen Fintech Infrastructure",
    subtitle:
      "Building secure, high-performance financial systems for a cashless world.",
    category: "Mobile Development",
    client: "Mastercard",
    duration: "20 Months",
    description:
      "Andela collaborated with Mastercard to develop innovative mobile payment solutions and secure infrastructure to expand digital financial services in emerging markets.",
    heroImage: "/assets/projects/mastercard-global-fintech-infrastructure.jpg",
    overview:
      "Mastercard needed to accelerate the development of its digital wallet and payment gateway APIs to better serve customers in mobile-first economies.",
    challenge:
      "The financial sector requires zero-tolerance for errors, extremely low latency, and adherence to complex international security standards (PCI-DSS).",
    solution:
      "Andela provided a specialized group of security and mobile engineers who worked on building robust mobile SDKs and high-performance backend transaction layers.",
    galleryImages: [
      "/assets/projects/mastercard-global-fintech-infrastructure-gallery-1.jpg",
      "/assets/projects/mastercard-global-fintech-infrastructure-gallery-2.jpg",
    ],
    features: [
      "Secure Tokenization Engine",
      "Contactless Payment SDKs",
      "Real-time Fraud Detection",
      "Cross-Border Settlement Logic",
      "Encrypted Digital Identity",
      "High-Volume Transaction Processing",
      "Financial Compliance Automation",
      "Biometric Auth Integration",
    ],
    metrics: [
      {
        label: "Fraud Rate",
        value: "0.01% Decrease",
      },
      {
        label: "API Latency",
        value: "200ms",
      },
      {
        label: "Transaction Count",
        value: "5M+ Monthly",
      },
      {
        label: "System Vetting",
        value: "99.9% Compliant",
      },
    ],
    results: [
      {
        stat: "60%",
        title: "Time-to-Market",
        description:
          "Reduced the development cycle for new mobile payment features by leveraging pre-vetted senior talent.",
      },
      {
        stat: "99.999%",
        title: "Service Availability",
        description:
          "Maintained mission-critical uptime for national payment infrastructures across multiple emerging markets.",
      },
      {
        stat: "22",
        title: "Global Patents",
        description:
          "Collaborative engineering work led to several innovative payment mechanisms now patented by Mastercard.",
      },
    ],
    techStack: [
      "Java",
      "Swift/Kotlin",
      "Node.js",
      "C++",
      "PostgreSQL",
      "Blockchain",
      "Azure",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Security Assessment",
        description:
          "Baseline security audit and alignment on global financial regulatory requirements.",
      },
      {
        label: "Phase 2",
        title: "SDK Prototype",
        description:
          "Development of the initial mobile SDKs for secure contactless payments in selected pilot markets.",
      },
      {
        label: "Phase 3",
        title: "Integration & Scale",
        description:
          "Migration of existing payment layers to the new high-performance cloud infrastructure.",
      },
      {
        label: "Phase 4",
        title: "Global Compliance",
        description:
          "Final hardening and certification against international security standards for broad market release.",
      },
    ],
    faqs: [
      {
        question: "How was payment security ensured?",
        answer:
          "By implementing hardware-level encryption and advanced tokenization techniques at every stage of the transaction.",
      },
      {
        question: "What markets were the focus?",
        answer:
          "The partnership primarily focused on expanding financial inclusion in Africa, Southeast Asia, and Latin America.",
      },
      {
        question: "Did you use blockchain technology?",
        answer:
          "Yes, certain cross-border settlement features utilized private blockchain ledgers for immutable transaction logging.",
      },
      {
        question: "What was the role of Andela engineers?",
        answer:
          "Andela engineers led the development of critical mobile SDKs and back-end security protocols.",
      },
      {
        question: "How did you handle different currencies?",
        answer:
          "We built a real-time exchange and settlement engine that handles 150+ currencies with sub-second latency.",
      },
    ],
  },
  "western-union-digital-transformation": {
    slug: "western-union-digital-transformation",
    title: "Western Union Global Digital Modernization",
    subtitle: "Reengineering cross-border payments for a mobile-first world",
    category: "Financial Services",
    client: "Western Union",
    duration: "18 Months",
    description:
      "Western Union partnered with Spire Digital to overhaul their digital transfer ecosystem, focusing on reducing friction in cross-border transactions and scaling their mobile presence to over 200 countries and territories.",
    heroImage: "/assets/projects/western-union-digital-transformation.jpg",
    overview:
      "Moving billions of dollars across the globe requires more than just code; it requires a deep understanding of international compliance, high-availability architecture, and user trust. Spire led the design and development of the next-generation Western Union mobile app and web portal.",
    challenge:
      "The primary challenge was modernizing a complex legacy infrastructure while ensuring zero downtime for millions of daily users. The system needed to handle volatile currency exchange rates and varying regional regulatory requirements with sub-second latency.",
    solution:
      "We implemented a microservices-based architecture focused on performance and security. By leveraging Biometric Authentication and a revamped state-management system, we created a seamless flow that reduced transaction time by 35%.",
    galleryImages: [
      "/assets/projects/western-union-digital-transformation-gallery-1.jpg",
      "/assets/projects/western-union-digital-transformation-gallery-2.jpg",
    ],
    features: [
      "Real-time Currency Exchange APIs",
      "Biometric Security Integration",
      "Multi-language Localization Engine",
      "Advanced Fraud Detection Algorithms",
      "Cross-platform Transaction Tracking",
      "Interactive Global Agent Map",
      "QR Code Payment Integration",
      "Seamless Bank-to-Wallet Transfers",
    ],
    metrics: [
      {
        label: "Mobile Transfers",
        value: "+42%",
      },
      {
        label: "Processing Speed",
        value: "2.4s",
      },
      {
        label: "User Retention",
        value: "78%",
      },
      {
        label: "Global Reach",
        value: "200+",
      },
    ],
    results: [
      {
        stat: "40%",
        title: "Transaction Growth",
        description:
          "Experienced a significant surge in digital transaction volume within the first quarter post-launch.",
      },
      {
        stat: "3.5m",
        title: "Active Users",
        description:
          "Successfully migrated and onboarded millions of users to the new high-performance platform.",
      },
      {
        stat: "Top 5",
        title: "App Store Ranking",
        description:
          "Maintained a consistent top-tier position in the Financial Services category across global app stores.",
      },
    ],
    techStack: [
      "React Native",
      "Node.js",
      "AWS Lambda",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Strategic Discovery",
        description:
          "Global stakeholder interviews and legacy system auditing to map out the modernization roadmap.",
      },
      {
        label: "Phase 2",
        title: "UX Archetype Research",
        description:
          "Conducting user testing across key demographic hubs to define a universal design language.",
      },
      {
        label: "Phase 3",
        title: "Core Infrastructure Build",
        description:
          "Development of the high-availability API gateway and transaction processing engine.",
      },
      {
        label: "Phase 4",
        title: "Global Rollout",
        description:
          "Staged deployment across 200 markets with localized regulatory compliance testing.",
      },
    ],
    faqs: [
      {
        question: "How did you handle diverse global payment regulations?",
        answer:
          "We built a modular compliance engine that dynamically applies rules based on the user's geo-location and transaction destination.",
      },
      {
        question: "What was the strategy for offline functionality?",
        answer:
          "The app utilizes advanced local caching to allow users to start transaction drafts and search for agent locations without an active connection.",
      },
      {
        question: "How was security prioritized in this build?",
        answer:
          "We implemented end-to-end encryption for all PII data and integrated multi-layer biometric checks at critical transaction points.",
      },
      {
        question: "Did the redesign affect legacy user behavior?",
        answer:
          "User testing guided a 'progressive transition' UI that introduced new features without alienating long-term customers.",
      },
      {
        question: "How does the platform scale during peak seasons?",
        answer:
          "The serverless backend automatically scales instances to handle 10x traffic spikes during global holiday periods.",
      },
    ],
  },
  "tomtom-navigation-redesign": {
    slug: "tomtom-navigation-redesign",
    title: "TomTom Go Navigation Ecosystem",
    subtitle:
      "A premium mobile experience for the future of connected mobility",
    category: "Mobile Development",
    client: "TomTom",
    duration: "12 Months",
    description:
      "Spire Digital worked with TomTom to redefine their mobile navigation experience, creating a sophisticated interface that integrates real-time traffic data, offline mapping, and a premium editorial design.",
    heroImage: "/assets/projects/tomtom-navigation-redesign.jpg",
    overview:
      "In a market dominated by free mapping tools, TomTom needed a premium application that justified its subscription model through superior data visualization, accurate lane guidance, and an intuitive driving-focused UI.",
    challenge:
      "The complexity lay in rendering high-fidelity 3D maps while maintaining perfectly smooth frame rates on mobile devices, all while consuming massive streams of real-time traffic and hazard data.",
    solution:
      "We developed a specialized rendering engine optimized for vector tiles and implemented a predictive caching layer that anticipates a driver's route to prevent navigation lag.",
    galleryImages: [
      "/assets/projects/tomtom-navigation-redesign-gallery-1.jpg",
      "/assets/projects/tomtom-navigation-redesign-gallery-2.jpg",
    ],
    features: [
      "Real-time Vector Tile Rendering",
      "Predictive Traffic Analysis",
      "Incremental Offline Map Updates",
      "Dynamic Lane Assistance HUD",
      "Low-Light Vision Night Mode",
      "Eco-Route Optimization",
      "Voice-Activated Control System",
      "Speed Camera Alert Integration",
    ],
    metrics: [
      {
        label: "Active Users",
        value: "5M+",
      },
      {
        label: "Frame Rate",
        value: "60 FPS",
      },
      {
        label: "Data Usage",
        value: "-30%",
      },
      {
        label: "App Rating",
        value: "4.7/5",
      },
    ],
    results: [
      {
        stat: "25%",
        title: "Renewal Rate Increase",
        description:
          "The redesigned UI led to a significant jump in annual subscription renewals.",
      },
      {
        stat: "15ms",
        title: "Processing Latency",
        description:
          "Achieved ultra-low latency for real-time traffic rerouting and hazard updates.",
      },
      {
        stat: "92%",
        title: "User Satisfaction",
        description:
          "Direct user feedback indicated high levels of satisfaction with the new simplified interface.",
      },
    ],
    techStack: [
      "Kotlin",
      "Swift",
      "C++ Core",
      "OpenGL ES",
      "Mapbox GL",
      "GraphQL",
      "Fastly Edge",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Performance Benchmarking",
        description:
          "Analyzing rendering bottlenecks in existing navigation engines to set performance targets.",
      },
      {
        label: "Phase 2",
        title: "Safety-First UI Design",
        description:
          "Building high-contrast, large-target interfaces designed for one-handed operation during stops.",
      },
      {
        label: "Phase 3",
        title: "Data Stream Integration",
        description:
          "Aggregating millions of anonymous GPS probes to power the real-time traffic visualization.",
      },
      {
        label: "Phase 4",
        title: "Optimization Sprint",
        description:
          "Final performance tuning and battery-efficiency audits for long-haul navigation sessions.",
      },
    ],
    faqs: [
      {
        question: "How does the app handle tunnels and signal loss?",
        answer:
          "We utilize inertial navigation algorithms that estimate position based on the vehicle's last known speed and heading.",
      },
      {
        question: "Is the app optimized for electric vehicles?",
        answer:
          "Yes, we integrated specific EV routing that calculates battery consumption and suggests charging stops.",
      },
      {
        question: "How frequent are the map updates?",
        answer:
          "The app supports weekly incremental updates, ensuring road changes are reflected without needing a full map download.",
      },
      {
        question: "Does the UI adapt to ambient lighting?",
        answer:
          "The application uses light sensors to automatically transition between high-contrast day and low-glare night modes.",
      },
      {
        question: "Can it integrate with vehicle infotainment systems?",
        answer:
          "Full support for Apple CarPlay and Android Auto was a core requirement and successfully implemented.",
      },
    ],
  },
  "lockheed-martin-mission-control": {
    slug: "lockheed-martin-mission-control",
    title: "Lockheed Martin Tactical Visualization",
    subtitle: "Mission-critical data analysis for aerospace and defense",
    category: "Cloud & DevOps",
    client: "Lockheed Martin",
    duration: "24 Months",
    description:
      "Spire Digital developed a high-security tactical dashboard for Lockheed Martin, designed to ingest and visualize massive streams of telemetry data from orbital assets and terrestrial sensors into a unified operational picture.",
    heroImage: "/assets/projects/lockheed-martin-mission-control.jpg",
    overview:
      "Modern defense requires real-time situational awareness. We built an enterprise-grade web application that handles Petabytes of data, providing command centers with instant insights and predictive modeling capabilities.",
    challenge:
      "The system had to meet the highest security standards while maintaining extreme performance. Visualizing thousands of moving assets with their associated telemetry in a browser-based environment required innovative data-handling strategies.",
    solution:
      "A custom WebGL-based visualization engine was built to handle high-density data overlays, backed by a proprietary stream-processing backend that prioritizes alerts based on mission importance.",
    galleryImages: [
      "/assets/projects/lockheed-martin-mission-control-gallery-1.jpg",
      "/assets/projects/lockheed-martin-mission-control-gallery-2.jpg",
    ],
    features: [
      "Real-time 3D Asset Visualization",
      "Petabyte-scale Data Ingestion",
      "Predictive AI Threat Modeling",
      "Multi-layer Geospatial Overlays",
      "Secure User Level Access (RBAC)",
      "Offline-First Capability for Field Use",
      "Custom Automated Alerting Engine",
      "Interoperable Data Export APIs",
    ],
    metrics: [
      {
        label: "Data Uptime",
        value: "99.95%",
      },
      {
        label: "Asset Capacity",
        value: "1M+",
      },
      {
        label: "Query Speed",
        value: "<100ms",
      },
      {
        label: "Security Audit",
        value: "99.9%",
      },
    ],
    results: [
      {
        stat: "50%",
        title: "Latency Reduction",
        description:
          "Dramatically reduced the time between sensor data generation and operational visualization.",
      },
      {
        stat: "24/7",
        title: "Operational Status",
        description:
          "The platform provides uninterrupted service to mission-control hubs worldwide.",
      },
      {
        stat: "Zero",
        title: "Security Breaches",
        description:
          "Maintained a perfect security record under constant internal and external stress tests.",
      },
    ],
    techStack: [
      "React",
      "WebGL",
      "Apache Kafka",
      "Elasticsearch",
      "Rust",
      "Kubernetes",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Requirement Scoping",
        description:
          "Defining strict security protocols and data throughput requirements with defense engineers.",
      },
      {
        label: "Phase 2",
        title: "Core Kernel Dev",
        description:
          "Building the high-performance visualization kernel and data stream orchestrator.",
      },
      {
        label: "Phase 3",
        title: "Security Hardening",
        description:
          "Applying multi-layer encryption and rigorous penetration testing cycles.",
      },
      {
        label: "Phase 4",
        title: "Global Deployment",
        description:
          "Deployment across secure private cloud environments for planetary operations.",
      },
    ],
    faqs: [
      {
        question: "How is data integrity guaranteed?",
        answer:
          "We use immutable data structures and cryptographic hashing to ensure that every telemetry point is verifiable.",
      },
      {
        question: "Can the system handle satellite data?",
        answer:
          "Yes, the ingestion engine is optimized for high-velocity satellite telemetry and orbital mechanics calculations.",
      },
      {
        question: "What is the training requirement for users?",
        answer:
          "The UI was designed for intuition, significantly reducing the training time for mission operators compared to legacy tools.",
      },
      {
        question: "How does it scale during major events?",
        answer:
          "The Kubernetes-based infrastructure elastically scales processing power based on incoming data volume.",
      },
      {
        question: "Is it compatible with mobile field units?",
        answer:
          "A specialized progressive web app derivative allows field units to access specific tactical intel on secure mobile tablets.",
      },
    ],
  },
  "dish-network-dish-anywhere": {
    slug: "dish-network-dish-anywhere",
    title: "DISH Anywhere Unified Player",
    subtitle: "A seamless cross-platform television experience",
    category: "Web Development",
    client: "Dish Network",
    duration: "14 Months",
    description:
      "Spire Digital partnered with Dish Network to create DISH Anywhere, a unified streaming and DVR management platform that allows users to access their entire home entertainment library from any device, anywhere in the world.",
    heroImage: "/assets/projects/dish-network-dish-anywhere.jpg",
    overview:
      "The digital transition for satellite providers is critical. DISH Anywhere bridges the gap between traditional broadcast TV and the modern streaming-on-demand era, offering a cohesive experience across Web, iOS, and Android.",
    challenge:
      "Integrating with hardware DVRs located in users' homes meant overcoming varied network conditions, NAT traversal issues, and ensuring low-latency video streaming without a central server-side cache.",
    solution:
      "We engineered a direct peer-to-peer communication layer between mobile devices and the home Hopper DVR, combined with a cloud-based content aggregation system for VOD assets.",
    galleryImages: [
      "/assets/projects/dish-network-dish-anywhere-gallery-1.jpg",
      "/assets/projects/dish-network-dish-anywhere-gallery-2.jpg",
    ],
    features: [
      "Remote DVR Scheduling",
      "Live TV Transcoding Engine",
      "Offline Downloads (VOD)",
      "Universal Search & Discovery",
      "Parental Control Sync",
      "Adaptive Bitrate Streaming",
      "Multi-User Profile Support",
      "In-App Transfer of DVR Files",
    ],
    metrics: [
      {
        label: "App Downloads",
        value: "10M+",
      },
      {
        label: "Active Sessions",
        value: "2M/Day",
      },
      {
        label: "Video Latency",
        value: "<3s",
      },
      {
        label: "CSAT Score",
        value: "4.5/5",
      },
    ],
    results: [
      {
        stat: "20%",
        title: "Churn Reduction",
        description:
          "The mobile app became a key retention tool for Dish's satellite subscriptions.",
      },
      {
        stat: "1B+",
        title: "Minutes Streamed",
        description:
          "Reached a massive milestone in total content consumption through the new digital platform.",
      },
      {
        stat: "A+",
        title: "Accessibility Rating",
        description:
          "Received industry praise for the platform's advanced accessibility and voice-navigation features.",
      },
    ],
    techStack: [
      "TypeScript",
      "React",
      "Redux",
      "ExoPlayer",
      "AVPlayer",
      "Node.js",
      "WebRTC",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Architecture Design",
        description:
          "Mapping the complex communication flow between cloud services and physical DVR hardware.",
      },
      {
        label: "Phase 2",
        title: "Streaming Optimization",
        description:
          "Developing custom players that handle codec transitions and varying bandwidth gracefully.",
      },
      {
        label: "Phase 3",
        title: "Content Discovery UI",
        description:
          "Building an AI-driven recommendation engine to help users navigate thousands of channels.",
      },
      {
        label: "Phase 4",
        title: "Launch & Stabilization",
        description:
          "Full-scale rollout with a focus on resolving hardware-specific connectivity edge cases.",
      },
    ],
    faqs: [
      {
        question: "How does the app talk to my home DVR?",
        answer:
          "We use a secure proxy layer that establishes a direct connection to your Hopper hardware without requiring complex router setup.",
      },
      {
        question: "Can I watch recordings without the internet?",
        answer:
          "Yes, the 'Transfer' feature allows you to sync DVR recordings to your mobile storage for full offline viewing.",
      },
      {
        question: "Does it support 4K streaming?",
        answer:
          "The app supports up to 1080p HD, optimized for mobile screens while preserving your home bandwidth.",
      },
      {
        question: "How are recommendations generated?",
        answer:
          "Our Discovery engine analyzes viewing habits across both live TV and VOD to suggest relevant content in real-time.",
      },
      {
        question: "Is there a limit on simultaneous streams?",
        answer:
          "Streaming limits are bound to your Dish service plan, managed dynamically by our central session controller.",
      },
    ],
  },
  "transportation-legacy-modernization": {
    slug: "transportation-legacy-modernization",
    title: "Legacy Modernization for National Logistics Provider",
    subtitle:
      "Replatforming mainframe-dependent logistics operations into a high-scale web ecosystem.",
    category: "Web Development",
    client: "Global Logistics Systems",
    duration: "14 Months",
    description:
      "A comprehensive digital transformation replacing an aging monolithic platform with a responsive, microservices-driven architecture for real-time fleet management.",
    heroImage: "/assets/projects/transportation-legacy-modernization.jpg",
    overview:
      "Our client, a leader in North American logistics, faced critical performance bottlenecks and mounting technical debt with their core mainframe application. Keyhole Software was engaged to architect and execute a complete modernization strategy that would transition their field operations into a cloud-native, high-performance web environment without disrupting 24/7 business operations.",
    challenge:
      "The existing system was bottlenecked by legacy database locks and lacked a modern API layer, preventing integration with third-party tracking partners and mobile applications. Data latency was exceeding 5 seconds per request, causing significant delays in dispatching and tracking critical freight across multiple time zones.",
    solution:
      "We implemented a staged migration using the Strangler Fig pattern, gradually moving functionality to a Spring Boot microservices backend and a React-based frontend. We introduced a distributed caching layer and an event-driven synchronization engine to keep the legacy and new systems in perfect alignment during the transition.",
    galleryImages: [
      "/assets/projects/transportation-legacy-modernization-gallery-1.jpg",
      "/assets/projects/transportation-legacy-modernization-gallery-2.jpg",
    ],
    features: [
      "Real-time GPS Integrated Dispatching",
      "Microservices-based Business Logic Engine",
      "Cross-platform Field Agent Dashboard",
      "Automated Load Balancing & Capacity Planning",
      "Real-time Carrier Performance Analytics",
      "Multi-tenant Security Architecture",
      "Bi-directional Legacy Integration Sync",
      "Cloud-native Scalable Data Storage",
    ],
    metrics: [
      {
        label: "Processing Speed",
        value: "45% Increase",
      },
      {
        label: "System Uptime",
        value: "99.98%",
      },
      {
        label: "User Productivity",
        value: "30% Gain",
      },
      {
        label: "Infrastructure ROI",
        value: "35%",
      },
    ],
    results: [
      {
        stat: "40%",
        title: "Reduced Latency",
        description:
          "Implemented high-performance indexing and caching to slash response times across 5,000+ concurrent users.",
      },
      {
        stat: "Zero",
        title: "Operation Downtime",
        description:
          "Successfully executed the migration while maintaining full operational capacity through a phased deployment.",
      },
      {
        stat: "60%",
        title: "Faster Onboarding",
        description:
          "Modern UI/UX design reduced training time for new dispatchers from weeks to days.",
      },
    ],
    techStack: [
      "React.js",
      "Java Spring Boot",
      "AWS Lambda",
      "PostgreSQL",
      "Kafka",
      "Docker",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Infrastructure Assessment",
        description:
          "Deep-dive audit of legacy codebases and architectural planning for cloud-native transition.",
      },
      {
        label: "Phase 2",
        title: "Core Service Migration",
        description:
          "Decoupling of critical business logic and implementation of the initial microservices layer.",
      },
      {
        label: "Phase 3",
        title: "Frontend Transformation",
        description:
          "Development of the high-fidelity React dashboard and integration with real-time data streams.",
      },
      {
        label: "Phase 4",
        title: "Full Production Cutover",
        description:
          "Final validation of event-driven synchronization and full transition to the new cloud ecosystem.",
      },
    ],
    faqs: [
      {
        question:
          "How did you manage the legacy data migration without downtime?",
        answer:
          "We used a dual-write bridge strategy where data was synchronously written to both legacy and new databases, ensuring zero loss and immediate rollback capability.",
      },
      {
        question: "What was the biggest architectural hurdle?",
        answer:
          "Decoupling the monolithic mainframe procedures into independent, scalable microservices was the primary challenge.",
      },
      {
        question: "Is the new system mobile-responsive?",
        answer:
          "Yes, the React frontend was built with a mobile-first philosophy to support field agents using tablets and smartphones.",
      },
      {
        question: "How scalable is the final solution?",
        answer:
          "The architecture is fully containerized on AWS, allowing for horizontal auto-scaling during peak freight seasons.",
      },
      {
        question: "How total was the replacement of the mainframe?",
        answer:
          "The engagement resulted in a 95% migration, with the remaining 5% of deep-archive tasks handled via secure API proxies.",
      },
    ],
  },
  "fintech-cloud-migration": {
    slug: "fintech-cloud-migration",
    title: "FinTech Cloud Migration & Payment Engine",
    subtitle:
      "Modernizing a global payment gateway for secure, high-volume transactional processing.",
    category: "Cloud & DevOps",
    client: "Prestige Financial Services",
    duration: "10 Months",
    description:
      "Transitioning a mission-critical payment processing engine from on-premise hardware to a secure, PCI-compliant Azure cloud architecture.",
    heroImage: "/assets/projects/fintech-cloud-migration.jpg",
    overview:
      "Keyhole Software was commissioned by a global financial firm to migrate their high-frequency payment gateway to Azure. The project required a complete architectural overhaul to support 10 million daily transactions while adhering to strict SOC2 and PCI-DSS compliance standards.",
    challenge:
      "The client’s physical server infrastructure was reaching end-of-life, causing performance degradation during peak trading hours. Additionally, the existing monolithic code was difficult to scale vertically, leading to excessive hardware costs and maintenance windows that affected global availability.",
    solution:
      "We designed a Kubernetes-orchestrated environment on Azure (AKS) that leverages serverless functions for individual payment workflows. By implementing a zero-trust network architecture and automated compliance auditing, we ensured security was baked into every layer of the infrastructure.",
    galleryImages: [
      "/assets/projects/fintech-cloud-migration-gallery-1.jpg",
      "/assets/projects/fintech-cloud-migration-gallery-2.jpg",
    ],
    features: [
      "PCI-Compliant Azure Landing Zone",
      "Real-time Transaction Monitoring",
      "Automated Zero-Downtime Deployments",
      "Advanced Encryption at Rest & Transit",
      "Multi-region Failover Strategy",
      "Kubernetes-based Service Mesh",
      "Predictive Load Auto-Scaling",
      "Financial Reporting API Suite",
    ],
    metrics: [
      {
        label: "Daily Transaction Cap",
        value: "25M+",
      },
      {
        label: "System Latency",
        value: "<120ms",
      },
      {
        label: "Infrastructure Cost",
        value: "-35% OpEx",
      },
      {
        label: "Compliance Status",
        value: "99.9% Audit Pass",
      },
    ],
    results: [
      {
        stat: "60%",
        title: "Cost Efficiency",
        description:
          "Optimized resource allocation through containerization led to significant monthly cloud spend reductions.",
      },
      {
        stat: "99.99%",
        title: "High Availability",
        description:
          "Achieved 'Four-Nines' of availability across global regions using multi-zone redundancy.",
      },
      {
        stat: "5x",
        title: "Deployment Speed",
        description:
          "Automated CI/CD pipelines enabled daily production releases compared to quarterly updates previously.",
      },
    ],
    techStack: [
      "Azure Kubernetes (AKS)",
      ".NET 8",
      "Terraform",
      "Azure SQL High-Performance",
      "Azure Key Vault",
      "Helm",
      "App Insights",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Cloud Readiness Audit",
        description:
          "In-depth review of existing application dependency graphs and security requirements.",
      },
      {
        label: "Phase 2",
        title: "Landing Zone Construction",
        description:
          "Building the secure base infrastructure using Infrastructure-as-Code (IaC).",
      },
      {
        label: "Phase 3",
        title: "Platform Refactoring",
        description:
          "Containerizing the .NET application and integrating with cloud-native storage.",
      },
      {
        label: "Phase 4",
        title: "Validation & Cutover",
        description:
          "Executing simulated high-load events and finalizing the DNS switch to the cloud environment.",
      },
    ],
    faqs: [
      {
        question: "How did you ensure PCI compliance in the cloud?",
        answer:
          "We utilized Azure Policy and security blueprints combined with automated compliance scanning tools in the CI/CD pipeline.",
      },
      {
        question: "Were the developers retrained?",
        answer:
          "Yes, Keyhole provided hands-on mentoring sessions on Kubernetes management and cloud-native .NET development.",
      },
      {
        question: "What happened to the old hardware?",
        answer:
          "The on-premise hardware was decommissioned in phases as workloads were verified in the new environment.",
      },
      {
        question: "How did you handle stateful transactions?",
        answer:
          "We implemented Azure SQL with high-availability groups to ensure transactional integrity across all nodes.",
      },
      {
        question: "Did this migration improve global user experience?",
        answer:
          "Significantly. Multi-region deployments reduced latency for international users by over 200ms on average.",
      },
    ],
  },
  "enterprise-ai-assistant": {
    slug: "enterprise-ai-assistant",
    title: "AI-Driven Claims Assistant for Insurance",
    subtitle:
      "Leveraging Generative AI to automate policy analysis and claims processing.",
    category: "AI & Automation",
    client: "Nationwide Insurance Group",
    duration: "8 Months",
    description:
      "A custom LLM-powered solution enabling claims adjusters to query complex policy documents and legal files using natural language.",
    heroImage: "/assets/projects/enterprise-ai-assistant.jpg",
    overview:
      "The client’s adjusters were spending hours manually searching through thousands of policy variations and historical claim records. Keyhole Software developed a Retrieval-Augmented Generation (RAG) assistant that integrates directly with their document management system, providing instant, source-cited answers to adjuster queries.",
    challenge:
      "Insurance policies are hyper-dense and context-dependent. Standard keyword search was failing to provide accurate answers. Furthermore, all data had to remain strictly on-premise or within a private cloud VPC to ensure policyholder privacy and compliance with insurance regulations.",
    solution:
      "We built a private RAG pipeline using a vector database for semantic search and a private instance of a Large Language Model. The system included a 'Source Verification' feature that highlights exactly where in a 200-page document the AI found its answer, ensuring human-in-the-loop accuracy.",
    galleryImages: [
      "/assets/projects/enterprise-ai-assistant-gallery-1.jpg",
      "/assets/projects/enterprise-ai-assistant-gallery-2.jpg",
    ],
    features: [
      "Private LLM Integration (VPC)",
      "Semantic Document Indexing",
      "Multi-format PDF/Email Ingestion",
      "Source Attributions & Deep Linking",
      "Role-based Access Control for AI",
      "Continuous Feedback Learning Loop",
      "Automated Claims Summarization",
      "Real-time Policy Fact-Checking",
    ],
    metrics: [
      {
        label: "Search Time Reduction",
        value: "75%",
      },
      {
        label: "Answer Accuracy",
        value: "96%",
      },
      {
        label: "Adjuster Adoption",
        value: "15,000 Users",
      },
      {
        label: "Estimated Yearly Savings",
        value: "$4.5M",
      },
    ],
    results: [
      {
        stat: "12min",
        title: "Faster Processing",
        description:
          "The time required to review a complex claim decreased from an average of 45 minutes to 33 minutes.",
      },
      {
        stat: "100%",
        title: "Data Privacy",
        description:
          "Data never left the client's secure network, satisfying all regulatory and legal requirements.",
      },
      {
        stat: "25%",
        title: "Reduced Appeals",
        description:
          "Higher initial accuracy in policy interpretation led to fewer disputed claims and legal appeals.",
      },
    ],
    techStack: [
      "Python",
      "LangChain",
      "Pinecone (Private)",
      "Azure OpenAI (VPC)",
      "FastAPI",
      "React.js",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "AI Ethics & Data Strategy",
        description:
          "Defining security boundaries and selecting the optimal embedding models for legal text.",
      },
      {
        label: "Phase 2",
        title: "MVP Vector Indexing",
        description:
          "Ingesting 50,000 pilot documents and tuning semantic search relevance.",
      },
      {
        label: "Phase 3",
        title: "Assistant Development",
        description:
          "Building the React frontend and implementing the LLM orchestration layer.",
      },
      {
        label: "Phase 4",
        title: "Enterprise Rollout",
        description:
          "Full-scale deployment with training sessions for adjuster teams across multiple regions.",
      },
    ],
    faqs: [
      {
        question: "How do you prevent AI hallucinations?",
        answer:
          "We use strict grounding techniques and prompt engineering that forbids the AI from answering without a direct document reference.",
      },
      {
        question: "Is the system updated in real-time?",
        answer:
          "Yes, new policies are indexed as soon as they are uploaded to the central document management system.",
      },
      {
        question: "What LLM is being used?",
        answer:
          "The project utilized a fine-tuned version of GPT-4 hosted within a private Azure environment.",
      },
      {
        question: "Can it handle handwritten documents?",
        answer:
          "We integrated an OCR pre-processing layer that converts scanned and handwritten claims into text before indexing.",
      },
      {
        question: "Does this replace adjusters?",
        answer:
          "Absolutely not. It is an augmentation tool designed to remove repetitive search tasks, allowing adjusters to focus on high-value decisions.",
      },
    ],
  },
  "healthcare-data-interoperability": {
    slug: "healthcare-data-interoperability",
    title: "FHIR-Based Healthcare Integration Platform",
    subtitle:
      "Unifying disparate EHR data into a single longitudinal patient view.",
    category: "AI & Data",
    client: "MidWest Health Network",
    duration: "12 Months",
    description:
      "Architecting a secure interoperability layer that aggregates data from 12+ separate health facilities using HL7 FHIR standards.",
    heroImage: "/assets/projects/healthcare-data-interoperability.jpg",
    overview:
      "MidWest Health Network suffered from fragmented patient data siloed across decades-old EHR instances. Keyhole Software designed and implemented a modern API gateway that normalizes various data formats into a unified FHIR-compliant repository, providing clinicians with a 360-degree view of patient history.",
    challenge:
      "Each facility used different data standards (HL7 v2, CSV, SQL), making real-time clinical decision support impossible. Doctors were forced to log into multiple portals to see a patient’s full history, significantly increasing the risk of medical oversight.",
    solution:
      "We built a specialized integration engine that transforms legacy data into FHIR R4 resources. This centralized data lake serves a modern React dashboard that features real-time clinical alerts, medication reconciliation, and longitudinal health charting.",
    galleryImages: [
      "/assets/projects/healthcare-data-interoperability-gallery-1.jpg",
      "/assets/projects/healthcare-data-interoperability-gallery-2.jpg",
    ],
    features: [
      "HL7 FHIR R4 Compliant API",
      "Real-time Clinical Event Alerts",
      "Consolidated Medication Records",
      "HIPAA-Compliant Audit Logging",
      "Clinician Portal with Modern UI",
      "Automated Lab Result Ingestion",
      "Scalable GraphQL Query Layer",
      "Multi-facility Data Normalization",
    ],
    metrics: [
      {
        label: "Integrated EHRs",
        value: "14 Systems",
      },
      {
        label: "Data Sync Latency",
        value: "<2 Seconds",
      },
      {
        label: "Clinical Error Reduction",
        value: "18%",
      },
      {
        label: "Patient Match Accuracy",
        value: "99.9%",
      },
    ],
    results: [
      {
        stat: "35%",
        title: "Faster Decisions",
        description:
          "Clinicians reported spending significantly less time searching for records during patient consultations.",
      },
      {
        stat: "100%",
        title: "HIPAA Compliant",
        description:
          "The platform passed independent security audits for patient data protection and encryption standards.",
      },
      {
        stat: "1.2M",
        title: "Unified Records",
        description:
          "Successfully merged fragmented records for over a million unique patients into a single source of truth.",
      },
    ],
    techStack: [
      "Node.js",
      "GraphQL",
      "PostgreSQL",
      "Azure Health Data Services",
      "Redis",
      "React.js",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Data Silo Analysis",
        description:
          "Mapping the schemas of 14 disparate database systems to the FHIR R4 standard.",
      },
      {
        label: "Phase 2",
        title: "Pipeline Engineering",
        description:
          "Building the ETL and real-time synchronization hooks using secure cloud messaging.",
      },
      {
        label: "Phase 3",
        title: "Clinical Dashboard UI",
        description:
          "Collaborating with doctors to design a high-density, intuitive charting interface.",
      },
      {
        label: "Phase 4",
        title: "Go-Live & Support",
        description:
          "Phased rollout across facilities with real-time performance monitoring and data validation.",
      },
    ],
    faqs: [
      {
        question: "How do you ensure patients are correctly matched?",
        answer:
          "We implemented an Advanced Patient Identity (EMPI) algorithm that uses deterministic and probabilistic matching.",
      },
      {
        question: "Is the data encrypted?",
        answer:
          "Yes, all data is encrypted at rest and in transit using industry-standard AES-256 and TLS 1.3.",
      },
      {
        question: "Can third-party apps connect to this?",
        answer:
          "The platform includes a developer portal with SMART-on-FHIR support for authorized third-party integrations.",
      },
      {
        question: "Does it support legacy HL7 v2?",
        answer:
          "Yes, the platform acts as a transformational bridge for facilities still operating on HL7 v2 standards.",
      },
      {
        question: "How do you handle data conflicts?",
        answer:
          "We use a sophisticated 'source of truth' hierarchy where more recent verified records take priority over older data.",
      },
    ],
  },
  "onebank-sterling": {
    slug: "onebank-sterling",
    title: "OneBank: The 100% Digital Banking Revolution",
    subtitle:
      "Creating a borderless financial ecosystem for the African market",
    category: "Mobile Development",
    client: "Sterling Bank",
    duration: "18 Months",
    description:
      "A comprehensive digital transformation project that launched Nigeria's first fully digital bank, enabling end-to-end banking without physical intervention.",
    heroImage: "/assets/projects/onebank-sterling.jpg",
    overview:
      "Sterling Bank sought to disrupt the traditional banking model by creating a mobile-first platform that offers everything from automated savings to instant loans. Cregital was tasked with designing the experience and core interface for this ambitious fintech venture.",
    challenge:
      "The primary challenge was migrating complex legacy banking workflows into a simplified mobile experience while maintaining enterprise-level security and ensuring regulatory compliance across multiple service layers.",
    solution:
      "We implemented a microservices-based architecture coupled with a user-centric UI design that prioritized speed and accessibility. The result was a seamless onboarding process that takes less than 2 minutes.",
    galleryImages: [
      "/assets/projects/onebank-sterling-gallery-1.jpg",
      "/assets/projects/onebank-sterling-gallery-2.jpg",
    ],
    features: [
      "Instant Digital Onboarding",
      "Automated Wealth Management",
      "AI-Powered Credit Scoring",
      "Real-time Fraud Detection",
      "Cross-border P2P Payments",
      "Integrated Bill Settlement",
      "Multi-currency Wallets",
      "Biometric Authentication",
    ],
    metrics: [
      {
        label: "Active Users",
        value: "1.2M+",
      },
      {
        label: "NPS Score",
        value: "72",
      },
      {
        label: "Onboarding Time",
        value: "1.5 Min",
      },
      {
        label: "Daily Volume",
        value: "250k",
      },
    ],
    results: [
      {
        stat: "150%",
        title: "Engagement Boost",
        description:
          "Vast improvement in corporate client interactions through the new digital portal.",
      },
      {
        stat: "40%",
        title: "Efficiency Gain",
        description:
          "Streamlined internal workflows for account managers and treasury officers.",
      },
      {
        stat: "Top 3",
        title: "Industry Rank",
        description:
          "Awarded for best digital merchant banking experience in the 2023 financial awards.",
      },
    ],
    techStack: [
      "React",
      ".NET Core",
      "Azure Cloud",
      "SQL Server",
      "TypeScript",
      "Tailwind CSS",
      "Power BI",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Executive Alignment",
        description:
          "Defining KPIs and stakeholder requirements for institutional workflows.",
      },
      {
        label: "Phase 2",
        title: "Interface Architecture",
        description:
          "Designing complex data visualizations for high-level financial reporting.",
      },
      {
        label: "Phase 3",
        title: "System Integration",
        description:
          "Connecting the portal to core banking systems and third-party data providers.",
      },
      {
        label: "Phase 4",
        title: "Internal Pilot",
        description:
          "Full-scale stress testing and training for corporate bank staff.",
      },
    ],
    faqs: [
      {
        question: "Does the portal support batch payments?",
        answer:
          "Yes, it supports large-scale payroll and vendor payments with bulk upload capabilities.",
      },
      {
        question: "Can multiple users manage one account?",
        answer:
          "Absolutely, it features robust RBAC (Role Based Access Control) for corporate teams.",
      },
      {
        question: "Is training provided for clients?",
        answer:
          "The interface is intuitive, but we include an integrated knowledge base and video tours.",
      },
      {
        question: "How secure is the trade finance module?",
        answer:
          "It adheres to international security standards with 256-bit encryption and hardware token support.",
      },
      {
        question: "Are reports available in PDF format?",
        answer:
          "Yes, all dashboards can be exported as high-fidelity PDF or Excel reports for audit.",
      },
    ],
  },
  "africa-prudential": {
    slug: "africa-prudential",
    title: "Africa Prudential: Digital Registrar Solutions",
    subtitle: "Modernizing the nexus between companies and shareholders",
    category: "Cloud & DevOps",
    client: "Africa Prudential PLC",
    duration: "14 Months",
    description:
      "Transformation of a traditional registrar business into a modern digital platform serving millions of shareholders and listed companies.",
    heroImage: "/assets/projects/africa-prudential.jpg",
    overview:
      "Africa Prudential needed to eliminate technical debt and manual paperwork in shares management. We developed 'EasyVerify', a digital suite for automated shareholder engagement and self-service dividend management.",
    challenge:
      "Digitizing millions of legacy physical records and creating a secure verification system that works even in low-connectivity environments.",
    solution:
      "We deployed a cloud-native platform with a mobile-optimized interface, enabling shareholders to track holdings and claim dividends via USSD and web.",
    galleryImages: [
      "/assets/projects/africa-prudential-gallery-1.jpg",
      "/assets/projects/africa-prudential-gallery-2.jpg",
    ],
    features: [
      "Dividend Self-Service",
      "Electronic Stock Proxy",
      "Legacy Record Digitization",
      "USSD Banking Integration",
      "Automated Asset Tracking",
      "Direct Investor Relations",
      "Regulatory Compliance Engine",
      "Shareholder Voting Portal",
    ],
    metrics: [
      {
        label: "Holders Managed",
        value: "2.5M+",
      },
      {
        label: "Claims Processed",
        value: "$20M+",
      },
      {
        label: "Digital Adoption",
        value: "50%",
      },
      {
        label: "Support Avg",
        value: "2.4m",
      },
    ],
    results: [
      {
        stat: "90%",
        title: "Paperwork Reduction",
        description:
          "Near-total elimination of physical forms in the shareholder onboarding process.",
      },
      {
        stat: "55%",
        title: "Cost Savings",
        description:
          "Drastic reduction in postal and administrative overhead for investor relations.",
      },
      {
        stat: "Instant",
        title: "Dividend Payouts",
        description:
          "Transitioned from weeks to near-instant digital dividend processing.",
      },
    ],
    techStack: [
      "Vue.js",
      "Laravel",
      "AWS",
      "MySQL",
      "Terraform",
      "Elasticsearch",
      "Bitbucket",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Audit & Cleanup",
        description:
          "Analyzing legacy databases and planning for the massive data migration.",
      },
      {
        label: "Phase 2",
        title: "Core Portal Build",
        description:
          "Developing the shareholder self-service engine and company admin tools.",
      },
      {
        label: "Phase 3",
        title: "Omnichannel Deployment",
        description:
          "Launching web, mobile, and USSD access points for universal reach.",
      },
      {
        label: "Phase 4",
        title: "Security Hardening",
        description:
          "Implementing advanced identity verification and audit trail logging.",
      },
    ],
    faqs: [
      {
        question: "Can shareholders update bank details online?",
        answer:
          "Yes, via a secure portal with E-Mandate integration for immediate bank verification.",
      },
      {
        question: "Is the platform compliant with SEC rules?",
        answer:
          "It is fully aligned with Securities and Exchange Commission guidelines for registrars.",
      },
      {
        question: "How do elderly users access the platform?",
        answer:
          "We built a simple USSD interface (*401#) that works on any mobile device without internet.",
      },
      {
        question: "Are joint accounts supported?",
        answer:
          "The platform handles multiple ownership types including joint, corporate, and individual.",
      },
      {
        question: "Can I track my bonus shares history?",
        answer:
          "Absolutely, a full corporate action history is available in the personal dashboard.",
      },
    ],
  },
  "glo-digital-gateway": {
    slug: "glo-digital-gateway",
    title: "Globacom: The Digital Telecom Gateway",
    subtitle: "Unified digital experience for 50 million+ subscribers",
    category: "AI & Automation",
    client: "Globacom Limited",
    duration: "24 Months",
    description:
      "Design and development of a massive-scale digital ecosystem integrating self-service, content, and financial services in one app.",
    heroImage: "/assets/projects/glo-digital-gateway.jpg",
    overview:
      "Globacom (Glo) wanted to transition from a telco to a 'techco'. We designed the 'Glo Café' and partner portals to centralize data management, lifestyle content, and AI-driven customer support.",
    challenge:
      "Engineering a platform capable of handling massive peak-time concurrency while simplifying a complex catalog of over 200 data and voice products.",
    solution:
      "A high-performance Angular frontend backed by a Java Spring microservices architecture, featuring an AI chatbot that handles 70% of common queries.",
    galleryImages: [
      "/assets/projects/glo-digital-gateway-gallery-1.jpg",
      "/assets/projects/glo-digital-gateway-gallery-2.jpg",
    ],
    features: [
      "AI Customer Assistant",
      "Dynamic Data Bundling",
      "Family Plan Management",
      "Infinite Recharge Engine",
      "Integrated Content Store",
      "Network Status Tracker",
      "Zero-Rated Usage Portal",
      "Automated KYC Updates",
    ],
    metrics: [
      {
        label: "Total Impacts",
        value: "35M+",
      },
      {
        label: "Self-Service Usage",
        value: "35%",
      },
      {
        label: "Wait Times",
        value: "-75%",
      },
      {
        label: "Concurrent Users",
        value: "100k",
      },
    ],
    results: [
      {
        stat: "300%",
        title: "Value Added Services",
        description:
          "Tripled the adoption rate of non-voice products through targeted digital UI.",
      },
      {
        stat: "22s",
        title: "Issue Resolution",
        description:
          "Average time to resolve common data issues via the AI-powered assistant.",
      },
      {
        stat: "#1",
        title: "Telco Portal",
        description:
          "Recognized as the most comprehensive telco self-service app in the market.",
      },
    ],
    techStack: [
      "Angular",
      "Java Spring Boot",
      "Oracle DB",
      "Kubernetes",
      "GCP",
      "Jenkins",
      "Prometheus",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Consumer Research",
        description:
          "Deep dive into user pain points and telco service bottlenecks.",
      },
      {
        label: "Phase 2",
        title: "Service Design",
        description:
          "Mapping complex telco logic into simplified UI flows for every age demographic.",
      },
      {
        label: "Phase 3",
        title: "Scale Engineering",
        description:
          "Building the high-concurrency backend to support millions of pings per minute.",
      },
      {
        label: "Phase 4",
        title: "Regional Rollout",
        description:
          "Phased deployment across Nigerian and neighboring West African markets.",
      },
    ],
    faqs: [
      {
        question: "Can I manage my family's data from my app?",
        answer:
          "Yes, the 'Master Account' feature allows you to link and fund up to 5 family lines.",
      },
      {
        question: "Is help available 24/7?",
        answer:
          "Our AI assistant 'GloBot' is available around the clock for instant support.",
      },
      {
        question: "Does using the app consume my data?",
        answer:
          "The Glo Café app is zero-rated, meaning you can access it even with zero data balance.",
      },
      {
        question: "Can I buy airtime for other networks?",
        answer:
          "Yes, our integrated payment gateway supports third-party airtime and bill payments.",
      },
      {
        question: "How do I secure my data usage?",
        answer:
          "You can set usage limits and receive real-time notifications to prevent overage.",
      },
    ],
  },
};

export function getProjectData(slug: string) {
  return projectsData[slug] ?? null;
}

export function getProjectNavigationList() {
  return Object.values(projectsData).map((project) => ({
    slug: project.slug,
    title: project.title,
    href: `/projects/${project.slug}`,
    category: project.category,
    subtitle: project.subtitle,
    description: project.description,
  }));
}
