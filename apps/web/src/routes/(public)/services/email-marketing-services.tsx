import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Globe,
  HeartPulse,
  Mail,
  MapPin,
  MessageSquare,
  Monitor,
  Phone,
  Rocket,
  ShoppingCart,
} from "lucide-react";

// --- Components ---

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-dark-bg px-4 pt-48 pb-32 md:px-12">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-brand-orange/10 blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-brand-purple/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-medium text-gray-400 text-sm">Home</span>
          <span className="text-gray-600">/</span>
          <span className="font-medium text-gray-400 text-sm">Services</span>
          <span className="text-gray-600">/</span>
          <span className="font-bold text-brand-orange text-sm">
            Email Marketing
          </span>
        </motion.div>

        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 font-extrabold text-5xl text-white tracking-tight md:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Email <span className="text-brand-orange">Marketing</span> Services
        </motion.h1>

        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-6 max-w-4xl font-semibold text-gray-300 text-xl md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Intelligent Email Campaigns Designed to Nurture, Convert & Retain
        </motion.p>

        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-12 max-w-3xl text-gray-400 text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          WorkHolo Labs delivers structured email marketing services that
          transform email communication into a measurable revenue channel.
          Effective email marketing is systematic, not sporadic.
        </motion.p>
      </div>
    </section>
  );
};

const WhatIsSection = () => {
  const cards = [
    {
      icon: <Mail className="text-brand-purple" />,
      title: "Lifecycle Campaigns",
    },
    { icon: <Rocket className="text-brand-orange" />, title: "Automation" },
    { icon: <Globe className="text-blue-500" />, title: "Segmentation" },
    { icon: <Monitor className="text-green-500" />, title: "Performance" },
  ];

  return (
    <section className="bg-white px-4 py-24 md:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <h2 className="mb-8 font-extrabold text-4xl text-slate-900">
            What Are{" "}
            <span className="text-brand-orange">Email Marketing Services?</span>
          </h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              Email marketing services involve planning, designing, automating,
              and optimizing email campaigns to engage subscribers and guide
              them toward conversion — including segmentation, automation
              workflows, behavioral triggers, and continuous optimization.
            </p>
            <p>
              Our email campaigns integrate with{" "}
              <span className="font-bold text-blue-600">content marketing</span>{" "}
              and{" "}
              <span className="font-bold text-blue-600">CRO strategies</span>{" "}
              for maximum engagement.
            </p>
            <p>
              Combined with{" "}
              <span className="font-bold text-blue-600">digital marketing</span>{" "}
              and{" "}
              <span className="font-bold text-blue-600">
                performance marketing
              </span>
              , email becomes a strategic growth asset driving long-term
              customer value.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center shadow-sm"
              key={idx}
              whileHover={{ y: -5 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md">
                {card.icon}
              </div>
              <span className="font-bold text-slate-800">{card.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  const stats = [
    { value: "500+", label: "Campaigns Sent", color: "text-blue-600" },
    { value: "42x", label: "Avg Email ROI", color: "text-blue-600" },
    { value: "35%", label: "Open Rate Avg", color: "text-blue-600" },
    { value: "14+", label: "Years Experience", color: "text-blue-600" },
  ];

  const benefits = [
    "Direct communication & high ROI potential",
    "Scalable automation & improved retention",
    "Better conversion tracking & brand consistency",
    "Behavioral segmentation & personalization",
    "CRM & analytics platform integration",
  ];

  return (
    <section className="bg-slate-50 px-4 py-24 md:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-6">
          {stats.map((stat, idx) => (
            <div
              className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm"
              key={idx}
            >
              <div className={`font-black text-4xl ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="font-bold text-gray-500 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-6 font-extrabold text-4xl text-slate-900">
            Business Benefits of{" "}
            <span className="text-brand-orange">Email Marketing</span>
          </h2>
          <p className="mb-8 text-gray-600 text-lg">
            Email builds predictable engagement systems:
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit, idx) => (
              <li
                className="flex items-center gap-3 font-medium text-gray-700"
                key={idx}
              >
                <CheckCircle2 className="text-brand-orange" size={20} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const CapabilitiesSection = () => {
  const capabilities = [
    {
      id: "01",
      title: "Lifecycle Strategy",
      desc: "Lead nurturing, product onboarding, customer retention, re-engagement campaigns, and renewal reminders for every lifecycle stage.",
    },
    {
      id: "02",
      title: "Marketing Automation",
      desc: "Trigger-based workflows, welcome sequences, behavioral follow-ups, abandoned cart sequences, and subscription renewal flows.",
    },
    {
      id: "03",
      title: "Segmentation & Personalization",
      desc: "Behavioral segmentation, demographic targeting, purchase history analysis, engagement scoring, and dynamic content blocks.",
    },
    {
      id: "04",
      title: "Campaign Design",
      desc: "Subject line strategy, preview text optimization, layout structure, CTA placement, mobile responsiveness, and open rate optimization.",
    },
  ];

  return (
    <section className="bg-white px-4 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-extrabold text-4xl text-slate-900">
            Our Email <span className="text-brand-orange">Capabilities</span>
          </h2>
          <p className="text-gray-500 text-lg">
            From lifecycle strategy to performance optimization
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {capabilities.map((cap, idx) => (
            <motion.div
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-10"
              key={idx}
              whileHover={{ y: -10 }}
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 font-bold text-sm text-white">
                {cap.id}
              </div>
              <h3 className="mb-4 font-bold text-2xl text-slate-800">
                {cap.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{cap.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const steps = [
    { id: 1, title: "Audience" },
    { id: 2, title: "Planning" },
    { id: 3, title: "Automation" },
    { id: 4, title: "Design" },
    { id: 5, title: "Monitor" },
    { id: 6, title: "Optimize" },
  ];

  return (
    <section className="overflow-hidden bg-slate-50 px-4 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-4 font-extrabold text-4xl text-slate-900">
            Our Email <span className="text-brand-orange">Process</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Structured approach ensuring sustained improvement.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-8 md:gap-4">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-blue-100 md:block" />

          {steps.map((step, idx) => (
            <div
              className="group relative z-10 flex items-center gap-4"
              key={idx}
            >
              <div className="flex flex-col items-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-blue-100 bg-white shadow-lg transition-colors group-hover:border-blue-500">
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 font-bold text-[10px] text-white">
                    {step.id}
                  </div>
                  <span className="font-bold text-slate-700 text-xs">
                    {step.title}
                  </span>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block">
                  <ArrowRight
                    className="text-blue-200 transition-colors group-hover:text-blue-500"
                    size={20}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseSection = () => {
  const reasons = [
    "Automation-focused strategy",
    "Behavioral segmentation",
    "SaaS & enterprise experience",
    "Data-driven optimization",
    "CRM & analytics integration",
    "Lifecycle management",
  ];

  return (
    <section className="bg-white px-4 py-24 md:px-12">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-6 font-extrabold text-4xl text-slate-900">
          Why Choose <span className="text-brand-orange">WorkHolo Labs</span>?
        </h2>
        <p className="mb-12 text-gray-500 text-lg">
          We transform email into a strategic growth asset.
        </p>

        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
          {reasons.map((reason, idx) => (
            <div
              className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-8 py-3 shadow-sm transition-shadow hover:shadow-md"
              key={idx}
            >
              <div className="h-2 w-2 rounded-full bg-brand-orange" />
              <span className="font-semibold text-slate-700 text-sm">
                {reason}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const IndustriesSection = () => {
  const industries = [
    { icon: <Monitor size={32} />, title: "SaaS & Subscriptions" },
    { icon: <ShoppingCart size={32} />, title: "eCommerce" },
    { icon: <CreditCard size={32} />, title: "Financial Services" },
    { icon: <HeartPulse size={32} />, title: "Healthcare" },
    { icon: <Building2 size={32} />, title: "B2B Enterprises" },
    { icon: <Rocket size={32} />, title: "Startup Growth" },
  ];

  return (
    <section className="bg-slate-50 px-4 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-extrabold text-4xl text-slate-900">
            Industries We <span className="text-brand-orange">Support</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {industries.map((ind, idx) => (
            <motion.div
              className="group flex flex-col items-center gap-6 rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm"
              key={idx}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-blue-400 transition-colors group-hover:text-blue-600">
                {ind.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-xl">{ind.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStackSection = () => {
  const tools = [
    "Mailchimp",
    "Klaviyo",
    "HubSpot",
    "ActiveCampaign",
    "SendGrid",
    "ConvertKit",
    "Drip",
    "Customer.io",
    "Brevo",
    "Iterable",
    "Salesforce Marketing Cloud",
    "Marketo",
    "Campaign Monitor",
    "Litmus",
    "Email on Acid",
    "Google Analytics",
    "Zapier",
    "Segment",
  ];

  const stats = [
    { value: "500+", label: "Campaigns", color: "text-blue-600" },
    { value: "42x", label: "Avg ROI", color: "text-blue-600" },
    { value: "18+", label: "Platforms", color: "text-blue-600" },
    { value: "14+", label: "Years", color: "text-blue-600" },
  ];

  return (
    <section className="bg-white px-4 py-24 md:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 font-extrabold text-4xl text-slate-900">
            Email <span className="text-brand-orange">Technology Stack</span>
          </h2>
          <p className="mb-8 text-gray-600 text-lg">
            Enterprise email automation and analytics platforms.
          </p>
          <div className="flex flex-wrap gap-3">
            {tools.map((tool, idx) => (
              <span
                className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 font-bold text-slate-600 text-xs shadow-sm"
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
              className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm"
              key={idx}
            >
              <div className={`font-black text-4xl ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="font-bold text-gray-500 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      q: "What are email marketing services?",
      a: "Email marketing services involve the strategic planning, creation, and distribution of email campaigns to a targeted audience. This includes everything from list management and segmentation to content creation, automation setup, and performance analysis.",
    },
    {
      q: "Is email marketing still effective?",
      a: "Yes, email marketing remains one of the most effective digital marketing channels with an average ROI of $42 for every $1 spent. It provides a direct line of communication with your audience and is highly measurable.",
    },
    {
      q: "Can email improve customer retention?",
      a: "Absolutely. Through automated lifecycle campaigns, personalized offers, and consistent engagement, email marketing is a powerful tool for keeping your brand top-of-mind and encouraging repeat purchases.",
    },
    {
      q: "Do you provide automation setup?",
      a: "Yes, we specialize in complex marketing automation workflows, including welcome sequences, abandoned cart recovery, behavioral triggers, and multi-stage lead nurturing.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 px-4 py-24 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-extrabold text-4xl text-slate-900">
            Frequently Asked{" "}
            <span className="text-brand-orange">Questions</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Everything about email marketing
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              key={idx}
            >
              <button
                className="flex w-full items-center justify-between px-8 py-6 text-left transition-colors hover:bg-slate-50"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span className="font-bold text-lg text-slate-800">
                  {faq.q}
                </span>
                {openIdx === idx ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-8 pb-6 text-gray-600 leading-relaxed"
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
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-dark-bg px-4 py-24 md:px-12">
      <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-purple/10 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="mb-8 font-extrabold text-4xl text-white md:text-5xl">
          Transform Your{" "}
          <span className="text-brand-orange">Email Strategy</span>
        </h2>
        <p className="mb-12 text-gray-300 text-xl leading-relaxed">
          Let's discuss how email automation can drive engagement and measurable
          revenue growth.
        </p>
        <button className="transform rounded-xl bg-brand-orange px-10 py-4 font-bold text-lg text-white shadow-brand-orange/20 shadow-xl transition-all hover:scale-105 hover:bg-brand-orange/90">
          Start Email Marketing
        </button>
      </div>
    </section>
  );
};

const FloatingWidgets = () => {
  return (
    <div className="fixed right-8 bottom-8 z-[100] flex flex-col items-end gap-4">
      {/* Scroll to Top */}
      <button
        className="flex h-12 w-12 transform items-center justify-center rounded-full bg-blue-500 text-white shadow-2xl transition-all hover:scale-110 hover:bg-blue-600"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronUp size={24} />
      </button>

      {/* WhatsApp */}
      <div className="group relative">
        <div className="pointer-events-none absolute top-1/2 -left-32 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-4 py-2 font-bold text-black text-xs opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
          Chat with us!
        </div>
        <button className="relative flex h-16 w-16 transform items-center justify-center rounded-full bg-green-500 text-white shadow-2xl transition-all hover:scale-110 hover:bg-green-600">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-20" />
          <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>
      </div>

      {/* Chat Bubble */}
      <div className="relative">
        <div className="absolute -top-12 right-0 whitespace-nowrap rounded-lg bg-white px-4 py-2 font-black text-[10px] text-black shadow-xl">
          LET'S <span className="text-brand-orange">CHAT!</span> WE ARE{" "}
          <span className="text-brand-orange">HERE!</span>
          <div className="absolute right-4 -bottom-1 h-2 w-2 rotate-45 bg-white" />
        </div>
        <button className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-2xl transition-transform hover:scale-110">
          <MessageSquare size={28} />
          <div className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-[10px]">
            1
          </div>
        </button>
      </div>
    </div>
  );
};

const LatestJobsSection = () => {
  const jobs = [
    {
      title: "Email Marketing Specialist",
      location: "Hyderabad, India",
      type: "Full Time",
    },
    {
      title: "Automation Engineer",
      location: "Bangalore, India",
      type: "Full Time",
    },
    { title: "Content Strategist", location: "Remote", type: "Contract" },
  ];

  return (
    <section className="bg-white px-4 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-extrabold text-4xl text-slate-900">
            Latest <span className="text-brand-orange">Jobs</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Join our growing team of experts.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {jobs.map((job, idx) => (
            <motion.div
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-8 shadow-sm"
              key={idx}
              whileHover={{ y: -5 }}
            >
              <div className="w-fit rounded-full bg-blue-100 px-3 py-1 font-bold text-[10px] text-blue-600 uppercase tracking-wider">
                {job.type}
              </div>
              <h3 className="font-bold text-slate-800 text-xl">{job.title}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin size={14} /> {job.location}
              </div>
              <button className="group mt-4 flex items-center gap-2 font-bold text-brand-purple text-sm">
                Apply Now{" "}
                <ArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={16}
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const JointTalentSection = () => {
  return (
    <section className="bg-slate-50 px-4 py-24 md:px-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-brand-purple p-12 text-white shadow-2xl md:p-20">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 font-extrabold text-4xl md:text-5xl">
              Joint <span className="text-brand-orange">Talent</span> Program
            </h2>
            <p className="mb-8 text-lg text-purple-100 leading-relaxed">
              We are looking for exceptional talent to join our mission. If you
              are passionate about technology and innovation, we want to hear
              from you.
            </p>
            <button className="transform rounded-xl bg-white px-8 py-4 font-bold text-brand-purple transition-all hover:scale-105 hover:bg-brand-orange hover:text-white">
              Explore Opportunities
            </button>
          </div>
          <div className="hidden justify-end lg:flex">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  className="flex h-32 w-32 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm"
                  key={i}
                >
                  <Globe className="text-white/40" size={48} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ExecutivesSection = () => {
  const executives = [
    {
      name: "Srinivas Rao",
      role: "CEO & Founder",
      image: "https://picsum.photos/seed/exec1/400/400",
    },
    {
      name: "Prasad Reddy",
      role: "CTO",
      image: "https://picsum.photos/seed/exec2/400/400",
    },
    {
      name: "Anjali Sharma",
      role: "COO",
      image: "https://picsum.photos/seed/exec3/400/400",
    },
    {
      name: "David Wilson",
      role: "VP Engineering",
      image: "https://picsum.photos/seed/exec4/400/400",
    },
  ];

  return (
    <section className="bg-white px-4 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-extrabold text-4xl text-slate-900">
            Our <span className="text-brand-orange">Leadership</span> Team
          </h2>
          <p className="text-gray-500 text-lg">
            The visionaries behind WorkHolo Labs.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {executives.map((exec, idx) => (
            <motion.div className="group" key={idx} whileHover={{ y: -10 }}>
              <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">
                <img
                  alt={exec.name}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                  src={exec.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mb-1 font-bold text-slate-800 text-xl">
                {exec.name}
              </h3>
              <p className="font-semibold text-brand-purple text-sm uppercase tracking-wider">
                {exec.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="bg-slate-50 px-4 py-24 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 font-extrabold text-4xl text-slate-900">
            Get in <span className="text-brand-orange">Touch</span>
          </h2>
          <p className="mb-12 text-gray-600 text-lg leading-relaxed">
            Ready to scale your email marketing? Fill out the form and our
            experts will get back to you within 24 hours.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-white text-brand-purple shadow-sm">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Email Us</h4>
                <p className="text-gray-500">contact@WorkHololabs.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-white text-brand-purple shadow-sm">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Call Us</h4>
                <p className="text-gray-500">+91 9390683154</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-white text-brand-purple shadow-sm">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Our Office</h4>
                <p className="text-gray-500">Hyderabad, Bangalore, USA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-10 shadow-xl">
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="font-black text-gray-400 text-xs uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-brand-purple focus:outline-none"
                  placeholder="John Doe"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="font-black text-gray-400 text-xs uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-brand-purple focus:outline-none"
                  placeholder="john@example.com"
                  type="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-black text-gray-400 text-xs uppercase tracking-wider">
                Subject
              </label>
              <input
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-brand-purple focus:outline-none"
                placeholder="How can we help?"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <label className="font-black text-gray-400 text-xs uppercase tracking-wider">
                Message
              </label>
              <textarea
                className="h-32 w-full resize-none rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-brand-purple focus:outline-none"
                placeholder="Your message here..."
              />
            </div>
            <button className="w-full transform rounded-xl bg-brand-purple py-4 font-bold text-white shadow-brand-purple/20 shadow-lg transition-all hover:scale-[1.02] hover:bg-brand-purple/90">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

export default function EmailMarketingServices() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <WhatIsSection />
        <BenefitsSection />
        <CapabilitiesSection />
        <ProcessSection />
        <WhyChooseSection />
        <IndustriesSection />
        <TechStackSection />
        <ExecutivesSection />
        <LatestJobsSection />
        <JointTalentSection />
        <FAQSection />
        <ContactSection />
        <CTASection />
      </main>
      <FloatingWidgets />
    </div>
  );
}
