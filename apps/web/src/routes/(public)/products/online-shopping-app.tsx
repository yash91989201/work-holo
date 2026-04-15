import {
  IconChevronDown,
  IconCircleCheck,
  IconDatabase,
  IconDeviceMobile,
  IconGlobe,
  IconHeart,
  IconLayout,
  IconMail,
  IconMessageCircle,
  IconMinus,
  IconPhone,
  IconPlus,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";

// --- Components ---

export const Route = createFileRoute("/(public)/products/online-shopping-app")({
  component: RouteComponent,
});

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0b0034] p-5 pt-32 pb-20">
      <div className="absolute top-0 right-0 -z-10 hidden h-full w-1/2 origin-top-right translate-x-32 -skew-x-12 transform bg-light-blue lg:block" />

      <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h1 className="mb-6 font-extrabold text-4xl text-[#EFEFEF] leading-[1.1] md:text-5xl lg:text-6xl">
            One-Stop Solution for{" "}
            <span className="text-primary">Online Shopping</span> Web & Mobile
            App Development
          </h1>
          <p className="mb-8 max-w-xl text-[#bdbbbb] text-lg leading-relaxed">
            Explore the future of online shopping with WorkHolo labs. We're more
            than just an app development firm; we're your strategic partner for
            developing engaging, user-centric shopping experiences.
          </p>
          <button className="rounded-lg bg-purple-600 px-10 py-4 font-bold text-lg text-white shadow-lg transition-all hover:bg-purple-900">
            View Demo
          </button>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <img
            alt="Shopping App"
            className="h-auto w-full rounded-3xl object-cover shadow-2xl"
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000"
          />
          <div className="absolute -bottom-10 -left-10 hidden rounded-2xl bg-white p-6 shadow-xl md:block">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconCircleCheck size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900">100% Secure</p>
                <p className="text-gray-500 text-sm">Payment Gateways</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ScrollingBanner = () => {
  const items = [
    "Online Shopping",
    "e commerce",
    "Fashion",
    "Online shopping",
    "Clothing",
    "Sale",
    "Online shopping",
  ];

  return (
    <div className="relative z-20 -rotate-2 scale-105 transform overflow-hidden whitespace-nowrap bg-primary p-4">
      <div className="flex animate-marquee">
        {[...items, ...items].map((item, i) => (
          <div className="mx-8 flex items-center" key={i}>
            <span className="font-bold text-2xl text-white uppercase tracking-wider">
              {item}
            </span>
            <span className="mx-8 text-3xl text-white/50">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const KeyFeatures = () => {
  const features = [
    {
      title: "User-Friendly Interface",
      icon: <IconDeviceMobile className="h-8 w-8" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Secure Payment Options",
      icon: <IconShieldCheck className="h-8 w-8" />,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Wishlists & Saved Items",
      icon: <IconHeart className="h-8 w-8" />,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Community & Social Integration",
      icon: <IconUsers className="h-8 w-8" />,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section className="section-padding bg-white p-5">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <img
              alt="Features"
              className="rounded-3xl shadow-xl"
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1556740734-7f95834d0ff9?auto=format&fit=crop&q=80&w=1000"
            />
          </motion.div>

          <div>
            <h2 className="mb-6 font-bold text-3xl text-gray-900 md:text-4xl">
              Key Features for Seamless Functionality
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature, i) => (
                <motion.div
                  className="group rounded-2xl border border-gray-100 p-6 transition-all hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  key={i}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900">{feature.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const OnDemandSection = () => {
  return (
    <section className="section-padding bg-light-blue p-5">
      <div className="container mx-auto grid items-center gap-16 px-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <img
            alt="Mobile App"
            className="rounded-3xl shadow-2xl"
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1000"
          />
        </motion.div>

        <div>
          <h2 className="mb-6 font-bold text-3xl text-gray-900 md:text-4xl">
            On - Demand Shopping App Development
          </h2>
          <p className="mb-6 text-gray-600 leading-relaxed">
            In today's rapidly changing digital landscape, online shopping
            applications are essential tools for both businesses and consumers.
            These apps have transformed the retail business by offering a
            seamless, convenient, and entertaining purchasing experience that
            connects physical locations and online platforms.
          </p>
          <p className="text-gray-600 leading-relaxed">
            As technology advances, online shopping apps will become more
            complex. Innovations such as AI, AR, and virtual reality will
            further enhance the shopping experience, making it more interactive
            and personalised.
          </p>
        </div>
      </div>
    </section>
  );
};

const AppScreens = () => {
  const screens = [
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1523206489230-c012c5458c15?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1533228891704-7fce9a093d7b?auto=format&fit=crop&q=80&w=400",
  ];

  return (
    <section className="section-padding bg-primary/10 p-5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 font-bold text-3xl text-gray-900 md:text-4xl">
          App Screens
        </h2>
        <p className="mb-12 text-gray-600">
          Designing Intuitive and Engaging App Screens for a Superior User
          Experience
        </p>

        <div className="no-scrollbar flex flex-nowrap gap-6 overflow-x-auto pb-8">
          {screens.map((screen, i) => (
            <motion.div
              className="h-[500px] w-64 flex-none overflow-hidden rounded-[40px] border-8 border-black shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              key={i}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <img
                alt={`Screen ${i + 1}`}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                src={screen}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ApplicationFeatures = () => {
  const [activeTab, setActiveTab] = useState("customer");

  const tabs = [
    { id: "customer", name: "Customer Panel" },
    { id: "admin", name: "Admin Panel" },
    { id: "delivery", name: "Delivery Panel" },
  ];

  return (
    <section className="section-padding bg-white px-5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 font-bold text-3xl text-gray-900 md:text-4xl">
          Application Features
        </h2>
        <p className="mb-12 text-gray-600">
          Powerful and User-Centric Features to Enhance Your App's Functionality
        </p>

        <div className="mx-auto mb-12 flex max-w-4xl rounded-full bg-light-blue p-2">
          {tabs.map((tab) => (
            <button
              className={`flex-1 rounded-full py-4 font-bold transition-all ${activeTab === tab.id ? "bg-orange-400 text-white shadow-lg" : "text-gray-600 hover:bg-white/50"}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="flex min-h-[400px] items-center justify-center rounded-[40px] bg-light-blue p-12">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-12 text-left md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            key={activeTab}
          >
            <div className="space-y-4">
              <h3 className="font-bold text-2xl text-gray-900 capitalize">
                {activeTab} Features
              </h3>
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li
                    className="flex items-center gap-3 text-gray-600"
                    key={item}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <IconCircleCheck size={14} />
                    </div>
                    Advanced {activeTab} dashboard and management tools.
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center rounded-3xl bg-white/50 p-8">
              <div className="h-48 w-full animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Custom Store Design",
      desc: "Unique App Designs Aligned with Your Brand",
      icon: <IconLayout />,
    },
    {
      title: "Mobile App Development",
      desc: "Advanced iOS & Android Shopping Apps",
      icon: <IconDeviceMobile />,
    },
    {
      title: "Payment Gateway Setup",
      desc: "Secure & Seamless Payment Processing",
      icon: <IconShieldCheck />,
    },
    {
      title: "UX/UI Design",
      desc: "Intuitive Interfaces for Smooth Shopping",
      icon: <IconLayout />,
    },
    {
      title: "Multi-Vendor Marketplace",
      desc: "Easy Management for Multiple Sellers",
      icon: <IconUsers />,
    },
    {
      title: "Order Tracking",
      desc: "Real-Time Order & Delivery Updates",
      icon: <IconGlobe />,
    },
    {
      title: "Product Catalog System",
      desc: "Simple Tools for Product Listings & Updates",
      icon: <IconDatabase />,
    },
    {
      title: "Customer Support Chat",
      desc: "AI Chatbots & Integrated Support Systems",
      icon: <IconMessageCircle />,
    },
  ];

  return (
    <section className="section-padding bg-primary/5 p-5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 font-bold text-3xl text-gray-900 md:text-4xl">
          Online Shopping App Development Services
        </h2>
        <p className="mb-12 text-gray-600">
          Comprehensive Services for Seamless Online Shopping App Development
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <motion.div
              className="group rounded-3xl border border-primary/10 bg-white p-8 transition-all hover:border-primary"
              initial={{ opacity: 0, scale: 0.9 }}
              key={i}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-black text-white transition-colors group-hover:bg-primary">
                {React.cloneElement(
                  service.icon as React.ReactElement<{ size?: number }>,
                  { size: 40 }
                )}
              </div>
              <h3 className="mb-2 font-bold text-gray-900">{service.title}</h3>
              <p className="text-gray-500 text-sm">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Technology = () => {
  const techs = [
    {
      name: "HTML5",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    },
    {
      name: "CSS3",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    },
    {
      name: "JavaScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    {
      name: "Bootstrap",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    },
    {
      name: "PHP",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    },
    {
      name: "Laravel",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
    },
    {
      name: "Flutter",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
    },
    {
      name: "Firebase",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    },
    {
      name: "MySQL",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    },
    {
      name: "AWS",
      icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    },
  ];

  return (
    <section className="section-padding bg-white p-5">
      <div className="container mx-auto px-4 text-center">
        <div className="rounded-[50px] bg-light-blue p-16">
          <h2 className="mb-4 font-bold text-3xl text-gray-900 md:text-4xl">
            Technology We Use
          </h2>
          <p className="mb-16 text-gray-600">
            Reliable and Advanced Technologies We Use for App Development
          </p>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {techs.map((tech, i) => (
              <motion.div
                className="flex items-center justify-center rounded-2xl bg-white p-6 shadow-sm"
                key={i}
                whileHover={{ y: -10 }}
              >
                <img
                  alt={tech.name}
                  className="h-12 w-auto grayscale transition-all hover:grayscale-0"
                  referrerPolicy="no-referrer"
                  src={tech.icon}
                />
              </motion.div>
            ))}
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
      q: "How long does it take to develop an online shopping app?",
      a: "Development time varies depending on complexity, but typically ranges from 3 to 6 months for a full-featured application.",
    },
    {
      q: "Can I customize the online shopping app to match my brand?",
      a: "Yes, we provide fully custom designs that align perfectly with your brand identity, colors, and user experience requirements.",
    },
    {
      q: "Will my app be compatible with both iOS and Android devices?",
      a: "Absolutely. We use cross-platform technologies like Flutter or native development to ensure your app works flawlessly on both platforms.",
    },
    {
      q: "Can the app integrate with my existing e-commerce platform?",
      a: "Yes, we can integrate with popular platforms like Shopify, Magento, WooCommerce, or your custom-built backend via APIs.",
    },
    {
      q: "Do you provide post-launch support for the online shopping app?",
      a: "Yes, we offer comprehensive support and maintenance packages to ensure your app stays updated and performs optimally.",
    },
  ];

  return (
    <section className="section-padding bg-white p-5">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="mb-12 text-center font-bold text-4xl text-gray-900">
          FAQ's
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div className="border-gray-100 border-b" key={i}>
              <button
                className={`flex w-full items-center justify-between py-6 text-left font-bold text-lg transition-colors ${openIndex === i ? "text-primary" : "text-gray-900"}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${openIndex === i ? "rotate-180 bg-primary text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {openIndex === i ? (
                    <IconMinus size={18} />
                  ) : (
                    <IconPlus size={18} />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                  >
                    <p className="pb-6 text-gray-600 leading-relaxed">
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

const WhatsAppButton = () => (
  <a
    className="group fixed right-8 bottom-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110"
    href="https://wa.me/919390683154"
    rel="noopener noreferrer"
    target="_blank"
  >
    <div className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" />
    <IconMessageCircle size={32} />
    <span className="absolute right-full mr-4 whitespace-nowrap rounded-lg bg-white px-4 py-2 font-bold text-black text-sm opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
      Chat with us
    </span>
  </a>
);

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  return (
    <button
      className={`fixed right-8 bottom-28 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white shadow-xl transition-all ${visible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <IconChevronDown className="rotate-180" size={24} />
    </button>
  );
};

export default function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Info Bar */}
      <div className="border-white/10 border-b bg-black py-2 text-[10px] text-white md:text-xs">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <a
              className="flex items-center gap-1 transition-colors hover:text-primary"
              href="mailto:contact@WorkHololabs.com"
            >
              <IconMail size={12} /> contact@WorkHololabs.com
            </a>
            <a
              className="flex items-center gap-1 transition-colors hover:text-primary"
              href="tel:+919390683154"
            >
              <IconPhone size={12} /> +91 9390683154
            </a>
            <a
              className="flex items-center gap-1 transition-colors hover:text-primary"
              href="tel:+15512220070"
            >
              <IconPhone size={12} /> +1 (551) 222-0070
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-yellow-500">NASSCOM</span>
            <span>SME Inspire Awards 2026 🏆</span>
            <div className="hidden gap-4 text-gray-400 md:flex">
              <span>Hyderabad</span>
              <span>|</span>
              <span>Bangalore</span>
              <span>|</span>
              <span>USA</span>
            </div>
          </div>
        </div>
      </div>

      <main>
        <Hero />
        <ScrollingBanner />
        <KeyFeatures />
        <OnDemandSection />
        <AppScreens />
        <ApplicationFeatures />
        <Services />
        <Technology />
        <FAQ />
      </main>
      <WhatsAppButton />
      <ScrollToTop />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </div>
  );
}
