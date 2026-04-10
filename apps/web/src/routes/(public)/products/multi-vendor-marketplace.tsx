import {
  IconBriefcase,
  IconChartBar,
  IconMinus,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconShoppingBag,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { type ClassValue, clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

export const Route = createFileRoute(
  "/(public)/products/multi-vendor-marketplace"
)({
  component: RouteComponent,
});

const Button = ({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "dark";
}) => {
  const variants = {
    primary: "bg-[#7B2CBF] text-white hover:bg-[#6a25a3]",
    secondary: "bg-[#FFC107] text-black hover:bg-[#e6ae06]",
    outline:
      "border-2 border-[#7B2CBF] text-[#7B2CBF] hover:bg-[#7B2CBF] hover:text-white",
    dark: "bg-[#0A0A0A] text-white hover:bg-gray-800",
  };

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const SectionHeading = ({
  children,
  className,
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) => (
  <h2
    className={cn(
      "mb-8 text-center font-extrabold text-[40px] leading-tight",
      light ? "text-white" : "text-[#7B2CBF]",
      className
    )}
  >
    {children}
  </h2>
);

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4 border-gray-200 border-b last:border-0">
      <button
        className="group flex w-full items-center justify-between py-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-gray-800 text-lg transition-colors group-hover:text-[#7B2CBF]">
          {question}
        </span>
        <div className="rounded-full bg-gray-100 p-2 transition-all group-hover:bg-[#7B2CBF] group-hover:text-white">
          <IconMinus size={20} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
          >
            <p className="pb-6 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function RouteComponent() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#7B2CBF] selection:text-white">
      <section className="relative overflow-hidden bg-[#F3E8FF] px-4 pt-20 pb-32 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h1 className="mb-6 font-black text-[56px] text-gray-900 leading-[1.1]">
              Transform Your eCommerce Vision with a{" "}
              <span className="text-[#7B2CBF]">Multi-Vendor Marketplace</span>
            </h1>
            <div className="flex gap-4">
              <Button className="px-10" variant="secondary">
                VIEW DEMO
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <img
              alt="Marketplace Illustration"
              className="h-auto w-full rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/marketplace/800/600"
            />
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="bg-white px-4 py-24 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <SectionHeading>
              Multi Vendor Ecommerce App Development
            </SectionHeading>
            <p className="mb-12 text-gray-600 text-lg leading-relaxed">
              Welcome to the future of eCommerce! At WorkHolo Labs, we
              specialize in creating innovative, scalable multi-vendor
              marketplace solutions that empower businesses to thrive in the
              digital marketplace. Whether you're looking to build a new online
              marketplace or scale an existing one, our expert team delivers
              custom eCommerce app development tailored to your unique needs.
              With our comprehensive vendor management system and cloud-based
              infrastructure, we ensure a seamless experience for both vendors
              and customers alike.
            </p>
            <div className="rounded-[40px] border border-purple-100 bg-[#F3E8FF] p-10">
              <h3 className="mb-6 font-bold text-2xl text-[#7B2CBF]">
                Ready to transform your business? Contact us today for a free
                consultation!
              </h3>
              <Button
                className="mx-auto px-12 py-4 text-lg"
                variant="secondary"
              >
                Request A Quote
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Section */}
      <section className="overflow-hidden bg-white px-4 py-24 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <img
              alt="App Mockup 1"
              className="w-1/2 rounded-[40px] shadow-xl"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/phone1/400/800"
            />
            <img
              alt="App Mockup 2"
              className="mt-12 w-1/2 rounded-[40px] shadow-xl"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/phone2/400/800"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="mb-6 font-extrabold text-[#7B2CBF] text-[40px] leading-tight">
              What is a Multi-Vendor Marketplace?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              A multi-vendor marketplace is a dynamic online platform where
              multiple vendors can sell their products or services under one
              roof. Unlike traditional eCommerce stores, a multi-vendor platform
              allows for diverse product offerings and shared management
              responsibilities. Our marketplace software development services
              enable you to create an ecosystem that brings together vendors,
              buyers, and administrators in a cohesive, user-friendly
              environment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-[#F9FAFB] px-4 py-24 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="mb-6 font-extrabold text-[#7B2CBF] text-[40px] leading-tight">
              Why Choose a Multi-Vendor Model?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Opting for a multi-vendor marketplace offers several advantages,
              including scalability, a wide variety of products, and reduced
              operational costs. This model supports multi-currency transactions
              and multi-language interfaces, making it ideal for businesses
              targeting global audiences. Whether you're looking to develop a
              mobile app for eCommerce or an integrated online marketplace, our
              solutions are designed to meet your specific business objectives.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <img
              alt="App Mockup 3"
              className="mx-auto w-full max-w-md rounded-[40px] shadow-2xl"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/phone3/500/900"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>
            Features of Our Multi-Vendor eCommerce Solutions
          </SectionHeading>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Vendor Management System",
                desc: "Our multi-vendor platform streamlines vendor onboarding, product management, and sales tracking through a robust vendor dashboard.",
                icon: <IconUsers className="text-[#7B2CBF]" size={40} />,
              },
              {
                title: "Customizable User Interfaces",
                desc: "We provide custom eCommerce designs for websites and apps, delivering a seamless and intuitive user experience across all devices.",
                icon: <IconSettings className="text-[#7B2CBF]" size={40} />,
              },
              {
                title: "Advanced Search & Filter Options",
                desc: "Enhance user engagement with customizable search and filtering options, making it easy for customers to find exactly what they need.",
                icon: <IconSearch className="text-[#7B2CBF]" size={40} />,
              },
              {
                title: "Secure Payment Gateways",
                desc: "Our multi-seller eCommerce app ensures secure, seamless transactions with multiple payment gateways and support for multi-currency payments.",
                icon: <IconShieldCheck className="text-[#7B2CBF]" size={40} />,
              },
              {
                title: "Ratings & Reviews",
                desc: "Boost trust and credibility with our integrated ratings and reviews system, enabling customer feedback to guide vendors and inform future buyers.",
                icon: <IconStar className="text-[#7B2CBF]" size={40} />,
              },
              {
                title: "Analytics & Reporting for eCommerce",
                desc: "Boost trust and credibility with our integrated ratings and reviews system, enabling customer feedback to guide vendors and inform future buyers.",
                icon: <IconChartBar className="text-[#7B2CBF]" size={40} />,
              },
            ].map((feature, idx) => (
              <motion.div
                className="group flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                key={idx}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6 rounded-2xl bg-purple-50 p-4 transition-colors group-hover:bg-[#7B2CBF] group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="mb-4 font-bold text-gray-800 text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Models Section */}
      <section className="bg-[#7B2CBF] px-4 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading light>Business Models We Support</SectionHeading>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "B2C (Business To Consumer)",
                desc: "Our multi-vendor marketplace solutions are perfect for businesses selling directly to consumers. The platform supports a wide range of products and services, making it easy to scale as your customer base grows.",
                icon: <IconShoppingBag size={48} />,
              },
              {
                title: "B2B (Business To Business)",
                desc: "We also specialize in developing B2B multi-vendor platforms that connect businesses with suppliers and manufacturers. This model is ideal for companies looking to streamline their procurement processes.",
                icon: <IconBriefcase size={48} />,
              },
              {
                title: "C2C (Consumer To Consumer)",
                desc: "Our C2C marketplaces facilitate peer-to-peer transactions, providing a platform where individuals can buy and sell goods directly to each other. This model is popular for resale and second-hand marketplaces.",
                icon: <IconUsers size={48} />,
              },
            ].map((model, idx) => (
              <motion.div
                className="flex flex-col items-center rounded-[40px] bg-white p-10 text-center shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                key={idx}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                  {model.icon}
                </div>
                <h3 className="mb-6 font-bold text-gray-800 text-xl">
                  {model.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{model.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process Section */}
      <section className="bg-white px-4 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>Our Development Process</SectionHeading>
          <div className="relative mt-20 flex flex-col items-center gap-12 lg:flex-row">
            <div className="flex-1 space-y-12">
              <motion.div
                className="text-right"
                initial={{ opacity: 0, x: -30 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <h3 className="mb-2 font-bold text-2xl text-[#7B2CBF]">
                  Discovery and Planning
                </h3>
                <p className="text-gray-600">
                  We collaborate to craft a tailored project roadmap,
                  positioning your multi-vendor marketplace for success through
                  market research and strategic planning.
                </p>
              </motion.div>
              <motion.div
                className="text-right"
                initial={{ opacity: 0, x: -30 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <h3 className="mb-2 font-bold text-2xl text-[#7B2CBF]">
                  Design and Development
                </h3>
                <p className="text-gray-600">
                  We design and develop a secure, scalable eCommerce platform
                  with custom features like vendor dashboards, mobile app
                  integration, and cloud-based solutions for seamless user
                  experiences.
                </p>
              </motion.div>
            </div>

            <div className="flex w-full justify-center lg:w-1/3">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <img
                  alt="Process Mockup"
                  className="w-64 rounded-[40px] shadow-2xl"
                  referrerPolicy="no-referrer"
                  src="https://picsum.photos/seed/process/400/800"
                />
              </motion.div>
            </div>

            <div className="flex-1 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <h3 className="mb-2 font-bold text-2xl text-[#7B2CBF]">
                  Testing and Launch
                </h3>
                <p className="text-gray-600">
                  We rigorously test the platform for performance and security,
                  providing full support to ensure a seamless transition from
                  development to launch.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <h3 className="mb-2 font-bold text-2xl text-[#7B2CBF]">
                  Post-Launch Support
                </h3>
                <p className="text-gray-600">
                  We provide ongoing maintenance, updates, and scaling options,
                  ensuring your marketplace operates at peak performance while
                  supporting feature additions and regional expansions.
                </p>
              </motion.div>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Button className="mx-auto px-12 py-4" variant="secondary">
              Start Your Multi-Vendor Marketplace Today!
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#F9FAFB] px-4 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading>Frequently Asked Questions</SectionHeading>
          <div className="mt-12 rounded-[40px] bg-white p-8 shadow-sm">
            <FAQItem
              answer="A multi-vendor eCommerce app is a platform where multiple independent sellers can list and sell their products. The platform owner manages the overall marketplace, while vendors handle their own inventory and orders."
              question="What is a multi-vendor eCommerce app?"
            />
            <FAQItem
              answer="Key features include vendor dashboards, product management, order tracking, commission management, secure payments, and customer reviews."
              question="What are the key features of a multi-vendor eCommerce app?"
            />
            <FAQItem
              answer="Development time varies based on complexity, but typically ranges from 3 to 6 months for a fully functional, custom solution."
              question="How long does it take to develop a multi-vendor eCommerce app?"
            />
            <FAQItem
              answer="Yes, we support integration with all major payment gateways like Stripe, PayPal, Razorpay, and more to ensure secure transactions."
              question="Can I integrate third-party payment gateways into the app?"
            />
            <FAQItem
              answer="We offer comprehensive post-launch support including bug fixes, performance optimization, security updates, and feature enhancements."
              question="What kind of support and maintenance services do you offer after app launch?"
            />
          </div>
        </div>
      </section>

      {/* Footer */}

      {/* Floating WhatsApp */}
      <a
        className="group fixed right-8 bottom-8 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-2xl transition-transform hover:scale-110"
        href="https://wa.me/919390683154"
        rel="noopener noreferrer"
        target="_blank"
      >
        <img
          alt="WhatsApp"
          className="h-10 w-10"
          referrerPolicy="no-referrer"
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        />
      </a>
    </div>
  );
}
