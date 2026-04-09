import {
  IconBook,
  IconCode,
  IconShoppingBag,
  IconUsers,
} from "@tabler/icons-react";

export const TOP_BAR = {
  email: "hr@workholo.com",
  phone1: "+91-XXXXXXXXXX",
  carousel: [
    "Build Websites & Software for Your Business",
    "Ready-Made Solutions Available for Instant Launch",
    "Custom Development Based on Your Requirements",
    "Scalable Digital Products for Growing Businesses",
    "Launch Faster with WorkHolo Solutions",
  ],
  locations: "India | Serving Clients Worldwide",
};

export const NAV_DATA = [
  {
    title: "Home",
    hasMegaMenu: true,
    items: [
      {
        id: "about-us",
        label: "About WorkHolo",
        icon: IconUsers,
        description:
          "WorkHolo builds ready-to-use and custom websites and software solutions for businesses to launch and scale faster.",
        links: [],
      },
    ],
    centerContent: {
      title: "LATEST SOLUTIONS",
      links: [
        {
          label: "Company Overview",
          desc: "WorkHolo Labs delivers innovative mobile and web app solutions for modern businesses",
        },
        {
          label: "Vision & Mission",
          desc: "Driving digital innovation with purpose and empowering businesses globally",
        },
        {
          label: "Leadership Team",
          desc: "Meet the experienced minds leading WorkHolo Labs to digital excellence",
        },
        {
          label: "Our Journey",
          desc: "14+ years of building world-class digital products across 20+ industries",
        },
        {
          label: "Awards & Recognition",
          desc: "Industry accolades celebrating our commitment to quality and innovation",
        },
        {
          label: "NASSCOM Membership",
          desc: "Proud member of India's premier IT industry association",
        },
        {
          label: "Life at WorkHolo Labs",
          desc: "Explore our vibrant culture, talented people, and collaborative work environment",
        },
      ],
    },
    whySection: {
      title: "ABOUT WORKHOLO",
      points: [
        "Ready-to-Launch Digital Products",
        "Fully Customizable Solutions",
        "Fast Development & Delivery",
        "Scalable & Future-Ready Systems",
        "Built for Real Business Needs",
      ],
      buttonText: "Get in Touch",
    },
  },
  {
    title: "Services",
    hasMegaMenu: true,
    items: [
      {
        id: "software-dev",
        label: "Software Development",
        icon: IconCode,
        description:
          "We design and build websites and software tailored to your business needs.",
        links: [
          {
            label: "Mobile App Development",
            desc: "Custom iOS, Android & cross-platform solution",
          },
          {
            label: "iOs App Development",
            desc: "Native iPhone apps with seamless UX",
          },
          {
            label: "Android App Development",
            desc: "Robust apps for the Android ecosystem",
          },
          {
            label: "ipad App Development",
            desc: "Optimized tablet experiences for enterprise",
          },
          {
            label: "Flutter App Development",
            desc: "Cross-platform apps from a single codebase",
          },
          {
            label: "React Native App Development",
            desc: "High-performance hybrid mobile apps",
          },
          {
            label: "Web Application Development",
            desc: "Scalable web apps built for your business",
          },
          {
            label: "Custom Software Development",
            desc: "Tailored solution for unique business needs",
          },
          {
            label: "Enterprise Application Development",
            desc: "Scalable, Secure & cloud-native enterprise software",
          },
          {
            label: "App maintainance & Support",
            desc: "Ongoing updates, bug fixes & performance optimization",
          },
        ],
      },
    ],
    whySection: {
      title: "WHY WORKHOLO?",
      points: [
        "Build → Customize → Launch Model",
        "Ready-Made + Custom Solutions",
        "Fast Delivery with Quality",
        "Affordable for Startups & Businesses",
        "Focused on Real Business Growth",
      ],
      buttonText: "Get in Touch",
    },
  },
  {
    title: "Products",
    hasMegaMenu: true,
    items: [
      {
        id: "ready-products",
        label: "On-Demand & Delivery Apps",
        icon: IconShoppingBag,
        description:
          "On Demand and Delivery apps-Transforming everyday services into on",
        links: [
          {
            label: "Food Delivery App",
            desc: "Multi-restaurant ordering with real-time tracking",
          },
          {
            label: "Grocery Delivery App",
            desc: "Quick commerce for daily essentials",
          },
          {
            label: "Milk delivery App",
            desc: "Subscription-based daily delivery management",
          },
          {
            label: "Car Wash App",
            desc: "On-Demand vehicle care t your doorstep",
          },
          {
            label: "Chef Management App",
            desc: "On-Demand vehicle care t your doorstep",
          },
        ],
      },
      {
        id: "Booking",
        label: "Booking and Servce Platforms",
        icon: IconBook,
        description: "Seamless scheduling and appointment management apps",
        links: [
          {
            label: "Taxi Booking App",
            desc: "Ride-hailing with smart route optimization",
          },
          {
            label: "Hotel Booking App",
            desc: "Seamless hotel search, compare & reserve",
          },
          {
            label: "Ticket Booking App",
            desc: "Events, travel & entertainment ticketing",
          },
          {
            label: "Real Estate App",
            desc: "Property listing, virtual tours & lead management",
          },
        ],
      },
      {
        id: "E-Commerce",
        label: "E-Commerce & Marketplace Solution",
        icon: IconShoppingBag,
        description: "Multi-vendor stores and online shopping platforms",
        links: [
          {
            label: "eCommerce App",
            desc: "Scalable online stores with seamless checkout",
          },
          {
            label: "Online Shopping App",
            desc: "Feature-rich shopping experience for customers",
          },
          {
            label: "Multi-Vendor Marketplace",
            desc: "Connect multiple sellers on one platform",
          },
        ],
      },
      {
        id: "education",
        label: "Education & Entertainment",
        icon: IconShoppingBag,
        description: "eLearning platforms and interactive media solutions",
        links: [
          {
            label: "E-Learning App",
            desc: "Interactive courses, quizzes & certifications",
          },
          {
            label: "Gaming App",
            desc: "Engaging mobile games with monetization",
          },
          {
            label: "OTT App",
            desc: "Video sreaming like Netflix & Hotstar",
          },
        ],
      },
      {
        id: "healthcare",
        label: "Healthcare & Wellness",
        icon: IconShoppingBag,
        description: "Patient management and telemedicine applications",
        links: [
          {
            label: "Diagnostic App",
            desc: "Lab booking, reports & health tracking",
          },
          {
            label: "Sports & Fitness App",
            desc: "Workout plans, tracking & community features",
          },
        ],
      },
      {
        id: "Social&Media",
        label: "Social & Media Apps",
        icon: IconShoppingBag,
        description: "Community building and content sharing platforms",
        links: [
          {
            label: "Social Media App",
            desc: "Community platform with feeds, chat & sharing",
          },
        ],
      },
    ],
    whySection: {
      title: "KNOWLEDGE HUB",
      points: [
        "How to Launch Your Website",
        "Choosing the Right Software",
        "Scaling Your Digital Business",
        "Latest Tech Trends",
      ],
      buttonText: "Get in Touch",
    },
  },
  { title: "Portfolio", hasMegaMenu: false },
  { title: "Contact Us", hasMegaMenu: false },
];

export const ROUTES: Record<string, string> = {
  Home: "/",
  Portfolio: "/portfolio",
  "Contact Us": "/contact",
};

export const createPath = (parent: string, label: string) => {
  return `/${parent.toLowerCase()}/${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
};
