import {
  IconActivity,
  IconBolt,
  IconBuilding,
  IconChartPie,
  IconChevronDown,
  IconChevronRight,
  IconCircleCheck,
  IconCreditCard,
  IconDeviceDesktop,
  IconRocket,
  IconShoppingCart,
  IconStethoscope,
  IconTrendingUp,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export const Route = createFileRoute(
  "/(public)/services/conversion-rate-optimization"
)({
  component: ConversionRateOptimization,
});

// --- Components ---

const Hero = () => (
  <section className="relative overflow-hidden bg-[#0B0E14] pt-48 pb-32">
    {/* Background Glows */}
    <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
      <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[50%] w-[50%] rounded-full bg-purple-600/10 blur-[150px]" />
    </div>

    <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center md:px-12">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <nav className="mb-10 flex items-center justify-center gap-3 font-medium text-[14px] text-gray-400">
          <span className="cursor-pointer hover:text-white">Home</span>
          <IconChevronRight className="h-3.5 w-3.5" />
          <span className="cursor-pointer hover:text-white">Services</span>
          <IconChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#F2A93B]">Conversion Rate Optimization</span>
        </nav>

        <h1 className="mb-10 font-display font-extrabold text-5xl text-white leading-[1.1] tracking-[-0.03em] md:text-[80px]">
          Conversion Rate <span className="text-[#F2A93B]">Optimization</span>{" "}
          <br /> Services
        </h1>

        <p className="mx-auto mb-14 max-w-4xl font-medium text-gray-300 text-xl leading-tight md:text-[28px]">
          Turning Website Traffic Into Measurable Revenue Growth
        </p>

        <p className="mx-auto mb-16 max-w-5xl font-light text-gray-400 text-lg italic leading-relaxed md:text-xl">
          WorkHolo Labs delivers strategic CRO services designed to maximize the
          value of existing website traffic. Traffic without conversion is
          wasted potential.
        </p>

        <motion.button
          className="rounded-xl bg-[#7B2CBF] px-12 py-5 font-bold text-lg text-white shadow-2xl shadow-purple-900/20 transition-all hover:bg-[#6A24A3]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start CRO Strategy
        </motion.button>
      </motion.div>
    </div>
  </section>
);

const WhatIsCRO = () => {
  const cards = [
    {
      icon: <IconChartPie className="h-10 w-10 text-blue-500" />,
      title: "Funnel Analysis",
    },
    {
      icon: <IconBolt className="h-10 w-10 text-green-500" />,
      title: "A/B Testing",
    },
    {
      icon: <IconActivity className="h-10 w-10 text-orange-500" />,
      title: "Heatmap Analysis",
    },
    {
      icon: <IconTrendingUp className="h-10 w-10 text-purple-500" />,
      title: "Revenue Growth",
    },
  ];

  return (
    <section className="bg-white py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid items-center gap-24 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="mb-10 font-bold font-display text-4xl text-[#141414] leading-tight md:text-[56px]">
              What Are <span className="text-[#F2A93B]">CRO Services</span>?
            </h2>
            <div className="space-y-8 text-[19px] text-gray-600 leading-[1.6]">
              <p>
                CRO services analyze user behavior and improve digital
                touchpoints to increase the percentage of visitors who complete
                desired actions — including funnel analysis, A/B testing,
                landing page refinement, and performance monitoring.
              </p>
              <p>
                Our CRO integrates with{" "}
                <span className="font-bold text-blue-600">SEO</span> and{" "}
                <span className="font-bold text-blue-600">PPC strategies</span>{" "}
                to maximize campaign ROI and overall digital performance.
              </p>
              <p>
                Combined with{" "}
                <span className="font-bold text-blue-600">UX design</span>{" "}
                expertise, we create data-driven optimization frameworks that
                increase conversions without increasing traffic costs.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-8">
            {cards.map((card, idx) => (
              <motion.div
                className="flex flex-col items-center rounded-[32px] border border-gray-100 bg-[#F8F9FA] p-12 text-center transition-all"
                initial={{ opacity: 0, y: 20 }}
                key={idx}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -12,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6 transform transition-transform group-hover:scale-110">
                  {card.icon}
                </div>
                <h3 className="font-bold font-display text-[#141414] text-xl">
                  {card.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const BusinessBenefits = () => {
  const stats = [
    { value: "250+", label: "CRO Projects" },
    { value: "45%", label: "Avg Conversion Lift" },
    { value: "30%", label: "Lower CPA" },
    { value: "14+", label: "Years Experience" },
  ];

  const benefits = [
    "Increased revenue from existing traffic",
    "Reduced cost per acquisition & higher ROI",
    "Improved user engagement & data-backed decisions",
    "UX-informed decision framework",
    "Structured experimentation models",
  ];

  return (
    <section className="bg-[#F8F9FA] py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid items-center gap-24 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                className="rounded-[32px] border border-gray-100 bg-white p-12 text-center shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                key={idx}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <div className="mb-3 font-black text-[52px] text-blue-600 leading-none tracking-tighter">
                  {stat.value}
                </div>
                <div className="font-bold text-gray-500 text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="mb-10 font-bold font-display text-4xl text-[#141414] leading-tight md:text-[56px]">
              Business Benefits of <span className="text-[#F2A93B]">CRO</span>
            </h2>
            <p className="mb-10 font-medium text-[20px] text-gray-600">
              CRO maximizes efficiency across digital channels:
            </p>
            <ul className="space-y-6">
              {benefits.map((benefit, idx) => (
                <li
                  className="flex items-start gap-4 font-medium text-[19px] text-gray-700"
                  key={idx}
                >
                  <IconCircleCheck className="mt-0.5 h-7 w-7 shrink-0 text-yellow-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Capabilities = () => {
  const items = [
    {
      id: "01",
      title: "Funnel Analysis",
      desc: "Entry sources, landing page interactions, drop-off points, checkout friction, and retention bottleneck evaluation.",
    },
    {
      id: "02",
      title: "Landing Page Optimization",
      desc: "Headline clarity, messaging alignment, CTA placement, page structure, speed performance, and mobile responsiveness.",
    },
    {
      id: "03",
      title: "A/B Testing",
      desc: "Variant testing, CTA experiments, layout restructuring, offer positioning comparison, and micro-conversion analysis.",
    },
    {
      id: "04",
      title: "Behavior & Heatmaps",
      desc: "Click tracking, scroll depth analysis, engagement patterns, session recordings, and behavioral insight-driven optimization.",
    },
  ];

  return (
    <section className="bg-white py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-20 text-center">
          <h2 className="mb-6 font-bold font-display text-4xl text-[#141414] md:text-[56px]">
            Our CRO <span className="text-[#F2A93B]">Capabilities</span>
          </h2>
          <p className="font-medium text-[22px] text-gray-500">
            From funnel analysis to revenue optimization
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {items.map((item, idx) => (
            <motion.div
              className="group relative rounded-[40px] border border-gray-100 bg-[#F8F9FA] p-14 transition-all"
              initial={{ opacity: 0, y: 30 }}
              key={idx}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-black text-lg text-white shadow-blue-200 shadow-lg">
                {item.id}
              </div>
              <h3 className="mb-6 font-bold font-display text-[#141414] text-[28px] leading-tight">
                {item.title}
              </h3>
              <p className="font-medium text-[19px] text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Framework = () => {
  const steps = [
    { id: 1, title: "Audit" },
    { id: 2, title: "Behavior" },
    { id: 3, title: "Hypothesis" },
    { id: 4, title: "A/B Test" },
    { id: 5, title: "Validate" },
    { id: 6, title: "Iterate" },
  ];

  return (
    <section className="border-gray-100 border-t bg-white py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-24 text-center">
          <h2 className="mb-6 font-bold font-display text-4xl text-[#141414] md:text-[56px]">
            Our CRO <span className="text-[#F2A93B]">Framework</span>
          </h2>
          <p className="font-medium text-[22px] text-gray-500">
            Optimization is continuous, not one-time.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-8 md:gap-0">
          <div className="absolute top-1/2 left-0 hidden h-[2px] w-full -translate-y-1/2 bg-blue-100 md:block" />

          {steps.map((step, idx) => (
            <div
              className="relative z-10 flex items-center justify-center md:flex-1"
              key={idx}
            >
              <motion.div
                className="group w-48 rounded-[36px] border-[3px] border-blue-100 bg-white p-10 text-center shadow-xl transition-all hover:border-blue-600 md:w-56 md:p-12"
                whileHover={{ scale: 1.1 }}
              >
                <div className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-black text-base text-white shadow-lg">
                  {step.id}
                </div>
                <span className="font-bold font-display text-gray-800 text-xl">
                  {step.title}
                </span>
              </motion.div>
              {idx < steps.length - 1 && (
                <div className="mx-4 hidden md:block">
                  <IconChevronRight className="h-8 w-8 text-blue-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChoose = () => {
  const features = [
    "Data-first methodology",
    "SEO & PPC integration",
    "UX-informed decisions",
    "Structured experimentation",
    "Transparent analytics",
    "Continuous improvement",
  ];

  return (
    <section className="bg-[#F8F9FA] py-32">
      <div className="mx-auto max-w-[1440px] px-6 text-center md:px-12">
        <h2 className="mb-8 font-bold font-display text-4xl text-[#141414] md:text-[56px]">
          Why Choose <span className="text-[#F2A93B]">WorkHolo Labs</span>?
        </h2>
        <p className="mx-auto mb-16 max-w-3xl font-medium text-[22px] text-gray-500">
          We transform website performance into measurable business growth.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {features.map((feature, idx) => (
            <motion.div
              className="flex items-center gap-4 rounded-full border border-gray-200 bg-white px-10 py-5 shadow-sm"
              key={idx}
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <span className="font-bold text-[18px] text-gray-700">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Industries = () => {
  const industries = [
    {
      title: "SaaS & Subscriptions",
      icon: <IconDeviceDesktop className="h-14 w-14 text-blue-500" />,
    },
    {
      title: "eCommerce & Retail",
      icon: <IconShoppingCart className="h-14 w-14 text-green-500" />,
    },
    {
      title: "Financial Services",
      icon: <IconCreditCard className="h-14 w-14 text-blue-400" />,
    },
    {
      title: "Healthcare",
      icon: <IconStethoscope className="h-14 w-14 text-red-400" />,
    },
    {
      title: "Enterprise B2B",
      icon: <IconBuilding className="h-14 w-14 text-gray-600" />,
    },
    {
      title: "Startup Growth",
      icon: <IconRocket className="h-14 w-14 text-orange-500" />,
    },
  ];

  return (
    <section className="bg-white py-32">
      <div className="mx-auto max-w-[1440px] px-6 text-center md:px-12">
        <h2 className="mb-20 font-bold font-display text-4xl text-[#141414] md:text-[56px]">
          Industries We <span className="text-[#F2A93B]">Support</span>
        </h2>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, idx) => (
            <motion.div
              className="group flex flex-col items-center justify-center rounded-[48px] border border-gray-100 bg-[#F8F9FA] p-16 transition-all"
              initial={{ opacity: 0, y: 20 }}
              key={idx}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -15, boxShadow: "0 30px 60px rgba(0,0,0,0.08)" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="mb-8 transform transition-transform group-hover:scale-110">
                {industry.icon}
              </div>
              <h3 className="font-bold font-display text-2xl text-[#141414]">
                {industry.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStack = () => {
  const tools = [
    "Optimizely",
    "VWO",
    "Google Optimize",
    "Hotjar",
    "Crazy Egg",
    "FullStory",
    "Google Analytics 4",
    "Mixpanel",
    "Amplitude",
    "Unbounce",
    "Instapage",
    "Mouseflow",
    "Lucky Orange",
    "Heap Analytics",
    "Looker Studio",
    "Tag Manager",
    "Figma",
    "UserTesting",
  ];

  const stats = [
    { value: "250+", label: "CRO Projects" },
    { value: "45%", label: "Avg Lift" },
    { value: "18+", label: "Tools" },
    { value: "14+", label: "Years" },
  ];

  return (
    <section className="bg-white py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid items-center gap-24 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 font-bold font-display text-4xl text-[#141414] md:text-[56px]">
              CRO <span className="text-[#F2A93B]">Technology</span> Stack
            </h2>
            <p className="mb-12 font-medium text-[22px] text-gray-500">
              Enterprise optimization and analytics platforms.
            </p>

            <div className="flex flex-wrap gap-4">
              {tools.map((tool, idx) => (
                <span
                  className="cursor-default rounded-full border border-gray-200 bg-gray-50 px-6 py-3 font-bold text-[15px] text-gray-600 transition-all hover:bg-white hover:shadow-md"
                  key={idx}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                className="rounded-[40px] border border-gray-100 bg-white p-14 text-center shadow-sm"
                key={idx}
                whileHover={{ scale: 1.05 }}
              >
                <div className="mb-3 font-black text-[52px] text-blue-600 leading-none tracking-tighter">
                  {stat.value}
                </div>
                <div className="font-bold text-gray-500 text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What are CRO services?",
      a: "CRO services analyze user behavior and improve digital touchpoints to increase the percentage of visitors who complete desired actions — including funnel analysis, A/B testing, landing page refinement, and performance monitoring.",
    },
    {
      q: "How does CRO increase revenue?",
      a: "By optimizing the conversion funnel, we ensure that more of your existing traffic converts into paying customers, effectively lowering your acquisition costs and increasing overall profitability.",
    },
    {
      q: "How long does CRO take?",
      a: "CRO is an ongoing process. Initial audits and setup take 2-4 weeks, while significant results from A/B testing typically appear within 2-3 months of continuous experimentation.",
    },
    {
      q: "Is CRO necessary with PPC?",
      a: "Absolutely. CRO makes your PPC campaigns more profitable by ensuring the traffic you pay for actually converts on your landing pages, maximizing your return on ad spend.",
    },
  ];

  return (
    <section className="bg-white py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-20 text-center">
          <h2 className="mb-6 font-bold font-display text-4xl text-[#141414] md:text-[56px]">
            Frequently Asked <span className="text-[#F2A93B]">Questions</span>
          </h2>
          <p className="font-medium text-[22px] text-gray-500">
            Everything about CRO services
          </p>
        </div>

        <div className="mx-auto max-w-5xl space-y-6">
          {faqs.map((faq, idx) => (
            <div className="border-gray-100 border-b" key={idx}>
              <button
                className="group flex w-full items-center justify-between py-8 text-left"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span className="font-bold font-display text-[22px] text-gray-800 transition-colors group-hover:text-blue-600">
                  {faq.q}
                </span>
                <div
                  className={`transition-transform duration-300 ${openIdx === idx ? "rotate-180" : ""}`}
                >
                  <IconChevronDown className="h-7 w-7 text-gray-400" />
                </div>
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                  >
                    <p className="pb-10 font-medium text-[19px] text-gray-600 leading-[1.7]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="relative overflow-hidden bg-[#0B0E14] py-32 text-center">
    <div className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-20">
      <div className="absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 blur-[180px]" />
    </div>

    <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12">
      <h2 className="mb-10 font-display font-extrabold text-4xl text-white leading-tight tracking-tight md:text-[72px]">
        Maximize Your <span className="text-[#F2A93B]">Conversion Rate</span>
      </h2>
      <p className="mx-auto mb-16 max-w-3xl font-medium text-[24px] text-gray-300 leading-relaxed">
        Let's discuss how CRO can turn your existing traffic into measurable
        revenue.
      </p>
      <motion.button
        className="rounded-2xl bg-[#7B2CBF] px-16 py-6 font-black text-white text-xl shadow-2xl shadow-purple-900/40 transition-all hover:bg-[#6A24A3]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start CRO Strategy
      </motion.button>
    </div>
  </section>
);

// --- Main App ---

export default function ConversionRateOptimization() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#7B2CBF] selection:text-white">
      <main>
        <Hero />
        <WhatIsCRO />
        <BusinessBenefits />
        <Capabilities />
        <Framework />
        <WhyChoose />
        <Industries />
        <TechStack />
        <FAQ />
        <CTA />
      </main>
    </div>
  );
}
