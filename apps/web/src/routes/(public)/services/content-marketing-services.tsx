import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  IconArrowRight,
  IconBuilding,
  IconChevronDown,
  IconCircleCheck,
  IconDatabase,
  IconDeviceDesktop,
  IconGlobe,
  IconLayout,
  IconRocket,
  IconSearch,
  IconShieldCheck,
  IconShoppingCart,
  IconStethoscope,
  IconTrendingUp,
} from "@tabler/icons-react";

// --- Types ---

interface StatCard {
  label: string;
  value: string;
}

interface CapabilityCard {
  description: string;
  id: string;
  title: string;
}

interface FrameworkStep {
  id: number;
  label: string;
}

interface IndustryCard {
  icon: React.ReactNode;
  label: string;
}

interface FAQItem {
  answer: string;
  question: string;
}

// --- Components ---

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0B1120] pt-48 pb-32 text-center">
      <div className="absolute top-0 left-0 h-full w-full opacity-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#00A3FF] blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-[#7B2CBF] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6">
        <div className="mb-6 flex items-center justify-center gap-2 font-medium text-sm text-white/60">
          <span>Home</span> / <span>Services</span> /{" "}
          <span className="text-[#F2A93B]">Content Marketing</span>
        </div>

        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 font-bold text-5xl text-white tracking-tight md:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Content <span className="text-[#F2A93B]">Marketing</span> Services
        </motion.h1>

        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-12 max-w-4xl font-medium text-white/80 text-xl leading-relaxed md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Strategic Content That Drives Authority, Engagement & Revenue
        </motion.p>

        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-lg text-white/60 italic leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          WorkHolo Labs delivers structured content marketing services designed
          to build brand authority, improve search visibility, and generate
          measurable business growth. Authority is earned through value-driven
          communication.
        </motion.p>
      </div>
    </section>
  );
};

const WhatIsContentMarketing = () => {
  const cards = [
    {
      icon: <IconLayout className="text-[#7B2CBF]" />,
      title: "Content Strategy",
    },
    { icon: <IconSearch className="text-[#00A3FF]" />, title: "SEO Alignment" },
    {
      icon: <IconShieldCheck className="text-[#F2A93B]" />,
      title: "Authority Building",
    },
    {
      icon: <IconTrendingUp className="text-[#00C853]" />,
      title: "Lead Generation",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-8 font-bold text-4xl text-[#0B1120] leading-tight">
            What Are <span className="text-[#F2A93B]">Content Marketing</span>{" "}
            Services?
          </h2>
          <div className="space-y-6 text-[#0B1120]/70 text-lg leading-relaxed">
            <p>
              Content marketing services involve creating and distributing
              strategically planned content that attracts qualified audiences
              and guides them toward conversion — including search-aligned
              strategy, topic authority, multi-format creation, and funnel
              mapping.
            </p>
            <p>
              Our content work directly supports{" "}
              <span className="font-bold text-[#00A3FF]">SEO</span> rankings and{" "}
              <span className="font-bold text-[#00A3FF]">CRO</span> performance
              for comprehensive digital growth.
            </p>
            <p>
              Combined with{" "}
              <span className="font-bold text-[#00A3FF]">
                social media marketing
              </span>{" "}
              and{" "}
              <span className="font-bold text-[#00A3FF]">email marketing</span>,
              we create content ecosystems that build long-term digital equity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              className="flex flex-col items-center gap-4 rounded-2xl border border-black/5 bg-[#F8FAFC] p-8 text-center shadow-sm"
              key={idx}
              whileHover={{ y: -10 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                {card.icon}
              </div>
              <h3 className="font-bold text-[#0B1120] text-lg">{card.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BusinessBenefits = () => {
  const stats: StatCard[] = [
    { value: "1000+", label: "Content Pieces" },
    { value: "3x", label: "Organic Growth" },
    { value: "B2B", label: "& SaaS Focus" },
    { value: "14+", label: "Years Experience" },
  ];

  const benefits = [
    "Increased search visibility & stronger authority",
    "Higher audience engagement & improved lead quality",
    "Sustainable organic traffic & enhanced brand trust",
    "B2B & SaaS expertise with thought leadership",
    "Integration with SEO & CRO strategies",
  ];

  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 lg:grid-cols-2">
        <div className="order-2 grid grid-cols-2 gap-6 lg:order-1">
          {stats.map((stat, idx) => (
            <div
              className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm"
              key={idx}
            >
              <div className="mb-2 font-bold text-4xl text-[#00A3FF]">
                {stat.value}
              </div>
              <div className="font-bold text-[#0B1120]/60 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="mb-6 font-bold text-4xl text-[#0B1120] leading-tight">
            Business Benefits of{" "}
            <span className="text-[#F2A93B]">Content Marketing</span>
          </h2>
          <p className="mb-8 font-medium text-[#0B1120]/70 text-lg">
            Content is a long-term growth asset:
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit, idx) => (
              <li
                className="flex items-center gap-3 font-medium text-[#0B1120]/80 text-lg"
                key={idx}
              >
                <IconCircleCheck className="text-[#F2A93B]" size={20} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const ContentCapabilities = () => {
  const capabilities: CapabilityCard[] = [
    {
      id: "01",
      title: "Strategy & Planning",
      description:
        "Audience segmentation, keyword clusters, topic authority mapping, competitive gap analysis, and content calendar development.",
    },
    {
      id: "02",
      title: "SEO Content",
      description:
        "Long-form articles, service page content, landing page copy, knowledge base resources, and educational guides structured for rankings.",
    },
    {
      id: "03",
      title: "B2B & SaaS Content",
      description:
        "Thought leadership, product education, case studies, whitepaper frameworks, and industry-focused insights for credibility.",
    },
    {
      id: "04",
      title: "Conversion Copywriting",
      description:
        "Value propositions, CTA clarity, benefit-driven communication, and trust-building messaging to influence decision-making.",
    },
    {
      id: "05",
      title: "Distribution & Analytics",
      description:
        "Organic distribution, email integration, social repurposing, campaign-aligned publishing, organic traffic growth, and conversion performance tracking.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-4xl text-[#0B1120]">
            Our Content <span className="text-[#F2A93B]">Capabilities</span>
          </h2>
          <p className="font-medium text-[#0B1120]/60 text-lg">
            From strategy to performance optimization
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-2">
          {capabilities.map((item) => (
            <motion.div
              className="group relative overflow-hidden rounded-3xl border border-black/5 bg-[#F8FAFC] p-10"
              key={item.id}
              whileHover={{ scale: 1.02 }}
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-[#00A3FF] text-lg shadow-sm">
                {item.id}
              </div>
              <h3 className="mb-4 font-bold text-2xl text-[#0B1120]">
                {item.title}
              </h3>
              <p className="text-[#0B1120]/70 text-lg leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContentFramework = () => {
  const steps: FrameworkStep[] = [
    { id: 1, label: "Research" },
    { id: 2, label: "Planning" },
    { id: 3, label: "Creation" },
    { id: 4, label: "Optimization" },
    { id: 5, label: "Distribution" },
    { id: 6, label: "Monitor" },
    { id: 7, label: "Refine" },
  ];

  return (
    <section className="overflow-hidden bg-[#F8FAFC] py-24">
      <div className="mx-auto max-w-[1440px] px-6 text-center">
        <h2 className="mb-4 font-bold text-4xl text-[#0B1120]">
          Our Content <span className="text-[#F2A93B]">Framework</span>
        </h2>
        <p className="mb-20 font-medium text-[#0B1120]/60 text-lg">
          Structured cycle ensuring continuous improvement.
        </p>

        <div className="relative flex flex-wrap items-center justify-center gap-4 lg:gap-0">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-black/5 lg:block" />

          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="relative z-10">
                <motion.div
                  className={`flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-2xl shadow-lg transition-all ${step.id === 4 ? "scale-110 border-2 border-[#00A3FF] bg-white" : "border border-black/5 bg-white"}`}
                  whileHover={{ scale: 1.1 }}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-[10px] text-white ${step.id === 4 ? "bg-[#00A3FF]" : "bg-[#7B2CBF]"}`}
                  >
                    {step.id}
                  </div>
                  <span className="font-bold text-[#0B1120] text-sm">
                    {step.label}
                  </span>
                </motion.div>
              </div>
              {idx < steps.length - 1 && (
                <div className="z-10 hidden items-center px-4 lg:flex">
                  <IconArrowRight className="text-black/20" size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChoose = () => {
  const tags = [
    "Search-aligned architecture",
    "B2B & SaaS expertise",
    "Data-driven optimization",
    "SEO & CRO integration",
    "Scalable planning models",
    "Long-term authority focus",
  ];

  return (
    <section className="bg-white py-24 text-center">
      <div className="mx-auto max-w-[1440px] px-6">
        <h2 className="mb-4 font-bold text-4xl text-[#0B1120]">
          Why Choose <span className="text-[#F2A93B]">WorkHolo Labs</span>?
        </h2>
        <p className="mb-12 font-medium text-[#0B1120]/80 text-xl">
          We create content ecosystems — not isolated articles.
        </p>

        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
          {tags.map((tag, idx) => (
            <div
              className="flex items-center gap-2 rounded-full border border-black/5 bg-[#F8FAFC] px-6 py-3 shadow-sm"
              key={idx}
            >
              <div className="h-2 w-2 rounded-full bg-[#F2A93B]" />
              <span className="font-bold text-[#0B1120]/80 text-sm">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Industries = () => {
  const industries: IndustryCard[] = [
    { icon: <IconDeviceDesktop size={32} />, label: "Technology & SaaS" },
    { icon: <IconDatabase size={32} />, label: "Financial Services" },
    { icon: <IconStethoscope size={32} />, label: "Healthcare" },
    { icon: <IconShoppingCart size={32} />, label: "eCommerce" },
    { icon: <IconBuilding size={32} />, label: "Enterprise B2B" },
    { icon: <IconRocket size={32} />, label: "Startup Growth" },
  ];

  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="mx-auto max-w-[1440px] px-6">
        <h2 className="mb-16 text-center font-bold text-4xl text-[#0B1120]">
          Industries We <span className="text-[#F2A93B]">Support</span>
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, idx) => (
            <motion.div
              className="group flex flex-col items-center gap-6 rounded-3xl border border-black/5 bg-white p-12 text-center shadow-sm"
              key={idx}
              whileHover={{ y: -10 }}
            >
              <div className="text-[#00A3FF] transition-transform duration-300 group-hover:scale-110">
                {industry.icon}
              </div>
              <h3 className="font-bold text-[#0B1120] text-xl">
                {industry.label}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStack = () => {
  const tags = [
    "SEMrush",
    "Ahrefs",
    "Surfer SEO",
    "Clearscope",
    "MarketMuse",
    "Google Analytics 4",
    "Google Search Console",
    "WordPress",
    "Next.js",
    "HubSpot",
    "Mailchimp",
    "Grammarly",
    "Hemingway",
    "Canva",
    "Notion",
    "Trello",
    "BuzzSumo",
    "Hootsuite",
  ];

  const stats = [
    { value: "1000+", label: "Content Pieces" },
    { value: "3x", label: "Organic Growth" },
    { value: "B2B", label: "Expertise" },
    { value: "14+", label: "Years" },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 font-bold text-5xl text-[#0B1120]">
            Content <span className="text-[#F2A93B]">Technology Stack</span>
          </h2>
          <p className="mb-10 font-medium text-[#0B1120]/60 text-lg">
            Enterprise content and analytics platforms.
          </p>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag, idx) => (
              <span
                className="rounded-full border border-black/5 bg-[#F8FAFC] px-4 py-2 font-bold text-[#0B1120]/70 text-sm"
                key={idx}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {stats.map((stat, idx) => (
            <div
              className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-md"
              key={idx}
            >
              <div className="mb-2 font-bold text-5xl text-[#00A3FF]">
                {stat.value}
              </div>
              <div className="font-bold text-[#0B1120]/60 text-sm uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What are content marketing services?",
      answer:
        "Content marketing services encompass the full lifecycle of content creation, from strategy and research to production, distribution, and performance analysis. It's about creating value for your audience to drive business results.",
    },
    {
      question: "How does content support SEO?",
      answer:
        "High-quality, relevant content is the backbone of SEO. It helps search engines understand your authority on specific topics, provides opportunities to rank for keywords, and attracts backlinks from other reputable sites.",
    },
    {
      question: "How long does content marketing take?",
      answer:
        "Content marketing is a long-term strategy. While some results can be seen in 3-6 months, significant authority and organic growth typically compound over 12+ months of consistent effort.",
    },
    {
      question: "Can content marketing increase leads?",
      answer:
        "Yes, by addressing the specific pain points and questions of your target audience at different stages of the buyer's journey, you can attract qualified prospects and guide them toward conversion.",
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-4xl text-[#0B1120]">
            Frequently Asked <span className="text-[#F2A93B]">Questions</span>
          </h2>
          <p className="font-medium text-[#0B1120]/60 text-lg">
            Everything about content marketing
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, idx) => (
            <div
              className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
              key={idx}
            >
              <button
                className="flex w-full items-center justify-between px-8 py-6 text-left transition-colors hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-bold text-[#0B1120] text-lg">
                  {faq.question}
                </span>
                {openIndex === idx ? (
                  <IconChevronDown className="rotate-180 transition-transform" />
                ) : (
                  <IconChevronDown className="transition-transform" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-8 pb-6 text-[#0B1120]/70 leading-relaxed"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                  >
                    {faq.answer}
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
    <section className="relative overflow-hidden bg-[#0B1120] py-24 text-center">
      <div className="absolute top-0 left-0 h-full w-full opacity-10">
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7B2CBF] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6">
        <h2 className="mb-6 font-bold text-5xl text-white">
          Build Your <span className="text-[#F2A93B]">Content Strategy</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-white/70 text-xl leading-relaxed">
          Let's discuss how content marketing can build your authority and drive
          measurable growth.
        </p>
        <button className="transform rounded-xl bg-[#F2A93B] px-10 py-4 font-bold text-lg text-white shadow-orange-500/20 shadow-xl transition-all hover:scale-105 hover:bg-[#E0982A]">
          Start Content Marketing
        </button>
      </div>
    </section>
  );
};

const GlobalPresence = () => {
  const regions = [
    {
      name: "INDIA",
      cities: ["Hyderabad", "Bangalore", "Chennai", "Coimbatore", "Kochi"],
    },
    {
      name: "AMERICAS",
      cities: ["United States", "Canada"],
    },
    {
      name: "EUROPE",
      cities: ["United Kingdom", "Germany", "Ireland"],
    },
    {
      name: "ASIA PACIFIC",
      cities: ["Singapore", "Australia", "New Zealand", "India"],
    },
    {
      name: "MIDDLE EAST",
      cities: ["UAE", "Dubai", "Saudi Arabia", "Qatar", "Kuwait"],
    },
  ];

  return (
    <section className="border-white/5 border-t bg-[#0B1120] py-24">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-16 flex items-center gap-3 text-white">
          <IconGlobe className="text-[#00A3FF]" size={24} />
          <h2 className="font-bold text-2xl">Global Presence</h2>
        </div>

        <div className="grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-5">
          {regions.map((region) => (
            <div key={region.name}>
              <h3 className="mb-8 flex items-center gap-2 font-black text-[#00A3FF] text-[11px] tracking-[0.2em]">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00A3FF]" />
                {region.name}
              </h3>
              <ul className="space-y-4">
                {region.cities.map((city) => (
                  <li
                    className="cursor-pointer font-medium text-[15px] text-white/60 transition-colors hover:text-white"
                    key={city}
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
};

export default function ContentMarketingServices() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] selection:bg-[#00A3FF] selection:text-white">
      <main>
        <Hero />
        <WhatIsContentMarketing />
        <BusinessBenefits />
        <ContentCapabilities />
        <ContentFramework />
        <WhyChoose />
        <Industries />
        <TechStack />
        <FAQ />
        <CTA />
        <GlobalPresence />
      </main>
    </div>
  );
}
