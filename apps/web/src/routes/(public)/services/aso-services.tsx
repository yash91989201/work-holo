import {
  IconArrowRight,
  IconBuilding,
  IconChevronDown,
  IconCircleCheck,
  IconCreditCard,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconHeartbeat,
  IconMessage2,
  IconSearch,
  IconShoppingBag,
  IconTarget,
  IconTruck,
  IconStack2 as Layers,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

export const Route = createFileRoute("/(public)/services/aso-services")({
  component: ASOServices,
});

// --- Components ---

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#050A18] px-6 pt-48 pb-32">
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <div className="mb-6 flex items-center justify-center gap-2 font-medium text-[14px] text-gray-400 uppercase tracking-widest">
          <span>Home</span> <span className="text-gray-600">/</span>{" "}
          <span>Services</span> <span className="text-gray-600">/</span>{" "}
          <span className="text-orange-500">App Store Optimization</span>
        </div>
        <h1 className="mb-8 font-extrabold text-4xl text-white leading-[1.1] lg:text-7xl">
          App Store <span className="text-orange-500 italic">Optimization</span>{" "}
          Services
        </h1>
        <p className="mx-auto mb-12 max-w-4xl font-medium text-gray-300 text-lg leading-relaxed lg:text-2xl">
          Increasing App Visibility, Downloads & Long-Term Store Performance
        </p>
        <p className="mx-auto mb-12 max-w-3xl text-[15px] text-gray-400 leading-relaxed lg:text-[17px]">
          WorkHolo Labs provides professional ASO services designed to improve
          app discoverability, increase organic downloads, and enhance user
          acquisition performance across global marketplaces. App growth begins
          with discoverability.
        </p>
      </div>
      <div className="absolute top-0 right-0 -mt-64 -mr-64 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -mb-64 -ml-64 h-[500px] w-[500px] rounded-full bg-orange-600/5 blur-[120px]" />
    </section>
  );
};

const WhatIsASO = () => {
  const services = [
    {
      icon: <IconSearch className="text-blue-500" />,
      title: "Keyword Strategy",
    },
    {
      icon: <Layers className="text-purple-500" />,
      title: "Listing Optimization",
    },
    {
      icon: <IconDeviceMobile className="text-orange-500" />,
      title: "Visual Assets",
    },
    { icon: <IconTarget className="text-green-500" />, title: "A/B Testing" },
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <h2 className="mb-8 font-bold text-4xl text-[#050A18] lg:text-5xl">
            What Are <span className="text-orange-500">ASO Services</span>?
          </h2>
          <p className="mb-8 text-gray-600 text-lg leading-relaxed">
            App Store Optimization services improve a mobile app's ranking and
            visibility within Apple App Store and Google Play Store through
            keyword research, metadata refinement, visual asset optimization,
            and conversion rate improvement.
          </p>
          <p className="mb-8 text-gray-600 text-lg leading-relaxed">
            Our ASO integrates with{" "}
            <span className="cursor-pointer font-semibold text-blue-600 hover:underline">
              mobile app development
            </span>{" "}
            and{" "}
            <span className="cursor-pointer font-semibold text-blue-600 hover:underline">
              mobile design
            </span>{" "}
            for end-to-end app growth.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-8 text-center shadow-sm"
              key={i}
              whileHover={{ y: -5 }}
            >
              <div className="mb-2 rounded-xl bg-white p-4 shadow-sm">
                {React.cloneElement(
                  s.icon as React.ReactElement<{ size?: number }>,
                  { size: 32 }
                )}
              </div>
              <span className="font-bold text-[#050A18] text-lg">
                {s.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BusinessBenefits = () => {
  const stats = [
    { value: "200+", label: "Apps Optimized", color: "text-blue-600" },
    { value: "3x", label: "Avg Download Lift", color: "text-orange-500" },
    { value: "iOS", label: "& Android", color: "text-blue-600" },
    { value: "Global", label: "Marketplace", color: "text-blue-600" },
  ];

  const benefits = [
    "Increased organic downloads & reduced paid costs",
    "Improved app discoverability & higher conversion rates",
    "Stronger marketplace positioning & long-term sustainability",
    "Data-driven keyword research & structured A/B testing",
    "Integration with performance marketing teams",
  ];

  return (
    <section className="bg-[#F8FAFC] px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-6">
          {stats.map((s, i) => (
            <div
              className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm"
              key={i}
            >
              <div className={`mb-2 font-black text-5xl ${s.color}`}>
                {s.value}
              </div>
              <div className="font-bold text-gray-500 text-sm uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="mb-8 font-bold text-4xl text-[#050A18] lg:text-5xl">
            Business Benefits of <span className="text-orange-500">ASO</span>
          </h2>
          <div className="flex flex-col gap-6">
            {benefits.map((b, i) => (
              <div className="flex items-start gap-4" key={i}>
                <IconCircleCheck
                  className="mt-1 shrink-0 text-orange-500"
                  size={20}
                />
                <span className="font-medium text-gray-700 text-lg">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Capabilities = () => {
  const items = [
    {
      id: "01",
      title: "Keyword & Metadata",
      desc: "High-intent search terms, competitive keyword gaps, ranking opportunities, store algorithm alignment, and structured metadata updates.",
    },
    {
      id: "02",
      title: "Listing Conversion",
      desc: "App titles, descriptions, feature highlights, value proposition clarity, and CTA messaging optimization for higher download rates.",
    },
    {
      id: "03",
      title: "Visual Assets",
      desc: "App icon strategy, screenshot storytelling, preview video positioning, and visual hierarchy for stronger first impressions.",
    },
    {
      id: "04",
      title: "A/B Testing",
      desc: "Title variations, screenshot sequencing, feature emphasis testing, and conversion rate benchmarking for data-backed improvements.",
    },
    {
      id: "05",
      title: "Analytics & Reporting",
      desc: "Keyword ranking tracking, install growth analysis, conversion rate performance, competitive benchmarking, and retention signal monitoring.",
    },
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-black text-4xl text-[#050A18] lg:text-6xl">
            Our ASO <span className="text-orange-500 italic">Capabilities</span>
          </h2>
          <p className="font-medium text-gray-500 text-xl">
            From keyword strategy to ranking monitoring
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              className="rounded-3xl border border-gray-100 bg-[#F8FAFC] p-10 shadow-sm"
              key={i}
              whileHover={{ scale: 1.02 }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 font-black text-white text-xl">
                {item.id}
              </div>
              <h3 className="mb-4 font-black text-2xl text-[#050A18]">
                {item.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
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
    { id: 1, title: "Market Analysis" },
    { id: 2, title: "Keywords" },
    { id: 3, title: "Listing" },
    { id: 4, title: "Visuals" },
    { id: 5, title: "A/B Test" },
    { id: 6, title: "Monitor" },
    { id: 7, title: "Optimize" },
  ];

  return (
    <section className="overflow-hidden bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-6 font-black text-4xl text-[#050A18] lg:text-6xl">
          Our ASO <span className="text-orange-500 italic">Framework</span>
        </h2>
        <div className="relative flex flex-wrap items-center justify-center gap-8 lg:gap-4">
          {steps.map((step, i) => (
            <React.Fragment key={step.id}>
              <div className="group flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-gray-100 bg-white shadow-lg transition-all group-hover:border-blue-400 lg:h-32 lg:w-32">
                    <span className="font-bold text-gray-800 text-sm lg:text-base">
                      {step.title}
                    </span>
                  </div>
                  <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-sm text-white shadow-md">
                    {step.id}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden text-gray-200 lg:block">
                  <IconArrowRight size={24} />
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
  const reasons = [
    "Global marketplace expertise",
    "Data-driven keyword research",
    "Conversion-focused listings",
    "Structured A/B testing",
    "Performance marketing integration",
    "Continuous ranking tracking",
  ];

  return (
    <section className="bg-[#F8FAFC] px-6 py-24">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-6 font-black text-4xl text-[#050A18] lg:text-6xl">
          Why Choose{" "}
          <span className="text-orange-500 italic">WorkHolo Labs</span>?
        </h2>
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
          {reasons.map((r, i) => (
            <div
              className="flex cursor-default items-center gap-3 rounded-full border border-gray-200 bg-white px-8 py-3 shadow-sm transition-colors hover:border-orange-400"
              key={i}
            >
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="font-bold text-gray-700">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Industries = () => {
  const industries = [
    { icon: <IconDeviceDesktop />, title: "SaaS & Mobile Products" },
    { icon: <IconCreditCard />, title: "FinTech Applications" },
    { icon: <IconShoppingBag />, title: "eCommerce Apps" },
    { icon: <IconHeartbeat />, title: "Healthcare & Wellness" },
    { icon: <IconTruck />, title: "On-Demand Platforms" },
    { icon: <IconBuilding />, title: "Enterprise Mobile" },
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-20 text-center font-black text-4xl text-[#050A18] lg:text-6xl">
          Industries We <span className="text-orange-500 italic">Support</span>
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {industries.map((ind, i) => (
            <motion.div
              className="flex flex-col items-center gap-6 rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-gray-200/50 shadow-xl"
              key={i}
              whileHover={{ y: -10 }}
            >
              <div className="text-blue-500">
                {React.cloneElement(
                  ind.icon as React.ReactElement<{ size?: number }>,
                  { size: 32 }
                )}
              </div>
              <h3 className="font-black text-[#050A18] text-xl">{ind.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Tools = () => {
  const tools = [
    "App Annie",
    "Sensor Tower",
    "Mobile Action",
    "AppTweak",
    "SplitMetrics",
    "StoreMaven",
    "App Radar",
    "Keyword Tool",
    "App Store Connect",
    "Google Play Console",
    "Firebase",
    "Adjust",
    "AppsFlyer",
    "Mixpanel",
    "Amplitude",
    "TestFlight",
    "Google Experiments",
    "Localization",
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <h2 className="mb-8 font-black text-4xl text-[#050A18] lg:text-6xl">
            ASO{" "}
            <span className="text-orange-500 italic">Tools & Platforms</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {tools.map((tool, i) => (
              <span
                className="rounded-lg border border-gray-100 bg-[#F8FAFC] px-4 py-2 font-bold text-gray-600 text-sm"
                key={i}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {["200+", "iOS", "Global", "14+"].map((v, i) => (
            <div
              className="rounded-3xl border border-gray-50 bg-white p-10 text-center shadow-lg"
              key={i}
            >
              <div className="mb-2 font-black text-5xl text-blue-600">{v}</div>
              <div className="font-bold text-gray-500 text-sm uppercase">
                {["Apps Optimized", "& Android", "Markets", "Years"][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Executives = () => {
  const leaders = [
    {
      name: "Srinivas Rao",
      role: "CEO & Founder",
      image: "https://picsum.photos/seed/ceo/400/400",
    },
    {
      name: "Anitha Reddy",
      role: "Chief Operations Officer",
      image: "https://picsum.photos/seed/coo/400/400",
    },
    {
      name: "Rajesh Kumar",
      role: "Head of Technology",
      image: "https://picsum.photos/seed/cto/400/400",
    },
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-20 text-center font-black text-4xl text-[#050A18] lg:text-6xl">
          Our <span className="text-orange-500 italic">Executives</span>
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {leaders.map((leader, i) => (
            <motion.div
              className="group flex flex-col items-center text-center"
              key={i}
              whileHover={{ y: -10 }}
            >
              <div className="mb-8 h-64 w-64 overflow-hidden rounded-full border-8 border-[#F8FAFC] transition-all group-hover:border-[#7B2CBF]/20">
                <img
                  alt={leader.name}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  src={leader.image}
                />
              </div>
              <h3 className="mb-2 font-black text-2xl text-[#050A18]">
                {leader.name}
              </h3>
              <p className="font-bold text-[#7B2CBF] text-sm uppercase tracking-widest">
                {leader.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LatestJobs = () => {
  const jobs = [
    {
      title: "Senior Mobile App Developer",
      type: "Full Time",
      location: "Hyderabad, India",
    },
    { title: "ASO Specialist", type: "Remote", location: "Bangalore, India" },
    { title: "UI/UX Designer", type: "Full Time", location: "USA" },
    {
      title: "Digital Marketing Manager",
      type: "Full Time",
      location: "Hyderabad, India",
    },
  ];

  return (
    <section className="bg-[#F8FAFC] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
          <div>
            <h2 className="mb-4 font-black text-4xl text-[#050A18] lg:text-6xl">
              Latest{" "}
              <span className="text-orange-500 italic">Job Openings</span>
            </h2>
          </div>
          <button className="rounded-xl bg-[#7B2CBF] px-8 py-4 font-bold text-white transition-all hover:bg-[#6A24A3]">
            View All Careers
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job, i) => (
            <motion.div
              className="group flex cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
              key={i}
              whileHover={{ x: 10 }}
            >
              <div>
                <h3 className="mb-2 font-black text-[#050A18] text-xl transition-colors group-hover:text-[#7B2CBF]">
                  {job.title}
                </h3>
                <div className="flex gap-4 font-bold text-gray-400 text-sm uppercase tracking-wider">
                  <span>{job.type}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8FAFC] text-[#7B2CBF] transition-all group-hover:bg-[#7B2CBF] group-hover:text-white">
                <IconArrowRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const JointTalent = () => {
  return (
    <section className="bg-white px-6 py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#7B2CBF] p-12 text-center lg:p-24">
        <div className="relative z-10">
          <h2 className="mb-8 font-black text-4xl text-white lg:text-7xl">
            Joint <span className="text-orange-400 italic">Talent</span> Network
          </h2>
          <p className="mx-auto mb-12 max-w-3xl font-medium text-white/80 text-xl lg:text-2xl">
            Not finding the right role? Join our talent community to stay
            updated on future opportunities.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <input
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-8 py-5 font-bold text-white transition-all placeholder:text-white/50 focus:bg-white/20 focus:outline-none sm:w-96"
              placeholder="Enter your email address"
              type="email"
            />
            <button className="rounded-2xl bg-white px-12 py-5 font-black text-[#7B2CBF] text-xl transition-all hover:bg-gray-100">
              Join Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    {
      q: "What are app store optimization services?",
      a: "ASO services involve optimizing various elements of your app's store listing to improve its visibility and ranking.",
    },
    {
      q: "How long does ASO take to show results?",
      a: "Typically, you can start seeing initial ranking improvements within 2-4 weeks.",
    },
    {
      q: "Is ASO necessary if I run paid ads?",
      a: "Yes! ASO improves your conversion rate, which makes your paid ads more efficient.",
    },
    {
      q: "Do you optimize both Apple and Google Play?",
      a: "Absolutely. We understand the unique algorithms of both stores.",
    },
  ];

  return (
    <section className="bg-[#F8FAFC] px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-16 text-center font-black text-4xl text-[#050A18] lg:text-6xl">
          Frequently Asked{" "}
          <span className="text-orange-500 italic">Questions</span>
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              key={i}
            >
              <button
                className="flex w-full items-center justify-between px-8 py-6 text-left transition-colors hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-bold text-[#050A18] text-lg">
                  {faq.q}
                </span>
                <IconChevronDown
                  className={`transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
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

const BoostCTA = () => {
  return (
    <section className="relative overflow-hidden bg-[#050A18] px-6 py-32 text-center">
      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="mb-8 font-black text-4xl text-white leading-tight lg:text-7xl">
          Boost Your{" "}
          <span className="text-orange-500 italic">App Visibility</span>
        </h2>
        <button className="transform rounded-xl bg-[#7B2CBF] px-12 py-5 font-black text-white text-xl shadow-2xl shadow-[#7B2CBF]/20 transition-all hover:scale-105 hover:bg-[#6A24A3]">
          Start App Optimization
        </button>
      </div>
    </section>
  );
};

export default function ASOServices() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#7B2CBF] selection:text-white">
      <Hero />
      <WhatIsASO />
      <BusinessBenefits />
      <Capabilities />
      <Framework />
      <WhyChoose />
      <Industries />
      <Tools />
      <Executives />
      <LatestJobs />
      <JointTalent />
      <FAQ />
      <BoostCTA />
      <div className="fixed right-8 bottom-8 z-50 flex flex-col gap-4">
        <motion.button
          className="rounded-full bg-green-500 p-4 text-white shadow-2xl shadow-green-500/40"
          whileHover={{ scale: 1.1 }}
        >
          <IconMessage2 size={28} />
        </motion.button>
        <motion.button
          className="rounded-full bg-blue-500 p-4 text-white shadow-2xl shadow-blue-500/40"
          whileHover={{ scale: 1.1 }}
        >
          <IconArrowRight className="-rotate-90" size={28} />
        </motion.button>
      </div>
    </div>
  );
}
