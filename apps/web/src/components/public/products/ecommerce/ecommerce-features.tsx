import {
  IconCreditCard,
  IconHeart,
  IconLayout,
  IconMessage2,
} from "@tabler/icons-react";
import { motion } from "motion/react";

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

export default function EcommerceFeatures() {
  return (
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
                  icon: IconLayout,
                  title: "User-Friendly Interface",
                  desc: "Intuitive and easy to navigate for all users.",
                },
                {
                  icon: IconCreditCard,
                  title: "Secure Payment Options",
                  desc: "Multiple secure payment gateways integrated.",
                },
                {
                  icon: IconHeart,
                  title: "Wishlists & Saved Items",
                  desc: "Allow users to save products for later.",
                },
                {
                  icon: IconMessage2,
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
  );
}
