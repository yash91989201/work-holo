import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ContactCard } from "@/components/shared/contact-card";

export const Route = createFileRoute("/contact-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative bg-background">
      {/* Full-width Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('/assets/hero-img.png')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.p
            className="mb-4 font-semibold text-primary text-sm uppercase tracking-[0.2em]"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            [ GET IN TOUCH ]
          </motion.p>
          <motion.h1
            className="font-bold font-heading text-4xl text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Have a project in mind or need expert guidance? Reach out and
            let&apos;s build something great together.
          </motion.p>
        </div>
      </section>

      {/* Contact Card Section */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ContactCard />
        </div>
      </section>
    </div>
  );
}
