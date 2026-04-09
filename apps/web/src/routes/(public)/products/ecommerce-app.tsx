import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  CreditCard,
  Globe,
  Heart,
  Layout,
  Mail,
  MessageSquare,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

// --- Components ---

const TopBar = () => (
  <div className="hidden border-white/10 border-b bg-black py-2 text-white md:block">
    <div className="container mx-auto px-4 flex items-center justify-between font-medium text-xs">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-[#007bff]" />
          <span>contact@WorkHololabs.com</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-[#007bff]" />
          <span>+91 9390683154</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-[#007bff]" />
          <span>+1 (551) 222-0070</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-yellow-500">NASSCOM</span>
          <span>SME Inspire Awards 2026</span>
          <span>🏆</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <span>Hyderabad</span>
          <span>|</span>
          <span>Bangalore</span>
          <span>|</span>
          <span>USA</span>
        </div>
      </div>
    </div>
  </div>
);

const SectionHeading = ({
  title,
  subtitle,
  centered = true,
  dark = false,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
}) => (
  <div className={`mb-12 ${centered ? "text-center" : "text-left"}`}>
    <motion.h2
      className={`mb-4 font-extrabold text-3xl md:text-4xl ${dark ? "text-white" : "text-[#1a1a1a]"}`}
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        className={`max-w-3xl text-lg ${centered ? "mx-auto" : ""} ${dark ? "text-gray-400" : "text-gray-600"}`}
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

interface AccordionItemProps {
  answer: string;
  question: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200">
      <button
        className="flex w-full items-center justify-between bg-white p-5 text-left transition-colors hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-[#1a1a1a]">{question}</span>
        {isOpen ? (
          <Minus className="h-5 w-5 text-[#007bff]" />
        ) : (
          <Plus className="h-5 w-5 text-[#007bff]" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden bg-gray-50"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
          >
            <div className="border-gray-200 border-t p-5 text-gray-600 text-sm leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function EcommerceApp() {
  const [activeTab, setActiveTab] = useState("Customer Panel");

  return (
    <div className="min-h-screen bg-white">
      <TopBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#fdf2f8] pt-32 pb-20 md:pt-48 md:pb-32">
        {/* Background Patterns */}
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 h-20 w-20 rounded-full border-4 border-pink-500" />
          <div className="absolute right-10 bottom-20 h-32 w-32 rounded-full border-4 border-blue-500" />
          <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-200" />
        </div>

        <div className="container mx-auto px-4 relative grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, x: -50 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h1 className="mb-8 font-black text-4xl leading-tight md:text-6xl">
              Transform Your <br />
              <span className="text-[#007bff]">E-Commerce Business</span> <br />
              with a Custom Mobile App Solution
            </h1>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl bg-[#7B2CBF] px-10 py-4 font-bold text-lg text-white shadow-lg shadow-purple-200 transition-all hover:bg-[#6a24a3]">
                View Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <div className="relative z-10 flex justify-center">
              <img
                alt="Shopping Illustration"
                className="w-full max-w-md rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
                src="https://picsum.photos/seed/hero-shopping/800/600"
              />
            </div>
            {/* Phone Mockup Overlay */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              className="absolute -right-10 -bottom-10 z-20 hidden w-64 md:block"
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <img
                alt="App Screen"
                className="w-full rounded-[2.5rem] border-8 border-white shadow-2xl"
                referrerPolicy="no-referrer"
                src="https://picsum.photos/seed/phone-app/400/800"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              className="relative flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <div className="absolute -z-10 h-[400px] w-[400px] animate-pulse rounded-full bg-pink-100" />
              <img
                alt="Features"
                className="h-[450px] w-[450px] rounded-full border-8 border-white object-cover shadow-2xl"
                referrerPolicy="no-referrer"
                src="https://picsum.photos/seed/features-woman/600/600"
              />
            </motion.div>

            <div>
              <SectionHeading
                centered={false}
                title="Key Features for Seamless Functionality"
              />
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    icon: Layout,
                    title: "User-Friendly Interface",
                    desc: "Intuitive and easy to navigate for all users.",
                  },
                  {
                    icon: CreditCard,
                    title: "Secure Payment Options",
                    desc: "Multiple secure payment gateways integrated.",
                  },
                  {
                    icon: Heart,
                    title: "Wishlists & Saved Items",
                    desc: "Allow users to save products for later.",
                  },
                  {
                    icon: MessageSquare,
                    title: "Community & Social Integration",
                    desc: "Connect with users through social platforms.",
                  },
                ].map((item, idx) => (
                  <motion.div
                    className="flex gap-4 rounded-xl p-4 transition-colors hover:bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    key={idx}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pink-50">
                      <item.icon className="h-6 w-6 text-pink-500" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-bold">{item.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* On-Demand Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="mb-6 font-extrabold text-4xl">
                On-Demand Ecommerce App Development
              </h2>
              <p className="mb-6 text-gray-600 leading-relaxed">
                E-commerce apps have transformed the landscape of online
                shopping. As more consumers turn to their smartphones for
                purchasing goods and services, having a robust e-commerce app is
                essential for businesses aiming to stay competitive and meet
                customer expectations.
              </p>
              <p className="mb-8 text-gray-600 leading-relaxed">
                At WorkHolo Labs, we specialize in transforming your business
                vision into a reality by crafting exceptional e-commerce
                applications. Our team of seasoned professionals is dedicated to
                deliver innovative and customized solutions that meet the unique
                needs of your business.
              </p>
            </motion.div>

            <motion.div
              className="relative flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-blue-100 opacity-50 blur-3xl" />
              <img
                alt="Phone Mockup"
                className="w-full max-w-xs rounded-[3rem] border-[12px] border-white shadow-2xl"
                referrerPolicy="no-referrer"
                src="https://picsum.photos/seed/phone-mockup-2/400/800"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="overflow-hidden bg-pink-400 py-20 text-white">
        <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-12 md:flex-row">
          <motion.h2
            className="text-center font-black text-4xl md:text-left md:text-5xl"
            initial={{ opacity: 0, x: -50 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            Custom E-Commerce <br /> Apps for All
          </motion.h2>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <img
              alt="Shopping Woman"
              className="h-72 w-72 rounded-full border-8 border-white/20 object-cover md:h-96 md:w-96"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/shopping-woman/500/500"
            />
          </motion.div>
        </div>
      </section>

      {/* Agency Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              className="relative flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <div className="absolute inset-0 -z-10 rounded-full bg-blue-50 blur-2xl" />
              <img
                alt="Ecommerce Agency"
                className="w-full max-w-sm rounded-[2.5rem] border-8 border-white shadow-2xl"
                referrerPolicy="no-referrer"
                src="https://picsum.photos/seed/ecommerce-agency/500/800"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="mb-6 font-extrabold text-4xl">
                E-commerce App Development Agency
              </h2>
              <p className="mb-8 text-gray-600 leading-relaxed">
                As a leading e-commerce app development agency, we bring years
                of experience and a team of skilled professionals to the table.
                Our holistic approach encompasses strategy, design, development,
                and maintenance, providing you with a comprehensive solution to
                meet your business objectives. Transform your e-commerce vision
                into reality with our custom app development services.
              </p>
              <div className="space-y-4">
                {[
                  "Expert Team of Developers",
                  "User-Centric Design Approach",
                  "Scalable and Secure Solutions",
                  "End-to-End Development Cycle",
                ].map((item, idx) => (
                  <div className="flex items-center gap-3" key={idx}>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                      <ChevronRight className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-semibold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            subtitle="Comprehensive E-commerce App Development Services to Empower Your Online Business."
            title="E-commerce App Development Services"
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Globe,
                title: "Easy to Navigate",
                desc: "Intuitive and user-friendly interfaces for seamless shopping experiences.",
              },
              {
                icon: CreditCard,
                title: "Integrated Payment Systems",
                desc: "Multiple secure payment options for a smooth checkout process.",
              },
              {
                icon: Smartphone,
                title: "Personalized Experience",
                desc: "Customization options tailored to individual customer preferences.",
              },
              {
                icon: Zap,
                title: "Feature-Rich",
                desc: "A comprehensive set of features that cater to a variety of business needs.",
              },
              {
                icon: Layout,
                title: "Easy to Manage",
                desc: "Streamlined back-end management for effortless store operation and monitoring.",
              },
              {
                icon: ShieldCheck,
                title: "Highly Secure",
                desc: "Robust security features to protect user data and transactions.",
              },
              {
                icon: Users,
                title: "Affordable Solutions",
                desc: "Cost-effective services that help you maximize your business potential.",
              },
              {
                icon: Smartphone,
                title: "Highly Responsive",
                desc: "Optimized for seamless use across all devices, ensuring a great user experience.",
              },
            ].map((service, idx) => (
              <motion.div
                className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                key={idx}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <service.icon className="h-8 w-8 text-[#007bff]" />
                </div>
                <h3 className="mb-3 font-bold text-lg">{service.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screens Section */}
      <section className="overflow-hidden bg-[#0a192f] py-24 text-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            dark
            subtitle="Enhancing User Experience with Intuitive & Engaging App Screens"
            title="App Screens"
          />
          <div className="scrollbar-hide flex flex-nowrap gap-6 overflow-x-auto pb-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                className="h-[580px] min-w-[280px] overflow-hidden rounded-[2.5rem] border-8 border-white/10 shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                key={i}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <img
                  alt={`App Screen ${i}`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  src={`https://picsum.photos/seed/screen-${i}/400/800`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Features (Tabs) */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            subtitle="Powerful and Innovative Features to Elevate Your Application Experience"
            title="Application Features"
          />

          <div className="mb-12 flex justify-center">
            <div className="flex gap-2 rounded-full bg-gray-100 p-1.5">
              {["Customer Panel", "Admin Panel", "Seller/Vendor Panel"].map(
                (tab) => (
                  <button
                    className={`rounded-full px-8 py-3 font-bold text-sm transition-all ${activeTab === tab ? "bg-white text-orange-500 shadow-md" : "text-gray-500 hover:text-gray-800"}`}
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              key={activeTab}
            >
              <img
                alt="Features Illustration"
                className="w-full rounded-2xl shadow-xl"
                referrerPolicy="no-referrer"
                src="https://picsum.photos/seed/features-books/600/400"
              />
              <div className="absolute -top-10 -left-10 -z-10 h-24 w-24 rounded-full bg-orange-100" />
            </motion.div>

            <div className="space-y-6">
              <h3 className="font-bold text-2xl text-[#1a1a1a]">
                {activeTab} Features
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Product Search & Filters",
                  "User Registration & Profiles",
                  "Shopping Cart & Checkout",
                  "Order Tracking",
                  "Push Notifications",
                  "Reviews & Ratings",
                  "Multiple Payment Options",
                  "Wishlist Functionality",
                ].map((feature, idx) => (
                  <div
                    className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                    key={idx}
                  >
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="font-medium text-gray-700 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            subtitle="Advanced Web Technologies for Scalable and High-Performance Applications"
            title="Technology We Use"
          />
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {[
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
                name: "Crashlytics",
                icon: "https://picsum.photos/seed/crashlytics/100/100",
              },
              {
                name: "Google Analytics",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
              },
              {
                name: "AWS",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
              },
            ].map((tech, idx) => (
              <motion.div
                className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                initial={{ opacity: 0, scale: 0.5 }}
                key={idx}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <img
                  alt={tech.name}
                  className="h-12 w-12 object-contain"
                  referrerPolicy="no-referrer"
                  src={tech.icon}
                />
                <span className="font-bold text-gray-600 text-xs">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeading title="FAQ's" />
          <div className="space-y-2">
            {[
              {
                q: "What services are included in ecommerce app development by WorkHolo Labs?",
                a: "We provide end-to-end services including UI/UX design, front-end and back-end development, payment gateway integration, and post-launch maintenance.",
              },
              {
                q: "How does WorkHolo Labs build scalable ecommerce applications for businesses?",
                a: "We use modern tech stacks like Flutter, Laravel, and AWS to ensure your app can handle growth and high traffic seamlessly.",
              },
              {
                q: "Why should businesses choose WorkHolo Labs for ecommerce app development?",
                a: "With years of experience and a track record of successful projects, we deliver high-quality, secure, and user-centric solutions.",
              },
              {
                q: "What features should a modern ecommerce app include?",
                a: "Key features include advanced search, secure checkout, real-time tracking, push notifications, and personalized recommendations.",
              },
              {
                q: "How long does it take to develop a fully functional ecommerce app?",
                a: "The timeline varies based on complexity, but typically ranges from 3 to 6 months for a comprehensive solution.",
              },
            ].map((faq, idx) => (
              <AccordionItem answer={faq.a} key={idx} question={faq.q} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-4">
        <motion.button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageSquare className="h-7 w-7" />
        </motion.button>
        <motion.button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#007bff] text-white shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-7 w-7 -rotate-90" />
        </motion.button>
      </div>
    </div>
  );
}
