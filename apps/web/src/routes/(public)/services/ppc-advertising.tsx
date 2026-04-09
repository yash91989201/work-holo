import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  HeartPulse,
  Mail,
  MessageCircle,
  Monitor,
  Phone,
  Rocket,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

// --- Constants & Types ---

const PRIMARY_PURPLE = "#7B2CBF";

const capabilities = [
  {
    id: "01",
    title: "Google Ads Management",
    description:
      "Search campaigns, display advertising, Performance Max, Shopping ads, and YouTube advertising aligned with business goals and user intent.",
  },
  {
    id: "02",
    title: "Social Media Advertising",
    description:
      "Targeted campaigns across Meta (Facebook & Instagram), LinkedIn Ads for B2B targeting, and platform-specific audience strategies.",
  },
  {
    id: "03",
    title: "Funnel Optimization",
    description:
      "User acquisition funnels, retargeting sequences, customer journey stages, lead qualification flows, and conversion pathway engineering.",
  },
  {
    id: "04",
    title: "Landing & Conversion",
    description:
      "Landing page messaging, CTA placement, form structure, speed performance, and conversion tracking integration for full funnel alignment.",
  },
  {
    id: "05",
    title: "Budget & Bid Management",
    description:
      "Smart bidding frameworks, CPA monitoring, ROI-based allocation, performance benchmarking, and continuous budget refinement for sustainable performance.",
  },
];

const processSteps = [
  { id: 1, name: "Planning" },
  { id: 2, name: "Research" },
  { id: 3, name: "Creation" },
  { id: 4, name: "Launch" },
  { id: 5, name: "Monitor" },
  { id: 6, name: "Optimize" },
  { id: 7, name: "Scale" },
];

const industries = [
  {
    name: "SaaS & Technology",
    icon: <Monitor className="h-8 w-8 text-blue-500" />,
  },
  {
    name: "eCommerce",
    icon: <ShoppingCart className="h-8 w-8 text-blue-500" />,
  },
  {
    name: "Healthcare",
    icon: <HeartPulse className="h-8 w-8 text-blue-500" />,
  },
  {
    name: "Financial Services",
    icon: <Building2 className="h-8 w-8 text-blue-500" />,
  },
  {
    name: "Enterprise B2B",
    icon: <Briefcase className="h-8 w-8 text-blue-500" />,
  },
  {
    name: "Startup Growth",
    icon: <Rocket className="h-8 w-8 text-blue-500" />,
  },
];

const techStack = [
  "Google Ads",
  "Meta Ads Manager",
  "LinkedIn Campaign Manager",
  "Microsoft Ads",
  "Google Analytics 4",
  "Tag Manager",
  "Looker Studio",
  "Optimizely",
  "Unbounce",
  "Hotjar",
  "Facebook Pixel",
  "Google Merchant Center",
  "SA360",
  "DV360",
  "CallRail",
  "HubSpot",
  "Zapier",
  "Supermetrics",
];

const faqs = [
  {
    question: "What are PPC advertising services?",
    answer:
      "PPC advertising services involve managing paid digital campaigns where advertisers pay only when users click — across search engines, social platforms, and display networks with keyword targeting, audience segmentation, bid optimization, and ROI analysis.",
  },
  {
    question: "How quickly can PPC generate results?",
    answer:
      "PPC can generate traffic almost immediately after a campaign is launched. However, optimization for conversions typically takes 2-4 weeks of data gathering.",
  },
  {
    question: "Is PPC better than SEO?",
    answer:
      'Neither is "better"; they serve different purposes. PPC provides immediate visibility and control, while SEO builds long-term organic authority. A balanced strategy often uses both.',
  },
  {
    question: "How do you measure PPC success?",
    answer:
      "We measure success through KPIs like ROAS (Return on Ad Spend), CPA (Cost Per Acquisition), Conversion Rate, and overall revenue growth.",
  },
];

const latestJobs = [
  { title: "PPC Specialist", location: "Hyderabad, India", type: "Full-time" },
  { title: "Digital Marketing Manager", location: "Remote", type: "Full-time" },
  {
    title: "Performance Analyst",
    location: "Bangalore, India",
    type: "Contract",
  },
];

const executives = [
  {
    name: "Srinivas Rao",
    role: "CEO & Founder",
    image: "https://picsum.photos/seed/exec1/200/200",
  },
  {
    name: "Anjali Sharma",
    role: "Head of Digital Strategy",
    image: "https://picsum.photos/seed/exec2/200/200",
  },
  {
    name: "David Wilson",
    role: "Chief Technology Officer",
    image: "https://picsum.photos/seed/exec3/200/200",
  },
];

// --- Components ---

const SectionHeading = ({
  children,
  subtitle,
  light = false,
}: {
  children: React.ReactNode;
  subtitle?: string;
  light?: boolean;
}) => (
  <div className="mb-16 text-center">
    <motion.h2
      className={`mb-4 font-bold text-4xl md:text-5xl ${light ? "text-white" : "text-slate-900"}`}
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.p
        className={`text-lg ${light ? "text-slate-400" : "text-slate-600"}`}
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-slate-200 border-b py-4">
      <button
        className="flex w-full items-center justify-between text-left font-semibold text-lg text-slate-800 transition-colors hover:text-blue-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
          >
            <p className="pt-4 text-slate-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PPC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* --- Top Bar --- */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-white/10 border-b bg-black px-4 py-2 text-[11px] text-white md:px-12 md:text-[13px]">
        <div className="flex flex-wrap items-center gap-4">
          <a
            className="flex items-center gap-1 transition-colors hover:text-blue-400"
            href="mailto:contact@WorkHololabs.com"
          >
            <Mail className="h-3 w-3" /> contact@WorkHololabs.com
          </a>
          <a
            className="flex items-center gap-1 transition-colors hover:text-blue-400"
            href="tel:+919390683154"
          >
            <Phone className="h-3 w-3" /> +91 9390683154
          </a>
          <a
            className="flex items-center gap-1 transition-colors hover:text-blue-400"
            href="tel:+15512220070"
          >
            <Phone className="h-3 w-3" /> +1 (551) 222-0070
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-bold text-yellow-500">NASSCOM</span>
          <span>SME Inspire Awards 2026 🏆</span>
          <div className="ml-4 hidden items-center gap-3 opacity-80 lg:flex">
            <span>Hyderabad</span> | <span>Bangalore</span> | <span>USA</span>
          </div>
        </div>
      </div>

      {/* --- Header --- */}

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-24 pb-32 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,#7B2CBF,transparent_50%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <div className="mb-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
            <a className="hover:text-white" href="#">
              Home
            </a>
            <span>/</span>
            <a className="hover:text-white" href="#">
              Services
            </a>
            <span>/</span>
            <span className="text-yellow-500">PPC Advertising</span>
          </div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 font-black text-5xl tracking-tight md:text-7xl"
            initial={{ opacity: 0, y: 30 }}
          >
            PPC <span className="text-yellow-500">Advertising</span> Services
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-12 max-w-3xl font-medium text-slate-300 text-xl leading-relaxed md:text-2xl"
            initial={{ opacity: 0, y: 30 }}
            transition={{ delay: 0.1 }}
          >
            Performance-Driven Paid Campaigns Focused on Measurable ROI
          </motion.p>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-12 max-w-4xl text-slate-400 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            transition={{ delay: 0.2 }}
          >
            WorkHolo Labs delivers strategic PPC advertising services designed
            to generate qualified traffic, increase conversions, and optimize
            advertising spend. Paid traffic should produce measurable growth —
            not wasted spend.
          </motion.p>
        </div>
      </section>

      {/* --- What Are PPC Services --- */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-24 md:grid-cols-2">
        <div>
          <h2 className="mb-6 font-bold text-4xl text-slate-900">
            What Are <span className="text-yellow-500">PPC Advertising</span>{" "}
            Services?
          </h2>
          <p className="mb-6 text-slate-600 leading-relaxed">
            PPC advertising services involve managing paid digital campaigns
            where advertisers pay only when users click — across search engines,
            social platforms, and display networks with keyword targeting,
            audience segmentation, bid optimization, and ROI analysis.
          </p>
          <p className="mb-6 text-slate-600 leading-relaxed">
            Our PPC campaigns integrate with{" "}
            <a
              className="font-semibold text-blue-600 underline underline-offset-4"
              href="#"
            >
              SEO strategies
            </a>{" "}
            for comprehensive visibility and{" "}
            <a
              className="font-semibold text-blue-600 underline underline-offset-4"
              href="#"
            >
              CRO
            </a>{" "}
            for maximum conversion rates.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Combined with{" "}
            <a
              className="font-semibold text-blue-600 underline underline-offset-4"
              href="#"
            >
              performance marketing
            </a>
            , we ensure every ad dollar drives measurable business outcomes.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Precision Targeting", icon: "🎯" },
            { title: "ROI Optimization", icon: "💰" },
            { title: "Real-Time Analytics", icon: "📊" },
            { title: "Continuous Testing", icon: "🔄" },
          ].map((item, i) => (
            <motion.div
              className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center transition-all hover:shadow-blue-500/5 hover:shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              key={item.title}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <div className="mb-4 text-4xl transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-800">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Business Benefits --- */}
      <section className="bg-slate-50 px-4 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-6">
            {[
              { val: "400+", label: "Campaigns Managed" },
              { val: "3.5x", label: "Avg ROAS" },
              { val: "35%", label: "Lower CPA" },
              { val: "14+", label: "Years Experience" },
            ].map((stat, i) => (
              <motion.div
                className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                key={stat.label}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <div className="mb-2 font-black text-4xl text-blue-500">
                  {stat.val}
                </div>
                <div className="font-bold text-slate-600 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <h2 className="mb-6 font-bold text-4xl text-slate-900">
              Business Benefits of{" "}
              <span className="text-yellow-500">PPC Advertising</span>
            </h2>
            <p className="mb-8 text-slate-600 leading-relaxed">
              Paid advertising complements long-term organic growth:
            </p>
            <ul className="space-y-4">
              {[
                "Immediate traffic & high-intent audience targeting",
                "Measurable ROI & scalable growth strategy",
                "Faster lead acquisition & controlled budgets",
                "Cross-platform paid media expertise",
                "Conversion-optimized landing alignment",
              ].map((item) => (
                <li
                  className="flex items-center gap-3 font-medium text-slate-700"
                  key={item}
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- Our PPC Capabilities --- */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <SectionHeading subtitle="From campaign planning to performance scaling">
          Our PPC <span className="text-yellow-500">Capabilities</span>
        </SectionHeading>

        <div className="grid gap-8 md:grid-cols-2">
          {capabilities.map((cap, i) => (
            <motion.div
              className={`rounded-3xl border border-slate-100 p-10 shadow-sm transition-all hover:shadow-xl ${i === 4 ? "md:col-span-2" : ""} group bg-white`}
              initial={{ opacity: 0, y: 20 }}
              key={cap.id}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 font-bold text-white text-xl transition-transform group-hover:rotate-6">
                {cap.id}
              </div>
              <h3 className="mb-4 font-bold text-2xl text-slate-900">
                {cap.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Execution Process --- */}
      <section className="overflow-hidden bg-blue-50/50 px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading subtitle="Structured cycle ensuring continuous performance improvement.">
            Our PPC <span className="text-yellow-500">Execution Process</span>
          </SectionHeading>

          <div className="relative flex flex-wrap justify-center gap-8 md:gap-4">
            <div className="absolute top-1/2 left-0 z-0 hidden h-0.5 w-full -translate-y-1/2 bg-blue-200 lg:block" />

            {processSteps.map((step, i) => (
              <motion.div
                className="group relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                key={step.id}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-blue-100 bg-white shadow-lg transition-colors group-hover:border-blue-500">
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-white text-xs">
                    {step.id}
                  </div>
                  <span className="font-bold text-slate-800 text-sm">
                    {step.name}
                  </span>
                </div>
                {i < processSteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-blue-300 lg:hidden" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Why Choose --- */}
      <section className="mx-auto max-w-7xl px-4 py-24 text-center">
        <SectionHeading subtitle="We focus on profitable growth, not vanity metrics.">
          Why Choose <span className="text-yellow-500">WorkHolo Labs</span>?
        </SectionHeading>

        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
          {[
            "Performance-focused campaigns",
            "Data-backed decisions",
            "Conversion-optimized landing",
            "Cross-platform expertise",
            "Transparent analytics",
            "Continuous refinement",
          ].map((tag, i) => (
            <motion.div
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition-colors hover:border-yellow-500"
              initial={{ opacity: 0, scale: 0.9 }}
              key={tag}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              {tag}
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Industries We Support --- */}
      <section className="bg-slate-50 px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>
            Industries We <span className="text-yellow-500">Support</span>
          </SectionHeading>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {industries.map((ind, i) => (
              <motion.div
                className="group rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm transition-all hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                key={ind.name}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6 flex justify-center transition-transform group-hover:scale-110">
                  {ind.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-xl">{ind.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Tech Stack --- */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-24 md:grid-cols-2">
        <div>
          <h2 className="mb-6 font-black text-5xl text-slate-900">
            PPC <span className="text-yellow-500">Technology Stack</span>
          </h2>
          <p className="mb-10 text-lg text-slate-600">
            Enterprise paid media platforms and analytics tools.
          </p>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <span
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 font-bold text-slate-600 text-sm"
                key={tech}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { val: "400+", label: "Campaigns" },
            { val: "3.5x", label: "Avg ROAS" },
            { val: "5+", label: "Ad Platforms" },
            { val: "14+", label: "Years" },
          ].map((stat) => (
            <div
              className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm"
              key={stat.label}
            >
              <div className="mb-2 font-black text-4xl text-blue-500">
                {stat.val}
              </div>
              <div className="font-bold text-slate-500 text-sm uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Our Leadership (Executives) --- */}
      <section className="mx-auto max-w-7xl px-4 py-24" id="executives">
        <SectionHeading subtitle="The experts driving your performance.">
          Our <span className="text-yellow-500">Leadership</span> Team
        </SectionHeading>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {executives.map((exec, i) => (
            <motion.div
              className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm transition-all hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              key={exec.name}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <img
                alt={exec.name}
                className="mx-auto mb-6 h-32 w-32 rounded-full border-4 border-slate-50 object-cover"
                referrerPolicy="no-referrer"
                src={exec.image}
              />
              <h3 className="font-bold text-slate-900 text-xl">{exec.name}</h3>
              <p className="font-medium text-blue-500">{exec.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Joint Talent Section --- */}
      <section className="bg-slate-50 px-4 py-24" id="joint-talent">
        <div className="mx-auto max-w-7xl">
          <SectionHeading subtitle="Our collaborative ecosystem for top-tier digital professionals.">
            Joint <span className="text-yellow-500">Talent</span> Program
          </SectionHeading>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <p className="text-lg text-slate-600 leading-relaxed">
                WorkHolo Labs' Joint Talent Program is a strategic initiative
                designed to bridge the gap between global enterprise needs and
                world-class digital talent.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Global Projects",
                    icon: <Globe className="h-5 w-5" />,
                  },
                  {
                    title: "Flexible Models",
                    icon: <Users className="h-5 w-5" />,
                  },
                  {
                    title: "Cutting-edge Tech",
                    icon: <Rocket className="h-5 w-5" />,
                  },
                  {
                    title: "Continuous Growth",
                    icon: <Star className="h-5 w-5" />,
                  },
                ].map((item) => (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                    key={item.title}
                  >
                    <div className="text-blue-500">{item.icon}</div>
                    <span className="font-bold text-slate-800 text-sm">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
              <h3 className="mb-6 font-bold text-2xl text-slate-900">
                Why Join Us?
              </h3>
              <ul className="space-y-4">
                {[
                  "Work with Fortune 500 brands on high-impact campaigns",
                  "Access to premium tools and enterprise-grade platforms",
                  "Collaborative environment with industry-leading experts",
                  "Competitive compensation and performance-based incentives",
                ].map((benefit) => (
                  <li
                    className="flex items-start gap-3 text-slate-600"
                    key={benefit}
                  >
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- Latest Jobs --- */}
      <section className="bg-slate-950 px-4 py-24 text-white" id="latest-jobs">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            light
            subtitle="Join our growing team of digital experts."
          >
            Latest <span className="text-yellow-500">Job Openings</span>
          </SectionHeading>
          <div className="grid gap-4">
            {latestJobs.map((job, i) => (
              <motion.div
                className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10 md:flex-row"
                initial={{ opacity: 0, x: -20 }}
                key={job.title}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <div>
                  <h3 className="font-bold text-xl">{job.title}</h3>
                  <p className="text-slate-400">
                    {job.location} • {job.type}
                  </p>
                </div>
                <button
                  className="rounded-full px-6 py-2 font-bold text-sm transition-transform hover:scale-105"
                  style={{ backgroundColor: PRIMARY_PURPLE }}
                >
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="bg-slate-50 px-4 py-24" id="faqs">
        <div className="mx-auto max-w-4xl">
          <SectionHeading subtitle="Everything about PPC advertising">
            Frequently Asked <span className="text-yellow-500">Questions</span>
          </SectionHeading>

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
            {faqs.map((faq) => (
              <FAQItem
                answer={faq.answer}
                key={faq.question}
                question={faq.question}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-24 text-center text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,#7B2CBF,transparent_70%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="mb-8 font-black text-5xl tracking-tight md:text-6xl">
            Maximize Your{" "}
            <span className="text-yellow-500">Ad Performance</span>
          </h2>
          <p className="mb-12 text-slate-400 text-xl leading-relaxed">
            Let's discuss how PPC can drive qualified leads and measurable
            revenue growth.
          </p>
          <button
            className="rounded-xl px-10 py-5 font-black text-white text-xl shadow-2xl shadow-purple-500/20 transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: PRIMARY_PURPLE }}
          >
            Start Your PPC Campaign
          </button>
        </div>
      </section>

      {/* --- Footer --- */}

      {/* --- Floating Widgets --- */}
      <div className="fixed right-8 bottom-8 z-[100] flex flex-col gap-4">
        {showScrollTop && (
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-2xl transition-transform hover:scale-110"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="h-6 w-6" />
          </button>
        )}
        <div className="group relative">
          <div className="absolute -top-12 right-0 whitespace-nowrap rounded-xl bg-white px-4 py-2 font-bold text-slate-800 text-sm opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            Let's <span className="text-yellow-500">CHAT!</span> HE...
          </div>
          <button className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-100 bg-white shadow-2xl">
            <MessageCircle className="h-8 w-8 text-slate-800" />
            <div className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-[10px] text-white">
              1
            </div>
          </button>
        </div>
        <button className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-green-500 text-white shadow-2xl transition-transform hover:scale-110">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-20" />
          <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
