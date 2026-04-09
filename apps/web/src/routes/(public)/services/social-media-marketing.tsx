import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  CreditCard,
  HeartPulse,
  Minus,
  Monitor,
  Plus,
  Rocket,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

// --- Components ---

const Hero = () => (
  <section className="relative overflow-hidden px-6 pt-20 pb-32">
    <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full -translate-x-1/2">
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[120px]" />
    </div>

    <div className="container-max relative z-10 text-center">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="mb-8 flex justify-center gap-2 font-medium text-gray-500 text-xs uppercase tracking-widest">
          <span>Home</span> / <span>Services</span> /{" "}
          <span className="text-accent">Social Media Marketing</span>
        </nav>
        <h1 className="mb-6 font-extrabold text-5xl tracking-tight md:text-7xl">
          Social Media <span className="text-accent italic">Marketing</span>{" "}
          Services
        </h1>
        <h2 className="mx-auto mb-8 max-w-3xl font-medium text-gray-300 text-xl leading-relaxed md:text-2xl">
          Strategic Brand Growth Across Global Social Platforms
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-gray-400 text-lg leading-relaxed">
          WorkHolo Labs delivers structured social media marketing services
          designed to strengthen brand visibility, audience engagement, and
          measurable growth across digital platforms. Strategy creates impact.
        </p>
      </motion.div>
    </div>
  </section>
);

const WhatIsSocial = () => (
  <section className="section-padding bg-darker/50">
    <div className="container-max grid items-center gap-16 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <h2 className="mb-8 font-bold text-4xl leading-tight md:text-5xl">
          What Are <span className="text-accent">Social Media Marketing</span>{" "}
          Services?
        </h2>
        <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
          <p>
            Social media marketing services involve planning, managing, and
            optimizing brand presence across platforms to increase awareness,
            engagement, and conversions — including audience research, content
            planning, paid advertising, and performance analytics.
          </p>
          <p>
            Our social strategies integrate with{" "}
            <span className="font-medium text-blue-400">content marketing</span>{" "}
            and <span className="font-medium text-blue-400">SEO</span> for
            comprehensive digital growth.
          </p>
          <p>
            Combined with{" "}
            <span className="font-medium text-blue-400">paid media</span> and{" "}
            <span className="font-medium text-blue-400">
              performance marketing
            </span>
            , social campaigns amplify high-value audiences and drive measurable
            business outcomes.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {[
          {
            icon: <Monitor className="text-blue-400" />,
            title: "Platform Strategy",
          },
          { icon: <Zap className="text-pink-400" />, title: "Paid Social" },
          {
            icon: <Users className="text-purple-400" />,
            title: "Community Growth",
          },
          {
            icon: <BarChart3 className="text-green-400" />,
            title: "Analytics",
          },
        ].map((item, i) => (
          <motion.div
            className="glass-card group flex cursor-default flex-col items-center gap-4 p-8 text-center transition-all hover:bg-white/10"
            initial={{ opacity: 0, y: 20 }}
            key={i}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="rounded-2xl bg-white/5 p-4 transition-transform group-hover:scale-110">
              {item.icon}
            </div>
            <h3 className="font-bold text-lg">{item.title}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Benefits = () => (
  <section className="section-padding">
    <div className="container-max grid items-center gap-20 lg:grid-cols-2">
      <div className="order-2 grid grid-cols-2 gap-6 lg:order-1">
        {[
          { val: "300+", label: "Campaigns Managed" },
          { val: "5x", label: "Avg Engagement Lift" },
          { val: "Global", label: "Platform Reach" },
          { val: "14+", label: "Years Experience" },
        ].map((stat, i) => (
          <motion.div
            className="glass-card flex flex-col items-center justify-center gap-2 border-blue-500/20 p-10 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            key={i}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <span className="font-black text-4xl text-blue-500">
              {stat.val}
            </span>
            <span className="font-medium text-gray-400 text-sm uppercase tracking-wider">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="order-1 lg:order-2"
        initial={{ opacity: 0, x: 30 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <h2 className="mb-8 font-bold text-4xl leading-tight md:text-5xl">
          Business Benefits of <span className="text-accent">Social Media</span>
        </h2>
        <p className="mb-10 text-gray-400 text-lg">
          Social platforms influence modern buying decisions:
        </p>
        <ul className="space-y-6">
          {[
            "Increased brand visibility & higher engagement",
            "Improved customer trust & better campaign reach",
            "Data-backed growth insights & multi-channel expansion",
            "B2B thought leadership & executive branding",
            "Integration with SEO & content marketing",
          ].map((text, i) => (
            <li
              className="flex items-center gap-4 text-gray-300 text-lg"
              key={i}
            >
              <CheckCircle2 className="flex-shrink-0 text-accent" size={24} />
              {text}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
);

const Capabilities = () => (
  <section className="section-padding bg-darker/30">
    <div className="container-max mb-16 text-center">
      <h2 className="mb-4 font-bold text-4xl md:text-5xl">
        Our Social Media <span className="text-accent">Capabilities</span>
      </h2>
      <p className="text-gray-400 text-lg">
        From strategy to scalable brand growth
      </p>
    </div>

    <div className="container-max grid gap-8 md:grid-cols-2">
      {[
        {
          id: "01",
          title: "Strategy Development",
          desc: "Platform selection, target audience alignment, content positioning, competitive benchmarking, and engagement objectives planning.",
        },
        {
          id: "02",
          title: "Content & Brand Positioning",
          desc: "Brand storytelling, educational engagement, authority positioning, campaign-based messaging, and product awareness strategies.",
        },
        {
          id: "03",
          title: "Paid Social Advertising",
          desc: "Performance campaigns across Meta, LinkedIn, emerging platforms, and retargeting to amplify high-value audiences.",
        },
        {
          id: "04",
          title: "Community & Engagement",
          desc: "Engagement optimization, audience interaction, reputation management, brand trust reinforcement, and loyalty building.",
        },
        {
          id: "05",
          title: "B2B & Enterprise Social",
          desc: "Thought leadership, executive brand amplification, industry-focused campaigns, LinkedIn authority building, and employer branding support.",
        },
      ].map((item, i) => (
        <motion.div
          className={`glass-card group flex flex-col gap-6 p-10 transition-all hover:border-primary/50 ${i === 4 ? "md:col-span-2" : ""}`}
          initial={{ opacity: 0, y: 30 }}
          key={i}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 font-bold text-sm text-white">
            {item.id}
          </span>
          <h3 className="font-bold text-2xl transition-colors group-hover:text-primary">
            {item.title}
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const Framework = () => (
  <section className="section-padding overflow-hidden">
    <div className="container-max mb-20 text-center">
      <h2 className="mb-4 font-bold text-4xl md:text-5xl">
        Our Social Media <span className="text-accent">Framework</span>
      </h2>
      <p className="text-gray-400 text-lg">
        Consistency and measurement drive results.
      </p>
    </div>

    <div className="container-max relative">
      <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-white/10 lg:block" />
      <div className="relative z-10 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
        {[
          { id: 1, title: "Strategy" },
          { id: 2, title: "Content" },
          { id: 3, title: "Deploy", active: true },
          { id: 4, title: "Amplify" },
          { id: 5, title: "Monitor" },
          { id: 6, title: "Refine" },
        ].map((step, i) => (
          <div className="flex flex-col items-center gap-6" key={i}>
            <div
              className={`relative flex h-20 w-32 items-center justify-center rounded-2xl transition-all duration-500 ${step.active ? "scale-110 bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)]" : "border border-white/10 bg-white/5"}`}
            >
              <span className="font-bold text-sm uppercase tracking-widest">
                {step.title}
              </span>
              <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full border-4 border-dark bg-blue-500 font-bold text-xs">
                {step.id}
              </div>
            </div>
            {i < 5 && <ArrowRight className="text-gray-600 lg:hidden" />}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WhyChoose = () => (
  <section className="section-padding bg-darker/50">
    <div className="container-max mb-16 text-center">
      <h2 className="mb-4 font-bold text-4xl md:text-5xl">
        Why Choose <span className="text-accent">WorkHolo Labs</span>?
      </h2>
      <p className="text-gray-400 text-lg">
        We align brand presence with measurable business growth.
      </p>
    </div>

    <div className="container-max flex flex-wrap justify-center gap-4">
      {[
        "Strategy-first planning",
        "Data-driven paid amplification",
        "B2B & SaaS expertise",
        "SEO & content integration",
        "Transparent analytics",
        "Scalable global execution",
      ].map((feature, i) => (
        <motion.div
          className="flex cursor-default items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 transition-all hover:bg-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          key={i}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-medium text-gray-200">{feature}</span>
        </motion.div>
      ))}
    </div>
  </section>
);

const Industries = () => (
  <section className="section-padding">
    <div className="container-max mb-16 text-center">
      <h2 className="mb-4 font-bold text-4xl md:text-5xl">
        Industries We <span className="text-accent">Support</span>
      </h2>
    </div>

    <div className="container-max grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[
        {
          icon: <Monitor className="text-blue-400" />,
          title: "Technology & SaaS",
        },
        {
          icon: <CreditCard className="text-green-400" />,
          title: "Financial Services",
        },
        { icon: <HeartPulse className="text-red-400" />, title: "Healthcare" },
        {
          icon: <ShoppingCart className="text-orange-400" />,
          title: "eCommerce",
        },
        {
          icon: <Briefcase className="text-purple-400" />,
          title: "Enterprise B2B",
        },
        { icon: <Rocket className="text-pink-400" />, title: "Startup Growth" },
      ].map((industry, i) => (
        <motion.div
          className="glass-card group flex flex-col items-center gap-6 p-12 text-center transition-all hover:bg-white/10"
          initial={{ opacity: 0, y: 20 }}
          key={i}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-3xl bg-white/5 p-6 transition-colors group-hover:bg-white/10">
            {industry.icon}
          </div>
          <h3 className="font-bold text-xl">{industry.title}</h3>
        </motion.div>
      ))}
    </div>
  </section>
);

const TechStack = () => (
  <section className="section-padding bg-darker/30">
    <div className="container-max grid items-center gap-20 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <h2 className="mb-8 font-bold text-4xl leading-tight md:text-5xl">
          Social Media <span className="text-accent">Technology Stack</span>
        </h2>
        <p className="mb-10 text-gray-400 text-lg">
          Enterprise social management and analytics platforms.
        </p>

        <div className="flex flex-wrap gap-3">
          {[
            "Meta Business Suite",
            "LinkedIn Campaign Manager",
            "Hootsuite",
            "Buffer",
            "Sprout Social",
            "Later",
            "Canva",
            "Adobe Creative Suite",
            "Google Analytics 4",
            "Facebook Pixel",
            "Meta Ads Manager",
            "LinkedIn Analytics",
            "Brandwatch",
            "Mention",
            "BuzzSumo",
            "Sprinklr",
            "HubSpot Social",
            "Zapier",
          ].map((tool, i) => (
            <span
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-medium text-gray-400 text-sm transition-colors hover:text-white"
              key={i}
            >
              {tool}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { val: "300+", label: "Campaigns" },
          { val: "5x", label: "Engagement" },
          { val: "18+", label: "Tools" },
          { val: "14+", label: "Years" },
        ].map((stat, i) => (
          <div
            className="glass-card flex flex-col items-center gap-2 border-blue-500/20 p-10 text-center"
            key={i}
          >
            <span className="font-black text-4xl text-blue-500">
              {stat.val}
            </span>
            <span className="font-medium text-gray-400 text-sm uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What are social media marketing services?",
      a: "Social media marketing services involve strategic planning, content creation, community management, and paid advertising across platforms like LinkedIn, Facebook, Instagram, and Twitter to drive business growth.",
    },
    {
      q: "Is paid advertising necessary?",
      a: "While organic growth is important, paid advertising allows for precise targeting, faster results, and the ability to scale your reach to high-value audiences that organic posts might not reach.",
    },
    {
      q: "Which platforms do you manage?",
      a: "We manage all major platforms including LinkedIn (B2B focus), Meta (Facebook/Instagram), Twitter (X), YouTube, and emerging platforms based on your target audience.",
    },
    {
      q: "Can social media generate leads?",
      a: "Absolutely. Through targeted lead generation campaigns, strategic content, and conversion-optimized landing pages, social media is a powerful engine for both B2B and B2C lead generation.",
    },
  ];

  return (
    <section className="section-padding">
      <div className="container-max mb-16 text-center">
        <h2 className="mb-4 font-bold text-4xl md:text-5xl">
          Frequently Asked <span className="text-accent">Questions</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Everything about social media marketing
        </p>
      </div>

      <div className="container-max max-w-3xl space-y-4">
        {faqs.map((faq, i) => (
          <div className="glass-card overflow-hidden" key={i}>
            <button
              className="flex w-full items-center justify-between p-6 text-left font-bold text-lg transition-colors hover:bg-white/5"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {faq.q}
              {openIndex === i ? (
                <Minus className="text-accent" size={20} />
              ) : (
                <Plus className="text-accent" size={20} />
              )}
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-6 pb-6 text-gray-400 leading-relaxed"
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
  <section className="section-padding">
    <div className="container-max relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-darker to-dark p-12 text-center md:p-24">
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-primary/5 blur-[100px]" />
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <h2 className="mb-8 font-black text-5xl tracking-tight md:text-7xl">
          Grow Your <span className="text-accent">Social Presence</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-gray-400 text-xl leading-relaxed">
          Let's discuss how social media marketing can strengthen your brand and
          drive measurable growth.
        </p>
        <button className="rounded-xl bg-accent px-12 py-5 font-black text-dark text-xl shadow-[0_10px_40px_rgba(245,158,11,0.3)] transition-all hover:scale-105 hover:bg-accent/90">
          Start Social Strategy
        </button>
      </motion.div>
    </div>
  </section>
);

export default function SocialMediaMarketing() {
  return (
    <div className="min-h-screen selection:bg-primary selection:text-white">
      <main>
        <Hero />
        <WhatIsSocial />
        <Benefits />
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
