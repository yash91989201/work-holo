import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  IconArrowRight,
  IconBuilding,
  IconChartBar,
  IconChartPie,
  IconChevronDown,
  IconChevronRight,
  IconCircleCheck,
  IconCreditCard,
  IconDeviceLaptop,
  IconGlobe,
  IconMinus,
  IconPlus,
  IconRocket,
  IconSearch,
  IconShoppingCart,
  IconStethoscope,
  IconTarget,
} from "@tabler/icons-react";

// --- Components ---

const Hero = () => (
  <section className="relative overflow-hidden bg-[#05070A] px-4 py-20 text-center text-white md:px-12">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,#7B2CBF,transparent_70%)]" />
    </div>
    <div className="relative z-10 mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-center gap-2 text-[12px] uppercase tracking-widest opacity-60">
        <span>Home</span>
        <IconChevronRight size={12} />
        <span>Services</span>
        <IconChevronRight size={12} />
        <span className="text-yellow-500">Digital Marketing Solutions</span>
      </div>
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 font-extrabold text-5xl leading-tight md:text-7xl"
        initial={{ opacity: 0, y: 20 }}
      >
        Digital <span className="text-yellow-500">Marketing</span> Solutions
      </motion.h1>
      <motion.p
        animate={{ opacity: 1 }}
        className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed opacity-80 md:text-xl"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        Integrated Growth Strategies Powered by Data, Performance & Technology
      </motion.p>
      <motion.p
        animate={{ opacity: 1 }}
        className="mx-auto max-w-2xl text-sm italic opacity-60 md:text-base"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        WorkHolo Labs delivers structured digital marketing solutions designed
        to help businesses attract, convert, and retain customers through
        measurable performance strategies. Marketing should generate predictable
        growth, not unpredictable spending.
      </motion.p>
    </div>
  </section>
);

const WhatAreSolutions = () => (
  <section className="bg-white px-4 py-24 md:px-12">
    <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <h2 className="mb-8 font-bold text-4xl text-[#05070A]">
          What Are{" "}
          <span className="text-yellow-500">Digital Marketing Solutions?</span>
        </h2>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            Digital marketing solutions encompass a coordinated set of
            strategies designed to increase online visibility, generate
            qualified leads, and improve conversion outcomes — including search
            optimization, paid acquisition, audience targeting, conversion
            funnels, and analytics.
          </p>
          <p>
            Our{" "}
            <span className="font-semibold text-blue-600 underline">
              SEO services
            </span>{" "}
            build sustainable organic authority, while{" "}
            <span className="font-semibold text-blue-600 underline">
              PPC campaigns
            </span>{" "}
            drive immediate qualified traffic.
          </p>
          <p>
            Combined with{" "}
            <span className="font-semibold text-blue-600 underline">
              conversion optimization
            </span>{" "}
            and{" "}
            <span className="font-semibold text-blue-600 underline">
              content marketing
            </span>
            , we create scalable digital growth systems that deliver long-term,
            measurable performance.
          </p>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-6">
        {[
          {
            icon: <IconSearch className="text-blue-500" />,
            title: "Search Optimization",
          },
          {
            icon: <IconTarget className="text-[#7B2CBF]" />,
            title: "Paid Acquisition",
          },
          {
            icon: <IconChartBar className="text-pink-500" />,
            title: "Conversion Funnels",
          },
          {
            icon: <IconChartPie className="text-green-500" />,
            title: "Analytics & Reporting",
          },
        ].map((item, idx) => (
          <motion.div
            className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            key={idx}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
              {item.icon}
            </div>
            <h3 className="font-bold text-gray-800">{item.title}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const MarketingApproach = () => (
  <section className="bg-[#F8FAFC] px-4 py-24 md:px-12">
    <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
      <div className="grid grid-cols-2 gap-6">
        {[
          { val: "500+", label: "Campaigns Managed" },
          { val: "3x", label: "Avg ROI Improvement" },
          { val: "14+", label: "Years Experience" },
          { val: "5", label: "Marketing Channels" },
        ].map((stat, idx) => (
          <motion.div
            className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            key={idx}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <div className="mb-2 font-black text-4xl text-blue-600">
              {stat.val}
            </div>
            <div className="font-medium text-gray-500 text-sm">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <h2 className="mb-4 font-bold text-4xl text-[#05070A]">
          Technology-Integrated{" "}
          <span className="text-yellow-500">Marketing Approach</span>
        </h2>
        <p className="mb-8 text-gray-600">
          Our solutions integrate with technology infrastructure:
        </p>
        <ul className="space-y-4">
          {[
            "CRM platforms & marketing automation tools",
            "Analytics systems & AI-powered optimization",
            "Cloud-based data tracking environments",
            "Cross-channel performance measurement",
            "Measurable ROI tracking & attribution",
          ].map((item, idx) => (
            <li className="flex items-center gap-3 text-gray-700" key={idx}>
              <IconCircleCheck className="text-yellow-500" size={20} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
);

const Capabilities = () => (
  <section className="bg-white px-4 py-24 md:px-12">
    <div className="mx-auto mb-16 max-w-7xl text-center">
      <h2 className="mb-4 font-bold text-4xl text-[#05070A]">
        Our Marketing <span className="text-yellow-500">Capabilities</span>
      </h2>
      <p className="text-gray-500">From strategy to scalable execution</p>
    </div>
    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
      {[
        {
          id: "01",
          title: "SEO & Organic Growth",
          desc: "Technical website optimization, content relevance enhancement, keyword strategy, and search performance metrics for sustainable authority building.",
        },
        {
          id: "02",
          title: "Performance Advertising",
          desc: "High-intent search campaigns, precision audience targeting, cost-efficient acquisition models, data-driven bidding, and continuous ROI optimization.",
        },
        {
          id: "03",
          title: "App Growth & ASO",
          desc: "App store optimization, install growth campaigns, engagement-based remarketing, and conversion optimization bridging development and marketing.",
        },
        {
          id: "04",
          title: "Conversion Optimization",
          desc: "Funnel analysis, user behavior tracking, landing page refinement, A/B testing, and engagement improvement turning traffic into revenue.",
        },
        {
          id: "05",
          title: "Content & Analytics",
          desc: "Search-aligned content strategy, thought leadership positioning, performance dashboards, attribution tracking, and data-driven decision reporting.",
        },
      ].map((item, idx) => (
        <motion.div
          className={`rounded-2xl border border-gray-100 bg-[#F8FAFC] p-10 transition-all hover:border-blue-200 ${idx === 4 ? "md:col-span-2" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          key={idx}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 font-bold text-white">
            {item.id}
          </div>
          <h3 className="mb-4 font-bold text-2xl text-gray-800">
            {item.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const GrowthFramework = () => (
  <section className="overflow-hidden bg-white px-4 py-24 md:px-12">
    <div className="mx-auto mb-20 max-w-7xl text-center">
      <h2 className="mb-4 font-bold text-4xl text-[#05070A]">
        Our Growth <span className="text-yellow-500">Framework</span>
      </h2>
      <p className="text-gray-500">
        Structured approach ensuring predictable performance improvements.
      </p>
    </div>
    <div className="relative mx-auto max-w-7xl">
      <div className="absolute top-1/2 left-0 z-0 hidden h-0.5 w-full -translate-y-1/2 bg-gray-100 lg:block" />
      <div className="relative z-10 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
        {[
          "Assessment",
          "Channel Plan",
          "Deployment",
          "Monitoring",
          "Optimization",
          "Scale",
        ].map((step, idx) => (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            key={idx}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-blue-500 bg-white shadow-lg">
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 font-bold text-[10px] text-white">
                {idx + 1}
              </span>
              <span className="px-2 text-center font-bold text-gray-800">
                {step}
              </span>
            </div>
            {idx < 5 && (
              <IconArrowRight className="mb-4 text-blue-500 lg:hidden" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const WhyChoose = () => (
  <section className="bg-white px-4 py-24 text-center md:px-12">
    <h2 className="mb-6 font-bold text-4xl text-[#05070A]">
      Why Choose <span className="text-yellow-500">WorkHolo Labs?</span>
    </h2>
    <p className="mb-12 text-gray-500">
      We focus on sustainable digital growth — not vanity metrics.
    </p>
    <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
      {[
        "Performance-focused strategy",
        "Data-backed decision models",
        "Dev & analytics integration",
        "Cross-channel expertise",
        "Measurable ROI tracking",
        "Continuous optimization",
      ].map((tag, idx) => (
        <motion.div
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 text-sm shadow-sm"
          key={idx}
          whileHover={{ scale: 1.05 }}
        >
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          {tag}
        </motion.div>
      ))}
    </div>
  </section>
);

const Industries = () => (
  <section className="bg-[#F8FAFC] px-4 py-24 md:px-12">
    <div className="mx-auto mb-16 max-w-7xl text-center">
      <h2 className="mb-4 font-bold text-4xl text-[#05070A]">
        Industries We <span className="text-yellow-500">Support</span>
      </h2>
    </div>
    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[
        {
          icon: <IconDeviceLaptop className="text-blue-500" />,
          title: "Technology & SaaS",
        },
        {
          icon: <IconShoppingCart className="text-purple-500" />,
          title: "eCommerce & Retail",
        },
        {
          icon: <IconStethoscope className="text-red-500" />,
          title: "Healthcare Platforms",
        },
        {
          icon: <IconCreditCard className="text-green-500" />,
          title: "Financial Services",
        },
        {
          icon: <IconBuilding className="text-gray-700" />,
          title: "Enterprise Businesses",
        },
        {
          icon: <IconRocket className="text-orange-500" />,
          title: "Startup Growth",
        },
      ].map((industry, idx) => (
        <motion.div
          className="flex flex-col items-center gap-6 rounded-2xl border border-gray-100 bg-white p-12 shadow-sm transition-all hover:shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          key={idx}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-50">
            {industry.icon}
          </div>
          <h3 className="font-bold text-gray-800 text-xl">{industry.title}</h3>
        </motion.div>
      ))}
    </div>
  </section>
);

const TechStack = () => (
  <section className="bg-white px-4 py-24 md:px-12">
    <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
      <div>
        <h2 className="mb-6 font-bold text-4xl text-[#05070A]">
          Marketing <span className="text-yellow-500">Technology Stack</span>
        </h2>
        <p className="mb-10 text-gray-600">
          Enterprise marketing platforms and analytics tools.
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            "Google Ads",
            "Meta Ads",
            "LinkedIn Ads",
            "Google Analytics 4",
            "Google Search Console",
            "SEMrush",
            "Ahrefs",
            "Moz",
            "HubSpot",
            "Mailchimp",
            "Klaviyo",
            "Hotjar",
            "Optimizely",
            "Salesforce CRM",
            "Looker Studio",
            "Tag Manager",
            "Facebook Pixel",
            "Zapier",
          ].map((tool, idx) => (
            <span
              className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-gray-600 text-xs"
              key={idx}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[
          { val: "18+", label: "Marketing Tools" },
          { val: "5", label: "Channels" },
          { val: "500+", label: "Campaigns" },
          { val: "ROI", label: "Focused" },
        ].map((card, idx) => (
          <div
            className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm"
            key={idx}
          >
            <div className="mb-2 font-black text-4xl text-blue-600">
              {card.val}
            </div>
            <div className="font-medium text-gray-500 text-sm">
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = [
    {
      q: "What are digital marketing solutions?",
      a: "Digital marketing solutions are integrated strategies that leverage online channels to reach, engage, and convert target audiences. This includes SEO, PPC, content marketing, and more.",
    },
    {
      q: "How are they different from basic marketing?",
      a: "Unlike traditional marketing, digital solutions offer precise targeting, real-time tracking, and data-driven optimization to ensure every dollar spent contributes to growth.",
    },
    {
      q: "Can digital marketing improve ROI?",
      a: "Yes, by focusing on high-intent audiences and optimizing conversion funnels, digital marketing significantly lowers acquisition costs and increases lifetime value.",
    },
    {
      q: "Do you provide performance tracking?",
      a: "Absolutely. We provide comprehensive dashboards that track key metrics like CPC, CTR, conversion rates, and overall ROI in real-time.",
    },
  ];

  return (
    <section className="bg-[#F8FAFC] px-4 py-24 md:px-12">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="mb-4 font-bold text-4xl text-[#05070A]">
          Frequently Asked <span className="text-yellow-500">Questions</span>
        </h2>
        <p className="text-gray-500">
          Everything about digital marketing solutions
        </p>
      </div>
      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((faq, idx) => (
          <div
            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
            key={idx}
          >
            <button
              className="flex w-full items-center justify-between p-6 text-left font-bold text-gray-800 transition-colors hover:bg-gray-50"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              {faq.q}
              {openIdx === idx ? (
                <IconMinus size={20} />
              ) : (
                <IconPlus size={20} />
              )}
            </button>
            <AnimatePresence>
              {openIdx === idx && (
                <motion.div
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-6 pb-6 text-gray-600 leading-relaxed"
                  exit={{ height: 0, opacity: 0 }}
                  initial={{ height: 0, opacity: 0 }}
                >
                  {faq.a}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="relative overflow-hidden bg-[#05070A] px-4 py-24 text-center text-white md:px-12">
    <div className="absolute top-0 right-0 h-64 w-64 bg-blue-600 opacity-20 blur-[100px]" />
    <div className="absolute bottom-0 left-0 h-64 w-64 bg-[#7B2CBF] opacity-20 blur-[100px]" />
    <div className="relative z-10 mx-auto max-w-4xl">
      <h2 className="mb-8 font-black text-5xl leading-tight">
        Accelerate Your <span className="text-yellow-500">Digital Growth</span>
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-xl opacity-80">
        Let's discuss how our marketing solutions can drive measurable business
        growth.
      </p>
      <button className="rounded-xl bg-yellow-500 px-10 py-4 font-bold text-[#05070A] text-lg shadow-xl shadow-yellow-500/20 transition-all hover:bg-yellow-600">
        Start Your Growth Strategy
      </button>
    </div>
  </section>
);

const GlobalPresence = () => (
  <section className="border-white/10 border-t bg-[#05070A] px-4 py-24 text-white md:px-12">
    <div className="mx-auto max-w-7xl">
      <div className="mb-16 flex items-center gap-3 font-bold text-xl">
        <IconGlobe className="text-blue-500" />
        Global Presence
      </div>
      <div className="grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-5">
        {[
          {
            region: "INDIA",
            cities: [
              "Hyderabad",
              "Bangalore",
              "Chennai",
              "Coimbatore",
              "Kochi",
            ],
          },
          { region: "AMERICAS", cities: ["United States", "Canada"] },
          {
            region: "EUROPE",
            cities: ["United Kingdom", "Germany", "Ireland"],
          },
          {
            region: "ASIA PACIFIC",
            cities: ["Singapore", "Australia", "New Zealand", "India"],
          },
          {
            region: "MIDDLE EAST",
            cities: ["UAE", "Dubai", "Saudi Arabia", "Qatar", "Kuwait"],
          },
        ].map((loc, idx) => (
          <div key={idx}>
            <div className="mb-8 flex items-center gap-2 font-black text-[11px] text-blue-400 tracking-widest">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              {loc.region}
            </div>
            <ul className="space-y-4 text-sm opacity-60">
              {loc.cities.map((city, cIdx) => (
                <li
                  className="cursor-pointer transition-colors hover:text-white"
                  key={cIdx}
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- Main App ---

export default function DigitalMarketing() {
  return (
    <div className="font-sans text-[#05070A] selection:bg-[#7B2CBF] selection:text-white">
      <Hero />
      <WhatAreSolutions />
      <MarketingApproach />
      <Capabilities />
      <GrowthFramework />
      <WhyChoose />
      <Industries />
      <TechStack />
      <FAQ />
      <CTA />
      <GlobalPresence />

      {/* Floating WhatsApp Icon */}
      <div className="group fixed right-8 bottom-8 z-[100]">
        <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-20" />
        <div className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white shadow-2xl transition-transform hover:scale-110">
          <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.389l-.72 2.634 2.693-.706c.823.527 1.798.83 2.841.83 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm3.39 8.191c-.145.405-.72.739-1.01.768-.29.029-.652.029-1.01-.073-.358-.101-.812-.261-1.377-.507-2.391-1.043-3.942-3.478-4.058-3.637-.116-.159-.942-1.246-.942-2.376 0-1.13.58-1.681.783-1.913.203-.232.435-.29.58-.29.145 0 .29 0 .405.014.116.014.261-.058.405.29.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.188.232-.261.304-.087.087-.188.188-.087.362.101.174.449.739.956 1.188.652.58 1.203.754 1.377.841.174.087.275.072.377-.043.101-.116.435-.507.551-.681.116-.174.232-.145.391-.087.159.058 1.014.478 1.188.565.174.087.29.13.333.203.043.072.043.42-.101.826z" />
          </svg>
        </div>
      </div>

      {/* Back to Top */}
      <div className="fixed right-28 bottom-8 z-[100]">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-colors hover:bg-blue-700"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <IconChevronDown className="rotate-180" />
        </button>
      </div>
    </div>
  );
}
