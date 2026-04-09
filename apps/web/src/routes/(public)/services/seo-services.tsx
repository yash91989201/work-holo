import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useState } from "react";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowUp,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  HeartPulse,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  Monitor,
  Rocket,
  ShoppingCart,
} from "lucide-react";

// --- Types ---

interface StatItem {
  label: string;
  value: string;
}

interface CapabilityItem {
  description: string;
  id: string;
  title: string;
}

interface IndustryItem {
  icon: React.ReactNode;
  title: string;
}

interface FaqItem {
  answer: string;
  question: string;
}

// --- Components ---

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#050B18] pt-48 pb-32">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#00A3FF]/10 blur-[120px]" />
      <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-[#7B2CBF]/10 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex items-center justify-center space-x-2">
            <span className="text-sm text-white/50 uppercase tracking-[0.3em]">
              Home
            </span>
            <span className="text-white/30">/</span>
            <span className="text-sm text-white/50 uppercase tracking-[0.3em]">
              Services
            </span>
            <span className="text-white/30">/</span>
            <span className="font-bold text-[#FF9D00] text-sm uppercase tracking-[0.3em]">
              SEO Services
            </span>
          </div>

          <h1 className="mb-8 font-black text-5xl text-white tracking-tight lg:text-7xl">
            <span className="text-[#FF9D00]">SEO</span> Services
          </h1>

          <h2 className="mx-auto mb-6 max-w-4xl font-bold text-2xl text-white/90 leading-tight lg:text-3xl">
            Strategic Search Engine Optimization for Sustainable Organic Growth
          </h2>

          <p className="mx-auto mb-12 max-w-3xl text-lg text-white/60 leading-relaxed lg:text-xl">
            WorkHolo Labs provides performance-driven SEO services designed to
            increase search visibility, strengthen domain authority, and
            generate high-intent organic traffic. Organic visibility is not
            accidental — it is engineered.
          </p>

          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <button className="transform rounded-lg bg-[#7B2CBF] px-10 py-4 font-bold text-lg text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:bg-[#6A24A3]">
              Start Your SEO Strategy
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const WhatIsSeo = () => {
  const cards = [
    {
      icon: <Monitor className="h-8 w-8 text-[#00A3FF]" />,
      title: "Technical SEO",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-[#00A3FF]" />,
      title: "Content Strategy",
    },
    {
      icon: <LinkIcon className="h-8 w-8 text-[#00A3FF]" />,
      title: "Authority Building",
    },
    { icon: <MapPin className="h-8 w-8 text-[#00A3FF]" />, title: "Local SEO" },
  ];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 font-black text-4xl text-[#1F2937]">
              What Are <span className="text-[#FF9D00]">SEO Services</span>?
            </h2>
            <p className="mb-6 text-[#4B5563] text-lg leading-relaxed">
              SEO services involve optimizing a website's technical structure,
              content relevance, and authority signals to improve search engine
              rankings — including technical auditing, on-page optimization,
              content strategy, authority development, and performance
              monitoring.
            </p>
            <p className="mb-8 text-[#4B5563] text-lg leading-relaxed">
              Our SEO work integrates with{" "}
              <span className="font-bold text-[#00A3FF]">
                content marketing
              </span>{" "}
              and{" "}
              <span className="font-bold text-[#00A3FF]">
                conversion optimization
              </span>{" "}
              for comprehensive digital growth.
            </p>
            <p className="text-[#4B5563] text-lg leading-relaxed">
              Combined with{" "}
              <span className="font-bold text-[#00A3FF]">web development</span>{" "}
              expertise, we ensure technical foundations support long-term
              ranking stability.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {cards.map((card, idx) => (
              <motion.div
                className="group flex flex-col items-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center transition-all"
                key={idx}
                whileHover={{ y: -10 }}
              >
                <div className="mb-4 rounded-xl bg-white p-4 shadow-sm transition-all group-hover:shadow-md">
                  {card.icon}
                </div>
                <h3 className="font-bold text-[#1F2937] text-lg">
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

const Outcomes = () => {
  const stats: StatItem[] = [
    { value: "300+", label: "SEO Projects" },
    { value: "85%", label: "Page 1 Rankings" },
    { value: "3-6", label: "Months to Results" },
    { value: "14+", label: "Years Experience" },
  ];

  const benefits = [
    "Increased organic traffic & higher search rankings",
    "Improved keyword positioning & domain authority",
    "Better user engagement & reduced paid dependency",
    "Technical development expertise integration",
    "Continuous algorithm alignment & transparent reporting",
  ];

  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div
                className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm"
                key={idx}
              >
                <div className="mb-2 font-black text-4xl text-[#00A3FF]">
                  {stat.value}
                </div>
                <div className="font-bold text-[#4B5563] text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="mb-4 font-black text-4xl text-[#1F2937]">
              Measurable Outcomes of{" "}
              <span className="text-[#FF9D00]">Structured SEO</span>
            </h2>
            <p className="mb-8 text-[#4B5563] text-lg">
              SEO builds long-term digital equity:
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, idx) => (
                <li className="flex items-start" key={idx}>
                  <CheckCircle2 className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-[#FF9D00]" />
                  <span className="text-[#4B5563] text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const Capabilities = () => {
  const items: CapabilityItem[] = [
    {
      id: "01",
      title: "Technical SEO",
      description:
        "Site architecture, crawl structure, Core Web Vitals, mobile usability, structured data, canonical management, and indexing configuration.",
    },
    {
      id: "02",
      title: "On-Page SEO",
      description:
        "Keyword research & mapping, search intent analysis, metadata optimization, internal linking strategy, and content hierarchy refinement.",
    },
    {
      id: "03",
      title: "Enterprise SEO",
      description:
        "Multi-page frameworks, content cluster architecture, scalable URL structuring, performance dashboards, and competitive keyword benchmarking.",
    },
    {
      id: "04",
      title: "Content-Led Growth",
      description:
        "Topic authority development, semantic keyword coverage, E-E-A-T enhancement, conversion-aligned content, and search snippet optimization.",
    },
    {
      id: "05",
      title: "Authority & Local SEO",
      description:
        "Quality backlink acquisition, digital PR, brand mentions, link profile analysis, local search visibility, and geo-focused keyword targeting.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-black text-4xl text-[#1F2937]">
            Our SEO <span className="text-[#FF9D00]">Capabilities</span>
          </h2>
          <p className="text-[#4B5563] text-lg">
            From technical foundations to authority building
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item) => (
            <div
              className="group relative rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-10 transition-all duration-300 hover:bg-white hover:shadow-xl"
              key={item.id}
            >
              <div className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00A3FF] font-bold text-sm text-white">
                {item.id}
              </div>
              <div className="mt-8">
                <h3 className="mb-4 font-bold text-2xl text-[#1F2937]">
                  {item.title}
                </h3>
                <p className="text-[#4B5563] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Framework = () => {
  const steps = [
    { id: 1, label: "Audit" },
    { id: 2, label: "Strategy" },
    { id: 3, label: "Technical Fix" },
    { id: 4, label: "Content" },
    { id: 5, label: "Authority" },
    { id: 6, label: "Monitor" },
    { id: 7, label: "Refine" },
  ];

  return (
    <section className="overflow-hidden bg-[#F8FAFC] py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-black text-4xl text-[#1F2937]">
            Our SEO{" "}
            <span className="text-[#FF9D00]">Implementation Framework</span>
          </h2>
          <p className="text-[#4B5563] text-lg">
            SEO is an ongoing optimization cycle, not a one-time setup.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-4 lg:gap-0">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 right-0 left-0 z-0 hidden h-0.5 -translate-y-1/2 bg-[#E2E8F0] lg:block" />

          {steps.map((step, idx) => (
            <div
              className="relative z-10 flex flex-col items-center lg:w-[14%]"
              key={step.id}
            >
              <div className="group relative mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all hover:border-[#00A3FF] lg:h-32 lg:w-32">
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#00A3FF] font-bold text-white text-xs">
                  {step.id}
                </div>
                <span className="font-bold text-[#1F2937] text-sm lg:text-base">
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="text-[#E2E8F0] lg:hidden">
                  <ChevronRight className="h-6 w-6 rotate-90" />
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
  const tags = [
    "Data-driven optimization",
    "Technical dev expertise",
    "Content architecture planning",
    "Transparent reporting",
    "Scalable enterprise SEO",
    "Algorithm alignment",
  ];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="mb-4 font-black text-4xl text-[#1F2937]">
          Why Choose <span className="text-[#00A3FF]">WorkHolo Labs</span>?
        </h2>
        <p className="mb-12 text-[#4B5563] text-lg">
          We combine technology, analytics, and strategy for sustainable organic
          growth.
        </p>

        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
          {tags.map((tag, idx) => (
            <div
              className="flex items-center rounded-full border border-[#E2E8F0] bg-white px-6 py-3 shadow-sm transition-all hover:shadow-md"
              key={idx}
            >
              <div className="mr-3 h-2 w-2 rounded-full bg-[#FF9D00]" />
              <span className="font-semibold text-[#1F2937]">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Industries = () => {
  const industries: IndustryItem[] = [
    { icon: <Monitor className="h-10 w-10" />, title: "Technology & SaaS" },
    { icon: <ShoppingCart className="h-10 w-10" />, title: "eCommerce" },
    { icon: <HeartPulse className="h-10 w-10" />, title: "Healthcare" },
    { icon: <CreditCard className="h-10 w-10" />, title: "Financial Services" },
    { icon: <Building2 className="h-10 w-10" />, title: "Enterprise B2B" },
    { icon: <Rocket className="h-10 w-10" />, title: "Startups" },
  ];

  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-black text-4xl text-[#1F2937]">
            Industries We <span className="text-[#FF9D00]">Serve</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {industries.map((industry, idx) => (
            <div
              className="group flex flex-col items-center rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center transition-all hover:shadow-xl"
              key={idx}
            >
              <div className="mb-6 transform text-[#00A3FF] transition-transform group-hover:scale-110">
                {industry.icon}
              </div>
              <h3 className="font-bold text-[#1F2937] text-xl">
                {industry.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStack = () => {
  const tools = [
    "Google Search Console",
    "Google Analytics 4",
    "SEMrush",
    "Ahrefs",
    "Moz Pro",
    "Screaming Frog",
    "Surfer SEO",
    "Clearscope",
    "Schema Markup",
    "Core Web Vitals",
    "PageSpeed Insights",
    "GTmetrix",
    "Majestic",
    "BrightLocal",
    "Yoast SEO",
    "Sitebulb",
    "Looker Studio",
    "Tag Manager",
  ];

  const stats = [
    { value: "18+", label: "SEO Tools" },
    { value: "300+", label: "Projects" },
    { value: "85%", label: "Page 1" },
    { value: "14+", label: "Years" },
  ];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-black text-4xl text-[#1F2937]">
              SEO <span className="text-[#FF9D00]">Technology Stack</span>
            </h2>
            <p className="mb-8 text-[#4B5563] text-lg">
              Enterprise SEO platforms and analytics tools.
            </p>

            <div className="flex flex-wrap gap-3">
              {tools.map((tool, idx) => (
                <span
                  className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 font-medium text-[#4B5563] text-sm"
                  key={idx}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div
                className="group rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm transition-all hover:border-[#00A3FF]"
                key={idx}
              >
                <div className="mb-2 font-black text-4xl text-[#00A3FF]">
                  {stat.value}
                </div>
                <div className="font-bold text-[#4B5563] text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "What do SEO services include?",
      answer:
        "Our SEO services include technical auditing, keyword research, on-page optimization, content strategy, authority building, and monthly performance reporting.",
    },
    {
      question: "How long does SEO take to show results?",
      answer:
        "Typically, significant organic growth is observed within 3 to 6 months, depending on industry competitiveness and current domain authority.",
    },
    {
      question: "Is SEO better than paid advertising?",
      answer:
        "SEO provides long-term sustainable growth and higher ROI over time, while paid advertising offers immediate visibility. A balanced strategy often works best.",
    },
    {
      question: "Do you provide performance reports?",
      answer:
        "Yes, we provide comprehensive monthly reports tracking keyword rankings, organic traffic growth, conversion rates, and technical health.",
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-black text-4xl text-[#1F2937]">
            Frequently Asked <span className="text-[#FF9D00]">Questions</span>
          </h2>
          <p className="text-[#4B5563] text-lg">
            Everything about SEO services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white"
              key={idx}
            >
              <button
                className="flex w-full items-center justify-between px-8 py-6 text-left transition-colors hover:bg-gray-50"
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              >
                <span className="font-bold text-[#1F2937] text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-[#4B5563] transition-transform ${activeIndex === idx ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-8 pb-6 text-[#4B5563] leading-relaxed">
                      {faq.answer}
                    </div>
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

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-[#050B18] py-24">
      <div className="absolute top-0 left-0 h-full w-full bg-[url('https://picsum.photos/seed/tech/1920/1080?blur=10')] bg-center bg-cover opacity-10" />
      <div className="container relative z-10 mx-auto px-6 text-center">
        <h2 className="mb-6 font-black text-4xl text-white lg:text-5xl">
          Grow Your <span className="text-[#FF9D00]">Organic Visibility</span>
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-white/70 text-xl">
          Let's discuss how SEO can drive sustainable traffic and revenue
          growth.
        </p>
        <button className="transform rounded-lg bg-[#7B2CBF] px-12 py-5 font-bold text-white text-xl shadow-2xl shadow-purple-500/30 transition-all hover:scale-105 hover:bg-[#6A24A3]">
          Start Your SEO Strategy
        </button>
      </div>
    </section>
  );
};

const StickyWidgets = () => {
  return (
    <div className="fixed right-8 bottom-8 z-50 flex flex-col space-y-4">
      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-2xl transition-transform hover:scale-110">
        <MessageCircle className="h-8 w-8 text-white" />
      </button>
      <button
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00A3FF] shadow-2xl transition-transform hover:scale-110"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-8 w-8 text-white" />
      </button>
    </div>
  );
};

export default function SEOServices() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#00A3FF] selection:text-white">
      <main>
        <Hero />
        <WhatIsSeo />
        <Outcomes />
        <Capabilities />
        <Framework />
        <WhyChoose />
        <Industries />
        <TechStack />
        <FAQ />
        <CTA />
      </main>
      <StickyWidgets />
    </div>
  );
}
